/* =============================================================
   VG ARCHITECTURE — projects
   • PROJECTS below is the single source of truth for every project.
     To add a project: copy one block, change the text, and add its images
     to the images/ folder.
   • This file draws the project cards on the Home and Projects pages
     and the whole Project Details page (project-details.html?id=...).
   ============================================================= */

const PROJECTS = [
  {
    id: "solstice-residence",
    title: "The Solstice Residence",
    category: "Residential",
    location: "Malibu, California",
    year: "2024",
    area: "12,400 sq ft",
    scope: "Architecture, Interiors, Landscape",
    summary: "Board-formed concrete cantilevers over the Pacific, wrapped in floor-to-ceiling glass and an infinity pool.",
    story: "Perched on an exposed coastal promontory, the villa is arranged as three interlocking concrete trays that emerge from the cliff. Deep cantilevers shade the glass in summer and let low winter light reach the heart of the home.",
    highlights: [
      { title: "Cantilevered terraces", text: "Concrete slabs project over the cliff edge without columns." },
      { title: "Frameless glazing", text: "Living spaces open fully to the horizon." },
      { title: "Infinity pool", text: "A reflective edge that cools and frames the view." },
      { title: "Passive solar design", text: "Overhangs shade the glazing in summer and welcome winter light." },
    ],
    image: { base: "images/solstice", w: 1376, h: 768, alt: "The Solstice Residence, a cantilevered concrete villa glowing at sunset beside an infinity pool" },
    gallery: [
      { src: "images/solstice-2.webp", w: 700, h: 525, alt: "Glazed living volumes and cantilevered balconies at dusk" },
      { src: "images/solstice-3.webp", w: 700, h: 525, alt: "Pool terrace reflecting the villa at sunset" },
    ],
  },
  {
    id: "aura-headquarters",
    title: "Aura Commercial Headquarters",
    category: "Commercial",
    location: "Geneva, Switzerland",
    year: "2023",
    area: "38,500 sq ft",
    scope: "Architecture, Interiors, Landscape",
    summary: "Curved bronze-framed glazing wraps a triple-height atrium, set within planted courtyards and water.",
    story: "A curved facade of bronze mullions wraps a triple-height atrium and brings daylight deep into the building. Water and planting soften the approach and reflect the glass.",
    highlights: [
      { title: "Bronze-framed facade", text: "Slim curved mullions give the building a warm, sculpted edge." },
      { title: "Triple-height atrium", text: "A bright central space that draws daylight deep inside." },
      { title: "Landscaped plaza", text: "Planting and water soften the approach." },
      { title: "Daylight harvesting", text: "Glazing and atrium work together to reduce artificial lighting." },
    ],
    image: { base: "images/aura", w: 1200, h: 896, alt: "Aura Commercial Headquarters, a curved glass and bronze building with a landscaped plaza" },
    gallery: [
      { src: "images/aura-2.webp", w: 600, h: 450, alt: "Bronze and glass entrance atrium" },
      { src: "images/aura-3.webp", w: 600, h: 450, alt: "Planted plaza beside the glazed facade" },
    ],
  },
  {
    id: "zenith-horizon-estate",
    title: "Zenith Horizon Estate",
    category: "Residential",
    location: "Kyoto, Japan",
    year: "2024",
    area: "9,800 sq ft",
    scope: "Architecture, Interiors, Landscape",
    summary: "Timber slats and board-formed concrete come together around quiet courtyards, a lawn and a reflecting pool.",
    story: "Traditional Japanese timber joinery meets monumental cantilevered concrete. Quiet courtyards bring light and greenery into the heart of the home.",
    highlights: [
      { title: "Timber slat screens", text: "Vertical timber filters light and adds privacy." },
      { title: "Cantilevered concrete", text: "Deep overhangs shade the glazing and frame the garden." },
      { title: "Courtyard and pool", text: "Outdoor rooms connect directly to the living spaces." },
      { title: "Natural palette", text: "Timber, stone and concrete age gracefully together." },
    ],
    image: { base: "images/zenith", w: 1200, h: 896, alt: "Zenith Horizon Estate, a timber and concrete villa at dusk beside a pool", focus: "50% 60%" },
    gallery: [
      { src: "images/zenith-2.webp", w: 600, h: 450, alt: "Timber and concrete facade with glazed corner" },
      { src: "images/zenith-3.webp", w: 600, h: 450, alt: "Reflecting pool and lounge terrace" },
    ],
  },
  {
    id: "villa-albatros",
    title: "Villa Albatros",
    category: "Interior",
    location: "Cap d’Antibes, France",
    year: "2023",
    area: "11,200 sq ft",
    scope: "Interior Architecture",
    summary: "A sculpted plaster stair with floating oak treads and a slim bronze handrail.",
    story: "Venetian plaster curves into a cantilevered oak stair, finished with a fine bronze handrail. Concealed lighting traces the form and gives the space a soft glow after dark.",
    highlights: [
      { title: "Curved plaster walls", text: "Soft, continuous surfaces guide the eye upward." },
      { title: "Floating oak treads", text: "Cantilevered steps keep the stair light and open." },
      { title: "Bronze handrail", text: "A fine line of metal that follows the curve of the stair." },
      { title: "Concealed lighting", text: "Recessed fittings trace the form with a soft glow." },
    ],
    image: { base: "images/albatros", w: 1376, h: 768, alt: "A curved plaster staircase with floating oak steps and a bronze handrail" },
    gallery: [
      { src: "images/albatros-2.webp", w: 700, h: 525, alt: "Curved plaster wall with a recessed wall light" },
      { src: "images/albatros-3.webp", w: 700, h: 525, alt: "Floating oak steps beside a bronze handrail" },
    ],
  },
];

const FEATURED_IDS = ["zenith-horizon-estate", "aura-headquarters"]; // shown on the Home page

const detailsUrl = (id) => `project-details.html?id=${encodeURIComponent(id)}`;

/* ---------- Project card ---------- */
function projectCard(p) {
  const { base, w, h, alt, focus } = p.image;
  const smallW = 800;
  const smallH = Math.round((h * smallW) / w);
  return `
    <a class="project-card" href="${detailsUrl(p.id)}" data-reveal>
      <div class="project-card__media">
        <img src="${base}-800.webp" srcset="${base}-800.webp ${smallW}w, ${base}.webp ${w}w"
             sizes="(max-width: 768px) 100vw, 50vw" width="${smallW}" height="${smallH}"
             alt="${alt}" loading="lazy" decoding="async"${focus ? ` style="object-position:${focus}"` : ""}>
      </div>
      <div class="project-card__body">
        <div>
          <h3>${p.title}</h3>
          <p class="project-card__meta">${p.location} · ${p.year}</p>
        </div>
        <span class="tag">${p.category}</span>
      </div>
      <p class="project-card__summary">${p.summary}</p>
    </a>`;
}

function drawCards(grid, list) {
  grid.innerHTML = list.length
    ? list.map(projectCard).join("")
    : '<p class="empty-note">No projects in this category yet.</p>';
  window.VG?.setupReveal(grid);
}

/* ---------- Home page: featured projects ---------- */
function setupFeatured() {
  const grid = document.querySelector('[data-projects="featured"]');
  if (!grid) return;
  drawCards(grid, FEATURED_IDS.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean));
}

/* ---------- Projects page: grid + category filters ---------- */
function setupProjectGrid() {
  const grid = document.querySelector('[data-projects="all"]');
  if (!grid) return;

  const buttons = [...document.querySelectorAll(".filter")];
  const count = document.querySelector("#filter-count");
  const valid = buttons.map((b) => b.dataset.filter);

  function apply(filter, animate) {
    const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category.toLowerCase() === filter);
    buttons.forEach((b) => {
      const on = b.dataset.filter === filter;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    count.textContent = `${list.length} ${list.length === 1 ? "project" : "projects"}`;

    if (!animate) return drawCards(grid, list);
    grid.classList.add("is-fading");                 // quick fade out, swap, fade in
    setTimeout(() => { drawCards(grid, list); grid.classList.remove("is-fading"); }, 200);
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      apply(b.dataset.filter, true);
      history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : `#${b.dataset.filter}`);
    })
  );

  // allow links like projects.html#residential
  const fromHash = location.hash.slice(1);
  apply(valid.includes(fromHash) ? fromHash : "all", false);
}

/* ---------- Project details page ---------- */
function setupDetails() {
  const root = document.querySelector("#project-detail");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const index = PROJECTS.findIndex((p) => p.id === id);

  if (index === -1) {
    document.title = "Project not found — Value Space Architecture";
    root.innerHTML = `
      <section class="page-hero"><div class="container stack">
        <h1>Project not found</h1>
        <p class="lead">We couldn’t find that project.</p>
        <a class="btn" href="projects.html">View all projects</a>
      </div></section>`;
    return;
  }

  const p = PROJECTS[index];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  document.title = `${p.title} — Value Space Architecture`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", p.summary);

  const meta = [["Location", p.location], ["Year", p.year], ["Area", p.area], ["Scope", p.scope]]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  const highlights = p.highlights
    .map((h) => `<li><h3>${h.title}</h3><p>${h.text}</p></li>`).join("");
  const gallery = p.gallery
    .map((g) => `<img src="${g.src}" width="${g.w}" height="${g.h}" alt="${g.alt}" loading="lazy" decoding="async" data-reveal>`).join("");

  root.innerHTML = `
    <section class="page-hero">
      <div class="container stack">
        <a class="back-link" href="projects.html">All projects</a>
        <p class="eyebrow">${p.category}</p>
        <h1>${p.title}</h1>
      </div>
    </section>

    <div class="container">
      <figure class="project-cover">
        <img src="${p.image.base}.webp" width="${p.image.w}" height="${p.image.h}" alt="${p.image.alt}"
             fetchpriority="high"${p.image.focus ? ` style="object-position:${p.image.focus}"` : ""}>
      </figure>
      <dl class="project-meta">${meta}</dl>
    </div>

    <section class="section">
      <div class="container split split--wide-left">
        <div class="stack" data-reveal>
          <h2>Overview</h2>
          <p class="lead">${p.summary}</p>
          <p>${p.story}</p>
        </div>
        <ul class="highlights" data-reveal>${highlights}</ul>
      </div>
    </section>

    <section class="container" style="padding-bottom: var(--section)">
      <div class="gallery">${gallery}</div>
    </section>

    <div class="container">
      <nav class="project-nav" aria-label="More projects">
        <a href="${detailsUrl(prev.id)}"><span>Previous</span><strong>${prev.title}</strong></a>
        <a href="${detailsUrl(next.id)}"><span>Next</span><strong>${next.title}</strong></a>
      </nav>
    </div>`;

  window.VG?.setupReveal(root);
}

setupFeatured();
setupProjectGrid();
setupDetails();
