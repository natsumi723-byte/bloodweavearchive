import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalogSource = await readFile(resolve(root, "catalog.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(catalogSource, sandbox, { filename: "catalog.js" });
const catalog = sandbox.window.BLOODWEAVE_CATALOG;
const books = catalog.collections.flatMap((collection) =>
  (collection.shelves || []).flatMap((shelf) => shelf.books || [])
);

const styleTag = '  <link rel="stylesheet" href="../../book-navigation.css?v=20261025-1">';
const scriptTags = '  <script src="../../catalog.js?v=20261025-2"></script>\n  <script src="../../book-navigation.js?v=20261025-2"></script>';
let changed = 0;

for (const book of books) {
  const target = resolve(root, book.href);
  let html = await readFile(target, "utf8");
  const original = html;
  html = html.replace(/book-navigation\.js\?v=[^"']+/g, "book-navigation.js?v=20261025-2");
  if (!html.includes("book-navigation.css")) html = html.replace("</head>", `${styleTag}\n</head>`);
  if (!html.includes("book-navigation.js")) html = html.replace("</body>", `${scriptTags}\n</body>`);
  if (html !== original) {
    await writeFile(target, html, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ catalogBooks: books.length, changed }, null, 2));
