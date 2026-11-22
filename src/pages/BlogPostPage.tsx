import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Copy,
  Database,
  FolderPlus,
  Moon,
  Play,
  Sun,
} from 'lucide-react';
import { BLOG_CATEGORY_LABELS, getBlogPostBySlug } from '@/data/blogPosts';
import type { Language } from '@/i18n/translations';
import type { BlogPost } from '@/types/blog';
import { createProjectFromBlogSql, queueBlogHandoff } from '@/utils/blogHandoff';
import type { SavedDatabaseProject } from '@/utils/savedDbStore';

interface BlogPostPageProps {
  slug: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  navigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  navigate,
}) => {
  const isEn = language === 'en';
  const post = getBlogPostBySlug(slug);

  const [copied, setCopied] = useState(false);
  const [addingDb, setAddingDb] = useState(false);
  const [addedProject, setAddedProject] = useState<SavedDatabaseProject | null>(null);
  const [addDbError, setAddDbError] = useState<string | null>(null);

  useEffect(() => {
    setCopied(false);
    setAddingDb(false);
    setAddedProject(null);
    setAddDbError(null);
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${isEn ? post.titleEn : post.titleDe} | SQL-Trainer`;
    } else {
      document.title = isEn ? 'Article Not Found | SQL-Trainer' : 'Artikel nicht gefunden | SQL-Trainer';
    }
  }, [post, isEn]);

  const blogIndexPath = isEn ? '/en/blog' : '/blog';

  const handleLanguageSwitch = (nextLang: Language) => {
    onLanguageChange(nextLang);
    if (post) {
      navigate(nextLang === 'en' ? `/en/blog/${post.slug}` : `/blog/${post.slug}`);
    } else {
      navigate(nextLang === 'en' ? '/en/blog' : '/blog');
    }
  };

  const handleOpenInEditor = (sql: string) => {
    queueBlogHandoff({ type: 'editor', sql });
    navigate('/app');
  };

  const handleAddToHub = async () => {
    if (!post?.codeExample || addingDb) return;
    setAddingDb(true);
    setAddDbError(null);

    try {
      const dbName =
        post.codeExample.suggestedDbName ||
        (isEn ? post.codeExample.titleEn : post.codeExample.titleDe);
      const project = await createProjectFromBlogSql(dbName, post.codeExample.sql);
      queueBlogHandoff({ type: 'hub-project', projectId: project.id });
      setAddedProject(project);
    } catch (err) {
      setAddDbError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Failed to create database project.'
            : 'Datenbankprojekt konnte nicht erstellt werden.'
      );
    } finally {
      setAddingDb(false);
    }
  };

  const handleOpenInHub = (projectId: string) => {
    queueBlogHandoff({ type: 'hub-project', projectId });
    navigate('/app');
  };

  const handleCopySql = async (sql: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const relatedPosts: BlogPost[] = post
    ? post.relatedSlugs
        .map((relSlug) => getBlogPostBySlug(relSlug))
        .filter((item): item is BlogPost => Boolean(item))
    : [];

  const canAddAsDatabase = Boolean(
    post?.codeExample &&
      (post.codeExample.isDatabaseTemplate || /\bCREATE\s+TABLE\b/i.test(post.codeExample.sql))
  );

  return (
    <div className="min-h-screen bg-graph-paper text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0 text-sm">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
            >
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>SQL-Trainer</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <a
              href={blogIndexPath}
              onClick={(e) => {
                e.preventDefault();
                navigate(blogIndexPath);
              }}
              className="font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
              Blog
            </a>
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <div>
          <a
            href={blogIndexPath}
            onClick={(e) => {
              e.preventDefault();
              navigate(blogIndexPath);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to all articles' : 'Zurück zur Artikel-Übersicht'}</span>
          </a>
        </div>

        {!post ? (
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEn ? 'Article not found' : 'Artikel nicht gefunden'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isEn
                ? 'The requested blog post does not exist or may have been moved.'
                : 'Der angeforderte Blog-Artikel existiert nicht oder wurde verschoben.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={blogIndexPath}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(blogIndexPath);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              >
                {isEn ? 'All Articles' : 'Alle Artikel'}
              </a>
              <a
                href="/app"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/app');
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white"
              >
                {isEn ? 'Open Trainer' : 'Trainer öffnen'}
              </a>
            </div>
          </section>
        ) : (
          <article className="space-y-8">
            {/* Article Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300">
                  {isEn
                    ? BLOG_CATEGORY_LABELS[post.category].en
                    : BLOG_CATEGORY_LABELS[post.category].de}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {isEn ? `${post.readingMinutes} min read` : `${post.readingMinutes} Min. Lesezeit`}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-mono">
                  {post.publishedAt}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
                {isEn ? post.titleEn : post.titleDe}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn ? post.descriptionEn : post.descriptionDe}
              </p>
            </header>

            {/* Sections */}
            <div className="space-y-6">
              {post.sections.map((section, idx) => (
                <section
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-3"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {isEn ? section.headingEn : section.headingDe}
                  </h2>
                  <div className="space-y-3">
                    {(isEn ? section.paragraphsEn : section.paragraphsDe).map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Interactive SQL Code Example */}
            {post.codeExample && (
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {isEn ? 'Interactive SQL Example' : 'Interaktives SQL-Beispiel'}
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {isEn ? post.codeExample.titleEn : post.codeExample.titleDe}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySql(post.codeExample!.sql)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{isEn ? 'Copied' : 'Kopiert'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Copy SQL' : 'SQL kopieren'}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{post.codeExample.sql}</code>
                </pre>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenInEditor(post.codeExample!.sql)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Open in Editor →' : 'Im Editor öffnen →'}</span>
                  </button>

                  {canAddAsDatabase && (
                    <button
                      type="button"
                      onClick={handleAddToHub}
                      disabled={addingDb}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>
                        {addingDb
                          ? isEn
                            ? 'Adding to Hub...'
                            : 'Wird hinzugefügt...'
                          : isEn
                            ? 'Add as Database to Hub'
                            : 'Als Datenbank zum Hub hinzufügen'}
                      </span>
                    </button>
                  )}
                </div>

                {addDbError && (
                  <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                    {addDbError}
                  </p>
                )}

                {addedProject && (
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                      {isEn
                        ? `Database "${addedProject.name}" (${addedProject.tableCount} tables, ${addedProject.rowCountTotal} rows) added to Hub.`
                        : `Datenbank „${addedProject.name}“ (${addedProject.tableCount} Tabellen, ${addedProject.rowCountTotal} Zeilen) zum Hub hinzugefügt.`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenInHub(addedProject.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                    >
                      <span>{isEn ? 'Open in Hub →' : 'Im Hub öffnen →'}</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="space-y-4 pt-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {isEn ? 'Related Articles' : 'Weiterführende Artikel'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map((rel) => {
                    const relPath = isEn ? `/en/blog/${rel.slug}` : `/blog/${rel.slug}`;
                    return (
                      <a
                        key={rel.slug}
                        href={relPath}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(relPath);
                        }}
                        className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-2"
                      >
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {isEn
                            ? BLOG_CATEGORY_LABELS[rel.category].en
                            : BLOG_CATEGORY_LABELS[rel.category].de}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {isEn ? rel.titleEn : rel.titleDe}
                        </div>
                        <div className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                          <span>{isEn ? 'Read article' : 'Artikel lesen'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Internal Links */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {isEn ? 'More SQL-Trainer resources:' : 'Weitere SQL-Trainer Themenbereiche:'}
              </div>
              <nav className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {[
                  { path: '/mysql-ueben', de: 'MySQL üben', en: 'Practice MySQL' },
                  { path: '/sql-joins-lernen', de: 'SQL JOINs lernen', en: 'Learn SQL JOINs' },
                  { path: '/sql-abitur-aufgaben', de: 'SQL Abitur-Aufgaben', en: 'SQL Abitur Tasks' },
                  { path: '/app', de: 'Zum SQL-Trainer', en: 'Open SQL-Trainer' },
                ].map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {isEn ? item.en : item.de}
                  </a>
                ))}
              </nav>
            </section>
          </article>
        )}
      </main>
    </div>
  );
};
