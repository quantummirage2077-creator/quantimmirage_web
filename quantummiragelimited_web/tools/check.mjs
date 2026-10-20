// Structural checks for the generated site. Run: node tools/check.mjs
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadGames } from "../lib/games.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");

const GAME_COUNT = (await loadGames()).length;
const PER_PAGE = 6;
const PAGE_COUNT = Math.ceil(GAME_COUNT / PER_PAGE);

const problems = [];
const fail = (file, message) => problems.push(`${path.relative(ROOT, file)}: ${message}`);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const count = (haystack, needle) => haystack.split(needle).length - 1;

const files = await walk(SITE);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const isRedirect = path.relative(SITE, file) === "index.html";

  if (!/<html lang="[A-Za-z-]+"/.test(html)) fail(file, "missing <html lang>");
  if (/\bundefined\b/.test(html)) fail(file, "contains the literal 'undefined'");
  if (/\bNaN\b/.test(html)) fail(file, "contains the literal 'NaN'");

  if (isRedirect) continue;

  if (count(html, "<h1") !== 1) fail(file, `expected exactly one <h1>, found ${count(html, "<h1")}`);
  if (!/<title>[^<]{4,}<\/title>/.test(html)) fail(file, "missing or empty <title>");
  if (!/id="main"/.test(html)) fail(file, "missing #main target");
  if (!/class="skip"/.test(html)) fail(file, "missing skip link");

  if (count(html, 'class="lang__btn"') !== 3)
    fail(file, `expected 3 language buttons, found ${count(html, 'class="lang__btn"')}`);
  if (count(html, 'aria-current="true"') !== 1)
    fail(file, `expected 1 active language, found ${count(html, 'aria-current="true"')}`);

  const navBlock = html.match(/<nav class="nav"[\s\S]*?<\/nav>/);
  if (!navBlock) fail(file, "missing primary nav");
  else if (count(navBlock[0], 'aria-current="page"') !== 1)
    fail(file, `expected 1 active nav item, found ${count(navBlock[0], 'aria-current="page"')}`);

  if (/[\\/]games(-\d+)?\.html$/.test(file)) {
    const page = file.match(/games(?:-(\d+))?\.html$/)[1];
    const pageNumber = page ? Number(page) : 1;
    const expected = Math.max(0, Math.min(PER_PAGE, GAME_COUNT - (pageNumber - 1) * PER_PAGE));
    const cards = count(html, 'class="card"');
    if (cards !== expected) fail(file, `expected ${expected} game cards, found ${cards}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|data:|#)/.test(href)) continue;
    const rawTarget = href.split("#")[0].split("?")[0];
    if (!rawTarget) continue;
    let target = rawTarget;
    try {
      target = decodeURIComponent(rawTarget);
    } catch {
      /* malformed escape: fall back to the literal path */
    }
    const resolved = path.resolve(path.dirname(file), target);
    try {
      await stat(resolved);
    } catch {
      fail(file, `broken local link: ${href}`);
    }
  }
}

const sitemap = await readFile(path.join(SITE, "sitemap.xml"), "utf8");
const expectedUrls = 3 * (3 + PAGE_COUNT);
if (count(sitemap, "<loc>") !== expectedUrls)
  fail(path.join(SITE, "sitemap.xml"), `expected ${expectedUrls} urls, found ${count(sitemap, "<loc>")}`);

const css = await readFile(path.join(SITE, "assets/css/style.css"), "utf8");
const usedClasses = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/class="([^"]+)"/g)) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((c) => usedClasses.add(c));
  }
}
const unused = [...usedClasses].filter((c) => !css.includes(`.${c}`) && !c.startsWith("u-"));
if (unused.length) problems.push(`classes used in HTML but absent from CSS: ${unused.join(", ")}`);

const pages = htmlFiles.length;
const broken = problems.filter((p) => p.includes("broken local link"));
console.log(`checked ${pages} html files`);
if (broken.length) {
  console.log(`\nbroken links (${broken.length}):`);
  broken.forEach((p) => console.log("  - " + p));
}
const rest = problems.filter((p) => !p.includes("broken local link"));
if (rest.length) {
  console.log(`\nproblems (${rest.length}):`);
  rest.forEach((p) => console.log("  - " + p));
}
if (!problems.length) console.log("all checks passed");
process.exitCode = problems.length ? 1 : 0;
