import { describe, expect, it } from 'vitest';
import type { SqlTask } from '@/types/sql';
import { SqlEngine } from '../sqlEngine';
import { gradeTask } from '../taskGrader';
import { splitSqlStatements } from '../mysqlCompat';
import { generateSqlFromErd, normalizeErdModel, type ErdEntity } from '../erdToSql';

async function makeEngine(sql = ''): Promise<SqlEngine> {
  const engine = new SqlEngine();
  await engine.init();
  if (sql) engine.loadSql(sql, 'mysql');
  return engine;
}

const task = (solutionSql: string): SqlTask => ({
  id: 't',
  databaseId: 'd',
  topic: 'basics',
  titleDe: 't',
  titleEn: 't',
  promptDe: 't',
  promptEn: 't',
  hintDe: '',
  hintEn: '',
  solutionSql,
});

describe('regressions', () => {
  it('returns columns and no stale affectedRows for an empty SELECT', async () => {
    const e = await makeEngine();
    const res = e.execute('CREATE TABLE a (x INT); INSERT INTO a VALUES (1),(2); SELECT * FROM a WHERE x > 5;', 'mysql');
    expect(res[1].affectedRows).toBe(2);
    expect(res[2].columns).toEqual(['x']);
    expect(res[2].rowCount).toBe(0);
    expect(res[2].affectedRows).toBeUndefined();
    expect(res[0].affectedRows).toBe(0);
  });

  it('does not pass a wrong query when the expected result is empty', async () => {
    const e = await makeEngine('CREATE TABLE a (x INT); INSERT INTO a VALUES (1);');
    const snap = e.exportBinary();
    const wrong = await gradeTask(snap, task('SELECT * FROM a WHERE x > 5;'), 'SELECT * FROM a;', 'mysql');
    expect(wrong.passed).toBe(false);
    const right = await gradeTask(snap, task('SELECT * FROM a WHERE x > 5;'), 'SELECT * FROM a WHERE x > 9;', 'mysql');
    expect(right.passed).toBe(true);
  });

  it('reports an invalid reference solution instead of throwing', async () => {
    const e = await makeEngine('CREATE TABLE a (x INT);');
    const res = await gradeTask(e.exportBinary(), task('SELEKT 1'), 'SELECT 1', 'mysql');
    expect(res.passed).toBe(false);
  });

  it('keeps the current database when loadSql fails', async () => {
    const e = await makeEngine('CREATE TABLE keep (x INT);');
    expect(() => e.loadSql('CREATE TABLE n (x INT); SELEKT;', 'mysql')).toThrow();
    expect(e.getSchema().map((t) => t.name)).toEqual(['keep']);
  });

  it('does not rewrite column names that look like types', async () => {
    const e = await makeEngine("CREATE TABLE t (date DATE, x INT); CREATE INDEX i ON t(date);");
    expect(e.getSchema()[0].columns.map((c) => `${c.name}:${c.type}`)).toEqual(['date:TEXT', 'x:INTEGER']);
  });

  it('supports AUTO_INCREMENT with a separate PRIMARY KEY clause', async () => {
    const e = await makeEngine(
      'CREATE TABLE t (id INT NOT NULL AUTO_INCREMENT, n VARCHAR(5), PRIMARY KEY (id)) ENGINE=InnoDB;'
    );
    e.execute("INSERT INTO t (n) VALUES ('a'),('b');", 'mysql');
    expect(e.execute('SELECT id FROM t;', 'mysql')[0].values).toEqual([[1], [2]]);
  });

  it('keeps CREATE TRIGGER bodies in one statement and honours dialect escapes', () => {
    const trigger =
      'CREATE TRIGGER trg AFTER INSERT ON a BEGIN UPDATE a SET x = 1; DELETE FROM a WHERE x = 2; END;';
    expect(splitSqlStatements(`${trigger} SELECT 1;`)).toHaveLength(2);
    expect(splitSqlStatements("SELECT 'C:\\'; SELECT 2;", false)).toHaveLength(2);
  });

  it('quotes reserved words, transliterates umlauts and adds implicit primary keys', async () => {
    const ent = (id: string, name: string, pk: boolean): ErdEntity => ({
      id,
      name,
      x: 0,
      y: 0,
      columns: [
        { id: `${id}c`, name: pk ? 'id' : 'wert', type: 'INT', primaryKey: pk, autoIncrement: pk, notNull: true, unique: false },
      ],
    });
    for (const dialect of ['sqlite', 'mysql'] as const) {
      const sql = generateSqlFromErd(
        [ent('a', 'order', true), ent('b', 'Größe', false)],
        [{ id: 'r', fromEntityId: 'b', toEntityId: 'a', cardinality: '1:N' }],
        dialect
      );
      expect(sql).toContain('Groesse');
      const e = await makeEngine();
      expect(() => e.loadSql(sql, dialect)).not.toThrow();
      expect(e.getSchema().map((t) => t.name).sort()).toEqual(['Groesse', 'order']);
    }
  });

  it('rejects malformed ER models', () => {
    expect(normalizeErdModel({ entities: [{ id: 'x' }], relations: [] })).toBeNull();
    expect(normalizeErdModel({ entities: [], relations: [] })).toEqual({ entities: [], relations: [] });
  });
});
