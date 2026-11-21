export type SupportedFileKind = 'sql' | 'sqlite';

export interface RecentFileEntry {
  name: string;
  kind: SupportedFileKind;
  openedAt: number;
}

export interface FileSystemWritableLike {
  write(data: string | BufferSource | Blob): Promise<void>;
  close(): Promise<void>;
}

export interface FileSystemFileHandleLike {
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableLike>;
}

export interface OpenedFileResult {
  name: string;
  kind: SupportedFileKind;
  content: string | Uint8Array;
  handle?: FileSystemFileHandleLike;
}

export interface SavedFileResult {
  name: string;
  handle?: FileSystemFileHandleLike;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface WindowWithFsAccess extends Window {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }) => Promise<FileSystemFileHandleLike[]>;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }) => Promise<FileSystemFileHandleLike>;
}

const RECENT_FILES_STORAGE_KEY = 'sql_trainer_recent_files';
const MAX_RECENT_FILES = 10;

export function isTauriEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
}

export function hasFileSystemAccess(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as WindowWithFsAccess;
  return (
    typeof win.showOpenFilePicker === 'function' &&
    typeof win.showSaveFilePicker === 'function'
  );
}

function detectFileKind(filename: string): SupportedFileKind {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.sqlite') || lower.endsWith('.sqlite3') || lower.endsWith('.db')) {
    return 'sqlite';
  }
  return 'sql';
}

function getPickerTypes(mode: 'sql' | 'sqlite' | 'all'): FilePickerAcceptType[] {
  const sqlType: FilePickerAcceptType = {
    description: 'SQL Files',
    accept: { 'text/plain': ['.sql'] },
  };
  const sqliteType: FilePickerAcceptType = {
    description: 'SQLite Database Files',
    accept: { 'application/x-sqlite3': ['.sqlite', '.sqlite3', '.db'] },
  };
  if (mode === 'sql') return [sqlType];
  if (mode === 'sqlite') return [sqliteType];
  return [sqlType, sqliteType];
}

async function readFileObject(
  file: File,
  handle?: FileSystemFileHandleLike
): Promise<OpenedFileResult> {
  const kind = detectFileKind(file.name);
  const content =
    kind === 'sqlite' ? new Uint8Array(await file.arrayBuffer()) : await file.text();
  addRecentFile(file.name, kind);
  return {
    name: file.name,
    kind,
    content,
    ...(handle ? { handle } : {}),
  };
}

function openFileViaInput(mode: 'sql' | 'sqlite' | 'all'): Promise<OpenedFileResult | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept =
      mode === 'sql'
        ? '.sql,text/sql,text/plain'
        : mode === 'sqlite'
          ? '.sqlite,.sqlite3,.db'
          : '.sql,.sqlite,.sqlite3,.db';
    input.style.display = 'none';

    let settled = false;
    const cleanup = () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.addEventListener('change', async () => {
      if (settled) return;
      settled = true;
      const file = input.files?.[0];
      cleanup();
      if (!file) {
        resolve(null);
        return;
      }
      try {
        resolve(await readFileObject(file));
      } catch (err) {
        console.error('Failed to read file:', err);
        resolve(null);
      }
    });

    input.addEventListener('cancel', () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    });

    document.body.appendChild(input);
    input.click();
  });
}

/**
 * Opens a `.sql` or `.sqlite`/`.db` file using the File System Access API
 * when available, falling back to `<input type="file">`.
 */
export async function openFile(
  mode: 'sql' | 'sqlite' | 'all' = 'all'
): Promise<OpenedFileResult | null> {
  if (typeof window === 'undefined') return null;

  const win = window as WindowWithFsAccess;
  if (typeof win.showOpenFilePicker === 'function') {
    let handle: FileSystemFileHandleLike | undefined;
    try {
      [handle] = await win.showOpenFilePicker({
        multiple: false,
        types: getPickerTypes(mode),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null;
      }
      // Fall back to <input type="file"> if picker fails in restricted contexts
    }
    if (handle) {
      try {
        const file = await handle.getFile();
        return await readFileObject(file, handle);
      } catch (err) {
        console.error('Failed to read file:', err);
        return null;
      }
    }
  }

  return openFileViaInput(mode);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function writeWithHandle(
  handle: FileSystemFileHandleLike,
  data: string | Uint8Array
): Promise<void> {
  const writable = await handle.createWritable();
  if (typeof data === 'string') {
    await writable.write(data);
  } else {
    const copy = new Uint8Array(data.byteLength);
    copy.set(data);
    await writable.write(copy.buffer);
  }
  await writable.close();
}

/**
 * Saves a `.sql` file. If `existingHandle` is provided (e.g. for Ctrl/Cmd+S),
 * writes directly back to that file handle without prompting.
 */
export async function saveSqlFile(
  content: string,
  suggestedName = 'query.sql',
  existingHandle?: FileSystemFileHandleLike | null
): Promise<SavedFileResult | null> {
  if (existingHandle) {
    await writeWithHandle(existingHandle, content);
    addRecentFile(existingHandle.name, 'sql');
    return { name: existingHandle.name, handle: existingHandle };
  }

  if (typeof window !== 'undefined') {
    const win = window as WindowWithFsAccess;
    if (typeof win.showSaveFilePicker === 'function') {
      try {
        const handle = await win.showSaveFilePicker({
          suggestedName,
          types: getPickerTypes('sql'),
        });
        await writeWithHandle(handle, content);
        addRecentFile(handle.name, 'sql');
        return { name: handle.name, handle };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null;
        }
      }
    }
  }

  const blob = new Blob([content], { type: 'text/sql;charset=utf-8;' });
  downloadBlob(blob, suggestedName);
  addRecentFile(suggestedName, 'sql');
  return { name: suggestedName };
}

/**
 * Saves a binary `.sqlite` / `.db` file. If `existingHandle` is provided,
 * writes directly back to that file handle without prompting.
 */
export async function saveBinaryFile(
  data: Uint8Array,
  suggestedName = 'database.sqlite',
  existingHandle?: FileSystemFileHandleLike | null
): Promise<SavedFileResult | null> {
  if (existingHandle) {
    await writeWithHandle(existingHandle, data);
    addRecentFile(existingHandle.name, 'sqlite');
    return { name: existingHandle.name, handle: existingHandle };
  }

  if (typeof window !== 'undefined') {
    const win = window as WindowWithFsAccess;
    if (typeof win.showSaveFilePicker === 'function') {
      try {
        const handle = await win.showSaveFilePicker({
          suggestedName,
          types: getPickerTypes('sqlite'),
        });
        await writeWithHandle(handle, data);
        addRecentFile(handle.name, 'sqlite');
        return { name: handle.name, handle };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null;
        }
      }
    }
  }

  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  const blob = new Blob([copy.buffer], { type: 'application/x-sqlite3' });
  downloadBlob(blob, suggestedName);
  addRecentFile(suggestedName, 'sqlite');
  return { name: suggestedName };
}

export function getRecentFiles(): RecentFileEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_FILES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentFileEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.name === 'string' &&
        (item.kind === 'sql' || item.kind === 'sqlite') &&
        typeof item.openedAt === 'number'
    );
  } catch {
    return [];
  }
}

export function addRecentFile(name: string, kind: SupportedFileKind): RecentFileEntry[] {
  const existing = getRecentFiles().filter(
    (entry) => !(entry.name === name && entry.kind === kind)
  );
  const updated: RecentFileEntry[] = [
    { name, kind, openedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_RECENT_FILES);

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(RECENT_FILES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  }
  return updated;
}

export function clearRecentFiles(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_FILES_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
