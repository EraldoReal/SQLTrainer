export type Language = 'de' | 'en';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    trainer: string;
    home: string;
    mysqlPractice: string;
    joinsLearn: string;
    abiturTasks: string;
    faq: string;
  };
  controls: {
    run: string;
    runShortcut: string;
    format: string;
    clear: string;
    resetDb: string;
    exportSql: string;
    exportCsv: string;
    importSql: string;
    dialectLabel: string;
    dialectMysql: string;
    dialectSqlite: string;
    themeLight: string;
    themeDark: string;
    language: string;
    copy: string;
    copied: string;
    insert: string;
    save: string;
    cancel: string;
    delete: string;
    close: string;
  };
  databases: {
    label: string;
    selectPlaceholder: string;
    resetSuccess: string;
    customLoaded: string;
  };
  tabs: {
    schema: string;
    tasks: string;
    cheatsheet: string;
    history: string;
  };
  schema: {
    title: string;
    tablesCount: string;
    columnsCount: string;
    primaryKey: string;
    foreignKey: string;
    notNull: string;
    nullable: string;
    noTables: string;
    emptyHint: string;
    insertStarterTable: string;
    previewTable: string;
  };
  editor: {
    title: string;
    placeholder: string;
    multiStatementHint: string;
  };
  results: {
    title: string;
    emptyPrompt: string;
    noRows: string;
    rowsReturned: string;
    rowsAffected: string;
    executionTime: string;
    errorTitle: string;
    nullValue: string;
  };
  tasks: {
    title: string;
    allTopics: string;
    abiturBadge: string;
    customBadge: string;
    completedBadge: string;
    topics: {
      basics: string;
      aggregation: string;
      joins: string;
      subqueries_ddl: string;
    };
    checkSolution: string;
    showHint: string;
    hideHint: string;
    showSolution: string;
    hideSolution: string;
    loadSolution: string;
    nextTask: string;
    prevTask: string;
    createCustom: string;
    progressLabel: string;
    exportProgress: string;
    importProgress: string;
    exportProgressShort: string;
    importProgressShort: string;
    passedTitle: string;
    failedTitle: string;
    noTasksForFilter: string;
    customForm: {
      heading: string;
      titleLabel: string;
      promptLabel: string;
      hintLabel: string;
      solutionLabel: string;
      topicLabel: string;
      checkOrderLabel: string;
      submit: string;
    };
  };
  cheatsheet: {
    title: string;
    searchPlaceholder: string;
    customSnippetsTitle: string;
    addSnippet: string;
    snippetTitlePlaceholder: string;
    snippetSqlPlaceholder: string;
    noSnippets: string;
    noMatches: string;
  };
  history: {
    title: string;
    clearHistory: string;
    empty: string;
    success: string;
    error: string;
    loadQuery: string;
  };
  landing: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaStart: string;
    ctaAbitur: string;
    featuresTitle: string;
    features: {
      browserTitle: string;
      browserDesc: string;
      dialectTitle: string;
      dialectDesc: string;
      feedbackTitle: string;
      feedbackDesc: string;
      abiturTitle: string;
      abiturDesc: string;
    };
  };
  footer: {
    localNote: string;
    privacyNote: string;
  };
}

export const translations: Record<Language, Translations> = {
  de: {
    appName: 'SQL Trainer',
    tagline: 'Interaktiv SQL & MySQL direkt im Browser üben',
    nav: {
      trainer: 'SQL-Workspace',
      home: 'Startseite',
      mysqlPractice: 'MySQL üben',
      joinsLearn: 'SQL JOINs lernen',
      abiturTasks: 'SQL Abitur-Aufgaben',
      faq: 'FAQ',
    },
    controls: {
      run: 'Ausführen',
      runShortcut: 'Strg/⌘ + Enter',
      format: 'Formatieren',
      clear: 'Leeren',
      resetDb: 'Datenbank zurücksetzen',
      exportSql: 'SQL exportieren',
      exportCsv: 'CSV exportieren',
      importSql: 'SQL importieren',
      dialectLabel: 'Dialekt',
      dialectMysql: 'MySQL-Modus',
      dialectSqlite: 'SQLite',
      themeLight: 'Helles Design',
      themeDark: 'Dunkles Design',
      language: 'Sprache',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      insert: 'Einfügen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      close: 'Schließen',
    },
    databases: {
      label: 'Datenbank',
      selectPlaceholder: 'Datenbank wählen…',
      resetSuccess: 'Datenbank wurde auf den Ausgangszustand zurückgesetzt.',
      customLoaded: 'Eigene SQL-Datei wurde geladen.',
    },
    tabs: {
      schema: 'Schema',
      tasks: 'Aufgaben',
      cheatsheet: 'Spickzettel',
      history: 'Verlauf',
    },
    schema: {
      title: 'Datenbank-Schema',
      tablesCount: 'Tabellen',
      columnsCount: 'Spalten',
      primaryKey: 'Primärschlüssel (PK)',
      foreignKey: 'Fremdschlüssel (FK)',
      notNull: 'NOT NULL',
      nullable: 'NULL erlaubt',
      noTables: 'Keine Tabellen in dieser Datenbank vorhanden.',
      emptyHint: 'Erstelle eigene Tabellen mit CREATE TABLE oder füge eine Beispiel-Tabelle ein.',
      insertStarterTable: 'Beispiel-Tabelle einfügen',
      previewTable: 'Tabelleninhalt anzeigen (SELECT *)',
    },
    editor: {
      title: 'SQL-Editor',
      placeholder: 'Schreibe hier deine SQL-Abfrage (z. B. SELECT * FROM ...)',
      multiStatementHint: 'Mehrere Anweisungen mit Semikolon (;) trennen.',
    },
    results: {
      title: 'Ergebnis',
      emptyPrompt: 'Führe eine SQL-Abfrage aus, um Ergebnisse hier zu sehen.',
      noRows: 'Die Abfrage lieferte 0 Zeilen zurück.',
      rowsReturned: 'Zeilen',
      rowsAffected: 'Zeilen betroffen',
      executionTime: 'Laufzeit',
      errorTitle: 'SQL-Fehler',
      nullValue: 'NULL',
    },
    tasks: {
      title: 'Übungsaufgaben',
      allTopics: 'Alle Themen',
      abiturBadge: 'Abitur',
      customBadge: 'Eigene',
      completedBadge: 'Gelöst',
      topics: {
        basics: 'Grundlagen (SELECT, WHERE)',
        aggregation: 'Aggregation & Gruppierung',
        joins: 'JOINs & Verknüpfungen',
        subqueries_ddl: 'Unterabfragen & DDL/DML',
      },
      checkSolution: 'Lösung prüfen',
      showHint: 'Hinweis anzeigen',
      hideHint: 'Hinweis ausblenden',
      showSolution: 'Musterlösung anzeigen',
      hideSolution: 'Musterlösung ausblenden',
      loadSolution: 'In Editor laden',
      nextTask: 'Nächste Aufgabe',
      prevTask: 'Vorherige Aufgabe',
      createCustom: 'Eigene Aufgabe erstellen',
      progressLabel: 'Fortschritt',
      exportProgress: 'Lernstand exportieren (.json)',
      importProgress: 'Lernstand importieren (.json)',
      exportProgressShort: 'Export',
      importProgressShort: 'Import',
      passedTitle: 'Richtig gelöst!',
      failedTitle: 'Noch nicht ganz richtig',
      noTasksForFilter: 'Keine Aufgaben für diesen Filter gefunden.',
      customForm: {
        heading: 'Neue eigene Aufgabe',
        titleLabel: 'Titel',
        promptLabel: 'Aufgabenstellung',
        hintLabel: 'Hinweis (optional)',
        solutionLabel: 'Musterlösung (SQL)',
        topicLabel: 'Thema',
        checkOrderLabel: 'Reihenfolge der Zeilen prüfen (ORDER BY)',
        submit: 'Aufgabe speichern',
      },
    },
    cheatsheet: {
      title: 'SQL-Spickzettel',
      searchPlaceholder: 'Befehl oder Stichwort suchen…',
      customSnippetsTitle: 'Eigene Snippets',
      addSnippet: 'Snippet speichern',
      snippetTitlePlaceholder: 'Titel des Snippets',
      snippetSqlPlaceholder: 'SQL-Code…',
      noSnippets: 'Noch keine eigenen Snippets gespeichert.',
      noMatches: 'Keine passenden Einträge gefunden.',
    },
    history: {
      title: 'Abfrage-Verlauf',
      clearHistory: 'Verlauf leeren',
      empty: 'Noch keine Abfragen ausgeführt.',
      success: 'Erfolgreich',
      error: 'Fehler',
      loadQuery: 'In Editor laden',
    },
    landing: {
      heroBadge: '100 % im Browser · WebAssembly · Keine Anmeldung',
      heroTitle: 'SQL & MySQL interaktiv üben – direkt im Browser',
      heroSubtitle:
        'Schreibe echte SQL-Abfragen gegen realistische Übungsdatenbanken, erhalte sofortiges Feedback und bereite dich gezielt auf Klausuren und das Informatik-Abitur vor.',
      ctaStart: 'Jetzt SQL üben',
      ctaAbitur: 'Abitur-Aufgaben ansehen',
      featuresTitle: 'Warum der SQL Trainer?',
      features: {
        browserTitle: 'Keine Installation nötig',
        browserDesc: 'Läuft lokal per WebAssembly (sql.js) direkt in deinem Browser – sofort startklar.',
        dialectTitle: 'MySQL-Modus & SQLite',
        dialectDesc: 'Unterstützt MySQL-typische Befehle wie SHOW TABLES, DESCRIBE, LIMIT und CONCAT.',
        feedbackTitle: 'Automatische Auswertung',
        feedbackDesc: 'Prüfe deine Lösungen sofort gegen die Musterlösung – inklusive Spalten- und Wertevergleich.',
        abiturTitle: 'Schul- & Abitur-nah',
        abiturDesc: 'Enthält praxisnahe Datenbanken und Aufgaben im Stil des deutschen Informatik-Abiturs.',
      },
    },
    footer: {
      localNote: 'Alle SQL-Abfragen laufen lokal in deinem Browser (WebAssembly).',
      privacyNote: 'Keine Server-Übertragung, keine Registrierung.',
    },
  },
  en: {
    appName: 'SQL Trainer',
    tagline: 'Practice SQL & MySQL interactively in your browser',
    nav: {
      trainer: 'SQL Workspace',
      home: 'Home',
      mysqlPractice: 'Practice MySQL',
      joinsLearn: 'Learn SQL JOINs',
      abiturTasks: 'Abitur SQL Tasks',
      faq: 'FAQ',
    },
    controls: {
      run: 'Run',
      runShortcut: 'Ctrl/⌘ + Enter',
      format: 'Format',
      clear: 'Clear',
      resetDb: 'Reset Database',
      exportSql: 'Export SQL',
      exportCsv: 'Export CSV',
      importSql: 'Import SQL',
      dialectLabel: 'Dialect',
      dialectMysql: 'MySQL Mode',
      dialectSqlite: 'SQLite',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      language: 'Language',
      copy: 'Copy',
      copied: 'Copied!',
      insert: 'Insert',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      close: 'Close',
    },
    databases: {
      label: 'Database',
      selectPlaceholder: 'Select database…',
      resetSuccess: 'Database has been reset to its initial state.',
      customLoaded: 'Custom SQL file loaded.',
    },
    tabs: {
      schema: 'Schema',
      tasks: 'Tasks',
      cheatsheet: 'Cheat Sheet',
      history: 'History',
    },
    schema: {
      title: 'Database Schema',
      tablesCount: 'Tables',
      columnsCount: 'Columns',
      primaryKey: 'Primary Key (PK)',
      foreignKey: 'Foreign Key (FK)',
      notNull: 'NOT NULL',
      nullable: 'Nullable',
      noTables: 'No tables found in this database.',
      emptyHint: 'Create your own tables using CREATE TABLE or insert a starter table.',
      insertStarterTable: 'Insert starter table',
      previewTable: 'Preview table rows (SELECT *)',
    },
    editor: {
      title: 'SQL Editor',
      placeholder: 'Write your SQL query here (e.g. SELECT * FROM ...)',
      multiStatementHint: 'Separate multiple statements with a semicolon (;).',
    },
    results: {
      title: 'Result',
      emptyPrompt: 'Run an SQL query to see the results here.',
      noRows: 'The query returned 0 rows.',
      rowsReturned: 'rows',
      rowsAffected: 'rows affected',
      executionTime: 'Time',
      errorTitle: 'SQL Error',
      nullValue: 'NULL',
    },
    tasks: {
      title: 'Practice Tasks',
      allTopics: 'All Topics',
      abiturBadge: 'Abitur',
      customBadge: 'Custom',
      completedBadge: 'Solved',
      topics: {
        basics: 'Basics (SELECT, WHERE)',
        aggregation: 'Aggregation & Grouping',
        joins: 'JOINs & Relations',
        subqueries_ddl: 'Subqueries & DDL/DML',
      },
      checkSolution: 'Check Solution',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      showSolution: 'Show Solution',
      hideSolution: 'Hide Solution',
      loadSolution: 'Load into Editor',
      nextTask: 'Next Task',
      prevTask: 'Previous Task',
      createCustom: 'Create Custom Task',
      progressLabel: 'Progress',
      exportProgress: 'Export progress (.json)',
      importProgress: 'Import progress (.json)',
      exportProgressShort: 'Export',
      importProgressShort: 'Import',
      passedTitle: 'Correct!',
      failedTitle: 'Not quite right yet',
      noTasksForFilter: 'No tasks found for this filter.',
      customForm: {
        heading: 'New Custom Task',
        titleLabel: 'Title',
        promptLabel: 'Task Prompt',
        hintLabel: 'Hint (optional)',
        solutionLabel: 'Reference Solution (SQL)',
        topicLabel: 'Topic',
        checkOrderLabel: 'Enforce row order (ORDER BY)',
        submit: 'Save Task',
      },
    },
    cheatsheet: {
      title: 'SQL Cheat Sheet',
      searchPlaceholder: 'Search command or keyword…',
      customSnippetsTitle: 'Custom Snippets',
      addSnippet: 'Save Snippet',
      snippetTitlePlaceholder: 'Snippet title',
      snippetSqlPlaceholder: 'SQL code…',
      noSnippets: 'No custom snippets saved yet.',
      noMatches: 'No matching entries found.',
    },
    history: {
      title: 'Query History',
      clearHistory: 'Clear History',
      empty: 'No queries executed yet.',
      success: 'Success',
      error: 'Error',
      loadQuery: 'Load into Editor',
    },
    landing: {
      heroBadge: '100% In-Browser · WebAssembly · No Sign-up',
      heroTitle: 'Practice SQL & MySQL interactively – right in your browser',
      heroSubtitle:
        'Write real SQL queries against realistic sample databases, get instant automated feedback, and prepare for exams and Abitur.',
      ctaStart: 'Start Practicing SQL',
      ctaAbitur: 'Browse Abitur Tasks',
      featuresTitle: 'Why SQL Trainer?',
      features: {
        browserTitle: 'Zero Setup Required',
        browserDesc: 'Runs locally via WebAssembly (sql.js) directly in your browser – ready in seconds.',
        dialectTitle: 'MySQL Mode & SQLite',
        dialectDesc: 'Supports MySQL-style commands like SHOW TABLES, DESCRIBE, LIMIT, and CONCAT.',
        feedbackTitle: 'Instant Automated Grading',
        feedbackDesc: 'Verify your query against the reference solution with column and row comparison.',
        abiturTitle: 'Exam & Abitur Ready',
        abiturDesc: 'Includes realistic relational schemas and tasks modeled after German CS Abitur exams.',
      },
    },
    footer: {
      localNote: 'All SQL queries execute locally in your browser (WebAssembly).',
      privacyNote: 'No server uploads, no registration required.',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] ?? translations.de;
}

export function localizeText(lang: Language, de: string, en: string): string {
  return lang === 'en' ? en : de;
}
