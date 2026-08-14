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
const introSpacer = document.querySelector(".work__intro-spacer");
const workSection = document.getElementById("work");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const INTRO_TARGET_TOP = 96;
const INTRO_BOTTOM = 48;
let introStartTop = null;

function syncIntroSpacer() {
  if (!intro || !introSpacer) return;
  introSpacer.style.height = `${intro.offsetHeight}px`;
}

function resetIntroMetrics() {
  introStartTop = null;
  syncIntroSpacer();
  updateIntroScroll();
}

function settleIntro() {
  if (!intro) return;
  intro.classList.remove("is-fixed", "is-centered");
  intro.classList.add("is-settled");
  intro.style.cssText = "";
}

function updateIntroScroll() {
  if (!intro || !introSpacer || !workSection || prefersReducedMotion) {
    settleIntro();
    return;
  }

  syncIntroSpacer();

  if (introStartTop === null) {
    introStartTop = introSpacer.getBoundingClientRect().top;
  }

  const spacerTop = introSpacer.getBoundingClientRect().top;
  const travel = introStartTop - INTRO_TARGET_TOP;

  if (travel <= 0 || spacerTop <= INTRO_TARGET_TOP) {
    settleIntro();
    return;
  }

  const progress = Math.min(
    Math.max(1 - (spacerTop - INTRO_TARGET_TOP) / travel, 0),
    1
  );

  intro.classList.add("is-fixed");
  intro.classList.remove("is-settled", "is-centered");

  const introHeight = intro.offsetHeight;
  const introWidth = Math.min(576, window.innerWidth - 32);
  const workStyles = getComputedStyle(workSection);
  const workPad = parseFloat(workStyles.paddingLeft) || 16;
  const workRect = workSection.getBoundingClientRect();

  const startX = (window.innerWidth - introWidth) / 2;
  const endX = workRect.left + workPad;
  const startY = window.innerHeight - INTRO_BOTTOM - introHeight;
  const endY = INTRO_TARGET_TOP;

  intro.style.left = `${startX + (endX - startX) * progress}px`;
  intro.style.top = `${startY + (endY - startY) * progress}px`;
  intro.style.width = `${introWidth}px`;
  intro.style.textAlign = progress < 0.65 ? "center" : "left";
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
    updateIntroScroll();
    updateActiveNav();
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  resetIntroMetrics();
  if (window.innerWidth > 720) setMenuOpen(false);
});

resetIntroMetrics();
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
