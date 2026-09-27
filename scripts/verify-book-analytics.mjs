import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const booksDir = path.resolve("books");
const bookFiles = (await readdir(booksDir))
  .filter((name) => /^ag-\d{3}\.html$/.test(name))
  .sort();

if (bookFiles.length === 0) {
  throw new Error("No public AG book pages were found.");
}

const missing = [];
for (const file of bookFiles) {
  const html = await readFile(path.join(booksDir, file), "utf8");
  if (!html.includes('<script src="../analytics.js"></script>')) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error(`Missing GA4 loader in ${missing.length} book page(s):`);
  for (const file of missing) console.error(`- books/${file}`);
  process.exit(1);
}

console.log(`GA4 loader verified in ${bookFiles.length} public book pages.`);
