1. System Health & Architectural ArcheologyThe project has a coherent sovereign-single-page architecture: HTML defines two primary “slides,” CSS owns the visual/scroll grammar, and JS initializes discrete interaction engines on DOMContentLoaded. The broad structure is readable and intentionally modular.
Structural integrity is medium-strong, but with several fragile edges:
index.html is semantically decent: header, main, section, article, nav, modal overlays, and button-triggered interactions are all directionally correct.
script.js is cleanly segmented into engines: scroll snap/nav, about modal, service modal, SVG labyrinth, carousel centering.
styles.css carries most of the system identity through custom properties and component blocks, which is good for maintainability.
Naming is expressive but sometimes theatrical beyond function. Names like initEngineScrollSnap, cosmos-layer, services-grid, about-modal-window are understandable; comments such as “MODALES ELECTRÓNICOS” add tone but not operational clarity.
Separation of concerns is mostly intact, though modal state is controlled through direct document.body.style.overflow mutation in two different modal systems. That creates state collision risk.
The system assumes “viewport equals slide height” everywhere. This is the main architectural risk, especially on iOS Safari.
The dominant architecture is:
text



body overflow hidden
  -> main.scroll-snap-container owns vertical scroll
    -> section.snap-section height: 100vh
      -> mobile services section embeds horizontal scroll carousel
  -> fixed header
  -> fixed modal overlays
  -> fixed decorative cosmos layer

That architecture can work, but iOS/WebKit is hostile to nested viewport scrolling plus 100vh, fixed overlays, backdrop-filter, and scroll snap.
2. Functional Verification (What Works)The HTML document is syntactically sound and structurally clear. The viewport meta exists in index.html (line 5), external fonts are loaded properly, stylesheet/script wiring is straightforward, and the slide sections have stable IDs matching navigation targets.
The scroll/navigation engine in script.js (line 16) is conceptually clean:
It scopes scrolling to .scroll-snap-container.
It uses IntersectionObserver with root: container, which is correct for a nested scroll container.
Dot activation is data-driven through data-target.
Dot clicks call scrollIntoView({ behavior: "smooth" }), which should work for same-container section jumps in most modern browsers.
The modal systems are readable and mostly functional:
About modal supports mobile and desktop triggers.
Service modal hydrates content from data-* attributes safely using textContent.
Overlay click-to-close works.
Escape closes the service modal.
The SVG labyrinth generator is syntactically sound:
Uses createElementNS.
Clears the container before append.
Generates circles/spokes without relying on external SVG markup except rosa.svg.
The animation loop is simple and likely visually smooth on desktop.
The responsive intent is clear:
Desktop: grid hero, 3-card service grid.
Tablet: single-column hero, 2-card services grid.
Mobile: hidden desktop nav, horizontal services carousel.
3. Latent Flaws & Mobile Breakpoints (What Fails or Is Fragile)The highest-risk issue is 100vh on iOS Safari. Both .scroll-snap-container and .snap-section use fixed 100vh in styles.css (line 56) and styles.css (line 64). On real iOS, browser chrome expansion/collapse changes the visual viewport, while CSS 100vh may reference the larger layout viewport. Result: clipped content, false vertical centering, snap positions that feel slightly wrong, or content hidden behind the bottom Safari bar.
The body is locked with overflow: hidden in styles.css (line 47). This makes the nested scroll container the only scroll surface. On iOS, nested scroll areas with -webkit-overflow-scrolling: touch can behave inconsistently when combined with fixed headers, modals, and scroll snap. Desktop simulation will not reveal the same friction.
The fixed header overlays slide content without the sections reserving a consistent safe top area. .site-header is fixed in styles.css (line 142), while .snap-section vertically centers content. On short mobile screens, the hero can collide visually with the header, especially because only the 1024px breakpoint adds padding-top: 7vh to .hero-section.
The mobile services section is especially fragile. At styles.css (line 281), .services-section is forced to height: 100vh; overflow: hidden; padding-top: 80px;. Inside it, the heading plus carousel must fit into one fixed viewport. With real copy, larger text, browser UI, or user font scaling, content will clip because vertical overflow is deliberately disabled.
The mobile service cards use max-height: 52vh in styles.css (line 295). This is brittle because card content is not scrollable and body text placeholders are currently empty. Once real descriptions are inserted, the button or text can be clipped.
The horizontal carousel centering only runs once on page load in script.js (line 239). It does not rerun after orientation change, resize, font load changes, image load shifts, or dynamic viewport changes. On iOS rotation, the second card may no longer be centered.
There is a CSS syntax anomaly: .about-trigger-btn:shadow in styles.css (line 179) is not a valid useful pseudo-class. It will be ignored. It likely intended :hover, :focus-visible, or an active state.
There is an undefined CSS custom property: var(--gold-glow) in styles.css (line 110). Because --gold-glow is never declared, the box-shadow declaration is invalid and will be dropped.
The about modal has no Escape close handler. Service modal listens for Escape in script.js (line 141), but the about modal does not. This is inconsistent behavior.
Both modals mutate document.body.style.overflow. If one modal opens, then another opens or closes out of sequence, scroll lock can be released incorrectly. Today the UI probably prevents simultaneous modal use, but architecturally the state is not reference-counted or class-based.
Modal accessibility is incomplete. aria-hidden="true" is set in HTML, but JS never toggles it to false when active. There is no role="dialog", no aria-modal="true", no focus management, and no focus return to the trigger. This is not just semantic; on iOS VoiceOver, the background can remain reachable.
The service cards have empty <p> elements in index.html (line 96), index.html (line 110), and index.html (line 124). The layout currently looks cleaner than it will after real content arrives.
The CTA links use href="#" in several places. This causes page-top jumps unless intercepted, and inside a nested scroll container that can create confusing scroll behavior.
The mobile breakpoint only hides .main-nav; .about-trigger-btn remains visible on desktop too. That may be intentional, but the comment says it is a mobile replacement. If desktop should use the nav link, the trigger needs a desktop-hidden rule.
4. Performance & Resource OverheadThe page is generally lightweight, but several effects stack on mobile hardware.
The continuously animated SVG labyrinth runs indefinitely through requestAnimationFrame in script.js (line 225). Even when the hero is off-screen, it keeps mutating SVG transforms. Because the hero symbol is hidden under 1024px, this mostly affects desktop/tablet, but still wastes work if hidden by CSS after initialization.
backdrop-filter: blur(16px) on the fixed header in styles.css (line 148) is visually nice but expensive on iOS, especially over animated/gradient/fixed layers.
The decorative background uses fixed positioning, layered repeating gradients, a large background image, blur, and translate3d in styles.css (line 114). Individually fine; combined with scroll snap and fixed header blur, it can increase compositing cost.
The scroll listener in script.js (line 26) runs on every scroll event and mutates classes/timers. It is small, but should be passive to avoid scroll pipeline pessimization.
Every service card gets its own click listener. With three cards this is irrelevant. If the bazar grows, event delegation would become cleaner.
transition: all is used globally through --transition in styles.css (line 30). This can animate properties accidentally and makes layout changes harder to reason about. Prefer transitioning only opacity, transform, background-color, border-color, color, and box-shadow.
5. Surgical Optimization RoadmapPriority 1: stabilize viewport math for iOS/WebKit.
css



:root {
  --app-height: 100dvh;
}

@supports not (height: 100dvh) {
  :root {
    --app-height: 100vh;
  }
}

.scroll-snap-container,
.snap-section {
  height: var(--app-height);
}

.snap-section {
  min-height: var(--app-height);
}

Priority 2: stop fixed-header collision and respect safe areas.
css



.site-header {
  padding-top: env(safe-area-inset-top);
}

.snap-section {
  padding-top: calc(56px + env(safe-area-inset-top));
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

Priority 3: make the mobile services slide tolerate real content.
css



@media (max-width: 768px) {
  .services-section {
    height: var(--app-height);
    overflow: hidden;
    justify-content: flex-start;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .services-grid {
    overscroll-behavior-x: contain;
    scroll-padding-inline: 1.5rem;
  }

  .service-card {
    flex-basis: min(82vw, 340px);
    max-height: none;
    min-height: 420px;
  }

  .service-body {
    min-height: 0;
  }
}

Priority 4: rerun carousel centering when viewport reality changes.
js



function initCarouselCenter() {
  const grid = document.querySelector(".services-grid");
  if (!grid) return;

  const centerMiddleCard = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    const cards = grid.querySelectorAll(".service-card");
    if (cards.length < 2) return;

    const middleCard = cards[1];
    grid.scrollLeft = middleCard.offsetLeft - (grid.clientWidth - middleCard.clientWidth) / 2;
  };

  requestAnimationFrame(centerMiddleCard);
  window.addEventListener("resize", centerMiddleCard, { passive: true });
  window.addEventListener("orientationchange", () => {
    setTimeout(centerMiddleCard, 250);
  });
}

Priority 5: repair ignored/undefined CSS.
css



:root {
  --gold-glow: rgba(200, 161, 90, 0.45);
}

.about-trigger-btn:hover,
.about-trigger-btn:focus-visible {
  background: rgba(200,161,90,0.1);
}

Priority 6: make scroll listeners passive.
js



container.addEventListener("scroll", () => {
  navigator.classList.add("is-scrolling");

  clearTimeout(isScrollingTimeout);
  isScrollingTimeout = setTimeout(() => {
    navigator.classList.remove("is-scrolling");
  }, 800);
}, { passive: true });

Priority 7: replace direct body overflow mutation with one scroll-lock class.
css



body.is-modal-open {
  overflow: hidden;
}

js



const lockScroll = () => document.body.classList.add("is-modal-open");
const unlockScroll = () => document.body.classList.remove("is-modal-open");

Priority 8: toggle modal accessibility state.
js



const openModal = (modal) => {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");
};

const closeModal = (modal) => {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-modal-open");
};

And in HTML:
html



<div class="modal-overlay" id="service-modal" aria-hidden="true">
  <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="modal-title">

Priority 9: pause the SVG animation when not useful.
js



const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
createLabyrinth(heroContainer, !prefersReducedMotion && window.innerWidth > 1024);

Priority 10: remove href="#" for non-real actions. Use real booking/contact URLs, or make them buttons until destinations exist.
html



<button class="btn btn-primary" type="button">Hablemos</button>
<button class="btn btn-secondary" type="button">Agendar</button>

Overall status: the project is visually and structurally promising, with a real interaction architecture already present. The main threat is not syntax; it is viewport physics. Fix 100vh, mobile service overflow, m