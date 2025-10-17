// =========================
// i18n unificado
// =========================

// Mapea banderas por idioma (fallback)
const LANG_ASSETS = {
  es: { flag: "/assets/Flag_Colombia.webp", label: "ES", alt: "Idioma actual: Español" },
  en: { flag: "/assets/Flag_United_States.webp", label: "EN", alt: "Current language: English" },
};

// Cache de recursos de traducción
let resources = null;

async function loadResources() {
  if (resources) return resources;
  try {
    const [es, en] = await Promise.all([
      fetch("/scripts/es.json").then((r) => r.json()),
      fetch("/scripts/en.json").then((r) => r.json()),
    ]);
    resources = { es, en };
  } catch (err) {
    console.error("[i18n] Error cargando recursos:", err);
    resources = { es: {}, en: {} };
  }
  return resources;
}

function getSavedLang() {
  const saved = localStorage.getItem("lang");
  return saved === "en" ? "en" : "es";
}

// Busca todos los controles relacionados con idioma (soporta 1 o varios botones)
function queryLangControls() {
  const primaryBtn = document.getElementById("lang-toggle");           // tu botón principal
  const desktopBtn = document.getElementById("lang-current-desktop");  // botón alterno (si existe)

  // flags/labels potenciales en DOM
  const imgs = [
    document.getElementById("lang-flag"),
    document.getElementById("lang-flag-desktop"),
  ].filter(Boolean);

  const labels = [
    ...(primaryBtn ? primaryBtn.querySelectorAll("[data-lang-label]") : []),
    ...(desktopBtn ? desktopBtn.querySelectorAll("[data-lang-label]") : []),
  ];

  // Fuentes de datos (data-attrs) en botones
  // Prioriza data-flag-xx del botón si existen; si no, usa LANG_ASSETS
  const dataset = (btn) =>
    btn
      ? {
          esFlag: btn.dataset.flagEs || LANG_ASSETS.es.flag,
          enFlag: btn.dataset.flagEn || LANG_ASSETS.en.flag,
          esLabel: btn.dataset.labelEs || LANG_ASSETS.es.label,
          enLabel: btn.dataset.labelEn || LANG_ASSETS.en.label,
          esAlt: btn.dataset.altEs || LANG_ASSETS.es.alt,
          enAlt: btn.dataset.altEn || LANG_ASSETS.en.alt,
        }
      : null;

  const primaryData = dataset(primaryBtn);
  const desktopData = dataset(desktopBtn);

  // Mezcla de fuentes (primary > desktop > fallback)
  const data = {
    esFlag: primaryData?.esFlag || desktopData?.esFlag || LANG_ASSETS.es.flag,
    enFlag: primaryData?.enFlag || desktopData?.enFlag || LANG_ASSETS.en.flag,
    esLabel: primaryData?.esLabel || desktopData?.esLabel || LANG_ASSETS.es.label,
    enLabel: primaryData?.enLabel || desktopData?.enLabel || LANG_ASSETS.en.label,
    esAlt: primaryData?.esAlt || desktopData?.esAlt || LANG_ASSETS.es.alt,
    enAlt: primaryData?.enAlt || desktopData?.enAlt || LANG_ASSETS.en.alt,
  };

  return { primaryBtn, desktopBtn, imgs, labels, data };
}

function translatePage(lang) {
  const dict = (resources && resources[lang]) || (resources && resources.es) || {};

  // data-i18n="clave" → texto
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = key?.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), dict);
    if (typeof val === "string") el.textContent = val;
  });

  // data-i18n-attr="title:clave,placeholder:clave2"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el
      .getAttribute("data-i18n-attr")
      .split(",")
      .forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        const val = key?.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), dict);
        if (attr && typeof val === "string") el.setAttribute(attr, val);
      });
  });

  document.documentElement.setAttribute("lang", lang);
}

// Actualiza UI (banderas, labels, data-attrs)
function updateLangUI(lang) {
  const normalized = lang === "en" ? "en" : "es";
  const { primaryBtn, desktopBtn, imgs, labels, data } = queryLangControls();

  const nextFlag = normalized === "en" ? data.enFlag : data.esFlag;
  const nextAlt = normalized === "en" ? data.enAlt : data.esAlt;
  const nextLabel = normalized === "en" ? data.enLabel : data.esLabel;

  // Flags
  imgs.forEach((img) => {
    img.src = nextFlag;
    img.alt = nextAlt;
  });

  // Labels
  labels.forEach((el) => {
    el.textContent = nextLabel;
  });

  // dataset en botones (si existen)
  if (primaryBtn) primaryBtn.dataset.lang = normalized;
  if (desktopBtn) desktopBtn.dataset.lang = normalized;
}

async function setLang(lang, persist = true) {
  await loadResources();
  const normalized = lang === "en" ? "en" : "es";

  updateLangUI(normalized);
  translatePage(normalized);

  if (persist) {
    localStorage.setItem("lang", normalized);
    document.cookie = `lang=${normalized}; path=/;`;
  }
}

function toggleLang() {
  const current = document.documentElement.getAttribute("lang") || getSavedLang();
  const next = current === "es" ? "en" : "es";
  setLang(next, true);
}

async function initI18n() {
  await loadResources();

  // Idioma inicial: localStorage > data-lang (si existe) > 'es'
  const { primaryBtn, desktopBtn } = queryLangControls();
  const seed =
    localStorage.getItem("lang") ||
    primaryBtn?.dataset.lang ||
    desktopBtn?.dataset.lang ||
    "es";

  await setLang(seed, false);

  // Eventos (soporta uno o ambos botones)
  if (primaryBtn) primaryBtn.addEventListener("click", toggleLang);
  if (desktopBtn) desktopBtn.addEventListener("click", toggleLang);
}

// =========================
// Transparencia del header en scroll (lo que ya tenías)
// =========================
function initHeaderScroll() {
  const headerEl = document.getElementById("site-header");
  const SCROLL_THRESHOLD = 8;
  const updateHeaderOnScroll = () => {
    if (!headerEl) return;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    headerEl.classList.toggle("header-scrolled", scrolled);
  };
  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
}

// =========================
// Boot
// =========================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initI18n();
  });
} else {
  initHeaderScroll();
  initI18n();
}
