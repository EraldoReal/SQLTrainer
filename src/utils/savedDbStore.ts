export interface SavedDatabaseProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tableCount: number;
  rowCountTotal: number;
  tableNames: string[];
  source: 'empty' | 'erd' | 'clone' | 'import';
  binary: Uint8Array;
  lastSql: string;
}

const DB_NAME = 'sql-trainer-projects';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

const memoryStore = new Map<string, SavedDatabaseProject>();

function hasIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function cloneProject(project: SavedDatabaseProject): SavedDatabaseProject {
  return {
    ...project,
    tableNames: [...project.tableNames],
    binary: new Uint8Array(project.binary),
  };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = operation(store);

    let result: T;
    let hasResult = false;

    request.onsuccess = () => {
      result = request.result;
      hasResult = true;
    };

    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB request failed'));
    };

    tx.oncomplete = () => {
      db.close();
      resolve(hasResult ? result : (undefined as T));
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('IndexedDB transaction failed'));
    };

    tx.onabort = () => {
      db.close();
      reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    };
  });
}

export function createProjectId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function listSavedDatabases(): Promise<SavedDatabaseProject[]> {
  let items: SavedDatabaseProject[];
  if (hasIndexedDb()) {
    items = await withStore<SavedDatabaseProject[]>('readonly', (store) => store.getAll());
  } else {
    items = Array.from(memoryStore.values(), cloneProject);
  }
  return items.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getSavedDatabase(id: string): Promise<SavedDatabaseProject | null> {
  if (hasIndexedDb()) {
    const item = await withStore<SavedDatabaseProject | undefined>('readonly', (store) =>
      store.get(id)
    );
    return item ?? null;
  }
  const item = memoryStore.get(id);
  return item ? cloneProject(item) : null;
}

export async function saveDatabaseProject(
  project: SavedDatabaseProject
): Promise<SavedDatabaseProject> {
  const toSave = cloneProject(project);
  if (hasIndexedDb()) {
    await withStore('readwrite', (store) => store.put(toSave));
    return toSave;
  }
  memoryStore.set(toSave.id, toSave);
  return cloneProject(toSave);
}

export async function renameSavedDatabase(
  id: string,
  newName: string
): Promise<SavedDatabaseProject | null> {
  const existing = await getSavedDatabase(id);
  if (!existing) {
    return null;
  }
  const trimmed = newName.trim();
  const updated: SavedDatabaseProject = {
    ...existing,
    name: trimmed || existing.name,
    updatedAt: Date.now(),
  };
  return saveDatabaseProject(updated);
}

export async function duplicateSavedDatabase(
  id: string,
  newName?: string
): Promise<SavedDatabaseProject | null> {
  const existing = await getSavedDatabase(id);
  if (!existing) {
    return null;
  }
  const now = Date.now();
  const trimmed = newName?.trim();
  const copy: SavedDatabaseProject = {
    ...cloneProject(existing),
    id: createProjectId(),
    name: trimmed || `${existing.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
    source: 'clone',
  };
  return saveDatabaseProject(copy);
}

export async function deleteSavedDatabase(id: string): Promise<void> {
  if (hasIndexedDb()) {
    await withStore('readwrite', (store) => store.delete(id));
    return;
  }
  memoryStore.delete(id);
}
