const DEFAULT_CONFIG = {
  eventName: "II Mostra de Compositores do RN",
  startISO: "2026-11-25T16:00:00-03:00",
  endISO: "2026-11-27T18:30:00-03:00",
  timeZone: "America/Sao_Paulo",
  location: "Auditório do Curso de Música, FALA (Sede 2) — Campus Central da UERN, Mossoró",
  locationShort: "Híbrido · UERN",
  contactEmail: "hendersonrodrigues@uern.br",
  contactPhone: "(84) 9 8847 2021",
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeiPPhEB4Fra8hBo8ovTNi5mmfDM2DyTaR-FAwsXhkbzr1OkA/viewform",
  shareText: "Participe da II Mostra de Compositores do RN — 25 a 27 de novembro de 2026.",
  likesNamespace: "uern-ii-mostra-compositores-rn"
};

const DRAFT_KEY = "eventSiteDraft";
const PREVIEW_PARAM = "preview";

document.documentElement.classList.add("js");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft && typeof draft === "object" ? draft : null;
  } catch (error) {
    return null;
  }
}

function resolveSite() {
  const published = window.EVENT_SITE || {};
  const base = {
    config: { ...DEFAULT_CONFIG, ...(published.config || {}) },
    content: { ...(published.content || {}) },
    videos: Array.isArray(published.videos) ? published.videos : []
  };

  if (!new URLSearchParams(location.search).has(PREVIEW_PARAM)) return base;

  const draft = readDraft();
  if (!draft) return base;

  return {
    config: { ...base.config, ...(draft.config || {}) },
    content: { ...base.content, ...(draft.content || {}) },
    videos: Array.isArray(draft.videos) ? draft.videos : base.videos
  };
}

const site = resolveSite();
const CONFIG = site.config;
const CONTENT = site.content;
const VIDEOS = site.videos;

function parseDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateParts(iso) {
  const date = parseDate(iso);
  if (!date) return null;
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: CONFIG.timeZone,
    day: "numeric",
    month: "long",
    year: "numeric"
  }).formatToParts(date);
  const find = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return { day: find("day"), month: find("month"), year: find("year") };
}

function formatDateRange(startISO, endISO) {
  const start = dateParts(startISO);
  const end = dateParts(endISO);
  if (!start) return "";
  if (!end) return `${start.day} de ${start.month} de ${start.year}`;

  if (start.year === end.year && start.month === end.month) {
    if (start.day === end.day) return `${start.day} de ${start.month} de ${start.year}`;
    return `${start.day} a ${end.day} de ${start.month} de ${start.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} de ${start.month} a ${end.day} de ${end.month} de ${start.year}`;
  }

  return `${start.day} de ${start.month} de ${start.year} a ${end.day} de ${end.month} de ${end.year}`;
}

function formatTime(iso) {
  const date = parseDate(iso);
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: CONFIG.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return minute === "00" ? `${hour}h` : `${hour}h${minute}`;
}

function youtubeId(input) {
  if (!input) return "";
  const value = String(input).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;

  let url;
  try {
    url = new URL(value);
  } catch (error) {
    return "";
  }

  const host = url.hostname.replace(/^www\./, "");
  let id = "";

  if (host === "youtu.be") {
    id = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v") || "";
    } else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      if (match) id = match[1];
    }
  }

  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
}

function applyContent() {
  $$("[data-field]").forEach((element) => {
    const value = CONTENT[element.dataset.field];
    if (typeof value !== "string") return;

    if (element.hasAttribute("data-field-lines")) {
      const items = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      element.replaceChildren(
        ...items.map((line) => {
          const item = document.createElement("li");
          item.textContent = line;
          return item;
        })
      );
      element.hidden = items.length === 0;
      return;
    }

    element.textContent = value;

    if (element.classList.contains("format-tag")) {
      const isOnline = /online/i.test(value) && !/h[ií]brido/i.test(value);
      element.classList.toggle("format-online", isOnline);
      element.classList.toggle("format-hybrid", !isOnline);
    }
  });
}

function applyEventData() {
  const eventDate = formatDateRange(CONFIG.startISO, CONFIG.endISO);
  const startTime = formatTime(CONFIG.startISO);
  const eventTime = startTime ? `A partir das ${startTime}` : "";

  const values = {
    date: eventDate,
    time: eventTime,
    location: CONFIG.location,
    "location-short": CONFIG.locationShort,
    email: CONFIG.contactEmail,
    phone: CONFIG.contactPhone,
    "event-name": CONFIG.eventName
  };

  $$("[data-event]").forEach((element) => {
    const value = values[element.dataset.event];
    if (value) element.textContent = value;
  });

  $$('[data-event="email-link"]').forEach((link) => {
    link.setAttribute("href", `mailto:${CONFIG.contactEmail}`);
  });

  const phoneDigits = String(CONFIG.contactPhone || "").replace(/\D/g, "");
  const whatsappNumber = phoneDigits.length >= 10 && phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;
  $$('[data-event="phone-link"]').forEach((link) => {
    if (whatsappNumber) link.setAttribute("href", `https://wa.me/${whatsappNumber}`);
  });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function applyMeta(title, description) {
  if (title) {
    document.title = title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
  }

  if (description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    if (ogDescription) ogDescription.setAttribute("content", description);
  }
}

window.Site = {
  config: CONFIG,
  content: CONTENT,
  videos: VIDEOS,
  applyContent,
  applyEventData,
  applyMeta,
  parseDate,
  formatDateRange,
  formatTime,
  youtubeId,
  readDraft,
  DRAFT_KEY
};
