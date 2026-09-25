(function () {
  "use strict";

  const catalog = window.BLOODWEAVE_CATALOG;
  const root = document.querySelector("#collection-list");

  const navigationMenus = Array.from(document.querySelectorAll(".collection-nav"));
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  function closeNavigationMenus(activeMenu) {
    navigationMenus.forEach((menu) => {
      if (menu !== activeMenu) menu.open = false;
    });
  }

  navigationMenus.forEach((menu) => {
    const summary = menu.querySelector("summary");

    menu.addEventListener("mouseenter", () => {
      if (!canHover.matches) return;
      closeNavigationMenus(menu);
      menu.open = true;
    });
    menu.addEventListener("mouseleave", () => {
      if (canHover.matches) menu.open = false;
    });
    summary.addEventListener("click", (event) => {
      if (!canHover.matches) {
        closeNavigationMenus(menu);
        return;
      }
      event.preventDefault();
      closeNavigationMenus(menu);
      menu.open = true;
    });
    menu.addEventListener("focusout", (event) => {
      if (!menu.contains(event.relatedTarget)) menu.open = false;
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".collection-nav")) closeNavigationMenus(null);
  });

  if (!catalog || !Array.isArray(catalog.collections) || !root) {
    throw new Error("Public catalog is missing or malformed.");
  }

  const collectionPresentation = {
    "astarion-origin-with-gale": {
      code: "OA",
      title: ["起源阿斯代伦与盖尔的旅程"]
    },
    "gale-origin-with-astarion": {
      code: "OG",
      title: ["起源盖尔与阿斯代伦的旅程"]
    },
    "shared-journey": {
      code: "AG",
      title: ["共同的旅程", "阿斯代伦与盖尔"]
    }
  };

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function archiveNumber(code, number) {
    return `${code} · ${String(number).padStart(3, "0")}`;
  }

  function renderBooks(books, code, nextNumber) {
    if (!Array.isArray(books) || books.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-shelf";
      empty.append(
        textElement("span", "archive-code", `${code} · —`),
        textElement("span", "", "暂无公开条目")
      );
      return { element: empty, nextNumber };
    }

    const list = document.createElement("ol");
    list.className = "book-list";

    for (const book of books) {
      if (!book || !book.title || !book.href) continue;

      const item = document.createElement("li");
      item.className = "catalog-entry";

      const link = document.createElement("a");
      link.href = book.href;
      link.append(
        textElement(
          "span",
          "archive-code",
          book.archiveCode || archiveNumber(code, nextNumber)
        )
      );

      const metadata = book.meta || book.metadata || book.act || "";
      if (metadata) link.append(textElement("span", "entry-meta", metadata));
      link.append(textElement("strong", "", book.title));
      if (book.subtitle) link.append(textElement("small", "", book.subtitle));
      link.append(textElement("span", "entry-arrow", "→"));

      item.append(link);
      list.append(item);
      nextNumber += 1;
    }

    if (list.childElementCount === 0) {
      return renderBooks([], code, nextNumber);
    }

    return { element: list, nextNumber };
  }

  catalog.collections.forEach((collection, index) => {
    const presentation = collectionPresentation[collection.id] || {
      code: "AR",
      title: [collection.title]
    };

    const section = document.createElement("section");
    section.className = "collection";
    section.dataset.accent = collection.accent || "shared";
    section.id = collection.id;

    const heading = document.createElement("header");
    heading.className = "collection-heading";
    heading.append(
      textElement(
        "span",
        "collection-number",
        `${String(index + 1).padStart(2, "0")} / ${presentation.code}`
      )
    );

    const title = document.createElement("h2");
    for (const line of presentation.title) {
      title.append(textElement("span", "", line));
    }
    heading.append(title);
    heading.append(textElement("p", "en", collection.englishTitle));
    heading.append(textElement("p", "description", collection.description));

    const shelves = document.createElement("div");
    shelves.className = "shelves";
    let nextNumber = 1;

    for (const shelf of collection.shelves || []) {
      const shelfSection = document.createElement("section");
      shelfSection.className = "shelf";
      shelfSection.id = `${collection.id}-${shelf.id}`;

      const shelfHeading = document.createElement("header");
      shelfHeading.className = "shelf-heading";
      shelfHeading.append(textElement("h3", "", shelf.title));
      if (shelf.description) {
        shelfHeading.append(textElement("p", "", shelf.description));
      }

      const rendered = renderBooks(shelf.books, presentation.code, nextNumber);
      nextNumber = rendered.nextNumber;
      shelfSection.append(shelfHeading, rendered.element);
      shelves.append(shelfSection);
    }

    const shelfList = Array.from(shelves.querySelectorAll(".shelf"));
    if (
      shelfList.length > 0 &&
      shelfList.every((shelf) => shelf.querySelector(".empty-shelf"))
    ) {
      section.classList.add("is-empty");
      shelves.replaceChildren(textElement("p", "collection-empty", "暂无公开档案"));
    }

    section.append(heading, shelves);
    root.append(section);
  });
})();
