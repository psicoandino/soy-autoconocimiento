/* ==========================================================
   SOY AUTOCONOCIMIENTO 2.5 - ARQUITECTURA DE CONTROL DE FLUIDEZ
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initEngineScrollSnap();
  initOnDemandAboutModal();
  initServiceModal();
  initLabyrinth();
  initCarouselCenter();
});

/* ==========================================================
   INTERACTION ENGINE: SCROLL SNAP & LATERAL NAV
   ========================================================== */
function initEngineScrollSnap() {
  const container = document.querySelector(".scroll-snap-container");
  const navigator = document.querySelector(".slide-navigator");
  const dots = document.querySelectorAll(".nav-dot");
  const sections = document.querySelectorAll(".snap-section");

  if (!container || !navigator) return;

  // 1. Control del desvanecimiento pasivo (Fade In/Out de la barra lateral)
  let isScrollingTimeout;
  container.addEventListener("scroll", () => {
    navigator.classList.add("is-scrolling");

    clearTimeout(isScrollingTimeout);
    isScrollingTimeout = setTimeout(() => {
      navigator.classList.remove("is-scrolling");
    }, 800); // Se desvanece tras 800ms sin interactuar
  });

  // 2. Sincronización Bidireccional: Detectar sección activa (IntersectionObserver)
  const observerOptions = {
    root: container,
    threshold: 0.6 // Se activa cuando el slide ocupa el 60% del viewport
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        
        // Actualizar estados de puntos laterales
        dots.forEach(dot => {
          if (dot.dataset.target === activeId) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // 3. Saltar a Secciones mediante clic en los puntos laterales
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const targetId = dot.dataset.target;
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ==========================================================
   MODAL BAJO DEMANDA: "QUIÉN SOY" (MÓVIL & DESKTOP LINKS)
   ========================================================== */
function initOnDemandAboutModal() {
  const triggerMobile = document.querySelector(".about-trigger-btn");
  const triggerDesktop = document.querySelector(".about-desktop-link");
  const modal = document.getElementById("about-modal");
  const closeBtn = document.querySelector(".aria-close-about");

  if (!modal) return;

  const openAbout = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Scroll lock activo
  };

  const closeAbout = () => {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Liberar viewport
  };

  triggerMobile?.addEventListener("click", openAbout);
  triggerDesktop?.addEventListener("click", openAbout);
  closeBtn?.addEventListener("click", closeAbout);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAbout();
  });
}

/* ==========================================================
   SERVICE MODAL DETALLES BAZAR
   ========================================================== */
function initServiceModal() {
  const modal = document.getElementById("service-modal");
  if (!modal) return;

  const cards = document.querySelectorAll(".service-card");
  const closeBtn = modal.querySelector(".modal-close");
  const title = document.getElementById("modal-title");
  const description = document.getElementById("modal-description");
  const format = document.getElementById("modal-format");
  const duration = document.getElementById("modal-duration");
  const price = document.getElementById("modal-price");

  cards.forEach(card => {
    const button = card.querySelector(".service-button");
    if (!button) return;

    button.addEventListener("click", () => {
      title.textContent = card.dataset.title || "";
      description.textContent = card.dataset.description || "";
      format.textContent = `Modalidad: ${card.dataset.format || "-"}`;
      duration.textContent = `Duración: ${card.dataset.duration || "-"}`;
      price.textContent = `Valor: ${card.dataset.price || "-"}`;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

/* ==========================================================
   LABERINTO UNICURSAL GENERATIVE SVG
   ========================================================== */
function initLabyrinth() {
  const heroContainer = document.getElementById("hero-labyrinth");
  createLabyrinth(heroContainer, true);
}

function createLabyrinth(container, animated = true) {
  if (!container) return;

  const size = 750;
  const center = size / 2;
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  const labyrinth = document.createElementNS(svgNS, "g");
  labyrinth.setAttribute("opacity", "0.58");

  const roseSize = 400; 
  const rosePosition = (size - roseSize) / 2;

  const rose = document.createElementNS(svgNS, "image");
  rose.setAttribute("href", "rosa.svg");
  rose.setAttribute("x", rosePosition);
  rose.setAttribute("y", rosePosition);
  rose.setAttribute("width", roseSize);
  rose.setAttribute("height", roseSize);

  const rotation = Math.floor(Math.random() * 360);
  labyrinth.setAttribute("transform", `rotate(${rotation} ${center} ${center})`);

  // Anillos vectoriales
  const rings = 6;
  for (let i = rings; i > 0; i--) {
    const circle = document.createElementNS(svgNS, "circle");
    const radius = 120 + (i * 38);
    circle.setAttribute("cx", center);
    circle.setAttribute("cy", center);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#c8a15a");
    circle.setAttribute("stroke-width", i % 2 === 0 ? 8 : 6);
    circle.setAttribute("stroke-linecap", "butt");

    const perimeter = Math.PI * 2 * radius;
    const gap = perimeter * (0.12 + Math.random() * 0.16);
    circle.setAttribute("stroke-dasharray", `${perimeter - gap} ${gap}`);
    circle.setAttribute("stroke-dashoffset", Math.random() * perimeter);
    labyrinth.appendChild(circle);
  }

  // Conexiones / Radios
  const spokes = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < spokes; i++) {
    const angle = (Math.PI * 2 * i) / spokes + Math.random() * 0.45;
    const inner = 150 + Math.random() * 45;
    const outer = 300 + Math.random() * 40;

    const x1 = center + Math.cos(angle) * inner;
    const y1 = center + Math.sin(angle) * inner;
    const x2 = center + Math.cos(angle) * outer;
    const y2 = center + Math.sin(angle) * outer;

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#c8a15a");
    line.setAttribute("stroke-width", "5");
    labyrinth.appendChild(line);
  }

  svg.appendChild(labyrinth);
  svg.appendChild(rose);
  container.innerHTML = "";
  container.appendChild(svg);

  if (animated) {
    let current = rotation;
    function animateRotation() {
      current += 0.015;
      labyrinth.setAttribute("transform", `rotate(${current} ${center} ${center})`);
      requestAnimationFrame(animateRotation);
    }
    animateRotation();
  }
}

/* ==========================================================
   CENTRADOR AUTOMÁTICO CAROUSEL BAZAR (MÓVIL)
   ========================================================= */
function initCarouselCenter() {
  const grid = document.querySelector(".services-grid");
  if (!grid) return;

  if (window.innerWidth <= 768) {
    const cards = grid.querySelectorAll(".service-card");
    if (cards.length >= 2) {
      const middleCard = cards[1]; 
      const offsetCenter = middleCard.offsetLeft - (grid.clientWidth - middleCard.clientWidth) / 2;
      grid.scrollLeft = offsetCenter;
    }
  }
}