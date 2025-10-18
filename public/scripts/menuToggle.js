function initMenuToggle() {
  const menuBtn = document.getElementById("menu-btn");
  const panel = document.getElementById("mobile-panel");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (!menuBtn || !panel || !iconOpen || !iconClose) {
    return;
  }

  const links = Array.from(panel.querySelectorAll("[data-menu-link]"));

  const focusFirstItem = () => {
    const target = links[0];
    target?.focus({ preventScroll: true });
  };

  const setState = (isOpen, { restoreFocus = true } = {}) => {
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"
    );

    panel.classList.toggle("hidden", !isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));

    iconOpen.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);

    if (!isOpen && restoreFocus) {
      menuBtn.focus({ preventScroll: true });
    }
  };

  const openMenu = () => {
    if (!panel.classList.contains("hidden")) {
      return;
    }

    setState(true, { restoreFocus: false });
    window.setTimeout(focusFirstItem, 250);
  };

  const closeMenu = (options) => {
    if (panel.classList.contains("hidden")) {
      return;
    }

    setState(false, options);
  };

  const toggleMenu = () => {
    if (panel.classList.contains("hidden")) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  menuBtn.addEventListener("click", toggleMenu);
  panel.addEventListener("click", (event) => {
    if (event.target.closest("[data-menu-link]")) {
      closeMenu({ restoreFocus: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const mdQuery = window.matchMedia("(min-width: 768px)");
  const handleMediaChange = (event) => {
    if (event.matches) {
      closeMenu({ restoreFocus: false });
    }
  };

  if (typeof mdQuery.addEventListener === "function") {
    mdQuery.addEventListener("change", handleMediaChange);
  } else {
    mdQuery.addListener(handleMediaChange);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMenuToggle);
} else {
  initMenuToggle();
}
