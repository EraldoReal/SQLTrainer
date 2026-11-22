import type { BlogPost } from '@/types/blog';

export const BLOG_POSTS_PART1: BlogPost[] = [
  // 1. sql-select-where-grundlagen
  {
    slug: 'sql-select-where-grundlagen',
    category: 'basics',
    publishedAt: '2026-09-02',
    readingMinutes: 6,
    titleDe: 'SQL SELECT und WHERE Grundlagen: Daten gezielt abfragen',
    titleEn: 'SQL SELECT and WHERE Basics: Querying Data Precisely',
    descriptionDe:
      'Lerne SQL SELECT und WHERE Schritt für Schritt: Spalten auswählen, Zeilen filtern, Vergleichsoperatoren nutzen und häufige Anfängerfehler vermeiden.',
    descriptionEn:
      'Learn SQL SELECT and WHERE step by step: select columns, filter rows, combine comparison operators, and avoid common beginner mistakes.',
    keywordsDe: [
      'SQL SELECT',
      'SQL WHERE',
      'SQL Grundlagen',
      'Datenbank abfragen',
      'SQL filtern',
      'SQL Anfänger',
    ],
    keywordsEn: [
      'SQL SELECT',
      'SQL WHERE',
      'SQL basics',
      'filter rows in SQL',
      'SQL beginners',
      'database queries',
    ],
    sections: [
      {
        headingDe: 'Projektion mit SELECT: Nur die benötigten Spalten laden',
        headingEn: 'Projection with SELECT: Fetching Only What You Need',
        paragraphsDe: [
          'Jede lesende SQL-Abfrage beginnt mit dem Schlüsselwort SELECT, gefolgt von den gewünschten Spaltennamen und der Angabe der Quelltabelle hinter FROM. Während SELECT * in schnellen Tests praktisch ist, um alle Spalten einer Tabelle anzuzeigen, solltest du in produktiven Anwendungen und Prüfungsaufgaben immer explizite Spaltennamen angeben.',
          'Die explizite Projektion hat zwei klare Vorteile: Erstens überträgt die Datenbank nur die wirklich benötigten Attribute, was bei großen Tabellen Speicher und Bandbreite spart. Zweitens bleibt deine Abfrage stabil, selbst wenn später neue Spalten zur Tabelle hinzugefügt werden.',
          'Mit dem Schlüsselwort AS kannst du Spalten in der Ergebnistabelle lesbare Aliasnamen geben, zum Beispiel vorname AS Vorname. In vielen Dialekten – darunter MySQL und SQLite – ist AS optional, erhöht aber die Lesbarkeit erheblich.',
        ],
        paragraphsEn: [
          'Every read query in SQL starts with the SELECT keyword, followed by the desired column names and the source table after FROM. While SELECT * is convenient for quick exploration, you should always list explicit column names in production code and exam solutions.',
          'Explicit projection offers two major benefits: the database transfers only the attributes you actually need, and your query remains predictable even if new columns are added to the table later.',
          'Using the AS keyword, you can assign readable column aliases in the result set, such as first_name AS FirstName. Although AS is optional in MySQL and SQLite, keeping it makes queries much easier to read.',
        ],
      },
      {
        headingDe: 'Selektion mit WHERE: Zeilen präzise filtern',
        headingEn: 'Selection with WHERE: Filtering Rows Precisely',
        paragraphsDe: [
          'Die WHERE-Klausel entscheidet für jede einzelne Zeile der Tabelle, ob sie in das Ergebnis übernommen wird. Dafür formulierst du eine logische Bedingung mit Vergleichsoperatoren wie =, != (oder <>), <, <=, > und >=.',
          'Textwerte (Strings) müssen in SQL immer in einfache Anführungszeichen gesetzt werden, etwa klasse = \'12a\'. Zahlen hingegen schreibst du ohne Anführungszeichen, zum Beispiel jahrgang >= 12. Doppelte Anführungszeichen sind im SQL-Standard für Bezeichner reserviert und führen bei Textwerten leicht zu Verwechslungen.',
        ],
        paragraphsEn: [
          'The WHERE clause evaluates each row individually and keeps only rows where the condition evaluates to true. You build conditions using comparison operators such as =, != (or <>), <, <=, >, and >=.',
          'Text literals must always be enclosed in single quotes, such as grade = \'12a\', whereas numeric values are written without quotes, such as year >= 12. Double quotes are reserved for identifiers in standard SQL and should not be used for string values.',
        ],
      },
      {
        headingDe: 'Bedingungen mit AND, OR und Klammern verknüpfen',
        headingEn: 'Combining Conditions with AND, OR, and Parentheses',
        paragraphsDe: [
          'Mehrere Filterkriterien lassen sich mit den logischen Operatoren AND, OR und NOT kombinieren. Bei AND müssen alle Teilbedingungen erfüllt sein; bei OR genügt bereits eine wahre Teilbedingung.',
          'Wichtig für die Praxis und Klausuren: AND bindet stärker als OR – ähnlich wie Punkt- vor Strichrechnung. Sobald du AND und OR in derselben WHERE-Klausel mischst, solltest du immer runde Klammern setzen, damit die Auswertungsreihenfolge eindeutig bleibt.',
        ],
        paragraphsEn: [
          'Multiple filter criteria can be combined with the logical operators AND, OR, and NOT. With AND, every condition must be true; with OR, at least one condition must match.',
          'A crucial rule for real-world queries and exams: AND has higher operator precedence than OR. Whenever you mix AND and OR in the same WHERE clause, wrap the OR group in parentheses to prevent subtle logic bugs.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Schülerinnen und Schüler nach Jahrgang und Klasse filtern',
      titleEn: 'Filter students by grade level and class',
      sql: `CREATE TABLE schueler (
  id INTEGER PRIMARY KEY,
  vorname VARCHAR(50) NOT NULL,
  nachname VARCHAR(50) NOT NULL,
  jahrgang INTEGER NOT NULL,
  klasse VARCHAR(10) NOT NULL,
  punktzahl INTEGER NOT NULL
);

INSERT INTO schueler (id, vorname, nachname, jahrgang, klasse, punktzahl) VALUES
  (1, 'Lukas', 'Müller', 12, '12a', 13),
  (2, 'Mia', 'Schmidt', 12, '12b', 14),
  (3, 'Leon', 'Schneider', 11, '11a', 10),
  (4, 'Hannah', 'Fischer', 13, '13a', 15),
  (5, 'Emma', 'Bauer', 12, '12a', 11);

SELECT vorname, nachname, klasse, punktzahl AS punkte
FROM schueler
WHERE (jahrgang = 12 OR jahrgang = 13)
  AND punktzahl >= 12;`,
    },
    relatedSlugs: [
      'sql-order-by-distinct-limit',
      'sql-like-between-in-null',
      'sql-inner-join-einfach-erklaert',
    ],
  },

  // 2. sql-order-by-distinct-limit
  {
    slug: 'sql-order-by-distinct-limit',
    category: 'basics',
    publishedAt: '2026-09-04',
    readingMinutes: 5,
    titleDe: 'SQL ORDER BY, DISTINCT und LIMIT: Ergebnisse sortieren und eingrenzen',
    titleEn: 'SQL ORDER BY, DISTINCT, and LIMIT: Sorting and Limiting Results',
    descriptionDe:
      'Sortiere SQL-Abfragen mit ORDER BY ASC/DESC, entferne Duplikate mit DISTINCT und begrenze Treffer mit LIMIT und OFFSET.',
    descriptionEn:
      'Sort SQL query results with ORDER BY ASC/DESC, remove duplicates with DISTINCT, and paginate rows using LIMIT and OFFSET.',
    keywordsDe: [
      'SQL ORDER BY',
      'SQL DISTINCT',
      'SQL LIMIT',
      'SQL sortieren',
      'Duplikate entfernen SQL',
      'Top N Abfrage',
    ],
    keywordsEn: [
      'SQL ORDER BY',
      'SQL DISTINCT',
      'SQL LIMIT',
      'sort SQL results',
      'remove duplicates SQL',
      'SQL pagination',
    ],
    sections: [
      {
        headingDe: 'Sortierung mit ORDER BY: ASC und DESC',
        headingEn: 'Sorting with ORDER BY: ASC and DESC',
        paragraphsDe: [
          'Relationale Tabellen haben keine garantierte interne Reihenfolge. Wenn du eine bestimmte Sortierung erwartest, musst du immer ORDER BY angeben. Standardmäßig sortiert SQL aufsteigend (ASC – Ascending), was bei Zahlen vom kleinsten zum größten Wert und bei Texten alphabetisch von A bis Z bedeutet.',
          'Für eine absteigende Sortierung hängst du DESC (Descending) an den Spaltennamen an. Du kannst auch nach mehreren Spalten sortieren, etwa ORDER BY kategorie ASC, preis DESC: Bei gleicher Kategorie entscheidet dann der Preis absteigend.',
        ],
        paragraphsEn: [
          'Relational tables have no guaranteed physical row order. Whenever you rely on a specific ordering, you must specify ORDER BY. By default, SQL sorts in ascending order (ASC), from smallest to largest or alphabetically from A to Z.',
          'To sort in descending order, append DESC after the column name. You can also sort by multiple columns, such as ORDER BY category ASC, price DESC, where the second column acts as a tie-breaker.',
        ],
      },
      {
        headingDe: 'Duplikate ausblenden mit SELECT DISTINCT',
        headingEn: 'Removing Duplicates with SELECT DISTINCT',
        paragraphsDe: [
          'Oft möchtest du wissen, welche unterschiedlichen Werte in einer Spalte vorkommen – zum Beispiel alle vertretenen Städte oder Fachbereiche. SELECT DISTINCT entfernt identische Zeilen aus dem Abfrageergebnis.',
          'Beachte, dass DISTINCT sich immer auf die gesamte ausgewählte Spaltenkombination bezieht. Wenn du SELECT DISTINCT stadt, nachname schreibst, werden nur Zeilen unterdrückt, bei denen sowohl Stadt als auch Nachname übereinstimmen.',
        ],
        paragraphsEn: [
          'Often you want to find all unique values in a column, such as every distinct city or department. SELECT DISTINCT eliminates duplicate rows from the result set.',
          'Keep in mind that DISTINCT applies to the entire combination of selected columns. If you select DISTINCT city, last_name, a row is only considered a duplicate when both city and last_name match.',
        ],
      },
      {
        headingDe: 'Trefferzahl begrenzen mit LIMIT und OFFSET',
        headingEn: 'Limiting Results with LIMIT and OFFSET',
        paragraphsDe: [
          'Mit LIMIT legst du fest, wie viele Zeilen maximal zurückgegeben werden sollen. In Kombination mit ORDER BY ... DESC lassen sich so klassische Top-N-Abfragen formulieren, etwa die drei teuersten Produkte oder die fünf besten Klausurergebnisse.',
          'Für eine Seitennavigation (Pagination) ergänzt du OFFSET, um die ersten Zeilen zu überspringen – beispielsweise LIMIT 10 OFFSET 20 für Seite 3 bei zehn Einträgen pro Seite. Ohne ORDER BY wäre OFFSET jedoch nicht deterministisch.',
        ],
        paragraphsEn: [
          'LIMIT caps the maximum number of rows returned by a query. Combined with ORDER BY ... DESC, it powers classic Top-N queries like the three most expensive products or the top five exam scores.',
          'For pagination, add OFFSET to skip a number of rows, such as LIMIT 10 OFFSET 20 for page 3 with ten items per page. Always pair LIMIT and OFFSET with an unambiguous ORDER BY clause.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Top-3-Produkte nach Preis und eindeutige Kategorien',
      titleEn: 'Top 3 products by price and distinct categories',
      sql: `CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  kategorie VARCHAR(50) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL
);

INSERT INTO produkte (id, name, kategorie, preis) VALUES
  (1, 'Laptop Pro', 'Elektronik', 1299.00),
  (2, 'Maus Wireless', 'Elektronik', 39.90),
  (3, 'Schreibtischlampe', 'Büro', 59.00),
  (4, 'Monitor 27 Zoll', 'Elektronik', 349.00),
  (5, 'Ergonomie-Stuhl', 'Büro', 429.00);

SELECT DISTINCT kategorie
FROM produkte
ORDER BY kategorie ASC;

SELECT name, kategorie, preis
FROM produkte
ORDER BY preis DESC, name ASC
LIMIT 3;`,
    },
    relatedSlugs: [
      'sql-select-where-grundlagen',
      'sql-like-between-in-null',
      'sql-group-by-having-aggregation',
    ],
  },

  // 3. sql-like-between-in-null
  {
    slug: 'sql-like-between-in-null',
    category: 'basics',
    publishedAt: '2026-09-06',
    readingMinutes: 6,
    titleDe: 'SQL LIKE, BETWEEN, IN und IS NULL sicher anwenden',
    titleEn: 'Using SQL LIKE, BETWEEN, IN, and IS NULL Correctly',
    descriptionDe:
      'Mustervergleiche mit LIKE (% und _), Wertebereiche mit BETWEEN, Listen mit IN und die richtige Prüfung auf NULL mit IS NULL verstehen.',
    descriptionEn:
      'Master pattern matching with LIKE (% and _), range checks with BETWEEN, list matching with IN, and proper NULL handling with IS NULL.',
    keywordsDe: [
      'SQL LIKE',
      'SQL BETWEEN',
      'SQL IN',
      'SQL IS NULL',
      'Wildcards SQL',
      'NULL Vergleich SQL',
    ],
    keywordsEn: [
      'SQL LIKE',
      'SQL BETWEEN',
      'SQL IN',
      'SQL IS NULL',
      'SQL wildcards',
      'three-valued logic SQL',
    ],
    sections: [
      {
        headingDe: 'Mustersuche mit LIKE und Platzhaltern',
        headingEn: 'Pattern Matching with LIKE and Wildcards',
        paragraphsDe: [
          'Wenn du nicht nach einem exakten Text suchst, sondern nach einem Muster, kommt LIKE zum Einsatz. Der Platzhalter % steht für beliebig viele Zeichen (auch null Zeichen), während _ genau ein einzelnes Zeichen repräsentiert.',
          'So findet WHERE name LIKE \'M%\' alle Namen, die mit M beginnen, und WHERE kuerzel LIKE \'A_\' alle zweibuchstabigen Kürzel mit A am Anfang. Mit NOT LIKE kehrst du die Bedingung um.',
        ],
        paragraphsEn: [
          'When you need partial text matching instead of exact equality, use LIKE. The % wildcard matches zero or more characters, while _ matches exactly one character.',
          'For example, WHERE name LIKE \'M%\' finds all names starting with M, and WHERE code LIKE \'A_\' matches two-character codes starting with A. Use NOT LIKE to exclude matching patterns.',
        ],
      },
      {
        headingDe: 'Bereiche und Wertelisten: BETWEEN und IN',
        headingEn: 'Ranges and Value Lists: BETWEEN and IN',
        paragraphsDe: [
          'Statt preis >= 10 AND preis <= 50 zu schreiben, kannst du kürzer preis BETWEEN 10 AND 50 verwenden. Wichtig: BETWEEN schließt beide Grenzen inklusive ein.',
          'Wenn du auf mehrere konkrete Einzelwerte prüfen möchtest, ersetzt IN eine lange Kette aus OR-Bedingungen. WHERE stadt IN (\'Berlin\', \'Hamburg\', \'München\') ist kompakter und weniger fehleranfällig als drei einzelne Vergleiche.',
        ],
        paragraphsEn: [
          'Instead of writing price >= 10 AND price <= 50, you can use the cleaner shorthand price BETWEEN 10 AND 50. Remember that BETWEEN is inclusive of both boundary values.',
          'When checking against a discrete set of values, IN replaces repetitive OR chains. Writing WHERE city IN (\'Berlin\', \'Hamburg\', \'Munich\') is both shorter and easier to maintain.',
        ],
      },
      {
        headingDe: 'Die häufigste SQL-Falle: Vergleiche mit NULL',
        headingEn: 'The Most Common SQL Trap: Comparing with NULL',
        paragraphsDe: [
          'NULL bedeutet in SQL nicht 0 und auch kein leerer String, sondern „unbekannter oder fehlender Wert“. Deshalb liefert jeder Vergleich mit = NULL oder != NULL das Ergebnis UNKNOWN – und die Zeile wird im WHERE-Filter verworfen.',
          'Prüfe fehlende Werte daher immer mit IS NULL oder IS NOT NULL. Auch bei NOT IN solltest du aufpassen: Enthält die Liste ein NULL, liefert NOT IN unter Umständen gar keine Treffer mehr.',
        ],
        paragraphsEn: [
          'In SQL, NULL does not mean zero or an empty string; it represents a missing or unknown value. Consequently, = NULL and != NULL evaluate to UNKNOWN rather than true or false, causing rows to be filtered out.',
          'Always test for missing values using IS NULL or IS NOT NULL. Be equally careful with NOT IN: if the list contains a NULL value, the entire NOT IN expression can return zero rows.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'LIKE, BETWEEN, IN und IS NULL an Kundendaten testen',
      titleEn: 'Testing LIKE, BETWEEN, IN, and IS NULL on customer data',
      sql: `CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  stadt VARCHAR(60) NOT NULL,
  alter_jahre INTEGER NOT NULL,
  telefon VARCHAR(30)
);

INSERT INTO kunden (id, name, stadt, alter_jahre, telefon) VALUES
  (1, 'Anna Weber', 'Berlin', 24, '030-12345'),
  (2, 'Bastian Meyer', 'Hamburg', 31, NULL),
  (3, 'Clara Schulz', 'München', 19, '089-99887'),
  (4, 'David Richter', 'Berlin', 28, NULL),
  (5, 'Elena Meier', 'Köln', 42, '0221-55443');

SELECT name, stadt, alter_jahre
FROM kunden
WHERE stadt IN ('Berlin', 'Hamburg')
  AND alter_jahre BETWEEN 20 AND 35
  AND name LIKE '%e%'
  AND telefon IS NULL;`,
    },
    relatedSlugs: [
      'sql-select-where-grundlagen',
      'sql-order-by-distinct-limit',
      'sql-unterabfragen-in-exists',
    ],
  },

  // 4. sql-inner-join-einfach-erklaert
  {
    slug: 'sql-inner-join-einfach-erklaert',
    category: 'joins',
    publishedAt: '2026-09-09',
    readingMinutes: 6,
    titleDe: 'SQL INNER JOIN einfach erklärt: Tabellen richtig verknüpfen',
    titleEn: 'SQL INNER JOIN Explained Simply: Linking Tables Properly',
    descriptionDe:
      'Verstehe SQL INNER JOIN anhand anschaulicher Beispiele: Primär- und Fremdschlüssel verbinden, Tabellenaliase nutzen und Mehrdeutigkeiten vermeiden.',
    descriptionEn:
      'Understand SQL INNER JOIN with clear examples: connect primary and foreign keys, use table aliases, and avoid ambiguous column errors.',
    keywordsDe: [
      'SQL INNER JOIN',
      'Tabellen verknüpfen',
      'Fremdschlüssel JOIN',
      'SQL Join Beispiel',
      'Tabellenalias SQL',
    ],
    keywordsEn: [
      'SQL INNER JOIN',
      'join tables in SQL',
      'foreign key join',
      'SQL join example',
      'table aliases SQL',
    ],
    sections: [
      {
        headingDe: 'Warum wir Daten auf mehrere Tabellen aufteilen',
        headingEn: 'Why Data Is Split Across Multiple Tables',
        paragraphsDe: [
          'In relationalen Datenbanken werden zusammengehörige Informationen auf getrennte Tabellen verteilt, um Redundanzen zu vermeiden. Statt den Namen eines Lehrers in jeder Kurszeile zu wiederholen, speichert die Kurstabelle nur einen Verweis – den Fremdschlüssel lehrer_id.',
          'Mit einem INNER JOIN führst du diese getrennten Tabellen bei der Abfrage wieder zusammen. Es werden genau die Zeilenpaare kombiniert, bei denen die angegebene Join-Bedingung (meist Fremdschlüssel = Primärschlüssel) übereinstimmt.',
        ],
        paragraphsEn: [
          'In relational databases, entities are stored in separate tables to eliminate redundancy. Instead of repeating a teacher\'s full name in every course row, the courses table stores only a reference: the foreign key teacher_id.',
          'An INNER JOIN recombines these tables at query time. It returns only the pairs of rows where the join condition—typically foreign key equals primary key—matches.',
        ],
      },
      {
        headingDe: 'Saubere JOIN-Syntax statt veralteter Komma-Joins',
        headingEn: 'Modern JOIN Syntax vs. Legacy Comma Joins',
        paragraphsDe: [
          'In älteren Lehrbüchern findet man manchmal FROM kurse, lehrer WHERE kurse.lehrer_id = lehrer.id. Diese implizite Schreibweise vermischt jedoch Verknüpfungslogik und Filterkriterien und führt schnell zu versehentlichen kartesischen Produkten.',
          'Verwende stattdessen immer die explizite Syntax INNER JOIN ... ON .... So steht die Verknüpfung zwischen den Tabellen klar im ON-Teil, während inhaltliche Filter wie WHERE wochenstunden >= 4 sauber getrennt bleiben.',
        ],
        paragraphsEn: [
          'Older textbooks sometimes show comma joins like FROM courses, teachers WHERE courses.teacher_id = teachers.id. That legacy style mixes join logic with filtering and makes accidental Cartesian products easy to trigger.',
          'Always prefer explicit INNER JOIN ... ON ... syntax. It keeps table relationships clearly separated in the ON clause while reserving WHERE for business filters.',
        ],
      },
      {
        headingDe: 'Tabellenaliase gegen mehrdeutige Spaltennamen',
        headingEn: 'Table Aliases to Prevent Ambiguous Columns',
        paragraphsDe: [
          'Haben beide Tabellen eine Spalte mit demselben Namen, etwa id oder name, meldet SQL einen Fehler wegen Mehrdeutigkeit. Durch kurze Tabellenaliase wie k für kurse und l für lehrer qualifizierst du jede Spalte eindeutig (k.bezeichnung, l.nachname).',
        ],
        paragraphsEn: [
          'When both tables contain a column with the same name, such as id or name, SQL raises an ambiguous column error. Short table aliases like c for courses and t for teachers let you qualify columns cleanly (c.title, t.last_name).',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Kurse mit ihren zuständigen Lehrkräften verknüpfen',
      titleEn: 'Join courses with their assigned teachers',
      sql: `CREATE TABLE lehrer (
  lehrer_id INTEGER PRIMARY KEY,
  nachname VARCHAR(60) NOT NULL,
  fach VARCHAR(60) NOT NULL
);

CREATE TABLE kurse (
  kurs_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(80) NOT NULL,
  wochenstunden INTEGER NOT NULL,
  lehrer_id INTEGER NOT NULL,
  FOREIGN KEY (lehrer_id) REFERENCES lehrer(lehrer_id)
);

INSERT INTO lehrer (lehrer_id, nachname, fach) VALUES
  (1, 'Weber', 'Informatik'),
  (2, 'Hoffmann', 'Mathematik'),
  (3, 'Klein', 'Deutsch');

INSERT INTO kurse (kurs_id, bezeichnung, wochenstunden, lehrer_id) VALUES
  (101, 'Informatik LK', 5, 1),
  (102, 'Mathematik GK', 3, 2),
  (103, 'Datenbanken Projekt', 2, 1);

SELECT k.bezeichnung, k.wochenstunden, l.nachname AS lehrkraft
FROM kurse AS k
INNER JOIN lehrer AS l ON k.lehrer_id = l.lehrer_id
WHERE k.wochenstunden >= 3
ORDER BY k.bezeichnung ASC;`,
    },
    relatedSlugs: [
      'sql-left-join-unterschied-inner-join',
      'sql-multi-table-joins-drei-tabellen',
      'sql-create-table-primary-foreign-key',
    ],
  },

  // 5. sql-left-join-unterschied-inner-join
  {
    slug: 'sql-left-join-unterschied-inner-join',
    category: 'joins',
    publishedAt: '2026-09-11',
    readingMinutes: 6,
    titleDe: 'LEFT JOIN vs. INNER JOIN: Der Unterschied verständlich erklärt',
    titleEn: 'LEFT JOIN vs. INNER JOIN: Understanding the Difference',
    descriptionDe:
      'Wann brauchst du LEFT JOIN statt INNER JOIN? Lerne, wie du Datensätze ohne Gegenstück findest und die typische WHERE-Falle bei LEFT JOIN vermeidest.',
    descriptionEn:
      'When should you use LEFT JOIN instead of INNER JOIN? Learn how to find unmatched rows and avoid the classic WHERE trap with outer joins.',
    keywordsDe: [
      'LEFT JOIN vs INNER JOIN',
      'SQL LEFT JOIN',
      'Datensätze ohne Zuordnung',
      'LEFT JOIN IS NULL',
      'Outer Join SQL',
    ],
    keywordsEn: [
      'LEFT JOIN vs INNER JOIN',
      'SQL LEFT JOIN',
      'find unmatched rows SQL',
      'LEFT JOIN IS NULL',
      'SQL outer join',
    ],
    sections: [
      {
        headingDe: 'Der Kernunterschied zwischen INNER und LEFT JOIN',
        headingEn: 'The Core Difference Between INNER and LEFT JOIN',
        paragraphsDe: [
          'Ein INNER JOIN liefert ausschließlich Datensätze, die in beiden Tabellen einen passenden Partner haben. Fehlt zu einem Kunden noch eine Bestellung oder zu einem Kurs noch eine Anmeldung, verschwindet dieser Datensatz komplett aus dem Ergebnis.',
          'Ein LEFT JOIN (vollständig LEFT OUTER JOIN) behält dagegen alle Zeilen der linken Tabelle – also der Tabelle vor dem JOIN-Schlüsselwort. Gibt es in der rechten Tabelle keinen Treffer, füllt die Datenbank alle Spalten der rechten Tabelle einfach mit NULL auf.',
        ],
        paragraphsEn: [
          'An INNER JOIN returns only rows that have a matching partner in both tables. If a customer has placed no orders yet or a course has no enrollments, that row disappears from the result.',
          'A LEFT JOIN (or LEFT OUTER JOIN) preserves every row from the left table. When no matching row exists in the right table, SQL fills all columns from the right table with NULL.',
        ],
      },
      {
        headingDe: 'Fehlende Zuordnungen mit IS NULL aufspüren',
        headingEn: 'Finding Unmatched Records with IS NULL',
        paragraphsDe: [
          'Eine der wichtigsten Anwendungen von LEFT JOIN ist die Suche nach „verwaisten“ oder noch nicht genutzten Einträgen: Welche Produkte wurden noch nie verkauft? Welche Lehrkraft unterrichtet aktuell keinen Kurs?',
          'Dazu verknüpfst du die Haupttabelle per LEFT JOIN mit der Detailtabelle und filterst im WHERE-Teil auf rechte_tabelle.primaerschluessel IS NULL. Genau diese Zeilen hatten keinen Partner.',
        ],
        paragraphsEn: [
          'One of the most useful patterns with LEFT JOIN is finding records that have no related entries—for example, products that were never ordered or teachers with no assigned courses.',
          'You join the primary table to the related table using LEFT JOIN and then filter with WHERE right_table.id IS NULL to isolate rows without a match.',
        ],
      },
      {
        headingDe: 'Achtung: WHERE-Filter können einen LEFT JOIN zerstören',
        headingEn: 'Watch Out: WHERE Filters Can Turn a LEFT JOIN into an INNER JOIN',
        paragraphsDe: [
          'Filterst du im WHERE-Teil auf eine Spalte der rechten Tabelle (z. B. WHERE b.status = \'bezahlt\'), fliegen alle Zeilen mit NULL wieder heraus – dein LEFT JOIN verhält sich plötzlich wie ein INNER JOIN. Bedingungen für die rechte Tabelle gehören bei einem LEFT JOIN deshalb direkt in die ON-Klausel.',
        ],
        paragraphsEn: [
          'If you put a filter on the right table inside the WHERE clause (such as WHERE o.status = \'paid\'), all NULL-padded rows are eliminated and your LEFT JOIN silently behaves like an INNER JOIN. Place right-table filter conditions inside the ON clause instead.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Kunden ohne Bestellungen per LEFT JOIN finden',
      titleEn: 'Find customers without orders using LEFT JOIN',
      sql: `CREATE TABLE kunden (
  kunden_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE bestellungen (
  bestell_id INTEGER PRIMARY KEY,
  kunden_id INTEGER NOT NULL,
  betrag DECIMAL(8, 2) NOT NULL,
  FOREIGN KEY (kunden_id) REFERENCES kunden(kunden_id)
);

INSERT INTO kunden (kunden_id, name) VALUES
  (1, 'Alice'),
  (2, 'Bob'),
  (3, 'Carla');

INSERT INTO bestellungen (bestell_id, kunden_id, betrag) VALUES
  (10, 1, 79.90),
  (11, 1, 24.50);

SELECT k.name, b.bestell_id, b.betrag
FROM kunden AS k
LEFT JOIN bestellungen AS b ON k.kunden_id = b.kunden_id
ORDER BY k.name ASC;

SELECT k.name AS kunde_ohne_bestellung
FROM kunden AS k
LEFT JOIN bestellungen AS b ON k.kunden_id = b.kunden_id
WHERE b.bestell_id IS NULL;`,
    },
    relatedSlugs: [
      'sql-inner-join-einfach-erklaert',
      'sql-multi-table-joins-drei-tabellen',
      'sql-unterabfragen-in-exists',
    ],
  },

  // 6. sql-multi-table-joins-drei-tabellen
  {
    slug: 'sql-multi-table-joins-drei-tabellen',
    category: 'joins',
    publishedAt: '2026-09-14',
    readingMinutes: 7,
    titleDe: 'SQL Multi-Table Joins: Drei und mehr Tabellen verknüpfen',
    titleEn: 'SQL Multi-Table Joins: Joining Three or More Tables',
    descriptionDe:
      'Verknüpfe n:m-Beziehungen über Zwischentabellen sauber mit mehreren JOINs in SQL – ideal für Schule, Onlineshop und Abituraufgaben.',
    descriptionEn:
      'Chain multiple JOIN clauses to query many-to-many relationships across bridge tables cleanly in SQL.',
    keywordsDe: [
      'SQL drei Tabellen verknüpfen',
      'Multi-Table Join',
      'n:m Beziehung SQL',
      'Zwischentabelle JOIN',
      'SQL Abitur Join',
    ],
    keywordsEn: [
      'SQL join three tables',
      'multi-table join SQL',
      'many-to-many SQL query',
      'junction table join',
      'chaining SQL joins',
    ],
    sections: [
      {
        headingDe: 'Wie n:m-Beziehungen in SQL abgefragt werden',
        headingEn: 'How Many-to-Many Relationships Are Queried in SQL',
        paragraphsDe: [
          'In der Praxis begegnen dir ständig n:m-Beziehungen: Ein Schüler belegt mehrere Kurse, und ein Kurs wird von vielen Schülern besucht. In einer relationalen Datenbank liegt dazwischen eine Zwischentabelle (z. B. belegt), die beide Primärschlüssel als Fremdschlüssel speichert.',
          'Um vom Schülernamen zur Kursbezeichnung zu gelangen, verkettest du einfach zwei JOINs hintereinander: Zuerst von schueler auf belegt, und von dort weiter auf kurse.',
        ],
        paragraphsEn: [
          'Many-to-many relationships appear everywhere in real databases: a student enrolls in multiple courses, and each course has many students. Relational schemas model this with a bridge table (such as enrollments) holding foreign keys to both tables.',
          'To get from student names to course titles, you simply chain two JOIN clauses: first from students to enrollments, and then from enrollments to courses.',
        ],
      },
      {
        headingDe: 'Reihenfolge und Lesbarkeit bei langen Join-Ketten',
        headingEn: 'Ordering and Readability in Long Join Chains',
        paragraphsDe: [
          'Bei INNER JOINs spielt die Reihenfolge der Tabellen für das logische Ergebnis keine Rolle – der Query-Optimizer plant die Ausführung selbst. Für Menschen ist es jedoch am übersichtlichsten, einem logischen Pfad durch das Datenmodell zu folgen.',
          'Mischst du hingegen INNER JOIN und LEFT JOIN, ist die Reihenfolge entscheidend: Beginne mit der Tabelle, deren Einträge vollständig erhalten bleiben sollen, und hänge optionale Tabellen mit LEFT JOIN an.',
        ],
        paragraphsEn: [
          'For pure INNER JOIN chains, the logical result does not depend on table order because the query optimizer determines the execution plan. Still, following a natural path through your ER diagram makes queries much easier to read.',
          'When mixing INNER JOIN and LEFT JOIN, order matters: start with the table whose rows must be preserved, and attach optional tables with LEFT JOIN.',
        ],
      },
      {
        headingDe: 'Doppelte Zeilen durch Aggregieren oder DISTINCT vermeiden',
        headingEn: 'Avoiding Duplicate Rows with DISTINCT or GROUP BY',
        paragraphsDe: [
          'Wenn du eine 1:n- oder n:m-Kette abfragst und nur die Namen der beteiligten Hauptobjekte brauchst (etwa alle Schülerinnen und Schüler, die mindestens einen Informatik-Kurs belegen), erzeugt ein Multi-Table-Join für jede Kursbelegung eine eigene Ergebniszeile.',
          'Nutze dann SELECT DISTINCT s.name oder fasse die Treffer mit GROUP BY s.schueler_id, s.name und COUNT(*) zusammen, um pro Person genau eine Zeile zu erhalten.',
        ],
        paragraphsEn: [
          'When querying across 1:N or M:N relationships and selecting only parent columns (for instance, students enrolled in at least one computer science course), a multi-table join produces one row per matching enrollment.',
          'Add SELECT DISTINCT or aggregate with GROUP BY student_id, name and COUNT(*) whenever you want exactly one summary row per entity.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Schüler, Kursbelegungen, Kurse und Lehrkräfte verbinden',
      titleEn: 'Connect students, enrollments, courses, and teachers',
      sql: `CREATE TABLE schueler (
  schueler_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE lehrer (
  lehrer_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE kurse (
  kurs_id INTEGER PRIMARY KEY,
  titel VARCHAR(80) NOT NULL,
  lehrer_id INTEGER NOT NULL,
  FOREIGN KEY (lehrer_id) REFERENCES lehrer(lehrer_id)
);

CREATE TABLE belegt (
  schueler_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note_punkte INTEGER NOT NULL,
  PRIMARY KEY (schueler_id, kurs_id),
  FOREIGN KEY (schueler_id) REFERENCES schueler(schueler_id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(kurs_id)
);

INSERT INTO schueler VALUES (1, 'Lukas'), (2, 'Mia');
INSERT INTO lehrer VALUES (10, 'Frau Weber'), (11, 'Herr Hoffmann');
INSERT INTO kurse VALUES (100, 'Informatik LK', 10), (101, 'Mathematik GK', 11);
INSERT INTO belegt VALUES (1, 100, 14), (1, 101, 11), (2, 100, 15);

SELECT s.name AS schueler, k.titel AS kurs, l.name AS lehrkraft, b.note_punkte
FROM schueler AS s
INNER JOIN belegt AS b ON s.schueler_id = b.schueler_id
INNER JOIN kurse AS k ON b.kurs_id = k.kurs_id
INNER JOIN lehrer AS l ON k.lehrer_id = l.lehrer_id
ORDER BY s.name, k.titel;`,
    },
    relatedSlugs: [
      'sql-inner-join-einfach-erklaert',
      'sql-left-join-unterschied-inner-join',
      'erm-zu-sql-kardinalitaeten-1n-nm',
    ],
  },

  // 7. sql-self-join-hierarchien
  {
    slug: 'sql-self-join-hierarchien',
    category: 'joins',
    publishedAt: '2026-09-16',
    readingMinutes: 6,
    titleDe: 'SQL Self-Join: Hierarchien und Beziehungen in einer Tabelle abfragen',
    titleEn: 'SQL Self-Join: Querying Hierarchies Within a Single Table',
    descriptionDe:
      'Mit einem Self-Join verknüpfst du eine Tabelle mit sich selbst – ideal für Vorgesetzten-Hierarchien, Kategoriebäume und Paarvergleiche.',
    descriptionEn:
      'Use a SQL self-join to join a table to itself—ideal for manager hierarchies, category trees, and comparing rows within the same table.',
    keywordsDe: [
      'SQL Self-Join',
      'rekursive Beziehung SQL',
      'Hierarchie abfragen SQL',
      'Mitarbeiter Vorgesetzter SQL',
      'Tabellenaliase Self-Join',
    ],
    keywordsEn: [
      'SQL self join',
      'self-referencing foreign key',
      'employee manager SQL query',
      'hierarchy in SQL',
      'table aliases self join',
    ],
    sections: [
      {
        headingDe: 'Wann eine Tabelle auf sich selbst verweist',
        headingEn: 'When a Table References Itself',
        paragraphsDe: [
          'Manchmal stehen zwei verknüpfte Objekte in derselben Tabelle: Jede Mitarbeiterin ist selbst in der Tabelle mitarbeiter gespeichert, und ihr Vorgesetzter steht ebenfalls als Zeile in mitarbeiter. Abgebildet wird das über eine Spalte wie vorgesetzter_id, die auf mitarbeiter_id derselben Tabelle verweist.',
          'Auch Kategoriebäume (oberkategorie_id) oder Freundschafts- bzw. Nachfolgerbeziehungen folgen genau diesem Muster.',
        ],
        paragraphsEn: [
          'Sometimes two related entities live in the exact same table: every employee is stored in the employees table, and their manager is also a row in employees. This is modeled with a self-referencing foreign key like manager_id pointing to employee_id.',
          'Category trees (parent_category_id) and predecessor/successor chains follow the same pattern.',
        ],
      },
      {
        headingDe: 'Pflicht bei Self-Joins: Unterschiedliche Aliase',
        headingEn: 'Mandatory for Self-Joins: Distinct Table Aliases',
        paragraphsDe: [
          'Da dieselbe Tabelle zweimal in der FROM-Klausel auftaucht, musst du ihr zwei unterschiedliche Aliase geben – etwa m für den Mitarbeiter und v für den Vorgesetzten.',
          'Verwende am besten einen LEFT JOIN, wenn auch die oberste Ebene ohne Vorgesetzten (vorgesetzter_id IS NULL, z. B. die Geschäftsführung) im Ergebnis sichtbar bleiben soll.',
        ],
        paragraphsEn: [
          'Because the same table appears twice in the FROM clause, you must assign two distinct aliases—such as e for the employee and m for the manager.',
          'Use a LEFT JOIN when top-level rows without a manager (manager_id IS NULL, such as the CEO) should still appear in the output.',
        ],
      },
      {
        headingDe: 'Typische Anwendungsfälle neben Organigrammen',
        headingEn: 'Common Use Cases Beyond Org Charts',
        paragraphsDe: [
          'Self-Joins eignen sich nicht nur für Vorgesetzten-Beziehungen, sondern auch für Produktkategorien mit Unterkategorien, Zugverbindungen (Umstieg am selben Bahnhof) oder Paarvergleiche innerhalb derselben Tabelle.',
          'Bei Paarvergleichen – etwa „Finde alle Produktpaare derselben Kategorie“ – filterst du mit a.id < b.id, damit jedes Paar nur einmal erscheint und kein Artikel mit sich selbst gepaart wird.',
        ],
        paragraphsEn: [
          'Beyond org charts, self-joins handle category trees, connecting flights or train legs, and within-table pair comparisons.',
          'For pair comparisons—such as finding two products in the same category—add a.id < b.id in your join or WHERE condition to avoid matching a row with itself or listing pairs twice.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Mitarbeiter mit ihrem direkten Vorgesetzten anzeigen',
      titleEn: 'Display employees alongside their direct manager',
      sql: `CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  position VARCHAR(60) NOT NULL,
  vorgesetzter_id INTEGER,
  FOREIGN KEY (vorgesetzter_id) REFERENCES mitarbeiter(id)
);

INSERT INTO mitarbeiter (id, name, position, vorgesetzter_id) VALUES
  (1, 'Dr. Sarah Koch', 'Geschäftsführung', NULL),
  (2, 'Jan Becker', 'Teamlead Backend', 1),
  (3, 'Lena Hartmann', 'Softwareentwicklerin', 2),
  (4, 'Tim Schulz', 'Softwareentwickler', 2);

SELECT m.name AS mitarbeiter,
       m.position,
       COALESCE(v.name, 'Keine (Top-Level)') AS vorgesetzter
FROM mitarbeiter AS m
LEFT JOIN mitarbeiter AS v ON m.vorgesetzter_id = v.id
ORDER BY m.id;`,
    },
    relatedSlugs: [
      'sql-inner-join-einfach-erklaert',
      'sql-left-join-unterschied-inner-join',
      'sql-korrelierte-unterabfragen',
    ],
  },

  // 8. sql-group-by-having-aggregation
  {
    slug: 'sql-group-by-having-aggregation',
    category: 'aggregation',
    publishedAt: '2026-09-18',
    readingMinutes: 7,
    titleDe: 'SQL GROUP BY und HAVING: Gruppen bilden und richtig filtern',
    titleEn: 'SQL GROUP BY and HAVING: Grouping Rows and Filtering Groups',
    descriptionDe:
      'Lerne, wie GROUP BY Datensätze zusammenfasst und worin der entscheidende Unterschied zwischen WHERE und HAVING bei Aggregatfunktionen liegt.',
    descriptionEn:
      'Learn how GROUP BY aggregates rows and understand the crucial difference between WHERE and HAVING when working with aggregate functions.',
    keywordsDe: [
      'SQL GROUP BY',
      'SQL HAVING',
      'WHERE vs HAVING',
      'SQL Gruppierung',
      'Aggregatfunktionen filtern',
    ],
    keywordsEn: [
      'SQL GROUP BY',
      'SQL HAVING',
      'WHERE vs HAVING',
      'SQL grouping',
      'filter aggregated rows',
    ],
    sections: [
      {
        headingDe: 'Wie GROUP BY Zeilen zu Gruppen verdichtet',
        headingEn: 'How GROUP BY Collapses Rows into Groups',
        paragraphsDe: [
          'GROUP BY fasst alle Zeilen mit identischem Wert in einer oder mehreren Spalten zu jeweils einer Ergebniszeile zusammen. Auf jede dieser Gruppen wendet SQL anschließend Aggregatfunktionen wie COUNT(), SUM() oder AVG() an.',
          'Eine goldene Regel lautet: Jede Spalte im SELECT-Teil, die nicht in einer Aggregatfunktion steht, muss auch im GROUP BY aufgeführt werden. Andernfalls ist nicht eindeutig, welcher Einzelwert der Gruppe angezeigt werden soll.',
        ],
        paragraphsEn: [
          'GROUP BY combines rows sharing the same value(s) in one or more columns into a single summary row per group. Aggregate functions such as COUNT(), SUM(), or AVG() are then computed per group.',
          'A golden rule of SQL: every non-aggregated column in the SELECT list must appear in the GROUP BY clause. Otherwise, the database cannot know which individual value from the group to display.',
        ],
      },
      {
        headingDe: 'WHERE vs. HAVING: Vor oder nach dem Gruppieren filtern',
        headingEn: 'WHERE vs. HAVING: Filtering Before or After Grouping',
        paragraphsDe: [
          'WHERE filtert einzelne Rohzeilen, noch bevor GROUP BY überhaupt Gruppen bildet. Deshalb darf in der WHERE-Klausel niemals eine Aggregatfunktion wie COUNT(*) > 2 stehen.',
          'HAVING hingegen filtert die fertigen Gruppen nach der Aggregation. Du kannst beide kombinieren: WHERE schließt zuerst unerwünschte Einzelzeilen aus, GROUP BY bildet die Gruppen, und HAVING behält nur die Gruppen, die eine Aggregatbedingung erfüllen.',
        ],
        paragraphsEn: [
          'WHERE filters individual rows before GROUP BY forms any groups. Because aggregates do not exist yet at that stage, you can never write COUNT(*) > 2 inside WHERE.',
          'HAVING filters the resulting groups after aggregation. You can combine both: WHERE discards unwanted raw rows first, GROUP BY aggregates the remaining rows, and HAVING keeps only qualifying groups.',
        ],
      },
      {
        headingDe: 'Nach mehreren Spalten gruppieren',
        headingEn: 'Grouping by Multiple Columns',
        paragraphsDe: [
          'Du kannst hinter GROUP BY mehrere Spalten durch Komma getrennt angeben, zum Beispiel GROUP BY jahr, kategorie. Dann entsteht für jede eindeutige Kombination aus Jahr und Kategorie eine eigene Gruppe.',
          'Sortiere das Ergebnis anschließend mit ORDER BY auf die berechneten Aggregatwerte (etwa ORDER BY gesamtumsatz DESC), um sofort die wichtigsten Gruppen oben zu sehen.',
        ],
        paragraphsEn: [
          'You can list multiple comma-separated columns in GROUP BY, such as GROUP BY year, category. SQL then creates one summary group for each unique combination.',
          'Pair this with ORDER BY on an aggregate alias (like ORDER BY total_revenue DESC) to surface the top-performing groups immediately.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Umsatz pro Kategorie berechnen und mit HAVING filtern',
      titleEn: 'Calculate revenue per category and filter with HAVING',
      sql: `CREATE TABLE verkaeufe (
  id INTEGER PRIMARY KEY,
  kategorie VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  betrag DECIMAL(8, 2) NOT NULL
);

INSERT INTO verkaeufe (id, kategorie, status, betrag) VALUES
  (1, 'Bücher', 'bezahlt', 25.00),
  (2, 'Bücher', 'bezahlt', 40.00),
  (3, 'Bücher', 'storniert', 30.00),
  (4, 'Elektronik', 'bezahlt', 199.00),
  (5, 'Elektronik', 'bezahlt', 349.00),
  (6, 'Zubehör', 'bezahlt', 15.00);

SELECT kategorie,
       COUNT(*) AS anzahl_verkaeufe,
       SUM(betrag) AS gesamtumsatz
FROM verkaeufe
WHERE status = 'bezahlt'
GROUP BY kategorie
HAVING COUNT(*) >= 2
ORDER BY gesamtumsatz DESC;`,
    },
    relatedSlugs: [
      'sql-count-sum-avg-min-max',
      'sql-order-by-distinct-limit',
      'sql-unterabfragen-in-exists',
    ],
  },

  // 9. sql-count-sum-avg-min-max
  {
    slug: 'sql-count-sum-avg-min-max',
    category: 'aggregation',
    publishedAt: '2026-09-20',
    readingMinutes: 6,
    titleDe: 'SQL Aggregatfunktionen: COUNT, SUM, AVG, MIN und MAX im Detail',
    titleEn: 'SQL Aggregate Functions: COUNT, SUM, AVG, MIN, and MAX in Detail',
    descriptionDe:
      'Alles zu COUNT(*), COUNT(spalte), SUM, AVG, MIN und MAX in SQL: Wie NULL-Werte behandelt werden und wie du mit ROUND() sauber rundest.',
    descriptionEn:
      'Master COUNT(*), COUNT(column), SUM, AVG, MIN, and MAX in SQL: understand how NULL values are handled and how to round results cleanly.',
    keywordsDe: [
      'SQL COUNT',
      'SQL SUM AVG',
      'SQL MIN MAX',
      'Aggregatfunktionen SQL',
      'COUNT NULL Verhalten',
      'SQL ROUND',
    ],
    keywordsEn: [
      'SQL COUNT',
      'SQL SUM AVG',
      'SQL MIN MAX',
      'SQL aggregate functions',
      'COUNT NULL behavior',
      'SQL ROUND',
    ],
    sections: [
      {
        headingDe: 'COUNT(*) vs. COUNT(spalte) und COUNT(DISTINCT spalte)',
        headingEn: 'COUNT(*) vs. COUNT(column) and COUNT(DISTINCT column)',
        paragraphsDe: [
          'COUNT(*) zählt alle Zeilen einer Gruppe – unabhängig davon, ob einzelne Spalten NULL enthalten. COUNT(spalte) zählt dagegen nur die Zeilen, in denen die angegebene Spalte nicht NULL ist.',
          'Möchtest du wissen, wie viele unterschiedliche Werte existieren, kombinierst du COUNT mit DISTINCT: COUNT(DISTINCT kunden_id) zählt jeden Kunden nur einmal, selbst wenn er zehnmal bestellt hat.',
        ],
        paragraphsEn: [
          'COUNT(*) counts every row in a group regardless of NULL values. By contrast, COUNT(column) counts only rows where that specific column is not NULL.',
          'To count unique values, combine COUNT with DISTINCT: COUNT(DISTINCT customer_id) counts each customer once even if they placed ten orders.',
        ],
      },
      {
        headingDe: 'Durchschnitt, Summe und Extremwerte mit NULLs',
        headingEn: 'Averages, Sums, and Extremes with NULL Values',
        paragraphsDe: [
          'SUM(), AVG(), MIN() und MAX() ignorieren NULL-Werte automatisch. Bei AVG() ist das besonders wichtig: Der Durchschnitt wird nur durch die Anzahl der vorhandenen (nicht-NULL) Werte geteilt – fehlende Werte verfälschen den Schnitt also nicht als 0.',
          'Falls ein fehlender Wert in einer Berechnung doch als 0 zählen soll, wickelst du die Spalte in COALESCE(spalte, 0). Für lesbare Ausgaben empfiehlt sich außerdem ROUND(AVG(spalte), 2).',
        ],
        paragraphsEn: [
          'SUM(), AVG(), MIN(), and MAX() automatically ignore NULL values. This matters most for AVG(): the sum is divided only by the number of non-NULL entries, rather than treating NULL as zero.',
          'If missing values should count as zero in an average, wrap the column in COALESCE(column, 0). For clean reporting, pair AVG() with ROUND(AVG(column), 2).',
        ],
      },
      {
        headingDe: 'MIN und MAX für Zahlen, Texte und Datumsangaben',
        headingEn: 'MIN and MAX Across Numbers, Strings, and Dates',
        paragraphsDe: [
          'MIN() und MAX() funktionieren nicht nur mit Zahlen, sondern auch mit Datums- und Textspalten: MIN(datum) liefert das älteste Datum, MAX(datum) das neueste, und bei Texten entscheidet die alphabetische Sortierung.',
          'Beachte jedoch, dass eine Abfrage wie SELECT name, MAX(preis) FROM produkte ohne GROUP BY in striktem SQL nicht standardkonform ist – für den Namen des teuersten Produkts nutzt du besser ORDER BY preis DESC LIMIT 1 oder eine Unterabfrage.',
        ],
        paragraphsEn: [
          'MIN() and MAX() work not only on numbers but also on dates and strings: MIN(date) finds the earliest date, MAX(date) the latest, and strings follow alphabetical order.',
          'Avoid writing SELECT name, MAX(price) FROM products without a GROUP BY; to retrieve the full row of the most expensive item, use ORDER BY price DESC LIMIT 1 or a subquery.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Klausurstatistik mit COUNT, AVG, MIN, MAX und ROUND',
      titleEn: 'Exam statistics with COUNT, AVG, MIN, MAX, and ROUND',
      sql: `CREATE TABLE pruefungen (
  id INTEGER PRIMARY KEY,
  schueler VARCHAR(60) NOT NULL,
  punkte INTEGER
);

INSERT INTO pruefungen (id, schueler, punkte) VALUES
  (1, 'Lukas', 14),
  (2, 'Mia', 12),
  (3, 'Leon', 9),
  (4, 'Hannah', 15),
  (5, 'Noah', NULL);

SELECT COUNT(*) AS alle_eintraege,
       COUNT(punkte) AS abgegebene_arbeiten,
       SUM(punkte) AS gesamtpunkte,
       ROUND(AVG(punkte), 2) AS durchschnitt_abgegeben,
       MIN(punkte) AS min_punkte,
       MAX(punkte) AS max_punkte
FROM pruefungen;`,
    },
    relatedSlugs: [
      'sql-group-by-having-aggregation',
      'sql-like-between-in-null',
      'sql-abitur-informatik-typische-aufgaben',
    ],
  },

  // 10. sql-unterabfragen-in-exists
  {
    slug: 'sql-unterabfragen-in-exists',
    category: 'aggregation',
    publishedAt: '2026-09-22',
    readingMinutes: 7,
    titleDe: 'SQL Unterabfragen (Subqueries) mit IN, NOT IN und EXISTS',
    titleEn: 'SQL Subqueries with IN, NOT IN, and EXISTS',
    descriptionDe:
      'Nutze verschachtelte SQL-Abfragen im WHERE- und FROM-Teil: Wann sich skalare Subqueries, IN oder EXISTS am besten eignen.',
    descriptionEn:
      'Use nested SQL subqueries in WHERE and FROM clauses: learn when to choose scalar subqueries, IN, or EXISTS.',
    keywordsDe: [
      'SQL Subquery',
      'SQL Unterabfrage',
      'SQL EXISTS',
      'SQL IN Subquery',
      'verschachtelte Abfragen SQL',
    ],
    keywordsEn: [
      'SQL subquery',
      'SQL EXISTS',
      'SQL IN subquery',
      'nested queries SQL',
      'scalar subquery',
    ],
    sections: [
      {
        headingDe: 'Skalare Unterabfragen für dynamische Vergleichswerte',
        headingEn: 'Scalar Subqueries for Dynamic Comparison Values',
        paragraphsDe: [
          'Manchmal kennst du einen Schwellenwert nicht vorab – etwa: „Welche Produkte kosten mehr als der Durchschnittspreis aller Produkte?“ Da Aggregatfunktionen nicht direkt in WHERE stehen dürfen, berechnest du den Durchschnitt in einer runden Klammer als Unterabfrage.',
          'Liefert eine Unterabfrage genau eine Zeile und eine Spalte zurück, spricht man von einer skalaren Subquery. Sie lässt sich überall dort einsetzen, wo ein einzelner Wert erwartet wird.',
        ],
        paragraphsEn: [
          'Sometimes a threshold is not known upfront, such as: "Which products cost more than the average price of all products?" Because aggregate functions cannot sit directly inside WHERE, you compute the average inside a parenthesized subquery.',
          'When a subquery returns exactly one row and one column, it is called a scalar subquery and can be used anywhere a single value is expected.',
        ],
      },
      {
        headingDe: 'Listenabgleich mit IN vs. Existenzprüfung mit EXISTS',
        headingEn: 'List Membership with IN vs. Existence Checks with EXISTS',
        paragraphsDe: [
          'Liefert die innere Abfrage eine ganze Spalte mit mehreren Werten, prüfst du mit IN oder NOT IN. Bei NOT IN droht jedoch die NULL-Falle: Sobald die Unterabfrage auch nur ein einziges NULL zurückgibt, liefert NOT IN eine leere Ergebnismenge.',
          'EXISTS ist hier robuster und oft schneller: Es prüft lediglich, ob die innere Abfrage mindestens eine Zeile findet, und bricht beim ersten Treffer sofort ab.',
        ],
        paragraphsEn: [
          'When an inner query returns a single column with multiple rows, you can check membership with IN or NOT IN. Beware the NULL trap with NOT IN: if the subquery returns even one NULL, NOT IN evaluates to empty.',
          'EXISTS is safer and often faster: it simply tests whether the inner query produces at least one row and stops on the first match.',
        ],
      },
      {
        headingDe: 'Unterabfragen im FROM-Teil (Derived Tables)',
        headingEn: 'Subqueries in the FROM Clause (Derived Tables)',
        paragraphsDe: [
          'Du kannst das Ergebnis einer SELECT-Abfrage auch im FROM-Teil wie eine temporäre Tabelle weiterverarbeiten – etwa um zuerst Summen pro Kunde zu berechnen und anschließend den Durchschnitt dieser Kundensummen zu bilden.',
          'Gib solchen abgeleiteten Tabellen immer einen Alias (AS t), damit die äußere Abfrage sauber darauf zugreifen kann.',
        ],
        paragraphsEn: [
          'You can also place a subquery inside the FROM clause as a derived table—for example, to compute per-customer totals first and then average those totals in an outer query.',
          'Always give a derived table an alias (such as AS sub) so the outer query can reference its columns cleanly.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Überdurchschnittliche Produkte und Kunden mit Bestellungen per EXISTS',
      titleEn: 'Above-average products and customers with orders using EXISTS',
      sql: `CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL
);

INSERT INTO produkte VALUES
  (1, 'Tastatur', 49.00),
  (2, 'Monitor', 299.00),
  (3, 'Mauspad', 15.00),
  (4, 'Headset', 89.00);

SELECT name, preis
FROM produkte
WHERE preis > (SELECT AVG(preis) FROM produkte)
ORDER BY preis DESC;`,
    },
    relatedSlugs: [
      'sql-korrelierte-unterabfragen',
      'sql-left-join-unterschied-inner-join',
      'sql-group-by-having-aggregation',
    ],
  },

  // 11. sql-korrelierte-unterabfragen
  {
    slug: 'sql-korrelierte-unterabfragen',
    category: 'aggregation',
    publishedAt: '2026-09-25',
    readingMinutes: 7,
    titleDe: 'Korrelierte Unterabfragen in SQL: Gruppenweise Vergleiche meistern',
    titleEn: 'Correlated Subqueries in SQL: Mastering Per-Group Comparisons',
    descriptionDe:
      'Verstehe korrelierte Subqueries in SQL: Wie die innere Abfrage auf Werte der äußeren Zeile zugreift – perfekt für „teuerstes Produkt pro Kategorie“.',
    descriptionEn:
      'Understand correlated subqueries in SQL: how an inner query references outer row values—ideal for finding the top item per category.',
    keywordsDe: [
      'korrelierte Unterabfrage',
      'correlated subquery SQL',
      'Maximum pro Gruppe SQL',
      'SQL EXISTS korreliert',
      'fortgeschrittenes SQL',
    ],
    keywordsEn: [
      'correlated subquery SQL',
      'top per group SQL',
      'SQL EXISTS correlated',
      'advanced SQL queries',
      'per-category average SQL',
    ],
    sections: [
      {
        headingDe: 'Was eine Unterabfrage „korreliert“ macht',
        headingEn: 'What Makes a Subquery Correlated',
        paragraphsDe: [
          'Eine normale Unterabfrage läuft einmal unabhängig vorab. Eine korrelierte Unterabfrage bezieht sich dagegen auf eine Spalte der äußeren Abfrage – sie wird logisch für jede einzelne Zeile der äußeren Tabelle neu ausgewertet.',
          'Typisches Beispiel: „Finde alle Artikel, die teurer sind als der Durchschnittspreis ihrer jeweiligen Kategorie.“ Hier muss die innere Abfrage wissen, welche Kategorie die äußere Zeile gerade hat.',
        ],
        paragraphsEn: [
          'A standard subquery executes once independently. A correlated subquery references a column from the outer query, so it is logically evaluated once for each row of the outer table.',
          'A classic use case: "Find all items priced above the average price of their own category." The inner query needs the category of the current outer row.',
        ],
      },
      {
        headingDe: 'Top-Eintrag pro Gruppe und NOT EXISTS',
        headingEn: 'Top Item per Group and NOT EXISTS',
        paragraphsDe: [
          'Mit einer korrelierten Unterabfrage kannst du auch elegant das jeweils neueste oder teuerste Element pro Gruppe finden, ohne auf dialektspezifische Window Functions zurückzugreifen.',
          'Ebenso ist korreliertes NOT EXISTS der sauberste Weg, um fehlende Datensätze zu finden – ganz ohne die NULL-Problematik von NOT IN.',
        ],
        paragraphsEn: [
          'Correlated subqueries also let you find the latest or most expensive item per group cleanly in pure standard SQL without relying on dialect-specific window functions.',
          'Likewise, correlated NOT EXISTS is the safest pattern for anti-joins without any NOT IN NULL pitfalls.',
        ],
      },
      {
        headingDe: 'Performance-Tipp: Indizes auf der Korrelationsspalte',
        headingEn: 'Performance Tip: Indexing the Correlated Column',
        paragraphsDe: [
          'Da korrelierte Unterabfragen konzeptionell pro äußerer Zeile ausgeführt werden, profitieren sie enorm von einem Index auf der verknüpften Spalte (z. B. kategorie oder kunden_id).',
          'Bei großen Tabellen lohnt es sich außerdem zu prüfen, ob sich die Abfrage alternativ als JOIN gegen eine gruppierte Unterabfrage im FROM-Teil formulieren lässt.',
        ],
        paragraphsEn: [
          'Because correlated subqueries are conceptually evaluated once per outer row, they benefit greatly from an index on the correlated lookup column (such as category or customer_id).',
          'On large datasets, it is also worth checking whether a JOIN against a pre-aggregated derived table expresses the same logic faster.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Produkte über dem Durchschnitt ihrer eigenen Kategorie finden',
      titleEn: 'Find products priced above their own category average',
      sql: `CREATE TABLE artikel (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  kategorie VARCHAR(50) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL
);

INSERT INTO artikel VALUES
  (1, 'USB-Kabel', 'Zubehör', 10.00),
  (2, 'Dockingstation', 'Zubehör', 90.00),
  (3, 'Taschenbuch SQL', 'Bücher', 18.00),
  (4, 'Fachbuch Datenbanken', 'Bücher', 48.00);

SELECT a1.name, a1.kategorie, a1.preis
FROM artikel AS a1
WHERE a1.preis > (
  SELECT AVG(a2.preis)
  FROM artikel AS a2
  WHERE a2.kategorie = a1.kategorie
)
ORDER BY a1.kategorie, a1.preis DESC;`,
    },
    relatedSlugs: [
      'sql-unterabfragen-in-exists',
      'sql-self-join-hierarchien',
      'sql-group-by-having-aggregation',
    ],
  },

  // 12. sql-create-table-primary-foreign-key
  {
    slug: 'sql-create-table-primary-foreign-key',
    category: 'ddl_design',
    publishedAt: '2026-09-28',
    readingMinutes: 7,
    titleDe: 'SQL CREATE TABLE: Primärschlüssel, Fremdschlüssel und Datentypen',
    titleEn: 'SQL CREATE TABLE: Primary Keys, Foreign Keys, and Data Types',
    descriptionDe:
      'Erstelle eigene relationale Tabellen mit CREATE TABLE: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE und passende Datentypen in MySQL & SQLite.',
    descriptionEn:
      'Design relational tables with CREATE TABLE: configure PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, and standard data types in MySQL & SQLite.',
    keywordsDe: [
      'SQL CREATE TABLE',
      'PRIMARY KEY SQL',
      'FOREIGN KEY SQL',
      'SQL Datentypen',
      'referentielle Integrität',
    ],
    keywordsEn: [
      'SQL CREATE TABLE',
      'PRIMARY KEY SQL',
      'FOREIGN KEY SQL',
      'SQL data types',
      'referential integrity',
    ],
    sections: [
      {
        headingDe: 'Tabellenstruktur und Datentypen festlegen',
        headingEn: 'Defining Table Structure and Data Types',
        paragraphsDe: [
          'Mit CREATE TABLE definierst du den Bauplan einer Tabelle (DDL – Data Definition Language). Jede Spalte erhält einen Namen, einen Datentyp wie INTEGER, VARCHAR(80), DECIMAL(8,2) oder DATE sowie optionale Einschränkungen (Constraints).',
          'NOT NULL stellt sicher, dass ein Pflichtfeld niemals leer bleibt. UNIQUE verhindert doppelte Werte in einer Spalte, etwa bei E-Mail-Adressen oder Artikelnummern.',
        ],
        paragraphsEn: [
          'CREATE TABLE defines the blueprint of a table in SQL (DDL — Data Definition Language). Each column gets a name, a data type such as INTEGER, VARCHAR(80), DECIMAL(8,2), or DATE, and optional constraints.',
          'NOT NULL enforces that required fields cannot be left empty, while UNIQUE prevents duplicate values such as email addresses or SKU codes.',
        ],
      },
      {
        headingDe: 'Primär- und Fremdschlüssel für referentielle Integrität',
        headingEn: 'Primary and Foreign Keys for Referential Integrity',
        paragraphsDe: [
          'Der PRIMARY KEY identifiziert jeden Datensatz eindeutig. Bei zusammengesetzten Schlüsseln (typisch für n:m-Zwischentabellen) notierst du PRIMARY KEY (spalte1, spalte2) am Ende der Tabellendefinition.',
          'Ein FOREIGN KEY verweist auf den Primärschlüssel einer anderen Tabelle. Die Datenbank verhindert dadurch, dass Verweise auf nicht existierende Datensätze gespeichert werden (referentielle Integrität).',
        ],
        paragraphsEn: [
          'A PRIMARY KEY uniquely identifies each row in a table. For composite keys—common in many-to-many bridge tables—declare PRIMARY KEY (col1, col2) at the table level.',
          'A FOREIGN KEY references the primary key of another table, ensuring referential integrity so dangling references to nonexistent rows are rejected.',
        ],
      },
      {
        headingDe: 'DEFAULT-Werte und AUTO_INCREMENT sinnvoll nutzen',
        headingEn: 'Using DEFAULT Values and AUTO_INCREMENT Wisely',
        paragraphsDe: [
          'Mit DEFAULT legst du sinnvolle Standardwerte fest (z. B. aktiv INTEGER DEFAULT 1), falls beim INSERT kein Wert angegeben wird. So bleiben Tabellen kompakt und konsistent.',
          'Für künstliche ID-Spalten (Surrogate Keys) vergibt die Datenbank mit AUTO_INCREMENT (MySQL) bzw. INTEGER PRIMARY KEY (SQLite) automatisch fortlaufende Nummern – SQL-Trainer unterstützt beide Schreibweisen im jeweiligen Dialekt.',
        ],
        paragraphsEn: [
          'DEFAULT supplies sensible fallback values (such as active INTEGER DEFAULT 1) whenever an INSERT omits a column, keeping schemas consistent.',
          'For surrogate IDs, AUTO_INCREMENT (MySQL) or INTEGER PRIMARY KEY (SQLite) generates unique sequential keys automatically—and SQL-Trainer supports both in their respective dialect modes.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Zwei verknüpfte Tabellen mit PRIMARY KEY und FOREIGN KEY erstellen',
      titleEn: 'Create two linked tables with PRIMARY KEY and FOREIGN KEY',
      sql: `CREATE TABLE abteilungen (
  abt_id INTEGER PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE angestellte (
  pers_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  abt_id INTEGER NOT NULL,
  FOREIGN KEY (abt_id) REFERENCES abteilungen(abt_id)
);

INSERT INTO abteilungen (abt_id, name) VALUES (1, 'Entwicklung'), (2, 'Design');
INSERT INTO angestellte (pers_id, name, email, abt_id) VALUES
  (101, 'Mia Weber', 'mia@example.de', 1),
  (102, 'Leon Becker', 'leon@example.de', 2);

SELECT a.pers_id, a.name, abt.name AS abteilung
FROM angestellte AS a
INNER JOIN abteilungen AS abt ON a.abt_id = abt.abt_id;`,
    },
    relatedSlugs: [
      'sql-alter-table-insert-update-delete',
      'datenbank-normalisierung-1nf-2nf-3nf',
      'erm-zu-sql-kardinalitaeten-1n-nm',
    ],
  },

  // 13. sql-alter-table-insert-update-delete
  {
    slug: 'sql-alter-table-insert-update-delete',
    category: 'ddl_design',
    publishedAt: '2026-10-01',
    readingMinutes: 6,
    titleDe: 'ALTER TABLE, INSERT, UPDATE und DELETE: Tabellen und Daten ändern',
    titleEn: 'ALTER TABLE, INSERT, UPDATE, and DELETE: Modifying Schemas and Data',
    descriptionDe:
      'Lerne DML und DDL sicher anzuwenden: Spalten mit ALTER TABLE ergänzen, Zeilen mit INSERT anlegen, mit UPDATE ändern und mit DELETE gezielt löschen.',
    descriptionEn:
      'Master DML and DDL safely: add columns with ALTER TABLE, insert rows with INSERT, modify records with UPDATE, and delete safely with DELETE.',
    keywordsDe: [
      'SQL INSERT INTO',
      'SQL UPDATE WHERE',
      'SQL DELETE',
      'SQL ALTER TABLE',
      'DML Befehle SQL',
    ],
    keywordsEn: [
      'SQL INSERT INTO',
      'SQL UPDATE WHERE',
      'SQL DELETE',
      'SQL ALTER TABLE',
      'SQL DML commands',
    ],
    sections: [
      {
        headingDe: 'Neue Datensätze anlegen und Tabellen nachträglich erweitern',
        headingEn: 'Inserting Rows and Extending Existing Tables',
        paragraphsDe: [
          'Mit INSERT INTO tabelle (spalte1, spalte2) VALUES (...) fügst du neue Zeilen ein. Gib die Spaltenliste immer explizit an – so bleibt dein Statement auch dann gültig, wenn die Tabelle später neue Spalten bekommt.',
          'Fehlt im Nachhinein ein Attribut, ergänzt ALTER TABLE tabelle ADD COLUMN spalte TYP die bestehende Tabelle ohne Datenverlust.',
        ],
        paragraphsEn: [
          'Use INSERT INTO table (col1, col2) VALUES (...) to add new rows. Always specify the column list explicitly so your statement stays resilient when the schema evolves.',
          'When you need a new attribute later, ALTER TABLE table ADD COLUMN col TYPE adds it to the existing table without losing data.',
        ],
      },
      {
        headingDe: 'UPDATE und DELETE niemals ohne WHERE-Prüfung',
        headingEn: 'Never Run UPDATE or DELETE Without Checking WHERE',
        paragraphsDe: [
          'UPDATE ändert bestehende Zeilen, DELETE entfernt sie. Vergisst du bei einem dieser beiden Befehle die WHERE-Klausel, werden sämtliche Zeilen der gesamten Tabelle geändert oder gelöscht!',
          'Ein bewährter Profi-Trick: Formuliere zuerst eine SELECT-Abfrage mit genau derselben WHERE-Bedingung, prüfe die betroffenen Zeilen, und wandle sie erst danach in UPDATE oder DELETE um.',
        ],
        paragraphsEn: [
          'UPDATE modifies existing rows and DELETE removes them. Omitting the WHERE clause on either statement updates or deletes every single row in the table.',
          'A reliable habit: run a SELECT query with the exact same WHERE condition first to inspect affected rows before executing UPDATE or DELETE.',
        ],
      },
      {
        headingDe: 'Fremdschlüssel beim Löschen beachten',
        headingEn: 'Respecting Foreign Keys When Deleting Rows',
        paragraphsDe: [
          'Wenn auf einen Datensatz noch ein Fremdschlüssel aus einer anderen Tabelle verweist, blockiert die Datenbank ein DELETE (bei aktiviertem PRAGMA foreign_keys = ON), um verwaiste Verweise zu verhindern.',
          'Lösche in solchen Fällen zuerst die abhängigen Detailzeilen oder definiere ON DELETE CASCADE nur dort, wo untergeordnete Einträge tatsächlich mitgelöscht werden sollen.',
        ],
        paragraphsEn: [
          'When another table still references a row via a foreign key, the database blocks DELETE (with PRAGMA foreign_keys = ON enabled) to prevent orphaned records.',
          'In that case, delete dependent child rows first or configure ON DELETE CASCADE only where automatic cascading deletion is genuinely desired.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Tabelle mit ALTER TABLE erweitern und Daten mit UPDATE/DELETE pflegen',
      titleEn: 'Extend a table with ALTER TABLE and maintain rows with UPDATE/DELETE',
      sql: `CREATE TABLE aufgaben (
  id INTEGER PRIMARY KEY,
  titel VARCHAR(100) NOT NULL,
  erledigt INTEGER NOT NULL DEFAULT 0
);

INSERT INTO aufgaben (id, titel, erledigt) VALUES
  (1, 'Schema entwerfen', 0),
  (2, 'Testdaten einfügen', 0),
  (3, 'Alte Notiz löschen', 0);

ALTER TABLE aufgaben ADD COLUMN prioritaet VARCHAR(20) DEFAULT 'normal';

UPDATE aufgaben
SET erledigt = 1, prioritaet = 'hoch'
WHERE id = 1;

DELETE FROM aufgaben
WHERE id = 3;

SELECT id, titel, erledigt, prioritaet
FROM aufgaben
ORDER BY id;`,
    },
    relatedSlugs: [
      'sql-create-table-primary-foreign-key',
      'sql-select-where-grundlagen',
      'sql-constraints-not-null-unique-check',
    ],
  },

  // 14. datenbank-normalisierung-1nf-2nf-3nf
  {
    slug: 'datenbank-normalisierung-1nf-2nf-3nf',
    category: 'ddl_design',
    publishedAt: '2026-10-04',
    readingMinutes: 8,
    titleDe: 'Datenbank-Normalisierung einfach erklärt: 1NF, 2NF und 3NF',
    titleEn: 'Database Normalization Explained: 1NF, 2NF, and 3NF',
    descriptionDe:
      'Redundanzen und Anomalien vermeiden: Verstehe die 1., 2. und 3. Normalform anhand eines praxisnahen Beispiels für Klausur, Abitur und Beruf.',
    descriptionEn:
      'Eliminate redundancy and update anomalies: understand 1st, 2nd, and 3rd Normal Form with a clear, practical relational database example.',
    keywordsDe: [
      'Datenbank Normalisierung',
      '1NF 2NF 3NF',
      'Dritte Normalform Beispiel',
      'Redundanz Anomalien SQL',
      'Abitur Normalisierung',
    ],
    keywordsEn: [
      'database normalization',
      '1NF 2NF 3NF',
      'third normal form example',
      'update anomalies SQL',
      'relational schema design',
    ],
    sections: [
      {
        headingDe: 'Warum unnormalisierte Tabellen Probleme verursachen',
        headingEn: 'Why Unnormalized Tables Cause Anomalies',
        paragraphsDe: [
          'Stehen alle Informationen in einer einzigen großen Tabelle – etwa Bestellnummer, Kundenname, Kundenort, Artikel und Preis –, entstehen drei klassische Anomalien: Änderungsanomalien (eine neue Adresse muss an zehn Stellen geändert werden), Einfügeanomalien und Löschanomalien.',
          'Normalisierung zerlegt solche Tabellen schrittweise in kleinere, saubere Relationen, ohne dass Informationen verloren gehen.',
        ],
        paragraphsEn: [
          'Storing everything in one giant flat table—order ID, customer name, city, product, and price—causes update, insertion, and deletion anomalies.',
          'Normalization systematically splits flat tables into clean, focused relations without losing any information.',
        ],
      },
      {
        headingDe: '1NF, 2NF und 3NF Schritt für Schritt',
        headingEn: '1NF, 2NF, and 3NF Step by Step',
        paragraphsDe: [
          'Erste Normalform (1NF): Jedes Feld enthält nur noch einen einzigen, atomaren Wert – keine kommagetrennten Listen oder Mehrfachwerte in einer Zelle.',
          'Zweite Normalform (2NF): Die Tabelle ist in 1NF, und jedes Nicht-Schlüsselattribut hängt voll funktional vom gesamten Primärschlüssel ab (wichtig bei zusammengesetzten Schlüsseln: Teilabhängigkeiten auslagern!).',
          'Dritte Normalform (3NF): Die Tabelle ist in 2NF, und es gibt keine transitiven Abhängigkeiten zwischen Nicht-Schlüsselattributen (z. B. hängt der Ort von der PLZ ab, nicht direkt vom Kunden).',
        ],
        paragraphsEn: [
          'First Normal Form (1NF): Every cell holds a single atomic value—no comma-separated lists or repeating groups.',
          'Second Normal Form (2NF): The table is in 1NF and every non-key attribute depends on the whole primary key, eliminating partial dependencies on composite keys.',
          'Third Normal Form (3NF): The table is in 2NF and has no transitive dependencies among non-key attributes (for example, city depending on postal code rather than directly on the customer).',
        ],
      },
      {
        headingDe: 'Wann bewusste Denormalisierung sinnvoll sein kann',
        headingEn: 'When Intentional Denormalization Makes Sense',
        paragraphsDe: [
          'Normalisierung schützt vor inkonsistenten Daten, führt aber manchmal zu vielen JOINs. In analytischen Berichten oder bei historischen Werten (etwa dem Artikelpreis zum Zeitpunkt einer Bestellung) speichert man manche Werte bewusst redundant in der Bestellposition, damit spätere Preisänderungen alte Rechnungen nicht verfälschen.',
        ],
        paragraphsEn: [
          'Normalization prevents inconsistent data, though it can increase join depth. In analytical reporting or historical snapshots—such as storing unit_price on an order line item—intentional redundancy ensures future catalog price changes never alter past invoices.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Normalisiertes Bestellschema in 3NF mit JOIN abfragen',
      titleEn: 'Query a normalized 3NF order schema with JOIN',
      sql: `CREATE TABLE orte (
  plz VARCHAR(10) PRIMARY KEY,
  stadt VARCHAR(60) NOT NULL
);

CREATE TABLE kunden (
  kunden_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  plz VARCHAR(10) NOT NULL,
  FOREIGN KEY (plz) REFERENCES orte(plz)
);

CREATE TABLE bestellungen (
  bestell_id INTEGER PRIMARY KEY,
  kunden_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  FOREIGN KEY (kunden_id) REFERENCES kunden(kunden_id)
);

INSERT INTO orte VALUES ('10115', 'Berlin'), ('20095', 'Hamburg');
INSERT INTO kunden VALUES (1, 'Anna Weber', '10115'), (2, 'Tom Meyer', '20095');
INSERT INTO bestellungen VALUES (1001, 1, '2026-10-01'), (1002, 2, '2026-10-02');

SELECT b.bestell_id, b.datum, k.name, o.plz, o.stadt
FROM bestellungen AS b
INNER JOIN kunden AS k ON b.kunden_id = k.kunden_id
INNER JOIN orte AS o ON k.plz = o.plz;`,
    },
    relatedSlugs: [
      'erm-zu-sql-kardinalitaeten-1n-nm',
      'sql-create-table-primary-foreign-key',
      'sql-multi-table-joins-drei-tabellen',
    ],
  },

  // 15. erm-zu-sql-kardinalitaeten-1n-nm
  {
    slug: 'erm-zu-sql-kardinalitaeten-1n-nm',
    category: 'ddl_design',
    publishedAt: '2026-10-06',
    readingMinutes: 7,
    titleDe: 'Vom ER-Modell zu SQL: 1:1, 1:n und n:m richtig umsetzen',
    titleEn: 'From ER Diagram to SQL: Implementing 1:1, 1:N, and M:N Relationships',
    descriptionDe:
      'Überführe Entity-Relationship-Modelle fehlerfrei in SQL-Tabellen: Wo kommt der Fremdschlüssel hin, und wann brauchst du eine Zwischentabelle?',
    descriptionEn:
      'Translate ER diagrams into clean SQL tables: learn where to place foreign keys for 1:1 and 1:N, and when to create a bridge table for M:N.',
    keywordsDe: [
      'ERM zu SQL',
      'ER Modell SQL Tabellen',
      'Kardinalitäten 1:n n:m',
      'Fremdschlüssel platzieren',
      'Zwischentabelle SQL',
    ],
    keywordsEn: [
      'ER diagram to SQL',
      '1:N M:N SQL schema',
      'foreign key placement',
      'junction table SQL',
      'relational modeling',
    ],
    sections: [
      {
        headingDe: '1:n-Beziehungen: Der Fremdschlüssel wandert auf die n-Seite',
        headingEn: '1:N Relationships: Place the Foreign Key on the N-Side',
        paragraphsDe: [
          'Bei einer 1:n-Beziehung – etwa ein Verlag veröffentlicht viele Bücher, jedes Buch gehört zu genau einem Verlag – erhält immer die Tabelle auf der n-Seite (buecher) den Fremdschlüssel (verlag_id).',
          'So vermeidest du Mehrfachwerte in einer Zelle und garantierst, dass jedes Buch eindeutig seinem Verlag zugeordnet ist.',
        ],
        paragraphsEn: [
          'In a 1:N relationship—such as one publisher publishing many books, where each book belongs to one publisher—the foreign key (publisher_id) always goes on the N-side table (books).',
          'This avoids repeating columns and ensures every book points cleanly to its publisher.',
        ],
      },
      {
        headingDe: 'n:m-Beziehungen: Eigene Zwischentabelle mit Verbundschlüssel',
        headingEn: 'M:N Relationships: Create a Dedicated Bridge Table',
        paragraphsDe: [
          'Können beide Seiten beliebig viele Partner haben – etwa ein Buch hat mehrere Autoren und ein Autor schreibt mehrere Bücher –, reicht ein einfacher Fremdschlüssel nicht aus.',
          'Du löst die n:m-Beziehung in zwei 1:n-Beziehungen auf, indem du eine Zwischentabelle (z. B. buch_autor) anlegst. Sie enthält beide Fremdschlüssel als zusammengesetzten Primärschlüssel PRIMARY KEY (buch_id, autor_id).',
        ],
        paragraphsEn: [
          'When both sides can link to many records—such as books and authors—a single foreign key cannot represent the relationship.',
          'You resolve M:N into two 1:N relationships using a bridge table (e.g., book_author) containing both foreign keys as a composite PRIMARY KEY (book_id, author_id).',
        ],
      },
      {
        headingDe: '1:1-Beziehungen und Beziehungsattribute richtig abbilden',
        headingEn: 'Modeling 1:1 Relationships and Relationship Attributes',
        paragraphsDe: [
          'Bei einer 1:1-Beziehung (z. B. Mitarbeiter und Dienstausweis) platzierst du den Fremdschlüssel auf einer der beiden Seiten und versiehst ihn mit UNIQUE, sodass maximal ein Partner zugeordnet werden kann.',
          'Hat eine n:m-Beziehung eigene Attribute – etwa die Note in belegt oder die Menge in bestellposition –, wandern diese Attribute direkt in die Zwischentabelle.',
        ],
        paragraphsEn: [
          'For a 1:1 relationship (such as employee and badge), place the foreign key on one side and add a UNIQUE constraint so each record links to at most one partner.',
          'Whenever an M:N relationship carries its own attributes—like grade in enrollments or quantity in order_items—those columns belong directly inside the bridge table.',
        ],
      },
    ],
    codeExample: {
      titleDe: '1:n- und n:m-Beziehung (Verlag, Buch, Autor) in SQL anlegen',
      titleEn: 'Create 1:N and M:N relationships (Publisher, Book, Author) in SQL',
      sql: `CREATE TABLE verlage (
  verlag_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE buecher (
  buch_id INTEGER PRIMARY KEY,
  titel VARCHAR(100) NOT NULL,
  verlag_id INTEGER NOT NULL,
  FOREIGN KEY (verlag_id) REFERENCES verlage(verlag_id)
);

CREATE TABLE autoren (
  autor_id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE buch_autor (
  buch_id INTEGER NOT NULL,
  autor_id INTEGER NOT NULL,
  PRIMARY KEY (buch_id, autor_id),
  FOREIGN KEY (buch_id) REFERENCES buecher(buch_id),
  FOREIGN KEY (autor_id) REFERENCES autoren(autor_id)
);

INSERT INTO verlage VALUES (1, 'Informatik Verlag');
INSERT INTO buecher VALUES (10, 'SQL kompakt', 1);
INSERT INTO autoren VALUES (100, 'Dr. Weber'), (101, 'M. Klein');
INSERT INTO buch_autor VALUES (10, 100), (10, 101);

SELECT b.titel, v.name AS verlag, a.name AS autor
FROM buecher AS b
INNER JOIN verlage AS v ON b.verlag_id = v.verlag_id
INNER JOIN buch_autor AS ba ON b.buch_id = ba.buch_id
INNER JOIN autoren AS a ON ba.autor_id = a.autor_id;`,
    },
    relatedSlugs: [
      'datenbank-normalisierung-1nf-2nf-3nf',
      'sql-create-table-primary-foreign-key',
      'sql-multi-table-joins-drei-tabellen',
    ],
  },

  // 16. sql-abitur-informatik-typische-aufgaben
  {
    slug: 'sql-abitur-informatik-typische-aufgaben',
    category: 'abitur_school',
    publishedAt: '2026-10-08',
    readingMinutes: 8,
    titleDe: 'SQL im Informatik-Abitur: Typische Aufgaben und Lösungsstrategien',
    titleEn: 'SQL in Computer Science Exams: Typical Tasks and Strategies',
    descriptionDe:
      'Bereite dich gezielt auf SQL-Aufgaben im Informatik-Abitur vor: Mehrfach-JOINs, GROUP BY mit HAVING, Subqueries und häufige Bewertungsfallen.',
    descriptionEn:
      'Prepare effectively for SQL exam tasks: multi-table JOINs, GROUP BY with HAVING, subqueries, and common grading pitfalls.',
    keywordsDe: [
      'SQL Abitur Informatik',
      'SQL Klausur Aufgaben',
      'Informatik Abitur Datenbanken',
      'SQL Übungsaufgaben Oberstufe',
      'GROUP BY HAVING Abitur',
    ],
    keywordsEn: [
      'SQL computer science exam',
      'SQL practice tasks',
      'high school SQL database exam',
      'GROUP BY HAVING exam',
      'SQL study guide',
    ],
    sections: [
      {
        headingDe: 'Welche SQL-Muster im Abitur fast immer vorkommen',
        headingEn: 'SQL Patterns That Almost Always Appear in Exams',
        paragraphsDe: [
          'In Abituraufgaben der Oberstufe begegnet dir fast immer ein mehrtabelliges Schema mit 3 bis 5 Relationen – etwa Schule, Bibliothek, Kinobuchung oder Verein. Die ersten Teilaufgaben testen gezieltes Filtern mit WHERE, Sortieren mit ORDER BY und Verknüpfen über einen oder zwei INNER JOINs.',
          'Danach folgt regelmäßig eine Auswertungsaufgabe mit COUNT(), SUM() oder AVG(), kombiniert mit GROUP BY und häufig einer Einschränkung über HAVING (z. B. „Alle Kurse mit mindestens 10 Belegungen“).',
        ],
        paragraphsEn: [
          'High school computer science exams almost always present a 3-to-5-table relational schema such as a school, library, cinema, or club. Early sub-questions test filtering with WHERE, sorting with ORDER BY, and joining across one or two INNER JOINs.',
          'Later sub-questions typically require aggregation with COUNT(), SUM(), or AVG(), combined with GROUP BY and a HAVING filter (e.g., "All courses with at least 10 enrollments").',
        ],
      },
      {
        headingDe: 'Drei Checkpunkte vor der Abgabe deiner Lösung',
        headingEn: 'Three Final Checks Before Submitting Your Query',
        paragraphsDe: [
          'Prüfe erstens, ob jede nicht-aggregierte Spalte im SELECT-Teil auch im GROUP BY steht. Prüfe zweitens bei Mehrfach-JOINs, ob du Fremd- und Primärschlüssel sauber mit Tabellenaliasen qualifiziert hast.',
          'Drittens: Wenn nach „alle ... auch ohne ...“ oder „welche ... haben noch nie ...“ gefragt wird, brauchst du fast immer einen LEFT JOIN mit IS NULL oder NOT EXISTS statt eines normalen INNER JOIN.',
        ],
        paragraphsEn: [
          'First, verify that every non-aggregated column in SELECT also appears in GROUP BY. Second, double-check that all primary and foreign keys in multi-table joins are qualified with table aliases.',
          'Third, whenever a prompt asks for "including those without..." or "who have never...", reach for LEFT JOIN ... IS NULL or NOT EXISTS instead of an INNER JOIN.',
        ],
      },
      {
        headingDe: 'Effektiv üben mit echten Abitur-Schemata',
        headingEn: 'Practicing Effectively with Realistic Exam Schemas',
        paragraphsDe: [
          'Statt Befehle nur auswendig zu lernen, solltest du jede Abfrage an einer echten Datenbank ausführen und das Zwischenergebnis schrittweise prüfen: Erst FROM und JOIN testen, dann WHERE ergänzen, schließlich GROUP BY und HAVING hinzufügen.',
          'In SQL-Trainer stehen dir genau dafür vorbereitete Schemata wie Schule, Onlineshop und Kino mit abgestuften Aufgaben inklusive sofortiger Prüfung zur Verfügung.',
        ],
        paragraphsEn: [
          'Instead of memorizing syntax passively, run every query against a real database and inspect intermediate results step by step: validate FROM and JOIN first, add WHERE filters, and then apply GROUP BY and HAVING.',
          'SQL-Trainer gives you ready-to-use schemas like School, Online Shop, and Cinema with graded tasks and instant feedback.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Abitur-typische Kursauswertung mit JOIN, GROUP BY und HAVING',
      titleEn: 'Exam-style course statistics using JOIN, GROUP BY, and HAVING',
      sql: `CREATE TABLE kurse (
  kurs_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(80) NOT NULL
);

CREATE TABLE belegt (
  schueler_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note_punkte INTEGER NOT NULL,
  PRIMARY KEY (schueler_id, kurs_id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(kurs_id)
);

INSERT INTO kurse VALUES (1, 'Informatik LK'), (2, 'Mathematik GK'), (3, 'Physik LK');
INSERT INTO belegt VALUES
  (1, 1, 14), (2, 1, 12), (3, 1, 15),
  (1, 2, 11), (2, 2, 10),
  (3, 3, 13);

SELECT k.bezeichnung,
       COUNT(b.schueler_id) AS teilnehmer,
       ROUND(AVG(b.note_punkte), 2) AS schnitt
FROM kurse AS k
INNER JOIN belegt AS b ON k.kurs_id = b.kurs_id
GROUP BY k.kurs_id, k.bezeichnung
HAVING COUNT(b.schueler_id) >= 2
ORDER BY schnitt DESC;`,
    },
    relatedSlugs: [
      'ihk-fachinformatiker-sql-pruefung-tipps',
      'sql-multi-table-joins-drei-tabellen',
      'sql-group-by-having-aggregation',
    ],
  },

  // 17. ihk-fachinformatiker-sql-pruefung-tipps
  {
    slug: 'ihk-fachinformatiker-sql-pruefung-tipps',
    category: 'abitur_school',
    publishedAt: '2026-10-10',
    readingMinutes: 7,
    titleDe: 'IHK-Prüfung Fachinformatiker: SQL-Teil sicher bestehen',
    titleEn: 'IHK IT Specialist Exam: Passing the SQL Section with Confidence',
    descriptionDe:
      'Praxisnahe Tipps für die IHK-Abschlussprüfung (FIAE & FISI): ERM lesen, 3. Normalform begründen, JOINs fehlerfrei schreiben und DML-Aufgaben lösen.',
    descriptionEn:
      'Practical tips for German IHK IT Specialist exams: reading ER diagrams, justifying 3NF, writing bug-free JOINs, and solving DML tasks.',
    keywordsDe: [
      'IHK Fachinformatiker SQL',
      'FIAE SQL Prüfung',
      'FISI Datenbanken Prüfung',
      'IHK Abschlussprüfung SQL Tipps',
      'SQL Prüfungsvorbereitung',
    ],
    keywordsEn: [
      'IHK IT exam SQL',
      'German IT specialist SQL',
      'SQL exam preparation',
      'relational schema IHK',
      'SQL DML DDL exam',
    ],
    sections: [
      {
        headingDe: 'Was die IHK im Datenbank-Teil konkret verlangt',
        headingEn: 'What the Exam Specifically Tests in the Database Section',
        paragraphsDe: [
          'In den Abschlussprüfungen für Fachinformatiker (Anwendungsentwicklung und Systemintegration) kombiniert der Datenbank-Block fast immer Modellierung und SQL-Praxis: Du analysierst ein ER-Diagramm, überführst Entitäten in die 3. Normalform und schreibst anschließend 3 bis 5 SQL-Statements.',
          'Neben SELECT-Abfragen mit JOIN und GROUP BY werden regelmäßig auch DDL/DML-Statements abgefragt – etwa das Anlegen einer Tabelle mit FOREIGN KEY oder ein UPDATE mit Preisberechnung.',
        ],
        paragraphsEn: [
          'Vocational IT specialist exams routinely combine data modeling with practical SQL: you interpret an ER diagram, bring a relation into 3rd Normal Form, and write 3 to 5 SQL statements.',
          'Alongside SELECT queries with JOIN and GROUP BY, DDL and DML tasks frequently appear—such as creating a table with a FOREIGN KEY or writing a conditional UPDATE.',
        ],
      },
      {
        headingDe: 'Punkte sichern durch saubere Struktur',
        headingEn: 'Securing Full Marks Through Clean Structure',
        paragraphsDe: [
          'Schreibe SQL-Schlüsselwörter konsequent groß (SELECT, FROM, WHERE, JOIN, GROUP BY) und rücke jede Klausel auf eine neue Zeile ein. Prüfer erkennen die Logik sofort, selbst wenn ein kleines Detail fehlt.',
          'Achte bei UPDATE- und DELETE-Aufgaben unbedingt auf die WHERE-Bedingung und prüfe, ob Datums- oder Textliterale korrekt in einfachen Anführungszeichen stehen.',
        ],
        paragraphsEn: [
          'Write SQL keywords in uppercase (SELECT, FROM, WHERE, JOIN, GROUP BY) and place each clause on a new line so graders can follow your logic immediately.',
          'For UPDATE and DELETE tasks, always verify your WHERE condition and make sure string and date literals are enclosed in single quotes.',
        ],
      },
      {
        headingDe: 'Typische Stolpersteine in der IHK-Abschlussprüfung',
        headingEn: 'Common Pitfalls in Vocational IT Exams',
        paragraphsDe: [
          'Häufige Punktabzüge entstehen durch vergessene Verknüpfungsbedingungen bei mehreren Tabellen (kartesisches Produkt), fehlende Aliase bei gleichnamigen ID-Spalten sowie durch die Verwechslung von WHERE und HAVING.',
          'Nimm dir am Ende jeder Teilaufgabe dreißig Sekunden Zeit, um das gegebene ER-Modell mit den verwendeten Fremdschlüsseln in deiner Abfrage abzugleichen.',
        ],
        paragraphsEn: [
          'Points are most often lost due to missing join conditions (accidental Cartesian products), unqualified ambiguous id columns, and mixing up WHERE with HAVING.',
          'Spend thirty seconds at the end of each task cross-checking every foreign key in your query against the provided ER diagram.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Typische IHK-Aufgabe: Kundenumsatz und Preisanpassung per UPDATE',
      titleEn: 'Typical exam task: customer revenue report and conditional UPDATE',
      sql: `CREATE TABLE artikel (
  artikel_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(80) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL,
  kategorie VARCHAR(40) NOT NULL
);

INSERT INTO artikel VALUES
  (1, 'Netzwerkkabel 5m', 12.00, 'Netzwerk'),
  (2, 'Switch 8-Port', 45.00, 'Netzwerk'),
  (3, 'Mauspad', 9.00, 'Zubehör');

UPDATE artikel
SET preis = ROUND(preis * 1.10, 2)
WHERE kategorie = 'Netzwerk';

SELECT kategorie, COUNT(*) AS anzahl, SUM(preis) AS summe_listenpreise
FROM artikel
GROUP BY kategorie
ORDER BY summe_listenpreise DESC;`,
    },
    relatedSlugs: [
      'sql-abitur-informatik-typische-aufgaben',
      'sql-alter-table-insert-update-delete',
      'datenbank-normalisierung-1nf-2nf-3nf',
    ],
  },

  // 18. mysql-im-unterricht-ohne-xampp
  {
    slug: 'mysql-im-unterricht-ohne-xampp',
    category: 'abitur_school',
    publishedAt: '2026-10-12',
    readingMinutes: 5,
    titleDe: 'MySQL im Unterricht ohne XAMPP: SQL-Trainer direkt im Browser nutzen',
    titleEn: 'MySQL in the Classroom Without XAMPP: Browser-Based SQL Training',
    descriptionDe:
      'Kein XAMPP-Setup, keine Portkonflikte, keine Adminrechte nötig: So starten Lehrkräfte und Schulklassen in Sekunden mit SQL im Browser.',
    descriptionEn:
      'No XAMPP installation, no port conflicts, no admin rights required: how teachers and classes can start practicing SQL in seconds.',
    keywordsDe: [
      'MySQL ohne XAMPP',
      'SQL im Unterricht',
      'SQL Browser IDE Schule',
      'XAMPP Alternative Schule',
      'SQL Trainer Informatikunterricht',
    ],
    keywordsEn: [
      'MySQL without XAMPP',
      'SQL in the classroom',
      'browser SQL IDE school',
      'XAMPP alternative',
      'teach SQL without setup',
    ],
    sections: [
      {
        headingDe: 'Warum XAMPP im Schulnetz oft Unterrichtszeit kostet',
        headingEn: 'Why Traditional Local Stacks Cost Valuable Class Time',
        paragraphsDe: [
          'Wer schon einmal versucht hat, XAMPP oder einen lokalen MySQL-Server in einem Schul-Computerraum zu betreiben, kennt die Hürden: fehlende Administratorrechte, blockierte Ports (3306), unterschiedliche Versionen auf Schüler-Laptops oder defekte Dienste nach einem Windows-Update.',
          'Statt SQL zu lernen, verbringen Lehrkräfte die ersten zwanzig Minuten oft mit Fehlersuche.',
        ],
        paragraphsEn: [
          'Anyone who has tried running XAMPP or a local MySQL server in a school computer lab knows the friction: missing admin rights, blocked ports, mismatched versions on student laptops, and broken background services.',
          'Instead of learning SQL, classes often lose the first twenty minutes troubleshooting installation issues.',
        ],
      },
      {
        headingDe: 'Sofort startklar dank WebAssembly und fertigen Übungsdatenbanken',
        headingEn: 'Instant Start with WebAssembly and Built-In Practice Schemas',
        paragraphsDe: [
          'SQL-Trainer läuft vollständig im Browser (oder als schlanke Desktop-App) und bringt fertige Beispieldatenbanken wie Schule, Onlineshop und Kino direkt mit. Lernende öffnen die Seite, wählen ein Schema und führen sofort ihre ersten SELECT- oder JOIN-Abfragen aus.',
          'Fortschritte und eigene Datenbankprojekte lassen sich lokal speichern sowie als JSON- oder SQL-Datei exportieren – ideal für Hausaufgaben, Klausurvorbereitung und iPad-/Chromebook-Klassen.',
        ],
        paragraphsEn: [
          'SQL-Trainer runs directly in the browser (or as a lightweight desktop app) and includes ready-made practice databases such as School, Online Shop, and Cinema. Students open the app, pick a schema, and run SELECT or JOIN queries immediately.',
          'Progress and custom database projects are saved locally and can be exported as JSON or SQL files—ideal for homework, exam prep, and Chromebook or tablet classrooms.',
        ],
      },
      {
        headingDe: 'Lernstand teilen ohne Cloud-Konto',
        headingEn: 'Sharing Progress Without a Cloud Account',
        paragraphsDe: [
          'Über den integrierten JSON-Export des Lernstands können Schülerinnen und Schüler ihren Aufgabenfortschritt sichern oder bei Gerätewechseln einfach wieder importieren – ganz ohne Benutzerkonto oder zentrale Datenbank.',
        ],
        paragraphsEn: [
          'With built-in JSON progress export and import, students can back up their completed exercises or transfer progress across school and home devices without needing any cloud account.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Schul-Minidatenbank direkt im Browser anlegen und abfragen',
      titleEn: 'Create and query a mini school database directly in the browser',
      sql: `CREATE TABLE klassen (
  klasse_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(10) NOT NULL,
  raum VARCHAR(20) NOT NULL
);

CREATE TABLE schueler (
  id INTEGER PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  klasse_id INTEGER NOT NULL,
  FOREIGN KEY (klasse_id) REFERENCES klassen(klasse_id)
);

INSERT INTO klassen VALUES (1, '12a', 'R204'), (2, '12b', 'R208');
INSERT INTO schueler VALUES (1, 'Hannah', 1), (2, 'Jonas', 1), (3, 'Lea', 2);

SELECT k.bezeichnung AS klasse, k.raum, COUNT(s.id) AS anzahl_schueler
FROM klassen AS k
LEFT JOIN schueler AS s ON k.klasse_id = s.klasse_id
GROUP BY k.klasse_id, k.bezeichnung, k.raum;`,
    },
    relatedSlugs: [
      'sql-abitur-informatik-typische-aufgaben',
      'warum-sql-trainer-open-source-lokal',
      'wie-sql-trainer-gecodet-ist-sqljs-wasm',
    ],
  },

  // 19. warum-sql-trainer-open-source-lokal
  {
    slug: 'warum-sql-trainer-open-source-lokal',
    category: 'opensource_tech',
    publishedAt: '2026-10-14',
    readingMinutes: 5,
    titleDe: 'Warum SQL-Trainer Open Source ist und komplett lokal im Browser läuft',
    titleEn: 'Why SQL-Trainer Is Open Source and Runs 100% Locally in Your Browser',
    descriptionDe:
      'Kein Login, keine Cloud-Datenbank, voller Einblick in den Quellcode: Die Architekturprinzipien hinter SQL-Trainer für Schulen, Unis und Selbstlerner.',
    descriptionEn:
      'No sign-up, no remote database server, full source transparency: the design principles behind SQL-Trainer for schools and self-learners.',
    keywordsDe: [
      'SQL Trainer Open Source',
      'lokale SQL App',
      'SQL ohne Login lernen',
      'Open Source Lernsoftware',
      'Local-First SQL',
    ],
    keywordsEn: [
      'SQL Trainer open source',
      'local-first SQL app',
      'learn SQL without signup',
      'open source education tool',
      'browser SQL sandbox',
    ],
    sections: [
      {
        headingDe: 'Lernen ohne Account-Zwang und Server-Latenz',
        headingEn: 'Learning Without Accounts or Server Latency',
        paragraphsDe: [
          'Viele Online-Lernplattformen verlangen eine Registrierung, bevor man auch nur eine einzige Zeile SQL ausprobieren darf, und senden jede Abfrage über das Internet an einen zentralen Server. Für Schulen ist das aus Datenschutzgründen problematisch – und im Unterricht langsam.',
          'SQL-Trainer verfolgt konsequent den Local-First-Ansatz: Die gesamte SQL-Engine läuft direkt auf deinem Gerät. Abfragen werden in wenigen Millisekunden ausgeführt, funktionieren auch offline und hinterlassen keine Nutzerdaten auf fremden Servern.',
        ],
        paragraphsEn: [
          'Many online learning platforms require an account before you can run a single SQL query and send every statement over the network to a backend server. That creates privacy hurdles for schools and adds unnecessary latency.',
          'SQL-Trainer follows a strict local-first approach: the entire SQL engine runs on your own device. Queries execute in milliseconds, work offline, and never send your SQL scripts to external servers.',
        ],
      },
      {
        headingDe: 'Offener Quellcode für Transparenz und Weiterentwicklung',
        headingEn: 'Open Source for Transparency and Community Contribution',
        paragraphsDe: [
          'Gerade im Bildungsbereich sollten Werkzeuge überprüfbar sein. Weil SQL-Trainer Open Source ist, können Lehrkräfte, Studierende und Entwickler genau nachvollziehen, wie Aufgaben bewertet werden, eigene Übungsdatenbanken beisteuern oder die App selbst hosten.',
        ],
        paragraphsEn: [
          'Educational tools should be inspectable. Because SQL-Trainer is open source, teachers, students, and developers can inspect how tasks are graded, contribute new practice schemas, or self-host the entire application.',
        ],
      },
      {
        headingDe: 'Web-App und Desktop-App aus einer gemeinsamen Codebasis',
        headingEn: 'Web App and Desktop App from One Shared Codebase',
        paragraphsDe: [
          'Neben der Browser-Version existiert eine schlanke Desktop-Variante auf Basis von Tauri v2 für macOS, Windows und Linux. Beide Varianten teilen sich exakt dieselbe SQL-Engine, dieselben Aufgaben und dieselben Exportformate.',
        ],
        paragraphsEn: [
          'Alongside the web version, SQL-Trainer ships as a lightweight Tauri v2 desktop app for macOS, Windows, and Linux—sharing the exact same SQL engine, exercises, and export formats.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Lokale Projekt-Notizen als eigenständige In-Memory-Tabelle testen',
      titleEn: 'Test local project notes as a standalone in-memory table',
      sql: `CREATE TABLE notizen (
  id INTEGER PRIMARY KEY,
  titel VARCHAR(80) NOT NULL,
  erstellt_am DATE NOT NULL
);

INSERT INTO notizen VALUES
  (1, 'Local-First Prinzip', '2026-10-14'),
  (2, 'Offline-Fähigkeit testen', '2026-10-15');

SELECT id, titel, erstellt_am
FROM notizen
ORDER BY erstellt_am DESC;`,
    },
    relatedSlugs: [
      'wie-sql-trainer-gecodet-ist-sqljs-wasm',
      'datenschutz-ohne-cookies-umami-lokal',
      'mysql-im-unterricht-ohne-xampp',
    ],
  },

  // 20. wie-sql-trainer-gecodet-ist-sqljs-wasm
  {
    slug: 'wie-sql-trainer-gecodet-ist-sqljs-wasm',
    category: 'opensource_tech',
    publishedAt: '2026-10-16',
    readingMinutes: 7,
    titleDe: 'Hinter den Kulissen: Wie SQL-Trainer mit sql.js und WebAssembly funktioniert',
    titleEn: 'Under the Hood: How SQL-Trainer Works with sql.js and WebAssembly',
    descriptionDe:
      'Ein technischer Blick in die Architektur von SQL-Trainer: React, TypeScript, CodeMirror 6, IndexedDB-Persistenz und eine echte SQLite-Engine in WebAssembly.',
    descriptionEn:
      'A technical look inside SQL-Trainer: React, TypeScript, CodeMirror 6, IndexedDB persistence, and a real SQLite engine compiled to WebAssembly.',
    keywordsDe: [
      'sql.js WebAssembly',
      'SQLite im Browser',
      'SQL-Trainer Architektur',
      'TypeScript SQL Engine',
      'WebAssembly Datenbank',
    ],
    keywordsEn: [
      'sql.js WebAssembly',
      'SQLite in the browser',
      'SQL-Trainer architecture',
      'TypeScript SQL engine',
      'WASM database',
    ],
    sections: [
      {
        headingDe: 'Echte SQL-Engine statt Regex-Simulation',
        headingEn: 'A Real SQL Engine Instead of Regex Simulation',
        paragraphsDe: [
          'Manche Lernseiten simulieren SQL lediglich mit vereinfachtem JavaScript. Das scheitert spätestens bei korrelierten Unterabfragen, Fremdschlüssel-Constraints oder komplexen JOINs. SQL-Trainer nutzt stattdessen sql.js – das echte, in C geschriebene SQLite, kompiliert zu WebAssembly (WASM).',
          'Beim Start lädt die Klasse SqlEngine das WASM-Binary, aktiviert standardmäßig PRAGMA foreign_keys = ON und erzeugt eine vollständige relationale Datenbank direkt im Arbeitsspeicher des Browsers.',
        ],
        paragraphsEn: [
          'Some tutorials fake SQL with simplified JavaScript parsers, which breaks down on correlated subqueries, foreign key constraints, or multi-table joins. SQL-Trainer uses sql.js—real C-based SQLite compiled to WebAssembly (WASM).',
          'On initialization, the SqlEngine class loads the WASM binary, enables PRAGMA foreign_keys = ON, and creates a full relational database right inside browser memory.',
        ],
      },
      {
        headingDe: 'Saubere Trennung zwischen Engine, Grader und UI',
        headingEn: 'Clean Separation Between Engine, Grader, and UI',
        paragraphsDe: [
          'Die Codebasis trennt strikt zwischen der SQL-Ausführung (src/engine/sqlEngine.ts), dem Aufgaben-Grader (taskGrader.ts) und der React-Oberfläche. Jede Übungsaufgabe wird gegen eine echte Referenzlösung in einer isolierten Datenbankinstanz geprüft – so werden auch alternative, aber semantisch gleichwertige Schülerlösungen korrekt anerkannt.',
        ],
        paragraphsEn: [
          'The codebase cleanly separates SQL execution (src/engine/sqlEngine.ts), the task grader (taskGrader.ts), and the React UI. Every exercise is evaluated against a reference solution in an isolated database instance, so alternative but semantically equivalent student queries are graded accurately.',
        ],
      },
      {
        headingDe: 'Visueller ER-Designer und Live-Schema-Explorer',
        headingEn: 'Visual ER Designer and Live Schema Explorer',
        paragraphsDe: [
          'Nach jeder DDL-Anweisung (CREATE TABLE, ALTER TABLE) liest SqlEngine die aktualisierten Metadaten über PRAGMA table_info und PRAGMA foreign_key_list aus. Dadurch aktualisieren sich der Schema-Explorer und die SQL-Autovervollständigung in CodeMirror 6 in Echtzeit.',
        ],
        paragraphsEn: [
          'After every DDL statement (CREATE TABLE, ALTER TABLE), SqlEngine inspects updated table metadata via PRAGMA table_info and PRAGMA foreign_key_list, keeping both the schema explorer and CodeMirror 6 autocomplete in sync in real time.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Fremdschlüssel-Integrität und Transaktionen in sql.js prüfen',
      titleEn: 'Verify foreign key integrity and transactions in sql.js',
      sql: `CREATE TABLE eltern (
  id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(50) NOT NULL
);

CREATE TABLE kinder (
  id INTEGER PRIMARY KEY,
  eltern_id INTEGER NOT NULL,
  wert VARCHAR(50) NOT NULL,
  FOREIGN KEY (eltern_id) REFERENCES eltern(id)
);

INSERT INTO eltern VALUES (1, 'Gruppe A');
INSERT INTO kinder VALUES (10, 1, 'Eintrag 1'), (11, 1, 'Eintrag 2');

SELECT e.bezeichnung, COUNT(k.id) AS anzahl_kinder
FROM eltern AS e
INNER JOIN kinder AS k ON e.id = k.eltern_id
GROUP BY e.id, e.bezeichnung;`,
    },
    relatedSlugs: [
      'mysql-kompatibilitaet-auf-sqlite-wasm',
      'warum-sql-trainer-open-source-lokal',
      'indexeddb-sqlite-persistenz-im-browser',
    ],
  },

  // 21. mysql-kompatibilitaet-auf-sqlite-wasm
  {
    slug: 'mysql-kompatibilitaet-auf-sqlite-wasm',
    category: 'opensource_tech',
    publishedAt: '2026-10-18',
    readingMinutes: 7,
    titleDe: 'MySQL-Kompatibilität auf SQLite WASM: Wie SQL-Trainer Dialekte übersetzt',
    titleEn: 'MySQL Compatibility on SQLite WASM: How SQL-Trainer Bridges Dialects',
    descriptionDe:
      'AUTO_INCREMENT, YEAR(), CONCAT(), SHOW TABLES und DATEDIFF() direkt auf SQLite WASM: So macht mysqlCompat.ts den Browser MySQL-freundlich.',
    descriptionEn:
      'AUTO_INCREMENT, YEAR(), CONCAT(), SHOW TABLES, and DATEDIFF() running on SQLite WASM: how mysqlCompat.ts makes browser SQL MySQL-friendly.',
    keywordsDe: [
      'MySQL auf SQLite',
      'mysqlCompat.ts',
      'AUTO_INCREMENT SQLite',
      'MySQL Dialekt Browser',
      'SQL Dialekt Übersetzung',
    ],
    keywordsEn: [
      'MySQL on SQLite',
      'mysqlCompat',
      'AUTO_INCREMENT in SQLite',
      'MySQL dialect in browser',
      'SQL dialect translation',
    ],
    sections: [
      {
        headingDe: 'Warum der MySQL-Modus in der Schule so wichtig ist',
        headingEn: 'Why MySQL Mode Matters in Schools and Exams',
        paragraphsDe: [
          'In deutschen Schulen, Lehrbüchern und IHK-Prüfungen wird überwiegend MySQL-Syntax unterrichtet: Lernende schreiben AUTO_INCREMENT, CONCAT(vorname, \' \', nachname), YEAR(geburtsdatum) oder SHOW TABLES. Reines SQLite kennt diese Konstrukte von Haus aus nicht.',
          'Deshalb besitzt SQL-Trainer eine eigene Kompatibilitätsschicht in src/engine/mysqlCompat.ts, die sowohl auf Syntaxebene als auch auf Funktionsebene vermittelt.',
        ],
        paragraphsEn: [
          'Schools, textbooks, and vocational exams widely teach MySQL syntax: students write AUTO_INCREMENT, CONCAT(first_name, \' \', last_name), YEAR(birth_date), or SHOW TABLES. Plain SQLite does not support those out of the box.',
          'To bridge that gap, SQL-Trainer includes a dedicated compatibility layer in src/engine/mysqlCompat.ts handling both syntax preprocessing and custom SQL functions.',
        ],
      },
      {
        headingDe: 'Query-Preprocessing und registrierte MySQL-Funktionen',
        headingEn: 'Query Preprocessing and Registered MySQL Functions',
        paragraphsDe: [
          'Vor der Ausführung wandelt preprocessMySqlQuery() typische MySQL-Anweisungen wie SHOW TABLES, DESCRIBE tabelle oder AUTO_INCREMENT in gültiges SQLite um. Gleichzeitig registriert registerMySqlFunctions() Funktionen wie CONCAT, YEAR, MONTH, DAY, NOW, CURDATE, DATEDIFF und IF direkt in der SQLite-WASM-Instanz.',
          'Wer dagegen exakt nach reinem SQLite-Standard arbeiten möchte, kann jederzeit mit einem Klick zwischen dem MySQL- und dem SQLite-Dialekt umschalten.',
        ],
        paragraphsEn: [
          'Before execution, preprocessMySqlQuery() translates common MySQL constructs such as SHOW TABLES, DESCRIBE table, and AUTO_INCREMENT into valid SQLite. At the same time, registerMySqlFunctions() registers CONCAT, YEAR, MONTH, DAY, NOW, CURDATE, DATEDIFF, and IF directly on the SQLite WASM database.',
          'If you ever want strict SQLite behavior, you can switch between MySQL and SQLite dialect modes with a single click.',
        ],
      },
      {
        headingDe: 'Typische Stolpersteine beim Dialektwechsel vermeiden',
        headingEn: 'Avoiding Common Pitfalls When Switching Dialects',
        paragraphsDe: [
          'Achte bei eigenen Skripten darauf, String-Literale stets in einfache Anführungszeichen zu setzen und Standardtypen wie INTEGER, VARCHAR, DECIMAL oder DATE zu verwenden. So laufen deine Abfragen sowohl im MySQL- als auch im SQLite-Modus ohne Anpassung.',
        ],
        paragraphsEn: [
          'When writing portable scripts, always enclose string literals in single quotes and stick to standard types like INTEGER, VARCHAR, DECIMAL, and DATE so your queries run identically in both MySQL and SQLite modes.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'MySQL-kompatible Funktionen wie CONCAT und YEAR direkt testen',
      titleEn: 'Test MySQL-compatible functions like CONCAT and YEAR directly',
      sql: `CREATE TABLE mitglieder (
  id INTEGER PRIMARY KEY,
  vorname VARCHAR(50) NOT NULL,
  nachname VARCHAR(50) NOT NULL,
  beitritt DATE NOT NULL
);

INSERT INTO mitglieder VALUES
  (1, 'Lukas', 'Müller', '2024-03-15'),
  (2, 'Mia', 'Schmidt', '2025-09-01');

SELECT CONCAT(vorname, ' ', nachname) AS vollname,
       YEAR(beitritt) AS beitrittsjahr
FROM mitglieder
ORDER BY beitrittsjahr ASC;`,
    },
    relatedSlugs: [
      'wie-sql-trainer-gecodet-ist-sqljs-wasm',
      'mysql-vs-sqlite-unterschiede-schule',
      'sql-datumsfunktionen-year-month-day',
    ],
  },

  // 22. datenschutz-ohne-cookies-umami-lokal
  {
    slug: 'datenschutz-ohne-cookies-umami-lokal',
    category: 'opensource_tech',
    publishedAt: '2026-10-20',
    readingMinutes: 5,
    titleDe: 'Datenschutz ohne Cookies: Warum SQL-Trainer auf Tracking-Cookies verzichtet',
    titleEn: 'Privacy Without Cookies: Why SQL-Trainer Avoids Tracking Cookies',
    descriptionDe:
      'DSGVO-freundlich ohne Cookie-Banner: Wie SQL-Trainer lokale Daten im Browser behält und datensparsame, cookielose Nutzungsstatistiken einsetzt.',
    descriptionEn:
      'GDPR-friendly without intrusive cookie banners: how SQL-Trainer keeps user data local and uses privacy-preserving, cookieless analytics.',
    keywordsDe: [
      'Datenschutz ohne Cookies',
      'DSGVO Lernplattform',
      'Umami Analytics DSGVO',
      'cookielose Statistik',
      'Schulsoftware Datenschutz',
    ],
    keywordsEn: [
      'privacy without cookies',
      'GDPR compliant learning app',
      'cookieless analytics',
      'Umami privacy',
      'no cookie banner',
    ],
    sections: [
      {
        headingDe: 'Keine Nutzerprofile, keine Werbe-Tracker, kein Cookie-Banner',
        headingEn: 'No User Profiles, No Ad Trackers, No Cookie Banners',
        paragraphsDe: [
          'Gerade im schulischen Umfeld ist Datenschutz kein optionales Extra, sondern Grundvoraussetzung. SQL-Trainer verzichtet vollständig auf Werbe-Cookies, Cross-Site-Tracking und personenbezogene Nutzerkonten.',
          'Alle deine SQL-Skripte, selbst erstellten Tabellen und dein Aufgaben-Fortschritt bleiben ausschließlich lokal in deinem eigenen Browser (IndexedDB / LocalStorage) gespeichert.',
        ],
        paragraphsEn: [
          'In classrooms and universities, data privacy is a baseline requirement rather than an afterthought. SQL-Trainer avoids advertising cookies, cross-site trackers, and personal user accounts completely.',
          'All of your SQL scripts, custom tables, and task progress stay strictly on your own device in local browser storage.',
        ],
      },
      {
        headingDe: 'Datensparsame Reichweitenmessung mit selbst gehostetem Umami',
        headingEn: 'Privacy-Friendly Metrics with Self-Hosted Umami',
        paragraphsDe: [
          'Um lediglich zu verstehen, welche Tutorials oder Lernpfade besonders hilfreich sind, setzt die Web-Version auf eine datensparsame, cookielose Auswertung ohne Speicherung von IP-Adressen oder geräteübergreifender Identifikatoren.',
          'So bleibt das Lernen ruhig, ablenkungsfrei und vollständig konform mit strengen Datenschutzvorgaben.',
        ],
        paragraphsEn: [
          'To understand which tutorials and learning paths are most useful, the web edition relies on minimal, cookieless aggregate metrics without storing IP addresses or cross-site identifiers.',
          'The result is a calm, distraction-free learning environment that respects strict privacy standards.',
        ],
      },
      {
        headingDe: 'Volle Kontrolle über Export und Löschung lokaler Daten',
        headingEn: 'Full Control Over Exporting and Clearing Local Data',
        paragraphsDe: [
          'Da keine Daten auf fremde Server hochgeladen werden, kannst du deine Datenbanken jederzeit als .sql- oder .sqlite-Datei sichern oder mit einem Klick vollständig aus dem Browser-Speicher entfernen.',
        ],
        paragraphsEn: [
          'Because nothing is uploaded to third-party servers, you can export your databases as .sql or .sqlite files at any time or wipe them completely from local browser storage in one click.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Beispiel für datensparsame, aggregierte Ereigniszählung in SQL',
      titleEn: 'Example of privacy-friendly aggregated event counting in SQL',
      sql: `CREATE TABLE seitenaufrufe_aggregiert (
  tag DATE NOT NULL,
  seite VARCHAR(100) NOT NULL,
  aufrufe INTEGER NOT NULL,
  PRIMARY KEY (tag, seite)
);

INSERT INTO seitenaufrufe_aggregiert VALUES
  ('2026-10-20', '/app', 142),
  ('2026-10-20', '/sql-joins-lernen', 87),
  ('2026-10-21', '/app', 165);

SELECT seite, SUM(aufrufe) AS gesamt_aufrufe
FROM seitenaufrufe_aggregiert
GROUP BY seite
ORDER BY gesamt_aufrufe DESC;`,
    },
    relatedSlugs: [
      'warum-sql-trainer-open-source-lokal',
      'indexeddb-sqlite-persistenz-im-browser',
      'mysql-im-unterricht-ohne-xampp',
    ],
  },
];


