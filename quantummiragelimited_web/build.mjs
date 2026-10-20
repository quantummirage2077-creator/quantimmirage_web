// Static generator for the Neon Anvil portfolio skeleton.
// No dependencies: plain Node (>=18). Run with `node build.mjs`.
//
// Output tree:
//   site/index.html        language redirect
//   site/<locale>/*.html   index, games, games-2, games-3, privacy, terms
//   site/sitemap.xml, site/robots.txt
//   site/assets/*          copied from ../assets

import { mkdir, writeFile, rm, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { site, ui, localeNames, htmlLang } from "./content/site.mjs";
import { legal } from "./content/legal.mjs";
import { coverUrlFor } from "./lib/covers.mjs";
import { loadGames } from "./lib/games.mjs";
import { logoSrc } from "./lib/logo.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "site");

// One JSON file per game (see lib/games.mjs); order comes from each file's "order".
let games;
try {
  games = await loadGames();
} catch (error) {
  // Authoring mistakes fail here, before anything is written.
  console.error(`\n✗ ${error.message}\n`);
  process.exit(1);
}

const LOCALES = site.locales;
const PER_PAGE = site.gamesPerPage ?? 6;
const PAGE_COUNT = Math.ceil(games.length / PER_PAGE);

/* ------------------------------------------------------------------ utils */

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const initials = (title) =>
  title
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * Cover art is optional and file-driven (see lib/covers.mjs): drop
 * `assets/img/games/<name>.jpg` and it is picked up on the next build —
 * no data edit needed. Without a file the CSS gradient + monogram is used.
 */
function coverInner(game) {
  const src = coverUrlFor(game);
  const year = game.year > 0 ? `<span class="cover__year">${game.year}</span>` : "";
  if (src) {
    return `<img class="cover__img" src="${src}" alt="">
              ${year}`;
  }
  return `<span class="cover__grid" aria-hidden="true"></span>
              <span class="cover__mono" aria-hidden="true">${initials(game.title)}</span>
              ${year}`;
}

/** Filename is shared by every locale, so a language switch keeps the page. */
function fileName(pageKey) {
  if (pageKey === "home") return "index.html";
  if (pageKey === "privacy") return "privacy.html";
  if (pageKey === "terms") return "terms.html";
  const n = Number(pageKey.split(":")[1]);
  return n === 1 ? "games.html" : `games-${n}.html`;
}

const pageKeys = [
  "home",
  ...Array.from({ length: PAGE_COUNT }, (_, i) => `games:${i + 1}`),
  "privacy",
  "terms"
];

/* --------------------------------------------------------------- partials */

function head({ locale, pageKey, title, desc }) {
  const file = fileName(pageKey);
  const canonical = `${site.baseUrl}/${locale}/${file}`;
  const alternates = LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${htmlLang[l]}" href="${site.baseUrl}/${l}/${file}">`
  ).join("\n  ");

  return `<!doctype html>
<html lang="${htmlLang[locale]}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${site.baseUrl}/en/${file}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.wordmark)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="${locale === "zh" ? "zh_CN" : locale === "tr" ? "tr_TR" : "en_US"}">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script defer src="../assets/js/site.js"></script>
</head>
<body>`;
}

function header({ locale, pageKey }) {
  const t = ui[locale];
  const active =
    pageKey === "home" ? "home" : pageKey.startsWith("games") ? "games" : pageKey;

  const navItems = [
    ["home", "index.html", t.nav.home],
    ["games", "games.html", t.nav.games],
    ["privacy", "privacy.html", t.nav.privacy],
    ["terms", "terms.html", t.nav.terms]
  ]
    .map(
      ([key, href, label]) =>
        `<a class="nav__link" href="${href}"${
          key === active ? ' aria-current="page"' : ""
        }>${esc(label)}</a>`
    )
    .join("\n        ");

  const langItems = LOCALES.map((l) => {
    const href = `../${l}/${fileName(pageKey)}`;
    const current = l === locale;
    return `<a class="lang__btn" href="${href}" hreflang="${htmlLang[l]}" lang="${htmlLang[l]}"${
      current ? ' aria-current="true"' : ""
    }>${esc(localeNames[l])}</a>`;
  }).join("\n        ");

  const logo = logoSrc();
  const brandMark = logo
    ? `<img class="brand__logo" src="${logo}" alt="" height="26">`
    : `<span class="brand__mark" aria-hidden="true"></span>`;

  return `  <a class="skip" href="#main">${esc(t.skip)}</a>
  <header class="site-header">
    <div class="wrap header__inner">
      <a class="brand" href="index.html" aria-label="${esc(site.wordmark)} — ${esc(t.brandTagline)}">
        ${brandMark}
        <span class="brand__text">
          <span class="brand__word">${esc(site.wordmark)}</span>
          <span class="brand__sub">${esc(t.brandSub)}</span>
        </span>
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle__bars" aria-hidden="true"></span>
        <span class="u-sr">${esc(t.menu)}</span>
      </button>

      <nav class="nav" id="site-nav" aria-label="${esc(t.navLabel)}">
        <div class="nav__links">
        ${navItems}
        </div>

        <div class="lang" role="group" aria-label="${esc(t.langLabel)}">
        ${langItems}
        </div>
      </nav>
    </div>
  </header>`;
}

function footer({ locale, pageKey }) {
  const t = ui[locale];
  const langItems = LOCALES.map((l) => {
    const href = `../${l}/${fileName(pageKey)}`;
    return `<li><a href="${href}" hreflang="${htmlLang[l]}" lang="${htmlLang[l]}">${esc(
      localeNames[l]
    )}</a></li>`;
  }).join("");

  return `  <footer class="site-footer">
    <div class="wrap footer__grid">
      <div class="footer__brand">
        <p class="footer__word">${esc(site.wordmark)}</p>
        <p class="footer__tag">${esc(t.brandTagline)}</p>
      </div>

      <div class="footer__col">
        <p class="footer__h">${esc(t.footer.site)}</p>
        <ul>
          <li><a href="index.html">${esc(t.nav.home)}</a></li>
          <li><a href="games.html">${esc(t.nav.games)}</a></li>
          <li><a href="privacy.html">${esc(t.nav.privacy)}</a></li>
          <li><a href="terms.html">${esc(t.nav.terms)}</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <p class="footer__h">${esc(t.footer.contact)}</p>
        <ul>
          <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <p class="footer__h">${esc(t.langLabel)}</p>
        <ul class="footer__lang">${langItems}</ul>
      </div>
    </div>

    <div class="wrap footer__bottom">
      <p>${esc(t.footer.rights)}</p>
      <p>${esc(site.wordmark)} · ${esc(t.brandSub)}</p>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------------ pages */

function homePage(locale) {
  const t = ui[locale];
  const featured = games[0];
  const featureMeta = [
    featured.year > 0 ? String(featured.year) : "",
    featured.genre[locale],
    featured.platforms.map(esc).join(" / ")
  ]
    .filter((part) => part && part !== "—")
    .join(" · ");
  const body = `  <main id="main">
    <section class="hero">
      <div class="hero__glow" aria-hidden="true"></div>
      <div class="wrap hero__inner">
        <h1 class="hero__title" data-reveal>${esc(t.hero.title)}<em>${esc(
    t.hero.accent
  )}</em>${esc(t.hero.tail)}</h1>
        <div class="hero__actions" data-reveal style="--i:1">
          <a class="btn btn--solid" href="games.html">${esc(t.hero.cta1)} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section wrap">
      <article class="feature" data-reveal>
        <div class="feature__frame">
          <div class="cover cover--${featured.art.pattern}" style="--c1:${featured.art.c1};--c2:${featured.art.c2}">
            ${coverInner(featured)}
          </div>
        </div>
        <div class="feature__body">
          <p class="kicker">${esc(t.featured.kicker)}</p>
          <h2 class="feature__title">${esc(featured.title)}</h2>
          ${featureMeta ? `<p class="feature__meta">${featureMeta}</p>` : ""}
          ${featured.blurb[locale] ? `<p class="feature__lead">${esc(featured.blurb[locale])}</p>` : ""}
          <a class="btn btn--ghost" href="games.html">${esc(t.featured.cta)} <span aria-hidden="true">→</span></a>
        </div>
      </article>
    </section>

    <section class="wrap">
      <div class="cta" data-reveal>
        <div>
          <h2>${esc(t.ctaBand.title)}</h2>
          <p>${esc(t.ctaBand.lead)}</p>
        </div>
        <a class="btn btn--solid" href="mailto:${site.email}">${esc(t.ctaBand.button)}</a>
      </div>
    </section>
  </main>`;

  return body;
}

function gamesPage(locale, pageNumber) {
  const t = ui[locale];
  const start = (pageNumber - 1) * PER_PAGE;
  const slice = games.slice(start, start + PER_PAGE);

  const cards = slice
    .map(
      (g, i) => {
        const meta = [g.genre[locale], g.platforms.map(esc).join(" · ")]
          .filter((part) => part && part !== "—")
          .join('<span class="card__sep">/</span>');
        return `<article class="card" id="game-${g.id}" data-reveal style="--i:${i}">
          <div class="card__frame">
            <div class="cover cover--${g.art.pattern}" style="--c1:${g.art.c1};--c2:${g.art.c2}">
              ${coverInner(g)}
            </div>
          </div>
          <div class="card__body">
            <h3 class="card__title">${esc(g.title)}</h3>
            ${meta ? `<p class="card__meta">${meta}</p>` : ""}
            ${g.blurb[locale] ? `<p class="card__blurb">${esc(g.blurb[locale])}</p>` : ""}
          </div>
        </article>`;
      }
    )
    .join("\n        ");

  const pages = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1);
  const nums = pages
    .map((n) => {
      const href = fileName(`games:${n}`);
      const label = esc(t.games.pageAria.replace("{n}", String(n)));
      if (n === pageNumber) {
        return `<li><a class="pager__num is-active" href="${href}" aria-current="page" aria-label="${label}">${n}</a></li>`;
      }
      return `<li><a class="pager__num" href="${href}" aria-label="${label}">${n}</a></li>`;
    })
    .join("");

  const prev =
    pageNumber > 1
      ? `<a class="pager__edge" href="${fileName(
          `games:${pageNumber - 1}`
        )}" rel="prev"><span aria-hidden="true">←</span> ${esc(t.games.prev)}</a>`
      : `<span class="pager__edge is-disabled" aria-disabled="true"><span aria-hidden="true">←</span> ${esc(
          t.games.prev
        )}</span>`;

  const next =
    pageNumber < PAGE_COUNT
      ? `<a class="pager__edge" href="${fileName(
          `games:${pageNumber + 1}`
        )}" rel="next">${esc(t.games.next)} <span aria-hidden="true">→</span></a>`
      : `<span class="pager__edge is-disabled" aria-disabled="true">${esc(
          t.games.next
        )} <span aria-hidden="true">→</span></span>`;

  const meta =
    PAGE_COUNT > 1
      ? t.games.meta
          .replace("{n}", String(games.length))
          .replace("{page}", String(pageNumber))
          .replace("{total}", String(PAGE_COUNT))
      : t.games.count.replace("{n}", String(games.length));

  const pager =
    PAGE_COUNT > 1
      ? `<nav class="pager" aria-label="${esc(t.games.pagination)}">
        ${prev}
        <ol class="pager__nums">${nums}</ol>
        ${next}
      </nav>`
      : "";

  return `  <main id="main">
    <header class="page-head wrap">
      <p class="eyebrow" data-reveal>${esc(t.games.kicker)}</p>
      <h1 class="page-head__title" data-reveal style="--i:1">${esc(t.games.title)}</h1>
      <p class="page-head__lead" data-reveal style="--i:2">${esc(t.games.lead)}</p>
      <p class="page-head__meta" data-reveal style="--i:3">${esc(meta)}</p>
    </header>

    <section class="wrap">
      <div class="grid">
        ${cards}
      </div>
      ${pager}
    </section>
  </main>`;
}

function legalPage(locale, kind) {
  const t = ui[locale];
  const doc = legal[locale].docs[kind];

  const toc = doc.sections
    .map((s, i) => `<li><a href="#s${i + 1}">${esc(s.h)}</a></li>`)
    .join("\n          ");

  const sections = doc.sections
    .map(
      (s, i) => `<section class="legal__section" id="s${i + 1}">
          <h2>${i + 1}. ${esc(s.h)}</h2>
          ${s.p.map((p) => `<p>${esc(p)}</p>`).join("\n          ")}
          ${
            s.li
              ? `<ul>\n            ${s.li
                  .map((item) => `<li>${esc(item)}</li>`)
                  .join("\n            ")}\n          </ul>`
              : ""
          }
        </section>`
    )
    .join("\n        ");

  const contactEmail = kind === "privacy" ? site.privacyEmail : site.email;

  return `  <main id="main">
    <div class="wrap legal">
      <aside class="legal__toc">
        <p class="legal__toc-title">${esc(t.legal.toc)}</p>
        <ol>
          ${toc}
        </ol>
      </aside>

      <article class="legal__doc">
        <p class="eyebrow">${esc(t.legal.eyebrow)}</p>
        <h1 class="legal__title">${esc(doc.title)}</h1>
        <p class="legal__updated"><span>${esc(t.legal.updated)}</span> ${esc(
    legal[locale].updated
  )}</p>
        <p class="legal__intro">${esc(doc.intro)}</p>

        ${sections}

        <div class="legal__foot">
          <p>${esc(t.legal.contact)}: <a href="mailto:${contactEmail}">${esc(
    contactEmail
  )}</a></p>
        </div>
      </article>
    </div>
  </main>`;
}

/* ------------------------------------------------------------------ build */

function document_({ locale, pageKey }) {
  const t = ui[locale];
  let title;
  let desc;
  let body;

  if (pageKey === "home") {
    title = t.meta.home.title;
    desc = t.meta.home.desc;
    body = homePage(locale);
  } else if (pageKey.startsWith("games")) {
    const n = Number(pageKey.split(":")[1]);
    title = n === 1 ? t.meta.games.title : `${t.meta.games.title} · ${n}/${PAGE_COUNT}`;
    desc = t.meta.games.desc;
    body = gamesPage(locale, n);
  } else {
    title = t.meta[pageKey].title;
    desc = t.meta[pageKey].desc;
    body = legalPage(locale, pageKey);
  }

  return `${head({ locale, pageKey, title, desc })}
${header({ locale, pageKey })}
${body}
${footer({ locale, pageKey })}
</body>
</html>
`;
}

function redirectPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Neon Anvil Studio</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <style>
    html, body { margin: 0; height: 100%; }
    body {
      display: grid; place-items: center; background: #0a0a0c; color: #f4f2ec;
      font: 15px/1.6 system-ui, "Segoe UI", "Microsoft YaHei", sans-serif;
    }
    a { color: #d7ff3e; }
  </style>
  <script>
    (function () {
      var lang = "en";
      try {
        var saved = localStorage.getItem("na:lang");
        var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
        nav = nav.toLowerCase();
        lang = saved || (nav.indexOf("zh") === 0 ? "zh" : nav.indexOf("tr") === 0 ? "tr" : "en");
      } catch (e) {}
      location.replace(lang + "/index.html");
    })();
  </script>
</head>
<body>
  <p>Neon Anvil Studio — <a href="en/index.html">Enter</a></p>
</body>
</html>
`;
}

function sitemap() {
  const urls = [];
  for (const locale of LOCALES) {
    for (const key of pageKeys) {
      urls.push(
        `  <url>\n    <loc>${site.baseUrl}/${locale}/${fileName(key)}</loc>\n  </url>`
      );
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  for (const locale of LOCALES) {
    const dir = path.join(OUT, locale);
    await mkdir(dir, { recursive: true });
    for (const key of pageKeys) {
      const html = document_({ locale, pageKey: key });
      await writeFile(path.join(dir, fileName(key)), html, "utf8");
    }
  }

  await writeFile(path.join(OUT, "index.html"), redirectPage(), "utf8");
  await writeFile(path.join(OUT, "sitemap.xml"), sitemap(), "utf8");
  await writeFile(
    path.join(OUT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`,
    "utf8"
  );

  await cp(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });

  const count = LOCALES.length * pageKeys.length;
  console.log(`built ${count} pages + redirect, sitemap, robots -> ${path.relative(ROOT, OUT)}`);
}

main().catch((error) => {
  // Expected authoring mistakes (bad JSON, duplicate id, ...) get one readable
  // line; set DEBUG=1 to see the stack.
  if (process.env.DEBUG) console.error(error);
  else console.error(`\n✗ ${error.message}\n`);
  process.exitCode = 1;
});
