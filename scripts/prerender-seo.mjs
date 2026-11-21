import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

const BASE_URL = 'https://sql.best-tools.app';

const ROUTES = [
  {
    path: '/app',
    title: 'SQL Trainer Workspace – Interaktiver SQL & MySQL Editor',
    description:
      'Starte den kostenlosen SQL- und MySQL-Trainer direkt im Browser. Schreibe Abfragen, erkunde Schemas und löse interaktive Aufgaben.',
  },
  {
    path: '/mysql-ueben',
    title: 'MySQL üben im Browser – Kostenloser SQL-Trainer ohne XAMPP',
    description:
      'Lerne und teste MySQL-Befehle wie SHOW TABLES, DESCRIBE, AUTO_INCREMENT, CONCAT oder LIMIT sofort im Browser. Perfekt für Schule, Studium und Ausbildung.',
  },
  {
    path: '/sql-joins-lernen',
    title: 'SQL JOINs lernen – INNER JOIN & LEFT JOIN interaktiv verstehen',
    description:
      'Verstehe endlich, wie Tabellen über Primär- und Fremdschlüssel verknüpft werden – mit visuellem ER-Diagramm, Spickzettel und sofortiger Auswertung.',
  },
  {
    path: '/sql-abitur-aufgaben',
    title: 'SQL Abitur-Aufgaben – Informatik-Klausuren interaktiv üben',
    description:
      'Bereite dich gezielt auf das Informatik-Abitur vor: Komplexe Abfragen mit GROUP BY, HAVING, mehrfachen JOINs und Unterabfragen gegen die Musterlösung prüfen.',
  },
  {
    path: '/faq',
    title: 'FAQ – Häufige Fragen zum SQL-Trainer',
    description:
      'Alles zu WebAssembly, Datenschutz, MySQL-Kompatibilität, Desktop-App (macOS/Windows) und dem Einsatz im Unterricht.',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function replaceOrThrow(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`prerender-seo: could not find ${label} in dist/index.html`);
  }
  return html.replace(regex, replacement);
}

function renderRouteHtml(template, route) {
  const url = `${BASE_URL}${route.path}`;
  const titleHtml = escapeHtml(route.title);
  const titleAttr = escapeAttr(route.title);
  const descAttr = escapeAttr(route.description);
  const urlAttr = escapeAttr(url);

  let html = template;
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

  return html;
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`prerender-seo: missing ${templatePath}. Run vite build first.`);
}

const template = fs.readFileSync(templatePath, 'utf8');

for (const route of ROUTES) {
  const outDir = path.join(distDir, route.path.slice(1));
  const outFile = path.join(outDir, 'index.html');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, renderRouteHtml(template, route), 'utf8');
  console.log(`Prerendered ${path.relative(rootDir, outFile)}`);
}
