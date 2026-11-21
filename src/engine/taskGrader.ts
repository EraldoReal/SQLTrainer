import type { GradeResult, QueryResult, SqlCellValue, SqlDialect, SqlTask } from '@/types/sql';
import { SqlEngine } from './sqlEngine';

function normalizeCellForKey(val: SqlCellValue): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') {
    // Normalize -0 to 0 and round tiny floating-point noise
    const clean = Object.is(val, -0) ? 0 : val;
    return `N:${Number(clean.toFixed(9))}`;
  }
  if (val instanceof Uint8Array) {
    return `B:${Array.from(val).join(',')}`;
  }
  return `S:${String(val)}`;
}

function cellsEqual(a: SqlCellValue, b: SqlCellValue): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return (a === null || a === undefined) && (b === null || b === undefined);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) <= 1e-6;
  }
  if (a instanceof Uint8Array && b instanceof Uint8Array) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return String(a) === String(b);
}

function rowKey(row: SqlCellValue[]): string {
  return JSON.stringify(row.map(normalizeCellForKey));
}

function rowsEqualOrdered(a: SqlCellValue[][], b: SqlCellValue[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const rowA = a[i];
    const rowB = b[i];
    if (rowA.length !== rowB.length) return false;
    for (let j = 0; j < rowA.length; j++) {
      if (!cellsEqual(rowA[j], rowB[j])) return false;
    }
  }
  return true;
}

function rowsEqualUnordered(a: SqlCellValue[][], b: SqlCellValue[][]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((r1, r2) => rowKey(r1).localeCompare(rowKey(r2)));
  const sortedB = [...b].sort((r1, r2) => rowKey(r1).localeCompare(rowKey(r2)));
  return rowsEqualOrdered(sortedA, sortedB);
}

function getLastTabularResult(results: QueryResult[]): QueryResult | undefined {
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].columns.length > 0) {
      return results[i];
    }
  }
  return undefined;
}

function compareDmlStates(userEngine: SqlEngine, solutionEngine: SqlEngine): GradeResult {
  const userSchema = userEngine.getSchema();
  const solSchema = solutionEngine.getSchema();

  const userTables = userSchema.map((t) => t.name);
  const solTables = solSchema.map((t) => t.name);

  if (
    userTables.length !== solTables.length ||
    userTables.some((name, i) => name.toLowerCase() !== solTables[i].toLowerCase())
  ) {
    return {
      passed: false,
      feedbackDe: 'Die Tabellenstruktur stimmt noch nicht mit der Musterlösung überein.',
      feedbackEn: 'The database table structure does not match the reference solution.',
      details: `Expected tables: [${solTables.join(', ')}], got: [${userTables.join(', ')}]`,
    };
  }

  for (let i = 0; i < solSchema.length; i++) {
    const solTable = solSchema[i];
    const userTable = userSchema[i];
    const solCols = solTable.columns.map((c) => `${c.name.toLowerCase()}:${c.type.toUpperCase()}`);
    const userCols = userTable.columns.map((c) => `${c.name.toLowerCase()}:${c.type.toUpperCase()}`);

    if (
      solCols.length !== userCols.length ||
      solCols.some((c, idx) => c !== userCols[idx])
    ) {
      return {
        passed: false,
        feedbackDe: `Die Spalten der Tabelle "${solTable.name}" weichen von der Musterlösung ab.`,
        feedbackEn: `Columns of table "${solTable.name}" differ from the reference solution.`,
        details: `Expected: [${solCols.join(', ')}], got: [${userCols.join(', ')}]`,
      };
    }

    const escaped = `"${solTable.name.replace(/"/g, '""')}"`;
    const solRows = solutionEngine.execute(`SELECT * FROM ${escaped};`, 'sqlite')[0]?.values ?? [];
    const userRows = userEngine.execute(`SELECT * FROM ${escaped};`, 'sqlite')[0]?.values ?? [];

    if (!rowsEqualUnordered(userRows, solRows)) {
      return {
        passed: false,
        feedbackDe: `Der Inhalt der Tabelle "${solTable.name}" stimmt nach deiner Anweisung noch nicht mit der Musterlösung überein.`,
        feedbackEn: `The rows in table "${solTable.name}" do not match the expected state.`,
        details: `Table "${solTable.name}": expected ${solRows.length} row(s), got ${userRows.length} row(s).`,
      };
    }
  }

  return {
    passed: true,
    feedbackDe: 'Perfekt! Die Datenbankänderungen stimmen exakt mit der Musterlösung überein.',
    feedbackEn: 'Great job! The database changes match the reference solution.',
  };
}

/**
 * Grades a user's SQL query against a task's reference solution using isolated
 * cloned database instances so the live database is never mutated.
 */
export async function gradeTask(
  engineSnapshot: Uint8Array,
  task: SqlTask,
  userSql: string,
  dialect: SqlDialect
): Promise<GradeResult> {
  if (!userSql.trim()) {
    return {
      passed: false,
      feedbackDe: 'Bitte gib zuerst eine SQL-Abfrage ein.',
      feedbackEn: 'Please enter an SQL query first.',
    };
  }

  const userEngine = new SqlEngine();
  const solutionEngine = new SqlEngine();

  try {
    await Promise.all([userEngine.init(), solutionEngine.init()]);
    userEngine.loadBinary(engineSnapshot);
    solutionEngine.loadBinary(engineSnapshot);

    let solutionResults: QueryResult[];
    try {
      solutionResults = solutionEngine.execute(task.solutionSql, 'mysql');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        passed: false,
        feedbackDe: `Die Musterlösung dieser Aufgabe ist fehlerhaft und kann nicht ausgeführt werden: ${msg}`,
        feedbackEn: `The reference solution of this task is invalid and cannot be executed: ${msg}`,
        details: msg,
      };
    }

    let userResults: QueryResult[];
    try {
      userResults = userEngine.execute(userSql, dialect);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        passed: false,
        feedbackDe: `SQL-Fehler in deiner Abfrage: ${msg}`,
        feedbackEn: `SQL error in your query: ${msg}`,
        details: msg,
      };
    }

    const expectedTable = getLastTabularResult(solutionResults);

    // DDL / DML task without a SELECT result
    if (!expectedTable) {
      return compareDmlStates(userEngine, solutionEngine);
    }

    const actualTable = getLastTabularResult(userResults);
    if (!actualTable) {
      return {
        passed: false,
        feedbackDe: 'Deine Abfrage hat keine Ergebnistabelle (SELECT) zurückgegeben.',
        feedbackEn: 'Your query did not return a result table (SELECT).',
      };
    }

    // 1. Compare column count
    if (actualTable.columns.length !== expectedTable.columns.length) {
      return {
        passed: false,
        feedbackDe: `Falsche Spaltenanzahl: erwartet ${expectedTable.columns.length}, erhalten ${actualTable.columns.length}.`,
        feedbackEn: `Wrong column count: expected ${expectedTable.columns.length}, got ${actualTable.columns.length}.`,
        details: `Expected columns: [${expectedTable.columns.join(', ')}], got: [${actualTable.columns.join(', ')}]`,
      };
    }

    // 2. Compare column names (case-insensitive)
    const expectedColsLower = expectedTable.columns.map((c) => c.toLowerCase());
    const actualColsLower = actualTable.columns.map((c) => c.toLowerCase());
    const colsMatch = expectedColsLower.every((col, idx) => col === actualColsLower[idx]);
    if (!colsMatch) {
      return {
        passed: false,
        feedbackDe: `Die Spaltennamen oder ihre Reihenfolge stimmen nicht. Erwartet: ${expectedTable.columns.join(', ')}.`,
        feedbackEn: `Column names or order do not match. Expected: ${expectedTable.columns.join(', ')}.`,
        details: `Expected: [${expectedTable.columns.join(', ')}], got: [${actualTable.columns.join(', ')}]`,
      };
    }

    // 3. Compare row count
    if (actualTable.rowCount !== expectedTable.rowCount) {
      return {
        passed: false,
        feedbackDe: `Falsche Zeilenanzahl: erwartet ${expectedTable.rowCount}, erhalten ${actualTable.rowCount}.`,
        feedbackEn: `Wrong row count: expected ${expectedTable.rowCount}, got ${actualTable.rowCount}.`,
      };
    }

    // 4. Compare row values (ordered or unordered)
    if (task.checkOrder) {
      if (!rowsEqualOrdered(actualTable.values, expectedTable.values)) {
        const unorderedMatch = rowsEqualUnordered(actualTable.values, expectedTable.values);
        if (unorderedMatch) {
          return {
            passed: false,
            feedbackDe: 'Die Zeilenwerte sind richtig, aber die Sortierung (ORDER BY) stimmt nicht.',
            feedbackEn: 'The row values are correct, but the row order (ORDER BY) does not match.',
          };
        }
        return {
          passed: false,
          feedbackDe: 'Die zurückgegebenen Werte stimmen noch nicht mit der Musterlösung überein.',
          feedbackEn: 'The returned values do not match the reference solution yet.',
        };
      }
    } else if (!rowsEqualUnordered(actualTable.values, expectedTable.values)) {
      return {
        passed: false,
        feedbackDe: 'Die zurückgegebenen Werte stimmen noch nicht mit der Musterlösung überein.',
        feedbackEn: 'The returned values do not match the reference solution yet.',
      };
    }

    return {
      passed: true,
      feedbackDe: `Richtig gelöst! (${expectedTable.rowCount} Zeilen stimmen exakt überein.)`,
      feedbackEn: `Correct! (${expectedTable.rowCount} rows match the reference solution.)`,
    };
  } finally {
    userEngine.close();
    solutionEngine.close();
  }
}
