import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { preprocessMySqlQuery, splitSqlStatements } from '../mysqlCompat';
import { SqlEngine } from '../sqlEngine';

describe('mysqlCompat', () => {
  describe('splitSqlStatements', () => {
    it('splits multiple statements while respecting strings and comments', () => {
      const sql = `
        -- comment with ; semicolon
        SELECT 'a;b' AS val;
        /* block ; comment */
        SELECT "c;d" AS val2;
      `;
      const stmts = splitSqlStatements(sql);
      expect(stmts).toHaveLength(2);
      expect(stmts[0]).toContain("'a;b'");
      expect(stmts[1]).toContain('"c;d"');
    });
  });

  describe('preprocessMySqlQuery', () => {
    it('rewrites SHOW TABLES; to sqlite_master query', () => {
      const res = preprocessMySqlQuery('SHOW TABLES;', 'schule');
      expect(res.type).toBe('sql');
      if (res.type === 'sql') {
        expect(res.sql).toContain('AS "Tables_in_schule"');
        expect(res.sql).toContain("FROM sqlite_master WHERE type='table'");
      }
    });

    it('intercepts DESCRIBE and DESC as describe metadata instructions', () => {
      expect(preprocessMySqlQuery('DESCRIBE schueler;')).toEqual({
        type: 'describe',
        table: 'schueler',
      });
      expect(preprocessMySqlQuery('desc `kurse`')).toEqual({
        type: 'describe',
        table: 'kurse',
      });
    });

    it('translates MySQL DDL types and strips ENGINE/CHARSET/COLLATE options', () => {
      const mysqlDdl = `
        CREATE TABLE benutzer (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          aktiv BOOLEAN DEFAULT 1,
          guthaben DECIMAL(10, 2),
          note FLOAT,
          geburtsdatum DATE,
          erstellt DATETIME,
          status CHAR(2) DEFAULT 'OK'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5;
      `;
      const res = preprocessMySqlQuery(mysqlDdl);
      expect(res.type).toBe('sql');
      if (res.type === 'sql') {
        expect(res.sql).toContain('INTEGER PRIMARY KEY AUTOINCREMENT');
        expect(res.sql).toContain('name TEXT NOT NULL');
        expect(res.sql).toContain('aktiv INTEGER DEFAULT 1');
        expect(res.sql).toContain('guthaben REAL');
        expect(res.sql).toContain('note REAL');
        expect(res.sql).toContain('geburtsdatum TEXT');
        expect(res.sql).toContain('erstellt TEXT');
        expect(res.sql).toContain("status TEXT DEFAULT 'OK'");
        expect(res.sql).not.toMatch(/ENGINE=/i);
        expect(res.sql).not.toMatch(/CHARSET=/i);
        expect(res.sql).not.toMatch(/COLLATE=/i);
      }
    });

    it('does not rewrite column names like date in SELECT queries', () => {
      const res = preprocessMySqlQuery('SELECT date, int_val FROM events;');
      expect(res).toEqual({
        type: 'sql',
        sql: 'SELECT date, int_val FROM events;',
      });
    });
  });

  describe('SqlEngine MySQL functions & DESCRIBE / SHOW TABLES execution', () => {
    let engine: SqlEngine;

    beforeEach(async () => {
      engine = new SqlEngine('demo_db');
      await engine.init();
      engine.loadSql(
        `
        CREATE TABLE kunden (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vorname VARCHAR(50) NOT NULL,
          nachname VARCHAR(50),
          registriert DATE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        INSERT INTO kunden (vorname, nachname, registriert) VALUES ('Ada', 'Lovelace', '2024-03-15');
        INSERT INTO kunden (vorname, nachname, registriert) VALUES ('Alan', NULL, '2023-11-02');
      `,
        'mysql'
      );
    });

    afterEach(() => {
      engine.close();
    });

    it('executes SHOW TABLES and DESCRIBE in mysql mode', () => {
      const showRes = engine.execute('SHOW TABLES;', 'mysql');
      expect(showRes).toHaveLength(1);
      expect(showRes[0].columns).toEqual(['Tables_in_demo_db']);
      expect(showRes[0].values).toEqual([['kunden']]);

      const descRes = engine.execute('DESCRIBE kunden;', 'mysql');
      expect(descRes).toHaveLength(1);
      expect(descRes[0].columns).toEqual(['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']);
      expect(descRes[0].values[0]).toEqual(['id', 'INTEGER', 'NO', 'PRI', null, 'auto_increment']);
      expect(descRes[0].values[1][0]).toBe('vorname');
      expect(descRes[0].values[1][2]).toBe('NO');
    });

    it('supports CONCAT, YEAR, MONTH, DAY, NOW, CURDATE, IFNULL, SUBSTRING, CHAR_LENGTH', () => {
      const [res] = engine.execute(
        `SELECT
          CONCAT(vorname, ' ', IFNULL(nachname, 'Unbekannt')) AS full_name,
          YEAR(registriert) AS y,
          MONTH(registriert) AS m,
          DAY(registriert) AS d,
          SUBSTRING(vorname, 1, 2) AS sub,
          CHAR_LENGTH(vorname) AS len,
          CURDATE() AS today,
          NOW() AS now_ts
        FROM kunden ORDER BY id;`,
        'mysql'
      );

      expect(res.rowCount).toBe(2);
      expect(res.values[0][0]).toBe('Ada Lovelace');
      expect(res.values[0][1]).toBe(2024);
      expect(res.values[0][2]).toBe(3);
      expect(res.values[0][3]).toBe(15);
      expect(res.values[0][4]).toBe('Ad');
      expect(res.values[0][5]).toBe(3);
      expect(String(res.values[0][6])).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(String(res.values[0][7])).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

      expect(res.values[1][0]).toBe('Alan Unbekannt');
      expect(res.values[1][4]).toBe('Al');
      expect(res.values[1][5]).toBe(4);
    });

    it('returns NULL from CONCAT when any argument is NULL', () => {
      const [res] = engine.execute(`SELECT CONCAT('a', NULL, 'b') AS c;`, 'mysql');
      expect(res.values[0][0]).toBeNull();
    });
  });
});
