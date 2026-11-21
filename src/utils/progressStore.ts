export const PROGRESS_STORAGE_KEY = 'sql_trainer_completed_tasks_v1';
export const LEGACY_PROGRESS_STORAGE_KEY = 'sql-trainer-completed-tasks';

function parseTaskIdList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
  } catch {
    return [];
  }
}

function deduplicateIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (typeof id === 'string' && id.length > 0 && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

/**
 * Loads completed task IDs from localStorage, migrating/merging from the legacy
 * TaskTrainer storage key if present.
 */
export function loadCompletedTaskIds(): string[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const currentRaw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_PROGRESS_STORAGE_KEY);

    if (currentRaw !== null) {
      return deduplicateIds(parseTaskIdList(currentRaw));
    }

    if (legacyRaw !== null) {
      const migrated = deduplicateIds(parseTaskIdList(legacyRaw));
      if (migrated.length > 0) {
        saveCompletedTaskIds(migrated);
      }
      return migrated;
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Persists completed task IDs to localStorage (and mirrors to the legacy key
 * so existing TaskTrainer state stays compatible).
 */
export function saveCompletedTaskIds(ids: string[]): string[] {
  const normalized = deduplicateIds(ids);
  if (typeof localStorage === 'undefined') return normalized;

  try {
    const serialized = JSON.stringify(normalized);
    localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_PROGRESS_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota or security errors
  }

  return normalized;
}

/**
 * Marks a single task ID as completed and persists the updated list.
 */
export function markTaskCompleted(id: string): string[] {
  const current = loadCompletedTaskIds();
  if (!id || current.includes(id)) {
    return current;
  }
  return saveCompletedTaskIds([...current, id]);
}

/**
 * Removes a single task ID from the completed list and persists the result.
 */
export function resetTaskProgress(id: string): string[] {
  const current = loadCompletedTaskIds();
  const next = current.filter((item) => item !== id);
  return saveCompletedTaskIds(next);
}

/**
 * Removes all task IDs belonging to a learning path from the completed list.
 */
export function resetPathProgress(taskIds: string[]): string[] {
  const toRemove = new Set(taskIds);
  const current = loadCompletedTaskIds();
  const next = current.filter((item) => !toRemove.has(item));
  return saveCompletedTaskIds(next);
}
