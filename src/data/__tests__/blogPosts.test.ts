import initSqlJs from 'sql.js';
import { describe, expect, it } from 'vitest';
import {
  BLOG_CATEGORY_LABELS,
  BLOG_POSTS,
  getBlogPostBySlug,
} from '@/data/blogPosts';
import { SqlEngine } from '@/engine/sqlEngine';

async function createSqlJs() {
  return initSqlJs({
    locateFile: (file: string) => `node_modules/sql.js/dist/${file}`,
  });
}

describe('BLOG_POSTS', () => {
  it('contains 44 posts with unique slugs', () => {
    expect(BLOG_POSTS.length).toBe(44);
    const slugs = BLOG_POSTS.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(BLOG_POSTS.length);

    for (const post of BLOG_POSTS) {
      expect(getBlogPostBySlug(post.slug)).toBe(post);
    }
    expect(getBlogPostBySlug('non-existent-slug')).toBeUndefined();
  });

  it('has valid categories and valid relatedSlugs for every post', () => {
    const slugSet = new Set(BLOG_POSTS.map((p) => p.slug));

    for (const post of BLOG_POSTS) {
      expect(BLOG_CATEGORY_LABELS[post.category]).toBeDefined();
      expect(BLOG_CATEGORY_LABELS[post.category].de.trim().length).toBeGreaterThan(0);
      expect(BLOG_CATEGORY_LABELS[post.category].en.trim().length).toBeGreaterThan(0);

      for (const rel of post.relatedSlugs) {
        expect(slugSet.has(rel), `Invalid relatedSlug "${rel}" in "${post.slug}"`).toBe(true);
        expect(rel, `Self-referencing relatedSlug in "${post.slug}"`).not.toBe(post.slug);
      }
    }
  });

  it('has non-empty DE/EN titles, descriptions, keywords, and sections', () => {
    for (const post of BLOG_POSTS) {
      expect(post.titleDe.trim().length, `${post.slug} titleDe`).toBeGreaterThan(0);
      expect(post.titleEn.trim().length, `${post.slug} titleEn`).toBeGreaterThan(0);
      expect(post.descriptionDe.trim().length, `${post.slug} descriptionDe`).toBeGreaterThan(0);
      expect(post.descriptionEn.trim().length, `${post.slug} descriptionEn`).toBeGreaterThan(0);
      expect(post.keywordsDe.length, `${post.slug} keywordsDe`).toBeGreaterThan(0);
      expect(post.keywordsEn.length, `${post.slug} keywordsEn`).toBeGreaterThan(0);
      expect(post.readingMinutes, `${post.slug} readingMinutes`).toBeGreaterThan(0);
      expect(post.sections.length, `${post.slug} sections`).toBeGreaterThan(0);

      for (const section of post.sections) {
        expect(section.headingDe.trim().length).toBeGreaterThan(0);
        expect(section.headingEn.trim().length).toBeGreaterThan(0);
        expect(section.paragraphsDe.length).toBeGreaterThan(0);
        expect(section.paragraphsEn.length).toBeGreaterThan(0);
        for (const p of section.paragraphsDe) {
          expect(p.trim().length).toBeGreaterThan(0);
        }
        for (const p of section.paragraphsEn) {
          expect(p.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('executes every codeExample.sql without error in SqlEngine', async () => {
    const SQL = await createSqlJs();

    for (const post of BLOG_POSTS) {
      if (!post.codeExample) continue;
      expect(post.codeExample.titleDe.trim().length).toBeGreaterThan(0);
      expect(post.codeExample.titleEn.trim().length).toBeGreaterThan(0);
      expect(post.codeExample.sql.trim().length).toBeGreaterThan(0);

      const engine = new SqlEngine('blog_test', SQL);
      await engine.init();
      try {
        expect(
          () => engine.execute(post.codeExample!.sql, 'mysql'),
          `SQL failed for blog post "${post.slug}"`
        ).not.toThrow();
      } finally {
        engine.close();
      }
    }
  });
});
