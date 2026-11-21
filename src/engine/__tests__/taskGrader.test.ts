import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { SqlTask } from '@/types/sql';
import { SqlEngine } from '../sqlEngine';
import { gradeTask } from '../taskGrader';

const BASE_SQL = `
  CREATE TABLE schueler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    punkte INTEGER NOT NULL
  );
  INSERT INTO schueler (name, punkte) VALUES ('Berta', 90);
  INSERT INTO schueler (name, punkte) VALUES ('Anton', 75);
  INSERT INTO schueler (name, punkte) VALUES ('Clara', 95);
`;

function makeTask(overrides: Partial<SqlTask> = {}): SqlTask {
  return {
    id: 't1',
    databaseId: 'school',
    topic: 'basics',
    titleDe: 'Test',
    titleEn: 'Test',
    promptDe: 'Test',
    promptEn: 'Test',
    hintDe: '',
    hintEn: '',
    solutionSql: 'SELECT name, punkte FROM schueler WHERE punkte >= 90 ORDER BY punkte DESC;',
    ...overrides,
  };
}

describe('taskGrader', () => {
  let engine: SqlEngine;

  beforeEach(async () => {
    engine = new SqlEngine('school');
    await engine.init();
    engine.loadSql(BASE_SQL, 'sqlite');
  });

  afterEach(() => {
    engine.close();
  });

  it('passes when rows match regardless of order if checkOrder is false', async () => {
    const snapshot = engine.exportBinary();
    const task = makeTask({ checkOrder: false });
    const result = await gradeTask(
      snapshot,
      task,
      'SELECT name, punkte FROM schueler WHERE punkte >= 90 ORDER BY name ASC;',
      'sqlite'
    );
    expect(result.passed).toBe(true);
  });

  it('fails when checkOrder is true and row order differs', async () => {
    const snapshot = engine.exportBinary();
    const task = makeTask({ checkOrder: true });
    const result = await gradeTask(
      snapshot,
      task,
      'SELECT name, punkte FROM schueler WHERE punkte >= 90 ORDER BY name ASC;',
      'sqlite'
    );
    expect(result.passed).toBe(false);
    expect(result.feedbackEn).toContain('order');
    expect(result.feedbackDe).toContain('Sortierung');
  });

  it('fails with clear feedback on wrong column count or names', async () => {
    const snapshot = engine.exportBinary();
    const task = makeTask();

    const wrongCount = await gradeTask(
      snapshot,
      task,
      'SELECT name FROM schueler WHERE punkte >= 90;',
      'sqlite'
    );
    expect(wrongCount.passed).toBe(false);
    expect(wrongCount.feedbackEn).toContain('column count');

    const wrongNames = await gradeTask(
      snapshot,
      task,
      'SELECT name AS schueler_name, punkte FROM schueler WHERE punkte >= 90;',
      'sqlite'
    );
    expect(wrongNames.passed).toBe(false);
    expect(wrongNames.feedbackEn).toContain('Column names');
  });

  it('fails gracefully on SQL syntax errors and empty queries', async () => {
    const snapshot = engine.exportBinary();
    const task = makeTask();

    const emptyRes = await gradeTask(snapshot, task, '   ', 'sqlite');
    expect(emptyRes.passed).toBe(false);

    const errRes = await gradeTask(snapshot, task, 'SELEC * FORM schueler;', 'sqlite');
    expect(errRes.passed).toBe(false);
    expect(errRes.feedbackEn).toContain('SQL error');
  });

  it('grades DML tasks accurately without mutating the live database', async () => {
    const snapshot = engine.exportBinary();
    const dmlTask = makeTask({
      topic: 'subqueries_ddl',
      solutionSql: "INSERT INTO schueler (name, punkte) VALUES ('Dora', 88);",
    });

    const passRes = await gradeTask(
      snapshot,
      dmlTask,
      "INSERT INTO schueler (name, punkte) VALUES ('Dora', 88);",
      'sqlite'
    );
    expect(passRes.passed).toBe(true);

    const failRes = await gradeTask(
      snapshot,
      dmlTask,
      "INSERT INTO schueler (name, punkte) VALUES ('Dora', 50);",
      'sqlite'
    );
    expect(failRes.passed).toBe(false);

    // Live engine must still have only the original 3 rows
    const [liveCount] = engine.execute('SELECT COUNT(*) AS cnt FROM schueler;', 'sqlite');
    expect(liveCount.values[0][0]).toBe(3);
  });
});
