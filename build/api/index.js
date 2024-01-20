// @bun
async function $() {
  if (Bun.env.NODE_ENV === "development") return "./static/index.dev.html";
  else {
    if (await Bun.file("./static/index.html").exists())
      return "./static/index.html";
    const w = await Bun.file("./web/.vite/manifest.json").text(),
      o = JSON.parse(w),
      [v, S] = [o["src/main.tsx"].file, o["src/main.tsx"].css[0]],
      x = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
        <link rel="stylesheet" href="{{INDEX.CSS}}" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="{{MAIN.JS}}"></script>
      </body>
    </html>`
        .replace("{{MAIN.JS}}", v)
        .replace("{{INDEX.CSS}}", S);
    return await Bun.write("./static/index.html", x), "./static/index.html";
  }
}
function U() {
  if (Bun.env.NODE_ENV === "development") return "../web/dist";
  return "./web";
}
import k from "path";
var y = Bun.serve({
  port: 3000,
  async fetch(w) {
    const o = new URL(w.url);
    if (o.pathname.startsWith("/assets"))
      return new Response(Bun.file(k.join(U(), o.pathname)), {
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      });
    const v = Bun.file(k.join(U(), o.pathname));
    if (await v.exists()) return new Response(v);
    if (o.pathname === "/api/ping") return new Response("pong");
    const S = await $();
    return new Response(Bun.file(S));
  },
});
console.log(`Listening on http://localhost:${y.port}`);
