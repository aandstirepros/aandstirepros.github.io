(() => {
  // ===== Mobile nav toggle =====
  const nav = document.querySelector(".shop-nav");
  const toggle = nav?.querySelector(".shop-nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    nav.querySelectorAll(".shop-nav__link").forEach((a) => {
      a.addEventListener("click", () => {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== Year stamps in footer =====
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(year);
  });

  // ===== Reveal-on-scroll =====
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionOk && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.transition = "opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1)";
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    const revealTargets = document.querySelectorAll(".section, .stats, .cta, .marquee");
    revealTargets.forEach((el) => {
      if (el.closest(".hero")) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      io.observe(el);
    });
  }

  // ===== Stat number count-up =====
  if (motionOk && "IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          // Find the leading numeric text node (before <sup>)
          const sup = el.querySelector("sup");
          const supHTML = sup ? sup.outerHTML : "";
          const rawText = el.textContent.replace(sup ? sup.textContent : "", "").trim();
          const target = parseInt(rawText, 10);
          if (Number.isNaN(target)) {
            statObserver.unobserve(el);
            return;
          }
          const duration = 1100;
          const start = performance.now();
          const ease = (t) => 1 - Math.pow(1 - t, 3);
          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const v = Math.round(target * ease(t));
            el.innerHTML = `${v}${supHTML}`;
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          statObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll(".stat__num").forEach((el) => statObserver.observe(el));
  }
})();
