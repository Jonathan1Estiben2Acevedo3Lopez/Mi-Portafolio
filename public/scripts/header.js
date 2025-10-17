// --- Transparente -> Opaco al hacer scroll ---
const headerEl = document.getElementById('site-header');
const SCROLL_THRESHOLD = 8; // píxeles (ajústalo)

function updateHeaderOnScroll() {
  if (!headerEl) return;
  const scrolled = window.scrollY > SCROLL_THRESHOLD;
  headerEl.classList.toggle('header-scrolled', scrolled);
}

// Ejecuta al cargar y en scroll
updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
