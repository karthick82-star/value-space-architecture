/* =============================================================
   VG ARCHITECTURE — shared script (loaded on every page)
   1. Site settings      2. Header / footer / CTA (one place to edit)
   3. Mobile menu        4. Scroll effects
   5. Contact form validation
   ============================================================= */

/* ---------- 1. Site settings — edit these ---------- */
const SITE = {
  name: "Value Space Architecture",
  tagline: "Far Beyond Imagination",
  email: "inquiries@vg-atelier.com", // ← replace with your real email address
  // Optional: paste a form service URL (e.g. Formspree) to receive enquiries
  // directly. If left empty, the form opens the visitor's email app instead.
  formEndpoint: "",
};

const NAV = [
  { label: "Home", href: "index.html" },
  { label: "About Us", href: "about.html" },
  { label: "Services", href: "services.html" },
  { label: "Projects", href: "projects.html" },
  { label: "Our Process", href: "process.html" },
  { label: "Contact", href: "contact.html" },
];

/* Which page are we on? ("project-details" belongs to "Projects") */
function currentPage() {
  const file = location.pathname.split("/").pop().replace(".html", "") || "index";
  return file === "project-details" ? "projects" : file;
}
const isActive = (href) => href.replace(".html", "") === currentPage();

/* ---------- 2. Header, footer and call-to-action ---------- */
function renderHeader() {
  const el = document.querySelector("[data-site-header]");
  if (!el) return;

  const desktopLinks = NAV.map(
    (n) => `<li><a class="nav-link" href="${n.href}"${isActive(n.href) ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");
  const mobileLinks = NAV.map(
    (n) => `<a class="m-link" href="${n.href}"${isActive(n.href) ? ' aria-current="page"' : ""}>${n.label}</a>`
  ).join("");

  el.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${SITE.name} – home">
        <img src="images/logo-sm.png" alt="" width="55" height="46">
        <span class="brand__text">
          <span class="brand__name">Value Space Architecture</span>
          <span class="brand__tag">${SITE.tagline}</span>
        </span>
      </a>
      <nav class="nav" aria-label="Main"><ul class="nav-list">${desktopLinks}</ul></nav>
      <a class="btn btn--small header-cta" href="contact.html">Start a Project</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
      ${mobileLinks}
      <a class="btn" href="contact.html">Start a Project</a>
    </nav>`;

  setupMobileMenu(el);
}

function renderFooter() {
  const el = document.querySelector("[data-site-footer]");
  if (!el) return;
  const links = NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("");
  el.innerHTML = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="index.html" aria-label="${SITE.name} – home">
          <img src="images/logo-sm.png" alt="" width="55" height="46">
          <span class="brand__text">
            <span class="brand__name">Value Space Architecture</span>
            <span class="brand__tag">${SITE.tagline}</span>
          </span>
        </a>
        <p>Architecture and interior design for homes and workplaces.</p>
      </div>
      <div>
        <h2 class="footer-title">Pages</h2>
        <ul class="footer-list">${links}</ul>
      </div>
      <div>
        <h2 class="footer-title">Contact</h2>
        <ul class="footer-list">
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</div>`;
}

function renderCta() {
  document.querySelectorAll("[data-site-cta]").forEach((el) => {
    el.classList.add("cta", "section");
    el.innerHTML = `
      <div class="container cta__inner" data-reveal>
        <div>
          <h2>Have a project in mind?</h2>
          <p>Tell us about your plans and we’ll take it from there.</p>
        </div>
        <a class="btn" href="contact.html">Start a Project</a>
      </div>`;
  });
}

/* Any link marked data-site-email uses the address from SITE above */
function renderEmailLinks() {
  document.querySelectorAll("[data-site-email]").forEach((a) => {
    a.href = `mailto:${SITE.email}`;
    a.textContent = SITE.email;
  });
}

/* ---------- 3. Mobile menu ---------- */
function setupMobileMenu(header) {
  const toggle = header.querySelector(".nav-toggle");
  const menu = header.querySelector(".mobile-nav");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  // close the menu if the window is resized to desktop width
  window.addEventListener("resize", () => { if (window.innerWidth > 1024) setOpen(false); });
}

/* ---------- 4. Scroll effects ---------- */
function setupHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Fade elements in as they scroll into view: <div data-reveal> */
function setupReveal(root = document) {
  const items = root.querySelectorAll("[data-reveal]:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- 5. Contact form validation ---------- */
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
    email: (v) => (!v.trim() ? "Please enter your email address."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Please enter a valid email address." : ""),
    phone: (v) => (v.trim() && !/^[+()\d\s-]{7,18}$/.test(v.trim()) ? "Please enter a valid phone number." : ""),
    type: (v) => (!v ? "Please choose a project type." : ""),
    message: (v) => (v.trim().length < 10 ? "Please tell us a little more (at least 10 characters)." : ""),
  };

  function validateField(input) {
    const message = rules[input.name](input.value);
    const field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    field.querySelector(".field-error").textContent = message;
    return !message;
  }

  const inputs = [...form.querySelectorAll("[name]")].filter((i) => rules[i.name]);

  // validate when leaving a field, and re-check as the user fixes an error
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const results = inputs.map(validateField);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const button = form.querySelector("button[type=submit]");
    let sent = false;

    if (SITE.formEndpoint) {
      // send to your form service
      button.disabled = true;
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        sent = res.ok;
      } catch (err) { sent = false; }
      button.disabled = false;
      if (!sent) {
        form.querySelector(".form__note").textContent = "Sorry, something went wrong. Please try again or email us directly.";
        return;
      }
    } else {
      // no service configured: open the visitor's email app with the details filled in
      const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "-"}\nProject type: ${data.type}\n\n${data.message}`;
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Project enquiry – " + data.type)}&body=${encodeURIComponent(body)}`;
    }

    const success = document.querySelector("#form-success");
    success.querySelector("[data-success-text]").textContent = SITE.formEndpoint
      ? "Your message has been sent. We’ll be in touch soon."
      : "Your email app should now open with your message ready. Press send to complete your enquiry.";
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  document.querySelector("#form-reset")?.addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    document.querySelector("#form-success").hidden = true;
    form.querySelector("input").focus();
  });
}

/* ---------- Floating WhatsApp Popup Widget ---------- */
function renderFloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
  const container = document.createElement("div");
  container.className = "floating-whatsapp";
  container.innerHTML = `
    <div class="floating-whatsapp__popup" id="whatsappPopup" role="dialog" aria-label="WhatsApp Chat Window">
      <div class="whatsapp-popup-header">
        <div class="whatsapp-popup-profile">
          <div class="whatsapp-popup-avatar">VS</div>
          <div class="whatsapp-popup-title">
            <strong>Value Space Architecture</strong>
            <span>Online • Instant Reply</span>
          </div>
        </div>
        <button class="whatsapp-popup-close" id="whatsappClose" aria-label="Close chat window">✕</button>
      </div>
      <div class="whatsapp-popup-body">
        <div class="whatsapp-popup-bubble">
          Hello! 👋 Welcome to Value Space Architecture. How can we help you with your project today?
          <span class="time">Just now</span>
        </div>
        <a class="whatsapp-popup-action" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.44 19.65L5.27 16.61L5.08 16.3C4.24 14.97 3.8 13.46 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.1 8.03 12.27C8.16 12.43 9.77 14.91 12.23 15.97C12.82 16.22 13.27 16.37 13.63 16.49C14.22 16.68 14.76 16.65 15.19 16.59C15.67 16.52 16.67 15.98 16.88 15.39C17.09 14.79 17.09 14.29 17.03 14.18C16.97 14.07 16.81 14.01 16.56 13.88C16.31 13.76 15.08 13.15 14.85 13.07C14.62 12.98 14.46 12.94 14.3 13.19C14.13 13.43 13.66 14.01 13.51 14.18C13.37 14.34 13.22 14.37 12.97 14.24C12.72 14.12 11.92 13.85 10.97 13.01C10.23 12.35 9.73 11.54 9.59 11.29C9.44 11.04 9.57 10.91 9.7 10.78C9.81 10.67 9.95 10.49 10.08 10.34C10.21 10.19 10.25 10.08 10.33 9.91C10.41 9.75 10.37 9.6 10.31 9.48C10.25 9.35 9.76 8.15 9.55 7.66C9.35 7.18 9.15 7.24 9 7.24C8.86 7.23 8.7 7.23 8.53 7.33Z"/>
          </svg>
          Start Chat
        </a>
      </div>
    </div>
    <button class="floating-whatsapp__btn" id="whatsappToggle" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
      <span class="floating-whatsapp__badge" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.44 19.65L5.27 16.61L5.08 16.3C4.24 14.97 3.8 13.46 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.1 8.03 12.27C8.16 12.43 9.77 14.91 12.23 15.97C12.82 16.22 13.27 16.37 13.63 16.49C14.22 16.68 14.76 16.65 15.19 16.59C15.67 16.52 16.67 15.98 16.88 15.39C17.09 14.79 17.09 14.29 17.03 14.18C16.97 14.07 16.81 14.01 16.56 13.88C16.31 13.76 15.08 13.15 14.85 13.07C14.62 12.98 14.46 12.94 14.3 13.19C14.13 13.43 13.66 14.01 13.51 14.18C13.37 14.34 13.22 14.37 12.97 14.24C12.72 14.12 11.92 13.85 10.97 13.01C10.23 12.35 9.73 11.54 9.59 11.29C9.44 11.04 9.57 10.91 9.7 10.78C9.81 10.67 9.95 10.49 10.08 10.34C10.21 10.19 10.25 10.08 10.33 9.91C10.41 9.75 10.37 9.6 10.31 9.48C10.25 9.35 9.76 8.15 9.55 7.66C9.35 7.18 9.15 7.24 9 7.24C8.86 7.23 8.7 7.23 8.53 7.33Z"/>
      </svg>
    </button>
  `;
  document.body.appendChild(container);

  const toggle = container.querySelector("#whatsappToggle");
  const close = container.querySelector("#whatsappClose");

  toggle.addEventListener("click", () => {
    container.classList.toggle("is-open");
  });

  close.addEventListener("click", () => {
    container.classList.remove("is-open");
  });
}

/* ---------- Start ---------- */
// Exposed so projects.js can animate cards it creates later
window.VG = { setupReveal };

renderHeader();
renderFooter();
renderCta();
renderEmailLinks();
setupHeaderShadow();
setupReveal();
setupContactForm();
renderFloatingWhatsApp();
