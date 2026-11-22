import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const templatePath = path.join(distDir, 'index.html');

const BASE_URL = 'https://sql.best-tools.app';

const STATIC_ROUTES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/app',
    title: 'SQL Trainer Workspace – Interaktiver SQL & MySQL Editor',
    description:
      'Starte den kostenlosen SQL- und MySQL-Trainer direkt im Browser. Schreibe Abfragen, erkunde Schemas und löse interaktive Aufgaben.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/mysql-ueben',
    title: 'MySQL üben im Browser – Kostenloser SQL-Trainer ohne XAMPP',
    description:
      'Lerne und teste MySQL-Befehle wie SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT oder LIMIT sofort im Browser. Perfekt für Schule, Studium und Ausbildung.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/sql-joins-lernen',
    title: 'SQL JOINs lernen – INNER JOIN & LEFT JOIN interaktiv verstehen',
    description:
      'Verstehe endlich, wie Tabellen über Primär- und Fremdschlüssel verknüpft werden – mit visuellem ER-Diagramm, Spickzettel und sofortiger Auswertung.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/sql-abitur-aufgaben',
    title: 'SQL Abitur-Aufgaben – Informatik-Klausuren interaktiv üben',
    description:
      'Bereite dich gezielt auf das Informatik-Abitur vor: Komplexe Abfragen mit GROUP BY, HAVING, mehrfachen JOINs und Unterabfragen gegen die Musterlösung prüfen.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/faq',
    title: 'FAQ – Häufige Fragen zum SQL-Trainer',
    description:
      'Alles zu WebAssembly, Datenschutz, MySQL-Kompatibilität, Desktop-App (macOS/Windows) und dem Einsatz im Unterricht.',
    changefreq: 'monthly',
    priority: '0.7',
  },
];

function loadBlogPostsFromFile(filePath, exportName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const moduleObj = { exports: {} };
  vm.runInNewContext(transpiled, {
    exports: moduleObj.exports,
    module: moduleObj,
  });

  const posts = moduleObj.exports[exportName];
  if (!Array.isArray(posts)) {
    throw new Error(`prerender-seo: ${exportName} in ${filePath} is not an array`);
  }

  return posts.map((post) => ({
    slug: post.slug,
    titleDe: post.titleDe,
    titleEn: post.titleEn,
    descriptionDe: post.descriptionDe,
    descriptionEn: post.descriptionEn,
    publishedAt: post.publishedAt,
  }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function escapeXml(value) {
  return escapeAttr(value).replaceAll("'", '&apos;');
}

function replaceOrThrow(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`prerender-seo: could not find ${label} in dist/index.html`);
  }
  return html.replace(regex, replacement);
}

function renderRouteHtml(template, route) {
  const url = `${BASE_URL}${route.path}`;
  const lang = route.lang ?? 'de';
  const locale = lang === 'en' ? 'en_US' : 'de_DE';
  const ogType = route.ogType ?? 'website';
  const titleHtml = escapeHtml(route.title);
  const titleAttr = escapeAttr(route.title);
  const descAttr = escapeAttr(route.description);
  const urlAttr = escapeAttr(url);

  let html = template;
  html = replaceOrThrow(
    html,
    /<html\s+lang=["'][^"']*["']/i,
    `<html lang="${lang}"`,
    '<html lang>'
  );
  html = replaceOrThrow(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${titleHtml}</title>`,
    '<title>'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*name=["']description["'][^>]*>/i,
    `<meta name="description" content="${descAttr}" />`,
    'meta[name="description"]'
  );
  html = replaceOrThrow(
    html,
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${urlAttr}" />`,
    'link[rel="canonical"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="${ogType}" />`,
    'meta[property="og:type"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${urlAttr}" />`,
    'meta[property="og:url"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${titleAttr}" />`,
    'meta[property="og:title"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${descAttr}" />`,
    'meta[property="og:description"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*property=["']og:locale["'][^>]*>/i,
    `<meta property="og:locale" content="${locale}" />`,
    'meta[property="og:locale"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${titleAttr}" />`,
    'meta[name="twitter:title"]'
  );
  html = replaceOrThrow(
    html,
    /<meta\s+[^>]*name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${descAttr}" />`,
    'meta[name="twitter:description"]'
  );

  const extraHeadParts = [];
  if (route.hreflangDe && route.hreflangEn) {
    extraHeadParts.push(
      `    <link rel="alternate" hreflang="de" href="${escapeAttr(route.hreflangDe)}" />`,
      `    <link rel="alternate" hreflang="en" href="${escapeAttr(route.hreflangEn)}" />`,
      `    <link rel="alternate" hreflang="x-default" href="${escapeAttr(route.hreflangDe)}" />`
    );
  }
  if (route.jsonLd) {
    const safeJson = JSON.stringify(route.jsonLd, null, 2).replaceAll('<', '\\u003c');
    extraHeadParts.push(
      `    <script type="application/ld+json">\n${safeJson}\n    </script>`
    );
  }

  if (extraHeadParts.length > 0) {
    html = replaceOrThrow(
      html,
      /<\/head>/i,
      `${extraHeadParts.join('\n')}\n  </head>`,
      '</head>'
    );
  }

  return html;
}

function writePrerenderedFile(template, route) {
  const outDir = path.join(distDir, route.path.slice(1));
  const outFile = path.join(outDir, 'index.html');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, renderRouteHtml(template, route), 'utf8');
  return outFile;
}

function buildSitemapXml(entries) {
  const urlBlocks = entries.map((entry) => {
    const lines = [
      '  <url>',
      `    <loc>${escapeXml(`${BASE_URL}${entry.path}`)}</loc>`,
    ];
    if (entry.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    }
    if (entry.priority) {
      lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
    }
    lines.push('  </url>');
    return lines.join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlBlocks,
    '</urlset>',
    '',
  ].join('\n');
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`prerender-seo: missing ${templatePath}. Run vite build first.`);
}

const template = fs.readFileSync(templatePath, 'utf8');

const postsPart1 = loadBlogPostsFromFile(
  path.join(rootDir, 'src', 'data', 'blogPostsPart1.ts'),
  'BLOG_POSTS_PART1'
);
const postsPart2 = loadBlogPostsFromFile(
  path.join(rootDir, 'src', 'data', 'blogPostsPart2.ts'),
  'BLOG_POSTS_PART2'
);
const allPosts = [...postsPart1, ...postsPart2];

// 1. Prerender existing static SEO routes (excluding '/')
for (const route of STATIC_ROUTES.filter((r) => r.path !== '/')) {
  const outFile = writePrerenderedFile(template, route);
  console.log(`Prerendered ${path.relative(rootDir, outFile)}`);
}

// 2. Prerender Blog Index (DE & EN)
const blogIndexRoutes = [
  {
    path: '/blog',
    lang: 'de',
    title: 'SQL & Datenbanken Blog – Tutorials, Vorlagen & Tipps | SQL Trainer',
    description:
      'Praxisnahe SQL-Tutorials, fertige Datenbank-Vorlagen zum direkten Ausprobieren, Abitur-Tipps und Einblicke in WebAssembly & Datenschutz.',
    hreflangDe: `${BASE_URL}/blog`,
    hreflangEn: `${BASE_URL}/en/blog`,
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/en/blog',
    lang: 'en',
    title: 'SQL & Databases Blog – Tutorials, Templates & Tips | SQL Trainer',
    description:
      'Hands-on SQL tutorials, ready-to-use database templates you can open directly in the browser trainer, exam tips, and WebAssembly architecture notes.',
    hreflangDe: `${BASE_URL}/blog`,
    hreflangEn: `${BASE_URL}/en/blog`,
    changefreq: 'weekly',
    priority: '0.8',
  },
];

for (const route of blogIndexRoutes) {
  const outFile = writePrerenderedFile(template, route);
  console.log(`Prerendered ${path.relative(rootDir, outFile)}`);
}

// 3. Prerender all blog posts (DE & EN)
const blogSitemapEntries = [];

for (const post of allPosts) {
  const dePath = `/blog/${post.slug}`;
  const enPath = `/en/blog/${post.slug}`;
  const deUrl = `${BASE_URL}${dePath}`;
  const enUrl = `${BASE_URL}${enPath}`;

  const deTitle = `${post.titleDe} | SQL Trainer Blog`;
  const enTitle = `${post.titleEn} | SQL Trainer Blog`;

  writePrerenderedFile(template, {
    path: dePath,
    lang: 'de',
    ogType: 'article',
    title: deTitle,
    description: post.descriptionDe,
    hreflangDe: deUrl,
    hreflangEn: enUrl,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.titleDe,
      description: post.descriptionDe,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      inLanguage: 'de',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': deUrl,
      },
      author: {
        '@type': 'Organization',
        name: 'SQL Trainer',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SQL Trainer',
        url: `${BASE_URL}/`,
      },
    },
  });

  writePrerenderedFile(template, {
    path: enPath,
    lang: 'en',
    ogType: 'article',
    title: enTitle,
    description: post.descriptionEn,
    hreflangDe: deUrl,
    hreflangEn: enUrl,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.titleEn,
      description: post.descriptionEn,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      inLanguage: 'en',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': enUrl,
      },
      author: {
        '@type': 'Organization',
        name: 'SQL Trainer',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SQL Trainer',
        url: `${BASE_URL}/`,
      },
    },
  });

  blogSitemapEntries.push(
    {
      path: dePath,
      lastmod: post.publishedAt,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      path: enPath,
      lastmod: post.publishedAt,
      changefreq: 'monthly',
      priority: '0.7',
    }
  );
}

console.log(`Prerendered ${allPosts.length * 2} blog article pages (${allPosts.length} DE + ${allPosts.length} EN).`);

// 4. Write dist/sitemap.xml and public/sitemap.xml
const allSitemapEntries = [
  ...STATIC_ROUTES.map((r) => ({
    path: r.path,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...blogIndexRoutes.map((r) => ({
    path: r.path,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...blogSitemapEntries,
];

const sitemapXml = buildSitemapXml(allSitemapEntries);
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Generated sitemap.xml with ${allSitemapEntries.length} URLs.`);
