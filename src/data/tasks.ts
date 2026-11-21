import type { SqlTask } from '@/types/sql';

export const SQL_TASKS: SqlTask[] = [
  // =========================================================================
  // SCHULE (12 Aufgaben)
  // =========================================================================
  {
    id: 'schule-1-basics',
    databaseId: 'schule',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Schülerinnen und Schüler im Jahrgang 12',
    titleEn: 'Students in Grade 12',
    promptDe:
      'Gib Vorname, Nachname und Klasse aller Schülerinnen und Schüler des Jahrgangs 12 aus, alphabetisch sortiert nach Nachname und anschließend Vorname.',
    promptEn:
      'Return first name, last name, and class of all students in grade 12, sorted alphabetically by last name and then first name.',
    hintDe: 'Nutze WHERE jahrgang = 12 und ORDER BY nachname, vorname.',
    hintEn: 'Use WHERE jahrgang = 12 and ORDER BY nachname, vorname.',
    solutionSql: `SELECT vorname, nachname, klasse
FROM schueler
WHERE jahrgang = 12
ORDER BY nachname ASC, vorname ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-2-basics',
    databaseId: 'schule',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Leistungskurse mit mindestens 5 Wochenstunden',
    titleEn: 'Advanced Courses (5+ Weekly Hours)',
    promptDe:
      'Zeige Bezeichnung, Fach und Wochenstunden aller Kurse mit mindestens 5 Wochenstunden, absteigend sortiert nach Bezeichnung.',
    promptEn:
      'List designation, subject, and weekly hours of all courses with at least 5 weekly hours, sorted descending by designation.',
    hintDe: 'Filtere mit wochenstunden >= 5 und sortiere mit ORDER BY bezeichnung DESC.',
    hintEn: 'Filter with wochenstunden >= 5 and sort using ORDER BY bezeichnung DESC.',
    solutionSql: `SELECT bezeichnung, fach, wochenstunden
FROM kurse
WHERE wochenstunden >= 5
ORDER BY bezeichnung DESC;`,
    checkOrder: true,
  },
  {
    id: 'schule-3-aggregation',
    databaseId: 'schule',
    topic: 'aggregation',
    isAbitur: false,
    titleDe: 'Schüleranzahl pro Jahrgang',
    titleEn: 'Student Count per Grade',
    promptDe:
      'Ermittle für jeden Jahrgang die Anzahl der Schülerinnen und Schüler (Spalte anzahl). Sortiere aufsteigend nach Jahrgang.',
    promptEn:
      'Determine the number of students per grade (column anzahl). Sort ascending by grade.',
    hintDe: 'Gruppiere mit GROUP BY jahrgang und verwende COUNT(*) AS anzahl.',
    hintEn: 'Group with GROUP BY jahrgang and use COUNT(*) AS anzahl.',
    solutionSql: `SELECT jahrgang, COUNT(*) AS anzahl
FROM schueler
GROUP BY jahrgang
ORDER BY jahrgang ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-4-aggregation',
    databaseId: 'schule',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Kurse mit überdurchschnittlichem Notenschnitt',
    titleEn: 'Courses with High Average Grade Points',
    promptDe:
      'Berechne für jeden Kurs (kurs_id) die durchschnittliche Punktzahl (durchschnitt, gerundet auf 2 Nachkommastellen) und gib nur Kurse aus, deren Schnitt mindestens 12.0 Punkte beträgt. Sortiere absteigend nach durchschnitt.',
    promptEn:
      'Calculate the average grade points (durchschnitt, rounded to 2 decimals) per course (kurs_id) and return only courses with an average of at least 12.0 points. Sort descending by durchschnitt.',
    hintDe: 'Verwende GROUP BY kurs_id mit HAVING AVG(note_punkte) >= 12.0 und ROUND(..., 2).',
    hintEn: 'Use GROUP BY kurs_id with HAVING AVG(note_punkte) >= 12.0 and ROUND(..., 2).',
    solutionSql: `SELECT kurs_id, ROUND(AVG(note_punkte), 2) AS durchschnitt
FROM belegt
GROUP BY kurs_id
HAVING AVG(note_punkte) >= 12.0
ORDER BY durchschnitt DESC, kurs_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-5-joins',
    databaseId: 'schule',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Kurse und ihre Lehrkräfte',
    titleEn: 'Courses and Their Teachers',
    promptDe:
      'Liste zu jedem Kurs die Kursbezeichnung, das Kürzel der unterrichtenden Lehrkraft sowie deren Nachnamen auf. Sortiere alphabetisch nach Kursbezeichnung.',
    promptEn:
      'List each course designation together with the teaching teacher’s abbreviation (kuerzel) and last name. Sort alphabetically by course designation.',
    hintDe: 'Verbinde kurse und lehrer über lehrer_id mit INNER JOIN.',
    hintEn: 'Join kurse and lehrer on lehrer_id using INNER JOIN.',
    solutionSql: `SELECT k.bezeichnung, l.kuerzel, l.nachname
FROM kurse k
INNER JOIN lehrer l ON k.lehrer_id = l.lehrer_id
ORDER BY k.bezeichnung ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-6-joins',
    databaseId: 'schule',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'Belegungen im Fach Informatik',
    titleEn: 'Enrollments in Computer Science',
    promptDe:
      'Gib Vorname, Nachname der Schülerinnen und Schüler sowie Kursbezeichnung und Notenpunkte für alle Belegungen im Fach "Informatik" aus. Sortiere absteigend nach note_punkte und danach nach nachname.',
    promptEn:
      'Return student first name, last name, course designation, and grade points for all enrollments in subject "Informatik". Sort descending by note_punkte and then by nachname.',
    hintDe: 'Verknüpfe schueler, belegt und kurse über die jeweiligen IDs und filtere k.fach = \'Informatik\'.',
    hintEn: 'Join schueler, belegt, and kurse on their keys and filter k.fach = \'Informatik\'.',
    solutionSql: `SELECT s.vorname, s.nachname, k.bezeichnung, b.note_punkte
FROM belegt b
INNER JOIN schueler s ON b.schueler_id = s.schueler_id
INNER JOIN kurse k ON b.kurs_id = k.kurs_id
WHERE k.fach = 'Informatik'
ORDER BY b.note_punkte DESC, s.nachname ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-7-subqueries_ddl',
    databaseId: 'schule',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Schüler ohne Kursbelegung (Unterabfrage)',
    titleEn: 'Students Without Any Course Enrollment',
    promptDe:
      'Finde mit einer Unterabfrage alle Schülerinnen und Schüler (schueler_id, vorname, nachname, klasse), die derzeit keinen einzigen Kurs belegt haben. Sortiere nach schueler_id.',
    promptEn:
      'Use a subquery to find all students (schueler_id, vorname, nachname, klasse) who are currently not enrolled in any course. Sort by schueler_id.',
    hintDe: 'Nutze WHERE schueler_id NOT IN (SELECT schueler_id FROM belegt).',
    hintEn: 'Use WHERE schueler_id NOT IN (SELECT schueler_id FROM belegt).',
    solutionSql: `SELECT schueler_id, vorname, nachname, klasse
FROM schueler
WHERE schueler_id NOT IN (
  SELECT schueler_id FROM belegt
)
ORDER BY schueler_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-8-subqueries_ddl',
    databaseId: 'schule',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Überdurchschnittliche Leistungen im Kurs 101',
    titleEn: 'Above-Average Grades in Course 101',
    promptDe:
      'Gib Vorname, Nachname und note_punkte aller Schülerinnen und Schüler im Kurs 101 aus, deren Punktzahl über dem Gesamtdurchschnitt aller Belegungen in Kurs 101 liegt. Sortiere absteigend nach note_punkte.',
    promptEn:
      'Return first name, last name, and note_punkte of all students in course 101 whose points exceed the average grade points of course 101. Sort descending by note_punkte.',
    hintDe: 'Vergleiche b.note_punkte > (SELECT AVG(note_punkte) FROM belegt WHERE kurs_id = 101).',
    hintEn: 'Compare b.note_punkte > (SELECT AVG(note_punkte) FROM belegt WHERE kurs_id = 101).',
    solutionSql: `SELECT s.vorname, s.nachname, b.note_punkte
FROM belegt b
INNER JOIN schueler s ON b.schueler_id = s.schueler_id
WHERE b.kurs_id = 101
  AND b.note_punkte > (
    SELECT AVG(note_punkte)
    FROM belegt
    WHERE kurs_id = 101
  )
ORDER BY b.note_punkte DESC, s.nachname ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-9-joins',
    databaseId: 'schule',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'Belegungen im Jahrgang 12 mit Kurs und Lehrkraft',
    titleEn: 'Grade 12 Enrollments with Course and Teacher',
    promptDe:
      'Gib für alle Schülerinnen und Schüler des Jahrgangs 12 den Schülernachnamen (schueler_nachname), die Kursbezeichnung (bezeichnung), den Nachnamen der Lehrkraft (lehrer_nachname) sowie note_punkte aus. Sortiere nach schueler_nachname und bezeichnung aufsteigend.',
    promptEn:
      'Return student last name (schueler_nachname), course designation (bezeichnung), teacher last name (lehrer_nachname), and note_punkte for all students in grade 12. Sort ascending by schueler_nachname and bezeichnung.',
    hintDe: 'Verknüpfe belegt, schueler, kurse und lehrer über ihre Schlüssel und filtere s.jahrgang = 12.',
    hintEn: 'Join belegt, schueler, kurse, and lehrer on their keys and filter s.jahrgang = 12.',
    solutionSql: `SELECT s.nachname AS schueler_nachname,
       k.bezeichnung,
       l.nachname AS lehrer_nachname,
       b.note_punkte
FROM belegt b
INNER JOIN schueler s ON b.schueler_id = s.schueler_id
INNER JOIN kurse k ON b.kurs_id = k.kurs_id
INNER JOIN lehrer l ON k.lehrer_id = l.lehrer_id
WHERE s.jahrgang = 12
ORDER BY schueler_nachname ASC, k.bezeichnung ASC;`,
    checkOrder: true,
  },
  {
    id: 'schule-10-subqueries_ddl',
    databaseId: 'schule',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Neuen Kurs anlegen und Wochenstunden aktualisieren',
    titleEn: 'Insert New Course and Update Weekly Hours',
    promptDe:
      'Füge in die Tabelle kurse einen neuen Kurs ein (kurs_id: 109, bezeichnung: "Biologie GK 12", fach: "Biologie", wochenstunden: 3, lehrer_id: 1) und erhöhe anschließend die wochenstunden von Kurs 105 auf 4.',
    promptEn:
      'Insert a new course into kurse (kurs_id: 109, bezeichnung: "Biologie GK 12", fach: "Biologie", wochenstunden: 3, lehrer_id: 1) and then update wochenstunden of course 105 to 4.',
    hintDe: 'Nutze INSERT INTO kurse (...) VALUES (...); gefolgt von UPDATE kurse SET wochenstunden = 4 WHERE kurs_id = 105;.',
    hintEn: 'Use INSERT INTO kurse (...) VALUES (...); followed by UPDATE kurse SET wochenstunden = 4 WHERE kurs_id = 105;.',
    solutionSql: `INSERT INTO kurse (kurs_id, bezeichnung, fach, wochenstunden, lehrer_id)
VALUES (109, 'Biologie GK 12', 'Biologie', 3, 1);

UPDATE kurse
SET wochenstunden = 4
WHERE kurs_id = 105;`,
  },
  {
    id: 'schule-11-subqueries_ddl',
    databaseId: 'schule',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Belegungen unter 8 Punkten löschen',
    titleEn: 'Delete Enrollments Below 8 Points',
    promptDe:
      'Lösche aus der Tabelle belegt alle Einträge, bei denen note_punkte kleiner als 8 ist.',
    promptEn:
      'Delete all rows from table belegt where note_punkte is less than 8.',
    hintDe: 'Nutze DELETE FROM belegt WHERE note_punkte < 8;.',
    hintEn: 'Use DELETE FROM belegt WHERE note_punkte < 8;.',
    solutionSql: `DELETE FROM belegt
WHERE note_punkte < 8;`,
  },
  {
    id: 'schule-12-subqueries_ddl',
    databaseId: 'schule',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Raumtabelle erstellen und Kurse erweitern',
    titleEn: 'Create Rooms Table and Alter Courses',
    promptDe:
      'Erstelle eine neue Tabelle raeume mit den Spalten raum_id (INTEGER PRIMARY KEY), bezeichnung (TEXT NOT NULL) und kapazitaet (INTEGER NOT NULL). Füge danach der Tabelle kurse eine neue Spalte raum_id vom Typ INTEGER hinzu.',
    promptEn:
      'Create a new table raeume with columns raum_id (INTEGER PRIMARY KEY), bezeichnung (TEXT NOT NULL), and kapazitaet (INTEGER NOT NULL). Then add a new column raum_id of type INTEGER to table kurse.',
    hintDe: 'Verwende CREATE TABLE raeume (...) und ALTER TABLE kurse ADD COLUMN raum_id INTEGER;.',
    hintEn: 'Use CREATE TABLE raeume (...) and ALTER TABLE kurse ADD COLUMN raum_id INTEGER;.',
    solutionSql: `CREATE TABLE raeume (
  raum_id INTEGER PRIMARY KEY,
  bezeichnung TEXT NOT NULL,
  kapazitaet INTEGER NOT NULL
);

ALTER TABLE kurse ADD COLUMN raum_id INTEGER;`,
  },

  // =========================================================================
  // ONLINESHOP (12 Aufgaben)
  // =========================================================================
  {
    id: 'shop-1-basics',
    databaseId: 'onlineshop',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Elektronik-Artikel unter 100 Euro',
    titleEn: 'Electronics Products Under 100 EUR',
    promptDe:
      'Gib Name, Preis und Lagerbestand aller Artikel der Kategorie "Elektronik" aus, die weniger als 100 Euro kosten. Sortiere aufsteigend nach Preis.',
    promptEn:
      'Return name, price, and stock of all products in category "Elektronik" costing less than 100 EUR. Sort ascending by price.',
    hintDe: 'Kombiniere kategorie = \'Elektronik\' AND preis < 100.',
    hintEn: 'Combine kategorie = \'Elektronik\' AND preis < 100.',
    solutionSql: `SELECT name, preis, lagerbestand
FROM artikel
WHERE kategorie = 'Elektronik' AND preis < 100
ORDER BY preis ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-2-basics',
    databaseId: 'onlineshop',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Kundinnen und Kunden aus Berlin oder München',
    titleEn: 'Customers from Berlin or Munich',
    promptDe:
      'Zeige Vorname, Nachname, Stadt und E-Mail aller Kundinnen und Kunden aus Berlin oder München, sortiert nach Stadt und Nachname.',
    promptEn:
      'Show first name, last name, city, and email of all customers from Berlin or München, sorted by city and last name.',
    hintDe: 'Nutze WHERE stadt IN (\'Berlin\', \'München\').',
    hintEn: 'Use WHERE stadt IN (\'Berlin\', \'München\').',
    solutionSql: `SELECT vorname, nachname, stadt, email
FROM kunden
WHERE stadt IN ('Berlin', 'München')
ORDER BY stadt ASC, nachname ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-3-aggregation',
    databaseId: 'onlineshop',
    topic: 'aggregation',
    isAbitur: false,
    titleDe: 'Artikelanzahl und Durchschnittspreis je Kategorie',
    titleEn: 'Product Count and Average Price per Category',
    promptDe:
      'Berechne für jede Artikelkategorie die Anzahl der Artikel (anzahl) sowie den durchschnittlichen Preis (avg_preis, auf 2 Nachkommastellen gerundet). Sortiere alphabetisch nach Kategorie.',
    promptEn:
      'Calculate the number of products (anzahl) and average price (avg_preis, rounded to 2 decimals) for each category. Sort alphabetically by category.',
    hintDe: 'Nutze GROUP BY kategorie mit COUNT(*) und ROUND(AVG(preis), 2).',
    hintEn: 'Use GROUP BY kategorie with COUNT(*) and ROUND(AVG(preis), 2).',
    solutionSql: `SELECT kategorie, COUNT(*) AS anzahl, ROUND(AVG(preis), 2) AS avg_preis
FROM artikel
GROUP BY kategorie
ORDER BY kategorie ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-4-aggregation',
    databaseId: 'onlineshop',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Umsatz je Bestellung (ohne Stornierungen)',
    titleEn: 'Revenue per Order (Excluding Cancelled)',
    promptDe:
      'Berechne den Gesamtbetrag (gesamtbetrag = SUM(menge * einzelpreis), gerundet auf 2 Nachkommastellen) für jede nicht stornierte Bestellung. Gib bestellung_id, bestelldatum und gesamtbetrag aus, absteigend sortiert nach gesamtbetrag.',
    promptEn:
      'Calculate the total amount (gesamtbetrag = SUM(menge * einzelpreis), rounded to 2 decimals) for each non-cancelled order. Return bestellung_id, bestelldatum, and gesamtbetrag, sorted descending by gesamtbetrag.',
    hintDe: 'Verknüpfe bestellungen und bestellpositionen, filtere status <> \'storniert\' und gruppiere nach bestellung_id und bestelldatum.',
    hintEn: 'Join bestellungen and bestellpositionen, filter status <> \'storniert\', and group by bestellung_id and bestelldatum.',
    solutionSql: `SELECT b.bestellung_id, b.bestelldatum, ROUND(SUM(p.menge * p.einzelpreis), 2) AS gesamtbetrag
FROM bestellungen b
INNER JOIN bestellpositionen p ON b.bestellung_id = p.bestellung_id
WHERE b.status <> 'storniert'
GROUP BY b.bestellung_id, b.bestelldatum
ORDER BY gesamtbetrag DESC, b.bestellung_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-5-joins',
    databaseId: 'onlineshop',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Bestellungen mit Kundennamen',
    titleEn: 'Orders with Customer Names',
    promptDe:
      'Zeige für alle Bestellungen die bestellung_id, das bestelldatum, den status sowie Vor- und Nachname des zugehörigen Kunden. Sortiere aufsteigend nach bestellung_id.',
    promptEn:
      'Show bestellung_id, bestelldatum, status, and customer first/last name for all orders. Sort ascending by bestellung_id.',
    hintDe: 'Verbinde bestellungen und kunden über kunde_id.',
    hintEn: 'Join bestellungen and kunden on kunde_id.',
    solutionSql: `SELECT b.bestellung_id, b.bestelldatum, b.status, k.vorname, k.nachname
FROM bestellungen b
INNER JOIN kunden k ON b.kunde_id = k.kunde_id
ORDER BY b.bestellung_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-6-joins',
    databaseId: 'onlineshop',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'Alle Kunden und ihre Bestellanzahl (LEFT JOIN)',
    titleEn: 'All Customers and Their Order Count (LEFT JOIN)',
    promptDe:
      'Liste alle Kundinnen und Kunden (kunde_id, vorname, nachname) zusammen mit der Anzahl ihrer Bestellungen (bestellanzahl) auf – auch diejenigen mit 0 Bestellungen. Sortiere absteigend nach bestellanzahl, dann nach kunde_id.',
    promptEn:
      'List all customers (kunde_id, vorname, nachname) together with their number of orders (bestellanzahl), including customers with 0 orders. Sort descending by bestellanzahl, then by kunde_id.',
    hintDe: 'Verwende LEFT JOIN bestellungen und zähle COUNT(b.bestellung_id), nicht COUNT(*).',
    hintEn: 'Use LEFT JOIN bestellungen and count COUNT(b.bestellung_id), not COUNT(*).',
    solutionSql: `SELECT k.kunde_id, k.vorname, k.nachname, COUNT(b.bestellung_id) AS bestellanzahl
FROM kunden k
LEFT JOIN bestellungen b ON k.kunde_id = b.kunde_id
GROUP BY k.kunde_id, k.vorname, k.nachname
ORDER BY bestellanzahl DESC, k.kunde_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-7-subqueries_ddl',
    databaseId: 'onlineshop',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Nie bestellte Artikel',
    titleEn: 'Products Never Ordered',
    promptDe:
      'Finde mit einer Unterabfrage alle Artikel (artikel_id, name, kategorie, preis), die noch in keiner Bestellposition vorkommen. Sortiere nach artikel_id.',
    promptEn:
      'Use a subquery to find all products (artikel_id, name, kategorie, preis) that do not appear in any order line item. Sort by artikel_id.',
    hintDe: 'Nutze WHERE artikel_id NOT IN (SELECT artikel_id FROM bestellpositionen).',
    hintEn: 'Use WHERE artikel_id NOT IN (SELECT artikel_id FROM bestellpositionen).',
    solutionSql: `SELECT artikel_id, name, kategorie, preis
FROM artikel
WHERE artikel_id NOT IN (
  SELECT artikel_id FROM bestellpositionen
)
ORDER BY artikel_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-8-subqueries_ddl',
    databaseId: 'onlineshop',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Artikel über dem Gesamtdurchschnittspreis',
    titleEn: 'Products Priced Above Overall Average',
    promptDe:
      'Gib Name, Kategorie und Preis aller Artikel aus, deren Preis über dem Durchschnittspreis aller Artikel liegt. Sortiere absteigend nach Preis.',
    promptEn:
      'Return name, category, and price of all products whose price is above the average price of all products. Sort descending by price.',
    hintDe: 'Vergleiche preis > (SELECT AVG(preis) FROM artikel).',
    hintEn: 'Compare preis > (SELECT AVG(preis) FROM artikel).',
    solutionSql: `SELECT name, kategorie, preis
FROM artikel
WHERE preis > (
  SELECT AVG(preis) FROM artikel
)
ORDER BY preis DESC, name ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-9-joins',
    databaseId: 'onlineshop',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Kundinnen und Kunden ohne Bestellung (LEFT JOIN)',
    titleEn: 'Customers Without Any Orders (LEFT JOIN)',
    promptDe:
      'Finde mithilfe eines LEFT JOIN alle Kundinnen und Kunden (kunde_id, vorname, nachname, stadt), die noch keine einzige Bestellung aufgegeben haben. Sortiere aufsteigend nach kunde_id.',
    promptEn:
      'Use a LEFT JOIN to find all customers (kunde_id, vorname, nachname, stadt) who have never placed an order. Sort ascending by kunde_id.',
    hintDe: 'Verbinde kunden mit bestellungen über LEFT JOIN und filtere WHERE b.bestellung_id IS NULL.',
    hintEn: 'Join kunden with bestellungen using LEFT JOIN and filter WHERE b.bestellung_id IS NULL.',
    solutionSql: `SELECT k.kunde_id, k.vorname, k.nachname, k.stadt
FROM kunden k
LEFT JOIN bestellungen b ON k.kunde_id = b.kunde_id
WHERE b.bestellung_id IS NULL
ORDER BY k.kunde_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-10-aggregation',
    databaseId: 'onlineshop',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Stammkunden mit mindestens 200 Euro Umsatz',
    titleEn: 'High-Value Customers (200+ EUR Revenue)',
    promptDe:
      'Ermittle alle Kundinnen und Kunden (kunde_id, vorname, nachname), deren Gesamtumsatz aus nicht stornierten Bestellungen (gesamtumsatz = ROUND(SUM(menge * einzelpreis), 2)) mindestens 200.00 Euro beträgt. Sortiere absteigend nach gesamtumsatz, danach aufsteigend nach kunde_id.',
    promptEn:
      'Find all customers (kunde_id, vorname, nachname) whose total revenue from non-cancelled orders (gesamtumsatz = ROUND(SUM(menge * einzelpreis), 2)) is at least 200.00 EUR. Sort descending by gesamtumsatz, then ascending by kunde_id.',
    hintDe: 'Verknüpfe kunden, bestellungen und bestellpositionen, filtere b.status <> \'storniert\' und nutze HAVING SUM(p.menge * p.einzelpreis) >= 200.',
    hintEn: 'Join kunden, bestellungen, and bestellpositionen, filter b.status <> \'storniert\', and use HAVING SUM(p.menge * p.einzelpreis) >= 200.',
    solutionSql: `SELECT k.kunde_id,
       k.vorname,
       k.nachname,
       ROUND(SUM(p.menge * p.einzelpreis), 2) AS gesamtumsatz
FROM kunden k
INNER JOIN bestellungen b ON k.kunde_id = b.kunde_id
INNER JOIN bestellpositionen p ON b.bestellung_id = p.bestellung_id
WHERE b.status <> 'storniert'
GROUP BY k.kunde_id, k.vorname, k.nachname
HAVING SUM(p.menge * p.einzelpreis) >= 200
ORDER BY gesamtumsatz DESC, k.kunde_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'shop-11-subqueries_ddl',
    databaseId: 'onlineshop',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Preise anpassen und ausverkaufte Artikel entfernen',
    titleEn: 'Update Prices and Delete Out-of-Stock Products',
    promptDe:
      'Erhöhe den Preis aller Artikel der Kategorie "Bücher" um 10 % (auf 2 Nachkommastellen gerundet mit ROUND(preis * 1.1, 2)) und lösche anschließend alle Artikel mit lagerbestand = 0.',
    promptEn:
      'Increase the price of all products in category "Bücher" by 10% (rounded to 2 decimals with ROUND(preis * 1.1, 2)) and then delete all products with lagerbestand = 0.',
    hintDe: 'Nutze UPDATE artikel SET preis = ROUND(preis * 1.1, 2) WHERE kategorie = \'Bücher\'; und DELETE FROM artikel WHERE lagerbestand = 0;.',
    hintEn: 'Use UPDATE artikel SET preis = ROUND(preis * 1.1, 2) WHERE kategorie = \'Bücher\'; and DELETE FROM artikel WHERE lagerbestand = 0;.',
    solutionSql: `UPDATE artikel
SET preis = ROUND(preis * 1.1, 2)
WHERE kategorie = 'Bücher';

DELETE FROM artikel
WHERE lagerbestand = 0;`,
  },
  {
    id: 'shop-12-subqueries_ddl',
    databaseId: 'onlineshop',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Gutscheintabelle anlegen und Bestellungen erweitern',
    titleEn: 'Create Vouchers Table and Alter Orders',
    promptDe:
      'Erstelle eine Tabelle gutscheine mit den Spalten gutschein_id (INTEGER PRIMARY KEY), code (TEXT NOT NULL) und rabatt_prozent (INTEGER NOT NULL). Ergänze anschließend die Tabelle bestellungen um eine Spalte gutschein_id (INTEGER).',
    promptEn:
      'Create a table gutscheine with columns gutschein_id (INTEGER PRIMARY KEY), code (TEXT NOT NULL), and rabatt_prozent (INTEGER NOT NULL). Then add a column gutschein_id (INTEGER) to table bestellungen.',
    hintDe: 'Verwende CREATE TABLE gutscheine (...) und ALTER TABLE bestellungen ADD COLUMN gutschein_id INTEGER;.',
    hintEn: 'Use CREATE TABLE gutscheine (...) and ALTER TABLE bestellungen ADD COLUMN gutschein_id INTEGER;.',
    solutionSql: `CREATE TABLE gutscheine (
  gutschein_id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  rabatt_prozent INTEGER NOT NULL
);

ALTER TABLE bestellungen ADD COLUMN gutschein_id INTEGER;`,
  },

  // =========================================================================
  // KINO (12 Aufgaben)
  // =========================================================================
  {
    id: 'kino-1-basics',
    databaseId: 'kino',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Sci-Fi-Filme mit Überlänge',
    titleEn: 'Long Sci-Fi Movies',
    promptDe:
      'Zeige Titel, Laufzeit (dauer_min) und Erscheinungsjahr aller Filme des Genres "Sci-Fi", die länger als 120 Minuten dauern. Sortiere absteigend nach dauer_min.',
    promptEn:
      'Show title, runtime (dauer_min), and release year of all "Sci-Fi" movies longer than 120 minutes. Sort descending by dauer_min.',
    hintDe: 'Filtere mit WHERE genre = \'Sci-Fi\' AND dauer_min > 120.',
    hintEn: 'Filter with WHERE genre = \'Sci-Fi\' AND dauer_min > 120.',
    solutionSql: `SELECT titel, dauer_min, erscheinungsjahr
FROM filme
WHERE genre = 'Sci-Fi' AND dauer_min > 120
ORDER BY dauer_min DESC;`,
    checkOrder: true,
  },
  {
    id: 'kino-2-basics',
    databaseId: 'kino',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Kinosäle mit 3D-Technik',
    titleEn: '3D-Capable Cinema Halls',
    promptDe:
      'Gib Name und Sitzplatzanzahl (plaetze) aller Kinosäle aus, die über 3D-Technik verfügen (hat_3d = 1). Sortiere absteigend nach plaetze.',
    promptEn:
      'Return name and seat capacity (plaetze) of all halls equipped with 3D (hat_3d = 1). Sort descending by plaetze.',
    hintDe: 'Nutze WHERE hat_3d = 1 und ORDER BY plaetze DESC.',
    hintEn: 'Use WHERE hat_3d = 1 and ORDER BY plaetze DESC.',
    solutionSql: `SELECT name, plaetze
FROM saele
WHERE hat_3d = 1
ORDER BY plaetze DESC;`,
    checkOrder: true,
  },
  {
    id: 'kino-3-aggregation',
    databaseId: 'kino',
    topic: 'aggregation',
    isAbitur: false,
    titleDe: 'Ticketumsatz und Verkäufe pro Vorstellung',
    titleEn: 'Ticket Revenue and Count per Screening',
    promptDe:
      'Berechne für jede vorstellung_id die Anzahl verkaufter Tickets (verkauft) und die gesamten Ticketeinnahmen (einnahmen, auf 2 Nachkommastellen gerundet). Sortiere aufsteigend nach vorstellung_id.',
    promptEn:
      'Calculate the number of sold tickets (verkauft) and total ticket revenue (einnahmen, rounded to 2 decimals) for each vorstellung_id. Sort ascending by vorstellung_id.',
    hintDe: 'Gruppiere nach vorstellung_id und verwende COUNT(*) sowie ROUND(SUM(preis), 2).',
    hintEn: 'Group by vorstellung_id and use COUNT(*) and ROUND(SUM(preis), 2).',
    solutionSql: `SELECT vorstellung_id, COUNT(*) AS verkauft, ROUND(SUM(preis), 2) AS einnahmen
FROM tickets
GROUP BY vorstellung_id
ORDER BY vorstellung_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-4-aggregation',
    databaseId: 'kino',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Genres mit mehr als einem Film',
    titleEn: 'Genres with Multiple Movies',
    promptDe:
      'Ermittle alle Filmgenres, zu denen mindestens 2 Filme in der Datenbank gespeichert sind. Gib genre, anzahl_filme und die durchschnittliche Laufzeit (avg_dauer, gerundet auf 1 Nachkommastelle) aus, sortiert nach anzahl_filme absteigend und genre aufsteigend.',
    promptEn:
      'Find all movie genres with at least 2 movies in the database. Return genre, anzahl_filme, and average runtime (avg_dauer, rounded to 1 decimal), sorted by anzahl_filme descending and genre ascending.',
    hintDe: 'Nutze GROUP BY genre HAVING COUNT(*) >= 2.',
    hintEn: 'Use GROUP BY genre HAVING COUNT(*) >= 2.',
    solutionSql: `SELECT genre, COUNT(*) AS anzahl_filme, ROUND(AVG(dauer_min), 1) AS avg_dauer
FROM filme
GROUP BY genre
HAVING COUNT(*) >= 2
ORDER BY anzahl_filme DESC, genre ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-5-joins',
    databaseId: 'kino',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Spielplan mit Filmtitel und Saalname',
    titleEn: 'Schedule with Movie Title and Hall Name',
    promptDe:
      'Liste alle Vorstellungen mit datum, uhrzeit, Filmtitel (titel) und Saalname (saalname) auf. Sortiere chronologisch nach datum und uhrzeit.',
    promptEn:
      'List all screenings with datum, uhrzeit, movie title (titel), and hall name (saalname). Sort chronologically by datum and uhrzeit.',
    hintDe: 'Verbinde vorstellungen mit filme über film_id und mit saele über saal_id.',
    hintEn: 'Join vorstellungen with filme on film_id and saele on saal_id.',
    solutionSql: `SELECT v.datum, v.uhrzeit, f.titel, s.name AS saalname
FROM vorstellungen v
INNER JOIN filme f ON v.film_id = f.film_id
INNER JOIN saele s ON v.saal_id = s.saal_id
ORDER BY v.datum ASC, v.uhrzeit ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-6-joins',
    databaseId: 'kino',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'Einnahmen pro Film inklusive Filmen ohne Vorstellung',
    titleEn: 'Revenue per Movie Including Unscheduled Movies',
    promptDe:
      'Berechne für jeden Film (film_id, titel) die Anzahl der Vorstellungen (vorstellungen_anzahl) und die gesamten Ticketeinnahmen (gesamt_einnahmen, 0.0 falls keine Tickets verkauft wurden). Sortiere absteigend nach gesamt_einnahmen, dann nach film_id.',
    promptEn:
      'Calculate for each movie (film_id, titel) the number of screenings (vorstellungen_anzahl) and total ticket revenue (gesamt_einnahmen, 0.0 if no tickets were sold). Sort descending by gesamt_einnahmen, then by film_id.',
    hintDe: 'Nutze LEFT JOIN von filme über vorstellungen zu tickets sowie COALESCE(ROUND(SUM(t.preis), 2), 0.0) und COUNT(DISTINCT v.vorstellung_id).',
    hintEn: 'Use LEFT JOIN from filme through vorstellungen to tickets, plus COALESCE(ROUND(SUM(t.preis), 2), 0.0) and COUNT(DISTINCT v.vorstellung_id).',
    solutionSql: `SELECT f.film_id,
       f.titel,
       COUNT(DISTINCT v.vorstellung_id) AS vorstellungen_anzahl,
       COALESCE(ROUND(SUM(t.preis), 2), 0.0) AS gesamt_einnahmen
FROM filme f
LEFT JOIN vorstellungen v ON f.film_id = v.film_id
LEFT JOIN tickets t ON v.vorstellung_id = t.vorstellung_id
GROUP BY f.film_id, f.titel
ORDER BY gesamt_einnahmen DESC, f.film_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-7-subqueries_ddl',
    databaseId: 'kino',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Filme ohne geplante Vorstellung',
    titleEn: 'Movies Without Scheduled Screenings',
    promptDe:
      'Finde mithilfe einer Unterabfrage alle Filme (film_id, titel, genre), für die noch keine Vorstellung geplant ist. Sortiere nach film_id.',
    promptEn:
      'Use a subquery to find all movies (film_id, titel, genre) that have no scheduled screening yet. Sort by film_id.',
    hintDe: 'Nutze WHERE film_id NOT IN (SELECT film_id FROM vorstellungen).',
    hintEn: 'Use WHERE film_id NOT IN (SELECT film_id FROM vorstellungen).',
    solutionSql: `SELECT film_id, titel, genre
FROM filme
WHERE film_id NOT IN (
  SELECT film_id FROM vorstellungen
)
ORDER BY film_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-8-subqueries_ddl',
    databaseId: 'kino',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Vorstellungen in den größten Sälen',
    titleEn: 'Screenings in Above-Average Capacity Halls',
    promptDe:
      'Gib vorstellung_id, datum, uhrzeit und grundpreis aller Vorstellungen aus, die in einem Saal stattfinden, dessen Sitzplatzanzahl über dem Durchschnitt aller Säle liegt. Sortiere aufsteigend nach vorstellung_id.',
    promptEn:
      'Return vorstellung_id, datum, uhrzeit, and grundpreis of all screenings taking place in a hall whose seat capacity is above the average of all halls. Sort ascending by vorstellung_id.',
    hintDe: 'Verwende saal_id IN (SELECT saal_id FROM saele WHERE plaetze > (SELECT AVG(plaetze) FROM saele)).',
    hintEn: 'Use saal_id IN (SELECT saal_id FROM saele WHERE plaetze > (SELECT AVG(plaetze) FROM saele)).',
    solutionSql: `SELECT vorstellung_id, datum, uhrzeit, grundpreis
FROM vorstellungen
WHERE saal_id IN (
  SELECT saal_id
  FROM saele
  WHERE plaetze > (SELECT AVG(plaetze) FROM saele)
)
ORDER BY vorstellung_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-9-aggregation',
    databaseId: 'kino',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Ticketumsatz nach Filmgenre',
    titleEn: 'Ticket Revenue by Movie Genre',
    promptDe:
      'Berechne für jedes Filmgenre die Anzahl verkaufter Tickets (verkaufte_tickets) sowie den gesamten Ticketumsatz (umsatz, auf 2 Nachkommastellen gerundet). Gib nur Genres mit mindestens 3 verkauften Tickets aus, sortiert nach umsatz absteigend und genre aufsteigend.',
    promptEn:
      'Calculate the number of sold tickets (verkaufte_tickets) and total ticket revenue (umsatz, rounded to 2 decimals) for each movie genre. Return only genres with at least 3 sold tickets, sorted by umsatz descending and genre ascending.',
    hintDe: 'Verknüpfe filme, vorstellungen und tickets, gruppiere nach f.genre und filtere mit HAVING COUNT(t.ticket_id) >= 3.',
    hintEn: 'Join filme, vorstellungen, and tickets, group by f.genre, and filter with HAVING COUNT(t.ticket_id) >= 3.',
    solutionSql: `SELECT f.genre,
       COUNT(t.ticket_id) AS verkaufte_tickets,
       ROUND(SUM(t.preis), 2) AS umsatz
FROM filme f
INNER JOIN vorstellungen v ON f.film_id = v.film_id
INNER JOIN tickets t ON v.vorstellung_id = t.vorstellung_id
GROUP BY f.genre
HAVING COUNT(t.ticket_id) >= 3
ORDER BY umsatz DESC, f.genre ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-10-joins',
    databaseId: 'kino',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Ermäßigte Tickets mit Film und Saal',
    titleEn: 'Discounted Tickets with Movie and Hall',
    promptDe:
      'Liste alle ermäßigten Tickets (ermaessigt = 1) mit ticket_id, Filmtitel (titel), Saalname (saalname), Vorstellungsdatum (datum) und Ticketpreis (preis) auf. Sortiere aufsteigend nach ticket_id.',
    promptEn:
      'List all discounted tickets (ermaessigt = 1) with ticket_id, movie title (titel), hall name (saalname), screening date (datum), and ticket price (preis). Sort ascending by ticket_id.',
    hintDe: 'Verknüpfe tickets, vorstellungen, filme und saele und filtere WHERE t.ermaessigt = 1.',
    hintEn: 'Join tickets, vorstellungen, filme, and saele and filter WHERE t.ermaessigt = 1.',
    solutionSql: `SELECT t.ticket_id, f.titel, s.name AS saalname, v.datum, t.preis
FROM tickets t
INNER JOIN vorstellungen v ON t.vorstellung_id = v.vorstellung_id
INNER JOIN filme f ON v.film_id = f.film_id
INNER JOIN saele s ON v.saal_id = s.saal_id
WHERE t.ermaessigt = 1
ORDER BY t.ticket_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'kino-11-subqueries_ddl',
    databaseId: 'kino',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Film hinzufügen, Preise erhöhen, alte Filme löschen',
    titleEn: 'Insert Movie, Update Prices, Delete Old Movies',
    promptDe:
      'Füge den Film (9, "Nachtzug nach Wien", "Thriller", 115, 16, 2025) in filme ein, erhöhe den grundpreis aller Vorstellungen in Saal 1 um 1.00 Euro und lösche alle Filme mit erscheinungsjahr < 2023.',
    promptEn:
      'Insert movie (9, "Nachtzug nach Wien", "Thriller", 115, 16, 2025) into filme, increase grundpreis of all screenings in hall 1 by 1.00 EUR, and delete all movies with erscheinungsjahr < 2023.',
    hintDe: 'Kombiniere INSERT INTO filme ..., UPDATE vorstellungen SET grundpreis = grundpreis + 1.0 WHERE saal_id = 1; und DELETE FROM filme WHERE erscheinungsjahr < 2023;.',
    hintEn: 'Combine INSERT INTO filme ..., UPDATE vorstellungen SET grundpreis = grundpreis + 1.0 WHERE saal_id = 1; and DELETE FROM filme WHERE erscheinungsjahr < 2023;.',
    solutionSql: `INSERT INTO filme (film_id, titel, genre, dauer_min, fsk, erscheinungsjahr)
VALUES (9, 'Nachtzug nach Wien', 'Thriller', 115, 16, 2025);

UPDATE vorstellungen
SET grundpreis = grundpreis + 1.0
WHERE saal_id = 1;

DELETE FROM filme
WHERE erscheinungsjahr < 2023;`,
  },
  {
    id: 'kino-12-subqueries_ddl',
    databaseId: 'kino',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Personal-Tabelle erstellen und Vorstellungen zuordnen',
    titleEn: 'Create Staff Table and Extend Screenings',
    promptDe:
      'Erstelle eine Tabelle mitarbeiter mit mitarbeiter_id (INTEGER PRIMARY KEY), vorname (TEXT NOT NULL), nachname (TEXT NOT NULL) und rolle (TEXT NOT NULL). Füge danach der Tabelle vorstellungen eine Spalte schichtleiter_id (INTEGER) hinzu.',
    promptEn:
      'Create a table mitarbeiter with mitarbeiter_id (INTEGER PRIMARY KEY), vorname (TEXT NOT NULL), nachname (TEXT NOT NULL), and rolle (TEXT NOT NULL). Then add column schichtleiter_id (INTEGER) to table vorstellungen.',
    hintDe: 'Nutze CREATE TABLE mitarbeiter (...) und ALTER TABLE vorstellungen ADD COLUMN schichtleiter_id INTEGER;.',
    hintEn: 'Use CREATE TABLE mitarbeiter (...) and ALTER TABLE vorstellungen ADD COLUMN schichtleiter_id INTEGER;.',
    solutionSql: `CREATE TABLE mitarbeiter (
  mitarbeiter_id INTEGER PRIMARY KEY,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  rolle TEXT NOT NULL
);

ALTER TABLE vorstellungen ADD COLUMN schichtleiter_id INTEGER;`,
  },

  // =========================================================================
  // LEER / EIGENE DATENBANK (12 Aufgaben – Aufbau von Grund auf)
  // =========================================================================
  {
    id: 'leer-1-basics',
    databaseId: 'leer',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Erste eigene Tabelle erstellen (CREATE TABLE)',
    titleEn: 'Create Your First Table (CREATE TABLE)',
    promptDe:
      'Erstelle in der leeren Datenbank die Tabelle buecher mit den Spalten buch_id (INTEGER PRIMARY KEY), titel (TEXT NOT NULL), autor (TEXT NOT NULL) und seiten (INTEGER NOT NULL).',
    promptEn:
      'Create table buecher in the empty database with columns buch_id (INTEGER PRIMARY KEY), titel (TEXT NOT NULL), autor (TEXT NOT NULL), and seiten (INTEGER NOT NULL).',
    hintDe: 'Nutze CREATE TABLE buecher (buch_id INTEGER PRIMARY KEY, ...);.',
    hintEn: 'Use CREATE TABLE buecher (buch_id INTEGER PRIMARY KEY, ...);.',
    solutionSql: `CREATE TABLE buecher (
  buch_id INTEGER PRIMARY KEY,
  titel TEXT NOT NULL,
  autor TEXT NOT NULL,
  seiten INTEGER NOT NULL
);`,
  },
  {
    id: 'leer-2-basics',
    databaseId: 'leer',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Tabelle mit UNIQUE und DEFAULT anlegen',
    titleEn: 'Create Table with UNIQUE and DEFAULT',
    promptDe:
      'Erstelle die Tabelle mitglieder mit mitglied_id (INTEGER PRIMARY KEY), benutzername (TEXT NOT NULL UNIQUE), rolle (TEXT NOT NULL DEFAULT \'leser\') und aktiv (INTEGER NOT NULL DEFAULT 1).',
    promptEn:
      'Create table mitglieder with mitglied_id (INTEGER PRIMARY KEY), benutzername (TEXT NOT NULL UNIQUE), rolle (TEXT NOT NULL DEFAULT \'leser\'), and aktiv (INTEGER NOT NULL DEFAULT 1).',
    hintDe: 'Definiere UNIQUE direkt bei benutzername und DEFAULT \'leser\' bzw. DEFAULT 1 bei rolle und aktiv.',
    hintEn: 'Define UNIQUE on benutzername and DEFAULT \'leser\' / DEFAULT 1 on rolle and aktiv.',
    solutionSql: `CREATE TABLE mitglieder (
  mitglied_id INTEGER PRIMARY KEY,
  benutzername TEXT NOT NULL UNIQUE,
  rolle TEXT NOT NULL DEFAULT 'leser',
  aktiv INTEGER NOT NULL DEFAULT 1
);`,
  },
  {
    id: 'leer-3-basics',
    databaseId: 'leer',
    topic: 'basics',
    isAbitur: false,
    titleDe: 'Automatische IDs (AUTOINCREMENT) und INSERT INTO',
    titleEn: 'Auto-Increment IDs and INSERT INTO',
    promptDe:
      'Erstelle die Tabelle aufgaben mit aufgabe_id (INTEGER PRIMARY KEY AUTOINCREMENT), titel (TEXT NOT NULL) und erledigt (INTEGER NOT NULL DEFAULT 0). Füge anschließend drei Zeilen ohne Angabe von aufgabe_id ein: ("SQL lernen", 1), ("Schema entwerfen", 0) und ("JOINs üben", 0). (Im MySQL-Modus wird auch INT AUTO_INCREMENT PRIMARY KEY automatisch unterstützt.)',
    promptEn:
      'Create table aufgaben with aufgabe_id (INTEGER PRIMARY KEY AUTOINCREMENT), titel (TEXT NOT NULL), and erledigt (INTEGER NOT NULL DEFAULT 0). Then insert three rows without specifying aufgabe_id: ("SQL lernen", 1), ("Schema entwerfen", 0), and ("JOINs üben", 0). (MySQL-style INT AUTO_INCREMENT PRIMARY KEY is also supported in MySQL mode.)',
    hintDe: 'Nutze INTEGER PRIMARY KEY AUTOINCREMENT und INSERT INTO aufgaben (titel, erledigt) VALUES (...);.',
    hintEn: 'Use INTEGER PRIMARY KEY AUTOINCREMENT and INSERT INTO aufgaben (titel, erledigt) VALUES (...);.',
    solutionSql: `CREATE TABLE aufgaben (
  aufgabe_id INTEGER PRIMARY KEY AUTOINCREMENT,
  titel TEXT NOT NULL,
  erledigt INTEGER NOT NULL DEFAULT 0
);

INSERT INTO aufgaben (titel, erledigt) VALUES
  ('SQL lernen', 1),
  ('Schema entwerfen', 0),
  ('JOINs üben', 0);`,
  },
  {
    id: 'leer-4-subqueries_ddl',
    databaseId: 'leer',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Tabelle anlegen, befüllen und mit ALTER TABLE erweitern',
    titleEn: 'Create, Populate, and Alter Table',
    promptDe:
      'Erstelle die Tabelle produkte (produkt_id INTEGER PRIMARY KEY, name TEXT NOT NULL, preis REAL NOT NULL), füge die Produkte (1, "Notizbuch", 4.50) und (2, "Kugelschreiber", 1.90) ein und ergänze danach die Spalte kategorie (TEXT) per ALTER TABLE.',
    promptEn:
      'Create table produkte (produkt_id INTEGER PRIMARY KEY, name TEXT NOT NULL, preis REAL NOT NULL), insert (1, "Notizbuch", 4.50) and (2, "Kugelschreiber", 1.90), and then add column kategorie (TEXT) using ALTER TABLE.',
    hintDe: 'Nutze CREATE TABLE, INSERT INTO und abschließend ALTER TABLE produkte ADD COLUMN kategorie TEXT;.',
    hintEn: 'Use CREATE TABLE, INSERT INTO, and finally ALTER TABLE produkte ADD COLUMN kategorie TEXT;.',
    solutionSql: `CREATE TABLE produkte (
  produkt_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  preis REAL NOT NULL
);

INSERT INTO produkte (produkt_id, name, preis) VALUES
  (1, 'Notizbuch', 4.50),
  (2, 'Kugelschreiber', 1.90);

ALTER TABLE produkte ADD COLUMN kategorie TEXT;`,
  },
  {
    id: 'leer-5-subqueries_ddl',
    databaseId: 'leer',
    topic: 'subqueries_ddl',
    isAbitur: false,
    titleDe: 'Daten einfügen, ändern (UPDATE) und löschen (DELETE)',
    titleEn: 'Insert, Update, and Delete Rows',
    promptDe:
      'Erstelle die Tabelle inventar (item_id INTEGER PRIMARY KEY, name TEXT NOT NULL, bestand INTEGER NOT NULL), füge (1, "Monitor", 5), (2, "Kabel", 0) und (3, "Maus", 12) ein, setze den bestand von "Monitor" auf 8 und lösche alle Zeilen mit bestand = 0.',
    promptEn:
      'Create table inventar (item_id INTEGER PRIMARY KEY, name TEXT NOT NULL, bestand INTEGER NOT NULL), insert (1, "Monitor", 5), (2, "Kabel", 0), and (3, "Maus", 12), update "Monitor" bestand to 8, and delete all rows where bestand = 0.',
    hintDe: 'Kombiniere CREATE TABLE, INSERT INTO, UPDATE inventar SET bestand = 8 WHERE name = \'Monitor\'; und DELETE FROM inventar WHERE bestand = 0;.',
    hintEn: 'Combine CREATE TABLE, INSERT INTO, UPDATE inventar SET bestand = 8 WHERE name = \'Monitor\'; and DELETE FROM inventar WHERE bestand = 0;.',
    solutionSql: `CREATE TABLE inventar (
  item_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  bestand INTEGER NOT NULL
);

INSERT INTO inventar (item_id, name, bestand) VALUES
  (1, 'Monitor', 5),
  (2, 'Kabel', 0),
  (3, 'Maus', 12);

UPDATE inventar
SET bestand = 8
WHERE name = 'Monitor';

DELETE FROM inventar
WHERE bestand = 0;`,
  },
  {
    id: 'leer-6-subqueries_ddl',
    databaseId: 'leer',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: '1:n-Beziehung mit FOREIGN KEY aufbauen',
    titleEn: 'Build a 1:N Relationship with FOREIGN KEY',
    promptDe:
      'Erstelle zuerst die Tabelle abteilungen (abteilung_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE) und danach mitarbeiter (mitarbeiter_id INTEGER PRIMARY KEY, vorname TEXT NOT NULL, nachname TEXT NOT NULL, abteilung_id INTEGER NOT NULL) mit einem FOREIGN KEY auf abteilungen(abteilung_id). Füge die Abteilungen (1, "IT"), (2, "Vertrieb") sowie die Mitarbeitenden (1, "Lena", "Meyer", 1) und (2, "Tom", "Schulz", 2) ein.',
    promptEn:
      'First create table abteilungen (abteilung_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE) and then mitarbeiter (mitarbeiter_id INTEGER PRIMARY KEY, vorname TEXT NOT NULL, nachname TEXT NOT NULL, abteilung_id INTEGER NOT NULL) with a FOREIGN KEY referencing abteilungen(abteilung_id). Insert departments (1, "IT"), (2, "Vertrieb") and employees (1, "Lena", "Meyer", 1), (2, "Tom", "Schulz", 2).',
    hintDe: 'Ergänze in mitarbeiter: FOREIGN KEY (abteilung_id) REFERENCES abteilungen(abteilung_id).',
    hintEn: 'Include in mitarbeiter: FOREIGN KEY (abteilung_id) REFERENCES abteilungen(abteilung_id).',
    solutionSql: `CREATE TABLE abteilungen (
  abteilung_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE mitarbeiter (
  mitarbeiter_id INTEGER PRIMARY KEY,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  abteilung_id INTEGER NOT NULL,
  FOREIGN KEY (abteilung_id) REFERENCES abteilungen(abteilung_id)
);

INSERT INTO abteilungen (abteilung_id, name) VALUES
  (1, 'IT'),
  (2, 'Vertrieb');

INSERT INTO mitarbeiter (mitarbeiter_id, vorname, nachname, abteilung_id) VALUES
  (1, 'Lena', 'Meyer', 1),
  (2, 'Tom', 'Schulz', 2);`,
  },
  {
    id: 'leer-7-aggregation',
    databaseId: 'leer',
    topic: 'aggregation',
    isAbitur: false,
    titleDe: 'Verkaufstabelle aufbauen und Umsatz aggregieren',
    titleEn: 'Create Sales Table and Aggregate Revenue',
    promptDe:
      'Erstelle die Tabelle verkaeufe (verkauf_id INTEGER PRIMARY KEY, kategorie TEXT NOT NULL, betrag REAL NOT NULL), füge 5 Datensätze ein ((1, "Bücher", 19.90), (2, "Bücher", 29.50), (3, "Elektronik", 89.00), (4, "Elektronik", 45.00), (5, "Elektronik", 120.00)) und gib anschließend je kategorie die Anzahl (anzahl) und den Gesamtumsatz (gesamtumsatz, gerundet auf 2 Nachkommastellen) absteigend nach gesamtumsatz sortiert aus.',
    promptEn:
      'Create table verkaeufe (verkauf_id INTEGER PRIMARY KEY, kategorie TEXT NOT NULL, betrag REAL NOT NULL), insert 5 rows ((1, "Bücher", 19.90), (2, "Bücher", 29.50), (3, "Elektronik", 89.00), (4, "Elektronik", 45.00), (5, "Elektronik", 120.00)), and query kategorie, count (anzahl), and total revenue (gesamtumsatz, rounded to 2 decimals), sorted descending by gesamtumsatz.',
    hintDe: 'Schließe das Skript mit SELECT kategorie, COUNT(*) AS anzahl, ROUND(SUM(betrag), 2) AS gesamtumsatz FROM verkaeufe GROUP BY kategorie ORDER BY gesamtumsatz DESC; ab.',
    hintEn: 'End the script with SELECT kategorie, COUNT(*) AS anzahl, ROUND(SUM(betrag), 2) AS gesamtumsatz FROM verkaeufe GROUP BY kategorie ORDER BY gesamtumsatz DESC;.',
    solutionSql: `CREATE TABLE verkaeufe (
  verkauf_id INTEGER PRIMARY KEY,
  kategorie TEXT NOT NULL,
  betrag REAL NOT NULL
);

INSERT INTO verkaeufe (verkauf_id, kategorie, betrag) VALUES
  (1, 'Bücher', 19.90),
  (2, 'Bücher', 29.50),
  (3, 'Elektronik', 89.00),
  (4, 'Elektronik', 45.00),
  (5, 'Elektronik', 120.00);

SELECT kategorie, COUNT(*) AS anzahl, ROUND(SUM(betrag), 2) AS gesamtumsatz
FROM verkaeufe
GROUP BY kategorie
ORDER BY gesamtumsatz DESC;`,
    checkOrder: true,
  },
  {
    id: 'leer-8-aggregation',
    databaseId: 'leer',
    topic: 'aggregation',
    isAbitur: true,
    titleDe: 'Prüfungsergebnisse erfassen und mit HAVING filtern',
    titleEn: 'Record Exam Results and Filter with HAVING',
    promptDe:
      'Erstelle die Tabelle pruefungen (pruefung_id INTEGER PRIMARY KEY, fach TEXT NOT NULL, punkte INTEGER NOT NULL) und füge 6 Ergebnisse ein: (1, "Informatik", 14), (2, "Informatik", 12), (3, "Mathe", 9), (4, "Mathe", 8), (5, "Physik", 15), (6, "Physik", 11). Gib alle Fächer (fach) mit ihrem Durchschnitt (schnitt, gerundet auf 1 Nachkommastelle) aus, die mindestens 2 Prüfungen und einen Schnitt >= 10.0 haben, sortiert absteigend nach schnitt.',
    promptEn:
      'Create table pruefungen (pruefung_id INTEGER PRIMARY KEY, fach TEXT NOT NULL, punkte INTEGER NOT NULL) and insert 6 results: (1, "Informatik", 14), (2, "Informatik", 12), (3, "Mathe", 9), (4, "Mathe", 8), (5, "Physik", 15), (6, "Physik", 11). Return subjects (fach) and their average (schnitt, rounded to 1 decimal) having at least 2 exams and average >= 10.0, sorted descending by schnitt.',
    hintDe: 'Nutze GROUP BY fach HAVING COUNT(*) >= 2 AND AVG(punkte) >= 10.0.',
    hintEn: 'Use GROUP BY fach HAVING COUNT(*) >= 2 AND AVG(punkte) >= 10.0.',
    solutionSql: `CREATE TABLE pruefungen (
  pruefung_id INTEGER PRIMARY KEY,
  fach TEXT NOT NULL,
  punkte INTEGER NOT NULL
);

INSERT INTO pruefungen (pruefung_id, fach, punkte) VALUES
  (1, 'Informatik', 14),
  (2, 'Informatik', 12),
  (3, 'Mathe', 9),
  (4, 'Mathe', 8),
  (5, 'Physik', 15),
  (6, 'Physik', 11);

SELECT fach, ROUND(AVG(punkte), 1) AS schnitt
FROM pruefungen
GROUP BY fach
HAVING COUNT(*) >= 2 AND AVG(punkte) >= 10.0
ORDER BY schnitt DESC;`,
    checkOrder: true,
  },
  {
    id: 'leer-9-joins',
    databaseId: 'leer',
    topic: 'joins',
    isAbitur: false,
    titleDe: 'Autoren & Blogbeiträge erstellen und per JOIN abfragen',
    titleEn: 'Create Authors & Posts and Query with JOIN',
    promptDe:
      'Erstelle die Tabellen autoren (autor_id INTEGER PRIMARY KEY, name TEXT NOT NULL) und beitraege (beitrag_id INTEGER PRIMARY KEY, titel TEXT NOT NULL, autor_id INTEGER NOT NULL, FOREIGN KEY (autor_id) REFERENCES autoren(autor_id)). Füge zwei Autoren (1, "Klara Berg"), (2, "Jonas Lind") und zwei Beiträge (1, "SQL Grundlagen", 1), (2, "Normalformen", 2) ein und gib anschließend titel sowie name AS autor per INNER JOIN sortiert nach beitrag_id aus.',
    promptEn:
      'Create tables autoren (autor_id INTEGER PRIMARY KEY, name TEXT NOT NULL) and beitraege (beitrag_id INTEGER PRIMARY KEY, titel TEXT NOT NULL, autor_id INTEGER NOT NULL, FOREIGN KEY (autor_id) REFERENCES autoren(autor_id)). Insert authors (1, "Klara Berg"), (2, "Jonas Lind") and posts (1, "SQL Grundlagen", 1), (2, "Normalformen", 2), then query titel and name AS autor via INNER JOIN sorted by beitrag_id.',
    hintDe: 'Verknüpfe beitraege b INNER JOIN autoren a ON b.autor_id = a.autor_id.',
    hintEn: 'Join beitraege b INNER JOIN autoren a ON b.autor_id = a.autor_id.',
    solutionSql: `CREATE TABLE autoren (
  autor_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE beitraege (
  beitrag_id INTEGER PRIMARY KEY,
  titel TEXT NOT NULL,
  autor_id INTEGER NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES autoren(autor_id)
);

INSERT INTO autoren (autor_id, name) VALUES
  (1, 'Klara Berg'),
  (2, 'Jonas Lind');

INSERT INTO beitraege (beitrag_id, titel, autor_id) VALUES
  (1, 'SQL Grundlagen', 1),
  (2, 'Normalformen', 2);

SELECT b.titel, a.name AS autor
FROM beitraege b
INNER JOIN autoren a ON b.autor_id = a.autor_id
ORDER BY b.beitrag_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'leer-10-joins',
    databaseId: 'leer',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'Kunden & Bestellungen mit LEFT JOIN auswerten',
    titleEn: 'Analyze Customers & Orders with LEFT JOIN',
    promptDe:
      'Erstelle kunden_neu (kunde_id INTEGER PRIMARY KEY, name TEXT NOT NULL) und bestellungen_neu (bestellung_id INTEGER PRIMARY KEY, kunde_id INTEGER NOT NULL, betrag REAL NOT NULL, FOREIGN KEY (kunde_id) REFERENCES kunden_neu(kunde_id)). Füge die Kunden (1, "Anna"), (2, "Ben"), (3, "Clara") sowie die Bestellungen (10, 1, 50.00), (11, 1, 25.00), (12, 2, 80.00) ein und gib zu jedem Kunden kunde_id, name und bestellungen_anzahl (auch 0) absteigend nach bestellungen_anzahl, dann aufsteigend nach kunde_id aus.',
    promptEn:
      'Create kunden_neu (kunde_id INTEGER PRIMARY KEY, name TEXT NOT NULL) and bestellungen_neu (bestellung_id INTEGER PRIMARY KEY, kunde_id INTEGER NOT NULL, betrag REAL NOT NULL, FOREIGN KEY (kunde_id) REFERENCES kunden_neu(kunde_id)). Insert customers (1, "Anna"), (2, "Ben"), (3, "Clara") and orders (10, 1, 50.00), (11, 1, 25.00), (12, 2, 80.00), then return kunde_id, name, and bestellungen_anzahl (including 0) sorted descending by bestellungen_anzahl, then ascending by kunde_id.',
    hintDe: 'Verwende LEFT JOIN bestellungen_neu b ON k.kunde_id = b.kunde_id und COUNT(b.bestellung_id) AS bestellungen_anzahl.',
    hintEn: 'Use LEFT JOIN bestellungen_neu b ON k.kunde_id = b.kunde_id and COUNT(b.bestellung_id) AS bestellungen_anzahl.',
    solutionSql: `CREATE TABLE kunden_neu (
  kunde_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE bestellungen_neu (
  bestellung_id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  betrag REAL NOT NULL,
  FOREIGN KEY (kunde_id) REFERENCES kunden_neu(kunde_id)
);

INSERT INTO kunden_neu (kunde_id, name) VALUES
  (1, 'Anna'),
  (2, 'Ben'),
  (3, 'Clara');

INSERT INTO bestellungen_neu (bestellung_id, kunde_id, betrag) VALUES
  (10, 1, 50.00),
  (11, 1, 25.00),
  (12, 2, 80.00);

SELECT k.kunde_id, k.name, COUNT(b.bestellung_id) AS bestellungen_anzahl
FROM kunden_neu k
LEFT JOIN bestellungen_neu b ON k.kunde_id = b.kunde_id
GROUP BY k.kunde_id, k.name
ORDER BY bestellungen_anzahl DESC, k.kunde_id ASC;`,
    checkOrder: true,
  },
  {
    id: 'leer-11-joins',
    databaseId: 'leer',
    topic: 'joins',
    isAbitur: true,
    titleDe: 'n:m-Beziehung mit Verknüpfungstabelle modellieren',
    titleEn: 'Model an M:N Relationship with Junction Table',
    promptDe:
      'Erstelle studierende (stud_id INTEGER PRIMARY KEY, name TEXT NOT NULL), module (modul_id INTEGER PRIMARY KEY, titel TEXT NOT NULL) und die Verknüpfungstabelle belegungen (stud_id INTEGER NOT NULL, modul_id INTEGER NOT NULL, PRIMARY KEY (stud_id, modul_id), FOREIGN KEY (stud_id) REFERENCES studierende(stud_id), FOREIGN KEY (modul_id) REFERENCES module(modul_id)). Füge (1, "Mia"), (2, "Leo"), die Module (10, "Datenbanken"), (20, "Algorithmen") sowie die Belegungen (1, 10), (1, 20), (2, 10) ein und gib name und titel sortiert nach name, titel aus.',
    promptEn:
      'Create studierende (stud_id INTEGER PRIMARY KEY, name TEXT NOT NULL), module (modul_id INTEGER PRIMARY KEY, titel TEXT NOT NULL), and junction table belegungen (stud_id INTEGER NOT NULL, modul_id INTEGER NOT NULL, PRIMARY KEY (stud_id, modul_id), FOREIGN KEY (stud_id) REFERENCES studierende(stud_id), FOREIGN KEY (modul_id) REFERENCES module(modul_id)). Insert (1, "Mia"), (2, "Leo"), modules (10, "Datenbanken"), (20, "Algorithmen"), and enrollments (1, 10), (1, 20), (2, 10), then query name and titel sorted by name, titel.',
    hintDe: 'Verknüpfe studierende s, belegungen b und module m über die jeweiligen IDs.',
    hintEn: 'Join studierende s, belegungen b, and module m on their respective IDs.',
    solutionSql: `CREATE TABLE studierende (
  stud_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE module (
  modul_id INTEGER PRIMARY KEY,
  titel TEXT NOT NULL
);

CREATE TABLE belegungen (
  stud_id INTEGER NOT NULL,
  modul_id INTEGER NOT NULL,
  PRIMARY KEY (stud_id, modul_id),
  FOREIGN KEY (stud_id) REFERENCES studierende(stud_id),
  FOREIGN KEY (modul_id) REFERENCES module(modul_id)
);

INSERT INTO studierende (stud_id, name) VALUES
  (1, 'Mia'),
  (2, 'Leo');

INSERT INTO module (modul_id, titel) VALUES
  (10, 'Datenbanken'),
  (20, 'Algorithmen');

INSERT INTO belegungen (stud_id, modul_id) VALUES
  (1, 10),
  (1, 20),
  (2, 10);

SELECT s.name, m.titel
FROM belegungen b
INNER JOIN studierende s ON b.stud_id = s.stud_id
INNER JOIN module m ON b.modul_id = m.modul_id
ORDER BY s.name ASC, m.titel ASC;`,
    checkOrder: true,
  },
  {
    id: 'leer-12-subqueries_ddl',
    databaseId: 'leer',
    topic: 'subqueries_ddl',
    isAbitur: true,
    titleDe: 'Abitur: Bibliotheksschema von Grund auf entwerfen',
    titleEn: 'Abitur: Design a Library Schema from Scratch',
    promptDe:
      'Erstelle ein Bibliotheksschema: 1) leser (leser_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ausweis_nr TEXT NOT NULL UNIQUE), 2) medien (medium_id INTEGER PRIMARY KEY AUTOINCREMENT, titel TEXT NOT NULL, typ TEXT NOT NULL DEFAULT \'Buch\'), 3) ausleihen (ausleihe_id INTEGER PRIMARY KEY AUTOINCREMENT, leser_id INTEGER NOT NULL, medium_id INTEGER NOT NULL, tage INTEGER NOT NULL, FOREIGN KEY (leser_id) REFERENCES leser(leser_id), FOREIGN KEY (medium_id) REFERENCES medien(medium_id)). Erweitere leser per ALTER TABLE um stadt (TEXT) und füge zwei Leser ("Paul Becker", "A-101", "Berlin"), ("Sofia Graf", "A-102", "Hamburg"), zwei Medien ("SQL-Praxis", "Buch"), ("Clean Code", "E-Book") sowie eine Ausleihe (1, 1, 14) ein.',
    promptEn:
      'Create a library schema: 1) leser (leser_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ausweis_nr TEXT NOT NULL UNIQUE), 2) medien (medium_id INTEGER PRIMARY KEY AUTOINCREMENT, titel TEXT NOT NULL, typ TEXT NOT NULL DEFAULT \'Buch\'), 3) ausleihen (ausleihe_id INTEGER PRIMARY KEY AUTOINCREMENT, leser_id INTEGER NOT NULL, medium_id INTEGER NOT NULL, tage INTEGER NOT NULL, FOREIGN KEY (leser_id) REFERENCES leser(leser_id), FOREIGN KEY (medium_id) REFERENCES medien(medium_id)). Add column stadt (TEXT) to leser via ALTER TABLE, and insert two readers ("Paul Becker", "A-101", "Berlin"), ("Sofia Graf", "A-102", "Hamburg"), two media items ("SQL-Praxis", "Buch"), ("Clean Code", "E-Book"), and one loan (1, 1, 14).',
    hintDe: 'Achte auf die Reihenfolge: erst leser und medien anlegen, dann ausleihen mit FOREIGN KEYs, dann ALTER TABLE leser ADD COLUMN stadt TEXT;, dann INSERT INTO.',
    hintEn: 'Watch the order: create leser and medien first, then ausleihen with FOREIGN KEYs, then ALTER TABLE leser ADD COLUMN stadt TEXT;, then INSERT INTO.',
    solutionSql: `CREATE TABLE leser (
  leser_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ausweis_nr TEXT NOT NULL UNIQUE
);

CREATE TABLE medien (
  medium_id INTEGER PRIMARY KEY AUTOINCREMENT,
  titel TEXT NOT NULL,
  typ TEXT NOT NULL DEFAULT 'Buch'
);

CREATE TABLE ausleihen (
  ausleihe_id INTEGER PRIMARY KEY AUTOINCREMENT,
  leser_id INTEGER NOT NULL,
  medium_id INTEGER NOT NULL,
  tage INTEGER NOT NULL,
  FOREIGN KEY (leser_id) REFERENCES leser(leser_id),
  FOREIGN KEY (medium_id) REFERENCES medien(medium_id)
);

ALTER TABLE leser ADD COLUMN stadt TEXT;

INSERT INTO leser (name, ausweis_nr, stadt) VALUES
  ('Paul Becker', 'A-101', 'Berlin'),
  ('Sofia Graf', 'A-102', 'Hamburg');

INSERT INTO medien (titel, typ) VALUES
  ('SQL-Praxis', 'Buch'),
  ('Clean Code', 'E-Book');

INSERT INTO ausleihen (leser_id, medium_id, tage) VALUES
  (1, 1, 14);`,
  },
];
