/* ==========================================================
   SOY AUTOCONOCIMIENTO 2.0
   LABERINTO & BAZAR
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  initMobileMenu();
  initServiceModal();
  initLabyrinth();
  initScrollEffects();
  initCarouselCenter();

});

/* ==========================================================
   MOBILE MENU
   ========================================================== */

function initMobileMenu() {

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {

    const expanded =
      toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute(
      "aria-expanded",
      !expanded
    );

    nav.classList.toggle("is-open");

  });

  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("is-open");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}

/* ==========================================================
   SERVICE MODAL
   ========================================================== */

function initServiceModal() {

  const modal =
    document.getElementById("service-modal");

  if (!modal) return;

  const cards =
    document.querySelectorAll(".service-card");

  const closeBtn =
    document.querySelector(".modal-close");

  const title =
    document.getElementById("modal-title");

  const description =
    document.getElementById("modal-description");

  const format =
    document.getElementById("modal-format");

  const duration =
    document.getElementById("modal-duration");

  const price =
    document.getElementById("modal-price");

  cards.forEach(card => {

    const button =
      card.querySelector(".service-button");

    if (!button) return;

    button.addEventListener("click", () => {

      title.textContent =
        card.dataset.title || "";

      description.textContent =
        card.dataset.description || "";

      format.textContent =
        `Modalidad: ${card.dataset.format || "-"}`;

      duration.textContent =
        `Duración: ${card.dataset.duration || "-"}`;

      price.textContent =
        `Valor: ${card.dataset.price || "-"}`;

      modal.classList.add("active");

      document.body.style.overflow =
        "hidden";

    });

  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {

    if (e.target === modal) {
      closeModal();
    }

  });

  document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
      closeModal();
    }

  });

  function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow =
      "";

  }

}

/* ==========================================================
   LABERINTO UNICURSAL
   ========================================================== */

function initLabyrinth() {

  const heroContainer =
    document.getElementById("hero-labyrinth");

  createLabyrinth(heroContainer, true);

}

function createLabyrinth(container, animated = true) {

  if (!container) return;

  const size = 750;
  const center = size / 2;

  const svgNS =
    "http://www.w3.org/2000/svg";

  const svg =
    document.createElementNS(svgNS, "svg");

  svg.setAttribute(
    "viewBox",
    `0 0 ${size} ${size}`
  );

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  const labyrinth =
    document.createElementNS(svgNS, "g");

  labyrinth.setAttribute("opacity", "0.58");

  const roseSize = 400; // <--- Cambia este número para modificar el tamaño de la rosa
  const rosePosition = (size - roseSize) / 2; // Calcula automáticamente el centro perfecto

  const rose =
    document.createElementNS(svgNS, "image");

  rose.setAttribute("href", "rosa.svg");
  rose.setAttribute("x", rosePosition);
  rose.setAttribute("y", rosePosition);
  rose.setAttribute("width", roseSize);
  rose.setAttribute("height", roseSize);

  const rotation =
    Math.floor(Math.random() * 360);

  labyrinth.setAttribute(
    "transform",
    `rotate(${rotation} ${center} ${center})`
  );

  /* ==========================
     CAMINOS VARIABLES
     ========================== */

  const rings = 6;

  for (let i = rings; i > 0; i--) {

    const circle =
      document.createElementNS(
        svgNS,
        "circle"
      );

    const radius =
      120 + (i * 38);

    circle.setAttribute("cx", center);
    circle.setAttribute("cy", center);
    circle.setAttribute("r", radius);

    circle.setAttribute(
      "fill",
      "none"
    );

    circle.setAttribute(
      "stroke",
      "#c8a15a"
    );

    circle.setAttribute(
      "stroke-width",
      i % 2 === 0 ? 8 : 6
    );

    circle.setAttribute(
      "stroke-linecap",
      "butt"
    );

    const perimeter =
      Math.PI * 2 * radius;

    const gap =
      perimeter * (0.12 + Math.random() * 0.16);

    circle.setAttribute(
      "stroke-dasharray",
      `${perimeter - gap} ${gap}`
    );

    circle.setAttribute(
      "stroke-dashoffset",
      Math.random() * perimeter
    );

    labyrinth.appendChild(circle);

  }

  /* ==========================
     CONEXIONES
     ========================== */

  const spokes = 4 + Math.floor(Math.random() * 4);

  for (let i = 0; i < spokes; i++) {

    const angle =
      (Math.PI * 2 * i) / spokes +
      Math.random() * 0.45;

    const inner =
      150 + Math.random() * 45;

    const outer =
      300 + Math.random() * 40;

    const x1 =
      center +
      Math.cos(angle) * inner;

    const y1 =
      center +
      Math.sin(angle) * inner;

    const x2 =
      center +
      Math.cos(angle) * outer;

    const y2 =
      center +
      Math.sin(angle) * outer;

    const line =
      document.createElementNS(
        svgNS,
        "line"
      );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    line.setAttribute(
      "stroke",
      "#c8a15a"
    );

    line.setAttribute(
      "stroke-width",
      "5"
    );

    line.setAttribute(
      "stroke-linecap",
      "butt"
    );

    labyrinth.appendChild(line);

  }

  /* ==========================
     NODOS VARIABLES
     ========================== */

  const nodes =
    20 + Math.floor(Math.random() * 20);

  for (let i = 0; i < nodes; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      165 + Math.random() * 170;

    const x =
      center +
      Math.cos(angle) * distance;

    const y =
      center +
      Math.sin(angle) * distance;

    const node =
      document.createElementNS(
        svgNS,
        "circle"
      );

    node.setAttribute("cx", x);
    node.setAttribute("cy", y);

    node.setAttribute(
      "r",
      Math.random() * 2 + 1
    );

    node.setAttribute(
      "fill",
      "#dfc48f"
    );

    node.setAttribute(
      "opacity",
      0.55
    );

    if (animated) {

      node.animate(
        [
          { opacity: 0.2 },
          { opacity: 1 },
          { opacity: 0.2 }
        ],
        {
          duration:
            3000 +
            Math.random() * 5000,

          iterations:
            Infinity
        }
      );

    }

    labyrinth.appendChild(node);

  }

  svg.appendChild(labyrinth);
  svg.appendChild(rose);

  container.innerHTML = "";
  container.appendChild(svg);

  /* ==========================
     ROTACIÓN SUAVE
     ========================== */

  if (animated) {

    let current = rotation;

    function animateRotation() {

      current += 0.015;

      labyrinth.setAttribute(
        "transform",
        `rotate(${current} ${center} ${center})`
      );

      requestAnimationFrame(
        animateRotation
      );

    }

    animateRotation();

  }

}

/* ==========================================================
   SCROLL EFFECTS
   ========================================================== */

function initScrollEffects() {

  const targets =
    document.querySelectorAll(
      ".service-card, .about-content, .contact-card"
    );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

          }

        });

      },
      {
        threshold: 0.15
      }
    );

  targets.forEach(target => {

    target.classList.add("reveal");

    observer.observe(target);

  });

}

/* ==========================================================
   REGENERAR LABERINTO
   ========================================================== */

window.regenerateLabyrinth =
  function () {

    const hero =
      document.getElementById(
        "hero-labyrinth"
      );

    createLabyrinth(hero, true);

  };

/* ==========================================================
   PEQUEÑO EASTER EGG
   Doble click en el laberinto
   genera una nueva configuración
   ========================================================== */

document.addEventListener(
  "dblclick",
  e => {

    if (
      e.target.closest(
        "#hero-labyrinth"
      )
    ) {

      window.regenerateLabyrinth();

    }

  }
);


/* ==========================================================
   CENTRADOR AUTOMÁTICO DE BAZAR (MÓVIL)
   ========================================================== */
function initCarouselCenter() {
  const grid = document.querySelector(".services-grid");
  if (!grid) return;

  // Ejecutar solo si estamos en resolución móvil (coincidiendo con tu CSS de 768px)
  if (window.innerWidth <= 768) {
    const cards = grid.querySelectorAll(".service-card");
    
    // Nos aseguramos de que existan al menos las 3 tarjetas
    if (cards.length >= 2) {
      const middleCard = cards[1]; // Índice 1 es la segunda tarjeta (Servicio 2)
      
      // Cálculo Senior: Restamos al inicio de la tarjeta la mitad del espacio sobrante del contenedor
      // Esto ubica la tarjeta exactamente en el eje central del viewport
      const offsetCenter = middleCard.offsetLeft - (grid.clientWidth - middleCard.clientWidth) / 2;
      
      // Asignamos el scroll de manera instantánea en el render inicial
      grid.scrollLeft = offsetCenter;
    }
  }
}