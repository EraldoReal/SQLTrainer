import type { Database, SqlValue } from 'sql.js';

export type PreprocessedQuery =
  | { type: 'sql'; sql: string }
  | { type: 'describe'; table: string };

/**
 * Splits a SQL script into individual statements, respecting single-quoted,
 * double-quoted, and backtick-quoted strings as well as `--` and `/* ... *\/` comments.
 */
export function splitSqlStatements(sql: string, backslashEscapes = true): string[] {
  const statements: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      current += ch;
      if (ch === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      current += ch;
      if (ch === '*' && next === '/') {
        current += next;
        i++;
        inBlockComment = false;
      }
      continue;
    }

    if (inSingleQuote) {
      current += ch;
      if (ch === "'" && next === "'") {
        current += next;
        i++;
      } else if (backslashEscapes && ch === '\\' && next !== undefined) {
        current += next;
        i++;
      } else if (ch === "'") {
        inSingleQuote = false;
      }
      continue;
    }

    if (inDoubleQuote) {
      current += ch;
      if (ch === '"' && next === '"') {
        current += next;
        i++;
      } else if (ch === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inBacktick) {
      current += ch;
      if (ch === '`') {
        inBacktick = false;
      }
      continue;
    }

    if (ch === '-' && next === '-') {
      inLineComment = true;
      current += ch + next;
      i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      current += ch + next;
      i++;
      continue;
    }

    if (ch === "'") {
      inSingleQuote = true;
      current += ch;
      continue;
    }

    if (ch === '"') {
      inDoubleQuote = true;
      current += ch;
      continue;
    }

    if (ch === '`') {
      inBacktick = true;
      current += ch;
      continue;
    }

    if (ch === ';') {
      if (isOpenTriggerBody(current)) {
        current += ch;
        continue;
      }
      const trimmed = current.trim();
      if (trimmed && !isCommentOnly(trimmed)) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    }

    current += ch;
  }

  const trimmed = current.trim();
  if (trimmed && !isCommentOnly(trimmed)) {
    statements.push(trimmed);
  }

  return statements;
}

/**
 * True while a CREATE TRIGGER statement still has an unclosed BEGIN ... END body,
 * so inner semicolons must not split the statement.
 */
function isOpenTriggerBody(current: string): boolean {
  const text = current
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ')
    .replace(/'(?:''|[^'])*'/g, "''");
  if (!/^\s*CREATE\s+(?:TEMP(?:ORARY)?\s+)?TRIGGER\b/i.test(text)) return false;
  const begins = (text.match(/\bBEGIN\b/gi) ?? []).length;
  if (begins === 0) return false;
  const opens = begins + (text.match(/\bCASE\b/gi) ?? []).length;
  const ends = (text.match(/\bEND\b/gi) ?? []).length;
  return ends < opens;
}

function isCommentOnly(sql: string): boolean {
  const withoutBlock = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  const withoutLine = withoutBlock.replace(/--[^\n]*/g, '');
  return withoutLine.trim().length === 0;
}

function stripLeadingComments(sql: string): string {
  let rest = sql.trimStart();
  while (true) {
    if (rest.startsWith('--')) {
      const newlineIdx = rest.indexOf('\n');
      rest = newlineIdx === -1 ? '' : rest.slice(newlineIdx + 1).trimStart();
    } else if (rest.startsWith('/*')) {
      const endIdx = rest.indexOf('*/');
      rest = endIdx === -1 ? '' : rest.slice(endIdx + 2).trimStart();
    } else {
      break;
    }
  }
  return rest;
}

/**
 * Replaces string literals and comments with placeholders so DDL regexes
 * never mutate literal text or comments.
 */
function maskLiteralsAndComments(sql: string): {
  masked: string;
  restore: (text: string) => string;
} {
  const tokens: string[] = [];
  const pattern =
    /('(?:\\.|''|[^'\\])*'|"(?:""|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const masked = sql.replace(pattern, (match) => {
    const id = `__SQL_TOKEN_${tokens.length}__`;
    tokens.push(match);
    return id;
  });

  return {
    masked,
    restore: (text: string) =>
      text.replace(/__SQL_TOKEN_(\d+)__/g, (_, idx) => tokens[Number(idx)] ?? ''),
  };
}

function translateMySqlDdl(sql: string): string {
  const { masked, restore } = maskLiteralsAndComments(sql);

  let out = masked;

  // Normalize AUTO_INCREMENT + PRIMARY KEY combinations to SQLite's INTEGER PRIMARY KEY AUTOINCREMENT
  out = out.replace(
    /\b(?:BIGINT|INT|INTEGER|SMALLINT|TINYINT|MEDIUMINT)(?:\s*\(\s*\d+\s*\))?(?:\s+UNSIGNED)?(?:\s+(NOT\s+NULL))?\s+AUTO_INCREMENT\s+PRIMARY\s+KEY\b/gi,
    (_, notNull) =>
      notNull ? 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL' : 'INTEGER PRIMARY KEY AUTOINCREMENT'
  );
  out = out.replace(
    /\b(?:BIGINT|INT|INTEGER|SMALLINT|TINYINT|MEDIUMINT)(?:\s*\(\s*\d+\s*\))?(?:\s+UNSIGNED)?\s+PRIMARY\s+KEY\s+AUTO_INCREMENT\b/gi,
    'INTEGER PRIMARY KEY AUTOINCREMENT'
  );

  // Column AUTO_INCREMENT + separate table-level PRIMARY KEY (col) -> inline INTEGER PRIMARY KEY AUTOINCREMENT
  const autoCol = out.match(
    /([`"]?\w+[`"]?)\s+(?:BIGINT|INT|INTEGER|SMALLINT|TINYINT|MEDIUMINT)(?:\s*\(\s*\d+\s*\))?(?:\s+UNSIGNED)?(\s+NOT\s+NULL)?\s+AUTO_INCREMENT\b/i
  );
  if (autoCol) {
    const colName = autoCol[1].replace(/[`"]/g, '');
    const escapedName = colName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pkClause = new RegExp(
      `,\\s*PRIMARY\\s+KEY\\s*\\(\\s*[\`"]?${escapedName}[\`"]?\\s*\\)`,
      'i'
    );
    if (pkClause.test(out)) {
      out = out.replace(pkClause, '');
      out = out.replace(
        autoCol[0],
        `${autoCol[1]} INTEGER PRIMARY KEY AUTOINCREMENT${autoCol[2] ? ' NOT NULL' : ''}`
      );
    }
  }

  // Strip table-level MySQL options (e.g. ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=... AUTO_INCREMENT=10)
  out = out.replace(/\bAUTO_INCREMENT\s*=\s*\d+\b/gi, '');
  out = out.replace(/\bDEFAULT\s+CHARSET\s*=\s*[\w-]+\b/gi, '');
  out = out.replace(/\bCHARSET\s*=\s*[\w-]+\b/gi, '');
  out = out.replace(/\bCOLLATE\s*=\s*[\w-]+\b/gi, '');
  out = out.replace(/\bENGINE\s*=\s*\w+\b/gi, '');
  out = out.replace(/\bUNSIGNED\b/gi, '');

  // Remaining standalone AUTO_INCREMENT -> AUTOINCREMENT
  out = out.replace(/\bAUTO_INCREMENT\b/gi, 'AUTOINCREMENT');

  // Column data types (only in type position, never for column names such as `date`)
  const NON_TYPE_PRECEDERS =
    /\b(?:ADD|COLUMN|TO|ON|DROP|TABLE|EXISTS|SELECT|FROM|WHERE|AND|OR|BY|INDEX|KEY|JOIN|UPDATE|SET)\s+$/i;
  const replaceTypes = (input: string, pattern: RegExp, replacement: string): string =>
    input.replace(pattern, (match: string, ...rest: unknown[]) => {
      const offset = rest[rest.length - 2] as number;
      const before = input.slice(0, offset);
      const inTypePosition = /[\w`"\]]\s+$/.test(before) && !NON_TYPE_PRECEDERS.test(before);
      return inTypePosition ? replacement : match;
    });

  out = replaceTypes(out, /\b(?:N?VARCHAR|CHAR)\s*\(\s*\d+\s*\)/gi, 'TEXT');
  out = replaceTypes(out, /\b(?:LONGTEXT|MEDIUMTEXT|TINYTEXT)\b/gi, 'TEXT');
  out = replaceTypes(out, /\b(?:BIGINT|MEDIUMINT|SMALLINT|TINYINT|INT)\s*\(\s*\d+\s*\)/gi, 'INTEGER');
  out = replaceTypes(out, /\b(?:BIGINT|MEDIUMINT|SMALLINT|TINYINT|INT)\b/gi, 'INTEGER');
  out = replaceTypes(out, /\b(?:BOOLEAN|BOOL)\b/gi, 'INTEGER');
  out = replaceTypes(out, /\b(?:DECIMAL|NUMERIC)\s*\(\s*\d+(?:\s*,\s*\d+)?\s*\)/gi, 'REAL');
  out = replaceTypes(out, /\b(?:DECIMAL|NUMERIC|DOUBLE|FLOAT)\b/gi, 'REAL');
  out = replaceTypes(out, /\b(?:DATETIME|TIMESTAMP|DATE)\b/gi, 'TEXT');

  // Clean up extra spaces introduced by stripped clauses
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/\s+;/g, ';').trim();

  return restore(out);
}

/**
 * Preprocesses a single MySQL-dialect SQL statement into a SQLite-compatible
 * SQL statement or a metadata instruction (e.g. for DESCRIBE / DESC).
 */
export function preprocessMySqlQuery(
  sql: string,
  dbName = 'sql_trainer'
): PreprocessedQuery {
  const cleaned = stripLeadingComments(sql).trim();
  const withoutSemicolon = cleaned.replace(/;+\s*$/, '').trim();

  // SHOW TABLES
  if (/^SHOW\s+(?:FULL\s+)?TABLES$/i.test(withoutSemicolon)) {
    const safeDb = dbName.replace(/"/g, '') || 'sql_trainer';
    return {
      type: 'sql',
      sql: `SELECT name AS "Tables_in_${safeDb}" FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;`,
    };
  }

  // DESCRIBE <table> / DESC <table> / SHOW COLUMNS FROM <table>
  const descMatch =
    withoutSemicolon.match(/^(?:DESCRIBE|DESC)\s+[`"]?([A-Za-z_][A-Za-z0-9_]*)[`"]?$/i) ??
    withoutSemicolon.match(/^SHOW\s+COLUMNS\s+FROM\s+[`"]?([A-Za-z_][A-Za-z0-9_]*)[`"]?$/i);
  if (descMatch) {
    return {
      type: 'describe',
      table: descMatch[1],
    };
  }

  // Translate DDL statements (CREATE / ALTER)
  if (/^(?:CREATE|ALTER)\b/i.test(withoutSemicolon)) {
    return {
      type: 'sql',
      sql: translateMySqlDdl(sql),
    };
  }

  return {
    type: 'sql',
    sql,
  };
}

function parseDateParts(value: SqlValue): { year: number; month: number; day: number } | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return null;
  const str = String(value).trim();
  if (!str || /^-?\d+(?:\.\d+)?$/.test(str)) return null;

  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
  }

  const parsed = new Date(str);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Registers common MySQL scalar functions on a sql.js Database instance.
 */
export function registerMySqlFunctions(db: Database): void {
  const concatImpl = (...args: SqlValue[]): SqlValue => {
    if (args.some((a) => a === null || a === undefined)) {
      return null;
    }
    return args.map((a) => String(a)).join('');
  };

  // sql.js uses func.length as SQLite nArg, so register explicit arities for CONCAT
  db.create_function('CONCAT', (a: SqlValue) => concatImpl(a));
  db.create_function('CONCAT', (a: SqlValue, b: SqlValue) => concatImpl(a, b));
  db.create_function('CONCAT', (a: SqlValue, b: SqlValue, c: SqlValue) => concatImpl(a, b, c));
  db.create_function('CONCAT', (a: SqlValue, b: SqlValue, c: SqlValue, d: SqlValue) =>
    concatImpl(a, b, c, d)
  );
  db.create_function('CONCAT', (a: SqlValue, b: SqlValue, c: SqlValue, d: SqlValue, e: SqlValue) =>
    concatImpl(a, b, c, d, e)
  );
  db.create_function(
    'CONCAT',
    (a: SqlValue, b: SqlValue, c: SqlValue, d: SqlValue, e: SqlValue, f: SqlValue) =>
      concatImpl(a, b, c, d, e, f)
  );
  db.create_function(
    'CONCAT',
    (a: SqlValue, b: SqlValue, c: SqlValue, d: SqlValue, e: SqlValue, f: SqlValue, g: SqlValue) =>
      concatImpl(a, b, c, d, e, f, g)
  );
  db.create_function(
    'CONCAT',
    (
      a: SqlValue,
      b: SqlValue,
      c: SqlValue,
      d: SqlValue,
      e: SqlValue,
      f: SqlValue,
      g: SqlValue,
      h: SqlValue
    ) => concatImpl(a, b, c, d, e, f, g, h)
  );

  db.create_function('YEAR', (val: SqlValue) => {
    const parts = parseDateParts(val);
    return parts ? parts.year : null;
  });

  db.create_function('MONTH', (val: SqlValue) => {
    const parts = parseDateParts(val);
    return parts ? parts.month : null;
  });

  const dayFn = (val: SqlValue) => {
    const parts = parseDateParts(val);
    return parts ? parts.day : null;
  };
  db.create_function('DAY', dayFn);
  db.create_function('DAYOFMONTH', dayFn);

  db.create_function('NOW', () => {
    const d = new Date();
    return (
      `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
      `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
    );
  });

  db.create_function('CURDATE', () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  });

  db.create_function('IFNULL', (a: SqlValue, b: SqlValue) => {
    return a !== null && a !== undefined ? a : b;
  });

  // MySQL SUBSTRING is 1-indexed: SUBSTRING(str, pos) and SUBSTRING(str, pos, len)
  const substringImpl = (val: SqlValue, posVal: SqlValue, lenVal?: SqlValue): SqlValue => {
    if (val === null || val === undefined || posVal === null || posVal === undefined) {
      return null;
    }
    const str = String(val);
    const pos = Math.trunc(Number(posVal));
    if (Number.isNaN(pos) || pos === 0) {
      return '';
    }
    const start = pos > 0 ? pos - 1 : Math.max(0, str.length + pos);
    if (lenVal === undefined) {
      return str.slice(start);
    }
    if (lenVal === null) {
      return null;
    }
    const len = Math.trunc(Number(lenVal));
    if (Number.isNaN(len) || len <= 0) {
      return '';
    }
    return str.slice(start, start + len);
  };
  db.create_function('SUBSTRING', (val: SqlValue, posVal: SqlValue) =>
    substringImpl(val, posVal)
  );
  db.create_function('SUBSTRING', (val: SqlValue, posVal: SqlValue, lenVal: SqlValue) =>
    substringImpl(val, posVal, lenVal)
  );

  const charLengthFn = (val: SqlValue) => {
    if (val === null || val === undefined) return null;
    return String(val).length;
  };
  db.create_function('CHAR_LENGTH', charLengthFn);
  db.create_function('CHARACTER_LENGTH', charLengthFn);
}
