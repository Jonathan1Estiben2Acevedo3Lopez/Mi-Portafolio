// public/scripts/header.js
(function () {
  function initHeader(root) {
    var btn = root.querySelector('[data-menu-btn]');
    var menu = root.querySelector('[data-menu]');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      var nowHidden = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!nowHidden));
    });
  }

  function initAllHeaders() {
    document.querySelectorAll('[data-header]').forEach(function (el) {
      initHeader(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllHeaders);
  } else {
    initAllHeaders();
  }
})();
