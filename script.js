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

const intro = document.getElementById("work-intro");
const introTitle = intro?.querySelector("h2");
const dock = document.getElementById("intro-dock");
const scrollHint = dock?.querySelector(".scroll-hint");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
let introMoved = false;
let introSettled = false;

if (introTitle && dock && !prefersReducedMotion) {
  introTitle.classList.add("is-waiting");
}

function settleIntro() {
  if (introSettled || !intro || !dock) return;
  introSettled = true;
  introMoved = true;
  introTitle?.classList.remove("is-waiting");
  dock.classList.add("is-gone");
  dock.classList.remove("is-flying");
  dock.style.cssText = "";
}

function flyIntroHome() {
  if (introMoved || !intro || !dock || !introTitle) return;
  introMoved = true;

  if (prefersReducedMotion) {
    settleIntro();
    return;
  }

  const from = dock.querySelector(".intro-dock__title").getBoundingClientRect();
  const to = introTitle.getBoundingClientRect();
  const dx = to.left - from.left;
  const dy = to.top - from.top;

  dock.classList.add("is-flying");
  dock.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
  dock.style.transform = `translate(calc(-50% + ${dx}px), ${dy}px)`;

  const finish = () => {
    dock.removeEventListener("transitionend", finish);
    settleIntro();
  };

  dock.addEventListener("transitionend", finish);
  window.setTimeout(finish, 800);
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

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 12) flyIntroHome();
    updateActiveNav();
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) setMenuOpen(false);
});

scrollHint?.addEventListener("click", () => {
  flyIntroHome();
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
});

if (location.hash === "#work" || location.hash === "#contact") {
  settleIntro();
}

updateActiveNav();

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
