const DEFAULT_CONFIG = {
  eventName: "II Mostra de Compositores do RN",
  startISO: "2026-11-25T16:00:00-03:00",
  endISO: "2026-11-27T18:30:00-03:00",
  timeZone: "America/Sao_Paulo",
  location: "Híbrido — presencial e online",
  locationShort: "Híbrido/Online",
  contactEmail: "hendersonrodrigues@gmail.com",
  formUrl: "",
  shareText: "Participe da II Mostra de Compositores do RN — 25 a 27 de novembro de 2026."
};

const DRAFT_KEY = "eventSiteDraft";
const PREVIEW_PARAM = "preview";

document.documentElement.classList.add("js");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const pad = (value) => String(value).padStart(2, "0");

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
    content: { ...(published.content || {}) }
  };

  if (!new URLSearchParams(location.search).has(PREVIEW_PARAM)) return base;

  const draft = readDraft();
  if (!draft) return base;

  return {
    config: { ...base.config, ...(draft.config || {}) },
    content: { ...base.content, ...(draft.content || {}) }
  };
}

const site = resolveSite();
const CONFIG = site.config;
const CONTENT = site.content;

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

function applyConfig() {
  const eventDate = formatDateRange(CONFIG.startISO, CONFIG.endISO);
  const startTime = formatTime(CONFIG.startISO);
  const eventTime = startTime ? `A partir das ${startTime}` : "";
  const eventName = CONFIG.eventName;

  const values = {
    date: eventDate,
    time: eventTime,
    location: CONFIG.location,
    "location-short": CONFIG.locationShort,
    email: CONFIG.contactEmail,
    "event-name": eventName
  };

  $$("[data-event]").forEach((element) => {
    const value = values[element.dataset.event];
    if (value) element.textContent = value;
  });

  $$('[data-event="email-link"]').forEach((link) => {
    link.setAttribute("href", `mailto:${CONFIG.contactEmail}`);
  });

  document.title = `${eventName} — Inscrições abertas`;

  const description = CONTENT["seo.description"];
  if (description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    if (ogDescription) ogDescription.setAttribute("content", description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", eventName);

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initCountdown() {
  const container = $("#countdown");
  const note = $("#countdown-note");
  const target = parseDate(CONFIG.startISO);
  if (!container || !target) return;

  const fields = {
    days: $("#cd-days"),
    hours: $("#cd-hours"),
    mins: $("#cd-mins"),
    secs: $("#cd-secs")
  };

  const tick = () => {
    const diff = target.getTime() - Date.now();

    if (diff <= 0) {
      container.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent = "O evento já começou. Aproveite!";
      }
      clearInterval(timer);
      return;
    }

    if (fields.days) fields.days.textContent = pad(Math.floor(diff / 86400000));
    if (fields.hours) fields.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (fields.mins) fields.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (fields.secs) fields.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
    container.hidden = false;
  };

  const timer = setInterval(tick, 1000);
  tick();
}

function initCalendar() {
  const link = $("#add-to-calendar");
  const start = parseDate(CONFIG.startISO);
  if (!link || !start) return;

  const end = parseDate(CONFIG.endISO) ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const toICSDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeICS = (text) => String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Landing do Evento//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@evento`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(CONFIG.eventName)}`,
    `LOCATION:${escapeICS(CONFIG.location)}`,
    `DESCRIPTION:${escapeICS(`Informações e inscrições: ${location.href}`)}`,
    `URL:${location.href}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const fileName = `${CONFIG.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "evento"}.ics`;

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
}

function initForm() {
  const iframe = $("#form-iframe");
  const placeholder = $("#form-placeholder");
  if (!iframe || !placeholder) return;

  if (!CONFIG.formUrl) {
    placeholder.hidden = false;
    iframe.hidden = true;
    return;
  }

  let url = CONFIG.formUrl;

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "docs.google.com" && parsed.pathname.includes("/forms/") && !parsed.searchParams.has("embedded")) {
      parsed.searchParams.set("embedded", "true");
      url = parsed.toString();
    }
  } catch (error) {
    url = CONFIG.formUrl;
  }

  iframe.src = url;
  iframe.hidden = false;
  placeholder.hidden = true;
}

function initLinks() {
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${CONFIG.shareText} ${location.href}`)}`;
  $$("#share-whatsapp, #share-whatsapp-footer").forEach((link) => {
    link.href = shareUrl;
  });
}

function initCopyLink() {
  const button = $("#copy-link");
  const feedback = $("#copy-feedback");
  if (!button) return;

  const showFeedback = (message) => {
    if (!feedback) return;
    feedback.textContent = message;
    clearTimeout(showFeedback.timer);
    showFeedback.timer = setTimeout(() => {
      feedback.textContent = "";
    }, 2500);
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let succeeded = false;
    try {
      succeeded = document.execCommand("copy");
    } catch (error) {
      succeeded = false;
    }
    textarea.remove();
    return succeeded;
  };

  button.addEventListener("click", async () => {
    const url = location.href;
    let succeeded = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        succeeded = true;
      } catch (error) {
        succeeded = fallbackCopy(url);
      }
    } else {
      succeeded = fallbackCopy(url);
    }

    showFeedback(succeeded ? "Link copiado!" : "Não foi possível copiar o link.");
  });
}

function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

applyContent();
applyConfig();
initCountdown();
initCalendar();
initForm();
initLinks();
initCopyLink();
initReveal();
