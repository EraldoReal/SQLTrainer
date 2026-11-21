import initSqlJs, { type Database, type SqlJsStatic, type SqlValue } from 'sql.js';
import type {
  ColumnInfo,
  ForeignKeyRef,
  QueryResult,
  SqlDialect,
  TableSchema,
} from '@/types/sql';
import {
  preprocessMySqlQuery,
  registerMySqlFunctions,
  splitSqlStatements,
} from './mysqlCompat';

let cachedSqlJsPromise: Promise<SqlJsStatic> | null = null;

function isNodeEnvironment(): boolean {
  const nodeProcess = (
    globalThis as { process?: { versions?: { node?: string } } }
  ).process;
  return (
    typeof window === 'undefined' ||
    Boolean(nodeProcess?.versions?.node)
  );
}

function resolveWasmFile(file: string): string {
  if (isNodeEnvironment()) {
    return `node_modules/sql.js/dist/${file}`;
  }
  return `/wasm/${file}`;
}

async function getSqlJs(): Promise<SqlJsStatic> {
  if (!cachedSqlJsPromise) {
    const loader =
      typeof initSqlJs === 'function'
        ? initSqlJs
        : (initSqlJs as unknown as { default: typeof initSqlJs }).default;

    cachedSqlJsPromise = loader({
      locateFile: resolveWasmFile,
    });
  }
  return cachedSqlJsPromise;
}

function escapeIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function formatSqlLiteral(value: SqlValue): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL';
  }
  if (value instanceof Uint8Array) {
    const hex = Array.from(value)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `X'${hex}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function createDatabase(sqlJs: SqlJsStatic, data?: Uint8Array): Database {
  const db = data ? new sqlJs.Database(data) : new sqlJs.Database();
  registerMySqlFunctions(db);
  try {
    db.run('PRAGMA foreign_keys = ON;');
  } catch {
    // Ignore pragma failures
  }
  return db;
}

function isRowModifyingStatement(sql: string): boolean {
  const stripped = sql
    .replace(/^(?:\s+|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)+/, '')
    .trimStart();
  return /^(?:INSERT|UPDATE|DELETE|REPLACE)\b/i.test(stripped);
}

export class SqlEngine {
  private sqlJs: SqlJsStatic | null;
  private db: Database | null = null;
  private dbName: string;

  constructor(dbName = 'sql_trainer', preloadedSqlJs: SqlJsStatic | null = null) {
    this.dbName = dbName;
    this.sqlJs = preloadedSqlJs;
  }

  public setDatabaseName(name: string): void {
    this.dbName = name || 'sql_trainer';
  }

  public async init(): Promise<void> {
    if (!this.sqlJs) {
      this.sqlJs = await getSqlJs();
    }
    if (!this.db) {
      this.db = createDatabase(this.sqlJs);
    }
  }

  private ensureDb(): Database {
    if (!this.db || !this.sqlJs) {
      throw new Error('SqlEngine is not initialized. Call init() first.');
    }
    return this.db;
  }

  public loadSql(sql: string, dialect: SqlDialect = 'mysql'): void {
    if (!this.sqlJs) {
      throw new Error('SqlEngine is not initialized. Call init() first.');
    }
    // Build the new database first so a failing script never destroys the current one.
    const next = createDatabase(this.sqlJs);
    try {
      const statements = splitSqlStatements(sql, dialect === 'mysql');
      for (const stmt of statements) {
        if (dialect === 'mysql') {
          const preprocessed = preprocessMySqlQuery(stmt, this.dbName);
          if (preprocessed.type === 'sql') {
            next.run(preprocessed.sql);
          }
        } else {
          next.run(stmt);
        }
      }
    } catch (err) {
      next.close();
      throw err;
    }
    if (this.db) {
      this.db.close();
    }
    this.db = next;
  }

  public loadBinary(uint8Array: Uint8Array): void {
    if (!this.sqlJs) {
      throw new Error('SqlEngine is not initialized. Call init() first.');
    }
    const next = createDatabase(this.sqlJs, uint8Array);
    try {
      next.exec('SELECT count(*) FROM sqlite_master;');
    } catch (err) {
      next.close();
      throw err;
    }
    if (this.db) {
      this.db.close();
    }
    this.db = next;
  }

  public exportBinary(): Uint8Array {
    const db = this.ensureDb();
    return db.export();
  }

  public exportSql(): string {
    const db = this.ensureDb();
    const lines: string[] = [];

    const schemaRes = db.exec(
      "SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 ELSE 2 END, rowid;"
    );

    const tableNames: string[] = [];
    if (schemaRes.length > 0) {
      for (const row of schemaRes[0].values) {
        const objType = String(row[0]);
        const objName = String(row[1]);
        const ddl = String(row[2]);
        lines.push(`${ddl.replace(/;+\s*$/, '')};`);
        if (objType === 'table') {
          tableNames.push(objName);
        }
      }
    }

    for (const table of tableNames) {
      const dataRes = db.exec(`SELECT * FROM ${escapeIdentifier(table)};`);
      if (dataRes.length > 0 && dataRes[0].values.length > 0) {
        lines.push('');
        const escapedTable = escapeIdentifier(table);
        for (const row of dataRes[0].values) {
          const vals = row.map(formatSqlLiteral).join(', ');
          lines.push(`INSERT INTO ${escapedTable} VALUES (${vals});`);
        }
      }
    }

    return lines.join('\n');
  }

  public execute(sql: string, dialect: SqlDialect = 'sqlite'): QueryResult[] {
    const db = this.ensureDb();
    const statements = splitSqlStatements(sql, dialect === 'mysql');
    const results: QueryResult[] = [];

    for (const stmt of statements) {
      const start = performance.now();

      if (dialect === 'mysql') {
        const preprocessed = preprocessMySqlQuery(stmt, this.dbName);
        if (preprocessed.type === 'describe') {
          const describeResult = this.buildDescribeResult(db, preprocessed.table, start);
          results.push(describeResult);
          continue;
        }
        this.executeSqlStatement(db, preprocessed.sql, start, results);
      } else {
        this.executeSqlStatement(db, stmt, start, results);
      }
    }

    return results;
  }

  private executeSqlStatement(
    db: Database,
    sql: string,
    startTime: number,
    out: QueryResult[]
  ): void {
    // sql.js returns no result set for SELECTs with zero rows, so detect columns up front.
    let columnNames: string[] = [];
    try {
      const probe = db.prepare(sql);
      try {
        columnNames = probe.getColumnNames();
      } finally {
        probe.free();
      }
    } catch {
      // Let exec() below report the real error
    }

    const execResults = db.exec(sql);
    const executionTimeMs = Math.max(0, performance.now() - startTime);

    if (execResults.length === 0) {
      if (columnNames.length > 0) {
        out.push({
          columns: columnNames,
          values: [],
          rowCount: 0,
          executionTimeMs,
        });
        return;
      }
      out.push({
        columns: [],
        values: [],
        rowCount: 0,
        affectedRows: isRowModifyingStatement(sql) ? db.getRowsModified() : 0,
        executionTimeMs,
      });
      return;
    }

    for (const r of execResults) {
      out.push({
        columns: r.columns,
        values: r.values,
        rowCount: r.values.length,
        executionTimeMs,
      });
    }
  }

  private buildDescribeResult(
    db: Database,
    table: string,
    startTime: number
  ): QueryResult {
    const escaped = escapeIdentifier(table);
    const infoRes = db.exec(`PRAGMA table_info(${escaped});`);
    if (infoRes.length === 0 || infoRes[0].values.length === 0) {
      throw new Error(`Table '${table}' doesn't exist`);
    }

    const fkRes = db.exec(`PRAGMA foreign_key_list(${escaped});`);
    const fkCols = new Set<string>();
    if (fkRes.length > 0) {
      for (const row of fkRes[0].values) {
        if (row[3] !== null && row[3] !== undefined) {
          fkCols.add(String(row[3]));
        }
      }
    }

    const ddlRes = db.exec(
      `SELECT sql FROM sqlite_master WHERE type='table' AND lower(name)=lower(${formatSqlLiteral(table)});`
    );
    const ddlSql =
      ddlRes.length > 0 && ddlRes[0].values.length > 0 && ddlRes[0].values[0][0]
        ? String(ddlRes[0].values[0][0])
        : '';
    const hasAutoIncrement = /\bAUTOINCREMENT\b/i.test(ddlSql);

    const rows: SqlValue[][] = infoRes[0].values.map((col) => {
      const name = String(col[1] ?? '');
      const type = String(col[2] || 'TEXT');
      const notNull = Number(col[3]) === 1;
      const dfltValue = col[4] ?? null;
      const pk = Number(col[5]) > 0;

      const key = pk ? 'PRI' : fkCols.has(name) ? 'MUL' : '';
      const extra = pk && hasAutoIncrement ? 'auto_increment' : '';
      const nullable = notNull || pk ? 'NO' : 'YES';

      return [name, type, nullable, key, dfltValue, extra];
    });

    const executionTimeMs = Math.max(0, performance.now() - startTime);
    return {
      columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
      values: rows,
      rowCount: rows.length,
      executionTimeMs,
    };
  }

  public getSchema(): TableSchema[] {
    const db = this.ensureDb();
    const tablesRes = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );

    if (tablesRes.length === 0) {
      return [];
    }

    return tablesRes[0].values.map((row) => {
      const tableName = String(row[0]);
      const escaped = escapeIdentifier(tableName);

      const fkRes = db.exec(`PRAGMA foreign_key_list(${escaped});`);
      const fkMap = new Map<string, ForeignKeyRef>();
      if (fkRes.length > 0) {
        for (const fkRow of fkRes[0].values) {
          const fromCol = String(fkRow[3] ?? '');
          const refTable = String(fkRow[2] ?? '');
          const refCol = String(fkRow[4] ?? '');
          if (fromCol && refTable) {
            fkMap.set(fromCol, { table: refTable, column: refCol });
          }
        }
      }

      const infoRes = db.exec(`PRAGMA table_info(${escaped});`);
      const columns: ColumnInfo[] =
        infoRes.length > 0
          ? infoRes[0].values.map((col) => {
              const colName = String(col[1] ?? '');
              const fk = fkMap.get(colName);
              return {
                name: colName,
                type: String(col[2] || 'TEXT'),
                notNull: Number(col[3]) === 1,
                primaryKey: Number(col[5]) > 0,
                defaultValue:
                  col[4] === null || col[4] === undefined ? null : String(col[4]),
                ...(fk ? { foreignKey: fk } : {}),
              };
            })
          : [];

      return {
        name: tableName,
        columns,
      };
    });
  }

  public cloneDatabase(): SqlEngine {
    const snapshot = this.exportBinary();
    const clone = new SqlEngine(this.dbName, this.sqlJs);
    clone.loadBinary(snapshot);
    return clone;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
