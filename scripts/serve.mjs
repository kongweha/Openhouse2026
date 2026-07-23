import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const publicRoot = path.resolve("public");
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
    let target = path.resolve(publicRoot, `.${pathname}`);

    if (target !== publicRoot && !target.startsWith(`${publicRoot}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const targetStat = await stat(target);
    if (targetStat.isDirectory()) {
      target = path.join(target, "index.html");
    }

    const fileStat = await stat(target);
    response.writeHead(200, {
      "Content-Type":
        mimeTypes[path.extname(target).toLowerCase()] ??
        "application/octet-stream",
      "Content-Length": fileStat.size,
      "Cache-Control": "no-store",
    });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  }
}).listen(port, () => {
  console.log(`OpenHouse2026 is running at http://localhost:${port}`);
});
