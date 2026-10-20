// Cover-image lookup.
//
// Two ways to attach artwork to a game:
//   1. `"cover": "assets/img/games/ashen-vale.jpg"` (or just a file name) — what
//      a CMS image upload writes; leading "/" and Windows separators are fine.
//   2. Convention: drop a file named after the game's id or title into
//      assets/img/games/ — matched loosely, so "Ashen Vale.jpg",
//      "ashen-vale.png" and "ASHEN_VALE.webp" all hit the same game.
// Without either, the CSS gradient + monogram placeholder is used.
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
export const GAMES_IMG_DIR = path.join(ROOT, "assets", "img", "games");

// Files are matched loosely: lowercased, accents folded, everything that is not
// a-z0-9 dropped. So "Buzlu Meyve Sebze Karoları.jpg" and
// "buzlu-meyve-sebze-karolari.png" hit the same game.
const normalize = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

let index = null;

/** Map of normalized base name -> real file name in the covers folder. */
export function coverIndex() {
  if (index) return index;
  index = new Map();
  if (existsSync(GAMES_IMG_DIR)) {
    for (const file of readdirSync(GAMES_IMG_DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXT.includes(ext)) continue;
      const key = normalize(path.basename(file, path.extname(file)));
      if (key && !index.has(key)) index.set(key, file);
    }
  }
  return index;
}

/** Resolve one game's artwork to a project-relative path, or null. */
export function coverPathFor(game) {
  const explicit = String(game.cover || "").trim();
  if (explicit) {
    // Reject URLs and anything trying to leave the project.
    if (!/^[a-z][a-z0-9+.-]*:/i.test(explicit) && !explicit.includes("..")) {
      const cleaned = explicit.replace(/\\/g, "/").replace(/^\/+/, "");
      if (cleaned.startsWith("assets/")) {
        if (existsSync(path.join(ROOT, cleaned))) return cleaned;
      } else {
        const name = path.basename(cleaned);
        if (existsSync(path.join(GAMES_IMG_DIR, name))) return `assets/img/games/${name}`;
        const matched = coverIndex().get(normalize(path.basename(name, path.extname(name))));
        if (matched) return `assets/img/games/${matched}`;
      }
    }
  }

  for (const candidate of [game.id, game.title]) {
    const file = candidate && coverIndex().get(normalize(candidate));
    if (file) return `assets/img/games/${file}`;
  }
  return null;
}

/** Public URL relative to a page inside site/<locale>/, or null. */
export function coverUrlFor(game) {
  const relative = coverPathFor(game);
  if (!relative) return null;
  return `../${relative.split("/").map(encodeURIComponent).join("/")}`;
}

/** Kept for tools that only want the bare file name. */
export function coverFileFor(game) {
  const relative = coverPathFor(game);
  return relative ? path.basename(relative) : null;
}
