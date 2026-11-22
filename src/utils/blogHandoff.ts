import { SqlEngine } from '@/engine/sqlEngine';
import {
  createProjectId,
  saveDatabaseProject,
  type SavedDatabaseProject,
} from '@/utils/savedDbStore';

const HANDOFF_STORAGE_KEY = 'sql_trainer_blog_handoff_v1';

export type BlogHandoffAction =
  | { type: 'editor'; sql: string; dbId?: string }
  | { type: 'hub-project'; projectId: string };

export function queueBlogHandoff(action: BlogHandoffAction): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(HANDOFF_STORAGE_KEY, JSON.stringify(action));
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

export function consumeBlogHandoff(): BlogHandoffAction | null {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(HANDOFF_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    window.localStorage.removeItem(HANDOFF_STORAGE_KEY);
    const parsed = JSON.parse(raw) as Partial<BlogHandoffAction> | null;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    if (parsed.type === 'editor' && typeof parsed.sql === 'string') {
      return {
        type: 'editor',
        sql: parsed.sql,
        ...(typeof parsed.dbId === 'string' ? { dbId: parsed.dbId } : {}),
      };
    }
    if (parsed.type === 'hub-project' && typeof parsed.projectId === 'string') {
      return {
        type: 'hub-project',
        projectId: parsed.projectId,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function escapeSqlIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

export async function createProjectFromBlogSql(
  name: string,
  sql: string
): Promise<SavedDatabaseProject> {
  const safeName = name.trim() || 'Blog SQL';
  const engine = new SqlEngine(safeName);
  await engine.init();

  try {
    engine.loadSql(sql, 'mysql');
    const schema = engine.getSchema();
    const tableNames = schema.map((table) => table.name);

    let rowCountTotal = 0;
    for (const tableName of tableNames) {
      const countRes = engine.execute(
        `SELECT COUNT(*) FROM ${escapeSqlIdentifier(tableName)};`,
        'sqlite'
      );
      const countValue = Number(countRes[0]?.values[0]?.[0] ?? 0);
      if (Number.isFinite(countValue)) {
        rowCountTotal += countValue;
      }
    }

    const binary = engine.exportBinary();
    const now = Date.now();
    const project: SavedDatabaseProject = {
      id: createProjectId(),
      name: safeName,
      createdAt: now,
      updatedAt: now,
      tableCount: tableNames.length,
      rowCountTotal,
      tableNames,
      source: 'import',
      binary,
      lastSql: sql,
    };

    return await saveDatabaseProject(project);
  } finally {
    engine.close();
  }
}
