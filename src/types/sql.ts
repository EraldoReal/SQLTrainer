export type SqlDialect = 'mysql' | 'sqlite';

export interface ForeignKeyRef {
  table: string;
  column: string;
}

export interface ColumnInfo {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
  defaultValue: string | null;
  foreignKey?: ForeignKeyRef;
}

export interface TableSchema {
  name: string;
  columns: ColumnInfo[];
}

export type SqlCellValue = string | number | null | Uint8Array;

export interface QueryResult {
  columns: string[];
  values: SqlCellValue[][];
  rowCount: number;
  executionTimeMs: number;
  affectedRows?: number;
  message?: string;
}

export interface DatabasePreset {
  id: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  descriptionEn: string;
  sql: string;
}

export type TaskTopic = 'basics' | 'aggregation' | 'joins' | 'subqueries_ddl';

export interface SqlTask {
  id: string;
  databaseId: string;
  topic: TaskTopic;
  isAbitur?: boolean;
  titleDe: string;
  titleEn: string;
  promptDe: string;
  promptEn: string;
  hintDe: string;
  hintEn: string;
  solutionSql: string;
  checkOrder?: boolean;
  isCustom?: boolean;
}

export interface GradeResult {
  passed: boolean;
  feedbackDe: string;
  feedbackEn: string;
  details?: string;
}

export interface CheatSheetItem {
  id: string;
  categoryDe: string;
  categoryEn: string;
  titleDe: string;
  titleEn: string;
  syntax: string;
  descriptionDe: string;
  descriptionEn: string;
  exampleSql: string;
}

export interface CustomSnippet {
  id: string;
  title: string;
  sql: string;
  createdAt: number;
}

export interface QueryHistoryEntry {
  id: string;
  sql: string;
  dialect: SqlDialect;
  databaseId: string;
  executedAt: number;
  executionTimeMs: number;
  rowCount: number;
  success: boolean;
  error?: string;
}
