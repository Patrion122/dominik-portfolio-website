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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) setMenuOpen(false);
  });
}

const revealItems = document.querySelectorAll(".work__intro, .band, .contact");

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
