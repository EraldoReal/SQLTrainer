import type { BlogPost } from '@/types/blog';

export const BLOG_POSTS_PART2: BlogPost[] = [
  {
    slug: 'datenbank-vorlage-bibliothek',
    category: 'templates',
    publishedAt: '2026-10-15',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Bibliothek & Buchverleih (SQL-Schema & Abfragen)',
    titleEn: 'Database Template: Library & Book Lending (SQL Schema & Queries)',
    descriptionDe:
      'Fertige SQL-Datenbankvorlage für eine Bibliothek mit Büchern, Mitgliedern und Ausleihen. Ideal zum Üben von n:m-Beziehungen, Fremdschlüsseln und JOINs.',
    descriptionEn:
      'Ready-to-use SQL database template for a library with books, members, and loans. Ideal for practicing many-to-many relationships, foreign keys, and JOINs.',
    keywordsDe: ['Datenbank Vorlage Bibliothek', 'SQL Bibliothek Schema', 'Buchverleih SQL', 'n:m Beziehung SQL'],
    keywordsEn: ['library database template', 'SQL library schema', 'book lending SQL', 'many-to-many SQL'],
    sections: [
      {
        headingDe: 'Aufbau des Bibliotheks-Schemas',
        headingEn: 'Structure of the Library Schema',
        paragraphsDe: [
          'Eine klassische Bibliotheksdatenbank gehört zu den beliebtesten Übungsprojekten im Informatikunterricht und im Studium. Sie verbindet Stammdaten wie Bücher und Mitglieder über eine Bewegungstabelle für Ausleihen.',
          'In dieser Vorlage trennen wir sauber zwischen buecher, mitglieder und ausleihen. Dadurch kann ein Mitglied mehrere Bücher ausleihen und jedes Buch über die Zeit an verschiedene Personen verliehen werden.',
        ],
        paragraphsEn: [
          'A classic library database is one of the most popular practice projects in computer science classes and university courses. It connects master data such as books and members via a transactional loans table.',
          'In this template, we cleanly separate buecher (books), mitglieder (members), and ausleihen (loans). This allows a member to borrow multiple books and each book to be lent to different people over time.',
        ],
      },
      {
        headingDe: 'Wichtige Beziehungen und Constraints',
        headingEn: 'Key Relationships and Constraints',
        paragraphsDe: [
          'Die Tabelle ausleihen enthält zwei Fremdschlüssel: buch_id verweist auf buecher(id) und mitglied_id auf mitglieder(id). Das Attribut rueckgabe_datum bleibt NULL, solange das Buch noch nicht zurückgegeben wurde.',
          'Über einen UNIQUE-Constraint auf die ISBN stellen wir sicher, dass kein Buchtitel doppelt mit derselben ISBN angelegt wird. Mit CHECK (bestand >= 0) verhindern wir negative Exemplarzahlen.',
        ],
        paragraphsEn: [
          'The ausleihen table contains two foreign keys: buch_id references buecher(id) and mitglied_id references mitglieder(id). The rueckgabe_datum column remains NULL as long as the book has not been returned.',
          'A UNIQUE constraint on the ISBN ensures that no duplicate book entries share the same ISBN. Using CHECK (bestand >= 0) prevents negative stock counts.',
        ],
      },
      {
        headingDe: 'Typische Praxis-Abfragen',
        headingEn: 'Typical Practical Queries',
        paragraphsDe: [
          'Mit einem LEFT JOIN oder INNER JOIN lassen sich offene Ausleihen (WHERE rueckgabe_datum IS NULL) sofort auflisten. Ebenso kannst du per GROUP BY ermitteln, welche Genres oder Autorinnen am häufigsten ausgeliehen werden.',
        ],
        paragraphsEn: [
          'Using an INNER JOIN or LEFT JOIN, open loans (WHERE rueckgabe_datum IS NULL) can be listed immediately. You can also use GROUP BY to determine which genres or authors are borrowed most frequently.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Bibliothek-Datenbank (Schema, Testdaten & Abfragen)',
      titleEn: 'Library Database (Schema, Sample Data & Queries)',
      isDatabaseTemplate: true,
      suggestedDbName: 'bibliothek',
      sql: `CREATE TABLE buecher (
  id INT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  titel VARCHAR(150) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  erscheinungsjahr INT NOT NULL,
  bestand INT NOT NULL CHECK (bestand >= 0)
);

CREATE TABLE mitglieder (
  id INT PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  beitrittsdatum DATE NOT NULL
);

CREATE TABLE ausleihen (
  id INT PRIMARY KEY,
  buch_id INT NOT NULL,
  mitglied_id INT NOT NULL,
  ausleih_datum DATE NOT NULL,
  faellig_datum DATE NOT NULL,
  rueckgabe_datum DATE,
  FOREIGN KEY (buch_id) REFERENCES buecher(id),
  FOREIGN KEY (mitglied_id) REFERENCES mitglieder(id)
);

INSERT INTO buecher VALUES
  (1, '978-3-551-55167-2', 'Harry Potter und der Stein der Weisen', 'J.K. Rowling', 'Fantasy', 1998, 4),
  (2, '978-3-423-21412-4', 'Clean Code', 'Robert C. Martin', 'Informatik', 2008, 2),
  (3, '978-3-499-22761-5', 'Der Alchimist', 'Paulo Coelho', 'Roman', 1996, 3),
  (4, '978-3-446-46350-9', 'Datenbanksysteme', 'Alfons Kemper', 'Informatik', 2021, 5);

INSERT INTO mitglieder VALUES
  (1, 'Lea', 'Hoffmann', 'lea.hoffmann@example.de', '2025-01-12'),
  (2, 'Jonas', 'Weber', 'jonas.weber@example.de', '2025-03-04'),
  (3, 'Mia', 'Schulz', 'mia.schulz@example.de', '2025-06-19');

INSERT INTO ausleihen VALUES
  (1, 1, 1, '2026-10-01', '2026-10-15', '2026-10-12'),
  (2, 2, 2, '2026-10-10', '2026-10-24', NULL),
  (3, 4, 1, '2026-10-14', '2026-10-28', NULL),
  (4, 3, 3, '2026-10-18', '2026-11-01', NULL);

SELECT m.vorname, m.nachname, b.titel, a.ausleih_datum, a.faellig_datum
FROM ausleihen a
JOIN mitglieder m ON a.mitglied_id = m.id
JOIN buecher b ON a.buch_id = b.id
WHERE a.rueckgabe_datum IS NULL
ORDER BY a.faellig_datum;`,
    },
    relatedSlugs: [
      'sql-constraints-not-null-unique-check',
      'datenbank-vorlage-stundenplan-schule',
      'sql-datumsfunktionen-year-month-day',
    ],
  },
  {
    slug: 'datenbank-vorlage-fussballverein',
    category: 'templates',
    publishedAt: '2026-10-16',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Fußballverein & Liga-Spielplan in SQL',
    titleEn: 'Database Template: Football Club & League Schedule in SQL',
    descriptionDe:
      'SQL-Vorlage für einen Fußballverein mit Teams, Spielern und Spielergebnissen. Perfekt für Aggregationen, Torverhältnisse und Tabellenberechnungen.',
    descriptionEn:
      'SQL template for a football club with teams, players, and match results. Perfect for aggregations, goal differences, and league standings.',
    keywordsDe: ['Datenbank Vorlage Fußball', 'SQL Bundesliga Tabelle', 'Sportverein Datenbank', 'SQL CASE WHEN'],
    keywordsEn: ['football database template', 'SQL league table', 'sports club database', 'SQL match results'],
    sections: [
      {
        headingDe: 'Teams, Spieler und Spiele modellieren',
        headingEn: 'Modeling Teams, Players, and Matches',
        paragraphsDe: [
          'Sportdatenbanken eignen sich hervorragend, um SQL-Abfragen mit Praxisbezug zu lernen. Jeder Verein bzw. jedes Team hat mehrere Spieler, während in der Tabelle spiele jeweils ein Heimteam und ein Auswärtsteam aufeinandertreffen.',
          'Die doppelte Fremdschlüsselbeziehung von spiele auf teams (heim_team_id und gast_team_id) ist ein klassisches Beispiel dafür, wie man Tabellen mit Aliasen mehrfach in einem JOIN einbindet.',
        ],
        paragraphsEn: [
          'Sports databases are an engaging way to learn practical SQL queries. Each team has multiple players, while the spiele (matches) table pairs a home team and an away team.',
          'The dual foreign key relationship from spiele to teams (heim_team_id and gast_team_id) is a classic example of joining the same table twice using table aliases.',
        ],
      },
      {
        headingDe: 'Tore, Punkte und Kaderstatistik auswerten',
        headingEn: 'Analyzing Goals, Points, and Squad Stats',
        paragraphsDe: [
          'Mit SUM, COUNT und CASE WHEN kannst du direkt in SQL aus den Spielergebnissen Siege, Unentschieden und Punkte berechnen oder den Toptorschützen der Liga ermitteln.',
        ],
        paragraphsEn: [
          'Using SUM, COUNT, and CASE WHEN, you can calculate wins, draws, and points directly from match results in SQL or find the league top scorer.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Fußballverein-Datenbank (Teams, Spieler & Spiele)',
      titleEn: 'Football Club Database (Teams, Players & Matches)',
      isDatabaseTemplate: true,
      suggestedDbName: 'fussballverein',
      sql: `CREATE TABLE teams (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  stadt VARCHAR(80) NOT NULL,
  gruendungsjahr INT NOT NULL
);

CREATE TABLE spieler (
  id INT PRIMARY KEY,
  team_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(30) NOT NULL,
  trikotnummer INT NOT NULL,
  tore INT NOT NULL DEFAULT 0,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE spiele (
  id INT PRIMARY KEY,
  spieltag INT NOT NULL,
  heim_team_id INT NOT NULL,
  gast_team_id INT NOT NULL,
  heim_tore INT NOT NULL CHECK (heim_tore >= 0),
  gast_tore INT NOT NULL CHECK (gast_tore >= 0),
  spieldatum DATE NOT NULL,
  FOREIGN KEY (heim_team_id) REFERENCES teams(id),
  FOREIGN KEY (gast_team_id) REFERENCES teams(id)
);

INSERT INTO teams VALUES
  (1, 'FC Adler Nord', 'Hamburg', 1924),
  (2, 'SV Rot-Weiß Süd', 'München', 1952),
  (3, 'Borussia Mitte', 'Dortmund', 1919);

INSERT INTO spieler VALUES
  (1, 1, 'Lukas Brandt', 'Sturm', 9, 7),
  (2, 1, 'Tim Becker', 'Mittelfeld', 8, 3),
  (3, 2, 'Marco Rossi', 'Sturm', 11, 6),
  (4, 3, 'Janek Kowalski', 'Torwart', 1, 0),
  (5, 3, 'Noah Richter', 'Sturm', 10, 5);

INSERT INTO spiele VALUES
  (1, 1, 1, 2, 2, 1, '2026-09-12'),
  (2, 2, 2, 3, 3, 3, '2026-09-19'),
  (3, 3, 3, 1, 1, 2, '2026-09-26');

SELECT s.spieltag,
       h.name AS heimteam,
       g.name AS gastteam,
       CONCAT(s.heim_tore, ':', s.gast_tore) AS ergebnis
FROM spiele s
JOIN teams h ON s.heim_team_id = h.id
JOIN teams g ON s.gast_team_id = g.id
ORDER BY s.spieltag;`,
    },
    relatedSlugs: [
      'sql-case-when-bedingungen',
      'datenbank-vorlage-fitnessstudio',
      'sql-stringfunktionen-concat-substring',
    ],
  },
  {
    slug: 'datenbank-vorlage-krankenhaus',
    category: 'templates',
    publishedAt: '2026-10-17',
    readingMinutes: 7,
    titleDe: 'Datenbank-Vorlage: Krankenhaus, Patienten & Behandlungen (SQL)',
    titleEn: 'Database Template: Hospital, Patients & Treatments (SQL)',
    descriptionDe:
      'Strukturierte SQL-Datenbankvorlage für ein Krankenhaus mit Stationen, Ärztinnen, Patienten und Terminen. Ideal für 1:n- und n:m-Modellierung.',
    descriptionEn:
      'Structured SQL database template for a hospital with wards, doctors, patients, and appointments. Ideal for 1:n and n:m modeling.',
    keywordsDe: ['Datenbank Vorlage Krankenhaus', 'Patientenverwaltung SQL', 'Klinik Datenbank ER Modell'],
    keywordsEn: ['hospital database template', 'patient management SQL', 'clinic database schema'],
    sections: [
      {
        headingDe: 'Klinische Daten sauber strukturieren',
        headingEn: 'Structuring Clinical Data Cleanly',
        paragraphsDe: [
          'Im Gesundheitswesen müssen Stammdaten wie Stationen, behandelnde Ärztinnen und Patienten eindeutig voneinander getrennt werden. So bleiben Änderungen an einer Station oder Telefonnummer konsistent an genau einer Stelle.',
          'Die Tabelle behandlungen verknüpft Patientinnen und Ärzte mit Diagnose, Datum und Behandlungskosten.',
        ],
        paragraphsEn: [
          'In healthcare, master data such as wards, doctors, and patients must be cleanly separated. That way, updates to a ward or phone number remain consistent in a single place.',
          'The behandlungen (treatments) table links patients and doctors together with diagnosis, date, and treatment costs.',
        ],
      },
      {
        headingDe: 'Auswertungen für den Klinikalltag',
        headingEn: 'Analytics for Daily Clinic Operations',
        paragraphsDe: [
          'Mit GROUP BY nach Fachbereich oder Station lässt sich schnell auswerten, wie viele Behandlungen durchgeführt wurden und wie hoch die durchschnittlichen Kosten je Fachrichtung sind.',
        ],
        paragraphsEn: [
          'Using GROUP BY on department or ward, you can quickly analyze how many treatments were performed and what the average cost per specialty is.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Krankenhaus-Datenbank (Ärzte, Patienten & Behandlungen)',
      titleEn: 'Hospital Database (Doctors, Patients & Treatments)',
      isDatabaseTemplate: true,
      suggestedDbName: 'krankenhaus',
      sql: `CREATE TABLE stationen (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  etage INT NOT NULL,
  betten_anzahl INT NOT NULL CHECK (betten_anzahl > 0)
);

CREATE TABLE aerzte (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fachbereich VARCHAR(80) NOT NULL,
  station_id INT NOT NULL,
  FOREIGN KEY (station_id) REFERENCES stationen(id)
);

CREATE TABLE patienten (
  id INT PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  geburtsdatum DATE NOT NULL,
  krankenkasse VARCHAR(80) NOT NULL
);

CREATE TABLE behandlungen (
  id INT PRIMARY KEY,
  patient_id INT NOT NULL,
  arzt_id INT NOT NULL,
  datum DATE NOT NULL,
  diagnose VARCHAR(150) NOT NULL,
  kosten DECIMAL(10, 2) NOT NULL CHECK (kosten >= 0),
  FOREIGN KEY (patient_id) REFERENCES patienten(id),
  FOREIGN KEY (arzt_id) REFERENCES aerzte(id)
);

INSERT INTO stationen VALUES
  (1, 'Kardiologie', 2, 24),
  (2, 'Orthopädie', 3, 18),
  (3, 'Notaufnahme', 1, 12);

INSERT INTO aerzte VALUES
  (1, 'Dr. Hannah Klein', 'Kardiologie', 1),
  (2, 'Dr. Lukas Berger', 'Orthopädie', 2),
  (3, 'Dr. Sofia Demir', 'Allgemeinmedizin', 3);

INSERT INTO patienten VALUES
  (1, 'Paul', 'Wagner', '1984-05-14', 'TK'),
  (2, 'Elena', 'Fischer', '1992-11-03', 'AOK'),
  (3, 'Karl', 'Neumann', '1968-02-22', 'Barmer');

INSERT INTO behandlungen VALUES
  (1, 1, 1, '2026-10-02', 'EKG-Kontrolle', 145.00),
  (2, 2, 2, '2026-10-05', 'Knie-Ultraschall', 210.50),
  (3, 3, 1, '2026-10-09', 'Belastungstest', 180.00),
  (4, 1, 3, '2026-10-12', 'Blutbild & Check-up', 95.00);

SELECT a.fachbereich,
       COUNT(b.id) AS anzahl_behandlungen,
       ROUND(AVG(b.kosten), 2) AS durchschnittskosten
FROM behandlungen b
JOIN aerzte a ON b.arzt_id = a.id
GROUP BY a.fachbereich
ORDER BY anzahl_behandlungen DESC;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-bibliothek',
      'sql-views-virtuelle-tabellen',
      'sql-constraints-not-null-unique-check',
    ],
  },
  {
    slug: 'datenbank-vorlage-musik-streaming',
    category: 'templates',
    publishedAt: '2026-10-18',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Musik-Streaming-Dienst (Künstler, Alben & Playlists)',
    titleEn: 'Database Template: Music Streaming Service (Artists, Albums & Playlists)',
    descriptionDe:
      'SQL-Datenbankvorlage wie Spotify: Künstler, Alben, Songs, Playlists und Hörerhistorie. Ideal für n:m-Tabellen und Top-Charts-Abfragen.',
    descriptionEn:
      'SQL database template like Spotify: artists, albums, tracks, playlists, and listening history. Ideal for junction tables and top-chart queries.',
    keywordsDe: ['Datenbank Vorlage Musik Streaming', 'Spotify SQL Schema', 'Playlist Datenbank', 'SQL Top Songs'],
    keywordsEn: ['music streaming database template', 'Spotify SQL schema', 'playlist database', 'SQL top tracks'],
    sections: [
      {
        headingDe: 'Vom Künstler bis zur Playlist',
        headingEn: 'From Artist to Playlist',
        paragraphsDe: [
          'Ein Musik-Streaming-Dienst verbindet eine klare Hierarchie (Künstler → Album → Song) mit flexiblen Nutzer-Playlists. Während ein Song genau zu einem Album gehört, kann derselbe Song in beliebig vielen Playlists vorkommen.',
          'Genau dafür nutzen wir die Zwischentabelle playlist_songs mit zusammengesetztem Primärschlüssel (playlist_id, song_id) und einer Positionsnummer.',
        ],
        paragraphsEn: [
          'A music streaming service combines a clear hierarchy (artist → album → track) with flexible user playlists. While a track belongs to one album, the same track can appear in any number of playlists.',
          'For this, we use the junction table playlist_songs with a composite primary key (playlist_id, song_id) and a position column.',
        ],
      },
      {
        headingDe: 'Beliebte Abfragen auf Streaming-Daten',
        headingEn: 'Popular Queries on Streaming Data',
        paragraphsDe: [
          'Du kannst mit SUM(dauer_sekunden) die Gesamtlaufzeit jeder Playlist berechnen oder die meistgehörten Künstler nach Gesamtabrufen sortieren.',
        ],
        paragraphsEn: [
          'You can compute the total runtime of each playlist with SUM(dauer_sekunden) or rank the most-streamed artists by total play count.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Musik-Streaming-Datenbank (Songs, Alben & Playlists)',
      titleEn: 'Music Streaming Database (Tracks, Albums & Playlists)',
      isDatabaseTemplate: true,
      suggestedDbName: 'musik_streaming',
      sql: `CREATE TABLE kuenstler (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  land VARCHAR(50) NOT NULL
);

CREATE TABLE alben (
  id INT PRIMARY KEY,
  kuenstler_id INT NOT NULL,
  titel VARCHAR(120) NOT NULL,
  release_jahr INT NOT NULL,
  FOREIGN KEY (kuenstler_id) REFERENCES kuenstler(id)
);

CREATE TABLE songs (
  id INT PRIMARY KEY,
  album_id INT NOT NULL,
  titel VARCHAR(120) NOT NULL,
  dauer_sekunden INT NOT NULL CHECK (dauer_sekunden > 0),
  streams INT NOT NULL DEFAULT 0,
  FOREIGN KEY (album_id) REFERENCES alben(id)
);

CREATE TABLE playlists (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ersteller VARCHAR(80) NOT NULL
);

CREATE TABLE playlist_songs (
  playlist_id INT NOT NULL,
  song_id INT NOT NULL,
  position INT NOT NULL,
  PRIMARY KEY (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES playlists(id),
  FOREIGN KEY (song_id) REFERENCES songs(id)
);

INSERT INTO kuenstler VALUES
  (1, 'Neon Horizon', 'Deutschland'),
  (2, 'Clara Sol', 'Spanien'),
  (3, 'Midnight Echo', 'UK');

INSERT INTO alben VALUES
  (1, 1, 'Berlin Nights', 2025),
  (2, 2, 'Luz de Verano', 2026),
  (3, 3, 'Analog Dreams', 2024);

INSERT INTO songs VALUES
  (1, 1, 'U-Bahn Lights', 214, 185000),
  (2, 1, 'Spreeufer', 198, 142000),
  (3, 2, 'Brisa del Mar', 231, 310000),
  (4, 3, 'Cassette Tape', 245, 275000);

INSERT INTO playlists VALUES
  (1, 'Coding Focus', 'Alex'),
  (2, 'Sommerabend', 'Maya');

INSERT INTO playlist_songs VALUES
  (1, 1, 1),
  (1, 4, 2),
  (2, 3, 1),
  (2, 2, 2);

SELECT p.name AS playlist,
       COUNT(ps.song_id) AS anzahl_songs,
       SUM(s.dauer_sekunden) AS gesamtdauer_sek
FROM playlists p
JOIN playlist_songs ps ON p.id = ps.playlist_id
JOIN songs s ON ps.song_id = s.id
GROUP BY p.id, p.name;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-event-ticketing',
      'sql-indizes-performance-erklaert',
      'datenbank-vorlage-rezeptbuch',
    ],
  },
  {
    slug: 'datenbank-vorlage-fahrschule',
    category: 'templates',
    publishedAt: '2026-10-19',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Fahrschule (Fahrschüler, Fahrlehrer & Fahrstunden)',
    titleEn: 'Database Template: Driving School (Students, Instructors & Lessons)',
    descriptionDe:
      'Praxisnahe SQL-Vorlage für eine Fahrschule mit Fahrschülern, Fahrlehrern, Fahrzeugen und Fahrstunden. Ideal für Ausbildungs- und Schulprojekte.',
    descriptionEn:
      'Practical SQL template for a driving school with students, instructors, vehicles, and driving lessons. Ideal for school and vocational projects.',
    keywordsDe: ['Datenbank Vorlage Fahrschule', 'Fahrschule SQL Schema', 'Fahrstunden Datenbank'],
    keywordsEn: ['driving school database template', 'driving school SQL schema', 'lessons database'],
    sections: [
      {
        headingDe: 'Geschäftsprozesse einer Fahrschule in SQL',
        headingEn: 'Driving School Processes in SQL',
        paragraphsDe: [
          'Eine Fahrschule verwaltet Fahrschüler mit ihrer angestrebten Führerscheinklasse, Fahrlehrer, Schulungsfahrzeuge sowie einzelne Fahrstunden mit Typ (Übungsfahrt, Autobahn, Nachtfahrt).',
          'Dieses Schema zeigt sehr anschaulich, wie mehrere Tabellen über Fremdschlüssel in einer zentralen Termin- bzw. Stundentabelle zusammenlaufen.',
        ],
        paragraphsEn: [
          'A driving school manages students and their target license class, instructors, training vehicles, and individual lessons by type (practice, highway, night driving).',
          'This schema clearly demonstrates how multiple tables converge via foreign keys into a central lessons table.',
        ],
      },
      {
        headingDe: 'Stundenkonten und Auslastung abfragen',
        headingEn: 'Querying Lesson Totals and Utilization',
        paragraphsDe: [
          'Mit einer einfachen Gruppierung nach Fahrschüler kannst du abfragen, wie viele Minuten bzw. Stunden bereits absolviert wurden und welche Sonderfahrten noch fehlen.',
        ],
        paragraphsEn: [
          'By grouping by student, you can query how many minutes or hours have already been completed and which special lessons are still needed.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Fahrschule-Datenbank (Schüler, Lehrer, Fahrzeuge & Stunden)',
      titleEn: 'Driving School Database (Students, Instructors, Vehicles & Lessons)',
      isDatabaseTemplate: true,
      suggestedDbName: 'fahrschule',
      sql: `CREATE TABLE fahrlehrer (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lizenz_seit INT NOT NULL
);

CREATE TABLE fahrzeuge (
  id INT PRIMARY KEY,
  kennzeichen VARCHAR(20) NOT NULL UNIQUE,
  modell VARCHAR(80) NOT NULL,
  getriebe VARCHAR(20) NOT NULL CHECK (getriebe IN ('Schaltung', 'Automatik'))
);

CREATE TABLE fahrschueler (
  id INT PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  klasse VARCHAR(10) NOT NULL,
  anmeldedatum DATE NOT NULL
);

CREATE TABLE fahrstunden (
  id INT PRIMARY KEY,
  schueler_id INT NOT NULL,
  lehrer_id INT NOT NULL,
  fahrzeug_id INT NOT NULL,
  datum DATE NOT NULL,
  dauer_minuten INT NOT NULL CHECK (dauer_minuten > 0),
  typ VARCHAR(30) NOT NULL,
  FOREIGN KEY (schueler_id) REFERENCES fahrschueler(id),
  FOREIGN KEY (lehrer_id) REFERENCES fahrlehrer(id),
  FOREIGN KEY (fahrzeug_id) REFERENCES fahrzeuge(id)
);

INSERT INTO fahrlehrer VALUES
  (1, 'Stefan Krug', 2012),
  (2, 'Martina Vogt', 2018);

INSERT INTO fahrzeuge VALUES
  (1, 'B-FS 101', 'VW Golf 8', 'Schaltung'),
  (2, 'B-FS 202', 'BMW i3', 'Automatik');

INSERT INTO fahrschueler VALUES
  (1, 'Lina', 'Sommer', 'B', '2026-08-15'),
  (2, 'Moritz', 'Keller', 'B197', '2026-09-01');

INSERT INTO fahrstunden VALUES
  (1, 1, 1, 1, '2026-10-05', 90, 'Uebungsfahrt'),
  (2, 1, 1, 1, '2026-10-12', 90, 'Autobahn'),
  (3, 2, 2, 2, '2026-10-14', 45, 'Uebungsfahrt');

SELECT s.vorname, s.nachname,
       COUNT(f.id) AS stunden_anzahl,
       SUM(f.dauer_minuten) AS gesamt_minuten
FROM fahrschueler s
LEFT JOIN fahrstunden f ON s.id = f.schueler_id
GROUP BY s.id, s.vorname, s.nachname;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-autovermietung',
      'sql-constraints-not-null-unique-check',
      'sql-datumsfunktionen-year-month-day',
    ],
  },
  {
    slug: 'datenbank-vorlage-hotelbuchung',
    category: 'templates',
    publishedAt: '2026-10-20',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Hotelbuchungssystem (Zimmer, Gäste & Buchungen)',
    titleEn: 'Database Template: Hotel Booking System (Rooms, Guests & Bookings)',
    descriptionDe:
      'SQL-Datenbankvorlage für ein Hotel mit Zimmerkategorien, Gästen und Buchungszeiträumen. Perfekt für Datumsabfragen und Umsatzberechnungen.',
    descriptionEn:
      'SQL database template for a hotel with room categories, guests, and booking periods. Perfect for date queries and revenue calculations.',
    keywordsDe: ['Datenbank Vorlage Hotel', 'Hotelbuchung SQL', 'Zimmerreservierung Datenbank'],
    keywordsEn: ['hotel database template', 'hotel booking SQL', 'room reservation schema'],
    sections: [
      {
        headingDe: 'Zimmer, Gäste und Aufenthalte',
        headingEn: 'Rooms, Guests, and Stays',
        paragraphsDe: [
          'In einem Hotelbuchungssystem stehen zimmer, gaeste und buchungen im Mittelpunkt. Jedes Zimmer besitzt eine Zimmernummer, eine Kategorie und einen Preis pro Nacht.',
          'Die Tabelle buchungen speichert Check-in- und Check-out-Datum sowie den Status (bestaetigt, eingecheckt, storniert).',
        ],
        paragraphsEn: [
          'In a hotel booking system, zimmer (rooms), gaeste (guests), and buchungen (bookings) form the core. Each room has a room number, category, and nightly rate.',
          'The buchungen table stores check-in and check-out dates along with the booking status (bestaetigt, eingecheckt, storniert).',
        ],
      },
      {
        headingDe: 'Belegung und Stornos filtern',
        headingEn: 'Filtering Occupancy and Cancellations',
        paragraphsDe: [
          'Durch Filter auf den Buchungsstatus und Datumsvergleiche lassen sich aktuelle Gäste, kommende Anreisen oder der erwartete Umsatz pro Zimmerkategorie sauber ermitteln.',
        ],
        paragraphsEn: [
          'By filtering on booking status and comparing dates, you can cleanly query current guests, upcoming arrivals, or expected revenue per room category.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Hotelbuchung-Datenbank (Zimmer, Gäste & Buchungen)',
      titleEn: 'Hotel Booking Database (Rooms, Guests & Bookings)',
      isDatabaseTemplate: true,
      suggestedDbName: 'hotelbuchung',
      sql: `CREATE TABLE zimmer (
  id INT PRIMARY KEY,
  zimmernummer VARCHAR(10) NOT NULL UNIQUE,
  kategorie VARCHAR(40) NOT NULL,
  preis_pro_nacht DECIMAL(8, 2) NOT NULL CHECK (preis_pro_nacht > 0),
  max_personen INT NOT NULL
);

CREATE TABLE gaeste (
  id INT PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  land VARCHAR(50) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE buchungen (
  id INT PRIMARY KEY,
  zimmer_id INT NOT NULL,
  gast_id INT NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (zimmer_id) REFERENCES zimmer(id),
  FOREIGN KEY (gast_id) REFERENCES gaeste(id)
);

INSERT INTO zimmer VALUES
  (1, '101', 'Einzelzimmer', 89.00, 1),
  (2, '204', 'Doppelzimmer', 139.00, 2),
  (3, '301', 'Suite', 249.00, 4);

INSERT INTO gaeste VALUES
  (1, 'Anna', 'Lindner', 'Österreich', 'anna.lindner@example.at'),
  (2, 'David', 'Miller', 'USA', 'david.miller@example.com'),
  (3, 'Sophie', 'Laurent', 'Frankreich', 'sophie.laurent@example.fr');

INSERT INTO buchungen VALUES
  (1, 2, 1, '2026-10-18', '2026-10-21', 'bestaetigt'),
  (2, 3, 2, '2026-10-19', '2026-10-24', 'eingecheckt'),
  (3, 1, 3, '2026-10-25', '2026-10-27', 'storniert');

SELECT b.id AS buchung_id,
       g.vorname, g.nachname,
       z.zimmernummer, z.kategorie,
       b.checkin, b.checkout, b.status
FROM buchungen b
JOIN gaeste g ON b.gast_id = g.id
JOIN zimmer z ON b.zimmer_id = z.id
WHERE b.status != 'storniert'
ORDER BY b.checkin;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-event-ticketing',
      'sql-datumsfunktionen-year-month-day',
      'datenbank-vorlage-autovermietung',
    ],
  },
  {
    slug: 'datenbank-vorlage-stundenplan-schule',
    category: 'templates',
    publishedAt: '2026-10-21',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Schul-Stundenplan (Klassen, Fächer, Lehrkräfte & Räume)',
    titleEn: 'Database Template: School Timetable (Classes, Subjects, Teachers & Rooms)',
    descriptionDe:
      'Ideale SQL-Datenbankvorlage für den Informatikunterricht: Klassen, Lehrkräfte, Fächer, Räume und der komplette Stundenplan ohne Redundanzen.',
    descriptionEn:
      'Ideal SQL database template for computer science classes: classes, teachers, subjects, rooms, and a normalized school timetable.',
    keywordsDe: ['Datenbank Vorlage Stundenplan', 'Schule Datenbank SQL', 'Informatik Unterricht SQL', 'Normalisierung Stundenplan'],
    keywordsEn: ['school timetable database template', 'school SQL schema', 'CS class SQL database'],
    sections: [
      {
        headingDe: 'Warum der Stundenplan ein Klassiker im Unterricht ist',
        headingEn: 'Why the Timetable Is a Classroom Classic',
        paragraphsDe: [
          'Jede Schülerin und jeder Schüler kennt einen Stundenplan – deshalb lässt sich die 3. Normalform (3NF) an diesem Beispiel besonders leicht verstehen.',
          'Statt Raumnummern oder Lehrernamen in jeder Unterrichtsstunde zu wiederholen, lagern wir klassen, lehrkraefte, faecher und raeume in eigene Tabellen aus.',
        ],
        paragraphsEn: [
          'Every student knows how a school timetable works, which makes Third Normal Form (3NF) much easier to grasp with this domain.',
          'Instead of repeating room numbers or teacher names in every lesson row, we extract klassen, lehrkraefte, faecher, and raeume into their own tables.',
        ],
      },
      {
        headingDe: 'Mehrfach-JOINs Schritt für Schritt üben',
        headingEn: 'Practicing Multi-Table JOINs Step by Step',
        paragraphsDe: [
          'Um den Wochenplan einer bestimmten Klasse (z. B. 10a) anzuzeigen, verknüpfst du unterrichtsstunden über vier JOINs mit den Stammdaten und sortierst nach Wochentag und Stunde.',
        ],
        paragraphsEn: [
          'To display the weekly schedule for a specific class (e.g. 10a), you join unterrichtsstunden with all four reference tables and sort by weekday and period.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Stundenplan-Datenbank (Klassen, Fächer, Lehrkräfte & Räume)',
      titleEn: 'Timetable Database (Classes, Subjects, Teachers & Rooms)',
      isDatabaseTemplate: true,
      suggestedDbName: 'stundenplan',
      sql: `CREATE TABLE klassen (
  id INT PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE,
  jahrgang INT NOT NULL
);

CREATE TABLE lehrkraefte (
  id INT PRIMARY KEY,
  kuerzel VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE faecher (
  id INT PRIMARY KEY,
  bezeichnung VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE raeume (
  id INT PRIMARY KEY,
  raumnummer VARCHAR(20) NOT NULL UNIQUE,
  gebaeude VARCHAR(30) NOT NULL
);

CREATE TABLE unterrichtsstunden (
  id INT PRIMARY KEY,
  klasse_id INT NOT NULL,
  fach_id INT NOT NULL,
  lehrer_id INT NOT NULL,
  raum_id INT NOT NULL,
  wochentag VARCHAR(15) NOT NULL,
  stunde INT NOT NULL CHECK (stunde BETWEEN 1 AND 10),
  FOREIGN KEY (klasse_id) REFERENCES klassen(id),
  FOREIGN KEY (fach_id) REFERENCES faecher(id),
  FOREIGN KEY (lehrer_id) REFERENCES lehrkraefte(id),
  FOREIGN KEY (raum_id) REFERENCES raeume(id)
);

INSERT INTO klassen VALUES (1, '10a', 10), (2, '10b', 10);
INSERT INTO lehrkraefte VALUES (1, 'MUE', 'Frau Müller'), (2, 'SCH', 'Herr Schmidt'), (3, 'WEB', 'Frau Weber');
INSERT INTO faecher VALUES (1, 'Informatik'), (2, 'Mathematik'), (3, 'Englisch');
INSERT INTO raeume VALUES (1, 'R204', 'Hauptbau'), (2, 'C102', 'Informatiktrakt');

INSERT INTO unterrichtsstunden VALUES
  (1, 1, 1, 3, 2, 'Montag', 1),
  (2, 1, 2, 1, 1, 'Montag', 2),
  (3, 1, 3, 2, 1, 'Dienstag', 1),
  (4, 2, 1, 3, 2, 'Dienstag', 3);

SELECT u.wochentag, u.stunde, k.name AS klasse,
       f.bezeichnung AS fach, l.kuerzel AS lehrer, r.raumnummer
FROM unterrichtsstunden u
JOIN klassen k ON u.klasse_id = k.id
JOIN faecher f ON u.fach_id = f.id
JOIN lehrkraefte l ON u.lehrer_id = l.id
JOIN raeume r ON u.raum_id = r.id
WHERE k.name = '10a'
ORDER BY u.wochentag, u.stunde;`,
    },
    relatedSlugs: [
      'mysql-vs-sqlite-unterschiede-schule',
      'datenbank-vorlage-bibliothek',
      'sql-views-virtuelle-tabellen',
    ],
  },
  {
    slug: 'datenbank-vorlage-lagerverwaltung',
    category: 'templates',
    publishedAt: '2026-10-22',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Lagerverwaltung & Warenwirtschaft (SQL)',
    titleEn: 'Database Template: Warehouse & Inventory Management (SQL)',
    descriptionDe:
      'SQL-Datenbankvorlage für Lagerverwaltung mit Lieferanten, Artikeln, Beständen und Lagerbewegungen. Ideal für Bestandsprüfungen und Nachbestellungen.',
    descriptionEn:
      'SQL database template for warehouse management with suppliers, products, stock levels, and inventory movements. Ideal for reorder alerts.',
    keywordsDe: ['Datenbank Vorlage Lagerverwaltung', 'Warenwirtschaft SQL', 'Bestand SQL', 'Lagerbewegung Schema'],
    keywordsEn: ['warehouse database template', 'inventory management SQL', 'stock SQL schema'],
    sections: [
      {
        headingDe: 'Stammdaten und Bestandsbewegungen trennen',
        headingEn: 'Separating Master Data and Stock Movements',
        paragraphsDe: [
          'In professionellen Warenwirtschaftssystemen speichert man nicht nur den aktuellen Bestand eines Artikels, sondern protokolliert auch jeden Wareneingang und Warenausgang in einer Bewegungstabelle.',
          'Dadurch bleibt jederzeit nachvollziehbar, wann welcher Artikel eingelagert oder versendet wurde.',
        ],
        paragraphsEn: [
          'In professional inventory systems, you do not just store the current stock level of a product—you also log every incoming and outgoing movement in a ledger table.',
          'This keeps a full audit trail of when each item was received or shipped.',
        ],
      },
      {
        headingDe: 'Kritische Bestände automatisch erkennen',
        headingEn: 'Detecting Low Stock Automatically',
        paragraphsDe: [
          'Durch den Vergleich bestand <= mindestbestand liefert dir eine einzige SELECT-Abfrage eine fertige Einkaufsliste inklusive passendem Lieferanten.',
        ],
        paragraphsEn: [
          'By comparing bestand <= mindestbestand, a single SELECT query gives you a ready-to-use reorder list including the matching supplier.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Lagerverwaltung-Datenbank (Lieferanten, Artikel & Bewegungen)',
      titleEn: 'Warehouse Database (Suppliers, Products & Movements)',
      isDatabaseTemplate: true,
      suggestedDbName: 'lagerverwaltung',
      sql: `CREATE TABLE lieferanten (
  id INT PRIMARY KEY,
  firma VARCHAR(100) NOT NULL,
  kontakt_email VARCHAR(120) NOT NULL
);

CREATE TABLE artikel (
  id INT PRIMARY KEY,
  sku VARCHAR(30) NOT NULL UNIQUE,
  bezeichnung VARCHAR(120) NOT NULL,
  lieferant_id INT NOT NULL,
  bestand INT NOT NULL CHECK (bestand >= 0),
  mindestbestand INT NOT NULL DEFAULT 5,
  stueckpreis DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (lieferant_id) REFERENCES lieferanten(id)
);

CREATE TABLE lagerbewegungen (
  id INT PRIMARY KEY,
  artikel_id INT NOT NULL,
  typ VARCHAR(15) NOT NULL CHECK (typ IN ('EINGANG', 'AUSGANG')),
  menge INT NOT NULL CHECK (menge > 0),
  datum DATE NOT NULL,
  FOREIGN KEY (artikel_id) REFERENCES artikel(id)
);

INSERT INTO lieferanten VALUES
  (1, 'NordTech GmbH', 'einkauf@nordtech.example'),
  (2, 'BüroPlus AG', 'order@bueroplus.example');

INSERT INTO artikel VALUES
  (1, 'SKU-1001', 'USB-C Hub 7-in-1', 1, 3, 10, 29.90),
  (2, 'SKU-1002', 'Mechanische Tastatur', 1, 18, 8, 79.00),
  (3, 'SKU-2001', 'Druckerpapier A4 (500 Blatt)', 2, 4, 15, 5.50);

INSERT INTO lagerbewegungen VALUES
  (1, 1, 'AUSGANG', 7, '2026-10-10'),
  (2, 2, 'EINGANG', 10, '2026-10-12'),
  (3, 3, 'AUSGANG', 12, '2026-10-15');

SELECT a.sku, a.bezeichnung, a.bestand, a.mindestbestand,
       l.firma AS lieferant,
       ROUND(a.bestand * a.stueckpreis, 2) AS lagerwert
FROM artikel a
JOIN lieferanten l ON a.lieferant_id = l.id
WHERE a.bestand <= a.mindestbestand
ORDER BY a.bestand ASC;`,
    },
    relatedSlugs: [
      'sql-constraints-not-null-unique-check',
      'sql-case-when-bedingungen',
      'datenbank-vorlage-autovermietung',
    ],
  },
  {
    slug: 'datenbank-vorlage-event-ticketing',
    category: 'templates',
    publishedAt: '2026-10-23',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Event-Ticketing & Konzerte in SQL',
    titleEn: 'Database Template: Event Ticketing & Concerts in SQL',
    descriptionDe:
      'SQL-Datenbankvorlage für ein Ticket-Portal mit Veranstaltungen, Venues, Ticketkategorien und Bestellungen. Inklusive Auslastungs- und Umsatzabfragen.',
    descriptionEn:
      'SQL database template for a ticketing platform with events, venues, ticket tiers, and orders. Includes capacity and revenue queries.',
    keywordsDe: ['Datenbank Vorlage Event Ticketing', 'Konzert Tickets SQL', 'Veranstaltung Datenbank'],
    keywordsEn: ['event ticketing database template', 'concert tickets SQL', 'event database schema'],
    sections: [
      {
        headingDe: 'Veranstaltungen, Venues und Ticket-Kategorien',
        headingEn: 'Events, Venues, and Ticket Tiers',
        paragraphsDe: [
          'Bei Konzerten, Konferenzen oder Festivals gibt es meist verschiedene Ticket-Kategorien wie Stehplatz, Sitzplatz oder VIP. Jede Kategorie hat einen eigenen Preis und ein Kontingent.',
          'Durch die Trennung von venues, events, ticket_kategorien und bestellungen bleibt das Modell flexibel für beliebig viele Veranstaltungen am selben Ort.',
        ],
        paragraphsEn: [
          'Concerts, conferences, and festivals usually offer multiple ticket tiers such as General Admission, Seated, or VIP. Each tier has its own price and quota.',
          'Separating venues, events, ticket_kategorien, and bestellungen keeps the model flexible for any number of events at the same venue.',
        ],
      },
      {
        headingDe: 'Verkaufte Tickets und Umsatz je Event berechnen',
        headingEn: 'Calculating Tickets Sold and Revenue per Event',
        paragraphsDe: [
          'Mit SUM(b.menge) und SUM(b.menge * tk.preis) siehst du sofort, welche Events am besten laufen und wie viele Plätze noch verfügbar sind.',
        ],
        paragraphsEn: [
          'With SUM(b.menge) and SUM(b.menge * tk.preis), you can immediately see which events perform best and how many seats remain available.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Event-Ticketing-Datenbank (Venues, Events & Bestellungen)',
      titleEn: 'Event Ticketing Database (Venues, Events & Orders)',
      isDatabaseTemplate: true,
      suggestedDbName: 'event_tickets',
      sql: `CREATE TABLE venues (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stadt VARCHAR(60) NOT NULL,
  kapazitaet INT NOT NULL CHECK (kapazitaet > 0)
);

CREATE TABLE events (
  id INT PRIMARY KEY,
  venue_id INT NOT NULL,
  titel VARCHAR(120) NOT NULL,
  datum DATE NOT NULL,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

CREATE TABLE ticket_kategorien (
  id INT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL CHECK (preis >= 0),
  kontingent INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE bestellungen (
  id INT PRIMARY KEY,
  kategorie_id INT NOT NULL,
  kaeufer_email VARCHAR(120) NOT NULL,
  menge INT NOT NULL CHECK (menge > 0),
  bestell_datum DATE NOT NULL,
  FOREIGN KEY (kategorie_id) REFERENCES ticket_kategorien(id)
);

INSERT INTO venues VALUES
  (1, 'Elbphilharmonie', 'Hamburg', 2100),
  (2, 'Tempodrom', 'Berlin', 3500);

INSERT INTO events VALUES
  (1, 1, 'Symphonic Game Music', '2026-11-14'),
  (2, 2, 'Indie Synth Night', '2026-11-28');

INSERT INTO ticket_kategorien VALUES
  (1, 1, 'Parkett', 69.00, 800),
  (2, 1, 'VIP Loge', 149.00, 100),
  (3, 2, 'Stehplatz', 42.00, 2000);

INSERT INTO bestellungen VALUES
  (1, 1, 'max@example.de', 2, '2026-10-01'),
  (2, 2, 'sarah@example.de', 4, '2026-10-03'),
  (3, 3, 'tim@example.de', 3, '2026-10-07');

SELECT e.titel AS event,
       v.stadt,
       SUM(b.menge) AS verkaufte_tickets,
       ROUND(SUM(b.menge * tk.preis), 2) AS umsatz_eur
FROM bestellungen b
JOIN ticket_kategorien tk ON b.kategorie_id = tk.id
JOIN events e ON tk.event_id = e.id
JOIN venues v ON e.venue_id = v.id
GROUP BY e.id, e.titel, v.stadt
ORDER BY umsatz_eur DESC;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-musik-streaming',
      'datenbank-vorlage-hotelbuchung',
      'sql-indizes-performance-erklaert',
    ],
  },
  {
    slug: 'datenbank-vorlage-rezeptbuch',
    category: 'templates',
    publishedAt: '2026-10-24',
    readingMinutes: 5,
    titleDe: 'Datenbank-Vorlage: Digitales Rezeptbuch & Zutatenliste (SQL)',
    titleEn: 'Database Template: Digital Recipe Book & Ingredients (SQL)',
    descriptionDe:
      'SQL-Datenbankvorlage für Rezepte, Zutaten und Mengenangaben. Perfekt zum Üben von n:m-Beziehungen mit Attributen an der Verbindungstabelle.',
    descriptionEn:
      'SQL database template for recipes, ingredients, and quantities. Perfect for practicing many-to-many relationships with attributes on the junction table.',
    keywordsDe: ['Datenbank Vorlage Rezeptbuch', 'Rezepte SQL Schema', 'Zutaten n:m Beziehung'],
    keywordsEn: ['recipe database template', 'recipes SQL schema', 'ingredients many-to-many'],
    sections: [
      {
        headingDe: 'Mengen und Einheiten in der n:m-Tabelle',
        headingEn: 'Quantities and Units in the Junction Table',
        paragraphsDe: [
          'Ein Rezept besteht aus vielen Zutaten, und dieselbe Zutat (z. B. Mehl oder Olivenöl) wird in vielen Rezepten verwendet. Wie viel von einer Zutat benötigt wird, gehört weder in rezepte noch in zutaten, sondern direkt in die Zwischentabelle rezept_zutaten.',
          'Dieses Prinzip – Attribute an einer n:m-Beziehung zu speichern – ist eines der wichtigsten Konzepte beim Datenbankentwurf.',
        ],
        paragraphsEn: [
          'A recipe consists of many ingredients, and the same ingredient (such as flour or olive oil) is used in many recipes. The exact amount belongs neither in rezepte nor in zutaten, but directly in the junction table rezept_zutaten.',
          'Storing attributes on a many-to-many relationship is one of the most important concepts in database design.',
        ],
      },
      {
        headingDe: 'Rezepte nach Zutat oder Zubereitungszeit finden',
        headingEn: 'Finding Recipes by Ingredient or Prep Time',
        paragraphsDe: [
          'Mit einer gezielten WHERE-Filterung auf zutaten.name findest du sofort alle Gerichte, die sich mit vorhandenen Vorräten kochen lassen.',
        ],
        paragraphsEn: [
          'By filtering on zutaten.name, you can immediately find all dishes that can be cooked with ingredients already in your pantry.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Rezeptbuch-Datenbank (Rezepte, Zutaten & Mengen)',
      titleEn: 'Recipe Book Database (Recipes, Ingredients & Quantities)',
      isDatabaseTemplate: true,
      suggestedDbName: 'rezeptbuch',
      sql: `CREATE TABLE rezepte (
  id INT PRIMARY KEY,
  titel VARCHAR(120) NOT NULL,
  kategorie VARCHAR(50) NOT NULL,
  zubereitungszeit_min INT NOT NULL CHECK (zubereitungszeit_min > 0),
  schwierigkeit VARCHAR(20) NOT NULL
);

CREATE TABLE zutaten (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  vegetarisch BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE rezept_zutaten (
  rezept_id INT NOT NULL,
  zutat_id INT NOT NULL,
  menge DECIMAL(8, 2) NOT NULL,
  einheit VARCHAR(20) NOT NULL,
  PRIMARY KEY (rezept_id, zutat_id),
  FOREIGN KEY (rezept_id) REFERENCES rezepte(id),
  FOREIGN KEY (zutat_id) REFERENCES zutaten(id)
);

INSERT INTO rezepte VALUES
  (1, 'Pasta Pomodoro', 'Hauptgericht', 25, 'Einfach'),
  (2, 'Pfannkuchen', 'Dessert', 20, 'Einfach'),
  (3, 'Gemüse-Curry', 'Hauptgericht', 35, 'Mittel');

INSERT INTO zutaten VALUES
  (1, 'Spaghetti', 1),
  (2, 'Tomaten', 1),
  (3, 'Mehl', 1),
  (4, 'Milch', 1),
  (5, 'Kokosmilch', 1);

INSERT INTO rezept_zutaten VALUES
  (1, 1, 250, 'g'),
  (1, 2, 400, 'g'),
  (2, 3, 200, 'g'),
  (2, 4, 300, 'ml'),
  (3, 2, 200, 'g'),
  (3, 5, 400, 'ml');

SELECT r.titel, r.zubereitungszeit_min, z.name AS zutat, rz.menge, rz.einheit
FROM rezepte r
JOIN rezept_zutaten rz ON r.id = rz.rezept_id
JOIN zutaten z ON rz.zutat_id = z.id
ORDER BY r.titel, z.name;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-bibliothek',
      'datenbank-vorlage-musik-streaming',
      'sql-stringfunktionen-concat-substring',
    ],
  },
  {
    slug: 'datenbank-vorlage-autovermietung',
    category: 'templates',
    publishedAt: '2026-10-25',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Autovermietung & Fuhrparkverwaltung (SQL)',
    titleEn: 'Database Template: Car Rental & Fleet Management (SQL)',
    descriptionDe:
      'Komplette SQL-Datenbankvorlage für eine Autovermietung mit Fahrzeugen, Filialen, Kundinnen und Mietverträgen. Ideal für Abfragen und Buchungslogik.',
    descriptionEn:
      'Complete SQL database template for a car rental company with vehicles, branches, customers, and rental contracts.',
    keywordsDe: ['Datenbank Vorlage Autovermietung', 'Fuhrpark SQL', 'Mietwagen Datenbank Schema'],
    keywordsEn: ['car rental database template', 'fleet management SQL', 'rental database schema'],
    sections: [
      {
        headingDe: 'Filialen, Fahrzeuge und Mietverträge',
        headingEn: 'Branches, Vehicles, and Rental Contracts',
        paragraphsDe: [
          'Eine Autovermietung verwaltet Fahrzeuge an verschiedenen Standorten (Filialen) und vermietet diese zeitlich befristet an Kundinnen und Kunden.',
          'Über die Tabelle mietvertraege lassen sich Mietbeginn, Mietende, gefahrene Kilometer und der Gesamtpreis pro Vertrag dokumentieren.',
        ],
        paragraphsEn: [
          'A car rental business manages vehicles across different branch locations and rents them to customers for specific periods.',
          'The mietvertraege (rental contracts) table records start date, end date, mileage, and total price per contract.',
        ],
      },
      {
        headingDe: 'Flottenauslastung und Umsatz auswerten',
        headingEn: 'Evaluating Fleet Utilization and Revenue',
        paragraphsDe: [
          'Mit JOINs zwischen fahrzeuge, filialen und mietvertraege ermittelst du schnell, welche Fahrzeugklasse den höchsten Umsatz erzielt oder welche Autos aktuell vermietet sind.',
        ],
        paragraphsEn: [
          'Joining fahrzeuge, filialen, and mietvertraege lets you quickly see which vehicle class generates the most revenue or which cars are currently rented out.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Autovermietung-Datenbank (Filialen, Fahrzeuge & Verträge)',
      titleEn: 'Car Rental Database (Branches, Vehicles & Contracts)',
      isDatabaseTemplate: true,
      suggestedDbName: 'autovermietung',
      sql: `CREATE TABLE filialen (
  id INT PRIMARY KEY,
  stadt VARCHAR(60) NOT NULL,
  adresse VARCHAR(120) NOT NULL
);

CREATE TABLE fahrzeuge (
  id INT PRIMARY KEY,
  filiale_id INT NOT NULL,
  kennzeichen VARCHAR(20) NOT NULL UNIQUE,
  marke VARCHAR(50) NOT NULL,
  modell VARCHAR(60) NOT NULL,
  tagespreis DECIMAL(8, 2) NOT NULL CHECK (tagespreis > 0),
  verfuegbar BOOLEAN NOT NULL DEFAULT 1,
  FOREIGN KEY (filiale_id) REFERENCES filialen(id)
);

CREATE TABLE kunden (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fuehrerschein_nr VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE mietvertraege (
  id INT PRIMARY KEY,
  fahrzeug_id INT NOT NULL,
  kunde_id INT NOT NULL,
  start_datum DATE NOT NULL,
  ende_datum DATE NOT NULL,
  gesamtpreis DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (fahrzeug_id) REFERENCES fahrzeuge(id),
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

INSERT INTO filialen VALUES
  (1, 'München', 'Bahnhofplatz 4'),
  (2, 'Köln', 'Domstraße 19');

INSERT INTO fahrzeuge VALUES
  (1, 1, 'M-AV 1001', 'VW', 'ID.4', 68.00, 1),
  (2, 1, 'M-AV 1002', 'BMW', '320d', 89.00, 0),
  (3, 2, 'K-AV 2001', 'Skoda', 'Octavia', 59.00, 1);

INSERT INTO kunden VALUES
  (1, 'Tobias Hartmann', 'FS-884210'),
  (2, 'Julia Braun', 'FS-992104');

INSERT INTO mietvertraege VALUES
  (1, 2, 1, '2026-10-18', '2026-10-22', 356.00),
  (2, 1, 2, '2026-10-05', '2026-10-08', 204.00);

SELECT f.stadt, fz.marke, fz.modell, fz.kennzeichen,
       COUNT(m.id) AS anzahl_vertraege,
       IFNULL(SUM(m.gesamtpreis), 0) AS umsatz
FROM fahrzeuge fz
JOIN filialen f ON fz.filiale_id = f.id
LEFT JOIN mietvertraege m ON fz.id = m.fahrzeug_id
GROUP BY fz.id, f.stadt, fz.marke, fz.modell, fz.kennzeichen
ORDER BY umsatz DESC;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-fahrschule',
      'datenbank-vorlage-hotelbuchung',
      'sql-case-when-bedingungen',
    ],
  },
  {
    slug: 'datenbank-vorlage-fitnessstudio',
    category: 'templates',
    publishedAt: '2026-10-26',
    readingMinutes: 6,
    titleDe: 'Datenbank-Vorlage: Fitnessstudio (Mitglieder, Tarife & Kurse)',
    titleEn: 'Database Template: Fitness Studio (Members, Plans & Classes)',
    descriptionDe:
      'SQL-Datenbankvorlage für ein Fitnessstudio mit Tarifen, Mitgliedern, Kursen und Kursbuchungen. Ideal für JOINs, Gruppen-Counts und Umsatzanalysen.',
    descriptionEn:
      'SQL database template for a fitness studio with membership plans, members, classes, and bookings. Ideal for JOINs and attendance counts.',
    keywordsDe: ['Datenbank Vorlage Fitnessstudio', 'Gym SQL Schema', 'Mitgliederverwaltung SQL'],
    keywordsEn: ['fitness studio database template', 'gym SQL schema', 'membership database'],
    sections: [
      {
        headingDe: 'Mitgliedschaften und Kursbuchungen abbilden',
        headingEn: 'Modeling Memberships and Class Bookings',
        paragraphsDe: [
          'Ein Fitnessstudio kombiniert monatliche Tarife (Basis, Premium, Student) mit einem Kursangebot wie Yoga, Spinning oder Krafttraining.',
          'Über die Buchungstabelle kursbuchungen lässt sich genau prüfen, wie gut einzelne Kurse ausgelastet sind und welche Mitglieder besonders aktiv trainieren.',
        ],
        paragraphsEn: [
          'A fitness studio combines monthly membership plans (Basic, Premium, Student) with group classes such as Yoga, Spinning, or Strength Training.',
          'Using the kursbuchungen (class bookings) table, you can track class attendance and see which members train most actively.',
        ],
      },
      {
        headingDe: 'Monatsumsatz nach Tarif auswerten',
        headingEn: 'Analyzing Monthly Revenue by Plan',
        paragraphsDe: [
          'Mit COUNT und SUM auf mitglieder und tarife berechnest du in wenigen Zeilen den monatlichen Grundumsatz pro Tarifstufe.',
        ],
        paragraphsEn: [
          'Using COUNT and SUM across mitglieder and tarife, you can calculate monthly recurring revenue per plan tier in just a few lines.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Fitnessstudio-Datenbank (Tarife, Mitglieder & Kurse)',
      titleEn: 'Fitness Studio Database (Plans, Members & Classes)',
      isDatabaseTemplate: true,
      suggestedDbName: 'fitnessstudio',
      sql: `CREATE TABLE tarife (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  monatspreis DECIMAL(6, 2) NOT NULL CHECK (monatspreis > 0)
);

CREATE TABLE mitglieder (
  id INT PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  tarif_id INT NOT NULL,
  aktiv_seit DATE NOT NULL,
  FOREIGN KEY (tarif_id) REFERENCES tarife(id)
);

CREATE TABLE kurse (
  id INT PRIMARY KEY,
  titel VARCHAR(80) NOT NULL,
  trainer VARCHAR(80) NOT NULL,
  wochentag VARCHAR(15) NOT NULL,
  max_teilnehmer INT NOT NULL CHECK (max_teilnehmer > 0)
);

CREATE TABLE kursbuchungen (
  kurs_id INT NOT NULL,
  mitglied_id INT NOT NULL,
  buchungs_datum DATE NOT NULL,
  PRIMARY KEY (kurs_id, mitglied_id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(id),
  FOREIGN KEY (mitglied_id) REFERENCES mitglieder(id)
);

INSERT INTO tarife VALUES
  (1, 'Basis', 29.90),
  (2, 'Premium', 49.90),
  (3, 'Student', 24.90);

INSERT INTO mitglieder VALUES
  (1, 'Laura', 'Becker', 2, '2025-02-01'),
  (2, 'Felix', 'Maier', 1, '2025-07-15'),
  (3, 'Nina', 'Hofmann', 2, '2026-01-10'),
  (4, 'Ben', 'Schäfer', 3, '2026-04-01');

INSERT INTO kurse VALUES
  (1, 'Morning Yoga', 'Clara', 'Montag', 15),
  (2, 'HIIT Power', 'Marco', 'Mittwoch', 20);

INSERT INTO kursbuchungen VALUES
  (1, 1, '2026-10-19'),
  (1, 3, '2026-10-19'),
  (2, 1, '2026-10-21'),
  (2, 2, '2026-10-21'),
  (2, 4, '2026-10-21');

SELECT k.titel, k.trainer, k.wochentag,
       COUNT(kb.mitglied_id) AS angemeldet,
       k.max_teilnehmer
FROM kurse k
LEFT JOIN kursbuchungen kb ON k.id = kb.kurs_id
GROUP BY k.id, k.titel, k.trainer, k.wochentag, k.max_teilnehmer;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-fussballverein',
      'sql-views-virtuelle-tabellen',
      'sql-case-when-bedingungen',
    ],
  },
  {
    slug: 'mysql-vs-sqlite-unterschiede-schule',
    category: 'abitur_school',
    publishedAt: '2026-10-27',
    readingMinutes: 7,
    titleDe: 'MySQL vs. SQLite im Informatikunterricht & Abitur: Die wichtigsten Unterschiede',
    titleEn: 'MySQL vs. SQLite in School & Exams: Key Differences Explained',
    descriptionDe:
      'Wo unterscheiden sich MySQL und SQLite? Datentypen, AUTO_INCREMENT, CONCAT, Datumsfunktionen und Typisierung einfach erklärt für Schule und Abitur.',
    descriptionEn:
      'How do MySQL and SQLite differ? Data types, AUTO_INCREMENT, CONCAT, date functions, and typing explained clearly for students.',
    keywordsDe: ['MySQL vs SQLite', 'SQL Unterschiede Schule', 'Informatik Abitur SQL', 'AUTO_INCREMENT SQLite'],
    keywordsEn: ['MySQL vs SQLite', 'SQL dialect differences', 'SQLite AUTOINCREMENT vs MySQL'],
    sections: [
      {
        headingDe: 'Server-Datenbank vs. eingebettete Datei-Datenbank',
        headingEn: 'Client-Server Database vs. Embedded File Database',
        paragraphsDe: [
          'MySQL ist ein klassisches Client-Server-Datenbanksystem: Ein eigener Datenbankserver nimmt Verbindungen über TCP/IP entgegen, verwaltet Benutzerrechte und bedient viele gleichzeitige Zugriffe.',
          'SQLite hingegen läuft direkt als Bibliothek im selben Prozess – ohne Server, ohne Port und mit einer einzigen Datenbankdatei (oder komplett im Arbeitsspeicher). Genau deshalb eignet sich SQLite ideal für mobile Apps, Desktop-Tools und WebAssembly im Browser.',
        ],
        paragraphsEn: [
          'MySQL is a classic client-server database system: a dedicated server accepts connections over TCP/IP, manages user permissions, and handles many concurrent clients.',
          'SQLite runs directly as a library inside the host process—no server, no port, and a single database file (or in-memory). That makes SQLite ideal for mobile apps, desktop tools, and WebAssembly in the browser.',
        ],
      },
      {
        headingDe: 'Syntax-Unterschiede im Unterricht: AUTO_INCREMENT, CONCAT & Datum',
        headingEn: 'Syntax Differences in Class: AUTO_INCREMENT, CONCAT & Dates',
        paragraphsDe: [
          'In MySQL schreibt man AUTO_INCREMENT, während SQLite INTEGER PRIMARY KEY (optional mit AUTOINCREMENT) verwendet. Auch bei Zeichenketten gibt es Unterschiede: MySQL nutzt CONCAT(a, b), während Standard-SQL und SQLite den Operator a || b verwenden.',
          'Für Datumsauswertungen bietet MySQL Funktionen wie YEAR(datum) und MONTH(datum), während SQLite nativ strftime("%Y", datum) einsetzt. In SqlTrainer werden die wichtigsten MySQL-Funktionen automatisch per Kompatibilitätsschicht unterstützt.',
        ],
        paragraphsEn: [
          'MySQL uses AUTO_INCREMENT, whereas SQLite uses INTEGER PRIMARY KEY (optionally with AUTOINCREMENT). String concatenation also differs: MySQL uses CONCAT(a, b), while standard SQL and SQLite use the || operator.',
          'For dates, MySQL provides YEAR(date) and MONTH(date), while SQLite natively uses strftime("%Y", date). In SqlTrainer, common MySQL functions are automatically supported via a compatibility layer.',
        ],
      },
      {
        headingDe: 'Strikte Typen vs. dynamische Typ-Affinität',
        headingEn: 'Strict Types vs. Dynamic Type Affinity',
        paragraphsDe: [
          'MySQL erzwingt definierte Spaltentypen wie INT, VARCHAR(50) oder DECIMAL(10,2) streng beim Einfügen. SQLite arbeitet traditionell mit dynamischer Typ-Affinität – prüft Typen aber heute auf Wunsch strenger mit STRICT-Tabellen oder CHECK-Constraints.',
        ],
        paragraphsEn: [
          'MySQL strictly enforces column types like INT, VARCHAR(50), or DECIMAL(10,2) on insert. SQLite traditionally uses dynamic type affinity, though modern SQLite also supports STRICT tables and CHECK constraints.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Portables SQL für MySQL & SQLite (SqlTrainer-kompatibel)',
      titleEn: 'Portable SQL for MySQL & SQLite (SqlTrainer-compatible)',
      sql: `CREATE TABLE kurse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titel VARCHAR(100) NOT NULL,
  start_datum DATE NOT NULL,
  teilnehmer INT NOT NULL CHECK (teilnehmer >= 0)
);

INSERT INTO kurse (titel, start_datum, teilnehmer) VALUES
  ('Datenbanken Grundkurs', '2026-09-01', 24),
  ('SQL für das Abitur', '2026-10-15', 18);

SELECT titel,
       YEAR(start_datum) AS jahr,
       MONTH(start_datum) AS monat,
       CONCAT(titel, ' (', teilnehmer, ' TN)') AS anzeige
FROM kurse
ORDER BY start_datum;`,
    },
    relatedSlugs: [
      'sql-datumsfunktionen-year-month-day',
      'sql-stringfunktionen-concat-substring',
      'datenbank-vorlage-stundenplan-schule',
    ],
  },
  {
    slug: 'sql-indizes-performance-erklaert',
    category: 'ddl_design',
    publishedAt: '2026-10-28',
    readingMinutes: 7,
    titleDe: 'SQL-Indizes einfach erklärt: Wie B-Trees Abfragen beschleunigen',
    titleEn: 'SQL Indexes Explained: How B-Trees Speed Up Queries',
    descriptionDe:
      'Was ist ein Index in SQL, wie funktioniert ein B-Tree und wann lohnt sich CREATE INDEX? Verständlich erklärt mit Praxisbeispielen und Trade-offs.',
    descriptionEn:
      'What is an index in SQL, how does a B-Tree work, and when should you use CREATE INDEX? Clear explanation with practical examples and trade-offs.',
    keywordsDe: ['SQL Index erklärt', 'CREATE INDEX SQL', 'Datenbank Performance', 'B-Tree Index'],
    keywordsEn: ['SQL index explained', 'CREATE INDEX SQL', 'database performance', 'B-Tree index'],
    sections: [
      {
        headingDe: 'Full Table Scan vs. Index-Suche',
        headingEn: 'Full Table Scan vs. Index Lookup',
        paragraphsDe: [
          'Ohne Index muss die Datenbank bei einer Suche wie WHERE email = "max@example.de" jede einzelne Zeile der Tabelle prüfen (Full Table Scan). Bei 100 Zeilen fällt das kaum auf, bei 10 Millionen Zeilen dauert es jedoch spürbar lange.',
          'Ein Index funktioniert wie das Stichwortverzeichnis am Ende eines Fachbuchs: Statt jede Seite durchzublättern, schlägt die Datenbank den exakten Verweis auf die gesuchte Zeile in logarithmischer Zeit O(log n) nach.',
        ],
        paragraphsEn: [
          'Without an index, a query like WHERE email = "max@example.de" forces the database to inspect every row in the table (Full Table Scan). For 100 rows that is instant, but for 10 million rows it becomes noticeably slow.',
          'An index works like the index at the back of a textbook: instead of reading every page, the database looks up the exact pointer to matching rows in logarithmic O(log n) time.',
        ],
      },
      {
        headingDe: 'Wann ein Index sinnvoll ist – und wann nicht',
        headingEn: 'When an Index Helps—and When It Hurts',
        paragraphsDe: [
          'Primärschlüssel (PRIMARY KEY) und UNIQUE-Spalten erhalten automatisch einen Index. Zusätzliche Indizes mit CREATE INDEX lohnen sich vor allem auf Fremdschlüsseln, häufig gefilterten WHERE-Spalten und Sortier-Spalten (ORDER BY).',
          'Allerdings kostet jeder Index Speicherplatz und verlangsamt INSERT-, UPDATE- und DELETE-Befehle minimal, weil der B-Tree bei jeder Änderung mitaktualisiert werden muss.',
        ],
        paragraphsEn: [
          'PRIMARY KEY and UNIQUE columns automatically receive an index. Additional indexes via CREATE INDEX pay off most on foreign keys, frequently filtered WHERE columns, and ORDER BY columns.',
          'However, every index consumes disk space and slightly slows down INSERT, UPDATE, and DELETE operations because the B-Tree must be kept in sync.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Indizes anlegen und gezielt abfragen',
      titleEn: 'Creating Indexes and Querying Efficiently',
      sql: `CREATE TABLE bestellungen (
  id INT PRIMARY KEY,
  kunde_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  bestell_datum DATE NOT NULL,
  betrag DECIMAL(10, 2) NOT NULL
);

CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);
CREATE INDEX idx_bestellungen_status_datum ON bestellungen (status, bestell_datum);

INSERT INTO bestellungen VALUES
  (1, 101, 'bezahlt', '2026-10-01', 89.90),
  (2, 102, 'offen', '2026-10-03', 149.00),
  (3, 101, 'bezahlt', '2026-10-12', 42.50),
  (4, 103, 'offen', '2026-10-15', 219.00);

SELECT kunde_id, COUNT(*) AS anzahl, SUM(betrag) AS gesamtbetrag
FROM bestellungen
WHERE status = 'bezahlt'
GROUP BY kunde_id;`,
    },
    relatedSlugs: [
      'sql-constraints-not-null-unique-check',
      'sql-views-virtuelle-tabellen',
      'datenbank-vorlage-event-ticketing',
    ],
  },
  {
    slug: 'sql-constraints-not-null-unique-check',
    category: 'ddl_design',
    publishedAt: '2026-10-29',
    readingMinutes: 6,
    titleDe: 'SQL-Constraints: NOT NULL, UNIQUE, CHECK & DEFAULT richtig einsetzen',
    titleEn: 'SQL Constraints: Using NOT NULL, UNIQUE, CHECK & DEFAULT Properly',
    descriptionDe:
      'Datenintegrität direkt in der Datenbank sichern: Wie NOT NULL, UNIQUE, CHECK und DEFAULT fehlerhafte Datensätze zuverlässig verhindern.',
    descriptionEn:
      'Protect data integrity directly in the database: how NOT NULL, UNIQUE, CHECK, and DEFAULT reliably prevent invalid records.',
    keywordsDe: ['SQL Constraints', 'NOT NULL UNIQUE CHECK', 'Datenintegrität SQL', 'DEFAULT Constraint'],
    keywordsEn: ['SQL constraints', 'NOT NULL UNIQUE CHECK', 'data integrity SQL', 'DEFAULT constraint'],
    sections: [
      {
        headingDe: 'Warum Validierung in die Datenbank gehört',
        headingEn: 'Why Validation Belongs in the Database',
        paragraphsDe: [
          'Anwendungs-Code ändert sich oft, und manchmal greifen mehrere Skripte oder Services auf dieselbe Datenbank zu. Constraints garantieren auf Datenbankebene, dass ungültige Zustände – etwa negative Preise oder fehlende E-Mail-Adressen – gar nicht erst gespeichert werden können.',
        ],
        paragraphsEn: [
          'Application code changes often, and multiple scripts or services may write to the same database. Constraints enforce rules at the database layer so invalid states—like negative prices or missing emails—can never be persisted.',
        ],
      },
      {
        headingDe: 'Die vier wichtigsten Spalten-Constraints im Überblick',
        headingEn: 'Overview of the Four Core Column Constraints',
        paragraphsDe: [
          'NOT NULL verbietet leere (unbekannte) Werte. UNIQUE stellt sicher, dass jeder Wert in der Spalte höchstens einmal vorkommt (ideal für E-Mail, ISBN oder SKU).',
          'CHECK prüft eine beliebige Bedingung wie CHECK (alter >= 18) oder CHECK (rabatt BETWEEN 0 AND 100), während DEFAULT einen Standardwert setzt, falls beim INSERT kein Wert angegeben wird.',
        ],
        paragraphsEn: [
          'NOT NULL forbids missing (NULL) values. UNIQUE guarantees that each value appears at most once in the column (ideal for emails, ISBNs, or SKUs).',
          'CHECK validates custom conditions such as CHECK (age >= 18) or CHECK (discount BETWEEN 0 AND 100), while DEFAULT supplies a fallback value when omitted in INSERT.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Tabelle mit NOT NULL, UNIQUE, CHECK und DEFAULT',
      titleEn: 'Table with NOT NULL, UNIQUE, CHECK, and DEFAULT',
      sql: `CREATE TABLE produkte (
  id INT PRIMARY KEY,
  sku VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  preis DECIMAL(8, 2) NOT NULL CHECK (preis > 0),
  rabatt_prozent INT NOT NULL DEFAULT 0 CHECK (rabatt_prozent BETWEEN 0 AND 90),
  aktiv BOOLEAN NOT NULL DEFAULT 1
);

INSERT INTO produkte (id, sku, name, preis, rabatt_prozent) VALUES
  (1, 'PRD-01', 'Laptop-Ständer', 39.90, 10),
  (2, 'PRD-02', 'Monitorarm', 89.00, 0);

INSERT INTO produkte (id, sku, name, preis) VALUES
  (3, 'PRD-03', 'Mauspad XL', 19.90);

SELECT sku, name, preis, rabatt_prozent,
       ROUND(preis * (1 - rabatt_prozent / 100.0), 2) AS endpreis
FROM produkte
WHERE aktiv = 1;`,
    },
    relatedSlugs: [
      'sql-indizes-performance-erklaert',
      'datenbank-vorlage-lagerverwaltung',
      'sql-views-virtuelle-tabellen',
    ],
  },
  {
    slug: 'sql-datumsfunktionen-year-month-day',
    category: 'basics',
    publishedAt: '2026-10-30',
    readingMinutes: 5,
    titleDe: 'SQL-Datumsfunktionen: YEAR(), MONTH(), DAY() & CURDATE() verständlich erklärt',
    titleEn: 'SQL Date Functions: YEAR(), MONTH(), DAY() & CURDATE() Explained',
    descriptionDe:
      'Lerne, wie du mit YEAR(), MONTH(), DAY() und CURDATE() Datumsangaben in SQL zerlegst, filterst und nach Monaten oder Jahren gruppierst.',
    descriptionEn:
      'Learn how to extract, filter, and group dates in SQL using YEAR(), MONTH(), DAY(), and CURDATE().',
    keywordsDe: ['SQL Datumsfunktionen', 'YEAR MONTH DAY SQL', 'CURDATE SQL', 'Datum filtern SQL'],
    keywordsEn: ['SQL date functions', 'YEAR MONTH DAY SQL', 'CURDATE SQL', 'filter dates in SQL'],
    sections: [
      {
        headingDe: 'ISO-8601-Format als sichere Grundlage',
        headingEn: 'ISO-8601 Format as a Reliable Foundation',
        paragraphsDe: [
          'Speichere Datumsangaben in SQL immer im ISO-Format YYYY-MM-DD (z. B. 2026-10-30). Dieses Format ist international eindeutig und lässt sich auch alphabetisch korrekt sortieren.',
          'Auf Basis dieses Formats kannst du mit YEAR(datum), MONTH(datum) und DAY(datum) gezielt einzelne Bestandteile herauslösen.',
        ],
        paragraphsEn: [
          'Always store dates in SQL using the ISO format YYYY-MM-DD (for example, 2026-10-30). This format is unambiguous and sorts chronologically even as plain text.',
          'Based on this format, YEAR(date), MONTH(date), and DAY(date) let you extract individual date components cleanly.',
        ],
      },
      {
        headingDe: 'Monatsberichte mit GROUP BY erstellen',
        headingEn: 'Building Monthly Reports with GROUP BY',
        paragraphsDe: [
          'Besonders praktisch sind YEAR() und MONTH() in Kombination mit GROUP BY: So fasst du beispielsweise alle Umsätze oder Anmeldungen pro Jahr und Monat zusammen.',
        ],
        paragraphsEn: [
          'YEAR() and MONTH() are especially useful together with GROUP BY, allowing you to summarize sales or signups by year and month.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Datumsauswertung mit YEAR, MONTH, DAY und CURDATE',
      titleEn: 'Date Analysis with YEAR, MONTH, DAY, and CURDATE',
      sql: `CREATE TABLE rechnungen (
  id INT PRIMARY KEY,
  kunde VARCHAR(80) NOT NULL,
  rechnungs_datum DATE NOT NULL,
  betrag DECIMAL(10, 2) NOT NULL
);

INSERT INTO rechnungen VALUES
  (1, 'Alpha GmbH', '2026-08-14', 450.00),
  (2, 'Beta KG', '2026-08-29', 320.00),
  (3, 'Gamma AG', '2026-09-05', 890.00),
  (4, 'Delta OHG', '2026-10-12', 610.00);

SELECT YEAR(rechnungs_datum) AS jahr,
       MONTH(rechnungs_datum) AS monat,
       COUNT(*) AS anzahl_rechnungen,
       SUM(betrag) AS monatsumsatz,
       CURDATE() AS heute
FROM rechnungen
GROUP BY YEAR(rechnungs_datum), MONTH(rechnungs_datum)
ORDER BY jahr, monat;`,
    },
    relatedSlugs: [
      'mysql-vs-sqlite-unterschiede-schule',
      'sql-stringfunktionen-concat-substring',
      'datenbank-vorlage-hotelbuchung',
    ],
  },
  {
    slug: 'sql-stringfunktionen-concat-substring',
    category: 'basics',
    publishedAt: '2026-10-31',
    readingMinutes: 5,
    titleDe: 'SQL-Stringfunktionen: CONCAT(), SUBSTRING(), UPPER() & CHAR_LENGTH()',
    titleEn: 'SQL String Functions: CONCAT(), SUBSTRING(), UPPER() & CHAR_LENGTH()',
    descriptionDe:
      'Texte in SQL formatieren, kombinieren und kürzen: Alles über CONCAT, SUBSTRING, UPPER, LOWER und CHAR_LENGTH mit direkt ausführbaren Beispielen.',
    descriptionEn:
      'Format, combine, and slice text in SQL: learn CONCAT, SUBSTRING, UPPER, LOWER, and CHAR_LENGTH with runnable examples.',
    keywordsDe: ['SQL Stringfunktionen', 'CONCAT SQL', 'SUBSTRING SQL', 'CHAR_LENGTH SQL'],
    keywordsEn: ['SQL string functions', 'CONCAT SQL', 'SUBSTRING SQL', 'CHAR_LENGTH SQL'],
    sections: [
      {
        headingDe: 'Texte verbinden mit CONCAT()',
        headingEn: 'Combining Strings with CONCAT()',
        paragraphsDe: [
          'In vielen Datenbanken liegen Vorname und Nachname in getrennten Spalten. Mit CONCAT(vorname, " ", nachname) fügst du beide Werte sauber zu einem vollständigen Namen zusammen.',
          'Beachte: Ist eines der Argumente NULL, liefert CONCAT in MySQL (und auch in SqlTrainer) NULL zurück. Mit IFNULL(spalte, "") kannst du fehlende Werte elegant abfangen.',
        ],
        paragraphsEn: [
          'In many tables, first and last names are stored in separate columns. Using CONCAT(first_name, " ", last_name) combines them cleanly into a full name.',
          'Note: if any argument is NULL, CONCAT returns NULL in MySQL (and in SqlTrainer). You can guard against missing values using IFNULL(column, "").',
        ],
      },
      {
        headingDe: 'Teilstrings und Textlängen prüfen',
        headingEn: 'Extracting Substrings and Checking Length',
        paragraphsDe: [
          'SUBSTRING(text, start, laenge) beginnt in SQL bei Position 1 (nicht bei 0 wie in vielen Programmiersprachen). Zusammen mit UPPER(), LOWER() und CHAR_LENGTH() lassen sich Kürzel, Initialen oder Domain-Präfixe direkt in der Abfrage erzeugen.',
        ],
        paragraphsEn: [
          'SUBSTRING(text, start, length) is 1-indexed in SQL (unlike 0-indexed arrays in many programming languages). Combined with UPPER(), LOWER(), and CHAR_LENGTH(), you can generate initials, codes, or prefixes directly in your query.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Textverarbeitung mit CONCAT, SUBSTRING, UPPER und CHAR_LENGTH',
      titleEn: 'Text Processing with CONCAT, SUBSTRING, UPPER, and CHAR_LENGTH',
      sql: `CREATE TABLE kontakte (
  id INT PRIMARY KEY,
  vorname VARCHAR(50) NOT NULL,
  nachname VARCHAR(50) NOT NULL,
  kuerzel VARCHAR(10) NOT NULL
);

INSERT INTO kontakte VALUES
  (1, 'lena', 'meyer', 'lmey'),
  (2, 'tobias', 'schneider', 'tsch'),
  (3, 'amira', 'khoury', 'akho');

SELECT CONCAT(UPPER(SUBSTRING(vorname, 1, 1)), SUBSTRING(vorname, 2), ' ',
              UPPER(SUBSTRING(nachname, 1, 1)), SUBSTRING(nachname, 2)) AS voller_name,
       UPPER(kuerzel) AS kuerzel_gross,
       CHAR_LENGTH(nachname) AS laenge_nachname
FROM kontakte
ORDER BY nachname;`,
    },
    relatedSlugs: [
      'sql-datumsfunktionen-year-month-day',
      'mysql-vs-sqlite-unterschiede-schule',
      'sql-case-when-bedingungen',
    ],
  },
  {
    slug: 'sql-case-when-bedingungen',
    category: 'aggregation',
    publishedAt: '2026-11-01',
    readingMinutes: 6,
    titleDe: 'SQL CASE WHEN: Bedingte Logik & Kategorisierung direkt in Abfragen',
    titleEn: 'SQL CASE WHEN: Conditional Logic & Bucketing Directly in Queries',
    descriptionDe:
      'Mit CASE WHEN baust du If-Else-Logik in SQL: Werte kategorisieren, Rabattstufen berechnen und bedingte Zählungen mit SUM(CASE WHEN ...) erstellen.',
    descriptionEn:
      'Use CASE WHEN for if-else logic in SQL: categorize values, compute tiers, and build conditional counts with SUM(CASE WHEN ...).',
    keywordsDe: ['SQL CASE WHEN', 'SQL If Else', 'SQL Kategorisierung', 'SUM CASE WHEN'],
    keywordsEn: ['SQL CASE WHEN', 'SQL conditional logic', 'SQL bucketing', 'SUM CASE WHEN'],
    sections: [
      {
        headingDe: 'Wie CASE WHEN funktioniert',
        headingEn: 'How CASE WHEN Works',
        paragraphsDe: [
          'CASE WHEN ist das Gegenstück zu if / else if / else in Programmiersprachen. Die Bedingungen werden der Reihe nach geprüft; der erste zutreffende THEN-Zweig liefert das Ergebnis.',
          'Vergiss am Ende niemals das Schlüsselwort END und vergib mit AS einen sprechenden Spaltennamen.',
        ],
        paragraphsEn: [
          'CASE WHEN is SQL’s equivalent to if / else if / else. Conditions are evaluated in order, and the first matching THEN branch returns the result.',
          'Always close the expression with END and give the computed column a clear alias using AS.',
        ],
      },
      {
        headingDe: 'Bedingte Aggregationen (Pivot-Technik)',
        headingEn: 'Conditional Aggregation (Pivot Technique)',
        paragraphsDe: [
          'Besonders mächtig wird CASE WHEN innerhalb von SUM() oder COUNT(): Damit kannst du in einer einzigen Abfrage zählen, wie viele Datensätze in Kategorie A, B oder C fallen – ganz ohne mehrere getrennte SELECTs.',
        ],
        paragraphsEn: [
          'CASE WHEN becomes especially powerful inside SUM() or COUNT(): in a single query, you can count how many rows fall into bucket A, B, or C without running separate SELECT statements.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Notenstufen & Statistik mit CASE WHEN',
      titleEn: 'Grade Tiers & Statistics with CASE WHEN',
      sql: `CREATE TABLE pruefungen (
  id INT PRIMARY KEY,
  schueler VARCHAR(80) NOT NULL,
  punkte INT NOT NULL CHECK (punkte BETWEEN 0 AND 100)
);

INSERT INTO pruefungen VALUES
  (1, 'Lea', 94),
  (2, 'Jonas', 78),
  (3, 'Mia', 62),
  (4, 'Noah', 44),
  (5, 'Emma', 88);

SELECT schueler,
       punkte,
       CASE
         WHEN punkte >= 90 THEN 'Sehr gut'
         WHEN punkte >= 75 THEN 'Gut'
         WHEN punkte >= 50 THEN 'Bestanden'
         ELSE 'Nicht bestanden'
       END AS bewertung
FROM pruefungen
ORDER BY punkte DESC;

SELECT COUNT(*) AS gesamt,
       SUM(CASE WHEN punkte >= 50 THEN 1 ELSE 0 END) AS bestanden_anzahl,
       SUM(CASE WHEN punkte < 50 THEN 1 ELSE 0 END) AS durchgefallen_anzahl
FROM pruefungen;`,
    },
    relatedSlugs: [
      'datenbank-vorlage-fussballverein',
      'sql-views-virtuelle-tabellen',
      'sql-stringfunktionen-concat-substring',
    ],
  },
  {
    slug: 'sql-views-virtuelle-tabellen',
    category: 'ddl_design',
    publishedAt: '2026-11-02',
    readingMinutes: 6,
    titleDe: 'SQL Views (Sichten): Virtuelle Tabellen sinnvoll erstellen und nutzen',
    titleEn: 'SQL Views: Creating and Using Virtual Tables Effectively',
    descriptionDe:
      'Was sind SQL Views, wie erstellt man sie mit CREATE VIEW und welche Vorteile bieten sie für Lesbarkeit, Wiederverwendung und Datenschutz?',
    descriptionEn:
      'What are SQL views, how do you create them with CREATE VIEW, and how do they improve readability, reuse, and data abstraction?',
    keywordsDe: ['SQL Views', 'CREATE VIEW SQL', 'Virtuelle Tabellen SQL', 'SQL Sichten'],
    keywordsEn: ['SQL views', 'CREATE VIEW SQL', 'virtual tables SQL', 'SQL abstraction'],
    sections: [
      {
        headingDe: 'Was ist eine View in SQL?',
        headingEn: 'What Is a View in SQL?',
        paragraphsDe: [
          'Eine View (Sicht) ist eine gespeicherte SELECT-Abfrage, die sich nach außen wie eine normale Tabelle verhält. Sie speichert selbst keine Daten doppelt, sondern berechnet das Ergebnis beim Abfragen dynamisch aus den zugrundeliegenden Basistabellen.',
        ],
        paragraphsEn: [
          'A view is a stored SELECT query that behaves like a regular table. It does not duplicate data on disk; instead, it computes the result dynamically from the underlying base tables whenever queried.',
        ],
      },
      {
        headingDe: 'Drei gute Gründe für Views',
        headingEn: 'Three Good Reasons to Use Views',
        paragraphsDe: [
          'Erstens vereinfachen Views komplexe JOINs und Berechnungen, sodass Teammitglieder oder Berichte einfach SELECT * FROM v_umsatz_pro_kunde schreiben können.',
          'Zweitens lassen sich sensible Spalten (wie Gehälter oder Passwort-Hashes) ausblenden, indem man nur unkritische Spalten in die View aufnimmt.',
        ],
        paragraphsEn: [
          'First, views encapsulate complex JOINs and calculations so teammates or reports can simply query SELECT * FROM v_customer_revenue.',
          'Second, views can hide sensitive columns (such as salaries or password hashes) by exposing only safe columns.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'View für Bestellübersicht mit CREATE VIEW',
      titleEn: 'Order Summary View with CREATE VIEW',
      sql: `CREATE TABLE kunden (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  stadt VARCHAR(60) NOT NULL
);

CREATE TABLE auftraege (
  id INT PRIMARY KEY,
  kunde_id INT NOT NULL,
  betrag DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

INSERT INTO kunden VALUES (1, 'Anna Weber', 'Berlin'), (2, 'Tom Klein', 'Hamburg');
INSERT INTO auftraege VALUES (1, 1, 120.00), (2, 1, 80.50), (3, 2, 250.00);

CREATE VIEW v_kunden_umsatz AS
SELECT k.id AS kunde_id,
       k.name,
       k.stadt,
       COUNT(a.id) AS anzahl_auftraege,
       IFNULL(SUM(a.betrag), 0) AS gesamtumsatz
FROM kunden k
LEFT JOIN auftraege a ON k.id = a.kunde_id
GROUP BY k.id, k.name, k.stadt;

SELECT * FROM v_kunden_umsatz
WHERE gesamtumsatz > 100
ORDER BY gesamtumsatz DESC;`,
    },
    relatedSlugs: [
      'sql-indizes-performance-erklaert',
      'sql-constraints-not-null-unique-check',
      'sql-case-when-bedingungen',
    ],
  },
  {
    slug: 'codemirror-6-sql-autocomplete-architektur',
    category: 'opensource_tech',
    publishedAt: '2026-11-05',
    readingMinutes: 8,
    titleDe: 'CodeMirror 6 im SQL-Editor: Schema-bewusstes Autocomplete unter der Haube',
    titleEn: 'CodeMirror 6 in a SQL Editor: Schema-Aware Autocomplete Under the Hood',
    descriptionDe:
      'Wie wir in SqlTrainer mit @codemirror/lang-sql und einem dynamischen Schema-Compartment live Tabellennamen und Spalten vorschlagen.',
    descriptionEn:
      'How SqlTrainer uses @codemirror/lang-sql and a dynamic schema Compartment to provide live table and column autocomplete.',
    keywordsDe: ['CodeMirror 6 SQL', 'SQL Autocomplete Architektur', 'Compartment CodeMirror', 'Open Source SQL Editor'],
    keywordsEn: ['CodeMirror 6 SQL', 'SQL autocomplete architecture', 'CodeMirror Compartment', 'open source SQL editor'],
    sections: [
      {
        headingDe: 'Warum CodeMirror 6 ideal für Browser-IDEs ist',
        headingEn: 'Why CodeMirror 6 Is Ideal for Browser IDEs',
        paragraphsDe: [
          'Ein guter SQL-Editor braucht mehr als nur Syntax-Highlighting: Lernende erwarten sofortige Vorschläge für Tabellen- und Spaltennamen, sobald sie ein neues Schema erstellen oder zwischen Datenbanken wechseln.',
          'CodeMirror 6 setzt auf einen unveränderlichen EditorState und modulare Extensions. Über ein Compartment lässt sich die SQL-Konfiguration zur Laufzeit neu einhängen, ohne dass Cursorposition oder Undo-Verlauf verloren gehen.',
        ],
        paragraphsEn: [
          'A great SQL editor needs more than syntax highlighting: learners expect instant suggestions for table and column names as soon as they create a new schema or switch databases.',
          'CodeMirror 6 is built around an immutable EditorState and modular extensions. Using a Compartment, we can reconfigure the SQL language extension at runtime without losing cursor position or undo history.',
        ],
      },
      {
        headingDe: 'Schema-Synchronisation nach jedem DDL-Befehl',
        headingEn: 'Syncing the Schema After Every DDL Statement',
        paragraphsDe: [
          'Nach jeder Ausführung in der SQL-Engine liest SqlTrainer die aktuellen Metadaten (Tabellen und Spalten) aus sqlite_master und PRAGMA table_info aus und baut daraus ein Schema-Objekt für @codemirror/lang-sql.',
          'Anschließend wird dieses Schema per StateEffect.reconfigure in den laufenden Editor eingespielt – so stehen neu angelegte Tabellen sofort im Autocomplete bereit.',
        ],
        paragraphsEn: [
          'After every execution in the SQL engine, SqlTrainer inspects current table and column metadata via sqlite_master and PRAGMA table_info and builds a schema map for @codemirror/lang-sql.',
          'We then dispatch a StateEffect.reconfigure to the active editor so newly created tables appear in autocomplete immediately.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Beispiel-Schema zum Testen von Tabellen- & Spalten-Autocomplete',
      titleEn: 'Sample Schema for Testing Table & Column Autocomplete',
      sql: `CREATE TABLE entwickler (
  id INT PRIMARY KEY,
  handle VARCHAR(50) NOT NULL UNIQUE,
  sprache VARCHAR(30) NOT NULL
);

CREATE TABLE repositories (
  id INT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(80) NOT NULL,
  stars INT NOT NULL DEFAULT 0,
  FOREIGN KEY (owner_id) REFERENCES entwickler(id)
);

INSERT INTO entwickler VALUES (1, 'eren', 'TypeScript'), (2, 'alex', 'SQL');
INSERT INTO repositories VALUES (1, 1, 'SqlTrainer', 420), (2, 2, 'QueryLab', 85);

SELECT e.handle, r.name, r.stars
FROM repositories r
JOIN entwickler e ON r.owner_id = e.id
ORDER BY r.stars DESC;`,
    },
    relatedSlugs: [
      'indexeddb-sqlite-persistenz-im-browser',
      'tauri-v2-desktop-app-auto-updater',
      'sql-views-virtuelle-tabellen',
    ],
  },
  {
    slug: 'indexeddb-sqlite-persistenz-im-browser',
    category: 'opensource_tech',
    publishedAt: '2026-11-08',
    readingMinutes: 7,
    titleDe: 'SQLite im Browser dauerhaft speichern: IndexedDB-Persistenz mit sql.js',
    titleEn: 'Persisting SQLite in the Browser: IndexedDB Storage with sql.js',
    descriptionDe:
      'So bleiben selbst erstellte Tabellen und Daten im Browser nach dem Neuladen erhalten: Binäre SQLite-Snapshots in IndexedDB erklärt.',
    descriptionEn:
      'How custom tables and rows survive page reloads in the browser: binary SQLite snapshots in IndexedDB explained.',
    keywordsDe: ['IndexedDB SQLite', 'sql.js Persistenz', 'WebAssembly SQLite', 'Browser Datenbank speichern'],
    keywordsEn: ['IndexedDB SQLite', 'sql.js persistence', 'WebAssembly SQLite', 'browser database storage'],
    sections: [
      {
        headingDe: 'Das Flüchtigkeitsproblem von In-Memory-Datenbanken',
        headingEn: 'The Ephemeral Nature of In-Memory Databases',
        paragraphsDe: [
          'sql.js kompiliert SQLite nach WebAssembly (WASM) und führt die gesamte Datenbank im Arbeitsspeicher des Browsers aus. Sobald der Tab geschlossen oder neu geladen wird, wäre ein reiner RAM-Zustand verloren.',
          'LocalStorage ist mit meist 5 MB Limit und reinem String-Format für binäre Datenbankdateien ungeeignet. IndexedDB hingegen speichert strukturierte Objekte und Uint8Array-Blobs problemlos und asynchron.',
        ],
        paragraphsEn: [
          'sql.js compiles SQLite to WebAssembly (WASM) and runs the entire database in browser memory. As soon as the tab closes or reloads, a pure RAM-only state would be lost.',
          'LocalStorage, with its ~5 MB limit and string-only API, is poorly suited for binary database files. IndexedDB, by contrast, stores structured records and Uint8Array blobs asynchronously.',
        ],
      },
      {
        headingDe: 'Export als Uint8Array und Debounced Save',
        headingEn: 'Exporting as Uint8Array and Debounced Saves',
        paragraphsDe: [
          'Mit db.export() liefert sql.js den kompletten Zustand der SQLite-Datenbank als kompaktes Uint8Array. Nach schreibenden Statements (CREATE, INSERT, UPDATE, DELETE) schreibt SqlTrainer diesen Snapshot verzögert (debounced) in IndexedDB.',
          'Beim nächsten Besuch wird das Byte-Array aus IndexedDB geladen und direkt an new SQL.Database(bytes) übergeben – alle Tabellen, Daten und Projekte sind sofort wieder da.',
        ],
        paragraphsEn: [
          'Calling db.export() in sql.js serializes the entire SQLite database into a compact Uint8Array. After write statements (CREATE, INSERT, UPDATE, DELETE), SqlTrainer writes this snapshot to IndexedDB on a debounce.',
          'On the next visit, the byte array is read from IndexedDB and passed straight into new SQL.Database(bytes)—every table, row, and project is restored instantly.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Persistente Nutzertabelle zum Ausprobieren im Workspace',
      titleEn: 'Persistent User Table to Try in the Workspace',
      sql: `CREATE TABLE notizen (
  id INT PRIMARY KEY,
  titel VARCHAR(100) NOT NULL,
  erstellt_am DATE NOT NULL,
  wichtig BOOLEAN NOT NULL DEFAULT 0
);

INSERT INTO notizen VALUES
  (1, 'IndexedDB speichert Uint8Array-Blobs', '2026-11-08', 1),
  (2, 'sql.js läuft komplett offline im Browser', '2026-11-08', 1);

SELECT id, titel, erstellt_am
FROM notizen
WHERE wichtig = 1;`,
    },
    relatedSlugs: [
      'codemirror-6-sql-autocomplete-architektur',
      'tauri-v2-desktop-app-auto-updater',
      'mysql-vs-sqlite-unterschiede-schule',
    ],
  },
  {
    slug: 'tauri-v2-desktop-app-auto-updater',
    category: 'opensource_tech',
    publishedAt: '2026-11-12',
    readingMinutes: 7,
    titleDe: 'Von der Web-App zur Desktop-App mit Tauri v2: Dateisystem & Auto-Updater',
    titleEn: 'From Web App to Desktop App with Tauri v2: Filesystem & Auto-Updater',
    descriptionDe:
      'Warum SqlTrainer auf Tauri v2 setzt: Schlanke Desktop-Bundles für macOS, Windows und Linux, native Datei-Dialoge und signierter Auto-Updater.',
    descriptionEn:
      'Why SqlTrainer uses Tauri v2: lightweight desktop bundles for macOS, Windows, and Linux, native file dialogs, and a signed auto-updater.',
    keywordsDe: ['Tauri v2 Desktop App', 'Tauri Auto Updater', 'React TypeScript Tauri', 'Open Source Desktop App'],
    keywordsEn: ['Tauri v2 desktop app', 'Tauri auto updater', 'React TypeScript Tauri', 'open source desktop app'],
    sections: [
      {
        headingDe: 'Warum Tauri v2 statt Electron?',
        headingEn: 'Why Tauri v2 Instead of Electron?',
        paragraphsDe: [
          'Während klassische Electron-Apps für jedes Fenster eine eigene Chromium-Instanz mitliefern und schnell über 150 MB groß werden, nutzt Tauri v2 die bereits im Betriebssystem vorhandene WebView (WebKit auf macOS, WebView2 auf Windows).',
          'Das Ergebnis sind Installationspakete von wenigen Megabyte, extrem schneller Start und geringer RAM-Verbrauch – bei identischem React- und TypeScript-Frontend.',
        ],
        paragraphsEn: [
          'While traditional Electron apps bundle a full Chromium runtime and easily exceed 150 MB, Tauri v2 uses the operating system’s native WebView (WebKit on macOS, WebView2 on Windows).',
          'The result is a tiny installer of just a few megabytes, fast startup, and low memory usage—while sharing the exact same React and TypeScript frontend.',
        ],
      },
      {
        headingDe: 'Native Plugins: Dialog, FS und signierter Auto-Updater',
        headingEn: 'Native Plugins: Dialog, FS, and Signed Auto-Updater',
        paragraphsDe: [
          'Über @tauri-apps/plugin-dialog und @tauri-apps/plugin-fs lassen sich SQL-Skripte und .sqlite-Dateien direkt über native Systemdialoge öffnen und speichern.',
          'Gleichzeitig sorgt @tauri-apps/plugin-updater in Kombination mit kryptografisch signierten GitHub-Releases dafür, dass Desktop-Nutzerinnen neue Versionen sicher und direkt in der App installieren können.',
        ],
        paragraphsEn: [
          'With @tauri-apps/plugin-dialog and @tauri-apps/plugin-fs, users can open and save SQL scripts and .sqlite files through native OS dialogs.',
          'At the same time, @tauri-apps/plugin-updater combined with cryptographically signed GitHub releases lets desktop users install new versions safely right inside the app.',
        ],
      },
    ],
    codeExample: {
      titleDe: 'Release-Metadaten als SQL-Tabelle modelliert',
      titleEn: 'Modeling Release Metadata as a SQL Table',
      sql: `CREATE TABLE app_releases (
  id INT PRIMARY KEY,
  version VARCHAR(20) NOT NULL,
  plattform VARCHAR(30) NOT NULL,
  release_datum DATE NOT NULL,
  signiert BOOLEAN NOT NULL DEFAULT 1,
  UNIQUE (version, plattform)
);

INSERT INTO app_releases VALUES
  (1, '1.0.0', 'macOS-arm64', '2026-10-01', 1),
  (2, '1.0.1', 'windows-x86_64', '2026-11-10', 1),
  (3, '1.0.1', 'linux-AppImage', '2026-11-10', 1);

SELECT version, plattform, release_datum
FROM app_releases
WHERE signiert = 1
ORDER BY release_datum DESC;`,
    },
    relatedSlugs: [
      'codemirror-6-sql-autocomplete-architektur',
      'indexeddb-sqlite-persistenz-im-browser',
      'sql-constraints-not-null-unique-check',
    ],
  },
];

