/**
 * Arthur Oliveiro — Portfólio
 * JavaScript modular, sem dependências externas.
 */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     MÓDULO: Navegação (menu mobile)
  ========================================================= */
  const NavModule = (() => {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");

    function init() {
      if (!nav || !toggle) return;
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      });

      // Fecha o menu ao clicar em um link
      document.querySelectorAll(".nav__mobile a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    return { init };
  })();

  /* =========================================================
     MÓDULO: Terminal animado (digitação automática)
  ========================================================= */
  const TerminalModule = (() => {
    const body = document.getElementById("terminal-body");

    const script = [
      { type: "prompt", text: "$ whoami" },
      { type: "output", text: "Arthur Oliveiro" },
      { type: "gap" },
      { type: "prompt", text: "$ focus" },
      { type: "output", text: "Engineering. Software. Linux." },
      { type: "gap" },
      { type: "prompt", text: "$ status" },
      { type: "output", text: "Building the future..." },
    ];

    function renderInstant() {
      body.innerHTML = script
        .map((line) => {
          if (line.type === "gap") return "";
          const cls = line.type === "prompt" ? "line-prompt" : "line-output";
          return `<div class="${cls}">${line.text}</div>`;
        })
        .join("");
    }

    async function typeLine(container, text, speed) {
      let current = "";
      for (const char of text) {
        current += char;
        container.textContent = current;
        await wait(speed);
      }
    }

    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function runSequence() {
      body.innerHTML = "";
      const cursor = document.createElement("span");
      cursor.className = "terminal__cursor";

      for (const line of script) {
        if (line.type === "gap") {
          const gapEl = document.createElement("div");
          gapEl.style.height = "10px";
          body.appendChild(gapEl);
          continue;
        }

        const lineEl = document.createElement("div");
        lineEl.className = line.type === "prompt" ? "line-prompt" : "line-output";
        body.appendChild(lineEl);
        body.appendChild(cursor);

        const speed = line.type === "prompt" ? 55 : 28;
        await typeLine(lineEl, line.text, speed);
        await wait(line.type === "prompt" ? 300 : 500);
      }

      body.appendChild(cursor);
    }

    function init() {
      if (!body) return;
      if (prefersReducedMotion) {
        renderInstant();
        return;
      }
      runSequence();
    }

    return { init };
  })();

  /* =========================================================
     MÓDULO: Reveal on scroll (fade-in ao rolar)
  ========================================================= */
  const RevealModule = (() => {
    function init() {
      const targets = document.querySelectorAll(".reveal");
      if (!targets.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      targets.forEach((el) => observer.observe(el));
    }
    return { init };
  })();

  /* =========================================================
     MÓDULO: Contadores animados (estatísticas)
  ========================================================= */
  const CounterModule = (() => {
    function animateCount(el) {
      const target = parseInt(el.dataset.countTo, 10);
      if (Number.isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = String(target);
        return;
      }

      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function init() {
      const counters = document.querySelectorAll("[data-count-to]");
      if (!counters.length) return;

      if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCount);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach((el) => observer.observe(el));
    }

    return { init };
  })();

  /* =========================================================
     MÓDULO: Fundo interativo (grid técnico + partículas + glow)
  ========================================================= */
  const BackgroundModule = (() => {
    const canvas = document.getElementById("bg-canvas");
    const glow = document.getElementById("cursor-glow");
    let ctx, width, height, particles, rafId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.documentElement.scrollHeight;
    }

    function createParticles() {
      const count = Math.min(60, Math.floor((width * height) / 45000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.15,
      }));
    }

    function drawGrid() {
      const gap = 64;
      ctx.strokeStyle = "rgba(96, 165, 250, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function drawParticles() {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.fill();
      });
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawParticles();
      rafId = requestAnimationFrame(loop);
    }

    function handlePointerMove(e) {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY + window.scrollY}px`;
    }

    function init() {
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      resize();
      createParticles();

      window.addEventListener("resize", () => {
        resize();
        createParticles();
      });

      if (!prefersReducedMotion) {
        loop();
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
      } else {
        // Desenha um frame estático, sem animação contínua.
        ctx.clearRect(0, 0, width, height);
        drawGrid();
        drawParticles();
      }
    }

    return { init };
  })();

  /* =========================================================
     MÓDULO: Rodapé (ano atual)
  ========================================================= */
  const FooterModule = (() => {
    function init() {
      const yearEl = document.getElementById("year");
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }
    return { init };
  })();

  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    NavModule.init();
    TerminalModule.init();
    RevealModule.init();
    CounterModule.init();
    BackgroundModule.init();
    FooterModule.init();
  });
})();
