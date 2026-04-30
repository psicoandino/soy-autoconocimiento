const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const loginButton = document.querySelector("[data-login-toggle]");
const statusDot = document.querySelector(".status-dot");
const toast = document.querySelector(".toast");

let isLoggedIn = false;
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function requireLogin(action) {
  if (isLoggedIn) return true;
  showToast(`Necesitas ingresar para ${action}. Presiona "Ingresar" primero.`);
  return false;
}

menuToggle.addEventListener("click", () => {
  const nextState = !header.classList.contains("is-open");
  header.classList.toggle("is-open", nextState);
  menuToggle.setAttribute("aria-expanded", String(nextState));
});

loginButton.addEventListener("click", () => {
  isLoggedIn = !isLoggedIn;
  loginButton.textContent = isLoggedIn ? "Salir" : "Ingresar";
  loginButton.classList.toggle("is-active", isLoggedIn);
  statusDot.textContent = isLoggedIn ? "Has ingresado" : "No has ingresado";
  statusDot.style.color = isLoggedIn ? "#385b43" : "#bd7668";
  showToast(isLoggedIn ? "Ahora estas viendo la experiencia de usuario." : "Ahora estas viendo la version publica.");
});

document.querySelectorAll("[data-course]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireLogin("abrir este curso")) return;
    showToast(`${button.dataset.course} abierto en modo alumno mock.`);
  });
});

document.querySelectorAll("[data-buy]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.buy} agregado al checkout mock. No se hace ningun pago.`);
  });
});

document.querySelectorAll("[data-like]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireLogin("dar like")) return;
    const counter = button.querySelector("span");
    const liked = button.classList.toggle("is-liked");
    counter.textContent = Number(counter.textContent) + (liked ? 1 : -1);
  });
});

document.querySelectorAll("[data-comment]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireLogin("comentar")) return;
    showToast("Aqui se abriria la caja de comentarios mock.");
  });
});

document.querySelectorAll("[data-share]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Link mock copiado para compartir.");
  });
});
