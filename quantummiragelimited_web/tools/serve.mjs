// Tiny static server for local preview only: node tools/serve.mjs [port]
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const PORT = Number(process.argv[2] || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    let target = path.join(ROOT, url === "/" ? "/index.html" : url);
    if (!path.resolve(target).startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target, "index.html");
      res.writeHead(200, {
        "content-type": TYPES[path.extname(target)] || "application/octet-stream"
      });
      createReadStream(target).pipe(res);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found");
    }
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`preview: http://127.0.0.1:${PORT}/`);
  });
