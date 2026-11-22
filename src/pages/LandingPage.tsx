import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Database,
  Download,
  FileCode2,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  Layers,
  Lock,
  Minus,
  Moon,
  Network,
  Sparkles,
  Sun,
  Terminal,
  Zap,
  Apple,
  Monitor,
} from 'lucide-react';
import { getTranslations, type Language } from '../i18n/translations';
import { LiveSqlPreview } from '../components/LiveSqlPreview';
import {
  DownloadGatekeeperModal,
  type DownloadPlatform,
} from '../components/DownloadGatekeeperModal';
import { ImpressumModal } from '../components/ImpressumModal';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  navigate,
}) => {
  const t = getTranslations(language);
  const isEn = language === 'en';

  const [downloadPlatform, setDownloadPlatform] = useState<DownloadPlatform | null>(null);
  const [impressumOpen, setImpressumOpen] = useState(false);

  useEffect(() => {
    document.title = isEn
      ? 'SQL Trainer – Free Browser SQL Editor, ER Designer & 48 Guided Lessons'
      : 'SQL Trainer – Freier Browser-SQL-Editor, ER-Designer & 48 Lernpfad-Lektionen';
  }, [isEn]);

  const comparisonRows = isEn
    ? [
        {
          criterion: 'Installation & Files',
          xampp: 'Local server, port conflicts, PHP/Apache config',
          trainer: 'Zero install – open & save .sql/.sqlite/.db (Ctrl+S)',
        },
        {
          criterion: 'MySQL School Syntax',
          xampp: 'Manual server start required',
          trainer: 'SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT built-in',
        },
        {
          criterion: 'Visual ER Model Designer',
          xampp: 'Separate tool (e.g. MySQL Workbench) required',
          trainer: '1:1, 1:N, N:M Designer → SQL generation + SVG & PNG export',
        },
        {
          criterion: 'Automated Task Grading',
          xampp: 'None (manual comparison only)',
          trainer: 'Instant feedback on columns, rows & sorting',
        },
        {
          criterion: 'Learning Paths & Abitur Prep',
          xampp: 'Empty database, no exercises',
          trainer: '48 lessons in 5 paths (School, Online Shop, Cinema & Sandbox)',
        },
        {
          criterion: 'Privacy, Export & Offline Use',
          xampp: 'Local only',
          trainer: '100% local in browser, CSV/PNG export + macOS/Windows App',
        },
      ]
    : [
        {
          criterion: 'Installation & Dateien',
          xampp: 'Lokaler Server, Port-Konflikte, manuelle Konfiguration',
          trainer: 'Keine Installation – .sql/.sqlite/.db öffnen & speichern (Strg+S)',
        },
        {
          criterion: 'MySQL-Schulsyntax',
          xampp: 'Server muss ständig manuell gestartet werden',
          trainer: 'SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT direkt aktiv',
        },
        {
          criterion: 'Visueller ER-Modell-Designer',
          xampp: 'Separates Tool (z. B. MySQL Workbench) nötig',
          trainer: '1:1, 1:N, N:M Designer → SQL-Generierung + SVG- & PNG-Export',
        },
        {
          criterion: 'Automatische Aufgaben-Prüfung',
          xampp: 'Keine (nur manuelles Prüfen)',
          trainer: 'Sofortiges Feedback zu Spalten, Werten & Sortierung',
        },
        {
          criterion: 'Lernpfade & Abitur-Training',
          xampp: 'Leere Datenbank ohne Aufgaben',
          trainer: '48 Lektionen in 5 Lernpfaden (Schule, Online-Shop, Kino & Sandbox)',
        },
        {
          criterion: 'Datenschutz, Export & Offline',
          xampp: 'Lokal',
          trainer: '100 % lokal im Browser, CSV-/PNG-Export + macOS/Windows-App',
        },
      ];

  const faqs = isEn
    ? [
        {
          q: 'Do I need to install MySQL or XAMPP?',
          a: 'No. SQL Trainer runs completely locally inside your browser using WebAssembly (sql.js). Open the free SQL workspace, create tables with CREATE TABLE, or open/save .sql, .sqlite, and .db files directly.',
        },
        {
          q: 'Can I design ER models and generate SQL like in MySQL Workbench?',
          a: 'Yes! The built-in Visual ER Model Designer lets you model entities and 1:1, 1:N, and N:M relationships, automatically generate CREATE TABLE SQL, and export diagrams as SVG or PNG.',
        },
        {
          q: 'How are the learning paths structured?',
          a: 'There are 48 lessons organized into 5 clear paths: Basics, Aggregation, Joins, Building Databases (DDL/DML), and Abitur Exam Training across School, Online Shop, Cinema, and Empty Sandbox.',
        },
        {
          q: 'Why is there a macOS / Windows security prompt for the desktop app?',
          a: 'SQL Trainer is free open-source software without a paid developer certificate. Our download dialog explains how to open it safely via right-click (macOS) or SmartScreen (Windows).',
        },
      ]
    : [
        {
          q: 'Muss ich MySQL oder XAMPP installieren?',
          a: 'Nein. Der SQL-Trainer führt alle Abfragen vollständig lokal per WebAssembly (sql.js) im Browser aus. Erstelle eigene Tabellen mit CREATE TABLE oder öffne und speichere .sql-, .sqlite- und .db-Dateien direkt mit Strg+S.',
        },
        {
          q: 'Kann ich ER-Modelle wie in MySQL Workbench entwerfen?',
          a: 'Ja! Mit dem visuellen ER-Modell-Designer modellierst du Tabellen sowie 1:1-, 1:N- und N:M-Beziehungen, generierst daraus direkt SQL-Code und exportierst dein Schema als SVG oder PNG.',
        },
        {
          q: 'Wie sind die Lernpfade und das Abitur-Training aufgebaut?',
          a: 'Dich erwarten 48 Lektionen in 5 klaren Lernpfaden (Grundlagen, Aggregation, Joins, Datenbanken bauen DDL/DML und Abitur-Training) über Schule, Online-Shop, Kino & Leere Sandbox – mit automatischer Ergebnis-Prüfung.',
        },
        {
          q: 'Warum erscheint beim Desktop-Download eine Gatekeeper-/SmartScreen-Meldung?',
          a: 'Der SQL-Trainer ist ein kostenloses Open-Source-Projekt ohne kostenpflichtiges Signaturzertifikat. Im Download-Fenster zeigen wir dir Schritt für Schritt, wie du die App sicher öffnest.',
        },
      ];

  const seoLinks = [
    {
      path: '/mysql-ueben',
      title: t.nav.mysqlPractice,
      desc: isEn
        ? 'Practice SHOW TABLES, DESCRIBE & MySQL DDL in browser'
        : 'SHOW TABLES, DESCRIBE & MySQL-DDL direkt testen',
      icon: <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      path: '/sql-joins-lernen',
      title: t.nav.joinsLearn,
      desc: isEn
        ? 'Understand INNER JOIN, LEFT JOIN & foreign keys'
        : 'INNER JOIN, LEFT JOIN & Fremdschlüssel verstehen',
      icon: <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      path: '/sql-abitur-aufgaben',
      title: t.nav.abiturTasks,
      desc: isEn
        ? 'Exam-level SQL tasks with automated grading'
        : 'Klausur- & Abitur-Aufgaben mit automatischer Prüfung',
      icon: <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      path: '/faq',
      title: t.nav.faq,
      desc: isEn
        ? 'Answers on WebAssembly, privacy & desktop apps'
        : 'Antworten zu WebAssembly, Datenschutz & Desktop-App',
      icon: <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-graph-paper text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center gap-2 font-bold text-base tracking-tight text-slate-950 dark:text-white"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-600 text-white">
                <Terminal className="w-4 h-4" />
              </span>
              <span>SQL-Trainer</span>
            </a>

            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <a
                href="/mysql-ueben"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/mysql-ueben');
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.mysqlPractice}
              </a>
              <a
                href="/sql-joins-lernen"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/sql-joins-lernen');
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.joinsLearn}
              </a>
              <a
                href="/sql-abitur-aufgaben"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/sql-abitur-aufgaben');
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.abiturTasks}
              </a>
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/faq');
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.faq}
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle DE | EN */}
            <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
              <button
                type="button"
                onClick={() => onLanguageChange('de')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  language === 'de'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle Light | Dark */}
            <button
              type="button"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? t.controls.themeDark : t.controls.themeLight}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <a
              href="/app"
              onClick={(e) => {
                e.preventDefault();
                navigate('/app');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {isEn ? 'Open Trainer' : 'Trainer öffnen'}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Hero Copy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {isEn
                    ? '100% In-Browser · SQL Editor, ER Designer & 48 Lessons'
                    : '100 % im Browser · SQL-Editor, ER-Designer & 48 Lektionen'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.55rem] font-bold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                {isEn
                  ? 'Free SQL Editor, ER Designer & Guided Trainer – right in your browser'
                  : 'Freier SQL-Editor, ER-Designer & Lernpfad-Trainer – direkt im Browser'}
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Build your own databases in a free MySQL sandbox without XAMPP — complete with a visual ER model designer and .sql/.sqlite/.db file support — or master SQL step by step across 48 lessons in 5 learning paths.'
                  : 'Entwickle eigene Datenbanken in der freien MySQL-Sandbox ohne XAMPP – inklusive visuellem ER-Modell-Designer und .sql/.sqlite/.db-Dateien – oder trainiere gezielt mit 48 Lektionen in 5 Lernpfaden bis zum Abitur.'}
              </p>

              {/* Primary CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="/app"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/app');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  {isEn ? 'Open Workspace & Trainer →' : 'Workspace & Trainer öffnen →'}
                </a>

                <a
                  href="/sql-abitur-aufgaben"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/sql-abitur-aufgaben');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {t.landing.ctaAbitur}
                </a>
              </div>

              {/* Desktop Downloads */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? 'Optional Offline Desktop App (Tauri):'
                      : 'Optional als Offline Desktop-App (Tauri):'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDownloadPlatform('macos')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer"
                  >
                    <Apple className="w-4 h-4" />
                    <span>macOS (.dmg)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadPlatform('windows')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer"
                  >
                    <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Windows (.exe)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Interactive Live SQL Preview */}
            <div className="lg:col-span-7">
              <LiveSqlPreview
                language={language}
                onOpenTrainer={() => navigate('/app')}
              />
            </div>
          </div>
        </section>

        {/* Two Core Pillars Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {isEn
                ? 'Two Workspaces in One Tool'
                : 'Zwei starke Säulen in einem Tool'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEn
                ? 'Whether you want to design and query your own databases freely or follow structured exam preparation.'
                : 'Ob freie Datenbankentwicklung ohne XAMPP oder geführtes Lernen bis zum Informatik-Abitur.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pillar 1: Free Browser SQL Editor & MySQL Sandbox */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
                    <Database className="w-3.5 h-3.5" />
                    {isEn ? 'Free SQL Sandbox' : 'Freie SQL-Sandbox'}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {isEn ? 'No XAMPP needed' : 'Ohne XAMPP'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  {isEn
                    ? 'Free Browser SQL Editor & MySQL Sandbox'
                    : 'Freier Browser-SQL-Editor & MySQL-Sandbox'}
                </h3>

                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <>
                          Create your own databases (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">CREATE TABLE</code>) & run MySQL syntax directly
                        </>
                      ) : (
                        <>
                          Eigene Datenbanken erstellen (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">CREATE TABLE</code>) & MySQL-Befehle direkt testen
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <>
                          <strong>Visual ER Model Designer</strong> (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1:1</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1:N</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">N:M</code> → SQL generation like MySQL Workbench)
                        </>
                      ) : (
                        <>
                          <strong>Visueller ER-Modell-Designer</strong> (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1:1</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1:N</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">N:M</code> → SQL-Generierung wie in MySQL Workbench)
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <>
                          Open & save <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.sql</code> / <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.sqlite</code> / <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.db</code> files (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+S</code>)
                        </>
                      ) : (
                        <>
                          <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.sql</code> / <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.sqlite</code> / <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.db</code> öffnen & speichern (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Strg+S</code>)
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Schema Explorer with SVG diagram, CSV & PNG export — 100% local in browser'
                        : 'Schema-Explorer mit SVG-Diagramm, CSV- & PNG-Export – 100 % lokal im Browser'}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href="/app"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/app');
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isEn ? 'Open Free SQL Workspace' : 'Freien SQL-Workspace öffnen'}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Pillar 2: Structured Learning Paths & Abitur Trainer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {isEn ? '48 Lessons · 5 Paths' : '48 Lektionen · 5 Lernpfade'}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {isEn ? 'Auto-graded' : 'Auto-Prüfung'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  {isEn
                    ? 'Structured Learning Paths & Abitur Trainer'
                    : 'Strukturierter Lernpfad- & Abitur-Trainer'}
                </h3>

                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <>
                          <strong>48 lessons in 5 clear learning paths</strong>: Basics, Aggregation, Joins, Building Databases (DDL/DML) & Abitur Training
                        </>
                      ) : (
                        <>
                          <strong>48 Lektionen in 5 klaren Lernpfaden</strong>: Grundlagen, Aggregation, Joins, Datenbanken bauen (DDL/DML) & Abitur-Training
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <>
                          Practice across <em>School</em>, <em>Online Shop</em>, <em>Cinema</em> & <em>Empty Sandbox</em>
                        </>
                      ) : (
                        <>
                          Praxisnahe Datenbanken: <em>Schule</em>, <em>Online-Shop</em>, <em>Kino</em> & <em>Leere Sandbox</em>
                        </>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Automated result checking on columns, values & sorting'
                        : 'Automatische Ergebnis-Prüfung auf Spalten, Werte & Sortierung'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Built-in hints, reference solutions, custom tasks & JSON progress export'
                        : 'Integrierte Hinweise, Musterlösungen, eigene Aufgaben & JSON-Lernstand'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/app"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/app');
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  {isEn ? 'Start Learning Paths' : 'Lernpfade starten'}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/sql-abitur-aufgaben"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/sql-abitur-aufgaben');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {t.landing.ctaAbitur} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white mb-8">
              {t.landing.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5">
                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {isEn ? '.sql / .sqlite / .db & Ctrl+S' : '.sql / .sqlite / .db & Strg+S'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Zero install via WebAssembly. Open local database files, write CREATE TABLE queries, and save directly.'
                    : 'Ohne Installation per WebAssembly. Öffne lokale Datenbanken, erstelle Tabellen mit CREATE TABLE und speichere direkt.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5">
                <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {isEn ? 'Visual ER Model Designer' : 'Visueller ER-Modell-Designer'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Design 1:1, 1:N & N:M relationships visually, generate SQL like MySQL Workbench, and export SVG or PNG.'
                    : 'Modelliere 1:1-, 1:N- & N:M-Beziehungen visuell, generiere SQL wie in MySQL Workbench und exportiere SVG oder PNG.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {isEn ? 'MySQL Mode & Schema Explorer' : 'MySQL-Modus & Schema-Explorer'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Supports SHOW TABLES, DESCRIBE, AUTO_INCREMENT & CONCAT, live SVG schema diagram, plus CSV & PNG export.'
                    : 'Unterstützt SHOW TABLES, DESCRIBE, AUTO_INCREMENT & CONCAT, SVG-Diagramm sowie CSV- & PNG-Export.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {isEn ? '48 Lessons in 5 Learning Paths' : '48 Lektionen in 5 Lernpfaden'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Basics, Aggregation, Joins, DDL/DML & Abitur Training across School, Online Shop, Cinema & Sandbox with auto-grading.'
                    : 'Grundlagen, Aggregation, Joins, DDL/DML & Abitur-Training über Schule, Online-Shop, Kino & Sandbox mit Auto-Prüfung.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table: XAMPP / DB Browser vs. SQL-Trainer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {isEn
                ? 'XAMPP / DB Browser vs. SQL-Trainer'
                : 'XAMPP / DB Browser vs. SQL-Trainer'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEn
                ? 'Why teachers and students switch from heavy local server setups to SQL-Trainer.'
                : 'Warum Lehrkräfte, Schülerinnen und Schüler vom lokalen Server-Setup zum SQL-Trainer wechseln.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <th className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-200">
                    {isEn ? 'Feature' : 'Kriterium'}
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">
                    XAMPP / DB Browser
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-blue-700 dark:text-blue-400">
                    SQL-Trainer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonRows.map((row) => (
                  <tr key={row.criterion} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {row.criterion}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {row.xampp}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        {row.trainer}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Topics / SEO Guides */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white mb-5">
            {isEn ? 'Guides & Topics' : 'Lernpfade & Themen'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seoLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {isEn ? 'Frequently Asked Questions' : 'Häufige Fragen (FAQ)'}
              </h2>
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/faq');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isEn ? 'All FAQs →' : 'Alle FAQs →'}
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2"
                >
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {item.q}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Best-Tools Suite Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                {isEn
                  ? 'More Computer Science Tools from the Best-Tools Suite'
                  : 'Weitere Informatik-Tools aus der Best-Tools Suite'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Free, privacy-friendly tools for computer science classes, Abitur exams, and university — directly in your browser or as a desktop app.'
                  : 'Kostenlose, datenschutzfreundliche Werkzeuge für Informatik-Unterricht, Abitur und Studium — direkt im Browser oder als Desktop-App.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://strukto.best-tools.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-950/50 p-4 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Eren Struktogrammer
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      DIN 66261
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Modern structogram editor following DIN 66261 (Nassi-Shneiderman) — with branches, loops, SVG/PNG export, 1-click screenshot, plus macOS & Windows app.'
                      : 'Moderner Struktogramm-Editor nach DIN 66261 (Nassi-Shneiderman) als Alternative zum klassischen HuS Struktogrammer — mit Verzweigungen, Schleifen, SVG/PNG-Export, 1-Klick-Screenshot sowie macOS- und Windows-App.'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-blue-600 dark:text-blue-400">
                  <span>strukto.best-tools.app</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              <a
                href="https://erm.best-tools.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-950/50 p-4 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      ERM-Editor
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      Chen &amp; Min-Max
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Specialized Entity-Relationship diagram editor in Chen & Min-Max notation (yEd alternative) — with weak entities, auto-layout, relational schema derivation, and SQL CREATE TABLE preview.'
                      : 'Spezialisierter Editor für Entity-Relationship-Modelle in Chen- und Min-Max-Notation (Alternative zu yEd) — mit schwachen Entitäten, Auto-Layout, Live-Ableitung des Relationenmodells und SQL CREATE TABLE-Vorschau.'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-blue-600 dark:text-blue-400">
                  <span>erm.best-tools.app</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              <a
                href="/app"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/app');
                }}
                className="group rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/20 p-4 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                      SQL-Trainer
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300">
                      MySQL &amp; SQLite
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Interactive SQL Trainer & MySQL/SQLite sandbox directly in your browser — ideal for running CREATE TABLE scripts from ERM-Editor and practicing queries.'
                      : 'Interaktiver SQL-Trainer & MySQL/SQLite-Sandbox direkt im Browser — ideal, um die aus dem ERM-Editor abgeleiteten CREATE TABLE-Statements und Abfragen sofort auszuführen und zu üben.'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-blue-600 dark:text-blue-400">
                  <span>sql.best-tools.app</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Compact Changelog Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isEn ? 'Changelog & Version History' : 'Changelog & Versionshistorie'}
              </h2>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {isEn ? 'Current: v1.0.1' : 'Aktuell: v1.0.1'}
              </span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  v1.0.1
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {isEn ? 'Full-Width Workspace & Maximized Desktop Window' : 'Randloses Vollbild-Layout & Maximiertes Desktop-Fenster'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">2026-11-21</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>
                  {isEn
                    ? 'Removed 1920px width cap so editor, schema explorer, and cheat sheet fill ultrawide monitors edge-to-edge'
                    : '1920px-Breitenbegrenzung entfernt: Editor, Schema-Explorer und Spickzettel nutzen breite Monitore jetzt randlos'}
                </li>
                <li>
                  {isEn
                    ? 'Desktop app now opens maximized by default'
                    : 'Desktop-App startet jetzt standardmäßig maximiert im Vollbild'}
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v1.0.0
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {isEn ? 'Initial Release (Web & Desktop)' : 'Erstveröffentlichung (Web & Desktop)'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">2026-11-21</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>
                  {isEn
                    ? '100% local SQL engine via sql.js (WebAssembly) with MySQL compatibility layer & SQLite mode'
                    : '100 % lokale SQL-Engine via sql.js (WebAssembly) mit MySQL-Kompatibilitätsmodus & SQLite-Modus'}
                </li>
                <li>
                  {isEn
                    ? 'App Hub with 5 structured learning paths (48 lessons), Abitur mode, and local IndexedDB database projects'
                    : 'App-Hub mit 5 strukturierten Lernpfaden (48 Lektionen), Abitur-Modus und lokalem IndexedDB-Projektspeicher'}
                </li>
                <li>
                  {isEn
                    ? 'Visual ER Model Designer (1:1, 1:N, N:M junction tables), saved ER models, and 1-click SQL database generation'
                    : 'Visueller ER-Modell-Designer (1:1, 1:N, N:M-Zwischentabellen), gespeicherte ER-Modelle & 1-Klick-Datenbankerstellung'}
                </li>
                <li>
                  {isEn
                    ? 'Native macOS Desktop app (.dmg) with built-in server auto-updater in the footer'
                    : 'Native macOS Desktop-App (.dmg) mit integriertem Server-Auto-Updater in der Fußzeile'}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {t.footer.localNote} {t.footer.privacyNote}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/app"
              onClick={(e) => {
                e.preventDefault();
                navigate('/app');
              }}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {t.nav.trainer}
            </a>
            <a
              href="/faq"
              onClick={(e) => {
                e.preventDefault();
                navigate('/faq');
              }}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {t.nav.faq}
            </a>
            <a
              href={language === 'en' ? '/en/blog' : '/blog'}
              onClick={(e) => {
                e.preventDefault();
                navigate(language === 'en' ? '/en/blog' : '/blog');
              }}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Blog
            </a>
            <button
              type="button"
              onClick={() => setImpressumOpen(true)}
              className="hover:text-slate-900 dark:hover:text-slate-100 underline cursor-pointer transition-colors"
            >
              Impressum
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DownloadGatekeeperModal
        isOpen={downloadPlatform !== null}
        platform={downloadPlatform ?? 'macos'}
        language={language}
        onClose={() => setDownloadPlatform(null)}
      />

      <ImpressumModal
        isOpen={impressumOpen}
        onClose={() => setImpressumOpen(false)}
        language={language}
      />
    </div>
  );
};
