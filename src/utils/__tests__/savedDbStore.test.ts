import { beforeEach, describe, expect, it } from 'vitest';
import {
  createProjectId,
  deleteSavedDatabase,
  duplicateSavedDatabase,
  getSavedDatabase,
  listSavedDatabases,
  renameSavedDatabase,
  saveDatabaseProject,
  type SavedDatabaseProject,
} from '../savedDbStore';

function makeProject(overrides: Partial<SavedDatabaseProject> = {}): SavedDatabaseProject {
  const now = Date.now();
  return {
    id: createProjectId(),
    name: 'Test DB',
    createdAt: now,
    updatedAt: now,
    tableCount: 2,
    rowCountTotal: 10,
    tableNames: ['users', 'orders'],
    source: 'empty',
    binary: new Uint8Array([1, 2, 3, 4, 5]),
    lastSql: 'SELECT * FROM users;',
    ...overrides,
  };
}

describe('savedDbStore', () => {
  beforeEach(async () => {
    const existing = await listSavedDatabases();
    await Promise.all(existing.map((item) => deleteSavedDatabase(item.id)));
  });

  it('creates unique project IDs', () => {
    const id1 = createProjectId();
    const id2 = createProjectId();
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
    expect(id1).not.toBe(id2);
  });

  it('saves and retrieves a project including binary and lastSql', async () => {
    const binary = new Uint8Array([83, 81, 76, 105, 116, 101]);
    const project = makeProject({
      name: 'Analytics Sandbox',
      source: 'erd',
      binary,
      lastSql: 'SELECT count(*) FROM orders;',
    });

    await saveDatabaseProject(project);
    const loaded = await getSavedDatabase(project.id);

    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(project.id);
    expect(loaded?.name).toBe('Analytics Sandbox');
    expect(loaded?.source).toBe('erd');
    expect(loaded?.lastSql).toBe('SELECT count(*) FROM orders;');
    expect(loaded?.tableNames).toEqual(['users', 'orders']);
    expect(Array.from(loaded?.binary ?? [])).toEqual(Array.from(binary));

    expect(await getSavedDatabase('non-existent-id')).toBeNull();
  });

  it('lists saved databases ordered by updatedAt descending', async () => {
    const oldest = makeProject({ name: 'Oldest', updatedAt: 1000 });
    const newest = makeProject({ name: 'Newest', updatedAt: 3000 });
    const middle = makeProject({ name: 'Middle', updatedAt: 2000 });

    await saveDatabaseProject(oldest);
    await saveDatabaseProject(newest);
    await saveDatabaseProject(middle);

    const list = await listSavedDatabases();
    expect(list.map((p) => p.name)).toEqual(['Newest', 'Middle', 'Oldest']);
  });

  it('renames an existing database and returns null for missing ID', async () => {
    const project = makeProject({ name: 'Original Name', updatedAt: 1000 });
    await saveDatabaseProject(project);

    const renamed = await renameSavedDatabase(project.id, '  Updated Name  ');
    expect(renamed).not.toBeNull();
    expect(renamed?.name).toBe('Updated Name');
    expect(renamed?.updatedAt).toBeGreaterThanOrEqual(1000);
    expect(renamed?.lastSql).toBe(project.lastSql);

    const fetched = await getSavedDatabase(project.id);
    expect(fetched?.name).toBe('Updated Name');

    expect(await renameSavedDatabase('missing-id', 'Nope')).toBeNull();
  });

  it('duplicates an existing database with independent binary and optional custom name', async () => {
    const project = makeProject({
      name: 'Shop DB',
      binary: new Uint8Array([10, 20, 30]),
      lastSql: 'SELECT * FROM orders;',
      source: 'import',
    });
    await saveDatabaseProject(project);

    const defaultCopy = await duplicateSavedDatabase(project.id);
    expect(defaultCopy).not.toBeNull();
    expect(defaultCopy?.id).not.toBe(project.id);
    expect(defaultCopy?.name).toBe('Shop DB (Copy)');
    expect(defaultCopy?.source).toBe('clone');
    expect(defaultCopy?.lastSql).toBe('SELECT * FROM orders;');
    expect(Array.from(defaultCopy?.binary ?? [])).toEqual([10, 20, 30]);

    const customCopy = await duplicateSavedDatabase(project.id, 'Shop DB v2');
    expect(customCopy?.name).toBe('Shop DB v2');

    // Mutating the copy's binary buffer should not mutate the stored original
    if (defaultCopy) {
      defaultCopy.binary[0] = 99;
      await saveDatabaseProject(defaultCopy);
    }
    const originalAfter = await getSavedDatabase(project.id);
    expect(Array.from(originalAfter?.binary ?? [])).toEqual([10, 20, 30]);

    expect(await duplicateSavedDatabase('missing-id')).toBeNull();
  });

  it('deletes a saved database', async () => {
    const p1 = makeProject({ name: 'Keep' });
    const p2 = makeProject({ name: 'Remove' });
    await saveDatabaseProject(p1);
    await saveDatabaseProject(p2);

    await deleteSavedDatabase(p2.id);

    expect(await getSavedDatabase(p2.id)).toBeNull();
    const remaining = await listSavedDatabases();
    expect(remaining.map((p) => p.id)).toEqual([p1.id]);

    // Deleting a non-existent ID should resolve cleanly
    await expect(deleteSavedDatabase('missing-id')).resolves.toBeUndefined();
  });
});
