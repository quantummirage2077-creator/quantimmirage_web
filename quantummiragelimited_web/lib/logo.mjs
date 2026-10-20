// Optional image logo for the header.
//
// Drop `assets/img/logo.svg` (or .png / .webp / .jpg / .jpeg) and the build
// swaps the CSS-drawn square for your file. Without one, the built-in
// gradient mark is used, so the theme still works with zero assets.
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "assets", "img");
const EXT = [".svg", ".png", ".webp", ".jpg", ".jpeg"];

/** Public URL for the header logo relative to a page in site/<locale>/, or null. */
export function logoSrc() {
  for (const ext of EXT) {
    if (existsSync(path.join(DIR, `logo${ext}`))) return `../assets/img/logo${ext}`;
  }
  return null;
}
