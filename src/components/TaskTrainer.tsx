import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Upload,
  Trash2,
  Play,
  X,
  Award,
  CornerDownLeft,
  RotateCcw,
  BookOpen,
  Database,
} from 'lucide-react';
import { GradeResult, SqlTask, TaskTopic } from '../types/sql';
import { SQL_TASKS } from '../data/tasks';
import { DATABASE_PRESETS } from '../data/databases';
import {
  getLearningPaths,
  getLectureLabel,
  type LearningPathId,
} from '../data/learningPaths';
import {
  loadCompletedTaskIds as loadStoredCompletedTaskIds,
  saveCompletedTaskIds,
  markTaskCompleted,
  resetTaskProgress,
} from '../utils/progressStore';
import { Language, getTranslations, localizeText } from '../i18n/translations';

interface TaskTrainerProps {
  databaseId: string;
  language: Language;
  onGradeTask: (task: SqlTask) => Promise<GradeResult>;
  onLoadSqlIntoEditor: (sql: string) => void;
  onSelectDatabase?: (dbId: string) => void;
  completedIds?: string[];
  onCompletedIdsChange?: (ids: string[]) => void;
  initialPathId?: LearningPathId | null;
  initialTaskId?: string | null;
}

const CUSTOM_TASKS_STORAGE_KEY = 'sql-trainer-custom-tasks';

function loadCustomTasks(): SqlTask[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidCustomTask) : [];
  } catch {
    return [];
  }
}

function isValidCustomTask(item: unknown): item is SqlTask {
  if (!item || typeof item !== 'object') return false;
  const t = item as Partial<SqlTask>;
  return (
    typeof t.id === 'string' &&
    typeof t.databaseId === 'string' &&
    typeof t.titleDe === 'string' &&
    typeof t.promptDe === 'string' &&
    typeof t.solutionSql === 'string'
  );
}

export const TaskTrainer: React.FC<TaskTrainerProps> = ({
  databaseId,
  language,
  onGradeTask,
  onLoadSqlIntoEditor,
  onSelectDatabase,
  completedIds: controlledCompletedIds,
  onCompletedIdsChange,
  initialPathId,
  initialTaskId,
}) => {
  const t = getTranslations(language);
  const learningPaths = useMemo(() => getLearningPaths(), []);

  const [browseMode, setBrowseMode] = useState<'path' | 'database'>(
    initialPathId ? 'path' : 'database'
  );
  const [selectedPathId, setSelectedPathId] = useState<LearningPathId>(
    initialPathId ?? 'basics'
  );
  const [topicFilter, setTopicFilter] = useState<TaskTopic | 'all'>('all');
  const [abiturOnly, setAbiturOnly] = useState(false);
  const [internalCompletedIds, setInternalCompletedIds] = useState<string[]>(
    loadStoredCompletedTaskIds
  );
  const completedIds = controlledCompletedIds ?? internalCompletedIds;
  const updateCompletedIds = (nextIds: string[]) => {
    const saved = saveCompletedTaskIds(nextIds);
    setInternalCompletedIds(saved);
    onCompletedIdsChange?.(saved);
  };

  const [customTasks, setCustomTasks] = useState<SqlTask[]>(loadCustomTasks);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    initialTaskId ?? null
  );
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newTopic, setNewTopic] = useState<TaskTopic>('basics');
  const [newCheckOrder, setNewCheckOrder] = useState(false);
  const [newIsAbitur, setNewIsAbitur] = useState(false);

  const importInputRef = useRef<HTMLInputElement | null>(null);
  const progressImportInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialPathId) {
      setBrowseMode('path');
      setSelectedPathId(initialPathId);
    }
  }, [initialPathId]);

  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId);
    }
  }, [initialTaskId]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TASKS_STORAGE_KEY, JSON.stringify(customTasks));
    } catch {
      // Ignore storage errors
    }
  }, [customTasks]);

  const activePath = useMemo(
    () => learningPaths.find((p) => p.id === selectedPathId) ?? learningPaths[0],
    [learningPaths, selectedPathId]
  );

  const allTasksForDb = useMemo(() => {
    const combined = [...SQL_TASKS, ...customTasks];
    return combined.filter((task) => task.databaseId === databaseId);
  }, [databaseId, customTasks]);

  const filteredTasks = useMemo(() => {
    if (browseMode === 'path' && activePath) {
      return activePath.lectures.map((lec) => lec.task);
    }
    return allTasksForDb.filter((task) => {
      if (topicFilter !== 'all' && task.topic !== topicFilter) return false;
      if (abiturOnly && !task.isAbitur) return false;
      return true;
    });
  }, [browseMode, activePath, allTasksForDb, topicFilter, abiturOnly]);

  const activeIndex = useMemo(() => {
    if (filteredTasks.length === 0) return -1;
    const idx = filteredTasks.findIndex((item) => item.id === selectedTaskId);
    return idx >= 0 ? idx : 0;
  }, [filteredTasks, selectedTaskId]);

  const activeTask = activeIndex >= 0 ? filteredTasks[activeIndex] : null;

  // Auto-switch database when user picks a task belonging to another preset DB
  useEffect(() => {
    if (
      browseMode === 'path' &&
      activeTask &&
      activeTask.databaseId !== databaseId
    ) {
      onSelectDatabase?.(activeTask.databaseId);
    }
  }, [browseMode, activeTask, databaseId, onSelectDatabase]);

  // Reset per-task UI state when active task changes
  useEffect(() => {
    setShowHint(false);
    setShowSolution(false);
    setGradeResult(null);
  }, [activeTask?.id]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const progressSummary = useMemo(() => {
    if (browseMode === 'path' && activePath) {
      const done = activePath.lectures.filter((lec) =>
        completedSet.has(lec.taskId)
      ).length;
      return { done, total: activePath.lectures.length };
    }
    const done = allTasksForDb.filter((task) => completedSet.has(task.id)).length;
    return { done, total: allTasksForDb.length };
  }, [browseMode, activePath, allTasksForDb, completedSet]);

  const handleCheckSolution = async () => {
    if (!activeTask) return;
    setIsGrading(true);
    try {
      const result = await onGradeTask(activeTask);
      setGradeResult(result);
      if (result.passed) {
        const next = markTaskCompleted(activeTask.id);
        setInternalCompletedIds(next);
        onCompletedIdsChange?.(next);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setGradeResult({
        passed: false,
        feedbackDe: `Die Prüfung ist fehlgeschlagen: ${msg}`,
        feedbackEn: `Grading failed: ${msg}`,
        details: msg,
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleResetActiveTask = () => {
    if (!activeTask) return;
    const next = resetTaskProgress(activeTask.id);
    setInternalCompletedIds(next);
    onCompletedIdsChange?.(next);
    setGradeResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim() || !newSolution.trim()) return;

    const created: SqlTask = {
      id: `custom-${Date.now()}`,
      databaseId,
      topic: newTopic,
      isAbitur: newIsAbitur,
      titleDe: newTitle.trim(),
      titleEn: newTitle.trim(),
      promptDe: newPrompt.trim(),
      promptEn: newPrompt.trim(),
      hintDe: newHint.trim() || 'Überprüfe Tabellen, Spaltennamen und Filterbedingungen.',
      hintEn: newHint.trim() || 'Check table names, columns, and filter conditions.',
      solutionSql: newSolution.trim(),
      checkOrder: newCheckOrder,
      isCustom: true,
    };

    setCustomTasks((prev) => [...prev, created]);
    setTopicFilter('all');
    setAbiturOnly(false);
    setSelectedTaskId(created.id);
    setShowCreatorModal(false);
    setNewTitle('');
    setNewPrompt('');
    setNewHint('');
    setNewSolution('');
    setNewCheckOrder(false);
    setNewIsAbitur(false);
  };

  const handleDeleteCustomTask = (id: string) => {
    setCustomTasks((prev) => prev.filter((item) => item.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const handleExportCustomTasks = () => {
    const data = JSON.stringify(customTasks, null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sql-trainer-custom-tasks.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportCustomTasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          const valid: SqlTask[] = parsed
            .filter(
              (item) =>
                item &&
                typeof item.titleDe === 'string' &&
                typeof item.promptDe === 'string' &&
                typeof item.solutionSql === 'string'
            )
            .map((item, idx) => {
              const builtInIds = new Set(SQL_TASKS.map((x) => x.id));
              const rawId = typeof item.id === 'string' && item.id ? item.id : '';
              return {
                ...item,
                id:
                  rawId && !builtInIds.has(rawId)
                    ? rawId
                    : `custom-import-${Date.now()}-${idx}`,
                titleEn: typeof item.titleEn === 'string' ? item.titleEn : item.titleDe,
                promptEn: typeof item.promptEn === 'string' ? item.promptEn : item.promptDe,
                hintDe: typeof item.hintDe === 'string' ? item.hintDe : '',
                hintEn: typeof item.hintEn === 'string' ? item.hintEn : '',
                databaseId:
                  typeof item.databaseId === 'string' && item.databaseId
                    ? item.databaseId
                    : databaseId,
                topic: item.topic || 'basics',
                isCustom: true,
              };
            });
          setCustomTasks((prev) => {
            const existingIds = new Set(prev.map((x) => x.id));
            return [...prev, ...valid.filter((x) => !existingIds.has(x.id))];
          });
        }
      } catch {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportProgress = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedIds,
    };
    const data = JSON.stringify(payload, null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sql-trainer-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const rawIds: unknown = Array.isArray(parsed)
          ? parsed
          : parsed && Array.isArray(parsed.completedIds)
          ? parsed.completedIds
          : null;
        if (Array.isArray(rawIds)) {
          const validIds = rawIds.filter((id): id is string => typeof id === 'string' && id.length > 0);
          updateCompletedIds(Array.from(new Set([...completedIds, ...validIds])));
        }
      } catch {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const topicLabels: Record<TaskTopic, string> = {
    basics: t.tasks.topics.basics,
    aggregation: t.tasks.topics.aggregation,
    joins: t.tasks.topics.joins,
    subqueries_ddl: t.tasks.topics.subqueries_ddl,
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Top Filter & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 mr-1">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {t.tasks.title}
            </span>
          </div>

          {/* Browse Mode Toggle: Lernpfad vs Datenbank */}
          <div className="flex items-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setBrowseMode('path')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                browseMode === 'path'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{localizeText(language, 'Lernpfad', 'Learning Path')}</span>
            </button>
            <button
              type="button"
              onClick={() => setBrowseMode('database')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                browseMode === 'database'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{localizeText(language, 'Datenbank', 'Database')}</span>
            </button>
          </div>

          {browseMode === 'path' ? (
            <select
              value={selectedPathId}
              onChange={(e) => {
                setSelectedPathId(e.target.value as LearningPathId);
                setSelectedTaskId(null);
              }}
              aria-label={localizeText(language, 'Lernpfad wählen', 'Select learning path')}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {learningPaths.map((path) => {
                const doneCount = path.lectures.filter((l) =>
                  completedSet.has(l.taskId)
                ).length;
                return (
                  <option key={path.id} value={path.id}>
                    {localizeText(language, path.titleDe, path.titleEn)} ({doneCount}/
                    {path.lectures.length})
                  </option>
                );
              })}
            </select>
          ) : (
            <>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value as TaskTopic | 'all')}
                className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">{t.tasks.allTopics}</option>
                <option value="basics">{t.tasks.topics.basics}</option>
                <option value="aggregation">{t.tasks.topics.aggregation}</option>
                <option value="joins">{t.tasks.topics.joins}</option>
                <option value="subqueries_ddl">{t.tasks.topics.subqueries_ddl}</option>
              </select>

              <button
                type="button"
                onClick={() => setAbiturOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border transition-colors ${
                  abiturOnly
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{localizeText(language, 'Abitur-Modus', 'Abitur Mode')}</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pr-1">
              {t.tasks.progressLabel}: {progressSummary.done}/{progressSummary.total}
            </span>
            <button
              type="button"
              onClick={handleExportProgress}
              title={t.tasks.exportProgress}
              aria-label={t.tasks.exportProgress}
              className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-medium rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">{t.tasks.exportProgressShort}</span>
            </button>
            <button
              type="button"
              onClick={() => progressImportInputRef.current?.click()}
              title={t.tasks.importProgress}
              aria-label={t.tasks.importProgress}
              className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-medium rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">{t.tasks.importProgressShort}</span>
            </button>
            <input
              ref={progressImportInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportProgress}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreatorModal(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>{localizeText(language, 'Eigene Aufgabe', 'Custom Task')}</span>
          </button>

          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            title={localizeText(language, 'Aufgaben (.json) importieren', 'Import tasks (.json)')}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportCustomTasks}
            className="hidden"
          />

          {customTasks.length > 0 && (
            <button
              type="button"
              onClick={handleExportCustomTasks}
              title={localizeText(language, 'Eigene Aufgaben (.json) exportieren', 'Export custom tasks (.json)')}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Selector Pills + Active Task Card */}
      {!activeTask ? (
        <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">
          {t.tasks.noTasksForFilter}
        </div>
      ) : (
        <div className="p-3 space-y-2.5 overflow-y-auto max-h-72">
          {/* Task Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {filteredTasks.map((task, idx) => {
              const isDone = completedIds.includes(task.id);
              const isSelected = task.id === activeTask.id;
              const pillLabel =
                browseMode === 'path' && activePath
                  ? `${activePath.number}.${idx + 1}`
                  : getLectureLabel(task.id) ?? `#${idx + 1}`;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded border shrink-0 transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                      : isDone
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3" />}
                  <span>{pillLabel}</span>
                  {task.isAbitur && (
                    <span className="text-[9px] uppercase font-sans opacity-80">Abi</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Task Details */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {(() => {
                  const activeLectureLabel =
                    browseMode === 'path' && activePath
                      ? `${activePath.number}.${activeIndex + 1}`
                      : getLectureLabel(activeTask.id);
                  const taskDbPreset = DATABASE_PRESETS.find(
                    (p) => p.id === activeTask.databaseId
                  );
                  return (
                    <>
                      {activeLectureLabel && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {activeLectureLabel}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {localizeText(language, activeTask.titleDe, activeTask.titleEn)}
                      </h3>
                      {taskDbPreset && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Database className="w-2.5 h-2.5" />
                          {localizeText(language, taskDbPreset.nameDe, taskDbPreset.nameEn)}
                        </span>
                      )}
                    </>
                  );
                })()}
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {topicLabels[activeTask.topic]}
                </span>
                {activeTask.isAbitur && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {t.tasks.abiturBadge}
                  </span>
                )}
                {activeTask.isCustom && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {t.tasks.customBadge}
                  </span>
                )}
                {completedIds.includes(activeTask.id) && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {t.tasks.completedBadge}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {localizeText(language, activeTask.promptDe, activeTask.promptEn)}
              </p>
            </div>

            {activeTask.isCustom && (
              <button
                type="button"
                onClick={() => handleDeleteCustomTask(activeTask.id)}
                title={t.controls.delete}
                className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleCheckSolution}
                disabled={isGrading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>{t.tasks.checkSolution}</span>
              </button>

              {completedIds.includes(activeTask.id) && (
                <button
                  type="button"
                  onClick={handleResetActiveTask}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>
                    {localizeText(
                      language,
                      'Nochmal lösen / Zurücksetzen',
                      'Reset / Solve again'
                    )}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? t.tasks.hideHint : t.tasks.showHint}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSolution((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {showSolution ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                <span>{showSolution ? t.tasks.hideSolution : t.tasks.showSolution}</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeIndex <= 0}
                onClick={() => setSelectedTaskId(filteredTasks[activeIndex - 1].id)}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                title={t.tasks.prevTask}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={activeIndex >= filteredTasks.length - 1}
                onClick={() => setSelectedTaskId(filteredTasks[activeIndex + 1].id)}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                title={t.tasks.nextTask}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hint Box */}
          {showHint && (
            <div className="rounded border border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
              {localizeText(language, activeTask.hintDe, activeTask.hintEn)}
            </div>
          )}

          {/* Solution Box */}
          {showSolution && (
            <div className="rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {localizeText(language, 'Musterlösung', 'Reference Solution')}
                </span>
                <button
                  type="button"
                  onClick={() => onLoadSqlIntoEditor(activeTask.solutionSql)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <CornerDownLeft className="w-3 h-3" />
                  <span>{t.tasks.loadSolution}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {activeTask.solutionSql}
              </pre>
            </div>
          )}

          {/* Grade Result Feedback */}
          {gradeResult && (
            <div
              className={`rounded border px-3 py-2 flex items-start gap-2 text-xs ${
                gradeResult.passed
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              {gradeResult.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-semibold">
                  {gradeResult.passed ? t.tasks.passedTitle : t.tasks.failedTitle}
                </p>
                <p>{localizeText(language, gradeResult.feedbackDe, gradeResult.feedbackEn)}</p>
                {gradeResult.details && (
                  <p className="font-mono text-[11px] opacity-80">{gradeResult.details}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Task Creator Modal */}
      {showCreatorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[1px] p-4"
          onClick={() => setShowCreatorModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateTask}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.tasks.customForm.heading}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreatorModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.customForm.titleLabel}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.tasks.customForm.topicLabel}
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value as TaskTopic)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="basics">{t.tasks.topics.basics}</option>
                    <option value="aggregation">{t.tasks.topics.aggregation}</option>
                    <option value="joins">{t.tasks.topics.joins}</option>
                    <option value="subqueries_ddl">{t.tasks.topics.subqueries_ddl}</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end gap-1.5 pb-1">
                  <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCheckOrder}
                      onChange={(e) => setNewCheckOrder(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>{t.tasks.customForm.checkOrderLabel}</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsAbitur}
                      onChange={(e) => setNewIsAbitur(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>{t.tasks.abiturBadge}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.customForm.promptLabel}
                </label>
                <textarea
                  rows={2}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.customForm.hintLabel}
                </label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.tasks.customForm.solutionLabel}
                </label>
                <textarea
                  rows={3}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowCreatorModal(false)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.controls.cancel}
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t.tasks.customForm.submit}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
