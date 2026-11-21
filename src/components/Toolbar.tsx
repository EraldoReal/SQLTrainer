import React, { useState } from 'react';
import {
  Database,
  RotateCcw,
  FolderOpen,
  Save,
  Clock,
  Play,
  Sun,
  Moon,
  HelpCircle,
  Scale,
  RefreshCw,
  GraduationCap,
  Terminal,
  ChevronDown,
  Home,
  LayoutGrid,
  Network,
  Pencil,
  FolderPlus,
  Check,
  X,
} from 'lucide-react';
import { DatabasePreset, SqlDialect } from '../types/sql';
import { Language, getTranslations, localizeText } from '../i18n/translations';
import { RecentFileEntry, isTauriEnvironment } from '../utils/fileManager';

export type WorkspaceMode = 'hub' | 'free' | 'tasks' | 'erd';

interface ToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  presets: DatabasePreset[];
  activeDatabaseId: string;
  customFileName: string | null;
  hasUnsavedChanges: boolean;
  onSelectDatabase: (dbId: string) => void;
  onResetDatabase: () => void;
  dialect: SqlDialect;
  onDialectChange: (dialect: SqlDialect) => void;
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  onOpenHub: () => void;
  onExecute: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  recentFiles: RecentFileEntry[];
  onClearRecentFiles: () => void;
  onOpenImpressum: () => void;
  onCheckUpdates?: () => void;
  onNavigateHome?: () => void;
  activeProjectName?: string | null;
  activeProjectId?: string | null;
  savedProjects?: { id: string; name: string }[];
  onSelectProject?: (projectId: string) => void;
  onSaveAsProject?: (name: string) => void;
  onRenameActiveProject?: (newName: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  presets,
  activeDatabaseId,
  customFileName,
  hasUnsavedChanges,
  onSelectDatabase,
  onResetDatabase,
  dialect,
  onDialectChange,
  mode,
  onModeChange,
  onOpenHub,
  onExecute,
  onOpenFile,
  onSaveFile,
  recentFiles,
  onClearRecentFiles,
  onOpenImpressum,
  onCheckUpdates,
  activeProjectName,
  activeProjectId,
  savedProjects = [],
  onSelectProject,
  onSaveAsProject,
  onRenameActiveProject,
}) => {
  const t = getTranslations(language);
  const [showRecentMenu, setShowRecentMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState('');
  const inTauri = isTauriEnvironment();

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
      {/* Left group: Brand + DB + Dialect + Run */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Brand / Home (opens Hub inside /app) */}
        <button
          type="button"
          onClick={onOpenHub}
          title={localizeText(language, 'Hub öffnen', 'Open Hub')}
          className="flex items-center gap-1.5 pr-2.5 mr-0.5 border-r border-slate-200 dark:border-slate-800 py-0.5 rounded-l hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <span className="p-1 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </span>
          <span className="font-mono text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100">
            SQL<span className="text-blue-600 dark:text-blue-400">_</span>Trainer
          </span>
        </button>

        {/* DB Selector + Reset (shown in editor/tasks) */}
        {(mode === 'free' || mode === 'tasks') && (
          <div className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={activeProjectId ? `project:${activeProjectId}` : activeDatabaseId}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith('project:')) {
                  onSelectProject?.(val.slice('project:'.length));
                } else {
                  onSelectDatabase(val);
                }
              }}
              aria-label={t.databases.label}
              className="px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <optgroup label={localizeText(language, 'Übungsdatenbanken', 'Practice Databases')}>
                {presets
                  .filter((preset) => preset.id !== 'leer' || (!activeProjectId && activeDatabaseId === 'leer'))
                  .map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {localizeText(language, preset.nameDe, preset.nameEn)}
                    </option>
                  ))}
              </optgroup>
              {savedProjects.length > 0 && (
                <optgroup label={localizeText(language, 'Meine Datenbanken', 'My Databases')}>
                  {savedProjects.map((proj) => (
                    <option key={proj.id} value={`project:${proj.id}`}>
                      {proj.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {customFileName && !activeProjectId && (
                <option value="custom">
                  {localizeText(language, `Datei: ${customFileName}`, `File: ${customFileName}`)}
                </option>
              )}
            </select>

            <button
              type="button"
              onClick={onResetDatabase}
              title={t.controls.resetDb}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden xl:inline">{localizeText(language, 'Reset', 'Reset')}</span>
            </button>

            {/* Active Project Badge + Save as Project / Rename */}
            {activeProjectName ? (
              isEditingProjectName ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = projectNameDraft.trim();
                    if (trimmed && onRenameActiveProject) {
                      onRenameActiveProject(trimmed);
                    }
                    setIsEditingProjectName(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={projectNameDraft}
                    onChange={(e) => setProjectNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsEditingProjectName(false);
                      }
                    }}
                    autoFocus
                    placeholder={localizeText(language, 'Projektname…', 'Project name…')}
                    className="w-36 px-2 py-0.5 text-xs rounded border border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    title={localizeText(language, 'Speichern', 'Save')}
                    className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProjectName(false)}
                    title={localizeText(language, 'Abbrechen', 'Cancel')}
                    className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1">
                  <span
                    title={localizeText(
                      language,
                      `Aktives Projekt: ${activeProjectName} (Auto-Save aktiv)`,
                      `Active project: ${activeProjectName} (Auto-save active)`
                    )}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 max-w-[160px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{activeProjectName}</span>
                  </span>
                  {onRenameActiveProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setProjectNameDraft(activeProjectName);
                        setIsEditingProjectName(true);
                      }}
                      title={localizeText(language, 'Projekt umbenennen', 'Rename project')}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      <span className="hidden xl:inline">
                        {localizeText(language, 'Umbenennen', 'Rename')}
                      </span>
                    </button>
                  )}
                </div>
              )
            ) : (
              onSaveAsProject && (
                isEditingProjectName ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const trimmed = projectNameDraft.trim();
                      if (trimmed) {
                        onSaveAsProject(trimmed);
                      }
                      setIsEditingProjectName(false);
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="text"
                      value={projectNameDraft}
                      onChange={(e) => setProjectNameDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsEditingProjectName(false);
                        }
                      }}
                      autoFocus
                      placeholder={localizeText(language, 'Projektname…', 'Project name…')}
                      className="w-36 px-2 py-0.5 text-xs rounded border border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="submit"
                      title={localizeText(language, 'Als Projekt speichern', 'Save as project')}
                      className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProjectName(false)}
                      title={localizeText(language, 'Abbrechen', 'Cancel')}
                      className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const currentPreset = presets.find((p) => p.id === activeDatabaseId);
                      const defaultName =
                        customFileName?.replace(/\.(sql|sqlite|db)$/i, '') ??
                        (currentPreset
                          ? localizeText(language, currentPreset.nameDe, currentPreset.nameEn)
                          : localizeText(language, 'Mein Projekt', 'My Project'));
                      setProjectNameDraft(defaultName);
                      setIsEditingProjectName(true);
                    }}
                    title={localizeText(
                      language,
                      'Aktuelle Datenbank als benanntes Projekt speichern',
                      'Save current database as a named project'
                    )}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span className="hidden lg:inline">
                      {localizeText(language, 'Als Projekt speichern', 'Save as Project')}
                    </span>
                  </button>
                )
              )
            )}
          </div>
        )}

        {/* Dialect Toggle */}
        {mode !== 'hub' && (
          <div
            className="flex items-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-0.5"
            role="group"
            aria-label={t.controls.dialectLabel}
          >
            <button
              type="button"
              onClick={() => onDialectChange('mysql')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                dialect === 'mysql'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {localizeText(language, 'MySQL (Schul-Standard)', 'MySQL (School Std)')}
            </button>
            <button
              type="button"
              onClick={() => onDialectChange('sqlite')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                dialect === 'sqlite'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {localizeText(language, 'SQLite / Standard-SQL', 'SQLite / Standard SQL')}
            </button>
          </div>
        )}

        {/* Run Button */}
        {(mode === 'free' || mode === 'tasks') && (
          <button
            type="button"
            onClick={onExecute}
            title={`${t.controls.run} (${t.controls.runShortcut})`}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t.controls.run}</span>
            <span className="hidden md:inline font-mono text-[10px] opacity-80">
              {t.controls.runShortcut}
            </span>
          </button>
        )}
      </div>

      {/* Right group: Mode + File + Lang + Theme + Help */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Mode Toggle: Hub | Free SQL | Task Trainer | ER Designer */}
        <div className="flex items-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={() => onModeChange('hub')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              mode === 'hub'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>{localizeText(language, 'Hub', 'Hub')}</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('free')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              mode === 'free'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>{localizeText(language, 'Freies SQL', 'Free SQL')}</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('tasks')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              mode === 'tasks'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>{localizeText(language, 'Aufgaben-Trainer', 'Task Trainer')}</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('erd')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              mode === 'erd'
                ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Network className="w-3 h-3" />
            <span>{localizeText(language, 'ER-Designer', 'ER Designer')}</span>
          </button>
        </div>

        {/* File Open / Save / Recent */}
        <div className="relative flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenFile}
            title={localizeText(language, 'SQL / SQLite-Datei öffnen', 'Open SQL / SQLite file')}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{localizeText(language, 'Öffnen', 'Open')}</span>
          </button>

          <button
            type="button"
            onClick={onSaveFile}
            title={`${t.controls.save} (Ctrl/⌘+S)`}
            className="relative inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.controls.save}</span>
            {hasUnsavedChanges && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                title={localizeText(language, 'Ungespeicherte Änderungen', 'Unsaved changes')}
              />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowRecentMenu((prev) => !prev);
                setShowHelpMenu(false);
              }}
              title={localizeText(language, 'Zuletzt verwendet', 'Recent files')}
              className="inline-flex items-center gap-0.5 px-1.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {showRecentMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-40 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                    {localizeText(language, 'Zuletzt verwendet', 'Recent Files')}
                  </span>
                  {recentFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onClearRecentFiles();
                        setShowRecentMenu(false);
                      }}
                      className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      {t.controls.clear}
                    </button>
                  )}
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {recentFiles.length === 0 ? (
                    <p className="p-3 text-[11px] text-slate-400 text-center">
                      {localizeText(language, 'Keine zuletzt geöffneten Dateien.', 'No recent files.')}
                    </p>
                  ) : (
                    recentFiles.map((file) => (
                      <button
                        key={`${file.name}-${file.openedAt}`}
                        type="button"
                        onClick={() => {
                          setShowRecentMenu(false);
                          onOpenFile();
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-slate-400 ml-2 shrink-0">
                          {file.kind}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language Toggle DE | EN */}
        <div className="flex items-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={() => onLanguageChange('de')}
            className={`px-1.5 py-0.5 text-[11px] font-mono font-semibold rounded transition-colors ${
              language === 'de'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            DE
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-1.5 py-0.5 text-[11px] font-mono font-semibold rounded transition-colors ${
              language === 'en'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? t.controls.themeDark : t.controls.themeLight}
          className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* Help Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHelpMenu((prev) => !prev);
              setShowRecentMenu(false);
            }}
            title={localizeText(language, 'Hilfe & Impressum', 'Help & Legal Notice')}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {showHelpMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-40 py-1">
              {inTauri && (
                <button
                  type="button"
                  onClick={() => {
                    setShowHelpMenu(false);
                    onCheckUpdates?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{localizeText(language, 'Nach Updates suchen', 'Check for Updates')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowHelpMenu(false);
                  onOpenImpressum();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>{localizeText(language, 'Über / Impressum', 'About / Imprint')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
