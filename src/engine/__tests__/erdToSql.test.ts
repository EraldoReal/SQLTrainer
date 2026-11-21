import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_ERD_MODEL,
  generateSqlFromErd,
  type ErdEntity,
  type ErdRelation,
} from '../erdToSql';
import { SqlEngine } from '../sqlEngine';
import type { SqlDialect } from '@/types/sql';

describe('erdToSql', () => {
  let engine: SqlEngine;

  beforeEach(async () => {
    engine = new SqlEngine('erd_test');
    await engine.init();
  });

  afterEach(() => {
    engine.close();
  });

  const dialects: SqlDialect[] = ['mysql', 'sqlite'];

  it.each(dialects)('generates and executes 1:N relation SQL cleanly in %s', (dialect) => {
    const entities: ErdEntity[] = [
      {
        id: 'e_buch',
        name: 'buch',
        x: 300,
        y: 50,
        columns: [
          {
            id: 'c_b_id',
            name: 'id',
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
            unique: false,
          },
          {
            id: 'c_b_titel',
            name: 'titel',
            type: 'VARCHAR(150)',
            primaryKey: false,
            autoIncrement: false,
            notNull: true,
            unique: false,
          },
        ],
      },
      {
        id: 'e_autor',
        name: 'autor',
        x: 50,
        y: 50,
        columns: [
          {
            id: 'c_a_id',
            name: 'id',
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
            unique: false,
          },
          {
            id: 'c_a_name',
            name: 'name',
            type: 'VARCHAR(100)',
            primaryKey: false,
            autoIncrement: false,
            notNull: true,
            unique: false,
          },
        ],
      },
    ];

    const relations: ErdRelation[] = [
      {
        id: 'r1',
        fromEntityId: 'e_autor',
        toEntityId: 'e_buch',
        cardinality: '1:N',
      },
    ];

    const sql = generateSqlFromErd(entities, relations, dialect);

    // Parent table must appear before child table
    expect(sql.indexOf('CREATE TABLE autor')).toBeLessThan(sql.indexOf('CREATE TABLE buch'));
    expect(sql).toContain('autor_id');
    expect(sql).toContain('FOREIGN KEY (autor_id) REFERENCES autor(id)');

    engine.loadSql(sql, dialect);
    const schema = engine.getSchema();
    expect(schema.map((t) => t.name)).toEqual(['autor', 'buch']);

    const buchTable = schema.find((t) => t.name === 'buch')!;
    const fkCol = buchTable.columns.find((c) => c.name === 'autor_id');
    expect(fkCol?.foreignKey).toEqual({ table: 'autor', column: 'id' });

    engine.execute("INSERT INTO autor (name) VALUES ('Goethe');", dialect);
    engine.execute("INSERT INTO buch (titel, autor_id) VALUES ('Faust', 1);", dialect);
    const res = engine.execute(
      'SELECT b.titel, a.name FROM buch b JOIN autor a ON b.autor_id = a.id;',
      dialect
    );
    expect(res[0].values).toEqual([['Faust', 'Goethe']]);
  });

  it.each(dialects)('generates and executes 1:1 relation SQL with UNIQUE FK in %s', (dialect) => {
    const entities: ErdEntity[] = [
      {
        id: 'e_person',
        name: 'person',
        x: 50,
        y: 50,
        columns: [
          {
            id: 'c_p_id',
            name: 'id',
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
            unique: false,
          },
          {
            id: 'c_p_name',
            name: 'name',
            type: 'VARCHAR(100)',
            primaryKey: false,
            autoIncrement: false,
            notNull: true,
            unique: false,
          },
        ],
      },
      {
        id: 'e_reisepass',
        name: 'reisepass',
        x: 350,
        y: 50,
        columns: [
          {
            id: 'c_r_id',
            name: 'id',
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
            unique: false,
          },
          {
            id: 'c_r_nr',
            name: 'nummer',
            type: 'VARCHAR(30)',
            primaryKey: false,
            autoIncrement: false,
            notNull: true,
            unique: true,
          },
        ],
      },
    ];

    const relations: ErdRelation[] = [
      {
        id: 'r_1_1',
        fromEntityId: 'e_person',
        toEntityId: 'e_reisepass',
        cardinality: '1:1',
      },
    ];

    const sql = generateSqlFromErd(entities, relations, dialect);
    expect(sql).toMatch(/person_id\s+(?:INT|INTEGER)\s+NOT NULL\s+UNIQUE/);
    expect(sql).toContain('FOREIGN KEY (person_id) REFERENCES person(id)');

    engine.loadSql(sql, dialect);
    engine.execute("INSERT INTO person (name) VALUES ('Ada Lovelace');", dialect);
    engine.execute(
      "INSERT INTO reisepass (nummer, person_id) VALUES ('DE-001', 1);",
      dialect
    );

    // Second passport for the same person must fail due to UNIQUE constraint
    expect(() =>
      engine.execute(
        "INSERT INTO reisepass (nummer, person_id) VALUES ('DE-002', 1);",
        dialect
      )
    ).toThrow();
  });

  it.each(dialects)(
    'generates and executes N:M junction table with composite PK and FKs in %s',
    (dialect) => {
      const entities: ErdEntity[] = [
        {
          id: 'e_schueler',
          name: 'schueler',
          x: 50,
          y: 50,
          columns: [
            {
              id: 'c_s_id',
              name: 'id',
              type: 'INT',
              primaryKey: true,
              autoIncrement: true,
              notNull: true,
              unique: false,
            },
            {
              id: 'c_s_name',
              name: 'name',
              type: 'VARCHAR(100)',
              primaryKey: false,
              autoIncrement: false,
              notNull: true,
              unique: false,
            },
          ],
        },
        {
          id: 'e_kurs',
          name: 'kurs',
          x: 350,
          y: 50,
          columns: [
            {
              id: 'c_k_id',
              name: 'id',
              type: 'INT',
              primaryKey: true,
              autoIncrement: true,
              notNull: true,
              unique: false,
            },
            {
              id: 'c_k_fach',
              name: 'fach',
              type: 'VARCHAR(80)',
              primaryKey: false,
              autoIncrement: false,
              notNull: true,
              unique: false,
            },
          ],
        },
      ];

      const relations: ErdRelation[] = [
        {
          id: 'r_nm',
          fromEntityId: 'e_schueler',
          toEntityId: 'e_kurs',
          cardinality: 'N:M',
        },
      ];

      const sql = generateSqlFromErd(entities, relations, dialect);
      expect(sql).toContain('CREATE TABLE schueler_kurs');
      expect(sql).toContain('PRIMARY KEY (schueler_id, kurs_id)');
      expect(sql).toContain('FOREIGN KEY (schueler_id) REFERENCES schueler(id)');
      expect(sql).toContain('FOREIGN KEY (kurs_id) REFERENCES kurs(id)');

      engine.loadSql(sql, dialect);
      const schema = engine.getSchema();
      expect(schema.map((t) => t.name).sort()).toEqual([
        'kurs',
        'schueler',
        'schueler_kurs',
      ]);

      const junction = schema.find((t) => t.name === 'schueler_kurs')!;
      expect(junction.columns.filter((c) => c.primaryKey).map((c) => c.name)).toEqual([
        'schueler_id',
        'kurs_id',
      ]);

      engine.execute("INSERT INTO schueler (name) VALUES ('Lena'), ('Jonas');", dialect);
      engine.execute("INSERT INTO kurs (fach) VALUES ('Informatik'), ('Mathe');", dialect);
      engine.execute(
        'INSERT INTO schueler_kurs (schueler_id, kurs_id) VALUES (1, 1), (1, 2), (2, 1);',
        dialect
      );

      // Duplicate composite PK must fail
      expect(() =>
        engine.execute('INSERT INTO schueler_kurs (schueler_id, kurs_id) VALUES (1, 1);', dialect)
      ).toThrow();

      const res = engine.execute(
        `SELECT s.name, k.fach
         FROM schueler_kurs sk
         JOIN schueler s ON sk.schueler_id = s.id
         JOIN kurs k ON sk.kurs_id = k.id
         ORDER BY s.name, k.fach;`,
        dialect
      );
      expect(res[0].values).toEqual([
        ['Jonas', 'Informatik'],
        ['Lena', 'Informatik'],
        ['Lena', 'Mathe'],
      ]);
    }
  );

  it.each(dialects)('executes DEFAULT_ERD_MODEL cleanly in %s', (dialect) => {
    const sql = generateSqlFromErd(
      DEFAULT_ERD_MODEL.entities,
      DEFAULT_ERD_MODEL.relations,
      dialect
    );
    engine.loadSql(sql, dialect);
    const schema = engine.getSchema();
    expect(schema.map((t) => t.name).sort()).toEqual(['autor', 'buch']);
  });
});
