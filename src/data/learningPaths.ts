import { SQL_TASKS } from '@/data/tasks';
import type { SqlTask } from '@/types/sql';

export type LearningPathId =
  | 'basics'
  | 'aggregation'
  | 'joins'
  | 'ddl_dml'
  | 'abitur';

export interface LearningLecture {
  label: string;
  order: number;
  taskId: string;
  task: SqlTask;
}

export interface LearningPath {
  id: LearningPathId;
  number: number;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  keywords: string[];
  lectures: LearningLecture[];
}

interface PathDefinition {
  id: LearningPathId;
  number: number;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  keywords: string[];
  taskIds: string[];
}

const TASK_BY_ID = new Map<string, SqlTask>(
  SQL_TASKS.map((task) => [task.id, task])
);

const PATH_DEFINITIONS: PathDefinition[] = [
  {
    id: 'basics',
    number: 1,
    titleDe: 'Pfad 1: SQL-Grundlagen',
    titleEn: 'Path 1: SQL Basics',
    descriptionDe:
      'Erste Abfragen mit SELECT, Filterung über WHERE, Sortierung mit ORDER BY und eindeutige Werte mit DISTINCT.',
    descriptionEn:
      'First queries with SELECT, filtering using WHERE, sorting with ORDER BY, and deduplicating with DISTINCT.',
    keywords: ['SELECT', 'WHERE', 'ORDER BY', 'DISTINCT'],
    taskIds: [
      'schule-1-basics',
      'schule-2-basics',
      'shop-1-basics',
      'shop-2-basics',
      'kino-1-basics',
      'kino-2-basics',
    ],
  },
  {
    id: 'aggregation',
    number: 2,
    titleDe: 'Pfad 2: Aggregation & Gruppierung',
    titleEn: 'Path 2: Aggregation & Grouping',
    descriptionDe:
      'Daten zusammenfassen mit COUNT, SUM, AVG, Gruppen bilden mit GROUP BY und Gruppen filtern mit HAVING.',
    descriptionEn:
      'Summarize data with COUNT, SUM, AVG, group rows with GROUP BY, and filter groups with HAVING.',
    keywords: ['COUNT', 'SUM', 'AVG', 'GROUP BY', 'HAVING'],
    taskIds: [
      'schule-3-aggregation',
      'schule-4-aggregation',
      'shop-3-aggregation',
      'shop-4-aggregation',
      'shop-10-aggregation',
      'kino-3-aggregation',
      'kino-4-aggregation',
      'kino-9-aggregation',
      'leer-7-aggregation',
      'leer-8-aggregation',
    ],
  },
  {
    id: 'joins',
    number: 3,
    titleDe: 'Pfad 3: Relationen & Joins',
    titleEn: 'Path 3: Relations & Joins',
    descriptionDe:
      'Tabellen verknüpfen mit INNER JOIN, fehlende Zuordnungen finden mit LEFT JOIN und Multi-Tabellen-Joins meistern.',
    descriptionEn:
      'Combine tables with INNER JOIN, find unmatched rows with LEFT JOIN, and master multi-table joins.',
    keywords: ['INNER JOIN', 'LEFT JOIN', 'Multi-Tabellen-Joins'],
    taskIds: [
      'schule-5-joins',
      'schule-6-joins',
      'schule-9-joins',
      'shop-5-joins',
      'shop-6-joins',
      'shop-9-joins',
      'kino-5-joins',
      'kino-6-joins',
      'kino-10-joins',
      'leer-9-joins',
      'leer-10-joins',
      'leer-11-joins',
    ],
  },
  {
    id: 'ddl_dml',
    number: 4,
    titleDe: 'Pfad 4: Datenbanken bauen (DDL & DML)',
    titleEn: 'Path 4: Building Databases (DDL & DML)',
    descriptionDe:
      'Eigene Schemas mit CREATE TABLE, PRIMARY KEY und FOREIGN KEY entwerfen sowie Daten mit INSERT, UPDATE, DELETE, ALTER TABLE und Unterabfragen bearbeiten.',
    descriptionEn:
      'Design schemas with CREATE TABLE, PRIMARY KEY, and FOREIGN KEY, and manipulate or query data with INSERT, UPDATE, DELETE, ALTER TABLE, and subqueries.',
    keywords: [
      'CREATE TABLE',
      'PRIMARY KEY',
      'FOREIGN KEY',
      'INSERT',
      'UPDATE',
      'ALTER TABLE',
    ],
    taskIds: [
      'leer-1-basics',
      'leer-2-basics',
      'leer-3-basics',
      'leer-4-subqueries_ddl',
      'leer-5-subqueries_ddl',
      'leer-6-subqueries_ddl',
      'schule-10-subqueries_ddl',
      'schule-11-subqueries_ddl',
      'shop-11-subqueries_ddl',
      'kino-11-subqueries_ddl',
      'schule-12-subqueries_ddl',
      'shop-12-subqueries_ddl',
      'kino-12-subqueries_ddl',
      'schule-7-subqueries_ddl',
      'schule-8-subqueries_ddl',
      'shop-7-subqueries_ddl',
      'shop-8-subqueries_ddl',
      'kino-7-subqueries_ddl',
      'kino-8-subqueries_ddl',
      'leer-12-subqueries_ddl',
    ],
  },
  {
    id: 'abitur',
    number: 5,
    titleDe: 'Pfad 5: Abitur- & Prüfungs-Training',
    titleEn: 'Path 5: Abitur & Exam Training',
    descriptionDe:
      'Alle als Abitur-Aufgabe markierten Aufgaben aus sämtlichen Datenbanken für die gezielte Prüfungsvorbereitung.',
    descriptionEn:
      'All tasks marked as Abitur exam level across all databases for focused exam preparation.',
    keywords: ['Abitur', 'Prüfung', 'SQL-Kompetenz'],
    taskIds: SQL_TASKS.filter((task) => task.isAbitur === true).map(
      (task) => task.id
    ),
  },
];

function buildLectures(pathNumber: number, taskIds: string[]): LearningLecture[] {
  const lectures: LearningLecture[] = [];
  for (const taskId of taskIds) {
    const task = TASK_BY_ID.get(taskId);
    if (!task) continue;
    const order = lectures.length + 1;
    lectures.push({
      label: `${pathNumber}.${order}`,
      order,
      taskId,
      task,
    });
  }
  return lectures;
}

const LEARNING_PATHS: LearningPath[] = PATH_DEFINITIONS.map((def) => ({
  id: def.id,
  number: def.number,
  titleDe: def.titleDe,
  titleEn: def.titleEn,
  descriptionDe: def.descriptionDe,
  descriptionEn: def.descriptionEn,
  keywords: def.keywords,
  lectures: buildLectures(def.number, def.taskIds),
}));

const PRIMARY_LECTURE_LABEL_BY_TASK_ID = new Map<string, string>();
for (const path of LEARNING_PATHS) {
  for (const lecture of path.lectures) {
    if (!PRIMARY_LECTURE_LABEL_BY_TASK_ID.has(lecture.taskId)) {
      PRIMARY_LECTURE_LABEL_BY_TASK_ID.set(lecture.taskId, lecture.label);
    }
  }
}

/**
 * Returns all 5 structured learning paths with ordered lectures.
 */
export function getLearningPaths(): LearningPath[] {
  return LEARNING_PATHS;
}

/**
 * Returns the first lecture in the given path whose taskId is not in completedIds,
 * or null if all lectures are completed (or the path does not exist).
 */
export function getNextIncompleteLecture(
  pathId: LearningPathId,
  completedIds: string[]
): LearningLecture | null {
  const path = LEARNING_PATHS.find((item) => item.id === pathId);
  if (!path) return null;

  const completed = new Set(completedIds);
  return path.lectures.find((lecture) => !completed.has(lecture.taskId)) ?? null;
}

/**
 * Returns the primary lecture label (e.g. "1.2", "4.14") for a given taskId,
 * or null if the taskId is not part of any learning path.
 */
export function getLectureLabel(taskId: string): string | null {
  return PRIMARY_LECTURE_LABEL_BY_TASK_ID.get(taskId) ?? null;
}
