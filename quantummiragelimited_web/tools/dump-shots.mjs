// Extract screenshots from a REA capture_browser_scenario result (JSON or spilled text).
// Usage: node tools/dump-shots.mjs <capture.json|txt> <outDir>
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const [, , input, outDir = ".preview"] = process.argv;
if (!input) {
  console.error("usage: node tools/dump-shots.mjs <capture.json> [outDir]");
  process.exit(1);
}

const raw = await readFile(input, "utf8");
const start = raw.indexOf("{");
const data = JSON.parse(raw.slice(start));

const steps = data?.normalized_result?.steps ?? data?.steps ?? [];
await mkdir(outDir, { recursive: true });

let written = 0;
for (const step of steps) {
  const shot = step?.artifacts?.screenshot;
  if (!shot || shot.state !== "captured") continue;
  const buf = Buffer.from(shot.value.data_base64, "base64");
  const name = `${step.step_index ?? written}-${step.step_id || "step"}.png`;
  await writeFile(path.join(outDir, name), buf);
  console.log(`${name}  ${(buf.length / 1024).toFixed(1)} KB  ${shot.value.sha256.slice(0, 12)}`);
  written += 1;
}

if (!written) console.error("no captured screenshots found");
