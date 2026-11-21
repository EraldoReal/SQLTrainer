import React, { useEffect, useRef } from 'react';
import { EditorState, Compartment, Prec } from '@codemirror/state';
import { EditorView, keymap, placeholder as cmPlaceholder, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { sql, MySQL, SQLite } from '@codemirror/lang-sql';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { bracketMatching, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { SqlDialect, TableSchema } from '../types/sql';
import { Language, getTranslations } from '../i18n/translations';

export interface SqlEditorHandle {
  insertText: (text: string) => void;
  focus: () => void;
}

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  schema: TableSchema[];
  dialect: SqlDialect;
  theme: 'light' | 'dark';
  language: Language;
  editorRef?: React.MutableRefObject<SqlEditorHandle | null>;
}

const MYSQL_FUNCTIONS = [
  { label: 'CONCAT', detail: '(str1, str2, ...)', info: 'Concatenate strings' },
  { label: 'YEAR', detail: '(date)', info: 'Extract year from date' },
  { label: 'MONTH', detail: '(date)', info: 'Extract month from date' },
  { label: 'DAY', detail: '(date)', info: 'Extract day from date' },
  { label: 'NOW', detail: '()', info: 'Current date and time' },
  { label: 'CURDATE', detail: '()', info: 'Current date' },
  { label: 'IFNULL', detail: '(expr, alt)', info: 'Fallback if NULL' },
  { label: 'COALESCE', detail: '(val1, val2, ...)', info: 'First non-NULL value' },
  { label: 'SUBSTRING', detail: '(str, pos, len)', info: '1-indexed substring' },
  { label: 'CHAR_LENGTH', detail: '(str)', info: 'Character length of string' },
  { label: 'COUNT', detail: '(* | col)', info: 'Count rows' },
  { label: 'SUM', detail: '(col)', info: 'Sum of values' },
  { label: 'AVG', detail: '(col)', info: 'Average of values' },
  { label: 'MIN', detail: '(col)', info: 'Minimum value' },
  { label: 'MAX', detail: '(col)', info: 'Maximum value' },
  { label: 'ROUND', detail: '(num, decimals)', info: 'Round numeric value' },
  { label: 'SHOW TABLES', detail: '', info: 'List all tables (MySQL)' },
  { label: 'DESCRIBE', detail: 'table_name', info: 'Show table structure (MySQL)' },
];

const lightThemeExtension = EditorView.theme(
  {
    '&': {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontSize: '13px',
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      lineHeight: '1.55',
    },
    '.cm-gutters': {
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      borderRight: '1px solid #e2e8f0',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#f1f5f9',
      color: '#475569',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(37, 99, 235, 0.04)',
    },
    '.cm-cursor': {
      borderLeftColor: '#2563eb',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(37, 99, 235, 0.16)',
    },
  },
  { dark: false }
);

const darkCustomExtension = EditorView.theme(
  {
    '&': {
      fontSize: '13px',
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      lineHeight: '1.55',
    },
  },
  { dark: true }
);

function buildSqlSchemaMap(schema: TableSchema[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const table of schema) {
    map[table.name] = table.columns.map((c) => c.name);
  }
  return map;
}

function createFunctionCompletionSource(schema: TableSchema[]) {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/[\w.]+/);
    if (!word && !context.explicit) return null;
    if (!word) return null;

    const options = [
      ...MYSQL_FUNCTIONS.map((fn) => ({
        label: fn.label,
        type: 'function' as const,
        detail: fn.detail,
        info: fn.info,
      })),
      ...schema.map((t) => ({
        label: t.name,
        type: 'class' as const,
        detail: `table (${t.columns.length} cols)`,
      })),
    ];

    return {
      from: word.from,
      options,
      validFor: /^[\w.]*$/,
    };
  };
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onExecute,
  schema,
  dialect,
  theme,
  language,
  editorRef,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment()).current;
  const langCompartment = useRef(new Compartment()).current;
  const placeholderCompartment = useRef(new Compartment()).current;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onExecuteRef = useRef(onExecute);
  onExecuteRef.current = onExecute;

  const t = getTranslations(language);

  useEffect(() => {
    if (!containerRef.current) return;

    const sqlSchema = buildSqlSchemaMap(schema);
    const sqlDialect = dialect === 'mysql' ? MySQL : SQLite;

    const runKeymap = Prec.highest(
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            onExecuteRef.current();
            return true;
          },
        },
      ])
    );

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        runKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        langCompartment.of([
          sql({
            dialect: sqlDialect,
            schema: sqlSchema,
            upperCaseKeywords: true,
          }),
          autocompletion({
            override: undefined,
          }),
          sqlDialect.language.data.of({
            autocomplete: createFunctionCompletionSource(schema),
          }),
        ]),
        themeCompartment.of(
          theme === 'dark'
            ? [oneDark, darkCustomExtension]
            : [syntaxHighlighting(defaultHighlightStyle, { fallback: true }), lightThemeExtension]
        ),
        placeholderCompartment.of(cmPlaceholder(t.editor.placeholder)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    if (editorRef) {
      editorRef.current = {
        insertText: (text: string) => {
          const v = viewRef.current;
          if (!v) return;
          const { from, to } = v.state.selection.main;
          v.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: from + text.length },
          });
          v.focus();
        },
        focus: () => {
          viewRef.current?.focus();
        },
      };
    }

    return () => {
      if (editorRef) {
        editorRef.current = null;
      }
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  // Sync theme changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.reconfigure(
        theme === 'dark'
          ? [oneDark, darkCustomExtension]
          : [syntaxHighlighting(defaultHighlightStyle, { fallback: true }), lightThemeExtension]
      ),
    });
  }, [theme, themeCompartment]);

  // Sync dialect & schema changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const sqlSchema = buildSqlSchemaMap(schema);
    const sqlDialect = dialect === 'mysql' ? MySQL : SQLite;
    view.dispatch({
      effects: langCompartment.reconfigure([
        sql({
          dialect: sqlDialect,
          schema: sqlSchema,
          upperCaseKeywords: true,
        }),
        autocompletion(),
        sqlDialect.language.data.of({
          autocomplete: createFunctionCompletionSource(schema),
        }),
      ]),
    });
  }, [dialect, schema, langCompartment]);

  // Sync placeholder language
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: placeholderCompartment.reconfigure(cmPlaceholder(t.editor.placeholder)),
    });
  }, [t.editor.placeholder, placeholderCompartment]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden bg-white dark:bg-[#282c34]"
      data-testid="sql-editor"
    />
  );
};
