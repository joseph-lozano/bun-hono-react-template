import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.get("/api/ping", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return c.text("pong");
});

app.use("*", serveStatic({ root: "../web/dist" }));

if (Bun.env.NODE_ENV === "development") {
  app.get("/*", serveStatic({ path: "./static/index.dev.html" }));
} else {
  const manifestFile = Bun.file("../web/dist/.vite/manifest.json");
  const template = Bun.file("./static/index.template.html");
  const manifest = JSON.parse(await manifestFile.text());
  const [jsFile, cssFile] = [
    manifest["src/main.tsx"].file,
    manifest["src/main.tsx"]["css"][0],
  ];
  const indexHTML = (await template.text())
    .replace("{{MAIN.JS}}", jsFile)
    .replace("{{INDEX.CSS}}", cssFile);
  Bun.write("./static/index.html", indexHTML);

  app.get("/*", serveStatic({ path: "./static/index.html" }));
}

export default app;
