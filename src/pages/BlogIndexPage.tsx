import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Database,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { BLOG_CATEGORY_LABELS, BLOG_POSTS } from '@/data/blogPosts';
import type { Language } from '@/i18n/translations';
import type { BlogCategory } from '@/types/blog';

interface BlogIndexPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  navigate: (path: string) => void;
}

const CATEGORY_ORDER: BlogCategory[] = [
  'basics',
  'joins',
  'aggregation',
  'ddl_design',
  'abitur_school',
  'templates',
  'opensource_tech',
];

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  navigate,
}) => {
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = isEn
      ? 'SQL-Trainer Blog – Tutorials, Templates & Exam Guides'
      : 'SQL-Trainer Blog – Tutorials, Datenbank-Vorlagen & Abitur-Guides';
  }, [isEn]);

  const categoryCounts = useMemo(() => {
    const counts: Record<BlogCategory, number> = {
      basics: 0,
      joins: 0,
      aggregation: 0,
      ddl_design: 0,
      abitur_school: 0,
      templates: 0,
      opensource_tech: 0,
    };
    for (const post of BLOG_POSTS) {
      counts[post.category] += 1;
    }
    return counts;
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const title = (isEn ? post.titleEn : post.titleDe).toLowerCase();
      const desc = (isEn ? post.descriptionEn : post.descriptionDe).toLowerCase();
      const keywords = (isEn ? post.keywordsEn : post.keywordsDe).join(' ').toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        keywords.includes(q) ||
        post.slug.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery, isEn]);

  const handleLanguageSwitch = (nextLang: Language) => {
    onLanguageChange(nextLang);
    navigate(nextLang === 'en' ? '/en/blog' : '/blog');
  };

  return (
    <div className="min-h-screen bg-graph-paper text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
            >
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>SQL-Trainer</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              Blog
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('de')}
                className={`px-2 py-1 cursor-pointer transition-colors ${
                  language === 'de'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2 py-1 cursor-pointer transition-colors ${
                  language === 'en'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              aria-label={isEn ? 'Toggle theme' : 'Theme wechseln'}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <a
              href="/app"
              onClick={(e) => {
                e.preventDefault();
                navigate('/app');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <span>{isEn ? 'Open Trainer →' : 'Trainer öffnen →'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        {/* Intro */}
        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              {isEn
                ? `${BLOG_POSTS.length} Articles · SQL, MySQL & Database Design`
                : `${BLOG_POSTS.length} Artikel · SQL, MySQL & Datenbankdesign`}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            {isEn ? 'SQL-Trainer Engineering Blog' : 'SQL-Trainer Wissensdatenbank & Blog'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'Practical SQL tutorials, Abitur exam walkthroughs, and ready-to-run database templates you can open directly in the browser trainer.'
              : 'Praxisnahe SQL-Anleitungen, Abitur-Vorbereitung und sofort ausführbare Datenbank-Vorlagen – mit einem Klick direkt im Browser-Trainer testbar.'}
          </p>
        </section>

        {/* Search & Category Filters */}
        <section className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search articles, keywords, or SQL topics...'
                  : 'Artikel, Stichwörter oder SQL-Themen suchen...'
              }
              aria-label={isEn ? 'Search blog articles' : 'Blog-Artikel suchen'}
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={isEn ? 'Clear search' : 'Suche zurücksetzen'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isEn ? `All (${BLOG_POSTS.length})` : `Alle (${BLOG_POSTS.length})`}
            </button>

            {CATEGORY_ORDER.map((cat) => {
              const active = selectedCategory === cat;
              const label = isEn
                ? BLOG_CATEGORY_LABELS[cat].en
                : BLOG_CATEGORY_LABELS[cat].de;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {label} ({categoryCounts[cat]})
                </button>
              );
            })}
          </div>
        </section>

        {/* Results */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isEn
                ? 'No articles match your current filter.'
                : 'Keine Artikel für diesen Filter gefunden.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
            >
              {isEn ? 'Reset filters' : 'Filter zurücksetzen'}
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => {
              const articlePath = isEn ? `/en/blog/${post.slug}` : `/blog/${post.slug}`;
              const categoryLabel = isEn
                ? BLOG_CATEGORY_LABELS[post.category].en
                : BLOG_CATEGORY_LABELS[post.category].de;
              const title = isEn ? post.titleEn : post.titleDe;
              const description = isEn ? post.descriptionEn : post.descriptionDe;

              return (
                <a
                  key={post.slug}
                  href={articlePath}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(articlePath);
                  }}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {isEn ? `${post.readingMinutes} min` : `${post.readingMinutes} Min.`}
                      </span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                      {post.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      {isEn ? 'Read' : 'Lesen'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>SQL-Trainer · {isEn ? 'Browser SQL & MySQL Practice' : 'SQL & MySQL im Browser üben'}</span>
          <nav className="flex flex-wrap items-center gap-4">
            {[
              { path: '/mysql-ueben', de: 'MySQL üben', en: 'Practice MySQL' },
              { path: '/sql-joins-lernen', de: 'SQL JOINs lernen', en: 'Learn SQL JOINs' },
              { path: '/sql-abitur-aufgaben', de: 'Abitur-Aufgaben', en: 'Abitur Tasks' },
              { path: '/faq', de: 'FAQ', en: 'FAQ' },
              { path: '/app', de: 'Trainer', en: 'Trainer' },
            ].map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                }}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {isEn ? link.en : link.de}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};
