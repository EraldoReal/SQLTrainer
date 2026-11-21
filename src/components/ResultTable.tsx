import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Camera,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  Terminal,
} from 'lucide-react';
import { QueryHistoryEntry, QueryResult, SqlCellValue } from '../types/sql';
import { Language, getTranslations, localizeText } from '../i18n/translations';

interface ResultTableProps {
  results: QueryResult[];
  error: string | null;
  history: QueryHistoryEntry[];
  language: Language;
  onSelectHistory: (sql: string) => void;
  onClearHistory: () => void;
  onExportCsv: (result: QueryResult) => void;
  onCapturePng: (result: QueryResult) => Promise<void> | void;
}

type SortDirection = 'asc' | 'desc' | null;

function formatCellValue(val: SqlCellValue, nullLabel: string): string {
  if (val === null || val === undefined) return nullLabel;
  if (val instanceof Uint8Array) {
    return `[BLOB ${val.byteLength} B]`;
  }
  return String(val);
}

function compareCells(a: SqlCellValue, b: SqlCellValue): number {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const numA = Number(a);
  const numB = Number(b);
  if (!Number.isNaN(numA) && !Number.isNaN(numB) && String(a).trim() !== '' && String(b).trim() !== '') {
    return numA - numB;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export const ResultTable: React.FC<ResultTableProps> = ({
  results,
  error,
  history,
  language,
  onSelectHistory,
  onClearHistory,
  onExportCsv,
  onCapturePng,
}) => {
  const t = getTranslations(language);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pngCopied, setPngCopied] = useState(false);

  useEffect(() => {
    setSortCol(null);
    setSortDir(null);
    setActiveIndex(0);
  }, [results]);

  const safeIndex = activeIndex < results.length ? activeIndex : 0;
  const currentResult = results[safeIndex] ?? null;

  const sortedRows = useMemo(() => {
    if (!currentResult) return [];
    if (sortCol === null || sortDir === null) return currentResult.values;
    const copy = [...currentResult.values];
    copy.sort((r1, r2) => {
      const cmp = compareCells(r1[sortCol], r2[sortCol]);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [currentResult, sortCol, sortDir]);

  const handleSort = (colIdx: number) => {
    if (sortCol !== colIdx) {
      setSortCol(colIdx);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortCol(null);
      setSortDir(null);
    }
  };

  const handlePngClick = async () => {
    if (!currentResult) return;
    await onCapturePng(currentResult);
    setPngCopied(true);
    setTimeout(() => setPngCopied(false), 1800);
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {t.results.title}
          </span>

          {results.length > 1 && (
            <div className="flex items-center gap-1 ml-1">
              {results.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setSortCol(null);
                    setSortDir(null);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                    safeIndex === idx
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}

          {currentResult && !error && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentResult.columns.length > 0
                  ? `${currentResult.rowCount} ${t.results.rowsReturned}`
                  : `${currentResult.affectedRows ?? 0} ${t.results.rowsAffected}`}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {currentResult.executionTimeMs.toFixed(1)} ms
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {currentResult && currentResult.columns.length > 0 && !error && (
            <>
              <button
                type="button"
                onClick={() => onExportCsv(currentResult)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={t.controls.exportCsv}
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={handlePngClick}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={localizeText(
                  language,
                  'Ergebnis als PNG-Screenshot kopieren',
                  'Copy result as PNG screenshot'
                )}
              >
                {pngCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {t.controls.copied}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3" />
                    <span>PNG</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* History Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
                showHistory
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <History className="w-3 h-3" />
              <span>{t.tabs.history}</span>
              {history.length > 0 && (
                <span className="ml-0.5 px-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
                  {history.length}
                </span>
              )}
            </button>

            {showHistory && (
              <div className="absolute right-0 bottom-full mb-1.5 w-80 sm:w-96 max-h-72 flex flex-col rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-30 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {t.history.title}
                  </span>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearHistory}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t.history.clearHistory}
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {history.length === 0 ? (
                    <p className="p-4 text-xs text-center text-slate-500 dark:text-slate-400">
                      {t.history.empty}
                    </p>
                  ) : (
                    history.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          onSelectHistory(entry.sql);
                          setShowHistory(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                              entry.success
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {entry.success ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {entry.success ? t.history.success : t.history.error}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(entry.executedAt).toLocaleTimeString()} ·{' '}
                            {entry.executionTimeMs.toFixed(0)} ms
                          </span>
                        </div>
                        <pre className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                          {entry.sql}
                        </pre>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-4">
            <div className="rounded border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  {t.results.errorTitle}
                </p>
                <pre className="mt-1 font-mono text-xs text-rose-700 dark:text-rose-200 whitespace-pre-wrap break-words">
                  {error}
                </pre>
              </div>
            </div>
          </div>
        ) : !currentResult ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
            <Terminal className="w-6 h-6 mb-2 opacity-60" />
            <p className="text-xs">{t.results.emptyPrompt}</p>
          </div>
        ) : currentResult.columns.length === 0 ? (
          <div className="p-4">
            <div className="rounded border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {currentResult.message ||
                  `${currentResult.affectedRows ?? 0} ${t.results.rowsAffected}`}
              </span>
            </div>
          </div>
        ) : sortedRows.length === 0 ? (
          <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
            {t.results.noRows}
          </div>
        ) : (
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="w-10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-700 text-right select-none">
                  #
                </th>
                {currentResult.columns.map((col, idx) => {
                  const isSorted = sortCol === idx && sortDir !== null;
                  return (
                    <th
                      key={`${col}-${idx}`}
                      className="px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700 last:border-r-0 whitespace-nowrap select-none"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(idx)}
                        className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{col}</span>
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-35" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {sortedRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
                >
                  <td className="px-2.5 py-1 text-[10px] text-slate-400 dark:text-slate-500 border-r border-slate-200/70 dark:border-slate-800 text-right select-none">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => {
                    const isNull = cell === null || cell === undefined;
                    return (
                      <td
                        key={cIdx}
                        className={`px-3 py-1 border-r border-slate-200/70 dark:border-slate-800 last:border-r-0 whitespace-nowrap max-w-xs truncate ${
                          isNull
                            ? 'italic text-slate-400 dark:text-slate-500'
                            : typeof cell === 'number'
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                        title={formatCellValue(cell, t.results.nullValue)}
                      >
                        {formatCellValue(cell, t.results.nullValue)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
