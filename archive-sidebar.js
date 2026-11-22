const rail = document.querySelector('#archive-rail');
const header = document.querySelector('.site-header');
const dock = document.querySelector('#rail-dock');
const dialog = document.querySelector('#rail-dialog');
const trigger = document.querySelector('#rail-trigger');
const compact = matchMedia('(max-width: 880px)');
const links = [...rail.querySelectorAll('a')];
const destinations = links.map(link => document.getElementById(link.hash.slice(1)));
const shelfLabels = new Map();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
for (const target of destinations) {
  const collection = target?.closest('.collection');
  if (!collection || shelfLabels.has(collection) || collection.querySelectorAll('.shelf-heading h3').length < 2) continue;
  const label = document.createElement('div');
  label.className = 'current-shelf';
  label.setAttribute('aria-hidden', 'true');
  const firstTitle = document.createElement('span');
  firstTitle.textContent = collection.querySelector('.shelf-heading h3').textContent;
  label.append(firstTitle);
  collection.querySelector('.collection-heading').append(label);
  shelfLabels.set(collection, label);
}

function updateShelfLabel(target, previous) {
  const collection = target?.closest('.collection');
  const label = shelfLabels.get(collection);
  const title = target?.querySelector('.shelf-heading h3')?.textContent;
  if (!label || !title || label.lastElementChild?.textContent === title) return;

  const outgoing = label.lastElementChild;
  const incoming = document.createElement('span');
  incoming.textContent = title;
  label.replaceChildren(incoming);
  if (!outgoing || previous?.closest('.collection') !== collection || compact.matches || reducedMotion.matches) return;

  label.prepend(outgoing);
  const timing = {duration: 190, easing: 'cubic-bezier(.2,.7,.3,1)'};
  outgoing.animate([{transform:'translateY(0)'}, {transform:'translateY(-100%)'}], timing)
    .finished.then(() => {
      if (outgoing !== label.lastElementChild) outgoing.remove();
    });
  incoming.animate([{transform:'translateY(100%)'}, {transform:'translateY(0)'}], timing);
}

const drawerAbout = document.createElement('button');
drawerAbout.type = 'button';
drawerAbout.textContent = '关于本站';
drawerAbout.className = 'drawer-about';
dialog.append(drawerAbout);
drawerAbout.addEventListener('click', () => {
  dialog.close();
  document.querySelector('#foreword-open').click();
});

function placeRail() {
  if (!compact.matches && dialog.open) dialog.close();
  (compact.matches ? document.querySelector('#rail-slot') : dock).append(rail);
}
compact.addEventListener('change', placeRail);
placeRail();
trigger.addEventListener('click', () => dialog.showModal());
document.querySelector('#rail-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

function markLocation(target, revealGroup = false) {
  const link = links[destinations.indexOf(target)];
  for (const item of links) {
    if (item === link) item.setAttribute('aria-current', 'location');
    else item.removeAttribute('aria-current');
  }
  if (link && revealGroup) link.closest('details').open = true;
}

let currentTarget;
function renderLocation() {
  if (document.documentElement.dataset.archiveEdition !== 'release') return;
  const line = header.getBoundingClientRect().bottom + 35;
  const visible = destinations.filter(target => target?.getClientRects().length);
  const target = visible.findLast(item => item.getBoundingClientRect().top <= line) ?? visible[0];
  if (currentTarget === target) return;
  updateShelfLabel(target, currentTarget);
  currentTarget = target;
  markLocation(target, true);
}
let scheduled = false;
function scheduleLocation() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    renderLocation();
  });
}
addEventListener('scroll', scheduleLocation, { passive: true });
addEventListener('hashchange', scheduleLocation);
const archiveSearch = document.querySelector('#archive-search');
archiveSearch.addEventListener('input', () => {
  if (archiveSearch.value.trim() && window.scrollY > 0) {
    window.scrollTo({top: 0, behavior: 'instant'});
  }
}, {capture: true});
archiveSearch.addEventListener('input', scheduleLocation);
new MutationObserver(scheduleLocation).observe(document.documentElement, {attributes:true, attributeFilter:['data-archive-edition']});
for (const [index, link] of links.entries()) {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = destinations[index];
    if (!target) return;
    if (!target.getClientRects().length) document.querySelector('#search-clear').click();
    if (dialog.open) dialog.close();
    history.pushState(null, '', link.hash);
    target.tabIndex = -1;
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:'instant', block:'start'});
    markLocation(target, true);
  });
}
for (const link of document.querySelectorAll('.catalog-entry a[href^="books/"]')) {
  link.href = new URL(link.getAttribute('href'), location.href);
}
scheduleLocation();
