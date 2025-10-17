// src/scripts/header.ts
export function initHeader(root: HTMLElement) {
  const btn = root.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const menu = root.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const nowHidden = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!nowHidden));
  });
}

// Auto-inicializa todos los headers presentes en el DOM.
function initAllHeaders() {
  document.querySelectorAll<HTMLElement>('[data-header]').forEach((el) => {
    initHeader(el);
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllHeaders);
  } else {
    initAllHeaders();
  }
}
