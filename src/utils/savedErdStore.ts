import { normalizeErdModel, type ErdEntity, type ErdRelation } from '@/engine/erdToSql';

export interface SavedErdModel {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  entities: ErdEntity[];
  relations: ErdRelation[];
}

export const SAVED_ERD_STORAGE_KEY = 'sql_trainer_saved_erd_models_v1';

let memoryModels: SavedErdModel[] = [];

function cloneModel(model: SavedErdModel): SavedErdModel {
  return {
    ...model,
    entities: model.entities.map((ent) => ({
      ...ent,
      columns: ent.columns.map((col) => ({ ...col })),
    })),
    relations: model.relations.map((rel) => ({ ...rel })),
  };
}

function isValidSavedErdModel(item: unknown): item is SavedErdModel {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<SavedErdModel>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.name === 'string' &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.updatedAt === 'number' &&
    normalizeErdModel({
      entities: candidate.entities,
      relations: candidate.relations,
    }) !== null
  );
}

function readModels(): SavedErdModel[] {
  if (typeof localStorage === 'undefined') {
    return memoryModels.map(cloneModel);
  }
  try {
    const raw = localStorage.getItem(SAVED_ERD_STORAGE_KEY);
    if (!raw) {
      return memoryModels.map(cloneModel);
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const valid = parsed.filter(isValidSavedErdModel).map(cloneModel);
    memoryModels = valid.map(cloneModel);
    return valid;
  } catch {
    return memoryModels.map(cloneModel);
  }
}

function writeModels(models: SavedErdModel[]): void {
  const cloned = models.map(cloneModel);
  memoryModels = cloned;
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(SAVED_ERD_STORAGE_KEY, JSON.stringify(cloned));
  } catch {
    // Fallback to in-memory store if localStorage is unavailable or full
  }
}

export function createErdModelId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `erd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function listSavedErdModels(): SavedErdModel[] {
  return readModels().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSavedErdModel(id: string): SavedErdModel | null {
  const found = readModels().find((m) => m.id === id);
  return found ? cloneModel(found) : null;
}

export function saveErdModel(model: SavedErdModel): SavedErdModel {
  const models = readModels();
  const toSave = cloneModel(model);
  const idx = models.findIndex((m) => m.id === toSave.id);
  if (idx >= 0) {
    models[idx] = toSave;
  } else {
    models.push(toSave);
  }
  writeModels(models);
  return cloneModel(toSave);
}

export function renameErdModel(id: string, newName: string): SavedErdModel | null {
  const models = readModels();
  const idx = models.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const trimmed = newName.trim();
  const updated: SavedErdModel = {
    ...models[idx],
    name: trimmed || models[idx].name,
    updatedAt: Date.now(),
  };
  models[idx] = updated;
  writeModels(models);
  return cloneModel(updated);
}

export function deleteErdModel(id: string): boolean {
  const models = readModels();
  const next = models.filter((m) => m.id !== id);
  if (next.length === models.length) {
    return false;
  }
  writeModels(next);
  return true;
}
