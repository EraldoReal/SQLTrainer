import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Network,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { DatabasePreset } from '../types/sql';
import { Language, localizeText } from '../i18n/translations';
import {
  getLearningPaths,
  getNextIncompleteLecture,
  type LearningPathId,
} from '../data/learningPaths';
import { isTauriEnvironment } from '../utils/fileManager';
import type { SavedDatabaseProject } from '../utils/savedDbStore';
import type { SavedErdModel } from '../utils/savedErdStore';

export interface AppHubProps {
  language: Language;
  presets: DatabasePreset[];
  completedIds: string[];
  savedProjects: SavedDatabaseProject[];
  activeProjectId: string | null;
  savedErdModels: SavedErdModel[];
  onCreateEmptyProject: (name: string) => void;
  onOpenSavedProject: (project: SavedDatabaseProject) => void;
  onRenameProject: (id: string, newName: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onExportProjectDb: (project: SavedDatabaseProject) => void;
  onOpenSavedErdModel: (model: SavedErdModel) => void;
  onRenameErdModel: (id: string, newName: string) => void;
  onDeleteErdModel: (id: string) => void;
  onSelectFreeDatabase: (dbId: string) => void;
  onOpenFile: () => void;
  onOpenErd: () => void;
  onStartLearningPath: (pathId: LearningPathId, taskId: string, databaseId: string) => void;
  onResetPathProgress: (taskIds: string[]) => void;
  onNavigate?: (path: string) => void;
}

const SOURCE_BADGES: Record<
  SavedDatabaseProject['source'],
  { labelDe: string; labelEn: string; classes: string }
> = {
  erd: {
    labelDe: 'ER-Designer',
    labelEn: 'ER Designer',
    classes:
      'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  },
  empty: {
    labelDe: 'Leer',
    labelEn: 'Empty',
    classes:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  clone: {
    labelDe: 'Kopie',
    labelEn: 'Copy',
    classes:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  import: {
    labelDe: 'Import',
    labelEn: 'Import',
    classes:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
};

const DB_BADGE_COLORS: Record<string, string> = {
  schule:
    'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  onlineshop:
    'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  kino:
    'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

const PATH_ACCENT_CLASSES: Record<number, string> = {
  1: 'from-blue-500 to-cyan-500',
  2: 'from-emerald-500 to-teal-500',
  3: 'from-violet-500 to-purple-500',
  4: 'from-amber-500 to-orange-500',
  5: 'from-rose-500 to-pink-500',
};

function formatUpdatedAt(timestamp: number, language: Language): string {
  try {
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleDateString();
  }
}

export const AppHub: React.FC<AppHubProps> = ({
  language,
  presets,
  completedIds,
  savedProjects,
  activeProjectId,
  savedErdModels,
  onCreateEmptyProject,
  onOpenSavedProject,
  onRenameProject,
  onDuplicateProject,
  onDeleteProject,
  onExportProjectDb,
  onOpenSavedErdModel,
  onRenameErdModel,
  onDeleteErdModel,
  onSelectFreeDatabase,
  onOpenFile,
  onOpenErd,
  onStartLearningPath,
  onResetPathProgress,
  onNavigate,
}) => {
  const inTauri = isTauriEnvironment();
  const learningPaths = getLearningPaths();
  const completedSet = new Set(completedIds);

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDbName, setNewDbName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [renamingErdId, setRenamingErdId] = useState<string | null>(null);
  const [renameErdDraft, setRenameErdDraft] = useState('');
  const [confirmDeleteErdId, setConfirmDeleteErdId] = useState<string | null>(null);

  const uniqueTaskIds = new Set<string>();
  for (const path of learningPaths) {
    for (const lecture of path.lectures) {
      uniqueTaskIds.add(lecture.taskId);
    }
  }
  const totalUniqueCompleted = Array.from(uniqueTaskIds).filter((id) =>
    completedSet.has(id)
  ).length;

  const schoolPresets = presets.filter((p) => p.id !== 'leer');

  const handleOpenCreateForm = () => {
    setNewDbName('');
    setIsCreatingNew(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDbName.trim();
    if (!trimmed) return;
    onCreateEmptyProject(trimmed);
    setNewDbName('');
    setIsCreatingNew(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-graph-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Header + Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3 h-3" />
              <span>
                {localizeText(
                  language,
                  'SQL-Trainer Hub · 100 % lokal im Browser',
                  'SQL-Trainer Hub · 100% local in your browser'
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {localizeText(
                language,
                'Womit möchtest du heute starten?',
                'What would you like to work on today?'
              )}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {localizeText(
                language,
                'Verwalte deine eigenen SQLite-Datenbanken mit Auto-Save, entwirf ER-Modelle oder lerne Schritt für Schritt in 5 Lernpfaden.',
                'Manage your own SQLite databases with auto-save, design ER models, or progress step by step through 5 learning paths.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Overall lecture progress */}
            <div className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {localizeText(language, 'Lernfortschritt', 'Lecture Progress')}
              </div>
              <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalUniqueCompleted} / {uniqueTaskIds.size}{' '}
                <span className="text-xs font-sans font-normal text-slate-500 dark:text-slate-400">
                  {localizeText(language, 'Lektionen', 'lectures')}
                </span>
              </div>
            </div>

            {/* + Neue leere Datenbank */}
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>
                {localizeText(language, 'Neue leere Datenbank', 'New Empty Database')}
              </span>
            </button>

            {/* + ER-Designer */}
            <button
              type="button"
              onClick={onOpenErd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-colors"
            >
              <Network className="w-4 h-4" />
              <span>{localizeText(language, '+ ER-Designer', '+ ER Designer')}</span>
            </button>
          </div>
        </div>

        {/* Inline New Empty Database Form */}
        {isCreatingNew && (
          <form
            onSubmit={handleSubmitCreate}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300 shrink-0">
              <Database className="w-4 h-4" />
              <span>
                {localizeText(language, 'Name der neuen Datenbank:', 'New database name:')}
              </span>
            </div>
            <input
              type="text"
              value={newDbName}
              onChange={(e) => setNewDbName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsCreatingNew(false);
                }
              }}
              autoFocus
              placeholder={localizeText(
                language,
                'z. B. Vereinsverwaltung, Bibliothek…',
                'e.g. Library, Club_DB…'
              )}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                disabled={!newDbName.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{localizeText(language, 'Erstellen & öffnen', 'Create & Open')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{localizeText(language, 'Abbrechen', 'Cancel')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Sektion 1: Meine gespeicherten Datenbanken (Projekte) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {localizeText(
                  language,
                  'Meine gespeicherten Datenbanken',
                  'My Saved Databases'
                )}
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {savedProjects.length}
              </span>
            </div>
          </div>

          {savedProjects.length === 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {localizeText(
                    language,
                    'Noch keine eigenen Datenbanken gespeichert',
                    'No saved databases yet'
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  {localizeText(
                    language,
                    'Erstelle eine leere Datenbank oder entwirf ein ER-Modell — alle Tabellen, Daten und SQL-Skripte werden automatisch lokal gespeichert.',
                    'Create an empty database or design an ER model — all tables, data, and SQL scripts are automatically saved locally.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shrink-0 transition-colors self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {localizeText(
                    language,
                    'Erste Datenbank anlegen',
                    'Create First Database'
                  )}
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {savedProjects.map((project) => {
                const badge = SOURCE_BADGES[project.source] ?? SOURCE_BADGES.empty;
                const isActive = project.id === activeProjectId;
                const isRenaming = renamingId === project.id;
                const isConfirmingDelete = confirmDeleteId === project.id;

                return (
                  <div
                    key={project.id}
                    className={`flex flex-col justify-between p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs transition-all space-y-3 ${
                      isActive
                        ? 'border-emerald-400 dark:border-emerald-600 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded border ${badge.classes}`}
                        >
                          {localizeText(language, badge.labelDe, badge.labelEn)}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          {formatUpdatedAt(project.updatedAt, language)}
                        </span>
                      </div>

                      {isRenaming ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const trimmed = renameDraft.trim();
                            if (trimmed) {
                              onRenameProject(project.id, trimmed);
                            }
                            setRenamingId(null);
                          }}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setRenamingId(null);
                              }
                            }}
                            autoFocus
                            className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold rounded border border-blue-400 dark:border-blue-600 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                          <button
                            type="submit"
                            title={localizeText(language, 'Speichern', 'Save')}
                            className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenamingId(null)}
                            title={localizeText(language, 'Abbrechen', 'Cancel')}
                            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {project.name}
                          </h3>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                              {localizeText(language, 'Aktiv', 'Active')}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span>
                          {project.tableCount}{' '}
                          {localizeText(
                            language,
                            project.tableCount === 1 ? 'Tabelle' : 'Tabellen',
                            project.tableCount === 1 ? 'table' : 'tables'
                          )}
                        </span>
                        <span>·</span>
                        <span>
                          {project.rowCountTotal}{' '}
                          {localizeText(
                            language,
                            project.rowCountTotal === 1 ? 'Zeile' : 'Zeilen',
                            project.rowCountTotal === 1 ? 'row' : 'rows'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onOpenSavedProject(project)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <span>{localizeText(language, 'Öffnen', 'Open')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRenameDraft(project.name);
                            setRenamingId(project.id);
                            setConfirmDeleteId(null);
                          }}
                          title={localizeText(language, 'Umbenennen', 'Rename')}
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDuplicateProject(project.id)}
                          title={localizeText(language, 'Duplizieren', 'Duplicate')}
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onExportProjectDb(project)}
                          title={localizeText(language, 'Export (.db)', 'Export (.db)')}
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 ml-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteProject(project.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                            >
                              {localizeText(language, 'Löschen', 'Delete')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDeleteId(project.id);
                              setRenamingId(null);
                            }}
                            title={localizeText(language, 'Löschen', 'Delete')}
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sektion 2: Meine ER-Modelle */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {localizeText(language, 'Meine ER-Modelle', 'My ER Models')}
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {savedErdModels.length}
              </span>
            </div>
          </div>

          {savedErdModels.length === 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {localizeText(
                    language,
                    'Noch keine ER-Modelle gespeichert',
                    'No saved ER models yet'
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  {localizeText(
                    language,
                    'Entwirf Tabellen und Beziehungen visuell im ER-Designer, speichere dein Modell oder erzeuge direkt eine SQLite-Datenbank daraus.',
                    'Design tables and relationships visually in the ER Designer, save your model, or generate a SQLite database directly from it.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenErd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-xs shrink-0 transition-colors self-start sm:self-center"
              >
                <Network className="w-4 h-4" />
                <span>
                  {localizeText(
                    language,
                    '+ Neues ER-Modell entwerfen',
                    '+ Design New ER Model'
                  )}
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {savedErdModels.map((erdModel) => {
                const isRenaming = renamingErdId === erdModel.id;
                const isConfirmingDelete = confirmDeleteErdId === erdModel.id;
                const entityCount = erdModel.entities.length;
                const relationCount = erdModel.relations.length;

                return (
                  <div
                    key={erdModel.id}
                    className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 shadow-xs transition-all space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded border bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                          {localizeText(language, 'ER-Modell', 'ER Model')}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          {formatUpdatedAt(erdModel.updatedAt, language)}
                        </span>
                      </div>

                      {isRenaming ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const trimmed = renameErdDraft.trim();
                            if (trimmed) {
                              onRenameErdModel(erdModel.id, trimmed);
                            }
                            setRenamingErdId(null);
                          }}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={renameErdDraft}
                            onChange={(e) => setRenameErdDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setRenamingErdId(null);
                              }
                            }}
                            autoFocus
                            className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold rounded border border-violet-400 dark:border-violet-600 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                          <button
                            type="submit"
                            title={localizeText(language, 'Speichern', 'Save')}
                            className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenamingErdId(null)}
                            title={localizeText(language, 'Abbrechen', 'Cancel')}
                            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {erdModel.name}
                        </h3>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span>
                          {entityCount}{' '}
                          {localizeText(
                            language,
                            entityCount === 1 ? 'Tabelle' : 'Tabellen',
                            entityCount === 1 ? 'table' : 'tables'
                          )}
                        </span>
                        <span>·</span>
                        <span>
                          {relationCount}{' '}
                          {localizeText(
                            language,
                            relationCount === 1 ? 'Beziehung' : 'Beziehungen',
                            relationCount === 1 ? 'relation' : 'relations'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onOpenSavedErdModel(erdModel)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                      >
                        <span>
                          {localizeText(
                            language,
                            'Im ER-Designer öffnen',
                            'Open in ER Designer'
                          )}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRenameErdDraft(erdModel.name);
                            setRenamingErdId(erdModel.id);
                            setConfirmDeleteErdId(null);
                          }}
                          title={localizeText(language, 'Umbenennen', 'Rename')}
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 ml-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteErdModel(erdModel.id);
                                setConfirmDeleteErdId(null);
                              }}
                              className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                            >
                              {localizeText(language, 'Löschen', 'Delete')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteErdId(null)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDeleteErdId(erdModel.id);
                              setRenamingErdId(null);
                            }}
                            title={localizeText(language, 'Löschen', 'Delete')}
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sektion 3: Strukturierte Lernpfade */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {localizeText(
                language,
                'Strukturierte Lernpfade (5 Pfade · 48 Lektionen)',
                'Structured Learning Paths (5 Paths · 48 Lectures)'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path) => {
              const total = path.lectures.length;
              const completedInPath = path.lectures.filter((lec) =>
                completedSet.has(lec.taskId)
              ).length;
              const percent = total > 0 ? Math.round((completedInPath / total) * 100) : 0;
              const nextLecture = getNextIncompleteLecture(path.id, completedIds);
              const targetLecture = nextLecture ?? path.lectures[0];
              const isAllDone = nextLecture === null && total > 0;
              const pathTaskIds = path.lectures.map((lec) => lec.taskId);

              return (
                <div
                  key={path.id}
                  className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {localizeText(language, path.titleDe, path.titleEn)}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {localizeText(language, path.descriptionDe, path.descriptionEn)}
                        </p>
                      </div>
                      {isAllDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          {localizeText(language, 'Abgeschlossen', 'Completed')}
                        </span>
                      )}
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1">
                      {path.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          {completedInPath} / {total}{' '}
                          {localizeText(language, 'Lektionen gelöst', 'lectures solved')}
                        </span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            PATH_ACCENT_CLASSES[path.number] ?? 'from-blue-500 to-indigo-500'
                          } transition-all duration-300`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Next lecture preview */}
                    {targetLecture && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                          {targetLecture.label}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 truncate">
                          {localizeText(
                            language,
                            targetLecture.task.titleDe,
                            targetLecture.task.titleEn
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {completedInPath > 0 ? (
                      <button
                        type="button"
                        onClick={() => onResetPathProgress(pathTaskIds)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>
                          {localizeText(
                            language,
                            'Fortschritt zurücksetzen',
                            'Reset progress'
                          )}
                        </span>
                      </button>
                    ) : (
                      <span />
                    )}

                    {targetLecture && (
                      <button
                        type="button"
                        onClick={() =>
                          onStartLearningPath(
                            path.id,
                            targetLecture.taskId,
                            targetLecture.task.databaseId
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                      >
                        <span>
                          {isAllDone
                            ? localizeText(language, 'Nochmal üben →', 'Practice again →')
                            : localizeText(language, 'Weiterlernen →', 'Continue learning →')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sektion 3: Schul-Übungsdatenbanken (Schnellstart) */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {localizeText(
                language,
                'Schul-Übungsdatenbanken (Schnellstart)',
                'School Practice Databases (Quick Start)'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {schoolPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectFreeDatabase(preset.id)}
                className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xs transition-all text-left"
              >
                <div className="min-w-0">
                  <span
                    className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded border mb-1 ${
                      DB_BADGE_COLORS[preset.id] ??
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Preset
                  </span>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {localizeText(language, preset.nameDe, preset.nameEn)}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenFile}
              className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-900 transition-all text-left"
            >
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1">
                  <FolderOpen className="w-2.5 h-2.5" />
                  .sql / .db
                </span>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {localizeText(language, 'Datei öffnen', 'Open File')}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </section>

        {/* Subtle footer link to marketing website in browser mode */}
        {!inTauri && onNavigate && (
          <footer className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {localizeText(
                language,
                'Alle Abfragen und Lernstände bleiben lokal auf deinem Gerät.',
                'All queries and learning progress stay locally on your device.'
              )}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
            >
              <span>{localizeText(language, 'Zur Projekt-Website', 'To project website')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
