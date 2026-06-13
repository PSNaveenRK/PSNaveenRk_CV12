const nav = document.querySelector(".navbar");
const backToTop = document.querySelector("#backToTop");
const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
let ticking = false;

if (window.AOS) {
  AOS.init({
    duration: 760,
    easing: "ease-out-cubic",
    once: true,
    offset: 90
  });
}

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + sectionId;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  sections.forEach((section) => {
    section.classList.toggle("section-current", section.id === sectionId);
  });
}

function updateScrollState() {
  const readLine = window.innerHeight * 0.36;
  let currentSection = sections[0]?.id || "home";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= readLine && rect.bottom >= readLine) {
      currentSection = section.id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) {
    currentSection = sections[sections.length - 1]?.id || currentSection;
  }

  nav.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("show", window.scrollY > 520);
  setActiveSection(currentSection);
  ticking = false;
}

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    if (targetId) setActiveSection(targetId);

    const menu = document.querySelector("#navMenu");
    const collapse = window.bootstrap && bootstrap.Collapse.getInstance(menu);
    if (collapse) collapse.hide();
  });
});

const sectionRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("section-visible");
    }
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

sections.forEach((section) => sectionRevealObserver.observe(section));

const readableItems = document.querySelectorAll(
  ".section p, .section li, .section .tag, .section .score, .section .timeline-date"
);

readableItems.forEach((item) => item.classList.add("read-focus"));

const readingObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("is-reading", entry.isIntersecting);
  });
}, {
  threshold: 0.48,
  rootMargin: "-24% 0px -34% 0px"
});

readableItems.forEach((item) => readingObserver.observe(item));
updateScrollState();

    const roles = [
      "QA Automation Engineer",
      "Aspiring SDET",
      "Test Automation Expert",
      "Innovation Award Winner"
    ];
    const typeTarget = document.querySelector("#typeTarget");
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      typeTarget.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
        setTimeout(typeLoop, 70);
        return;
      }

      if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1300);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 36);
        return;
      }

      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 240);
    }

    typeLoop();

    const ringObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const ring = entry.target;
        const target = Number(ring.dataset.value);
        let value = 0;
        const timer = setInterval(() => {
          value += 2;
          if (value >= target) {
            value = target;
            clearInterval(timer);
          }
          ring.style.setProperty("--value", value);
          ring.textContent = value + "%";
        }, 18);
        observer.unobserve(ring);
      });
    }, { threshold: 0.55 });

    document.querySelectorAll(".ring").forEach((ring) => ringObserver.observe(ring));

    const canvas = document.querySelector("#signalCanvas");
    const ctx = canvas.getContext("2d");
    let points = [];

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(80, Math.floor(window.innerWidth / 18));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.7
      }));
    }

    function drawSignals() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      points.forEach((point, i) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
        if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(103, 232, 249, 0.65)";
        ctx.fill();

        for (let j = i + 1; j < points.length; j += 1) {
          const other = points[j];
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 130) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = "rgba(59, 130, 246, " + (1 - distance / 130) * 0.18 + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawSignals);
    }

    resizeCanvas();
    drawSignals();
    window.addEventListener("resize", resizeCanvas);
