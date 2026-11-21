import React, { useState } from 'react';
import {
  Table2,
  ChevronRight,
  ChevronDown,
  KeyRound,
  Link2,
  Play,
  Network,
  ListTree,
  Plus,
} from 'lucide-react';
import { TableSchema } from '../types/sql';
import { Language, getTranslations, localizeText } from '../i18n/translations';

const STARTER_TABLE_SQL = `CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  kategorie VARCHAR(40) NOT NULL,
  preis DECIMAL(8,2) NOT NULL
);

INSERT INTO produkte (id, name, kategorie, preis) VALUES
  (1, 'Notebook', 'Elektronik', 899.00),
  (2, 'Schreibtischlampe', 'Büro', 34.50),
  (3, 'SQL Handbuch', 'Bücher', 24.90);

SELECT * FROM produkte;`;

interface SchemaExplorerProps {
  schema: TableSchema[];
  language: Language;
  onInsertText: (text: string) => void;
  onPreviewTable: (tableName: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  schema,
  language,
  onInsertText,
  onPreviewTable,
}) => {
  const t = getTranslations(language);
  const [viewMode, setViewMode] = useState<'tree' | 'erd'>('tree');
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  const isExpanded = (tableName: string) =>
    expandedTables[tableName] !== undefined ? expandedTables[tableName] : true;

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !isExpanded(tableName),
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
        <div className="flex items-center gap-1.5 min-w-0">
          <Table2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-100 truncate">
            {t.schema.title}
          </span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {schema.length}
          </span>
        </div>

        {/* Tree / ER-Diagram Toggle */}
        <div className="flex items-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            title={localizeText(language, 'Tabellen-Liste', 'Table List')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'tree'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('erd')}
            title={localizeText(language, 'ER-Diagramm (SVG)', 'ER Diagram (SVG)')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'erd'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2">
        {schema.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-3 py-6 gap-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/30 m-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Table2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {t.schema.noTables}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {t.schema.emptyHint}
              </p>
            </div>
            {onInsertText && (
              <button
                type="button"
                onClick={() => onInsertText(STARTER_TABLE_SQL)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.schema.insertStarterTable}</span>
              </button>
            )}
          </div>
        ) : viewMode === 'tree' ? (
          <div className="space-y-1.5">
            {schema.map((table) => {
              const open = isExpanded(table.name);
              return (
                <div
                  key={table.name}
                  className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleTable(table.name)}
                        className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        aria-label={table.name}
                      >
                        {open ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onInsertText(table.name)}
                        title={localizeText(
                          language,
                          `„${table.name}“ in Editor einfügen`,
                          `Insert "${table.name}" into editor`
                        )}
                        className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate text-left"
                      >
                        {table.name}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onPreviewTable(table.name)}
                      title={t.schema.previewTable}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors shrink-0"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>

                  {open && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/70 border-t border-slate-200/70 dark:border-slate-800">
                      {table.columns.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => onInsertText(col.name)}
                          title={localizeText(
                            language,
                            `Spalte „${col.name}“ einfügen`,
                            `Insert column "${col.name}"`
                          )}
                          className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1 text-left hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {col.primaryKey ? (
                              <KeyRound
                                className="w-3 h-3 text-amber-500 shrink-0"
                                aria-label={t.schema.primaryKey}
                              />
                            ) : col.foreignKey ? (
                              <Link2
                                className="w-3 h-3 text-blue-500 shrink-0"
                                aria-label={t.schema.foreignKey}
                              />
                            ) : (
                              <span className="w-3 h-3 shrink-0 inline-block text-center text-[10px] text-slate-300 dark:text-slate-600">
                                ·
                              </span>
                            )}
                            <span
                              className={`font-mono text-[11px] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                                col.primaryKey
                                  ? 'underline decoration-amber-500/70 underline-offset-2 font-semibold text-slate-900 dark:text-slate-100'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {col.name}
                            </span>
                            {col.primaryKey && (
                              <span className="px-1 py-0 text-[9px] font-mono font-semibold rounded bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70 shrink-0">
                                PK
                              </span>
                            )}
                            {col.foreignKey && (
                              <span
                                title={`FK → ${col.foreignKey.table}.${col.foreignKey.column}`}
                                className="px-1 py-0 text-[9px] font-mono font-semibold rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70 shrink-0"
                              >
                                FK
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                            {col.type || 'TEXT'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <CompactErDiagram schema={schema} onInsertText={onInsertText} language={language} />
        )}
      </div>
    </div>
  );
};

interface CompactErDiagramProps {
  schema: TableSchema[];
  onInsertText: (text: string) => void;
  language: Language;
}

const CompactErDiagram: React.FC<CompactErDiagramProps> = ({
  schema,
  onInsertText,
  language,
}) => {
  // Compute compact SVG layout for tables
  const boxWidth = 210;
  const headerHeight = 24;
  const rowHeight = 18;
  const colGap = 28;
  const rowGap = 22;
  const padX = 10;
  const padY = 10;

  const colsCount = schema.length > 2 ? 2 : 1;

  interface BoxPos {
    table: TableSchema;
    x: number;
    y: number;
    w: number;
    h: number;
  }

  const positions: Record<string, BoxPos> = {};
  const colHeights = new Array(colsCount).fill(padY);

  schema.forEach((table, idx) => {
    const colIdx = idx % colsCount;
    const x = padX + colIdx * (boxWidth + colGap);
    const y = colHeights[colIdx];
    const h = headerHeight + table.columns.length * rowHeight + 4;
    positions[table.name] = { table, x, y, w: boxWidth, h };
    colHeights[colIdx] = y + h + rowGap;
  });

  const svgWidth = padX * 2 + colsCount * boxWidth + (colsCount - 1) * colGap;
  const svgHeight = Math.max(160, ...colHeights);

  // Collect FK edges
  const edges: {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
  }[] = [];

  schema.forEach((table) => {
    const srcBox = positions[table.name];
    if (!srcBox) return;
    table.columns.forEach((col, cIdx) => {
      if (!col.foreignKey) return;
      const dstBox = positions[col.foreignKey.table];
      if (!dstBox) return;
      const dstColIdx = Math.max(
        0,
        dstBox.table.columns.findIndex((c) => c.name === col.foreignKey?.column)
      );

      const y1 = srcBox.y + headerHeight + cIdx * rowHeight + rowHeight / 2 + 2;
      const y2 = dstBox.y + headerHeight + dstColIdx * rowHeight + rowHeight / 2 + 2;

      const srcRight = srcBox.x + srcBox.w;
      const dstLeft = dstBox.x;

      let x1 = srcBox.x;
      let x2 = dstBox.x;
      if (srcBox.x < dstBox.x) {
        x1 = srcRight;
        x2 = dstLeft;
      } else if (srcBox.x > dstBox.x) {
        x1 = srcBox.x;
        x2 = dstBox.x + dstBox.w;
      } else {
        x1 = srcRight;
        x2 = dstBox.x + dstBox.w;
      }

      edges.push({
        id: `${table.name}.${col.name}->${col.foreignKey.table}.${col.foreignKey.column}`,
        x1,
        y1,
        x2,
        y2,
        label: `${col.name} → ${col.foreignKey.table}.${col.foreignKey.column}`,
      });
    });
  });

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
        {localizeText(
          language,
          'Klick auf Tabelle/Spalte fügt Namen ein.',
          'Click table/column to insert name.'
        )}
      </p>
      <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block min-w-full"
        >
          <defs>
            <marker
              id="fk-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* FK Relationship lines */}
          {edges.map((edge) => {
            const midX = (edge.x1 + edge.x2) / 2;
            const pathD =
              edge.x1 === edge.x2
                ? `M ${edge.x1} ${edge.y1} C ${edge.x1 + 22} ${edge.y1}, ${edge.x2 + 22} ${edge.y2}, ${edge.x2} ${edge.y2}`
                : `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`;
            return (
              <path
                key={edge.id}
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.35"
                strokeOpacity="0.65"
                markerEnd="url(#fk-arrow)"
              >
                <title>{edge.label}</title>
              </path>
            );
          })}

          {/* Table boxes */}
          {Object.values(positions).map(({ table, x, y, w, h }) => (
            <g key={table.name} transform={`translate(${x}, ${y})`}>
              <rect
                width={w}
                height={h}
                rx="4"
                className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
                strokeWidth="1"
              />
              <rect
                width={w}
                height={headerHeight}
                rx="4"
                className="fill-slate-100 dark:fill-slate-800"
              />
              <line
                x1="0"
                y1={headerHeight}
                x2={w}
                y2={headerHeight}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="1"
              />
              <text
                x="8"
                y="16"
                onClick={() => onInsertText(table.name)}
                className="fill-slate-900 dark:fill-slate-100 font-mono text-[11px] font-semibold cursor-pointer hover:fill-blue-600"
              >
                {table.name}
              </text>

              {table.columns.map((col, idx) => {
                const cy = headerHeight + idx * rowHeight + 13;
                return (
                  <g
                    key={col.name}
                    onClick={() => onInsertText(col.name)}
                    className="cursor-pointer"
                  >
                    <text
                      x="8"
                      y={cy}
                      textDecoration={col.primaryKey ? 'underline' : undefined}
                      className={`font-mono text-[10px] ${
                        col.primaryKey
                          ? 'fill-amber-700 dark:fill-amber-300 font-semibold'
                          : col.foreignKey
                          ? 'fill-blue-700 dark:fill-blue-300'
                          : 'fill-slate-700 dark:fill-slate-300'
                      }`}
                    >
                      {col.primaryKey ? 'PK ' : col.foreignKey ? 'FK ' : '· '}
                      {col.name}
                    </text>
                    <text
                      x={w - 6}
                      y={cy}
                      textAnchor="end"
                      className="font-mono text-[9px] fill-slate-400 dark:fill-slate-500"
                    >
                      {col.type || 'TEXT'}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
