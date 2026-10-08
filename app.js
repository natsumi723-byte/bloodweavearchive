(function () {
  "use strict";

  const catalog = window.BLOODWEAVE_CATALOG;
  const root = document.querySelector("#collection-list");

  const forewordOpen = document.querySelector("#foreword-open");
  const forewordDialog = document.querySelector("#foreword-dialog");
  const forewordClose = forewordDialog?.querySelector(".foreword-close");
  let forewordClosing = false;
  let forewordBodyPadding = "";

  function closeForeword() {
    if (!forewordDialog?.open || forewordClosing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      forewordDialog.close();
      return;
    }
    forewordClosing = true;
    forewordDialog.classList.add("is-closing");
    window.setTimeout(() => {
      forewordDialog.close();
      forewordDialog.classList.remove("is-closing");
      forewordClosing = false;
    }, 240);
  }

  forewordOpen?.addEventListener("click", () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    forewordBodyPadding = document.body.style.paddingRight;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    forewordDialog.showModal();
    document.body.classList.add("foreword-modal-open");
  });
  forewordClose?.addEventListener("click", closeForeword);
  forewordDialog?.addEventListener("click", (event) => {
    if (event.target === forewordDialog) closeForeword();
  });
  forewordDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeForeword();
  });
  forewordDialog?.addEventListener("close", () => {
    document.body.classList.remove("foreword-modal-open");
    document.body.style.paddingRight = forewordBodyPadding;
    forewordOpen?.focus({ preventScroll: true });
  });

  const navigationMenus = Array.from(document.querySelectorAll(".collection-nav"));
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  function closeNavigationMenus(activeMenu) {
    navigationMenus.forEach((menu) => {
      if (menu !== activeMenu) menu.open = false;
    });
  }

  function jumpToNavigationTarget(link, target) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const header = document.querySelector(".site-header");
        const headerOffset = header ? header.getBoundingClientRect().height + 8 : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        const rootStyle = document.documentElement.style;
        const previousScrollBehavior = rootStyle.scrollBehavior;

        if (window.location.hash !== link.hash) {
          window.history.pushState(null, "", link.hash);
        }
        rootStyle.scrollBehavior = "auto";
        window.scrollTo({
          top: Math.max(0, targetTop - headerOffset),
          left: 0,
          behavior: "auto"
        });
        window.requestAnimationFrame(() => {
          rootStyle.scrollBehavior = previousScrollBehavior;
        });
      });
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
      if (!canHover.matches) return;
      if (!menu.contains(event.relatedTarget)) menu.open = false;
    });
    menu.querySelectorAll(".collection-menu a").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!link.hash) return;

        const targetId = decodeURIComponent(link.hash.slice(1));
        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();
        menu.open = false;
        jumpToNavigationTarget(link, target);
      });
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
      const title = document.createElement("strong");
      title.append(textElement("span", "entry-title-text", book.title));
      if (book.isNew) {
        title.append(textElement("span", "entry-new", "NEW"));
      }
      link.append(title);
      if (book.subtitle) {
        const subtitle = textElement("small", "", book.subtitle);
        if (book.notice) {
          subtitle.append(textElement("span", "entry-notice", book.notice));
        }
        link.append(subtitle);
      }
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
    }

    section.append(heading, shelves);
    root.append(section);
  });

  const searchInput = document.querySelector("#archive-search");
  const stageSelect = document.querySelector("#archive-stage");
  const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
  const params = new URLSearchParams(window.location.search);
  const state = {
    query: params.get("q") || "",
    view: ["oa", "og", "ag"].includes(params.get("view")) ? params.get("view") : "all",
    stage: ["journey", "a1", "a2", "a3", "end", "finale", "epi"].includes(params.get("stage")) ? params.get("stage") : "all"
  };
  const viewByCollection = {
    "astarion-origin-with-gale": "oa",
    "gale-origin-with-astarion": "og",
    "shared-journey": "ag"
  };
  viewButtons.forEach((button) => {
    if (button.dataset.view === "all") return;
    const collectionId = Object.keys(viewByCollection).find((id) => viewByCollection[id] === button.dataset.view);
    const hasBooks = collectionId && root.querySelector(`#${collectionId} .catalog-entry`);
    button.disabled = !hasBooks;
    if (!hasBooks) button.title = "该视角暂无档案";
  });
  if (viewButtons.find((button) => button.dataset.view === state.view)?.disabled) state.view = "all";
  const stagePatterns = {
    journey: /^旅途中\s*·|^多章节\s*·/,
    a1: /^第一章\s*·/,
    a2: /^第二章\s*·/,
    a3: /^第三章\s*·/,
    end: /^终战\s*·/,
    finale: /^终局\s*·/,
    epi: /^尾声\s*·/
  };

  function normalized(value) {
    return String(value || "").toLocaleLowerCase("zh-Hans").replace(/\s+/g, " ").trim();
  }

  function writeUrl() {
    const next = new URLSearchParams();
    if (state.view !== "all") next.set("view", state.view);
    if (state.stage !== "all") next.set("stage", state.stage);
    if (state.query) next.set("q", state.query);
    const suffix = next.toString();
    history.replaceState(null, "", `${location.pathname}${suffix ? `?${suffix}` : ""}${location.hash}`);
  }

  function applyArchiveFilters() {
    const needle = normalized(state.query);
    root.querySelectorAll(".collection").forEach((collection) => {
      const collectionView = viewByCollection[collection.id] || "all";
      let visibleInCollection = 0;
      collection.querySelectorAll(".shelf").forEach((shelf) => {
        let visibleInShelf = 0;
        const shelfText = shelf.querySelector(".shelf-heading")?.textContent || "";
        shelf.querySelectorAll(".catalog-entry").forEach((entry) => {
          const searchable = normalized(`${entry.textContent} ${shelfText}`);
          const entryStage = entry.querySelector(".entry-meta")?.textContent || "";
          const viewMatch = state.view === "all" || state.view === collectionView;
          const stageMatch = state.stage === "all" || stagePatterns[state.stage].test(entryStage);
          const queryMatch = !needle || searchable.includes(needle);
          const show = viewMatch && stageMatch && queryMatch;
          entry.hidden = !show;
          if (show) visibleInShelf += 1;
        });
        shelf.hidden = visibleInShelf === 0;
        visibleInCollection += visibleInShelf;
      });
      collection.hidden = visibleInCollection === 0;
    });

    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === state.view)));
    writeUrl();
  }

  searchInput.value = state.query;
  stageSelect.value = state.stage;
  searchInput.addEventListener("input", () => { state.query = searchInput.value.trim(); applyArchiveFilters(); });
  stageSelect.addEventListener("change", () => { state.stage = stageSelect.value; applyArchiveFilters(); });
  viewButtons.forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.view; applyArchiveFilters(); }));
  applyArchiveFilters();
})();
