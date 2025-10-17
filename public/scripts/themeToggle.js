document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle-desktop");
  const themeIcon = document.getElementById("theme-icon-desktop");

  if (!themeToggle || !themeIcon) {
    return;
  }

  const applyThemeToUI = (isDark) => {
    themeIcon.textContent = isDark ? "dark_mode" : "light_mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  };

  const syncThemeFromPreferences = () => {
    try {
      const storedTheme = window.localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = storedTheme === "dark" || (!storedTheme && prefersDark);
      html.classList.toggle("dark", shouldUseDark);
      applyThemeToUI(shouldUseDark);
    } catch (error) {
      const fallbackDark = html.classList.contains("dark");
      applyThemeToUI(fallbackDark);
    }
  };

  syncThemeFromPreferences();

  themeToggle.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    applyThemeToUI(isDark);
    try {
      window.localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
      // ignored: almacenamiento no disponible
    }
  });
});
