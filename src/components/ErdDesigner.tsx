import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Database,
  Download,
  GripVertical,
  KeyRound,
  Link2,
  Network,
  Plus,
  RotateCcw,
  Save,
  Table2,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  DEFAULT_ERD_MODEL,
  generateSqlFromErd,
  normalizeErdModel,
  sanitizeIdentifier,
  type ErdCardinality,
  type ErdColumn,
  type ErdEntity,
  type ErdModel,
  type ErdRelation,
} from '@/engine/erdToSql';
import type { Language } from '@/i18n/translations';
import type { SqlDialect } from '@/types/sql';
import {
  createErdModelId,
  getSavedErdModel,
  saveErdModel,
  type SavedErdModel,
} from '@/utils/savedErdStore';

export interface ErdDesignerProps {
  dialect: SqlDialect;
  language: Language;
  onCreateDatabase: (sql: string, dbName: string) => void;
  onBack?: () => void;
  activeModel?: SavedErdModel | null;
  onSavedModelsChange?: () => void;
}

const STORAGE_KEY = 'sqltrainer_erd_model_v1';
const CARD_WIDTH = 280;
const CARD_HEADER_HEIGHT = 42;
const CARD_ROW_HEIGHT = 34;
const CARD_FOOTER_HEIGHT = 36;
const JUNCTION_CARD_WIDTH = 236;
const JUNCTION_CARD_HEIGHT = 108;

const COLUMN_TYPES = [
  'INT',
  'VARCHAR(255)',
  'VARCHAR(100)',
  'TEXT',
  'DECIMAL(10,2)',
  'DATE',
  'DATETIME',
  'BOOLEAN',
];

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadInitialModel(): ErdModel {
  if (typeof window === 'undefined') return DEFAULT_ERD_MODEL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ERD_MODEL;
    const normalized = normalizeErdModel(JSON.parse(raw));
    if (normalized) return normalized;
  } catch {
    // Ignore malformed localStorage data
  }
  return DEFAULT_ERD_MODEL;
}

function estimateCardHeight(entity: ErdEntity): number {
  return CARD_HEADER_HEIGHT + Math.max(1, entity.columns.length) * CARD_ROW_HEIGHT + CARD_FOOTER_HEIGHT;
}

function getCardinalityLabels(cardinality: ErdCardinality): { from: string; to: string } {
  switch (cardinality) {
    case '1:1':
      return { from: '1', to: '1' };
    case '1:N':
      return { from: '1', to: 'N' };
    case 'N:M':
      return { from: 'N', to: 'M' };
  }
}

interface JunctionCardInfo {
  relationId: string;
  tableName: string;
  fromEntity: ErdEntity;
  toEntity: ErdEntity;
  col1Name: string;
  col2Name: string;
  x: number;
  y: number;
  label?: string;
}

function getPrimaryKeyColumnName(entity: ErdEntity): string {
  const pk = entity.columns.find((c) => c.primaryKey);
  return sanitizeIdentifier(pk?.name ?? '', 'id');
}

export const ErdDesigner: React.FC<ErdDesignerProps> = ({
  dialect,
  language,
  onCreateDatabase,
  onBack,
  activeModel,
  onSavedModelsChange,
}) => {
  const isDe = language === 'de';
  const defaultDbName = isDe ? 'mein_projekt' : 'my_project';

  const [model, setModel] = useState<ErdModel>(() =>
    activeModel
      ? { entities: activeModel.entities, relations: activeModel.relations }
      : loadInitialModel()
  );
  const [dbName, setDbName] = useState<string>(() => activeModel?.name ?? defaultDbName);
  const [currentModelId, setCurrentModelId] = useState<string | null>(
    () => activeModel?.id ?? null
  );
  const [copied, setCopied] = useState(false);
  const [modelSaved, setModelSaved] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Relation creator state
  const [showRelForm, setShowRelForm] = useState(false);
  const [relFromId, setRelFromId] = useState<string>(() => model.entities[0]?.id ?? '');
  const [relToId, setRelToId] = useState<string>(() => model.entities[1]?.id ?? model.entities[0]?.id ?? '');
  const [relCardinality, setRelCardinality] = useState<ErdCardinality>('1:N');
  const [relLabel, setRelLabel] = useState<string>('');

  // Dragging state
  const dragRef = useRef<{
    entityId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load activeModel when prop changes
  useEffect(() => {
    if (activeModel) {
      setModel({
        entities: activeModel.entities,
        relations: activeModel.relations,
      });
      setDbName(activeModel.name);
      setCurrentModelId(activeModel.id);
      setJsonError(null);
    } else if (activeModel === null) {
      setCurrentModelId(null);
    }
  }, [activeModel]);

  // Persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    } catch {
      // Ignore storage quota errors
    }
  }, [model]);

  // Keep relation form entity IDs valid when entities change
  useEffect(() => {
    if (model.entities.length === 0) return;
    if (!model.entities.some((e) => e.id === relFromId)) {
      setRelFromId(model.entities[0].id);
    }
    if (!model.entities.some((e) => e.id === relToId)) {
      setRelToId(model.entities[1]?.id ?? model.entities[0].id);
    }
  }, [model.entities, relFromId, relToId]);

  // Global pointer drag listeners
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const nextX = Math.max(16, Math.round(drag.origX + dx));
      const nextY = Math.max(16, Math.round(drag.origY + dy));

      setModel((prev) => ({
        ...prev,
        entities: prev.entities.map((ent) =>
          ent.id === drag.entityId ? { ...ent, x: nextX, y: nextY } : ent
        ),
      }));
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const generatedSql = useMemo(
    () => generateSqlFromErd(model.entities, model.relations, dialect),
    [model.entities, model.relations, dialect]
  );

  const handleStartDrag = (e: React.PointerEvent, entity: ErdEntity) => {
    e.preventDefault();
    dragRef.current = {
      entityId: entity.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: entity.x,
      origY: entity.y,
    };
  };

  const handleAddEntity = () => {
    const idx = model.entities.length + 1;
    const offset = (model.entities.length % 5) * 40;
    const newEntity: ErdEntity = {
      id: createId('ent'),
      name: `tabelle_${idx}`,
      x: 80 + offset + ((model.entities.length % 3) * 310),
      y: 80 + offset + (Math.floor(model.entities.length / 3) * 230),
      columns: [
        {
          id: createId('col'),
          name: 'id',
          type: 'INT',
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
          unique: false,
        },
        {
          id: createId('col'),
          name: 'bezeichnung',
          type: 'VARCHAR(100)',
          primaryKey: false,
          autoIncrement: false,
          notNull: true,
          unique: false,
        },
      ],
    };
    setModel((prev) => ({
      ...prev,
      entities: [...prev.entities, newEntity],
    }));
  };

  const handleDeleteEntity = (entityId: string) => {
    setModel((prev) => ({
      entities: prev.entities.filter((e) => e.id !== entityId),
      relations: prev.relations.filter(
        (r) => r.fromEntityId !== entityId && r.toEntityId !== entityId
      ),
    }));
  };

  const handleRenameEntity = (entityId: string, name: string) => {
    setModel((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => (e.id === entityId ? { ...e, name } : e)),
    }));
  };

  const handleAddColumn = (entityId: string) => {
    setModel((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => {
        if (e.id !== entityId) return e;
        const newCol: ErdColumn = {
          id: createId('col'),
          name: `spalte_${e.columns.length + 1}`,
          type: 'VARCHAR(100)',
          primaryKey: false,
          autoIncrement: false,
          notNull: false,
          unique: false,
        };
        return { ...e, columns: [...e.columns, newCol] };
      }),
    }));
  };

  const handleUpdateColumn = (
    entityId: string,
    columnId: string,
    patch: Partial<ErdColumn>
  ) => {
    setModel((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => {
        if (e.id !== entityId) return e;
        return {
          ...e,
          columns: e.columns.map((c) => (c.id === columnId ? { ...c, ...patch } : c)),
        };
      }),
    }));
  };

  const handleDeleteColumn = (entityId: string, columnId: string) => {
    setModel((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => {
        if (e.id !== entityId) return e;
        return { ...e, columns: e.columns.filter((c) => c.id !== columnId) };
      }),
    }));
  };

  const handleAddRelation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relFromId || !relToId) return;
    const newRel: ErdRelation = {
      id: createId('rel'),
      fromEntityId: relFromId,
      toEntityId: relToId,
      cardinality: relCardinality,
      label: relLabel.trim() || undefined,
    };
    setModel((prev) => ({
      ...prev,
      relations: [...prev.relations, newRel],
    }));
    setRelLabel('');
    setShowRelForm(false);
  };

  const handleUpdateRelationCardinality = (
    relationId: string,
    cardinality: ErdCardinality
  ) => {
    setModel((prev) => ({
      ...prev,
      relations: prev.relations.map((r) =>
        r.id === relationId ? { ...r, cardinality } : r
      ),
    }));
  };

  const handleDeleteRelation = (relationId: string) => {
    setModel((prev) => ({
      ...prev,
      relations: prev.relations.filter((r) => r.id !== relationId),
    }));
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(generatedSql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard is unavailable
    }
  };

  const handleSaveModel = () => {
    const trimmedName = dbName.trim() || defaultDbName;
    const now = Date.now();
    const existingId = currentModelId ?? activeModel?.id ?? null;
    const existing = existingId ? getSavedErdModel(existingId) : null;
    const saved = saveErdModel({
      id: existing ? existing.id : createErdModelId(),
      name: trimmedName,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      entities: model.entities,
      relations: model.relations,
    });
    setCurrentModelId(saved.id);
    setModelSaved(true);
    window.setTimeout(() => setModelSaved(false), 1800);
    onSavedModelsChange?.();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(model, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dbName.trim() || 'erd-modell'}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const normalized = normalizeErdModel(JSON.parse(String(reader.result)));
        if (!normalized) {
          throw new Error('Invalid ERD JSON');
        }
        setModel(normalized);
      } catch {
        setJsonError(
          isDe
            ? 'Ungültige ER-Modell-JSON-Datei.'
            : 'Invalid ER model JSON file.'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    setModel(DEFAULT_ERD_MODEL);
    setJsonError(null);
  };

  const entityMap = useMemo(() => {
    const map = new Map<string, ErdEntity>();
    for (const ent of model.entities) {
      map.set(ent.id, ent);
    }
    return map;
  }, [model.entities]);

  const junctionCards = useMemo<JunctionCardInfo[]>(() => {
    const cards: JunctionCardInfo[] = [];
    for (const rel of model.relations) {
      if (rel.cardinality !== 'N:M') continue;
      const fromEnt = entityMap.get(rel.fromEntityId);
      const toEnt = entityMap.get(rel.toEntityId);
      if (!fromEnt || !toEnt) continue;

      const fromName = sanitizeIdentifier(fromEnt.name, 'tabelle_1');
      const toName = sanitizeIdentifier(toEnt.name, 'tabelle_2');
      const fromPk = getPrimaryKeyColumnName(fromEnt);
      const toPk = getPrimaryKeyColumnName(toEnt);

      const isSelfRef = fromEnt.id === toEnt.id;
      const tableName = isSelfRef ? `${fromName}_${fromName}_rel` : `${fromName}_${toName}`;
      let col1Name = `${fromName}_${fromPk}`;
      let col2Name = `${toName}_${toPk}`;
      if (col1Name.toLowerCase() === col2Name.toLowerCase()) {
        col1Name = `${col1Name}_1`;
        col2Name = `${col2Name}_2`;
      }

      const fromH = estimateCardHeight(fromEnt);
      const toH = estimateCardHeight(toEnt);

      let x: number;
      let y: number;
      if (isSelfRef) {
        x = fromEnt.x + CARD_WIDTH + 64;
        y = Math.max(16, Math.round(fromEnt.y + fromH / 2 - JUNCTION_CARD_HEIGHT / 2));
      } else {
        const fromCenterX = fromEnt.x + CARD_WIDTH / 2;
        const fromCenterY = fromEnt.y + fromH / 2;
        const toCenterX = toEnt.x + CARD_WIDTH / 2;
        const toCenterY = toEnt.y + toH / 2;
        x = Math.max(16, Math.round((fromCenterX + toCenterX) / 2 - JUNCTION_CARD_WIDTH / 2));
        y = Math.max(16, Math.round((fromCenterY + toCenterY) / 2 - JUNCTION_CARD_HEIGHT / 2));
      }

      cards.push({
        relationId: rel.id,
        tableName,
        fromEntity: fromEnt,
        toEntity: toEnt,
        col1Name,
        col2Name,
        x,
        y,
        label: rel.label,
      });
    }
    return cards;
  }, [model.relations, entityMap]);

  const junctionMap = useMemo(() => {
    const map = new Map<string, JunctionCardInfo>();
    for (const card of junctionCards) {
      map.set(card.relationId, card);
    }
    return map;
  }, [junctionCards]);

  const canvasWidth = useMemo(() => {
    const maxEntityX = model.entities.reduce(
      (acc, e) => Math.max(acc, e.x + CARD_WIDTH + 120),
      960
    );
    const maxJunctionX = junctionCards.reduce(
      (acc, j) => Math.max(acc, j.x + JUNCTION_CARD_WIDTH + 120),
      960
    );
    return Math.max(960, maxEntityX, maxJunctionX);
  }, [model.entities, junctionCards]);

  const canvasHeight = useMemo(() => {
    const maxEntityY = model.entities.reduce(
      (acc, e) => Math.max(acc, e.y + estimateCardHeight(e) + 120),
      620
    );
    const maxJunctionY = junctionCards.reduce(
      (acc, j) => Math.max(acc, j.y + JUNCTION_CARD_HEIGHT + 120),
      620
    );
    return Math.max(620, maxEntityY, maxJunctionY);
  }, [model.entities, junctionCards]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {isDe ? 'Zurück' : 'Back'}
            </button>
          )}
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h1 className="text-sm font-semibold tracking-tight">
              {isDe ? 'ER-Modell-Designer' : 'ER Diagram Designer'}
            </h1>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={handleAddEntity}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {isDe ? 'Tabelle hinzufügen' : 'Add Table'}
          </button>

          <button
            type="button"
            onClick={() => setShowRelForm((v) => !v)}
            disabled={model.entities.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {isDe ? 'Beziehung hinzufügen' : 'Add Relation'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDe ? 'ER-Modell speichern (.json)' : 'Save ER model (.json)'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isDe ? 'ER-Modell speichern (.json)' : 'Save ER Model (.json)'}
            </span>
            <span className="md:hidden">.json</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDe ? 'ER-Modell laden (.json)' : 'Load ER model (.json)'}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isDe ? 'ER-Modell laden (.json)' : 'Load ER Model (.json)'}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={isDe ? 'Standardmodell wiederherstellen' : 'Reset to default model'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDe ? 'Reset' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Inline Relation Creator Bar */}
      {showRelForm && model.entities.length > 0 && (
        <form
          onSubmit={handleAddRelation}
          className="flex flex-wrap items-center gap-2 px-4 py-2 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-900/60 text-xs shrink-0"
        >
          <span className="font-semibold text-blue-800 dark:text-blue-300">
            {isDe ? 'Neue Beziehung:' : 'New Relation:'}
          </span>
          <select
            value={relFromId}
            onChange={(e) => setRelFromId(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          >
            {model.entities.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.name}
              </option>
            ))}
          </select>

          <select
            value={relCardinality}
            onChange={(e) => setRelCardinality(e.target.value as ErdCardinality)}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold text-xs"
          >
            <option value="1:1">1:1</option>
            <option value="1:N">1:N</option>
            <option value="N:M">N:M</option>
          </select>

          <select
            value={relToId}
            onChange={(e) => setRelToId(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          >
            {model.entities.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={relLabel}
            onChange={(e) => setRelLabel(e.target.value)}
            placeholder={isDe ? 'Label (optional, z.B. schreibt)' : 'Label (optional)'}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-44"
          />

          <button
            type="submit"
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            {isDe ? 'Verbinden' : 'Connect'}
          </button>
          <button
            type="button"
            onClick={() => setShowRelForm(false)}
            className="px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            {isDe ? 'Abbrechen' : 'Cancel'}
          </button>
        </form>
      )}

      {jsonError && (
        <div className="px-4 py-1.5 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
          {jsonError}
        </div>
      )}

      {/* Main Split: Canvas + Live SQL Panel */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Interactive ER Canvas */}
        <div className="flex-1 overflow-auto bg-graph-paper relative min-h-[360px]">
          <div
            className="relative"
            style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          >
            {/* SVG Relationship Lines */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={canvasWidth}
              height={canvasHeight}
            >
              {model.relations.map((rel) => {
                const fromEnt = entityMap.get(rel.fromEntityId);
                const toEnt = entityMap.get(rel.toEntityId);
                if (!fromEnt || !toEnt) return null;

                const fromH = estimateCardHeight(fromEnt);
                const toH = estimateCardHeight(toEnt);

                // N:M relation routed through the visual junction table card (1 -> N / N <- 1)
                if (rel.cardinality === 'N:M') {
                  const junction = junctionMap.get(rel.id);
                  if (!junction) return null;

                  const jCenterX = junction.x + JUNCTION_CARD_WIDTH / 2;
                  const jCenterY = junction.y + JUNCTION_CARD_HEIGHT / 2;

                  const renderSegment = (
                    ent: ErdEntity,
                    entH: number,
                    keySuffix: string,
                    yOffset: number
                  ) => {
                    const entCenterX = ent.x + CARD_WIDTH / 2;
                    const entCenterY = ent.y + entH / 2 + yOffset;
                    const entOnLeft = entCenterX <= jCenterX;
                    const x1 = entOnLeft ? ent.x + CARD_WIDTH : ent.x;
                    const y1 = entCenterY;
                    const x2 = entOnLeft ? junction.x : junction.x + JUNCTION_CARD_WIDTH;
                    const y2 = jCenterY + yOffset;
                    const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
                    const c1x = entOnLeft ? x1 + dx : x1 - dx;
                    const c2x = entOnLeft ? x2 - dx : x2 + dx;
                    const d = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
                    const b1x = entOnLeft ? x1 + 16 : x1 - 16;
                    const b2x = entOnLeft ? x2 - 16 : x2 + 16;

                    return (
                      <g key={`${rel.id}_${keySuffix}`}>
                        <path
                          d={d}
                          fill="none"
                          stroke="currentColor"
                          className="text-violet-400 dark:text-violet-500"
                          strokeWidth={2}
                          strokeDasharray="5 3"
                        />
                        <g transform={`translate(${b1x}, ${y1})`}>
                          <rect
                            x={-11}
                            y={-10}
                            width={22}
                            height={20}
                            rx={5}
                            className="fill-blue-600"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-white text-[11px] font-mono font-bold"
                          >
                            1
                          </text>
                        </g>
                        <g transform={`translate(${b2x}, ${y2})`}>
                          <rect
                            x={-11}
                            y={-10}
                            width={22}
                            height={20}
                            rx={5}
                            className="fill-violet-600"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-white text-[11px] font-mono font-bold"
                          >
                            N
                          </text>
                        </g>
                      </g>
                    );
                  };

                  const isSelfRef = fromEnt.id === toEnt.id;
                  return (
                    <g key={rel.id}>
                      {renderSegment(fromEnt, fromH, 'from', isSelfRef ? -16 : 0)}
                      {renderSegment(toEnt, toH, 'to', isSelfRef ? 16 : 0)}
                    </g>
                  );
                }

                // Self-referencing loop (1:1 or 1:N)
                if (fromEnt.id === toEnt.id) {
                  const x = fromEnt.x + CARD_WIDTH;
                  const y1 = fromEnt.y + 30;
                  const y2 = fromEnt.y + Math.min(fromH - 20, 80);
                  const d = `M ${x} ${y1} C ${x + 70} ${y1 - 20}, ${x + 70} ${y2 + 20}, ${x} ${y2}`;
                  const labels = getCardinalityLabels(rel.cardinality);
                  return (
                    <g key={rel.id}>
                      <path
                        d={d}
                        fill="none"
                        stroke="currentColor"
                        className="text-blue-500 dark:text-blue-400"
                        strokeWidth={2}
                      />
                      <g transform={`translate(${x + 14}, ${y1 - 6})`}>
                        <rect
                          x={-11}
                          y={-10}
                          width={22}
                          height={20}
                          rx={5}
                          className="fill-blue-600"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-white text-[11px] font-mono font-bold"
                        >
                          {labels.from}
                        </text>
                      </g>
                      <g transform={`translate(${x + 14}, ${y2 + 6})`}>
                        <rect
                          x={-11}
                          y={-10}
                          width={22}
                          height={20}
                          rx={5}
                          className="fill-emerald-600"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-white text-[11px] font-mono font-bold"
                        >
                          {labels.to}
                        </text>
                      </g>
                    </g>
                  );
                }

                const fromCenterX = fromEnt.x + CARD_WIDTH / 2;
                const fromCenterY = fromEnt.y + fromH / 2;
                const toCenterX = toEnt.x + CARD_WIDTH / 2;
                const toCenterY = toEnt.y + toH / 2;

                const fromOnLeft = fromCenterX <= toCenterX;
                const x1 = fromOnLeft ? fromEnt.x + CARD_WIDTH : fromEnt.x;
                const y1 = fromCenterY;
                const x2 = fromOnLeft ? toEnt.x : toEnt.x + CARD_WIDTH;
                const y2 = toCenterY;

                const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
                const c1x = fromOnLeft ? x1 + dx : x1 - dx;
                const c2x = fromOnLeft ? x2 - dx : x2 + dx;
                const pathD = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;

                const badge1X = fromOnLeft ? x1 + 16 : x1 - 16;
                const badge2X = fromOnLeft ? x2 - 16 : x2 + 16;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const labels = getCardinalityLabels(rel.cardinality);

                return (
                  <g key={rel.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-400 dark:text-slate-500"
                      strokeWidth={2}
                    />
                    {/* From cardinality badge */}
                    <g transform={`translate(${badge1X}, ${y1})`}>
                      <rect
                        x={-11}
                        y={-10}
                        width={22}
                        height={20}
                        rx={5}
                        className="fill-blue-600"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-white text-[11px] font-mono font-bold"
                      >
                        {labels.from}
                      </text>
                    </g>
                    {/* To cardinality badge */}
                    <g transform={`translate(${badge2X}, ${y2})`}>
                      <rect
                        x={-11}
                        y={-10}
                        width={22}
                        height={20}
                        rx={5}
                        className="fill-emerald-600"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-white text-[11px] font-mono font-bold"
                      >
                        {labels.to}
                      </text>
                    </g>
                    {/* Optional middle label */}
                    {rel.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-(rel.label.length * 3.5 + 10)}
                          y={-10}
                          width={rel.label.length * 7 + 20}
                          height={20}
                          rx={10}
                          className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
                          strokeWidth={1}
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-slate-700 dark:fill-slate-200 text-[11px] font-medium"
                        >
                          {rel.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Draggable Entity Cards */}
            {model.entities.map((entity) => (
              <div
                key={entity.id}
                style={{
                  left: `${entity.x}px`,
                  top: `${entity.y}px`,
                  width: `${CARD_WIDTH}px`,
                }}
                className="absolute rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md overflow-hidden"
              >
                {/* Card Header (Drag Handle) */}
                <div
                  onPointerDown={(e) => handleStartDrag(e, entity)}
                  className="flex items-center justify-between gap-1.5 px-2.5 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing select-none"
                >
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <Table2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <input
                      type="text"
                      value={entity.name}
                      onPointerDown={(e) => e.stopPropagation()}
                      onChange={(e) => handleRenameEntity(entity.id, e.target.value)}
                      aria-label={isDe ? 'Tabellenname' : 'Table name'}
                      className="w-full min-w-0 bg-transparent text-xs font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleDeleteEntity(entity.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                    title={isDe ? 'Tabelle löschen' : 'Delete table'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Columns */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {entity.columns.map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateColumn(entity.id, col.id, {
                            primaryKey: !col.primaryKey,
                            notNull: !col.primaryKey ? true : col.notNull,
                            autoIncrement: !col.primaryKey ? col.autoIncrement : false,
                          })
                        }
                        title="PRIMARY KEY"
                        className={`px-1 py-0.5 rounded font-mono text-[9px] font-bold shrink-0 ${
                          col.primaryKey
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                            : 'text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        {col.primaryKey ? (
                          <KeyRound className="w-2.5 h-2.5 inline" />
                        ) : (
                          'PK'
                        )}
                      </button>

                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) =>
                          handleUpdateColumn(entity.id, col.id, { name: e.target.value })
                        }
                        aria-label={isDe ? 'Spaltenname' : 'Column name'}
                        className="w-20 min-w-0 flex-1 bg-transparent font-mono text-[11px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                      />

                      <select
                        value={col.type}
                        onChange={(e) =>
                          handleUpdateColumn(entity.id, col.id, { type: e.target.value })
                        }
                        className="w-24 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded px-1 py-0.5 border border-slate-200 dark:border-slate-700"
                      >
                        {COLUMN_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateColumn(entity.id, col.id, {
                            autoIncrement: !col.autoIncrement,
                          })
                        }
                        disabled={!col.primaryKey}
                        title="AUTO_INCREMENT"
                        className={`px-1 py-0.5 rounded font-mono text-[9px] font-semibold shrink-0 disabled:opacity-30 ${
                          col.autoIncrement
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        AI
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateColumn(entity.id, col.id, { notNull: !col.notNull })
                        }
                        title="NOT NULL"
                        className={`px-1 py-0.5 rounded font-mono text-[9px] font-semibold shrink-0 ${
                          col.notNull
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        NN
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateColumn(entity.id, col.id, { unique: !col.unique })
                        }
                        title="UNIQUE"
                        className={`px-1 py-0.5 rounded font-mono text-[9px] font-semibold shrink-0 ${
                          col.unique
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                            : 'text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        UQ
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(entity.id, col.id)}
                        className="p-0.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 shrink-0"
                        title={isDe ? 'Spalte entfernen' : 'Remove column'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleAddColumn(entity.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    {isDe ? 'Spalte hinzufügen' : 'Add column'}
                  </button>
                </div>
              </div>
            ))}

            {/* Visual N:M Junction Table Cards */}
            {junctionCards.map((junction) => (
              <div
                key={`junction_${junction.relationId}`}
                style={{
                  left: `${junction.x}px`,
                  top: `${junction.y}px`,
                  width: `${JUNCTION_CARD_WIDTH}px`,
                }}
                className="absolute rounded-lg border-2 border-violet-400/80 dark:border-violet-500/70 bg-violet-50/95 dark:bg-violet-950/90 shadow-md overflow-hidden"
              >
                <div className="px-2.5 py-1.5 bg-violet-100/90 dark:bg-violet-900/60 border-b border-violet-200 dark:border-violet-800">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide bg-violet-600 text-white">
                      {isDe ? 'N:M Zwischentabelle' : 'N:M Junction Table'}
                    </span>
                    {junction.label && (
                      <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300 truncate">
                        {junction.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Table2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="text-xs font-bold font-mono text-violet-950 dark:text-violet-100 truncate">
                      {junction.tableName}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-violet-200/70 dark:divide-violet-800/60">
                  {[junction.col1Name, junction.col2Name].map((colName, idx) => (
                    <div
                      key={`${junction.relationId}_col_${idx}`}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="px-1 py-0.5 rounded font-mono text-[9px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
                          PK / FK
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-100 truncate">
                          {colName}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-violet-700 dark:text-violet-300 shrink-0">
                        INT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right / Bottom Live SQL & Relations Panel */}
        <aside className="w-full lg:w-[390px] xl:w-[430px] h-72 lg:h-full flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          {/* Relations List */}
          {model.relations.length > 0 && (
            <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {isDe ? 'Beziehungen' : 'Relations'} ({model.relations.length})
              </div>
              <div className="space-y-1">
                {model.relations.map((rel) => {
                  const fromName = entityMap.get(rel.fromEntityId)?.name ?? '?';
                  const toName = entityMap.get(rel.toEntityId)?.name ?? '?';
                  return (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between gap-2 text-xs px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70"
                    >
                      <span className="font-mono truncate">
                        {fromName} → {toName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <select
                          value={rel.cardinality}
                          onChange={(e) =>
                            handleUpdateRelationCardinality(
                              rel.id,
                              e.target.value as ErdCardinality
                            )
                          }
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-[11px]"
                        >
                          <option value="1:1">1:1</option>
                          <option value="1:N">1:N</option>
                          <option value="N:M">N:M</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteRelation(rel.id)}
                          className="p-0.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          title={isDe ? 'Beziehung löschen' : 'Delete relation'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live SQL Header */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {isDe ? 'Live-SQL-Vorschau' : 'Live SQL Preview'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {dialect}
            </span>
          </div>

          {/* SQL Output */}
          <pre className="flex-1 p-3.5 overflow-auto font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-950/60 whitespace-pre-wrap">
            {generatedSql}
          </pre>

          {/* Action Footer */}
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="erd-db-name"
                className="text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0"
              >
                {isDe ? 'DB-Name:' : 'DB Name:'}
              </label>
              <input
                id="erd-db-name"
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                placeholder={defaultDbName}
                aria-label={isDe ? 'Datenbankname' : 'Database name'}
                className="flex-1 min-w-0 px-2.5 py-1 text-xs font-mono rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                onCreateDatabase(generatedSql, dbName.trim() || defaultDbName)
              }
              disabled={model.entities.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-sm transition-colors"
            >
              <Database className="w-4 h-4" />
              {isDe
                ? 'Datenbank jetzt im Editor erstellen'
                : 'Create database in editor'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSaveModel}
                disabled={model.entities.length === 0}
                className="col-span-2 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 disabled:opacity-40 transition-colors"
              >
                {modelSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {isDe ? 'Modell gespeichert!' : 'Model saved!'}
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {isDe ? 'Modell speichern' : 'Save Model'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {isDe ? 'Kopiert!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {isDe ? '.sql kopieren' : 'Copy .sql'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {isDe ? 'Modell (.json)' : 'Save (.json)'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
