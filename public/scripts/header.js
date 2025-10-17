// --- Transparente -> Opaco al hacer scroll ---
const headerEl = document.getElementById("site-header");
const SCROLL_THRESHOLD = 8; // pixeles (ajusta si es necesario)

function updateHeaderOnScroll() {
  if (!headerEl) return;
  const scrolled = window.scrollY > SCROLL_THRESHOLD;
  headerEl.classList.toggle("header-scrolled", scrolled);
}

updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

// --- Cambio de idioma ---
const langToggle = document.getElementById("lang-toggle");
const langFlag = document.getElementById("lang-flag");
const langLabel = langToggle?.querySelector("[data-lang-label]");

if (langToggle && langFlag) {
  const flags = {
    es: langToggle.dataset.flagEs,
    en: langToggle.dataset.flagEn,
  };

  const labels = {
    es: langToggle.dataset.labelEs || "ES",
    en: langToggle.dataset.labelEn || "EN",
  };

  const altText = {
    es: langToggle.dataset.altEs || "Idioma actual: Espanol",
    en: langToggle.dataset.altEn || "Current language: English",
  };

  const setLanguage = (lang) => {
    const normalizedLang = lang === "en" ? "en" : "es";
    langToggle.dataset.lang = normalizedLang;

    const flagUrl = flags[normalizedLang];
    if (flagUrl) {
      langFlag.src = flagUrl;
    }
    langFlag.alt = altText[normalizedLang];

    if (langLabel) {
      langLabel.textContent = labels[normalizedLang];
    }
  };

  const toggleLanguage = () => {
    const currentLang = langToggle.dataset.lang === "en" ? "en" : "es";
    const nextLang = currentLang === "es" ? "en" : "es";
    setLanguage(nextLang);
  };

  // Garantiza que el estado inicial coincida con los atributos de datos
  setLanguage(langToggle.dataset.lang);

  langToggle.addEventListener("click", toggleLanguage);
}
