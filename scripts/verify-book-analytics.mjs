import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { runInNewContext } from "node:vm";

const read = file => readFile(file, "utf8");
const release = runInNewContext(
  (await read("catalog.js")) + "\nwindow.BLOODWEAVE_CATALOG",
  { window: {} },
  { timeout: 1000 },
);
const ea = runInNewContext(
  (await read("ea-catalog.js")) + "\nearlyAccessBooks",
  {},
  { timeout: 1000 },
);
const p8 = release.collections.flatMap(collection => collection.shelves.flatMap(shelf => shelf.books));
const legacy = (await readdir("books")).filter(file => /^ag-\d{3}\.html$/.test(file));
const groups = { P8: p8.map(book => book.href), EA: ea.map(book => book.href), Legacy: legacy.map(file => "books/" + file) };
const failures = [];
for (const [name, files] of Object.entries(groups)) {
  if (!files.length) failures.push(name + ": empty catalog");
  for (const file of new Set(files)) {
    if (typeof file !== "string" || !/^books\/(?:id\/)?[\w-]+\.html$/.test(file)) {
      failures.push(name + ": invalid path " + file);
      continue;
    }
    try {
      const html = (await read(file)).replace(/<!--[\s\S]*?-->/g, "");
      const expected = path.posix.relative(path.posix.dirname(file), "analytics.js");
      const scripts = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)];
      const analytics = scripts.filter(([, src]) => /(?:analytics\.js|googletagmanager\.com\/gtag\/js)/i.test(src));
      if (analytics.length !== 1 || analytics[0][1] !== expected) {
        failures.push(file + ": expected exactly one GA4 loader at " + expected);
      }
    } catch (error) {
      failures.push(file + ": " + error.message);
    }
  }
  console.log(name + ": checked " + new Set(files).size + " book pages");
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
