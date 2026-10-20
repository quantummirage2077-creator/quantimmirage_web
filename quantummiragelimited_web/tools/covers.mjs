// Checklist for cover images. Run: node tools/covers.mjs
import path from "node:path";
import { coverFileFor, GAMES_IMG_DIR } from "../lib/covers.mjs";
import { loadGames } from "../lib/games.mjs";

const games = await loadGames();

const rows = games.map((game) => ({
  id: game.id,
  title: game.title,
  year: game.year,
  file: coverFileFor(game)
}));

const done = rows.filter((row) => row.file).length;
const rel = path.relative(process.cwd(), GAMES_IMG_DIR) || GAMES_IMG_DIR;

console.log(`封面图目录：${rel}`);
console.log(`已配图 ${done} / ${rows.length}`);
console.log("");
console.log("状态  id（建议文件名）        游戏         现有文件");
console.log("----  ----------------------  ----------  --------------------");

for (const row of rows) {
  const status = row.file ? "  ✓ " : "  · ";
  const id = row.id.padEnd(22, " ");
  const title = `${row.title} (${row.year})`.padEnd(12, " ");
  console.log(`${status} ${id}  ${title}  ${row.file || "—"}`);
}

console.log("");
if (done === rows.length) {
  console.log("全部作品都有真图了。");
} else {
  console.log("标 · 的作品仍在用渐变占位。把图放进上面的目录、文件名用 id 或游戏名即可，再跑一次 build。");
}
