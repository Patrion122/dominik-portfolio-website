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

const heroWrap = document.querySelector(".video-wrap--hero");
if (heroWrap) {
  const heroBtn = heroWrap.querySelector(".video-lazy");
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && heroBtn) {
          loadYouTube(heroWrap, heroBtn.dataset.youtube);
          heroObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  heroObserver.observe(heroWrap);
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
