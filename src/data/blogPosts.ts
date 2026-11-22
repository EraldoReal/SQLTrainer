import type { BlogCategory, BlogPost } from '@/types/blog';
import { BLOG_POSTS_PART1 } from './blogPostsPart1';
import { BLOG_POSTS_PART2 } from './blogPostsPart2';

export const BLOG_POSTS: BlogPost[] = [...BLOG_POSTS_PART1, ...BLOG_POSTS_PART2];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, { de: string; en: string }> = {
  basics: {
    de: 'SQL-Grundlagen',
    en: 'SQL Basics',
  },
  joins: {
    de: 'JOINs & Relationen',
    en: 'JOINs & Relations',
  },
  aggregation: {
    de: 'Aggregation & Analyse',
    en: 'Aggregation & Analytics',
  },
  ddl_design: {
    de: 'DDL & Datenbankdesign',
    en: 'DDL & Schema Design',
  },
  abitur_school: {
    de: 'Abitur & Schule',
    en: 'Abitur & School',
  },
  templates: {
    de: 'Datenbank-Vorlagen',
    en: 'Database Templates',
  },
  opensource_tech: {
    de: 'Open Source & Technik',
    en: 'Open Source & Tech',
  },
};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
