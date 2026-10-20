// Loads one JSON file per game from content/games/.
//
// Why a folder instead of one big array: a Git-based CMS (Pages CMS / Decap)
// edits one file per entry, and a typo in one game can no longer break the
// other seventeen.
//
// On-disk shape (flat, so every field maps to a single CMS input):
//   { "id", "title", "year", "order",
//     "genre_zh","genre_en","genre_tr",
//     "platforms": [],
//     "art_c1","art_c2","art_pattern",
//     "blurb_zh","blurb_en","blurb_tr",
//     "cover": "" }
//
// In-memory shape (what the templates use) keeps the nested objects.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const GAMES_DIR = path.join(ROOT, "content", "games");

const PATTERNS = new Set(["grid", "rings", "stripes", "dots", "arcs"]);
const HEX = /^#[0-9a-fA-F]{3,8}$/;

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const color = (value, fallback) => {
  const v = clean(value);
  return HEX.test(v) ? v : fallback;
};

const text = (value, fallback = "") => {
  const v = clean(value);
  return v === "" ? fallback : v;
};

function normalize(raw, file) {
  const pattern = clean(raw.art_pattern);
  return {
    source: `content/games/${file}`,
    id: clean(raw.id),
    title: text(raw.title),
    year: Number.isFinite(Number(raw.year)) ? Number(raw.year) : 0,
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 999,
    genre: {
      zh: text(raw.genre_zh, "—"),
      en: text(raw.genre_en, "—"),
      tr: text(raw.genre_tr, "—")
    },
    platforms: Array.isArray(raw.platforms) ? raw.platforms.map((p) => String(p).trim()).filter(Boolean) : [],
    art: {
      c1: color(raw.art_c1, "#7c5cff"),
      c2: color(raw.art_c2, "#22d3ee"),
      pattern: PATTERNS.has(pattern) ? pattern : "grid"
    },
    blurb: {
      zh: text(raw.blurb_zh),
      en: text(raw.blurb_en),
      tr: text(raw.blurb_tr)
    },
    cover: clean(raw.cover)
  };
}

/** Reads every content/games/*.json, validates it, returns games in display order. */
export async function loadGames() {
  let files;
  try {
    files = (await readdir(GAMES_DIR)).filter((f) => f.toLowerCase().endsWith(".json")).sort();
  } catch (error) {
    throw new Error(`读不到目录 content/games/：${error.message}`);
  }

  if (files.length === 0) throw new Error("content/games/ 里没有任何 .json 文件");

  const games = [];
  const ids = new Map();

  for (const file of files) {
    let raw;
    try {
      const content = (await readFile(path.join(GAMES_DIR, file), "utf8")).replace(/^\uFEFF/, "");
      raw = JSON.parse(content);
    } catch (error) {
      throw new Error(`content/games/${file}：JSON 格式有问题 — ${error.message}`);
    }
    if (!clean(raw.id)) throw new Error(`content/games/${file}：缺少 "id"`);
    if (!text(raw.title)) throw new Error(`content/games/${file}：缺少 "title"`);

    const game = normalize(raw, file);
    if (ids.has(game.id)) {
      throw new Error(`content/games/${file}：id "${game.id}" 和 ${ids.get(game.id)} 重复了`);
    }
    ids.set(game.id, file);
    games.push(game);
  }

  games.sort(
    (a, b) => a.order - b.order || b.year - a.year || a.title.localeCompare(b.title, "en")
  );
  return games;
}
