import { getIndex, publicDir } from "./html.js";
import path from "path";
const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/assets")) {
      return new Response(Bun.file(path.join(publicDir(), url.pathname)), {
        headers: {
          // these files are hashed so we can cache them forever
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const publicFile = Bun.file(path.join(publicDir(), url.pathname));
    if (await publicFile.exists()) {
      return new Response(publicFile);
    }

    if (url.pathname === "/api/ping") return new Response("pong");
    const indexFile = await getIndex();
    return new Response(Bun.file(indexFile));
  },
});

console.log(`Listening on http://localhost:${server.port}`);
