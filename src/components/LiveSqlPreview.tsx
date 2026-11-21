import React, { useEffect, useRef, useState } from 'react';
import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Language } from '../i18n/translations';

interface LiveSqlPreviewProps {
  language: Language;
  onOpenTrainer: () => void;
}

interface PreviewResult {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
  executionTimeMs: number;
}

const DEMO_SCHEMA_SQL = `
CREATE TABLE kurse (
  id INTEGER PRIMARY KEY,
  fach TEXT NOT NULL,
  lehrer TEXT NOT NULL,
  wochenstunden INTEGER NOT NULL
);

CREATE TABLE schueler (
  id INTEGER PRIMARY KEY,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  jahrgang INTEGER NOT NULL
);

CREATE TABLE noten (
  schueler_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  punkte INTEGER NOT NULL,
  PRIMARY KEY (schueler_id, kurs_id),
  FOREIGN KEY (schueler_id) REFERENCES schueler(id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(id)
);

INSERT INTO kurse (id, fach, lehrer, wochenstunden) VALUES
  (1, 'Informatik LK', 'Fr. Weber', 5),
  (2, 'Mathematik LK', 'Hr. Becker', 5),
  (3, 'Physik GK', 'Fr. Klein', 3);

INSERT INTO schueler (id, vorname, nachname, jahrgang) VALUES
  (1, 'Lena', 'Hoffmann', 12),
  (2, 'Jonas', 'Müller', 12),
  (3, 'Mia', 'Schulz', 13),
  (4, 'Leon', 'Wagner', 13);

INSERT INTO noten (schueler_id, kurs_id, punkte) VALUES
  (1, 1, 14),
  (1, 2, 13),
  (2, 1, 11),
  (3, 1, 15),
  (3, 3, 12),
  (4, 2, 10);
`;

const PRESET_QUERIES_DE = [
  {
    label: 'JOIN + Sortierung',
    sql: `SELECT s.vorname, s.nachname, k.fach, n.punkte
FROM noten n
JOIN schueler s ON n.schueler_id = s.id
JOIN kurse k ON n.kurs_id = k.id
WHERE n.punkte >= 12
ORDER BY n.punkte DESC;`,
  },
  {
    label: 'GROUP BY Durchschnitt',
    sql: `SELECT k.fach, COUNT(*) AS anzahl, ROUND(AVG(n.punkte), 1) AS schnitt
FROM kurse k
JOIN noten n ON k.id = n.kurs_id
GROUP BY k.id, k.fach
ORDER BY schnitt DESC;`,
  },
  {
    label: 'Alle Tabellen',
    sql: `SELECT name AS tabelle FROM sqlite_master WHERE type = 'table' ORDER BY name;`,
  },
];

const PRESET_QUERIES_EN = [
  {
    label: 'JOIN + Order',
    sql: `SELECT s.vorname, s.nachname, k.fach, n.punkte
FROM noten n
JOIN schueler s ON n.schueler_id = s.id
JOIN kurse k ON n.kurs_id = k.id
WHERE n.punkte >= 12
ORDER BY n.punkte DESC;`,
  },
  {
    label: 'GROUP BY Average',
    sql: `SELECT k.fach, COUNT(*) AS count, ROUND(AVG(n.punkte), 1) AS avg_points
FROM kurse k
JOIN noten n ON k.id = n.kurs_id
GROUP BY k.id, k.fach
ORDER BY avg_points DESC;`,
  },
  {
    label: 'All Tables',
    sql: `SELECT name AS table_name FROM sqlite_master WHERE type = 'table' ORDER BY name;`,
  },
];

export const LiveSqlPreview: React.FC<LiveSqlPreviewProps> = ({ language, onOpenTrainer }) => {
  const isEn = language === 'en';
  const presets = isEn ? PRESET_QUERIES_EN : PRESET_QUERIES_DE;

  const [sql, setSql] = useState(presets[0].sql);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sqlJsRef = useRef<SqlJsStatic | null>(null);
  const dbRef = useRef<Database | null>(null);

  const initDatabase = (SQL: SqlJsStatic) => {
    if (dbRef.current) {
      dbRef.current.close();
    }
    const db = new SQL.Database();
    db.run(DEMO_SCHEMA_SQL);
    dbRef.current = db;
    return db;
  };

  const runQuery = (queryText: string, dbInstance?: Database) => {
    const db = dbInstance ?? dbRef.current;
    if (!db) return;

    const trimmed = queryText.trim();
    if (!trimmed) {
      setError(isEn ? 'Please enter an SQL query.' : 'Bitte gib eine SQL-Abfrage ein.');
      setResult(null);
      return;
    }

    try {
      const start = performance.now();
      const res = db.exec(trimmed);
      const elapsed = Math.max(0.1, Number((performance.now() - start).toFixed(2)));

      if (res.length === 0) {
        setResult({
          columns: [isEn ? 'Status' : 'Status'],
          values: [[isEn ? 'Statement executed (0 rows returned).' : 'Anweisung ausgeführt (0 Zeilen zurückgegeben).']],
          executionTimeMs: elapsed,
        });
      } else {
        const last = res[res.length - 1];
        setResult({
          columns: last.columns,
          values: last.values,
          executionTimeMs: elapsed,
        });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResult(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    initSqlJs({
      locateFile: (file: string) => `/wasm/${file}`,
    })
      .then((SQL) => {
        if (cancelled) return;
        sqlJsRef.current = SQL;
        const db = initDatabase(SQL);
        setLoading(false);
        runQuery(PRESET_QUERIES_DE[0].sql, db);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoading(false);
        setError(
          isEn
            ? `Failed to load WebAssembly SQL engine: ${err instanceof Error ? err.message : String(err)}`
            : `WebAssembly SQL-Engine konnte nicht geladen werden: ${err instanceof Error ? err.message : String(err)}`
        );
      });

    return () => {
      cancelled = true;
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    if (!sqlJsRef.current) return;
    const db = initDatabase(sqlJsRef.current);
    const defaultSql = presets[0].sql;
    setSql(defaultSql);
    runQuery(defaultSql, db);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery(sql);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
      {/* Window Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-200">
            {isEn ? 'Live WebAssembly SQL Sandbox' : 'Live WebAssembly SQL-Sandbox'}
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            sql.js · schule.db
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setSql(preset.sql);
                runQuery(preset.sql);
              }}
              className="px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={6}
          spellCheck={false}
          aria-label={isEn ? 'Live SQL query input' : 'Live SQL-Abfrage eingeben'}
          className="w-full bg-transparent font-mono text-xs sm:text-sm leading-relaxed text-slate-100 focus:outline-none resize-y"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            {isEn ? 'Ctrl/⌘ + Enter to run · Tables: schueler, kurse, noten' : 'Strg/⌘ + Enter zum Ausführen · Tabellen: schueler, kurse, noten'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isEn ? 'Reset' : 'Reset'}
            </button>
            <button
              type="button"
              onClick={() => runQuery(sql)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {loading ? (isEn ? 'Loading…' : 'Lädt…') : isEn ? 'Run Query' : 'Ausführen'}
            </button>
          </div>
        </div>
      </div>

      {/* Result Area */}
      <div className="p-4 bg-white dark:bg-slate-900">
        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-700 dark:text-red-300 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : result ? (
          <div>
            <div className="flex items-center justify-between mb-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {result.values.length} {isEn ? 'rows' : 'Zeilen'} · {result.executionTimeMs} ms
              </span>
              <button
                type="button"
                onClick={onOpenTrainer}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                {isEn ? 'Open full workspace →' : 'Im großen Workspace öffnen →'}
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                    {result.columns.map((col, idx) => (
                      <th
                        key={`${col}-${idx}`}
                        className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.values.slice(0, 8).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-1.5 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                        >
                          {cell === null ? (
                            <span className="italic text-slate-400">NULL</span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {loading
              ? isEn
                ? 'Initializing WebAssembly SQLite engine…'
                : 'Initialisiere WebAssembly SQL-Engine…'
              : isEn
                ? 'Run a query to inspect results.'
                : 'Führe eine Abfrage aus, um Ergebnisse zu sehen.'}
          </div>
        )}
      </div>
    </div>
  );
};
