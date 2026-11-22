(() => {
  "use strict";
  const books = [
  {
    "href": "BK-EA-OAST_GAL-A1-Gale_Recruitment-v1.html",
    "archiveCode": "EA · 001",
    "title": "退后，你这恶鬼"
  },
  {
    "href": "BK-EA-AST_GAL-A1-Astarion_Recruitment_GaleInterjects-v6.html",
    "archiveCode": "EA · 002",
    "title": "没必要把事情弄得一团糟 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Astarion_Gale_Flirt-v4.html",
    "archiveCode": "EA · 003",
    "title": "散步时请保持安静 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Astarion_Gale_Shadowheart_Love-v4.html",
    "archiveCode": "EA · 004",
    "title": "有人等你们回去吗 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Astarion_Wyll_Gale_Cazador-v8.html",
    "archiveCode": "EA · 005",
    "title": "听说过叫卡扎多尔的吸血鬼吗 · EA"
  },
  {
    "href": "BK-AST_GAL-A1-DEN_Apprentice_RD_LockedUp_Astarion-v9.html",
    "archiveCode": "EA · 006",
    "title": "下次记得撒个谎"
  },
  {
    "href": "BK-EA-OAST_GAL-A1-CAMP_AstarionHunger_IVB_SCO_Avatar_Choice-v4.html",
    "archiveCode": "EA · 007",
    "title": "苦涩的血 · EA"
  },
  {
    "href": "BK-AST_GAL-A1-CAMP_AstarionHungerC_CRD_Astarion_MorningAfter-EA-v16.html",
    "archiveCode": "EA · 008",
    "title": "与吸血鬼同行的清晨 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-A1-GLO_Astarion_RD_VampireRevelation_Gale-v3.html",
    "archiveCode": "EA · 009",
    "title": "吸血鬼会是个好盟友吗？ · EA"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_AstarionHunger_PAD_AftermathAvatarCompanionLeft_Gale-v12.html",
    "archiveCode": "EA · 010",
    "title": "盖尔去哪儿了？ · EA"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_Astarion_CRD_TastingParty_Gale-v14.html",
    "archiveCode": "EA · 011",
    "title": "盖尔的血是什么味道 · EA"
  },
  {
    "href": "BK-AST_GAL-A1-CAMP_Night3_CRD_Gale-v1.html",
    "archiveCode": "EA · 012",
    "title": "我们的怪癖可不一般"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_Daisy2_CRD_Astarion-v1.html",
    "archiveCode": "EA · 013",
    "title": "噩梦算不了什么"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_Daisy2_CRD_Gale-v1.html",
    "archiveCode": "EA · 014",
    "title": "那不可能是密斯特拉"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_Daisy3_RD_Astarion-v1.html",
    "archiveCode": "EA · 015",
    "title": "做场噩梦也值得"
  },
  {
    "href": "BK-EA-AST_GAL-A1-CAMP_Daisy3_RD_Gale-v1.html",
    "archiveCode": "EA · 016",
    "title": "别让夺心魔蝌蚪如愿"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-ORI_Gale_DeathFlute-v14.html",
    "archiveCode": "EA · 017",
    "title": "吹响盖尔的魔法笛 · EA"
  },
  {
    "href": "BK-EA-AST_OGAL-A1-CAMP_DangerousBook_IVB_CFM_Astarion-v4.html",
    "archiveCode": "EA · 018",
    "title": "这一本不能给你吃 · EA"
  },
  {
    "href": "BK-EA-OAST_GAL-UNK-Gale_InParty2-v12.html",
    "archiveCode": "EA · 019",
    "title": "血液与魔法与饥渴 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Astarion_Gale_Bomb-v4.html",
    "archiveCode": "EA · 020",
    "title": "那颗法球能做什么？ · EA"
  },
  {
    "href": "BK-EA-AST_GAL-A1-PLA_StuckHalfElf_Freed_AstarionGale-v7.html",
    "archiveCode": "EA · 021",
    "title": "请允许我代他道歉 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Astarion_Gale_Illusion-v4.html",
    "archiveCode": "EA · 022",
    "title": "从树林到沼泽 · EA"
  },
  {
    "href": "BK-AST_GAL-A1-HAG_GurHunter_RD_ProtectedAstarion_Gale-v17.html",
    "archiveCode": "EA · 023",
    "title": "朋友归朋友，道德归道德"
  },
  {
    "href": "BK-AST_GAL-A1-HAG_GurHunter_RD_BetrayedAstarion_Gale-v14.html",
    "archiveCode": "EA · 024",
    "title": "原来抛弃同伴这么容易"
  },
  {
    "href": "BK-AST_GAL-A1-HAG_Hagspawn_RD_AfterResurrection_Gale-v9.html",
    "archiveCode": "EA · 025",
    "title": "无意冒犯，阿斯代伦"
  },
  {
    "href": "BK-EA-AST_GAL-UNK-PB_Wyll_Gale_Astarion_Netherese-v4.html",
    "archiveCode": "EA · 026",
    "title": "耐色瑞尔魔法是什么 · EA"
  },
  {
    "href": "BK-EA-AST_GAL-A1-TieflingCelebrationPartnerComments-v4.html",
    "archiveCode": "EA · 027",
    "title": "庆功宴上的邀约 · EA"
  }
];
  const main = document.querySelector("main");
  const research = main?.querySelector("details.research");
  if (!main || !research || main.querySelector(".collection-continuation")) return;

  const stableHref = (href) => href.replace(/-v\d+\.html$/, ".html");
  for (const book of books) book.href = stableHref(book.href);
  const currentFile = decodeURIComponent(location.pathname.split("/").pop() || "");
  const index = books.findIndex((book) => decodeURIComponent(book.href) === currentFile);
  if (index < 0) return;

  const current = books[index];
  const previous = books[index - 1];
  const next = books[index + 1];
  const edge = previous && next ? "middle" : previous ? "last" : "first";
  const component = document.createElement("section");
  component.className = "collection-continuation";
  component.dataset.collection = "ea";
  component.dataset.edge = edge;
  component.setAttribute("aria-labelledby", "collection-continuation-title");

  const header = document.createElement("header");
  header.className = "continuation-header";
  const heading = document.createElement("h2");
  heading.className = "continuation-heading";
  heading.id = "collection-continuation-title";
  const readingLabel = document.createElement("span");
  readingLabel.className = "continuation-reading-label";
  readingLabel.textContent = "正在阅读";
  const currentTitle = document.createElement("span");
  currentTitle.className = "continuation-reading-current";
  currentTitle.textContent = current.archiveCode + "　" + current.title;
  heading.append(readingLabel, currentTitle);

  const jump = document.createElement("label");
  jump.className = "continuation-jump";
  const jumpLabel = document.createElement("span");
  jumpLabel.className = "continuation-jump-label";
  jumpLabel.textContent = "快速跳转";
  const select = document.createElement("select");
  select.setAttribute("aria-label", "选择 EA 馆藏");
  const prompt = document.createElement("option");
  prompt.value = "";
  prompt.textContent = "选择 EA 馆藏";
  select.append(prompt);
  books.forEach((book, bookIndex) => {
    const option = document.createElement("option");
    option.value = book.href;
    option.textContent = book.archiveCode + "　" + book.title + (bookIndex === index ? "（当前）" : "");
    option.disabled = bookIndex === index;
    select.append(option);
  });
  select.addEventListener("change", () => {
    if (select.value) location.href = select.value;
  });
  jump.append(jumpLabel, select);
  header.append(heading, jump);

  const nav = document.createElement("nav");
  nav.className = "continuation-nav";
  nav.setAttribute("aria-label", "EA 相邻馆藏");

  function adjacentLink(book, relation, arrow) {
    const link = document.createElement("a");
    link.className = "continuation-link";
    link.href = book.href;
    link.rel = relation === "上一册" ? "prev" : "next";
    const arrowElement = document.createElement("span");
    arrowElement.className = "continuation-arrow";
    arrowElement.setAttribute("aria-hidden", "true");
    arrowElement.textContent = arrow;
    const copy = document.createElement("span");
    const label = document.createElement("span");
    label.className = "continuation-label";
    label.textContent = relation + "　" + book.archiveCode;
    const title = document.createElement("span");
    title.className = "continuation-title";
    title.textContent = book.title;
    copy.append(label, title);
    if (relation === "上一册") link.append(arrowElement, copy);
    else link.append(copy, arrowElement);
    return link;
  }

  const position = document.createElement("span");
  position.className = "continuation-position";
  position.textContent = (index + 1) + " / " + books.length;
  if (previous) nav.append(adjacentLink(previous, "上一册", "←"));
  nav.append(position);
  if (next) nav.append(adjacentLink(next, "下一册", "→"));

  component.append(header, nav);
  research.before(component);
})();
