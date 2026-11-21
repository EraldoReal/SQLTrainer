import type { SqlDialect } from '@/types/sql';

export type ErdCardinality = '1:1' | '1:N' | 'N:M';

export interface ErdColumn {
  id: string;
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  notNull: boolean;
  unique: boolean;
}

export interface ErdEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: ErdColumn[];
}

export interface ErdRelation {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  cardinality: ErdCardinality;
  label?: string;
}

export interface ErdModel {
  entities: ErdEntity[];
  relations: ErdRelation[];
}

export const DEFAULT_ERD_MODEL: ErdModel = {
  entities: [
    {
      id: 'ent_autor',
      name: 'autor',
      x: 80,
      y: 90,
      columns: [
        {
          id: 'col_autor_id',
          name: 'id',
          type: 'INT',
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
          unique: false,
        },
        {
          id: 'col_autor_name',
          name: 'name',
          type: 'VARCHAR(120)',
          primaryKey: false,
          autoIncrement: false,
          notNull: true,
          unique: false,
        },
        {
          id: 'col_autor_land',
          name: 'land',
          type: 'VARCHAR(80)',
          primaryKey: false,
          autoIncrement: false,
          notNull: false,
          unique: false,
        },
      ],
    },
    {
      id: 'ent_buch',
      name: 'buch',
      x: 470,
      y: 90,
      columns: [
        {
          id: 'col_buch_id',
          name: 'id',
          type: 'INT',
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
          unique: false,
        },
        {
          id: 'col_buch_titel',
          name: 'titel',
          type: 'VARCHAR(200)',
          primaryKey: false,
          autoIncrement: false,
          notNull: true,
          unique: false,
        },
        {
          id: 'col_buch_jahr',
          name: 'erscheinungsjahr',
          type: 'INT',
          primaryKey: false,
          autoIncrement: false,
          notNull: false,
          unique: false,
        },
        {
          id: 'col_buch_isbn',
          name: 'isbn',
          type: 'VARCHAR(20)',
          primaryKey: false,
          autoIncrement: false,
          notNull: false,
          unique: true,
        },
      ],
    },
  ],
  relations: [
    {
      id: 'rel_autor_buch',
      fromEntityId: 'ent_autor',
      toEntityId: 'ent_buch',
      cardinality: '1:N',
      label: 'schreibt',
    },
  ],
};

const RESERVED_WORDS = new Set([
  'add', 'all', 'alter', 'and', 'as', 'asc', 'between', 'by', 'case', 'check', 'column',
  'constraint', 'create', 'cross', 'default', 'delete', 'desc', 'distinct', 'drop', 'else',
  'exists', 'foreign', 'from', 'full', 'group', 'having', 'in', 'index', 'inner', 'insert',
  'into', 'is', 'join', 'key', 'left', 'like', 'limit', 'not', 'null', 'on', 'or', 'order',
  'outer', 'primary', 'references', 'right', 'select', 'set', 'table', 'then', 'to', 'union',
  'unique', 'update', 'values', 'when', 'where', 'rank', 'rows', 'range', 'row', 'interval',
]);

function transliterate(input: string): string {
  return input
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function sanitizeIdentifier(name: string, fallback: string): string {
  const cleaned = transliterate(name.trim())
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_]/g, '');
  if (!cleaned) return fallback;
  return /^[0-9]/.test(cleaned) ? `t_${cleaned}` : cleaned;
}

function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (!RESERVED_WORDS.has(name.toLowerCase())) return name;
  return dialect === 'mysql' ? `\`${name}\`` : `"${name}"`;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

/**
 * Validates and normalizes untrusted ER model data (localStorage / JSON import).
 * Returns null if the structure is unusable.
 */
export function normalizeErdModel(input: unknown): ErdModel | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as { entities?: unknown; relations?: unknown };
  if (!Array.isArray(raw.entities) || !Array.isArray(raw.relations)) return null;

  const entities: ErdEntity[] = [];
  for (const item of raw.entities) {
    if (!item || typeof item !== 'object') return null;
    const e = item as Record<string, unknown>;
    if (typeof e.id !== 'string' || !e.id || !Array.isArray(e.columns)) return null;
    const columns: ErdColumn[] = [];
    for (const colItem of e.columns) {
      if (!colItem || typeof colItem !== 'object') return null;
      const c = colItem as Record<string, unknown>;
      if (typeof c.id !== 'string' || !c.id) return null;
      columns.push({
        id: c.id,
        name: asString(c.name, ''),
        type: asString(c.type, 'VARCHAR(255)'),
        primaryKey: c.primaryKey === true,
        autoIncrement: c.autoIncrement === true,
        notNull: c.notNull === true,
        unique: c.unique === true,
      });
    }
    entities.push({
      id: e.id,
      name: asString(e.name, ''),
      x: typeof e.x === 'number' && Number.isFinite(e.x) ? e.x : 80,
      y: typeof e.y === 'number' && Number.isFinite(e.y) ? e.y : 80,
      columns,
    });
  }

  const relations: ErdRelation[] = [];
  for (const item of raw.relations) {
    if (!item || typeof item !== 'object') return null;
    const r = item as Record<string, unknown>;
    if (
      typeof r.id !== 'string' ||
      typeof r.fromEntityId !== 'string' ||
      typeof r.toEntityId !== 'string' ||
      (r.cardinality !== '1:1' && r.cardinality !== '1:N' && r.cardinality !== 'N:M')
    ) {
      return null;
    }
    relations.push({
      id: r.id,
      fromEntityId: r.fromEntityId,
      toEntityId: r.toEntityId,
      cardinality: r.cardinality,
      ...(typeof r.label === 'string' && r.label ? { label: r.label } : {}),
    });
  }

  return { entities, relations };
}

function mapTypeForDialect(rawType: string, dialect: SqlDialect): string {
  const upper = rawType.trim().toUpperCase() || 'VARCHAR(255)';
  if (dialect === 'mysql') {
    return upper;
  }

  // SQLite affinity mapping
  if (/^(?:INT|INTEGER|BIGINT|SMALLINT|TINYINT|MEDIUMINT)(?:\(\d+\))?$/.test(upper)) {
    return 'INTEGER';
  }
  if (/^(?:BOOL|BOOLEAN)$/.test(upper)) {
    return 'INTEGER';
  }
  if (/^(?:DECIMAL|NUMERIC)(?:\(\d+(?:,\s*\d+)?\))?$/.test(upper)) {
    return 'REAL';
  }
  if (/^(?:FLOAT|DOUBLE|REAL)$/.test(upper)) {
    return 'REAL';
  }
  if (/^(?:VARCHAR|CHAR|NVARCHAR)\(\d+\)$/.test(upper)) {
    return 'TEXT';
  }
  if (/^(?:TEXT|LONGTEXT|MEDIUMTEXT|TINYTEXT|DATE|DATETIME|TIMESTAMP)$/.test(upper)) {
    return 'TEXT';
  }
  if (upper === 'BLOB') {
    return 'BLOB';
  }
  return upper;
}

function isIntegerType(rawType: string): boolean {
  return /^(?:INT|INTEGER|BIGINT|SMALLINT|TINYINT|MEDIUMINT)(?:\(\d+\))?$/i.test(
    rawType.trim()
  );
}

function getPrimaryKeyColumn(entity: ErdEntity): { name: string; type: string; implicit: boolean } {
  const pkCol = entity.columns.find((c) => c.primaryKey);
  if (pkCol) {
    return {
      name: sanitizeIdentifier(pkCol.name, 'id'),
      type: pkCol.type || 'INT',
      implicit: false,
    };
  }
  // Entity has no primary key: an implicit surrogate key is generated.
  const taken = new Set(entity.columns.map((c) => sanitizeIdentifier(c.name, '').toLowerCase()));
  return { name: taken.has('id') ? 'pk_id' : 'id', type: 'INT', implicit: true };
}

/**
 * Topologically orders entities so referenced (parent) tables appear before
 * referencing (child) tables for 1:1 and 1:N relationships.
 */
function sortEntitiesByDependencies(
  entities: ErdEntity[],
  relations: ErdRelation[]
): ErdEntity[] {
  const entityMap = new Map<string, ErdEntity>();
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const e of entities) {
    entityMap.set(e.id, e);
    inDegree.set(e.id, 0);
    dependents.set(e.id, []);
  }

  for (const rel of relations) {
    if (rel.cardinality === 'N:M') continue;
    if (rel.fromEntityId === rel.toEntityId) continue;
    if (!entityMap.has(rel.fromEntityId) || !entityMap.has(rel.toEntityId)) continue;

    // toEntity depends on fromEntity
    dependents.get(rel.fromEntityId)!.push(rel.toEntityId);
    inDegree.set(rel.toEntityId, (inDegree.get(rel.toEntityId) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const e of entities) {
    if ((inDegree.get(e.id) ?? 0) === 0) {
      queue.push(e.id);
    }
  }

  const sorted: ErdEntity[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const ent = entityMap.get(id);
    if (ent) sorted.push(ent);

    for (const depId of dependents.get(id) ?? []) {
      const nextDeg = (inDegree.get(depId) ?? 1) - 1;
      inDegree.set(depId, nextDeg);
      if (nextDeg <= 0 && !visited.has(depId)) {
        queue.push(depId);
      }
    }
  }

  // Append any remaining entities involved in cycles
  for (const e of entities) {
    if (!visited.has(e.id)) {
      sorted.push(e);
    }
  }

  return sorted;
}

interface GeneratedFk {
  columnName: string;
  columnType: string;
  notNull: boolean;
  unique: boolean;
  refTable: string;
  refColumn: string;
}

export function generateSqlFromErd(
  entities: ErdEntity[],
  relations: ErdRelation[],
  dialect: SqlDialect
): string {
  if (entities.length === 0) {
    return '-- Noch keine Tabellen im ER-Modell vorhanden.';
  }

  const q = (name: string) => quoteIdentifier(name, dialect);
  const orderedEntities = sortEntitiesByDependencies(entities, relations);
  const entityById = new Map<string, ErdEntity>();
  const tableNameById = new Map<string, string>();
  const usedTableNames = new Set<string>();

  for (let i = 0; i < orderedEntities.length; i++) {
    const ent = orderedEntities[i];
    const baseName = sanitizeIdentifier(ent.name, `tabelle_${i + 1}`);
    let uniqueName = baseName;
    let suffix = 2;
    while (usedTableNames.has(uniqueName.toLowerCase())) {
      uniqueName = `${baseName}_${suffix++}`;
    }
    usedTableNames.add(uniqueName.toLowerCase());
    entityById.set(ent.id, ent);
    tableNameById.set(ent.id, uniqueName);
  }

  // Collect FKs added to each target entity from 1:1 and 1:N relations
  const fksByEntityId = new Map<string, GeneratedFk[]>();
  for (const ent of orderedEntities) {
    fksByEntityId.set(ent.id, []);
  }

  for (const rel of relations) {
    if (rel.cardinality === 'N:M') continue;
    const fromEnt = entityById.get(rel.fromEntityId);
    const toEnt = entityById.get(rel.toEntityId);
    if (!fromEnt || !toEnt) continue;

    const fromTable = tableNameById.get(fromEnt.id)!;
    const fromPk = getPrimaryKeyColumn(fromEnt);
    const fkBaseName = `${fromTable}_${fromPk.name}`;

    const existingFks = fksByEntityId.get(toEnt.id)!;
    let fkColName = fkBaseName;
    // Avoid colliding with another generated FK on the same table (e.g. multiple relations between same tables)
    if (existingFks.some((f) => f.columnName.toLowerCase() === fkColName.toLowerCase())) {
      let idx = 2;
      while (existingFks.some((f) => f.columnName.toLowerCase() === `${fkBaseName}_${idx}`.toLowerCase())) {
        idx++;
      }
      fkColName = `${fkBaseName}_${idx}`;
    }

    existingFks.push({
      columnName: fkColName,
      columnType: fromPk.type,
      notNull: true,
      unique: rel.cardinality === '1:1',
      refTable: fromTable,
      refColumn: fromPk.name,
    });
  }

  const statements: string[] = [];

  const needsImplicitPk = new Set<string>();
  for (const rel of relations) {
    for (const id of [rel.fromEntityId, rel.toEntityId]) {
      if (rel.cardinality === 'N:M' || id === rel.fromEntityId) {
        const ent = entityById.get(id);
        if (ent && !ent.columns.some((c) => c.primaryKey)) needsImplicitPk.add(id);
      }
    }
  }

  for (const ent of orderedEntities) {
    const tableName = tableNameById.get(ent.id)!;
    const pkCols = ent.columns.filter((c) => c.primaryKey);
    const hasSinglePk = pkCols.length === 1;
    const lines: string[] = [];
    const existingColNames = new Set<string>();

    if (needsImplicitPk.has(ent.id)) {
      const implicitPk = getPrimaryKeyColumn(ent);
      existingColNames.add(implicitPk.name.toLowerCase());
      lines.push(
        dialect === 'sqlite'
          ? `  ${q(implicitPk.name)} INTEGER PRIMARY KEY AUTOINCREMENT`
          : `  ${q(implicitPk.name)} INT NOT NULL AUTO_INCREMENT PRIMARY KEY`
      );
    }

    for (let cIdx = 0; cIdx < ent.columns.length; cIdx++) {
      const col = ent.columns[cIdx];
      const colName = sanitizeIdentifier(col.name, `spalte_${cIdx + 1}`);
      existingColNames.add(colName.toLowerCase());

      // Check if a generated FK targets this exact column name
      const matchingFk = (fksByEntityId.get(ent.id) ?? []).find(
        (fk) => fk.columnName.toLowerCase() === colName.toLowerCase()
      );

      if (hasSinglePk && col.primaryKey && col.autoIncrement) {
        if (dialect === 'sqlite') {
          lines.push(`  ${q(colName)} INTEGER PRIMARY KEY AUTOINCREMENT`);
        } else {
          const mysqlIntType = isIntegerType(col.type) ? mapTypeForDialect(col.type, dialect) : 'INT';
          lines.push(`  ${q(colName)} ${mysqlIntType} NOT NULL AUTO_INCREMENT PRIMARY KEY`);
        }
        continue;
      }

      const parts: string[] = [q(colName), mapTypeForDialect(col.type, dialect)];

      if (hasSinglePk && col.primaryKey) {
        parts.push('PRIMARY KEY');
      }
      if (col.notNull || (col.primaryKey && !hasSinglePk)) {
        parts.push('NOT NULL');
      }
      if ((col.unique || matchingFk?.unique) && !col.primaryKey) {
        parts.push('UNIQUE');
      }

      lines.push(`  ${parts.join(' ')}`);
    }

    // Add generated FK columns that are not already present on the entity
    const fks = fksByEntityId.get(ent.id) ?? [];
    for (const fk of fks) {
      if (!existingColNames.has(fk.columnName.toLowerCase())) {
        existingColNames.add(fk.columnName.toLowerCase());
        const parts: string[] = [q(fk.columnName), mapTypeForDialect(fk.columnType, dialect)];
        if (fk.notNull) parts.push('NOT NULL');
        if (fk.unique) parts.push('UNIQUE');
        lines.push(`  ${parts.join(' ')}`);
      }
    }

    // Composite primary key if more than one PK column
    if (pkCols.length > 1) {
      const pkNames = pkCols.map((c, idx) => q(sanitizeIdentifier(c.name, `pk_${idx + 1}`)));
      lines.push(`  PRIMARY KEY (${pkNames.join(', ')})`);
    }

    // Foreign key constraints
    for (const fk of fks) {
      lines.push(
        `  FOREIGN KEY (${q(fk.columnName)}) REFERENCES ${q(fk.refTable)}(${q(fk.refColumn)})`
      );
    }

    statements.push(`CREATE TABLE ${q(tableName)} (\n${lines.join(',\n')}\n);`);
  }

  // Generate N:M junction / bridge tables
  for (const rel of relations) {
    if (rel.cardinality !== 'N:M') continue;
    const fromEnt = entityById.get(rel.fromEntityId);
    const toEnt = entityById.get(rel.toEntityId);
    if (!fromEnt || !toEnt) continue;

    const fromTable = tableNameById.get(fromEnt.id)!;
    const toTable = tableNameById.get(toEnt.id)!;
    const fromPk = getPrimaryKeyColumn(fromEnt);
    const toPk = getPrimaryKeyColumn(toEnt);

    const baseJunctionName =
      fromEnt.id === toEnt.id ? `${fromTable}_${fromTable}_rel` : `${fromTable}_${toTable}`;
    let junctionName = baseJunctionName;
    let suffix = 2;
    while (usedTableNames.has(junctionName.toLowerCase())) {
      junctionName = `${baseJunctionName}_${suffix++}`;
    }
    usedTableNames.add(junctionName.toLowerCase());

    let col1 = `${fromTable}_${fromPk.name}`;
    let col2 = `${toTable}_${toPk.name}`;
    if (col1.toLowerCase() === col2.toLowerCase()) {
      col1 = `${col1}_1`;
      col2 = `${col2}_2`;
    }

    const type1 = mapTypeForDialect(fromPk.type, dialect);
    const type2 = mapTypeForDialect(toPk.type, dialect);

    const junctionLines = [
      `  ${q(col1)} ${type1} NOT NULL`,
      `  ${q(col2)} ${type2} NOT NULL`,
      `  PRIMARY KEY (${q(col1)}, ${q(col2)})`,
      `  FOREIGN KEY (${q(col1)}) REFERENCES ${q(fromTable)}(${q(fromPk.name)})`,
      `  FOREIGN KEY (${q(col2)}) REFERENCES ${q(toTable)}(${q(toPk.name)})`,
    ];

    statements.push(`CREATE TABLE ${q(junctionName)} (\n${junctionLines.join(',\n')}\n);`);
  }

  return statements.join('\n\n');
}
