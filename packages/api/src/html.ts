export async function getIndex() {
  if (Bun.env.NODE_ENV === "development") {
    return "./static/index.dev.html";
  } else {
    if (await Bun.file("./static/index.html").exists()) {
      return "./static/index.html";
    }
    const manifestFile = await Bun.file("./web/.vite/manifest.json").text();
    const manifest = JSON.parse(manifestFile);
    const [jsFile, cssFile] = [
      manifest["src/main.tsx"].file,
      manifest["src/main.tsx"]["css"][0],
    ];
    const indexHTML = `<!doctype html>
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
      .replace("{{MAIN.JS}}", jsFile)
      .replace("{{INDEX.CSS}}", cssFile);
    await Bun.write("./static/index.html", indexHTML);

    return "./static/index.html";
  }
}

export function publicDir() {
  if (Bun.env.NODE_ENV === "development") {
    return "../web/dist";
  }
  return "./web";
}
