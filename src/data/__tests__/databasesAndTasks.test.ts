import initSqlJs from 'sql.js';
import { describe, expect, it } from 'vitest';
import { CHEAT_SHEET_ITEMS } from '@/data/cheatSheet';
import { DATABASE_PRESETS } from '@/data/databases';
import { SQL_TASKS } from '@/data/tasks';
import { SqlEngine } from '@/engine/sqlEngine';
import { gradeTask } from '@/engine/taskGrader';
import type { TaskTopic } from '@/types/sql';

async function createSqlJs() {
  return initSqlJs({
    locateFile: (file: string) => `node_modules/sql.js/dist/${file}`,
  });
}

describe('DATABASE_PRESETS', () => {
  it('contains schule, onlineshop, kino, and leer presets', () => {
    const ids = DATABASE_PRESETS.map((preset) => preset.id);
    expect(ids).toEqual(['schule', 'onlineshop', 'kino', 'leer']);
  });

  it('loads every preset cleanly with foreign keys enabled and valid data', async () => {
    const SQL = await createSqlJs();

    for (const preset of DATABASE_PRESETS) {
      const db = new SQL.Database();
      try {
        db.run('PRAGMA foreign_keys = ON;');
        if (preset.sql.trim()) {
          expect(() => db.exec(preset.sql)).not.toThrow();
        }

        const fkViolations = db.exec('PRAGMA foreign_key_check;');
        expect(fkViolations).toEqual([]);

        const tablesResult = db.exec(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
        );
        const tableNames = (tablesResult[0]?.values ?? []).map((row) =>
          String(row[0])
        );

        if (preset.id === 'leer') {
          expect(tableNames.length).toBe(0);
        } else {
          expect(tableNames.length).toBeGreaterThanOrEqual(4);

          for (const tableName of tableNames) {
            const countRes = db.exec(`SELECT COUNT(*) FROM ${tableName};`);
            const count = Number(countRes[0]?.values[0]?.[0] ?? 0);
            expect(count).toBeGreaterThan(0);
          }
        }
      } finally {
        db.close();
      }
    }
  });
});

describe('SQL_TASKS', () => {
  it('contains 48 tasks covering all 4 databases (12 each), all 4 topics, and Abitur tasks', () => {
    const expectedTopics: TaskTopic[] = [
      'basics',
      'aggregation',
      'joins',
      'subqueries_ddl',
    ];

    expect(SQL_TASKS.length).toBe(48);

    for (const preset of DATABASE_PRESETS) {
      const dbTasks = SQL_TASKS.filter((task) => task.databaseId === preset.id);
      expect(dbTasks.length).toBe(12);

      for (const topic of expectedTopics) {
        const topicTasks = dbTasks.filter((task) => task.topic === topic);
        expect(topicTasks.length).toBeGreaterThanOrEqual(1);
      }

      const abiturTasks = dbTasks.filter((task) => task.isAbitur);
      expect(abiturTasks.length).toBeGreaterThanOrEqual(1);
    }

    const uniqueIds = new Set(SQL_TASKS.map((t) => t.id));
    expect(uniqueIds.size).toBe(SQL_TASKS.length);
  });

  it('passes gradeTask for all 48 tasks in both mysql and sqlite modes', async () => {
    const snapshots = new Map<string, Uint8Array>();

    for (const preset of DATABASE_PRESETS) {
      const engine = new SqlEngine(preset.id);
      await engine.init();
      try {
        engine.loadSql(preset.sql, 'mysql');
        snapshots.set(preset.id, engine.exportBinary());
      } finally {
        engine.close();
      }
    }

    for (const task of SQL_TASKS) {
      const snapshot = snapshots.get(task.databaseId);
      expect(snapshot, `Missing snapshot for ${task.databaseId}`).toBeDefined();

      const mysqlResult = await gradeTask(snapshot!, task, task.solutionSql, 'mysql');
      expect(
        mysqlResult.passed,
        `Task ${task.id} failed in mysql mode: ${mysqlResult.feedbackEn} (${mysqlResult.details ?? ''})`
      ).toBe(true);

      const sqliteResult = await gradeTask(snapshot!, task, task.solutionSql, 'sqlite');
      expect(
        sqliteResult.passed,
        `Task ${task.id} failed in sqlite mode: ${sqliteResult.feedbackEn} (${sqliteResult.details ?? ''})`
      ).toBe(true);
    }
  });
});

describe('CHEAT_SHEET_ITEMS', () => {
  it('provides compact plain-text templates with de/en descriptions', () => {
    expect(CHEAT_SHEET_ITEMS.length).toBeGreaterThanOrEqual(10);
    for (const item of CHEAT_SHEET_ITEMS) {
      expect(item.id.trim().length).toBeGreaterThan(0);
      expect(item.syntax.trim().length).toBeGreaterThan(0);
      expect(item.descriptionDe.trim().length).toBeGreaterThan(0);
      expect(item.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(item.exampleSql.trim().length).toBeGreaterThan(0);
    }
  });
});
