const TRANSITION_MS = 280;

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const panel = document.getElementById("mobile-panel");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (!menuBtn || !panel || !iconOpen || !iconClose) {
    return;
  }

  const backdrop = panel.querySelector("[data-menu-backdrop]");
  const sheet = panel.querySelector("[data-menu-sheet]");
  const links = sheet ? Array.from(sheet.querySelectorAll("[data-menu-link]")) : [];

  if (!backdrop || !sheet) {
    return;
  }

  let closingTimeout = null;

  const syncButtonState = (isOpen) => {
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"
    );

    iconOpen.classList.toggle("opacity-0", isOpen);
    iconOpen.classList.toggle("scale-100", !isOpen);
    iconOpen.classList.toggle("scale-90", isOpen);

    iconClose.classList.toggle("opacity-0", !isOpen);
    iconClose.classList.toggle("scale-100", isOpen);
    iconClose.classList.toggle("scale-95", !isOpen);
  };

  const animateOpen = () => {
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");
    sheet.classList.remove("opacity-0", "translate-y-4", "scale-95");
    sheet.classList.add("opacity-100", "translate-y-0", "scale-100");
  };

  const animateClose = () => {
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");
    sheet.classList.remove("opacity-100", "translate-y-0", "scale-100");
    sheet.classList.add("opacity-0", "translate-y-4", "scale-95");
  };

  const focusFirstItem = () => {
    const target = links[0] ?? sheet;
    target?.focus({ preventScroll: true });
  };

  const openMenu = () => {
    if (panel.dataset.state === "open" || panel.dataset.state === "opening") {
      return;
    }

    clearTimeout(closingTimeout);

    panel.dataset.state = "opening";
    panel.setAttribute("aria-hidden", "false");
    panel.classList.remove("pointer-events-none");
    syncButtonState(true);

    requestAnimationFrame(() => {
      animateOpen();
      panel.dataset.state = "open";
    });

    window.setTimeout(focusFirstItem, TRANSITION_MS);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (panel.dataset.state !== "open") {
      return;
    }

    panel.dataset.state = "closing";
    syncButtonState(false);
    animateClose();

    closingTimeout = window.setTimeout(() => {
      panel.dataset.state = "closed";
      panel.setAttribute("aria-hidden", "true");
      panel.classList.add("pointer-events-none");

      if (restoreFocus) {
        menuBtn.focus({ preventScroll: true });
      }
    }, TRANSITION_MS);
  };

  const toggleMenu = () => {
    if (panel.dataset.state === "open") {
      closeMenu();
    } else if (panel.dataset.state !== "closing") {
      openMenu();
    }
  };

  menuBtn.addEventListener("click", toggleMenu);
  backdrop.addEventListener("click", () => closeMenu());

  sheet.addEventListener("click", (event) => {
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
});
