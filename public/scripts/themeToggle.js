// Espera a que el DOM cargue
  document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle-desktop");
    const themeIcon = document.getElementById("theme-icon-desktop");

    // --- Verificar preferencia guardada o del sistema ---
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      html.classList.add("dark");
      themeIcon.textContent = "dark_mode";
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      html.classList.remove("dark");
      themeIcon.textContent = "light_mode";
      themeToggle.setAttribute("aria-pressed", "false");
    }

    // --- Al hacer clic: alternar tema ---
    themeToggle.addEventListener("click", () => {
      const isDark = html.classList.toggle("dark");
      themeIcon.textContent = isDark ? "dark_mode" : "light_mode";
      themeToggle.setAttribute("aria-pressed", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });
