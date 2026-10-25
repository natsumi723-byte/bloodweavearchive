(() => {
  "use strict";

  const catalog = window.BLOODWEAVE_CATALOG;
  const main = document.querySelector("main");
  const research = main?.querySelector("details.research");
  if (!catalog?.collections || !main || !research) return;

  const currentFile = decodeURIComponent(location.pathname.split("/").pop() || "");
  const seriesByCollection = {
    "astarion-origin-with-gale": "oa",
    "gale-origin-with-astarion": "og",
    "shared-journey": "ag",
    "wayside-remarks": "vb"
  };
  const booksBySeries = {};

  for (const collection of catalog.collections) {
    const series = seriesByCollection[collection.id];
    if (!series) continue;
    booksBySeries[series] = (collection.shelves || []).flatMap((shelf) => shelf.books || []);
  }

  let series = "";
  let books = [];
  let index = -1;
  for (const [candidateSeries, candidateBooks] of Object.entries(booksBySeries)) {
    const candidateIndex = candidateBooks.findIndex((book) => decodeURIComponent(book.href.split("/").pop()) === currentFile);
    if (candidateIndex !== -1) {
      series = candidateSeries;
      books = candidateBooks;
      index = candidateIndex;
      break;
    }
  }
  if (index === -1) return;

  const current = books[index];
  const previous = books[index - 1];
  const next = books[index + 1];
  const code = series.toUpperCase();
  const edge = previous && next ? "middle" : previous ? "last" : "first";
  const component = document.createElement("section");
  component.className = "book-continuation";
  component.id = "book-continuation";
  component.dataset.series = series;
  component.dataset.edge = edge;
  component.setAttribute("aria-label", `${code} 馆藏接续`);

  const header = document.createElement("header");
  header.className = "book-continuation__header";
  const heading = document.createElement("h2");
  heading.className = "book-continuation__current";
  const readingLabel = document.createElement("span");
  readingLabel.className = "book-continuation__label";
  readingLabel.textContent = "正在阅读";
  const currentTitle = document.createElement("span");
  currentTitle.className = "book-continuation__title";
  currentTitle.textContent = `${current.archiveCode}　${current.title}`;
  heading.append(readingLabel, currentTitle);

  const jump = document.createElement("label");
  jump.className = "book-continuation__jump";
  const jumpLabel = document.createElement("span");
  jumpLabel.textContent = "快速跳转";
  const select = document.createElement("select");
  select.setAttribute("aria-label", `选择 ${code} 馆藏`);
  const prompt = document.createElement("option");
  prompt.value = "";
  prompt.textContent = `选择 ${code} 馆藏`;
  select.append(prompt);
  books.forEach((book, bookIndex) => {
    const option = document.createElement("option");
    option.value = `../../${book.href}`;
    option.textContent = `${book.archiveCode}　${book.title}${bookIndex === index ? "（当前）" : ""}`;
    option.disabled = bookIndex === index;
    select.append(option);
  });
  select.addEventListener("change", () => {
    if (select.value) location.href = select.value;
  });
  jump.append(jumpLabel, select);
  header.append(heading, jump);

  const nav = document.createElement("nav");
  nav.className = "book-continuation__nav";
  nav.setAttribute("aria-label", `${code} 相邻馆藏`);

  function adjacentLink(book, relation, arrow) {
    const link = document.createElement("a");
    link.href = `../../${book.href}`;
    link.rel = relation === "上一册" ? "prev" : "next";
    const arrowElement = document.createElement("span");
    arrowElement.className = "book-continuation__arrow";
    arrowElement.setAttribute("aria-hidden", "true");
    arrowElement.textContent = arrow;
    const copy = document.createElement("span");
    copy.className = "book-continuation__nav-copy";
    const label = document.createElement("span");
    label.className = "book-continuation__nav-label";
    label.textContent = `${relation}　${book.archiveCode}`;
    const title = document.createElement("span");
    title.className = "book-continuation__nav-title";
    title.textContent = book.title;
    copy.append(label, title);
    if (relation === "上一册") link.append(arrowElement, copy);
    else link.append(copy, arrowElement);
    return link;
  }

  const position = document.createElement("span");
  position.className = "book-continuation__position";
  position.textContent = `${index + 1} / ${books.length}`;
  if (previous) nav.append(adjacentLink(previous, "上一册", "←"));
  nav.append(position);
  if (next) nav.append(adjacentLink(next, "下一册", "→"));

  component.append(header, nav);
  research.before(component);
})();
