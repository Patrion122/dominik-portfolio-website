const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(
  ".reel, .work__intro, .row, .shorts, .info"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

revealItems.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});
