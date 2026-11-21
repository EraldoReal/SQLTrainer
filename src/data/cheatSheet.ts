import type { CheatSheetItem } from '@/types/sql';

export const CHEAT_SHEET_ITEMS: CheatSheetItem[] = [
  {
    id: 'select',
    categoryDe: 'Abfragen',
    categoryEn: 'Queries',
    titleDe: 'SELECT',
    titleEn: 'SELECT',
    syntax: 'SELECT spalte1, spalte2\nFROM tabelle;',
    descriptionDe:
      'Wählt bestimmte Spalten (oder * für alle Spalten) aus einer Tabelle aus. Mit DISTINCT werden Duplikate entfernt.',
    descriptionEn:
      'Selects specific columns (or * for all columns) from a table. Use DISTINCT to remove duplicate rows.',
    exampleSql: 'SELECT vorname, nachname, klasse\nFROM schueler;',
  },
  {
    id: 'where',
    categoryDe: 'Abfragen',
    categoryEn: 'Queries',
    titleDe: 'WHERE',
    titleEn: 'WHERE',
    syntax: 'SELECT *\nFROM tabelle\nWHERE bedingung;',
    descriptionDe:
      'Filtert Zeilen nach einer Bedingung (=, <>, <, >, <=, >=, AND, OR, IN, BETWEEN, LIKE, IS NULL).',
    descriptionEn:
      'Filters rows by a condition (=, <>, <, >, <=, >=, AND, OR, IN, BETWEEN, LIKE, IS NULL).',
    exampleSql: "SELECT titel, dauer_min\nFROM filme\nWHERE genre = 'Sci-Fi' AND dauer_min > 120;",
  },
  {
    id: 'order-by',
    categoryDe: 'Abfragen',
    categoryEn: 'Queries',
    titleDe: 'ORDER BY',
    titleEn: 'ORDER BY',
    syntax: 'SELECT *\nFROM tabelle\nORDER BY spalte ASC|DESC;',
    descriptionDe:
      'Sortiert das Ergebnis aufsteigend (ASC, Standard) oder absteigend (DESC), auch nach mehreren Spalten.',
    descriptionEn:
      'Sorts the result ascending (ASC, default) or descending (DESC), optionally by multiple columns.',
    exampleSql: 'SELECT name, preis\nFROM artikel\nORDER BY preis DESC, name ASC;',
  },
  {
    id: 'inner-join',
    categoryDe: 'Joins',
    categoryEn: 'Joins',
    titleDe: 'INNER JOIN',
    titleEn: 'INNER JOIN',
    syntax:
      'SELECT a.spalte, b.spalte\nFROM tabelle_a a\nINNER JOIN tabelle_b b ON a.id = b.a_id;',
    descriptionDe:
      'Verknüpft zwei Tabellen über eine gemeinsame Schlüsselspalte und liefert nur zueinander passende Zeilen.',
    descriptionEn:
      'Combines two tables via a matching key column and returns only rows that have a match in both tables.',
    exampleSql:
      'SELECT k.bezeichnung, l.nachname\nFROM kurse k\nINNER JOIN lehrer l ON k.lehrer_id = l.lehrer_id;',
  },
  {
    id: 'left-join',
    categoryDe: 'Joins',
    categoryEn: 'Joins',
    titleDe: 'LEFT JOIN',
    titleEn: 'LEFT JOIN',
    syntax:
      'SELECT a.spalte, b.spalte\nFROM tabelle_a a\nLEFT JOIN tabelle_b b ON a.id = b.a_id;',
    descriptionDe:
      'Behält alle Zeilen der linken Tabelle, auch wenn in der rechten Tabelle kein passender Eintrag existiert (NULL).',
    descriptionEn:
      'Keeps all rows from the left table even when there is no matching row in the right table (NULL).',
    exampleSql:
      'SELECT k.vorname, k.nachname, COUNT(b.bestellung_id) AS anzahl\nFROM kunden k\nLEFT JOIN bestellungen b ON k.kunde_id = b.kunde_id\nGROUP BY k.kunde_id, k.vorname, k.nachname;',
  },
  {
    id: 'group-by',
    categoryDe: 'Aggregation',
    categoryEn: 'Aggregation',
    titleDe: 'GROUP BY',
    titleEn: 'GROUP BY',
    syntax:
      'SELECT gruppe, COUNT(*), AVG(wert)\nFROM tabelle\nGROUP BY gruppe;',
    descriptionDe:
      'Fasst Zeilen mit gleichen Werten zusammen, um Aggregatfunktionen wie COUNT, SUM, AVG, MIN oder MAX pro Gruppe zu berechnen.',
    descriptionEn:
      'Groups rows sharing the same values so aggregate functions like COUNT, SUM, AVG, MIN, or MAX can be computed per group.',
    exampleSql:
      'SELECT jahrgang, COUNT(*) AS anzahl\nFROM schueler\nGROUP BY jahrgang;',
  },
  {
    id: 'having',
    categoryDe: 'Aggregation',
    categoryEn: 'Aggregation',
    titleDe: 'HAVING',
    titleEn: 'HAVING',
    syntax:
      'SELECT gruppe, AVG(wert) AS schnitt\nFROM tabelle\nGROUP BY gruppe\nHAVING AVG(wert) >= 10;',
    descriptionDe:
      'Filtert erst nach der Gruppierung (anders als WHERE, das vor GROUP BY einzelne Zeilen filtert).',
    descriptionEn:
      'Filters groups after GROUP BY (unlike WHERE, which filters individual rows before grouping).',
    exampleSql:
      'SELECT kurs_id, ROUND(AVG(note_punkte), 2) AS durchschnitt\nFROM belegt\nGROUP BY kurs_id\nHAVING AVG(note_punkte) >= 12;',
  },
  {
    id: 'insert',
    categoryDe: 'Daten ändern (DML)',
    categoryEn: 'Modify Data (DML)',
    titleDe: 'INSERT INTO',
    titleEn: 'INSERT INTO',
    syntax:
      'INSERT INTO tabelle (spalte1, spalte2)\nVALUES (wert1, wert2);',
    descriptionDe:
      'Fügt einen oder mehrere neue Datensätze in eine Tabelle ein.',
    descriptionEn: 'Inserts one or more new rows into a table.',
    exampleSql:
      "INSERT INTO lehrer (lehrer_id, vorname, nachname, kuerzel, fach_haupt, einstellungsjahr)\nVALUES (7, 'Julia', 'Mayer', 'MAY', 'Biologie', 2023);",
  },
  {
    id: 'update',
    categoryDe: 'Daten ändern (DML)',
    categoryEn: 'Modify Data (DML)',
    titleDe: 'UPDATE',
    titleEn: 'UPDATE',
    syntax:
      'UPDATE tabelle\nSET spalte = neuer_wert\nWHERE bedingung;',
    descriptionDe:
      'Aktualisiert bestehende Datensätze. Ohne WHERE werden alle Zeilen der Tabelle geändert!',
    descriptionEn:
      'Updates existing rows. Without a WHERE clause, every row in the table is updated!',
    exampleSql:
      'UPDATE artikel\nSET preis = 32.00\nWHERE artikel_id = 4;',
  },
  {
    id: 'create-table',
    categoryDe: 'Struktur (DDL)',
    categoryEn: 'Schema (DDL)',
    titleDe: 'CREATE TABLE',
    titleEn: 'CREATE TABLE',
    syntax:
      'CREATE TABLE tabelle (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(80) NOT NULL,\n  ref_id INTEGER,\n  FOREIGN KEY (ref_id) REFERENCES andere_tabelle(id)\n);',
    descriptionDe:
      'Erstellt eine neue Tabelle mit Spalten, Datentypen, Primärschlüssel (PRIMARY KEY) und Fremdschlüsseln (FOREIGN KEY).',
    descriptionEn:
      'Creates a new table with columns, data types, PRIMARY KEY, and FOREIGN KEY constraints.',
    exampleSql:
      'CREATE TABLE raeume (\n  raum_id INTEGER PRIMARY KEY,\n  bezeichnung VARCHAR(40) NOT NULL,\n  plaetze INTEGER NOT NULL\n);',
  },
  {
    id: 'show-describe',
    categoryDe: 'Metadaten (MySQL)',
    categoryEn: 'Metadata (MySQL)',
    titleDe: 'SHOW TABLES / DESCRIBE',
    titleEn: 'SHOW TABLES / DESCRIBE',
    syntax: 'SHOW TABLES;\nDESCRIBE tabelle;',
    descriptionDe:
      'MySQL-Schulstandard zur Anzeige aller Tabellen der Datenbank bzw. der Spaltenstruktur einer Tabelle.',
    descriptionEn:
      'MySQL school-standard commands to list all tables in the database or inspect a table’s column definitions.',
    exampleSql: 'SHOW TABLES;\nDESCRIBE schueler;',
  },
];
