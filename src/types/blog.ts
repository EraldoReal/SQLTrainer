export type BlogCategory =
  | 'basics'
  | 'joins'
  | 'aggregation'
  | 'ddl_design'
  | 'abitur_school'
  | 'templates'
  | 'opensource_tech';

export interface BlogCodeExample {
  titleDe: string;
  titleEn: string;
  sql: string;
  /** If true, users can add this script directly as a named database project in the Hub */
  isDatabaseTemplate?: boolean;
  suggestedDbName?: string;
}

export interface BlogPostSection {
  headingDe: string;
  headingEn: string;
  paragraphsDe: string[];
  paragraphsEn: string[];
}

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  readingMinutes: number;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  keywordsDe: string[];
  keywordsEn: string[];
  sections: BlogPostSection[];
  codeExample?: BlogCodeExample;
  relatedSlugs: string[];
}
