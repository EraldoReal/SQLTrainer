import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  GitMerge,
  GraduationCap,
  HelpCircle,
  Sun,
  Moon,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import type { Language } from '../i18n/translations';

export type SeoRoute =
  | '/mysql-ueben'
  | '/sql-joins-lernen'
  | '/sql-abitur-aufgaben'
  | '/faq';

interface SeoSubpageProps {
  route: SeoRoute;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  navigate: (path: string) => void;
}

interface SeoSection {
  heading: string;
  body: string;
  code?: string;
}

interface SeoPageContent {
  titleTag: string;
  badge: string;
  h1: string;
  intro: string;
  ctaLabel: string;
  sections: SeoSection[];
}

const SEO_CONTENT: Record<SeoRoute, { de: SeoPageContent; en: SeoPageContent }> = {
  '/mysql-ueben': {
    de: {
      titleTag: 'MySQL üben im Browser – Kostenloser SQL-Trainer ohne XAMPP',
      badge: 'MySQL-Kompatibilitätsmodus · WebAssembly',
      h1: 'MySQL direkt im Browser üben – ohne XAMPP oder Server-Setup',
      intro:
        'Lerne und teste MySQL-Befehle wie SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT oder LIMIT sofort im Browser. Perfekt für Schule, Studium und Ausbildung.',
      ctaLabel: 'MySQL-Workspace jetzt öffnen →',
      sections: [
        {
          heading: 'MySQL-Syntax ohne lokale Datenbankinstallation',
          body: 'Viele Einsteiger scheitern nicht an SQL selbst, sondern an der Einrichtung von XAMPP, MySQL Workbench oder lokalen Ports. Der SQL-Trainer übersetzt typische MySQL-Befehle transparent auf eine lokale WebAssembly-Datenbank.',
          code: `SHOW TABLES;\nDESCRIBE schueler;\n\nSELECT CONCAT(vorname, ' ', nachname) AS name\nFROM schueler\nLIMIT 5;`,
        },
        {
          heading: 'Unterstützte MySQL-Funktionen & DDL',
          body: 'Neben klassischen SELECT-Abfragen kannst du eigene Tabellen mit AUTO_INCREMENT, VARCHAR, INT und FOREIGN KEY anlegen sowie Datumsfunktionen wie YEAR(), MONTH() und CURDATE() direkt testen.',
        },
        {
          heading: 'Realistische Übungsdatenbanken vorinstalliert',
          body: 'Wähle mit einem Klick zwischen den Datenbanken Schule, Online-Shop und Kino oder lade eigene .sql-Dateien hoch.',
        },
      ],
    },
    en: {
      titleTag: 'Practice MySQL in Browser – Free SQL Trainer without XAMPP',
      badge: 'MySQL Compatibility Mode · WebAssembly',
      h1: 'Practice MySQL right in your browser – zero XAMPP setup',
      intro:
        'Test MySQL commands like SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT, and LIMIT directly in your browser. Ideal for school, university, and exam prep.',
      ctaLabel: 'Open MySQL Workspace →',
      sections: [
        {
          heading: 'MySQL syntax without local server setup',
          body: 'Skip XAMPP port conflicts and local MySQL installs. SQL Trainer runs locally in WebAssembly while supporting common MySQL commands and DDL types.',
          code: `SHOW TABLES;\nDESCRIBE schueler;\n\nSELECT CONCAT(vorname, ' ', nachname) AS full_name\nFROM schueler\nLIMIT 5;`,
        },
        {
          heading: 'Built-in practice databases',
          body: 'Switch between School, Online Shop, and Cinema databases with one click, or import your own .sql dump.',
        },
      ],
    },
  },
  '/sql-joins-lernen': {
    de: {
      titleTag: 'SQL JOINs lernen – INNER JOIN & LEFT JOIN interaktiv verstehen',
      badge: 'Relationale Datenbanken · ER-Diagramm',
      h1: 'SQL JOINs interaktiv lernen: INNER JOIN, LEFT JOIN & Fremdschlüssel',
      intro:
        'Verstehe endlich, wie Tabellen über Primär- und Fremdschlüssel verknüpft werden – mit visuellem ER-Diagramm, Spickzettel und sofortiger Auswertung.',
      ctaLabel: 'JOIN-Aufgaben im Trainer lösen →',
      sections: [
        {
          heading: 'INNER JOIN: Nur passende Datensätze verbinden',
          body: 'Ein INNER JOIN liefert alle Zeilen, bei denen der Fremdschlüssel in Tabelle A mit dem Primärschlüssel in Tabelle B übereinstimmt.',
          code: `SELECT b.id, k.name, b.bestelldatum\nFROM bestellungen b\nINNER JOIN kunden k ON b.kunde_id = k.id\nORDER BY b.bestelldatum DESC;`,
        },
        {
          heading: 'LEFT JOIN: Alle Zeilen der linken Tabelle behalten',
          body: 'Mit LEFT JOIN bleiben auch Datensätze ohne Treffer erhalten (z. B. Kunden ohne Bestellungen). Nicht vorhandene Werte werden als NULL dargestellt.',
          code: `SELECT k.name, COUNT(b.id) AS anzahl_bestellungen\nFROM kunden k\nLEFT JOIN bestellungen b ON k.id = b.kunde_id\nGROUP BY k.id, k.name;`,
        },
        {
          heading: 'Visuelles Schema & ER-Diagramm direkt neben dem Editor',
          body: 'Im Workspace siehst du jederzeit alle Primärschlüssel (PK) und Fremdschlüssel (FK) sowie ein kompaktes Entity-Relationship-Diagramm.',
        },
      ],
    },
    en: {
      titleTag: 'Learn SQL JOINs – Interactive INNER JOIN & LEFT JOIN Guide',
      badge: 'Relational Databases · ER Diagram',
      h1: 'Learn SQL JOINs interactively: INNER JOIN, LEFT JOIN & Foreign Keys',
      intro:
        'Master relational table joins using primary and foreign keys with a built-in ER diagram, cheat sheet, and automated task grading.',
      ctaLabel: 'Practice JOIN Tasks Now →',
      sections: [
        {
          heading: 'INNER JOIN: Matching rows across tables',
          body: 'INNER JOIN combines rows from two tables whenever the join condition between foreign key and primary key matches.',
          code: `SELECT b.id, k.name, b.bestelldatum\nFROM bestellungen b\nINNER JOIN kunden k ON b.kunde_id = k.id;`,
        },
        {
          heading: 'LEFT JOIN: Keep unmatched rows',
          body: 'LEFT JOIN preserves every row from the left table even when no matching row exists on the right (filling missing columns with NULL).',
        },
      ],
    },
  },
  '/sql-abitur-aufgaben': {
    de: {
      titleTag: 'SQL Abitur-Aufgaben – Informatik-Klausuren interaktiv üben',
      badge: 'Abitur-Modus · Automatische Prüfung',
      h1: 'SQL Abitur-Aufgaben interaktiv üben – mit Musterlösung & Prüfung',
      intro:
        'Bereite dich gezielt auf das Informatik-Abitur vor: Komplexe Abfragen mit GROUP BY, HAVING, mehrfachen JOINs und Unterabfragen gegen die Musterlösung prüfen.',
      ctaLabel: 'Abitur-Modus im Trainer starten →',
      sections: [
        {
          heading: 'Typische Operatoren im Informatik-Abitur',
          body: 'In Abituraufgaben werden häufig mehrstufige Verknüpfungen über Zwischentabellen (n:m-Beziehungen), Aggregatfunktionen mit HAVING-Filter sowie geschachtelte Unterabfragen (IN, NOT EXISTS) verlangt.',
          code: `SELECT k.fach, AVG(b.note) AS schnitt\nFROM kurse k\nJOIN belegt b ON k.id = b.kurs_id\nGROUP BY k.id, k.fach\nHAVING COUNT(b.schueler_id) >= 3;`,
        },
        {
          heading: 'Automatische Bewertung ohne Risiko für die Datenbank',
          body: 'Der Task-Grader prüft deine Abfrage auf einer isolierten Kopie der Datenbank. Spaltennamen, Zeilenanzahl, Werte und optionale Sortierung (ORDER BY) werden exakt verglichen.',
        },
        {
          heading: 'Eigene Aufgaben erstellen & als JSON teilen',
          body: 'Lehrkräfte und Lerngruppen können eigene Übungsaufgaben erstellen und als .json-Datei importieren oder exportieren.',
        },
      ],
    },
    en: {
      titleTag: 'Abitur SQL Tasks – Interactive Computer Science Exam Prep',
      badge: 'Exam Mode · Automated Grading',
      h1: 'Practice SQL exam & Abitur tasks with instant automated grading',
      intro:
        'Prepare for CS exams with multi-table joins, GROUP BY, HAVING, and subqueries – checked automatically against reference solutions.',
      ctaLabel: 'Launch Exam Mode →',
      sections: [
        {
          heading: 'Exam-level SQL patterns',
          body: 'Practice many-to-many junction tables, aggregate filtering with HAVING, and correlated subqueries with instant feedback.',
          code: `SELECT k.fach, AVG(b.note) AS avg_grade\nFROM kurse k\nJOIN belegt b ON k.id = b.kurs_id\nGROUP BY k.id, k.fach\nHAVING COUNT(b.schueler_id) >= 3;`,
        },
      ],
    },
  },
  '/faq': {
    de: {
      titleTag: 'FAQ – Häufige Fragen zum SQL-Trainer',
      badge: 'Hilfe & Datenschutz',
      h1: 'Häufige Fragen (FAQ) zum SQL-Trainer',
      intro:
        'Alles zu WebAssembly, Datenschutz, MySQL-Kompatibilität, Desktop-App (macOS/Windows) und dem Einsatz im Unterricht.',
      ctaLabel: 'Direkt zum SQL-Trainer →',
      sections: [
        {
          heading: 'Muss ich eine Datenbank oder MySQL installieren?',
          body: 'Nein. Der SQL-Trainer läuft zu 100 % lokal in deinem Browser über WebAssembly (sql.js). Es wird kein Server und kein XAMPP benötigt.',
        },
        {
          heading: 'Werden meine SQL-Abfragen oder Daten hochgeladen?',
          body: 'Nein. Alle Datenbanken, Abfragen, eigene Aufgaben und der Verlauf bleiben ausschließlich lokal auf deinem Gerät (Browser-Speicher / localStorage).',
        },
        {
          heading: 'Was ist der Unterschied zwischen MySQL-Modus und SQLite?',
          body: 'Unter der Haube arbeitet SQLite in WebAssembly. Im aktivierten MySQL-Modus übersetzt der SQL-Trainer jedoch typische MySQL-Befehle (SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT, YEAR/MONTH/DAY) automatisch.',
        },
        {
          heading: 'Gibt es eine Offline-Desktop-App?',
          body: 'Ja, auf der Startseite kannst du den SQL-Trainer als schlanke Desktop-App für macOS (.dmg) und Windows (.exe) herunterladen.',
        },
      ],
    },
    en: {
      titleTag: 'FAQ – Frequently Asked Questions | SQL Trainer',
      badge: 'Help & Privacy',
      h1: 'Frequently Asked Questions (FAQ)',
      intro:
        'Learn how WebAssembly execution, local privacy, MySQL compatibility mode, and desktop downloads work.',
      ctaLabel: 'Open SQL Trainer →',
      sections: [
        {
          heading: 'Do I need to install MySQL or XAMPP?',
          body: 'No. SQL Trainer runs 100% locally in your browser via WebAssembly (sql.js) with zero setup.',
        },
        {
          heading: 'Are my queries sent to any server?',
          body: 'No. Every query executes locally in your browser. Custom tasks and history are stored only in your local browser storage.',
        },
        {
          heading: 'How does MySQL Mode work?',
          body: 'MySQL Mode translates SHOW TABLES, DESCRIBE, AUTO_INCREMENT, and common MySQL functions (CONCAT, YEAR, MONTH, DAY, etc.) onto the local SQLite WASM engine.',
        },
      ],
    },
  },
};

function getRouteIcon(route: SeoRoute) {
  switch (route) {
    case '/mysql-ueben':
      return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case '/sql-joins-lernen':
      return <GitMerge className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case '/sql-abitur-aufgaben':
      return <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case '/faq':
      return <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  }
}

export const SeoSubpage: React.FC<SeoSubpageProps> = ({
  route,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  navigate,
}) => {
  const content = SEO_CONTENT[route][language];
  const isEn = language === 'en';

  useEffect(() => {
    document.title = content.titleTag;
  }, [content.titleTag]);

  const otherRoutes: { path: SeoRoute; labelDe: string; labelEn: string }[] = [
    { path: '/mysql-ueben', labelDe: 'MySQL üben', labelEn: 'Practice MySQL' },
    { path: '/sql-joins-lernen', labelDe: 'SQL JOINs lernen', labelEn: 'Learn SQL JOINs' },
    { path: '/sql-abitur-aufgaben', labelDe: 'Abitur-Aufgaben', labelEn: 'Abitur Tasks' },
    { path: '/faq', labelDe: 'FAQ', labelEn: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-graph-paper text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              SQL-Trainer
            </button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <nav className="hidden md:flex items-center gap-3 text-xs font-medium">
              {otherRoutes.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    item.path === route
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {isEn ? item.labelEn : item.labelDe}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
              <button
                type="button"
                onClick={() => onLanguageChange('de')}
                className={`px-2 py-1 cursor-pointer ${
                  language === 'de'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 cursor-pointer ${
                  language === 'en'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
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
              {isEn ? 'Open Trainer' : 'Zum Trainer'}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            {getRouteIcon(route)}
            <span>{content.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
            {content.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.intro}
          </p>

          <div className="pt-2">
            <a
              href="/app"
              onClick={(e) => {
                e.preventDefault();
                navigate('/app');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
            >
              <Code2 className="w-4 h-4" />
              {content.ctaLabel}
            </a>
          </div>
        </div>

        <div className="space-y-6">
          {content.sections.map((sec, idx) => (
            <section
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-3"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                {sec.heading}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {sec.body}
              </p>
              {sec.code && (
                <pre className="mt-3 p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                  <code>{sec.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};
