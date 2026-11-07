(function () {
  const {
    config: CONFIG,
    content: CONTENT,
    applyContent,
    applyEventData,
    applyMeta,
    parseDate
  } = window.Site;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const pad = (value) => String(value).padStart(2, "0");

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
  applyEventData();
  applyMeta(`${CONFIG.eventName} — Inscrições abertas`, CONTENT["seo.description"]);

  initCountdown();
  initCalendar();
  initForm();
  initLinks();
  initCopyLink();
  initReveal();
})();
