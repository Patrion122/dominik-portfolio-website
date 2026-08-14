const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

function loadYouTube(wrap, videoId) {
  if (!wrap || wrap.classList.contains("is-playing")) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.title = "YouTube video";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  wrap.classList.add("is-playing");
  wrap.appendChild(iframe);
}

document.querySelectorAll(".video-lazy").forEach((button) => {
  button.addEventListener("click", () => {
    const wrap = button.closest(".video-wrap");
    loadYouTube(wrap, button.dataset.youtube);
  });
});

const heroPlay = document.querySelector("[data-play-hero]");
const heroBtn = document.querySelector(".video-wrap--hero .video-lazy");
if (heroPlay && heroBtn) {
  heroPlay.addEventListener("click", (event) => {
    event.preventDefault();
    heroBtn.click();
    document.getElementById("showreel")?.scrollIntoView({ behavior: "smooth" });
  });
}

const menuBtn = document.querySelector(".bar__menu");
const nav = document.querySelector(".bar__nav");

function setMenuOpen(isOpen) {
  if (!menuBtn || !nav) return;
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
  nav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("is-menu-open", isOpen);
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
}

const sectionIds = ["showreel", "work", "contact"];
const navLinks = new Map(
  sectionIds.map((id) => [
    id,
    document.querySelector(`.bar__nav a[href="#${id}"]`),
  ])
);

function updateActiveNav() {
  const offset = 120;
  let current = sectionIds[0];

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= offset) {
      current = id;
    }
  });

  navLinks.forEach((link, id) => {
    link?.classList.toggle("is-active", id === current);
  });
}

window.addEventListener("scroll", () => {
  updateIntroScroll();
  updateActiveNav();
}, { passive: true });
updateActiveNav();

const intro = document.getElementById("work-intro");
const introSpacer = document.querySelector(".work__intro-spacer");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const INTRO_SCROLL = 320;
const INTRO_BOTTOM = 40;

function syncIntroSpacer() {
  if (!intro || !introSpacer) return;
  introSpacer.style.height = `${intro.offsetHeight}px`;
}

function updateIntroScroll() {
  if (!intro || !introSpacer || prefersReducedMotion) {
    intro?.classList.add("is-settled");
    intro?.classList.remove("is-fixed", "is-centered");
    intro?.style.cssText = "";
    return;
  }

  syncIntroSpacer();

  const progress = Math.min(Math.max(window.scrollY / INTRO_SCROLL, 0), 1);

  if (progress >= 1) {
    intro.classList.remove("is-fixed", "is-centered");
    intro.classList.add("is-settled");
    intro.style.cssText = "";
    return;
  }

  intro.classList.add("is-fixed");
  intro.classList.remove("is-settled");

  const spacerRect = introSpacer.getBoundingClientRect();
  const introHeight = intro.offsetHeight;
  const introWidth = intro.offsetWidth;

  const startX = (window.innerWidth - introWidth) / 2;
  const endX = spacerRect.left;
  const startY = window.innerHeight - INTRO_BOTTOM - introHeight;
  const endY = spacerRect.top;

  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress;

  intro.classList.toggle("is-centered", progress < 0.55);
  intro.style.left = `${x}px`;
  intro.style.top = `${y}px`;
  intro.style.bottom = "auto";
  intro.style.width = `${Math.min(introWidth, window.innerWidth - 32)}px`;
  intro.style.textAlign = progress < 0.55 ? "center" : "left";
}

syncIntroSpacer();
updateIntroScroll();

window.addEventListener("resize", () => {
  syncIntroSpacer();
  updateIntroScroll();
  if (window.innerWidth > 720) setMenuOpen(false);
});

const revealItems = document.querySelectorAll(".band, .contact");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
);

revealItems.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});
