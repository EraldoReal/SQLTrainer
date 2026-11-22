import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DatabasePreset,
  GradeResult,
  QueryHistoryEntry,
  QueryResult,
  SqlDialect,
  SqlTask,
  TableSchema,
} from '../types/sql';
import { Language, getTranslations, localizeText } from '../i18n/translations';
import { DATABASE_PRESETS } from '../data/databases';
import { SqlEngine } from '../engine/sqlEngine';
import { gradeTask } from '../engine/taskGrader';
import { exportToCsv, captureResultPng } from '../utils/exportUtils';
import {
  FileSystemFileHandleLike,
  RecentFileEntry,
  clearRecentFiles,
  getRecentFiles,
  isTauriEnvironment,
  openFile,
  saveBinaryFile,
  saveSqlFile,
} from '../utils/fileManager';
import {
  createProjectId,
  deleteSavedDatabase,
  duplicateSavedDatabase,
  listSavedDatabases,
  renameSavedDatabase,
  saveDatabaseProject,
  type SavedDatabaseProject,
} from '../utils/savedDbStore';
import {
  deleteErdModel,
  listSavedErdModels,
  renameErdModel,
  type SavedErdModel,
} from '../utils/savedErdStore';
import { Toolbar, WorkspaceMode } from '../components/Toolbar';
import { SchemaExplorer } from '../components/SchemaExplorer';
import { SqlEditor, SqlEditorHandle } from '../components/SqlEditor';
import { ResultTable } from '../components/ResultTable';
import { TaskTrainer } from '../components/TaskTrainer';
import { CheatSheetSidebar } from '../components/CheatSheetSidebar';
import { ImpressumModal } from '../components/ImpressumModal';
import { AppHub } from '../components/AppHub';
import { ErdDesigner } from '../components/ErdDesigner';
import type { LearningPathId } from '../data/learningPaths';
import { loadCompletedTaskIds, resetPathProgress } from '../utils/progressStore';
import { consumeBlogHandoff } from '../utils/blogHandoff';
import {
  checkForDesktopUpdate,
  getDesktopAppVersion,
  type DesktopUpdateInfo,
} from '../utils/desktopUpdater';

export interface TrainerPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNavigate?: (path: string) => void;
}

const DEFAULT_QUERY_BY_DB: Record<string, string> = {
  schule: 'SELECT vorname, nachname, klasse\nFROM schueler\nORDER BY nachname ASC;',
  onlineshop: 'SELECT name, kategorie, preis\nFROM artikel\nORDER BY preis DESC;',
  kino: 'SELECT titel, genre, dauer_min\nFROM filme\nORDER BY titel ASC;',
  leer: '-- Eigene Datenbank (Leer)\n-- Erstelle Tabellen mit CREATE TABLE oder nutze links "Beispiel-Tabelle einfügen".\n',
};

export const TrainerPage: React.FC<TrainerPageProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onNavigate,
}) => {
  const t = getTranslations(language);

  const engineRef = useRef<SqlEngine | null>(null);
  const editorHandleRef = useRef<SqlEditorHandle | null>(null);
  const initialSnapshotRef = useRef<Uint8Array | null>(null);

  const [isEngineReady, setIsEngineReady] = useState(false);
  const [activeDatabaseId, setActiveDatabaseId] = useState<string>(DATABASE_PRESETS[0].id);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [customFileContent, setCustomFileContent] = useState<string | Uint8Array | null>(null);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandleLike | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [dialect, setDialect] = useState<SqlDialect>('mysql');
  const [mode, setMode] = useState<WorkspaceMode>('hub');
  const [completedIds, setCompletedIds] = useState<string[]>(loadCompletedTaskIds);
  const [taskLaunchTarget, setTaskLaunchTarget] = useState<{
    pathId: LearningPathId | null;
    taskId: string | null;
  }>({ pathId: null, taskId: null });
  const [sqlCode, setSqlCode] = useState<string>(DEFAULT_QUERY_BY_DB.schule);
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFileEntry[]>(getRecentFiles);

  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [showImpressum, setShowImpressum] = useState(false);

  // Desktop updater state (Tauri only)
  const inTauri = isTauriEnvironment();
  const [desktopVersion, setDesktopVersion] = useState('1.0.0');
  const [updateStatus, setUpdateStatus] = useState<
    'idle' | 'checking' | 'available' | 'downloading' | 'up-to-date' | 'error'
  >('idle');
  const [availableUpdate, setAvailableUpdate] = useState<DesktopUpdateInfo | null>(null);
  const [updateProgress, setUpdateProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!inTauri) return;
    void getDesktopAppVersion().then(setDesktopVersion);
  }, [inTauri]);

  const [savedProjects, setSavedProjects] = useState<SavedDatabaseProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const savedProjectsRef = useRef<SavedDatabaseProject[]>([]);
  savedProjectsRef.current = savedProjects;
  const activeProject = savedProjects.find((p) => p.id === activeProjectId) ?? null;

  const [savedErdModels, setSavedErdModels] = useState<SavedErdModel[]>([]);
  const [activeErdModel, setActiveErdModel] = useState<SavedErdModel | null>(null);

  const showToast = useCallback((msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const upsertProjectInState = useCallback((saved: SavedDatabaseProject) => {
    setSavedProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
      return next.sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, []);

  const computeEngineStats = useCallback(
    (
      engine: SqlEngine
    ): {
      tableCount: number;
      tableNames: string[];
      rowCountTotal: number;
    } => {
      const tables = engine.getSchema();
      const tableNames = tables.map((tbl) => tbl.name);
      let rowCountTotal = 0;
      for (const name of tableNames) {
        try {
          const escaped = `"${name.replace(/"/g, '""')}"`;
          const res = engine.execute(`SELECT COUNT(*) AS cnt FROM ${escaped};`, 'sqlite');
          const val = res[0]?.values[0]?.[0];
          if (typeof val === 'number') {
            rowCountTotal += val;
          } else if (typeof val === 'string' && !Number.isNaN(Number(val))) {
            rowCountTotal += Number(val);
          }
        } catch {
          // Ignore single-table count error
        }
      }
      return {
        tableCount: tableNames.length,
        tableNames,
        rowCountTotal,
      };
    },
    []
  );

  // Load saved database projects and ER models on mount
  useEffect(() => {
    listSavedDatabases()
      .then(setSavedProjects)
      .catch((err) => console.error('Failed to load saved databases:', err));
    setSavedErdModels(listSavedErdModels());
  }, []);

  const loadPresetIntoEngine = useCallback((preset: DatabasePreset, currentDialect: SqlDialect) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setDatabaseName(preset.id);
    engine.loadSql(preset.sql, currentDialect);
    initialSnapshotRef.current = engine.exportBinary();
    setSchema(engine.getSchema());
    setResults([]);
    setError(null);
  }, []);

  // Initialize SqlEngine once
  useEffect(() => {
    let cancelled = false;
    const engine = new SqlEngine('schule');
    engineRef.current = engine;

    engine
      .init()
      .then(() => {
        if (cancelled) return;
        const firstPreset = DATABASE_PRESETS[0];
        loadPresetIntoEngine(firstPreset, 'mysql');
        setIsEngineReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
      engine.close();
      engineRef.current = null;
    };
  }, [loadPresetIntoEngine]);

  const handleSelectDatabase = useCallback(
    (dbId: string) => {
      setActiveProjectId(null);
      if (dbId === 'custom' && customFileContent !== null && engineRef.current) {
        try {
          if (customFileContent instanceof Uint8Array) {
            engineRef.current.loadBinary(customFileContent);
          } else {
            engineRef.current.loadSql(customFileContent, dialect);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg);
          showToast(msg);
          return;
        }
        setActiveDatabaseId('custom');
        initialSnapshotRef.current = engineRef.current.exportBinary();
        setSchema(engineRef.current.getSchema());
        setResults([]);
        setError(null);
        return;
      }

      const preset = DATABASE_PRESETS.find((p) => p.id === dbId);
      if (!preset) return;
      setActiveDatabaseId(preset.id);
      loadPresetIntoEngine(preset, dialect);
      if (DEFAULT_QUERY_BY_DB[preset.id]) {
        setSqlCode(DEFAULT_QUERY_BY_DB[preset.id]);
        setHasUnsavedChanges(false);
      }
    },
    [customFileContent, dialect, loadPresetIntoEngine, showToast]
  );

  const handleResetDatabase = useCallback(() => {
    if (activeDatabaseId === 'custom' && customFileContent !== null && engineRef.current) {
      try {
        if (customFileContent instanceof Uint8Array) {
          engineRef.current.loadBinary(customFileContent);
        } else {
          engineRef.current.loadSql(customFileContent, dialect);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        showToast(msg);
        return;
      }
      initialSnapshotRef.current = engineRef.current.exportBinary();
      setSchema(engineRef.current.getSchema());
      setResults([]);
      setError(null);
      showToast(t.databases.resetSuccess);
      return;
    }

    const preset = DATABASE_PRESETS.find((p) => p.id === activeDatabaseId) ?? DATABASE_PRESETS[0];
    loadPresetIntoEngine(preset, dialect);
    showToast(t.databases.resetSuccess);
  }, [activeDatabaseId, customFileContent, dialect, loadPresetIntoEngine, showToast, t.databases.resetSuccess]);

  const handleExecute = useCallback(
    (overrideSql?: string) => {
      const engine = engineRef.current;
      if (!engine || !isEngineReady) return;
      const queryToRun = (overrideSql ?? sqlCode).trim();
      if (!queryToRun) return;

      const start = performance.now();
      try {
        const res = engine.execute(queryToRun, dialect);
        setResults(res);
        setError(null);
        setSchema(engine.getSchema());

        const lastRes = res[res.length - 1];
        const entry: QueryHistoryEntry = {
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sql: queryToRun,
          dialect,
          databaseId: activeDatabaseId,
          executedAt: Date.now(),
          executionTimeMs: lastRes ? lastRes.executionTimeMs : performance.now() - start,
          rowCount: lastRes ? lastRes.rowCount : 0,
          success: true,
        };
        setHistory((prev) => [entry, ...prev].slice(0, 50));

        if (activeProjectId) {
          const existing = savedProjectsRef.current.find((p) => p.id === activeProjectId);
          if (existing) {
            const binary = engine.exportBinary();
            const stats = computeEngineStats(engine);
            const updated: SavedDatabaseProject = {
              ...existing,
              updatedAt: Date.now(),
              binary,
              lastSql: overrideSql ?? sqlCode,
              ...stats,
            };
            void saveDatabaseProject(updated).then(upsertProjectInState);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setResults([]);
        setSchema(engine.getSchema());
        if (activeProjectId) {
          const existing = savedProjectsRef.current.find((p) => p.id === activeProjectId);
          if (existing) {
            const binary = engine.exportBinary();
            const stats = computeEngineStats(engine);
            void saveDatabaseProject({
              ...existing,
              updatedAt: Date.now(),
              binary,
              lastSql: overrideSql ?? sqlCode,
              ...stats,
            }).then(upsertProjectInState);
          }
        }
        const entry: QueryHistoryEntry = {
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sql: queryToRun,
          dialect,
          databaseId: activeDatabaseId,
          executedAt: Date.now(),
          executionTimeMs: performance.now() - start,
          rowCount: 0,
          success: false,
          error: msg,
        };
        setHistory((prev) => [entry, ...prev].slice(0, 50));
      }
    },
    [
      activeDatabaseId,
      activeProjectId,
      computeEngineStats,
      dialect,
      isEngineReady,
      sqlCode,
      upsertProjectInState,
    ]
  );

  const handlePreviewTable = useCallback(
    (tableName: string) => {
      const previewQuery = `SELECT * FROM "${tableName.replace(/"/g, '""')}" LIMIT 50;`;
      setSqlCode(previewQuery);
      handleExecute(previewQuery);
    },
    [handleExecute]
  );

  const handleInsertText = useCallback((text: string) => {
    editorHandleRef.current?.insertText(text);
  }, []);

  const handleSqlChange = useCallback((nextVal: string) => {
    setSqlCode(nextVal);
    setHasUnsavedChanges(true);
  }, []);

  // Debounce-save lastSql when activeProjectId is set
  useEffect(() => {
    if (!activeProjectId) return;
    const timer = window.setTimeout(() => {
      const existing = savedProjectsRef.current.find((p) => p.id === activeProjectId);
      if (!existing || existing.lastSql === sqlCode) return;
      const updated: SavedDatabaseProject = {
        ...existing,
        lastSql: sqlCode,
        updatedAt: Date.now(),
      };
      void saveDatabaseProject(updated).then(upsertProjectInState);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [activeProjectId, sqlCode, upsertProjectInState]);

  const handleOpenFile = useCallback(async () => {
    const opened = await openFile('all');
    if (!opened) return;

    setRecentFiles(getRecentFiles());
    // Only .sql files may be written back via Ctrl/Cmd+S; never overwrite a SQLite database with SQL text.
    setFileHandle(opened.kind === 'sql' ? (opened.handle ?? null) : null);

    if (opened.kind === 'sqlite' && opened.content instanceof Uint8Array && engineRef.current) {
      try {
        engineRef.current.loadBinary(opened.content);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        showToast(msg);
        return;
      }
      setActiveProjectId(null);
      initialSnapshotRef.current = engineRef.current.exportBinary();
      setCustomFileName(opened.name);
      setCustomFileContent(opened.content);
      setActiveDatabaseId('custom');
      setSchema(engineRef.current.getSchema());
      setResults([]);
      setError(null);
      showToast(`${opened.name} (${t.databases.customLoaded})`);
      if (mode === 'hub' || mode === 'erd') {
        setMode('free');
      }
    } else if (typeof opened.content === 'string') {
      setSqlCode(opened.content);
      setHasUnsavedChanges(false);
      showToast(opened.name);
      if (mode === 'hub' || mode === 'erd') {
        setMode('free');
      }
    }
  }, [mode, showToast, t.databases.customLoaded]);

  const handleCreateEmptyProject = useCallback(
    async (name: string) => {
      const engine = engineRef.current;
      if (!engine || !isEngineReady) return;
      const cleanName = name.trim() || localizeText(language, 'Neue Datenbank', 'New Database');
      try {
        engine.setDatabaseName(cleanName);
        engine.loadSql('', dialect);
        const binary = engine.exportBinary();
        const initialSql = DEFAULT_QUERY_BY_DB.leer;
        const now = Date.now();
        const project: SavedDatabaseProject = {
          id: createProjectId(),
          name: cleanName,
          createdAt: now,
          updatedAt: now,
          tableCount: 0,
          rowCountTotal: 0,
          tableNames: [],
          source: 'empty',
          binary,
          lastSql: initialSql,
        };
        const saved = await saveDatabaseProject(project);
        upsertProjectInState(saved);
        initialSnapshotRef.current = binary;
        setCustomFileName(saved.name);
        setCustomFileContent(binary);
        setActiveDatabaseId('custom');
        setActiveProjectId(saved.id);
        setSchema([]);
        setResults([]);
        setError(null);
        setSqlCode(initialSql);
        setHasUnsavedChanges(false);
        setMode('free');
        showToast(
          localizeText(
            language,
            `Datenbank "${saved.name}" erstellt.`,
            `Database "${saved.name}" created.`
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        showToast(msg);
      }
    },
    [dialect, isEngineReady, language, showToast, upsertProjectInState]
  );

  const handleCreateDatabaseFromErd = useCallback(
    async (sql: string, dbName: string) => {
      const engine = engineRef.current;
      if (!engine) return;
      const cleanName = dbName.trim() || 'erd_database';
      try {
        engine.setDatabaseName(cleanName);
        engine.loadSql(sql, dialect);
        const binary = engine.exportBinary();
        const stats = computeEngineStats(engine);
        const now = Date.now();
        const project: SavedDatabaseProject = {
          id: createProjectId(),
          name: cleanName,
          createdAt: now,
          updatedAt: now,
          ...stats,
          source: 'erd',
          binary,
          lastSql: sql,
        };
        const saved = await saveDatabaseProject(project);
        upsertProjectInState(saved);
        initialSnapshotRef.current = binary;
        setCustomFileName(saved.name);
        setCustomFileContent(binary);
        setActiveDatabaseId('custom');
        setActiveProjectId(saved.id);
        setSchema(engine.getSchema());
        setResults([]);
        setError(null);
        setSqlCode(sql);
        setHasUnsavedChanges(false);
        setMode('free');
        showToast(
          localizeText(
            language,
            `Datenbank "${cleanName}" aus ER-Modell erstellt.`,
            `Database "${cleanName}" created from ER diagram.`
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        showToast(msg);
      }
    },
    [computeEngineStats, dialect, language, showToast, upsertProjectInState]
  );

  const handleSaveCurrentAsProject = useCallback(
    async (name: string) => {
      const engine = engineRef.current;
      if (!engine || !isEngineReady) return;
      const cleanName = name.trim() || localizeText(language, 'Mein Projekt', 'My Project');
      try {
        const binary = engine.exportBinary();
        const stats = computeEngineStats(engine);
        const now = Date.now();
        const source: SavedDatabaseProject['source'] =
          activeDatabaseId === 'custom' && customFileName
            ? 'import'
            : stats.tableCount === 0
              ? 'empty'
              : 'clone';
        const project: SavedDatabaseProject = {
          id: createProjectId(),
          name: cleanName,
          createdAt: now,
          updatedAt: now,
          ...stats,
          source,
          binary,
          lastSql: sqlCode,
        };
        const saved = await saveDatabaseProject(project);
        upsertProjectInState(saved);
        setCustomFileName(saved.name);
        setCustomFileContent(binary);
        setActiveDatabaseId('custom');
        setActiveProjectId(saved.id);
        setHasUnsavedChanges(false);
        showToast(
          localizeText(
            language,
            `Als Projekt "${saved.name}" gespeichert.`,
            `Saved as project "${saved.name}".`
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast(msg);
      }
    },
    [
      activeDatabaseId,
      computeEngineStats,
      customFileName,
      isEngineReady,
      language,
      showToast,
      sqlCode,
      upsertProjectInState,
    ]
  );

  const handleOpenSavedProject = useCallback(
    (project: SavedDatabaseProject) => {
      const engine = engineRef.current;
      if (!engine || !isEngineReady) return;
      try {
        engine.setDatabaseName(project.name);
        engine.loadBinary(project.binary);
        initialSnapshotRef.current = engine.exportBinary();
        setCustomFileName(project.name);
        setCustomFileContent(project.binary);
        setActiveDatabaseId('custom');
        setActiveProjectId(project.id);
        setSchema(engine.getSchema());
        setResults([]);
        setError(null);
        setSqlCode(project.lastSql || '');
        setHasUnsavedChanges(false);
        setMode('free');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        showToast(msg);
      }
    },
    [isEngineReady, showToast]
  );

  const blogHandoffCheckedRef = useRef(false);

  useEffect(() => {
    if (!isEngineReady || blogHandoffCheckedRef.current) return;
    blogHandoffCheckedRef.current = true;
    const handoff = consumeBlogHandoff();
    if (!handoff) return;

    if (handoff.type === 'editor') {
      if (handoff.dbId) {
        handleSelectDatabase(handoff.dbId);
      }
      setSqlCode(handoff.sql);
      setHasUnsavedChanges(false);
      setMode('free');
    } else if (handoff.type === 'hub-project') {
      listSavedDatabases()
        .then((projects) => {
          setSavedProjects(projects);
          const target = projects.find((p) => p.id === handoff.projectId);
          if (target) {
            handleOpenSavedProject(target);
          } else {
            setMode('hub');
            showToast(
              localizeText(
                language,
                'Datenbank im Hub gespeichert.',
                'Database saved in Hub.'
              )
            );
          }
        })
        .catch((err) => {
          console.error('Failed to load blog hub project:', err);
          setMode('hub');
        });
    }
  }, [handleOpenSavedProject, handleSelectDatabase, isEngineReady, language, showToast]);

  const handleRenameProject = useCallback(
    async (id: string, newName: string) => {
      const updated = await renameSavedDatabase(id, newName);
      if (!updated) return;
      upsertProjectInState(updated);
      if (activeProjectId === id) {
        setCustomFileName(updated.name);
        engineRef.current?.setDatabaseName(updated.name);
      }
      showToast(
        localizeText(
          language,
          `Umbenannt in "${updated.name}".`,
          `Renamed to "${updated.name}".`
        )
      );
    },
    [activeProjectId, language, showToast, upsertProjectInState]
  );

  const handleDuplicateProject = useCallback(
    async (id: string) => {
      const copy = await duplicateSavedDatabase(id);
      if (!copy) return;
      upsertProjectInState(copy);
      showToast(
        localizeText(
          language,
          `Dupliziert: "${copy.name}".`,
          `Duplicated: "${copy.name}".`
        )
      );
    },
    [language, showToast, upsertProjectInState]
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await deleteSavedDatabase(id);
      setSavedProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
      showToast(
        localizeText(language, 'Datenbank-Projekt gelöscht.', 'Database project deleted.')
      );
    },
    [activeProjectId, language, showToast]
  );

  const handleRenameErdModel = useCallback(
    (id: string, newName: string) => {
      const updated = renameErdModel(id, newName);
      if (!updated) return;
      setSavedErdModels(listSavedErdModels());
      if (activeErdModel?.id === id) {
        setActiveErdModel(updated);
      }
      showToast(
        localizeText(
          language,
          `ER-Modell in "${updated.name}" umbenannt.`,
          `ER model renamed to "${updated.name}".`
        )
      );
    },
    [activeErdModel?.id, language, showToast]
  );

  const handleDeleteErdModel = useCallback(
    (id: string) => {
      const deleted = deleteErdModel(id);
      if (!deleted) return;
      setSavedErdModels(listSavedErdModels());
      if (activeErdModel?.id === id) {
        setActiveErdModel(null);
      }
      showToast(
        localizeText(language, 'ER-Modell gelöscht.', 'ER model deleted.')
      );
    },
    [activeErdModel?.id, language, showToast]
  );

  const handleExportProjectDb = useCallback(
    async (project: SavedDatabaseProject) => {
      const safeName =
        project.name
          .replace(/[^a-zA-Z0-9._-]+/g, '_')
          .replace(/^_+|_+$/g, '') || 'database';
      const saved = await saveBinaryFile(project.binary, `${safeName}.db`);
      if (saved) {
        showToast(
          localizeText(language, `Exportiert: ${saved.name}`, `Exported: ${saved.name}`)
        );
      }
    },
    [language, showToast]
  );

  const handleSaveFile = useCallback(async () => {
    const saved = await saveSqlFile(sqlCode, fileHandle?.name || 'query.sql', fileHandle);
    if (saved) {
      setFileHandle(saved.handle ?? null);
      setHasUnsavedChanges(false);
      setRecentFiles(getRecentFiles());
      showToast(
        localizeText(language, `Gespeichert: ${saved.name}`, `Saved: ${saved.name}`)
      );
    }
  }, [fileHandle, language, showToast, sqlCode]);

  const handleGradeTask = useCallback(
    async (task: SqlTask): Promise<GradeResult> => {
      const snapshot = initialSnapshotRef.current ?? engineRef.current?.exportBinary();
      if (!snapshot) {
        return {
          passed: false,
          feedbackDe: 'Datenbank ist noch nicht bereit.',
          feedbackEn: 'Database is not ready yet.',
        };
      }
      return gradeTask(snapshot, task, sqlCode, dialect);
    },
    [dialect, sqlCode]
  );

  const handleCheckUpdates = useCallback(async () => {
    if (!inTauri) {
      showToast(
        localizeText(
          language,
          `Du verwendest die aktuelle Web-Version von SQL-Trainer (v${desktopVersion}).`,
          `You are running the latest web version of SQL-Trainer (v${desktopVersion}).`
        )
      );
      return;
    }

    setUpdateStatus('checking');
    try {
      const info = await checkForDesktopUpdate();
      setDesktopVersion(info.currentVersion);
      if (info.available && info.version) {
        setAvailableUpdate(info);
        setUpdateStatus('available');
        showToast(
          localizeText(
            language,
            `Neue Version v${info.version} verfügbar! Klicke unten in der Fußzeile auf „Jetzt aktualisieren“.`,
            `New version v${info.version} available! Click "Update now" in the footer.`
          )
        );
      } else {
        setAvailableUpdate(null);
        setUpdateStatus('up-to-date');
        showToast(
          localizeText(
            language,
            `Du verwendest bereits die aktuelle Version (v${info.currentVersion}).`,
            `You are already on the latest version (v${info.currentVersion}).`
          )
        );
      }
    } catch (err) {
      setUpdateStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      showToast(
        localizeText(
          language,
          `Update-Prüfung fehlgeschlagen: ${msg}`,
          `Update check failed: ${msg}`
        )
      );
    }
  }, [desktopVersion, inTauri, language, showToast]);

  const handleInstallUpdate = useCallback(async () => {
    if (!availableUpdate?.installAndRestart) return;
    setUpdateStatus('downloading');
    setUpdateProgress(0);
    try {
      await availableUpdate.installAndRestart((pct) => {
        setUpdateProgress(pct);
      });
    } catch (err) {
      setUpdateStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      showToast(
        localizeText(
          language,
          `Update-Installation fehlgeschlagen: ${msg}`,
          `Update installation failed: ${msg}`
        )
      );
    }
  }, [availableUpdate, language, showToast]);

  // Ctrl/Cmd+S shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        if (mode !== 'free' && mode !== 'tasks') return;
        e.preventDefault();
        void handleSaveFile();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSaveFile, mode]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  // Listen for Tauri native menu events if running inside Tauri
  useEffect(() => {
    if (!isTauriEnvironment()) return;
    const tauriWindow = window as unknown as {
      __TAURI__?: {
        event?: {
          listen?: (
            event: string,
            handler: (ev: { payload: string }) => void
          ) => Promise<() => void>;
        };
      };
    };

    const listen = tauriWindow.__TAURI__?.event?.listen;
    if (typeof listen !== 'function') return;

    let unlisten: (() => void) | undefined;
    listen('tauri://menu-action', (event) => {
      switch (event.payload) {
        case 'open':
          void handleOpenFile();
          break;
        case 'save':
          void handleSaveFile();
          break;
        case 'toggle-dark-mode':
          onThemeChange(theme === 'light' ? 'dark' : 'light');
          break;
        case 'reset-db':
          handleResetDatabase();
          break;
        case 'check-updates':
          handleCheckUpdates();
          break;
        case 'about':
          setShowImpressum(true);
          break;
      }
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      unlisten?.();
    };
  }, [
    handleCheckUpdates,
    handleOpenFile,
    handleResetDatabase,
    handleSaveFile,
    onThemeChange,
    theme,
  ]);

  return (
    <div className="flex flex-col h-screen w-full bg-graph-paper text-slate-900 dark:text-slate-100 overflow-hidden">
      <Toolbar
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onThemeChange={onThemeChange}
        presets={DATABASE_PRESETS}
        activeDatabaseId={activeDatabaseId}
        customFileName={customFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        onSelectDatabase={handleSelectDatabase}
        onResetDatabase={handleResetDatabase}
        dialect={dialect}
        onDialectChange={setDialect}
        mode={mode}
        onModeChange={setMode}
        onOpenHub={() => setMode('hub')}
        onExecute={() => handleExecute()}
        onOpenFile={() => void handleOpenFile()}
        onSaveFile={() => void handleSaveFile()}
        recentFiles={recentFiles}
        onClearRecentFiles={() => {
          clearRecentFiles();
          setRecentFiles([]);
        }}
        onOpenImpressum={() => setShowImpressum(true)}
        onCheckUpdates={handleCheckUpdates}
        onNavigateHome={onNavigate ? () => onNavigate('/') : undefined}
        activeProjectName={activeProject?.name ?? null}
        activeProjectId={activeProjectId}
        savedProjects={savedProjects}
        onSelectProject={(projectId) => {
          const proj = savedProjects.find((p) => p.id === projectId);
          if (proj) handleOpenSavedProject(proj);
        }}
        onSaveAsProject={(name) => void handleSaveCurrentAsProject(name)}
        onRenameActiveProject={
          activeProjectId
            ? (newName) => void handleRenameProject(activeProjectId, newName)
            : undefined
        }
      />

      {statusBanner && (
        <div className="px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800 shrink-0">
          {statusBanner}
        </div>
      )}

      {mode === 'hub' ? (
        <AppHub
          language={language}
          presets={DATABASE_PRESETS}
          completedIds={completedIds}
          savedProjects={savedProjects}
          activeProjectId={activeProjectId}
          savedErdModels={savedErdModels}
          onCreateEmptyProject={(name) => void handleCreateEmptyProject(name)}
          onOpenSavedProject={handleOpenSavedProject}
          onRenameProject={(id, newName) => void handleRenameProject(id, newName)}
          onDuplicateProject={(id) => void handleDuplicateProject(id)}
          onDeleteProject={(id) => void handleDeleteProject(id)}
          onExportProjectDb={(project) => void handleExportProjectDb(project)}
          onOpenSavedErdModel={(erdModel) => {
            setActiveErdModel(erdModel);
            setMode('erd');
          }}
          onRenameErdModel={handleRenameErdModel}
          onDeleteErdModel={handleDeleteErdModel}
          onSelectFreeDatabase={(dbId) => {
            handleSelectDatabase(dbId);
            setMode('free');
          }}
          onOpenFile={() => void handleOpenFile()}
          onOpenErd={() => {
            setActiveErdModel(null);
            setMode('erd');
          }}
          onStartLearningPath={(pathId, taskId, dbId) => {
            if (dbId !== activeDatabaseId) {
              handleSelectDatabase(dbId);
            }
            setTaskLaunchTarget({ pathId, taskId });
            setMode('tasks');
          }}
          onResetPathProgress={(taskIds) => {
            const next = resetPathProgress(taskIds);
            setCompletedIds(next);
            showToast(
              localizeText(
                language,
                'Lernpfad-Fortschritt zurückgesetzt.',
                'Learning path progress reset.'
              )
            );
          }}
          onNavigate={onNavigate}
        />
      ) : mode === 'erd' ? (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ErdDesigner
            dialect={dialect}
            language={language}
            onCreateDatabase={handleCreateDatabaseFromErd}
            onBack={() => setMode('hub')}
            activeModel={activeErdModel}
            onSavedModelsChange={() => setSavedErdModels(listSavedErdModels())}
          />
        </div>
      ) : (
        /* 3-Column Workspace */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Schema Explorer */}
          <div className="w-64 lg:w-72 shrink-0 hidden md:block h-full overflow-hidden">
            <SchemaExplorer
              schema={schema}
              language={language}
              onInsertText={handleInsertText}
              onPreviewTable={handlePreviewTable}
            />
          </div>

          {/* Center: Optional Task Trainer + SQL Editor + Result Table */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            {mode === 'tasks' && (
              <div className="shrink-0">
                <TaskTrainer
                  databaseId={activeDatabaseId}
                  language={language}
                  onGradeTask={handleGradeTask}
                  onLoadSqlIntoEditor={(sql) => {
                    setSqlCode(sql);
                    setHasUnsavedChanges(true);
                    editorHandleRef.current?.focus();
                  }}
                  onSelectDatabase={handleSelectDatabase}
                  completedIds={completedIds}
                  onCompletedIdsChange={setCompletedIds}
                  initialPathId={taskLaunchTarget.pathId}
                  initialTaskId={taskLaunchTarget.taskId}
                />
              </div>
            )}

          {/* Editor Pane */}
          <div className="flex-1 min-h-[160px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {t.editor.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                {t.editor.multiStatementHint}
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <SqlEditor
                value={sqlCode}
                onChange={handleSqlChange}
                onExecute={() => handleExecute()}
                schema={schema}
                dialect={dialect}
                theme={theme}
                language={language}
                editorRef={editorHandleRef}
              />
            </div>
          </div>

          {/* Result Table Pane */}
          <div className="h-[44%] min-h-[180px] shrink-0 overflow-hidden">
            <ResultTable
              results={results}
              error={error}
              history={history}
              language={language}
              onSelectHistory={(sql) => {
                setSqlCode(sql);
                editorHandleRef.current?.focus();
              }}
              onClearHistory={() => setHistory([])}
              onExportCsv={(res) => exportToCsv(res)}
              onCapturePng={async (res) => {
                const outcome = await captureResultPng(res);
                if (outcome === 'download') {
                  showToast(
                    localizeText(language, 'PNG heruntergeladen.', 'PNG downloaded.')
                  );
                }
              }}
            />
          </div>
        </main>

        {/* Right: Sticky Cheat Sheet Sidebar */}
        <div className="hidden lg:flex h-full">
          <CheatSheetSidebar language={language} onInsertText={handleInsertText} />
        </div>
      </div>
      )}

      {inTauri && (
        <footer className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              SQL-Trainer Desktop v{desktopVersion}
            </span>
            {updateStatus === 'up-to-date' && (
              <span className="text-emerald-600 dark:text-emerald-400">
                · {localizeText(language, 'Aktuell', 'Up to date')}
              </span>
            )}
            {updateStatus === 'checking' && (
              <span className="text-blue-600 dark:text-blue-400">
                · {localizeText(language, 'Suche auf Server nach Updates…', 'Checking server for updates…')}
              </span>
            )}
            {updateStatus === 'available' && availableUpdate?.version && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                · {localizeText(language, `Version v${availableUpdate.version} verfügbar`, `Version v${availableUpdate.version} available`)}
              </span>
            )}
            {updateStatus === 'downloading' && (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                · {localizeText(
                  language,
                  `Lade Update${updateProgress !== null ? ` (${updateProgress}%)` : ''} & überschreibe…`,
                  `Downloading update${updateProgress !== null ? ` (${updateProgress}%)` : ''} & installing…`
                )}
              </span>
            )}
            {updateStatus === 'error' && (
              <span className="text-rose-600 dark:text-rose-400">
                · {localizeText(language, 'Update-Server nicht erreichbar', 'Update server unreachable')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {updateStatus === 'available' && availableUpdate?.installAndRestart ? (
              <button
                type="button"
                onClick={() => void handleInstallUpdate()}
                className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer"
              >
                {localizeText(language, 'Jetzt aktualisieren & neu starten', 'Update now & restart')}
              </button>
            ) : (
              <button
                type="button"
                disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
                onClick={() => void handleCheckUpdates()}
                className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                {localizeText(language, 'Nach Updates suchen', 'Check for updates')}
              </button>
            )}
          </div>
        </footer>
      )}

      <ImpressumModal
        isOpen={showImpressum}
        onClose={() => setShowImpressum(false)}
        language={language}
      />
    </div>
  );
};
