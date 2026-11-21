import type { DatabasePreset } from '@/types/sql';

export const DATABASE_PRESETS: DatabasePreset[] = [
  {
    id: 'schule',
    nameDe: 'Schule',
    nameEn: 'School',
    descriptionDe:
      'Gymnasiale Oberstufe mit Lehrkräften, Schülerinnen und Schülern, Kursen und Kursbelegungen inklusive Notenpunkten.',
    descriptionEn:
      'German upper secondary school with teachers, students, courses, and enrollments including grade points (0–15).',
    sql: `-- Datenbank: Schule (Gymnasiale Oberstufe)
CREATE TABLE lehrer (
  lehrer_id INTEGER PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  kuerzel VARCHAR(10) NOT NULL,
  fach_haupt VARCHAR(60) NOT NULL,
  einstellungsjahr INTEGER NOT NULL
);

CREATE TABLE schueler (
  schueler_id INTEGER PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  jahrgang INTEGER NOT NULL,
  klasse VARCHAR(10) NOT NULL,
  geburtsdatum DATE NOT NULL
);

CREATE TABLE kurse (
  kurs_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(80) NOT NULL,
  fach VARCHAR(60) NOT NULL,
  wochenstunden INTEGER NOT NULL,
  lehrer_id INTEGER NOT NULL,
  FOREIGN KEY (lehrer_id) REFERENCES lehrer(lehrer_id)
);

CREATE TABLE belegt (
  schueler_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note_punkte INTEGER NOT NULL,
  halbjahr VARCHAR(20) NOT NULL,
  PRIMARY KEY (schueler_id, kurs_id),
  FOREIGN KEY (schueler_id) REFERENCES schueler(schueler_id),
  FOREIGN KEY (kurs_id) REFERENCES kurse(kurs_id)
);

INSERT INTO lehrer (lehrer_id, vorname, nachname, kuerzel, fach_haupt, einstellungsjahr) VALUES
  (1, 'Anna', 'Weber', 'WEB', 'Informatik', 2016),
  (2, 'Markus', 'Hoffmann', 'HOF', 'Mathematik', 2012),
  (3, 'Sabine', 'Klein', 'KLE', 'Deutsch', 2019),
  (4, 'Thomas', 'Becker', 'BEC', 'Physik', 2014),
  (5, 'Laura', 'Schäfer', 'SCH', 'Englisch', 2021),
  (6, 'Stefan', 'Richter', 'RIC', 'Geschichte', 2010);

INSERT INTO schueler (schueler_id, vorname, nachname, jahrgang, klasse, geburtsdatum) VALUES
  (1, 'Lukas', 'Müller', 12, '12a', '2007-03-14'),
  (2, 'Mia', 'Schmidt', 12, '12a', '2007-07-22'),
  (3, 'Leon', 'Schneider', 12, '12b', '2007-01-09'),
  (4, 'Hannah', 'Fischer', 13, '13a', '2006-11-03'),
  (5, 'Jonas', 'Wagner', 13, '13a', '2006-05-18'),
  (6, 'Emma', 'Bauer', 11, '11a', '2008-02-27'),
  (7, 'Noah', 'Zimmermann', 11, '11b', '2008-09-12'),
  (8, 'Sofia', 'Krüger', 12, '12b', '2007-06-30'),
  (9, 'Paul', 'Hartmann', 13, '13a', '2006-08-25'),
  (10, 'Lea', 'Werner', 11, '11a', '2008-04-05'),
  (11, 'Felix', 'Neumann', 12, '12a', '2007-12-19'),
  (12, 'Clara', 'Braun', 11, '11b', '2008-10-01');

INSERT INTO kurse (kurs_id, bezeichnung, fach, wochenstunden, lehrer_id) VALUES
  (101, 'Informatik LK 12', 'Informatik', 5, 1),
  (102, 'Informatik GK 11', 'Informatik', 3, 1),
  (103, 'Mathematik LK 12', 'Mathematik', 5, 2),
  (104, 'Mathematik GK 13', 'Mathematik', 3, 2),
  (105, 'Deutsch GK 12', 'Deutsch', 3, 3),
  (106, 'Physik LK 13', 'Physik', 5, 4),
  (107, 'Englisch GK 11', 'Englisch', 3, 5),
  (108, 'Geschichte GK 13', 'Geschichte', 3, 6);

INSERT INTO belegt (schueler_id, kurs_id, note_punkte, halbjahr) VALUES
  (1, 101, 14, '2024/25-1'),
  (1, 103, 12, '2024/25-1'),
  (1, 105, 11, '2024/25-1'),
  (2, 101, 15, '2024/25-1'),
  (2, 103, 13, '2024/25-1'),
  (2, 105, 14, '2024/25-1'),
  (3, 101, 10, '2024/25-1'),
  (3, 105, 9, '2024/25-1'),
  (4, 104, 13, '2024/25-1'),
  (4, 106, 14, '2024/25-1'),
  (4, 108, 12, '2024/25-1'),
  (5, 104, 8, '2024/25-1'),
  (5, 106, 11, '2024/25-1'),
  (5, 108, 10, '2024/25-1'),
  (6, 102, 13, '2024/25-1'),
  (6, 107, 14, '2024/25-1'),
  (7, 102, 9, '2024/25-1'),
  (7, 107, 11, '2024/25-1'),
  (8, 101, 12, '2024/25-1'),
  (8, 103, 11, '2024/25-1'),
  (8, 105, 13, '2024/25-1'),
  (9, 104, 15, '2024/25-1'),
  (9, 106, 13, '2024/25-1'),
  (9, 108, 14, '2024/25-1'),
  (10, 102, 12, '2024/25-1'),
  (10, 107, 15, '2024/25-1'),
  (11, 101, 7, '2024/25-1'),
  (11, 103, 6, '2024/25-1');`,
  },
  {
    id: 'onlineshop',
    nameDe: 'Online-Shop',
    nameEn: 'Online Shop',
    descriptionDe:
      'E-Commerce-Datenbank mit Kundinnen und Kunden, Artikeln, Bestellungen und Bestellpositionen.',
    descriptionEn:
      'E-commerce database with customers, products, orders, and order line items.',
    sql: `-- Datenbank: Online-Shop
CREATE TABLE kunden (
  kunde_id INTEGER PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL,
  stadt VARCHAR(60) NOT NULL,
  plz VARCHAR(10) NOT NULL,
  registriert_seit DATE NOT NULL
);

CREATE TABLE artikel (
  artikel_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kategorie VARCHAR(60) NOT NULL,
  preis DECIMAL(10,2) NOT NULL,
  lagerbestand INTEGER NOT NULL
);

CREATE TABLE bestellungen (
  bestellung_id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  bestelldatum DATE NOT NULL,
  status VARCHAR(30) NOT NULL,
  FOREIGN KEY (kunde_id) REFERENCES kunden(kunde_id)
);

CREATE TABLE bestellpositionen (
  position_id INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL,
  artikel_id INTEGER NOT NULL,
  menge INTEGER NOT NULL,
  einzelpreis DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (bestellung_id) REFERENCES bestellungen(bestellung_id),
  FOREIGN KEY (artikel_id) REFERENCES artikel(artikel_id)
);

INSERT INTO kunden (kunde_id, vorname, nachname, email, stadt, plz, registriert_seit) VALUES
  (1, 'Maximilian', 'Berger', 'm.berger@example.de', 'Berlin', '10115', '2024-02-10'),
  (2, 'Sophie', 'Lehmann', 's.lehmann@example.de', 'München', '80331', '2024-03-15'),
  (3, 'Tim', 'Köhler', 't.koehler@example.de', 'Hamburg', '20095', '2024-05-01'),
  (4, 'Elena', 'Maier', 'e.maier@example.de', 'Stuttgart', '70173', '2024-06-20'),
  (5, 'Jan', 'Wolf', 'j.wolf@example.de', 'Köln', '50667', '2024-08-11'),
  (6, 'Nora', 'Schulze', 'n.schulze@example.de', 'Berlin', '10405', '2024-09-03'),
  (7, 'Moritz', 'Vogel', 'm.vogel@example.de', 'Leipzig', '04109', '2024-11-18'),
  (8, 'Katrin', 'Frank', 'k.frank@example.de', 'München', '80802', '2025-01-05');

INSERT INTO artikel (artikel_id, name, kategorie, preis, lagerbestand) VALUES
  (1, 'Mechanische Tastatur TKL', 'Elektronik', 89.90, 24),
  (2, 'Ergonomische Maus Pro', 'Elektronik', 54.50, 40),
  (3, 'USB-C Hub 7-in-1', 'Zubehör', 34.99, 55),
  (4, 'SQL kompakt (Fachbuch)', 'Bücher', 29.00, 18),
  (5, 'Algorithmen verstehen', 'Bücher', 39.50, 12),
  (6, '27-Zoll Monitor 4K', 'Elektronik', 349.00, 7),
  (7, 'Laptop-Ständer Aluminium', 'Büro', 42.00, 30),
  (8, 'Schreibtischunterlage Filz', 'Büro', 19.90, 60),
  (9, 'Noise-Cancelling Kopfhörer', 'Elektronik', 179.00, 9),
  (10, 'DisplayPort-Kabel 2m', 'Zubehör', 14.50, 0);

INSERT INTO bestellungen (bestellung_id, kunde_id, bestelldatum, status) VALUES
  (1001, 1, '2025-01-12', 'geliefert'),
  (1002, 2, '2025-01-18', 'geliefert'),
  (1003, 1, '2025-02-02', 'versandt'),
  (1004, 3, '2025-02-09', 'geliefert'),
  (1005, 4, '2025-02-14', 'storniert'),
  (1006, 5, '2025-02-22', 'geliefert'),
  (1007, 2, '2025-03-01', 'offen'),
  (1008, 6, '2025-03-05', 'versandt'),
  (1009, 4, '2025-03-11', 'offen'),
  (1010, 1, '2025-03-16', 'geliefert');

INSERT INTO bestellpositionen (position_id, bestellung_id, artikel_id, menge, einzelpreis) VALUES
  (1, 1001, 1, 1, 89.90),
  (2, 1001, 3, 2, 34.99),
  (3, 1002, 6, 1, 349.00),
  (4, 1002, 7, 1, 42.00),
  (5, 1003, 4, 1, 29.00),
  (6, 1003, 5, 1, 39.50),
  (7, 1004, 2, 2, 54.50),
  (8, 1004, 8, 1, 19.90),
  (9, 1005, 9, 1, 179.00),
  (10, 1006, 1, 1, 89.90),
  (11, 1006, 2, 1, 54.50),
  (12, 1006, 3, 1, 34.99),
  (13, 1007, 4, 3, 29.00),
  (14, 1008, 7, 2, 42.00),
  (15, 1008, 8, 2, 19.90),
  (16, 1009, 6, 1, 349.00),
  (17, 1010, 9, 1, 179.00),
  (18, 1010, 5, 1, 39.50);`,
  },
  {
    id: 'kino',
    nameDe: 'Kino',
    nameEn: 'Cinema',
    descriptionDe:
      'Kinobetrieb mit Filmen, Kinosälen, Vorstellungen und verkauften Eintrittskarten.',
    descriptionEn:
      'Cinema management database with movies, screening halls, showtimes, and sold tickets.',
    sql: `-- Datenbank: Kino
CREATE TABLE filme (
  film_id INTEGER PRIMARY KEY,
  titel VARCHAR(100) NOT NULL,
  genre VARCHAR(40) NOT NULL,
  dauer_min INTEGER NOT NULL,
  fsk INTEGER NOT NULL,
  erscheinungsjahr INTEGER NOT NULL
);

CREATE TABLE saele (
  saal_id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  plaetze INTEGER NOT NULL,
  hat_3d INTEGER NOT NULL,
  hat_dolby_atmos INTEGER NOT NULL
);

CREATE TABLE vorstellungen (
  vorstellung_id INTEGER PRIMARY KEY,
  film_id INTEGER NOT NULL,
  saal_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  uhrzeit VARCHAR(10) NOT NULL,
  grundpreis DECIMAL(6,2) NOT NULL,
  FOREIGN KEY (film_id) REFERENCES filme(film_id),
  FOREIGN KEY (saal_id) REFERENCES saele(saal_id)
);

CREATE TABLE tickets (
  ticket_id INTEGER PRIMARY KEY,
  vorstellung_id INTEGER NOT NULL,
  reihe VARCHAR(5) NOT NULL,
  sitznummer INTEGER NOT NULL,
  preis DECIMAL(6,2) NOT NULL,
  kaufdatum DATE NOT NULL,
  ermaessigt INTEGER NOT NULL,
  FOREIGN KEY (vorstellung_id) REFERENCES vorstellungen(vorstellung_id)
);

INSERT INTO filme (film_id, titel, genre, dauer_min, fsk, erscheinungsjahr) VALUES
  (1, 'Horizont 2099', 'Sci-Fi', 148, 12, 2024),
  (2, 'Der letzte Sommer', 'Drama', 112, 6, 2023),
  (3, 'Chaos im Büro', 'Komödie', 98, 0, 2024),
  (4, 'Schatten der Nacht', 'Thriller', 126, 16, 2024),
  (5, 'Die kleine Wolke', 'Animation', 88, 0, 2025),
  (6, 'Vollgas Berlin', 'Action', 118, 12, 2023),
  (7, 'Quantenflug', 'Sci-Fi', 134, 12, 2025),
  (8, 'Alpenstille', 'Drama', 105, 6, 2022);

INSERT INTO saele (saal_id, name, plaetze, hat_3d, hat_dolby_atmos) VALUES
  (1, 'Saal 1 - IMAX', 240, 1, 1),
  (2, 'Saal 2', 160, 1, 0),
  (3, 'Saal 3', 120, 0, 1),
  (4, 'Kino-Studio', 60, 0, 0);

INSERT INTO vorstellungen (vorstellung_id, film_id, saal_id, datum, uhrzeit, grundpreis) VALUES
  (1, 1, 1, '2025-04-10', '20:00', 14.50),
  (2, 1, 2, '2025-04-11', '17:30', 12.50),
  (3, 2, 4, '2025-04-10', '18:00', 10.00),
  (4, 3, 3, '2025-04-10', '19:30', 11.00),
  (5, 4, 2, '2025-04-11', '22:00', 12.00),
  (6, 5, 3, '2025-04-12', '15:00', 9.50),
  (7, 6, 1, '2025-04-12', '20:30', 13.50),
  (8, 7, 1, '2025-04-13', '20:00', 14.50),
  (9, 3, 4, '2025-04-13', '16:30', 10.00),
  (10, 4, 3, '2025-04-13', '21:15', 11.50);

INSERT INTO tickets (ticket_id, vorstellung_id, reihe, sitznummer, preis, kaufdatum, ermaessigt) VALUES
  (1, 1, 'G', 12, 14.50, '2025-04-08', 0),
  (2, 1, 'G', 13, 14.50, '2025-04-08', 0),
  (3, 1, 'H', 8, 11.50, '2025-04-09', 1),
  (4, 2, 'E', 5, 12.50, '2025-04-10', 0),
  (5, 2, 'E', 6, 9.50, '2025-04-10', 1),
  (6, 3, 'C', 4, 10.00, '2025-04-09', 0),
  (7, 4, 'F', 10, 11.00, '2025-04-10', 0),
  (8, 4, 'F', 11, 8.50, '2025-04-10', 1),
  (9, 5, 'D', 7, 12.00, '2025-04-11', 0),
  (10, 5, 'D', 8, 12.00, '2025-04-11', 0),
  (11, 6, 'B', 3, 7.00, '2025-04-11', 1),
  (12, 6, 'B', 4, 7.00, '2025-04-11', 1),
  (13, 6, 'B', 5, 9.50, '2025-04-11', 0),
  (14, 7, 'H', 14, 13.50, '2025-04-12', 0),
  (15, 7, 'H', 15, 13.50, '2025-04-12', 0),
  (16, 8, 'G', 9, 14.50, '2025-04-12', 0),
  (17, 8, 'G', 10, 11.50, '2025-04-12', 1),
  (18, 8, 'G', 11, 14.50, '2025-04-12', 0),
  (19, 9, 'C', 2, 10.00, '2025-04-13', 0),
  (20, 10, 'E', 12, 11.50, '2025-04-13', 0);`,
  },
  {
    id: 'leer',
    nameDe: 'Eigene Datenbank (Leer)',
    nameEn: 'Custom Database (Empty)',
    descriptionDe:
      'Leere SQL-Sandbox zum Erstellen eigener Tabellen mit CREATE TABLE, FOREIGN KEY & INSERT.',
    descriptionEn:
      'Empty SQL sandbox for creating your own tables with CREATE TABLE, FOREIGN KEY & INSERT.',
    sql: '',
  },
];
