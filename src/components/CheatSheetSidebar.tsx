import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  CornerDownLeft,
  HelpCircle,
  Plus,
  Trash2,
  Search,
  Bookmark,
} from 'lucide-react';
import { CHEAT_SHEET_ITEMS } from '../data/cheatSheet';
import { CustomSnippet } from '../types/sql';
import { Language, getTranslations, localizeText } from '../i18n/translations';

interface CheatSheetSidebarProps {
  language: Language;
  onInsertText: (text: string) => void;
}

const SNIPPETS_STORAGE_KEY = 'sql-trainer-custom-snippets';

function loadCustomSnippets(): CustomSnippet[] {
  try {
    const raw = localStorage.getItem(SNIPPETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const CheatSheetSidebar: React.FC<CheatSheetSidebarProps> = ({
  language,
  onInsertText,
}) => {
  const t = getTranslations(language);
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(288);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openHelpId, setOpenHelpId] = useState<string | null>(null);

  const [customSnippets, setCustomSnippets] = useState<CustomSnippet[]>(loadCustomSnippets);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSql, setNewSql] = useState('');

  const resizingRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(customSnippets));
    } catch {
      // Ignore storage quota errors
    }
  }, [customSnippets]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const newWidth = Math.min(460, Math.max(220, window.innerWidth - e.clientX));
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleAddSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSql.trim()) return;
    const item: CustomSnippet = {
      id: `snippet-${Date.now()}`,
      title: newTitle.trim(),
      sql: newSql.trim(),
      createdAt: Date.now(),
    };
    setCustomSnippets((prev) => [item, ...prev]);
    setNewTitle('');
    setNewSql('');
    setShowAddForm(false);
  };

  const handleDeleteSnippet = (id: string) => {
    setCustomSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  const query = search.trim().toLowerCase();
  const filteredItems = CHEAT_SHEET_ITEMS.filter((item) => {
    if (!query) return true;
    const title = localizeText(language, item.titleDe, item.titleEn).toLowerCase();
    const cat = localizeText(language, item.categoryDe, item.categoryEn).toLowerCase();
    const desc = localizeText(language, item.descriptionDe, item.descriptionEn).toLowerCase();
    return (
      title.includes(query) ||
      cat.includes(query) ||
      desc.includes(query) ||
      item.syntax.toLowerCase().includes(query)
    );
  });

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-2 px-1 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shrink-0">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          title={t.cheatsheet.title}
          className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span
          className="mt-4 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500"
          style={{ writingMode: 'vertical-rl' }}
        >
          {t.cheatsheet.title}
        </span>
      </div>
    );
  }

  return (
    <aside
      style={{ width: `${width}px` }}
      className="relative flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shrink-0"
    >
      {/* Drag resize handle */}
      <div
        onMouseDown={startResize}
        title={localizeText(language, 'Breite anpassen', 'Resize width')}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/40 transition-colors z-20"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
            {t.cheatsheet.title}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          title={t.controls.close}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.cheatsheet.searchPlaceholder}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Built-in Templates */}
        {filteredItems.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-3">
            {t.cheatsheet.noMatches}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const title = localizeText(language, item.titleDe, item.titleEn);
              const desc = localizeText(language, item.descriptionDe, item.descriptionEn);
              const helpOpen = openHelpId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenHelpId(helpOpen ? null : item.id)}
                        title={desc}
                        className={`p-0.5 rounded transition-colors ${
                          helpOpen
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        aria-label="?"
                      >
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.syntax)}
                        title={t.controls.copy}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onInsertText(item.exampleSql || item.syntax)}
                        title={t.controls.insert}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <CornerDownLeft className="w-2.5 h-2.5" />
                        <span>{t.controls.insert}</span>
                      </button>
                    </div>
                  </div>

                  {helpOpen && (
                    <p className="px-2.5 py-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 bg-blue-50/40 dark:bg-blue-950/20 border-b border-slate-200/70 dark:border-slate-800">
                      {desc}
                    </p>
                  )}

                  <pre className="px-2.5 py-1.5 font-mono text-[11px] leading-snug text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                    {item.syntax}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Snippets */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                {t.cheatsheet.customSnippetsTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>{localizeText(language, 'Neu', 'Add')}</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddSnippet}
              className="mb-2.5 p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 space-y-1.5"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t.cheatsheet.snippetTitlePlaceholder}
                className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                required
              />
              <textarea
                rows={3}
                value={newSql}
                onChange={(e) => setNewSql(e.target.value)}
                placeholder={t.cheatsheet.snippetSqlPlaceholder}
                className="w-full px-2 py-1 font-mono text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                required
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.controls.cancel}
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-[11px] font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {t.cheatsheet.addSnippet}
                </button>
              </div>
            </form>
          )}

          {customSnippets.length === 0 ? (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1">
              {t.cheatsheet.noSnippets}
            </p>
          ) : (
            <div className="space-y-1.5">
              {customSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-2 py-1 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">
                      {snippet.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(snippet.id, snippet.sql)}
                        title={t.controls.copy}
                        className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onInsertText(snippet.sql)}
                        title={t.controls.insert}
                        className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <CornerDownLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        title={t.controls.delete}
                        className="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <pre className="px-2 py-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                    {snippet.sql}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
