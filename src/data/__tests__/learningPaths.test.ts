import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getLearningPaths,
  getLectureLabel,
  getNextIncompleteLecture,
} from '@/data/learningPaths';
import { SQL_TASKS } from '@/data/tasks';
import {
  LEGACY_PROGRESS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  loadCompletedTaskIds,
  markTaskCompleted,
  resetPathProgress,
  resetTaskProgress,
  saveCompletedTaskIds,
} from '@/utils/progressStore';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
}

describe('learningPaths', () => {
  it('defines all 5 structured learning paths in order', () => {
    const paths = getLearningPaths();
    expect(paths.map((p) => p.id)).toEqual([
      'basics',
      'aggregation',
      'joins',
      'ddl_dml',
      'abitur',
    ]);
    expect(paths.map((p) => p.number)).toEqual([1, 2, 3, 4, 5]);

    for (const path of paths) {
      expect(path.lectures.length).toBeGreaterThan(0);
      path.lectures.forEach((lecture, idx) => {
        expect(lecture.order).toBe(idx + 1);
        expect(lecture.label).toBe(`${path.number}.${idx + 1}`);
        expect(lecture.task.id).toBe(lecture.taskId);
      });
    }
  });

  it('covers every task in SQL_TASKS across paths 1-4 without duplicates', () => {
    const paths1to4 = getLearningPaths().filter((p) => p.id !== 'abitur');
    const pathTaskIds = paths1to4.flatMap((p) =>
      p.lectures.map((lecture) => lecture.taskId)
    );

    expect(new Set(pathTaskIds).size).toBe(pathTaskIds.length);
    expect(pathTaskIds.length).toBe(SQL_TASKS.length);

    const allTaskIds = new Set(SQL_TASKS.map((t) => t.id));
    for (const id of pathTaskIds) {
      expect(allTaskIds.has(id)).toBe(true);
    }
    for (const task of SQL_TASKS) {
      expect(pathTaskIds).toContain(task.id);
    }
  });

  it('includes all and only isAbitur tasks in the abitur path', () => {
    const abiturPath = getLearningPaths().find((p) => p.id === 'abitur');
    expect(abiturPath).toBeDefined();

    const expectedAbiturIds = SQL_TASKS.filter((t) => t.isAbitur).map(
      (t) => t.id
    );
    const actualAbiturIds = abiturPath!.lectures.map((l) => l.taskId);

    expect(actualAbiturIds).toEqual(expectedAbiturIds);
    expect(actualAbiturIds.length).toBeGreaterThan(0);
  });

  it('resolves getNextIncompleteLecture and getLectureLabel accurately', () => {
    const basicsPath = getLearningPaths().find((p) => p.id === 'basics')!;
    const first = getNextIncompleteLecture('basics', []);
    expect(first?.taskId).toBe(basicsPath.lectures[0].taskId);
    expect(first?.label).toBe('1.1');

    const second = getNextIncompleteLecture('basics', [
      basicsPath.lectures[0].taskId,
    ]);
    expect(second?.taskId).toBe(basicsPath.lectures[1].taskId);
    expect(second?.label).toBe('1.2');

    const allBasicsIds = basicsPath.lectures.map((l) => l.taskId);
    expect(getNextIncompleteLecture('basics', allBasicsIds)).toBeNull();

    expect(getLectureLabel(basicsPath.lectures[0].taskId)).toBe('1.1');
    expect(getLectureLabel('non-existent-task')).toBeNull();
  });
});

describe('progressStore', () => {
  const originalLocalStorage = globalThis.localStorage;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    if (originalLocalStorage === undefined) {
      delete (globalThis as { localStorage?: Storage }).localStorage;
    } else {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
        writable: true,
      });
    }
  });

  it('saves, loads, marks, and resets task and path progress', () => {
    expect(loadCompletedTaskIds()).toEqual([]);

    saveCompletedTaskIds(['schule-1-basics', 'schule-1-basics', 'shop-1-basics']);
    expect(loadCompletedTaskIds()).toEqual(['schule-1-basics', 'shop-1-basics']);
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe(
      JSON.stringify(['schule-1-basics', 'shop-1-basics'])
    );
    expect(localStorage.getItem(LEGACY_PROGRESS_STORAGE_KEY)).toBe(
      JSON.stringify(['schule-1-basics', 'shop-1-basics'])
    );

    const afterMark = markTaskCompleted('kino-1-basics');
    expect(afterMark).toEqual([
      'schule-1-basics',
      'shop-1-basics',
      'kino-1-basics',
    ]);
    expect(markTaskCompleted('kino-1-basics')).toEqual(afterMark);

    const afterResetTask = resetTaskProgress('shop-1-basics');
    expect(afterResetTask).toEqual(['schule-1-basics', 'kino-1-basics']);

    const afterResetPath = resetPathProgress([
      'schule-1-basics',
      'schule-2-basics',
    ]);
    expect(afterResetPath).toEqual(['kino-1-basics']);
  });

  it('migrates existing progress from the legacy TaskTrainer storage key', () => {
    localStorage.setItem(
      LEGACY_PROGRESS_STORAGE_KEY,
      JSON.stringify(['schule-3-aggregation', 'kino-2-basics'])
    );

    const loaded = loadCompletedTaskIds();
    expect(loaded).toEqual(['schule-3-aggregation', 'kino-2-basics']);
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe(
      JSON.stringify(['schule-3-aggregation', 'kino-2-basics'])
    );
  });
});
