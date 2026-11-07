const DRAFT_KEY = "eventSiteDraft";

const CONFIG_FIELDS = [
  { path: "eventName", label: "Nome do evento" },
  { path: "startISO", label: "Início (data e hora com fuso)", hint: "Formato: 2026-11-25T16:00:00-03:00" },
  { path: "endISO", label: "Término (data e hora com fuso)", hint: "Formato: 2026-11-27T18:30:00-03:00" },
  { path: "timeZone", label: "Fuso horário", hint: "Ex.: America/Sao_Paulo" },
  { path: "location", label: "Local (resumo do evento e seção Formato)" },
  { path: "locationShort", label: "Local curto (topo e resumo)" },
  { path: "contactEmail", label: "E-mail de contato", type: "email" },
  { path: "contactPhone", label: "Telefone / WhatsApp", hint: "Com DDD. Ex.: (84) 9 8847 2021" },
  { path: "formUrl", label: "URL do Google Forms", hint: "Cole a URL de incorporação. Vazio exibe o aviso de formulário em breve.", type: "url" },
  { path: "shareText", label: "Texto de compartilhamento (WhatsApp)", type: "textarea" },
  { path: "likesNamespace", label: "Namespace das curtidas (Abacus)", hint: "Use letras, números, hífen, ponto ou sublinhado. Troque se quiser começar a contagem do zero." }
];

const CONTENT_GROUPS = [
  {
    title: "SEO",
    fields: [
      { path: "seo.description", label: "Descrição para buscadores", type: "textarea" }
    ]
  },
  {
    title: "Identidade",
    fields: [
      { path: "brand.main", label: "Nome curto no topo e rodapé" },
      { path: "brand.sub", label: "Complemento do nome (topo e rodapé)" }
    ]
  },
  {
    title: "Chamada principal",
    fields: [
      { path: "hero.badge", label: "Selo de inscrições" },
      { path: "hero.titleStart", label: "Título — parte 1", hint: "Texto antes da palavra destacada." },
      { path: "hero.titleHighlight", label: "Título — destaque", hint: "Recebe o gradiente de cor." },
      { path: "hero.titleEnd", label: "Título — parte 3" },
      { path: "hero.lead", label: "Texto de apresentação", type: "textarea" },
      { path: "hero.ctaPrimary", label: "Botão principal" },
      { path: "hero.ctaCalendar", label: "Botão de calendário" },
      { path: "hero.cardTitle", label: "Título do cartão de resumo" },
      { path: "hero.cardAudience", label: "Público (cartão)" },
      { path: "hero.cardFormat", label: "Formato (cartão)" },
      { path: "hero.cardButton", label: "Botão do cartão" },
      { path: "hero.cardNote", label: "Observação do cartão" }
    ]
  },
  {
    title: "Sobre o evento",
    fields: [
      { path: "about.eyebrow", label: "Sobretítulo" },
      { path: "about.heading", label: "Título da seção" },
      { path: "about.lead", label: "Texto de apresentação", type: "textarea" },
      { path: "about.card1Title", label: "Cartão 1 — título" },
      { path: "about.card1Text", label: "Cartão 1 — texto", type: "textarea" },
      { path: "about.card2Title", label: "Cartão 2 — título" },
      { path: "about.card2Text", label: "Cartão 2 — texto", type: "textarea" },
      { path: "about.card3Title", label: "Cartão 3 — título" },
      { path: "about.card3Text", label: "Cartão 3 — texto", type: "textarea" }
    ]
  },
  {
    title: "Programação — introdução",
    fields: [
      { path: "schedule.eyebrow", label: "Sobretítulo" },
      { path: "schedule.heading", label: "Título da seção" },
      { path: "schedule.lead", label: "Texto de apresentação", type: "textarea" }
    ]
  },
  {
    title: "Programação — quarta-feira (25/11)",
    fields: [
      { path: "schedule.day1.label", label: "Etiqueta do dia" },
      { path: "schedule.day1.title", label: "Título do dia" },
      { path: "schedule.day1.session1.time", label: "Sessão 1 — horário" },
      { path: "schedule.day1.session1.title", label: "Sessão 1 — título" },
      { path: "schedule.day1.session1.format", label: "Sessão 1 — formato", hint: "Use Híbrido ou Online; a etiqueta muda de cor automaticamente." },
      { path: "schedule.day1.session2.time", label: "Sessão 2 — horário" },
      { path: "schedule.day1.session2.title", label: "Sessão 2 — título" },
      { path: "schedule.day1.session2.format", label: "Sessão 2 — formato" }
    ]
  },
  {
    title: "Programação — quinta-feira (26/11)",
    fields: [
      { path: "schedule.day2.label", label: "Etiqueta do dia" },
      { path: "schedule.day2.title", label: "Título do dia" },
      { path: "schedule.day2.session1.time", label: "Sessão 1 — horário" },
      { path: "schedule.day2.session1.title", label: "Sessão 1 — título" },
      { path: "schedule.day2.session1.details", label: "Minicursos", hint: "Um minicurso por linha, no formato Tema — Facilitador.", type: "textarea", rows: 5 },
      { path: "schedule.day2.session1.format", label: "Sessão 1 — formato" },
      { path: "schedule.day2.session2.time", label: "Sessão 2 — horário" },
      { path: "schedule.day2.session2.title", label: "Sessão 2 — título" },
      { path: "schedule.day2.session2.format", label: "Sessão 2 — formato" }
    ]
  },
  {
    title: "Programação — sexta-feira (27/11)",
    fields: [
      { path: "schedule.day3.label", label: "Etiqueta do dia" },
      { path: "schedule.day3.title", label: "Título do dia" },
      { path: "schedule.day3.session1.time", label: "Sessão 1 — horário" },
      { path: "schedule.day3.session1.title", label: "Sessão 1 — título" },
      { path: "schedule.day3.session1.format", label: "Sessão 1 — formato" },
      { path: "schedule.day3.session2.time", label: "Sessão 2 — horário" },
      { path: "schedule.day3.session2.title", label: "Sessão 2 — título" },
      { path: "schedule.day3.session2.format", label: "Sessão 2 — formato" }
    ]
  },
  {
    title: "Formato e participação",
    fields: [
      { path: "location.eyebrow", label: "Sobretítulo" },
      { path: "location.heading", label: "Título da seção" },
      { path: "location.cardText", label: "Texto do cartão", type: "textarea" },
      { path: "location.cardButton", label: "Botão do cartão" },
      { path: "location.tipsHeading", label: "Título da lista" },
      { path: "location.tip1", label: "Item 1" },
      { path: "location.tip2", label: "Item 2" },
      { path: "location.tip3", label: "Item 3" },
      { path: "location.tip4", label: "Item 4" },
      { path: "location.note", label: "Observação final" }
    ]
  },
  {
    title: "Inscrição",
    fields: [
      { path: "signup.eyebrow", label: "Sobretítulo" },
      { path: "signup.heading", label: "Título da seção" },
      { path: "signup.lead", label: "Texto de apresentação", type: "textarea" },
      { path: "signup.placeholderTitle", label: "Aviso de formulário em breve", type: "textarea" },
      { path: "signup.placeholderText", label: "Frase antes do e-mail" },
      { path: "signup.note", label: "Aviso de privacidade", type: "textarea" }
    ]
  },
  {
    title: "Dúvidas frequentes",
    fields: [
      { path: "faq.eyebrow", label: "Sobretítulo" },
      { path: "faq.heading", label: "Título da seção" },
      { path: "faq.q1", label: "Pergunta 1" },
      { path: "faq.a1", label: "Resposta 1", type: "textarea" },
      { path: "faq.q2", label: "Pergunta 2" },
      { path: "faq.a2", label: "Resposta 2", type: "textarea" },
      { path: "faq.q3", label: "Pergunta 3" },
      { path: "faq.a3", label: "Resposta 3", type: "textarea" },
      { path: "faq.q4", label: "Pergunta 4" },
      { path: "faq.a4", label: "Resposta 4", type: "textarea" }
    ]
  },
  {
    title: "Rodapé",
    fields: [
      { path: "footer.text", label: "Texto do rodapé", type: "textarea" },
      { path: "footer.credit", label: "Crédito de organização", type: "textarea" },
      { path: "footer.shareTitle", label: "Título de compartilhamento" },
      { path: "footer.whatsapp", label: "Botão WhatsApp" },
      { path: "footer.copy", label: "Botão copiar link" }
    ]
  },
  {
    title: "Bastidores",
    fields: [
      { path: "bastidores.eyebrow", label: "Sobretítulo" },
      { path: "bastidores.heading", label: "Título da página" },
      { path: "bastidores.lead", label: "Texto de apresentação", type: "textarea" },
      { path: "bastidores.emptyTitle", label: "Estado vazio — título" },
      { path: "bastidores.emptyText", label: "Estado vazio — texto", type: "textarea" },
      { path: "bastidores.seoDescription", label: "Descrição para buscadores", type: "textarea" }
    ]
  }
];

const form = document.getElementById("content-form");
const groupsContainer = document.getElementById("form-groups");
const statusElement = document.getElementById("status");
const warning = document.getElementById("config-warning");
const downloadButton = document.getElementById("download");
const previewButton = document.getElementById("preview");
const previewBastidoresButton = document.getElementById("preview-bastidores");
const discardButton = document.getElementById("discard");

let saveTimer;

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

function publishDraft(values) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    return true;
  } catch (error) {
    return false;
  }
}

function normalizeVideo(video) {
  return {
    url: String(video.url || ""),
    title: String(video.title || ""),
    guest: String(video.guest || ""),
    description: String(video.description || "")
  };
}

function baseValues() {
  const published = window.EVENT_SITE || {};
  const values = {
    config: { ...(published.config || {}) },
    content: { ...(published.content || {}) },
    videos: Array.isArray(published.videos) ? published.videos.map(normalizeVideo) : []
  };
  const draft = readDraft();
  if (draft) {
    values.config = { ...values.config, ...(draft.config || {}) };
    values.content = { ...values.content, ...(draft.content || {}) };
    if (Array.isArray(draft.videos)) values.videos = draft.videos.map(normalizeVideo);
  }
  return values;
}

function setStatus(message, kind) {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.classList.toggle("error", kind === "error");
  statusElement.classList.toggle("success", kind !== "error");
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => {
    statusElement.textContent = "";
    statusElement.classList.remove("error", "success");
  }, 4000);
}

function inputId(path) {
  return "field-" + path.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function createField(section, field, value) {
  const wrapper = document.createElement("div");
  wrapper.className = "field" + (field.type === "textarea" ? " wide" : "");

  const label = document.createElement("label");
  label.setAttribute("for", inputId(field.path));
  label.textContent = field.label;

  const control = document.createElement(field.type === "textarea" ? "textarea" : "input");
  control.id = inputId(field.path);
  control.dataset.path = field.path;
  control.dataset.section = section;
  control.value = value;
  if (field.type && field.type !== "textarea") control.type = field.type;
  if (field.type === "textarea") control.rows = field.rows || 3;

  wrapper.append(label, control);

  if (field.hint) {
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.textContent = field.hint;
    wrapper.append(hint);
  }

  return wrapper;
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

function collectVideos() {
  return Array.from(form.querySelectorAll("[data-video-index]")).map((card) => ({
    url: card.querySelector('[data-video-key="url"]').value.trim(),
    title: card.querySelector('[data-video-key="title"]').value.trim(),
    guest: card.querySelector('[data-video-key="guest"]').value.trim(),
    description: card.querySelector('[data-video-key="description"]').value.trim()
  }));
}

function createVideoInput(labelText, key, value, index, type, wide) {
  const wrapper = document.createElement("div");
  wrapper.className = "field" + (wide ? " wide" : "");

  const id = `video-${index}-${key}`;
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;

  const control = document.createElement(type === "textarea" ? "textarea" : "input");
  control.id = id;
  control.dataset.videoKey = key;
  control.value = value;
  if (type === "textarea") {
    control.rows = 3;
  } else {
    control.type = "text";
  }

  wrapper.append(label, control);
  return wrapper;
}

function renderVideos(videos) {
  const existing = document.getElementById("videos-fieldset");
  if (existing) existing.remove();

  const fieldset = document.createElement("fieldset");
  fieldset.id = "videos-fieldset";

  const legend = document.createElement("legend");
  legend.textContent = "Bastidores — vídeos";

  const hint = document.createElement("p");
  hint.className = "field-hint";
  hint.textContent = "Os vídeos aparecem na ordem abaixo. URL e título são obrigatórios; convidado e descrição são opcionais.";

  fieldset.append(legend, hint);

  if (!videos.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "video-edit-empty";
    emptyMessage.textContent = "Nenhum vídeo adicionado ainda.";
    fieldset.append(emptyMessage);
  }

  videos.forEach((video, index) => {
    const card = document.createElement("div");
    card.className = "video-edit";
    card.dataset.videoIndex = String(index);

    const head = document.createElement("div");
    head.className = "video-edit-head";

    const number = document.createElement("span");
    number.className = "video-edit-number";
    number.textContent = `Vídeo ${index + 1}`;

    const actions = document.createElement("div");
    actions.className = "video-edit-actions";

    const up = document.createElement("button");
    up.type = "button";
    up.className = "video-edit-btn";
    up.dataset.videoAction = "up";
    up.textContent = "↑";
    up.setAttribute("aria-label", `Mover vídeo ${index + 1} para cima`);
    up.disabled = index === 0;

    const down = document.createElement("button");
    down.type = "button";
    down.className = "video-edit-btn";
    down.dataset.videoAction = "down";
    down.textContent = "↓";
    down.setAttribute("aria-label", `Mover vídeo ${index + 1} para baixo`);
    down.disabled = index === videos.length - 1;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "video-edit-btn danger";
    remove.dataset.videoAction = "remove";
    remove.textContent = "Remover";
    remove.setAttribute("aria-label", `Remover vídeo ${index + 1}`);

    actions.append(up, down, remove);
    head.append(number, actions);

    const grid = document.createElement("div");
    grid.className = "fields";
    grid.append(
      createVideoInput("URL do YouTube", "url", video.url, index, "text", true),
      createVideoInput("Título", "title", video.title, index, "text", false),
      createVideoInput("Convidado (opcional)", "guest", video.guest, index, "text", false),
      createVideoInput("Descrição (opcional)", "description", video.description, index, "textarea", true)
    );

    card.append(head, grid);
    fieldset.append(card);
  });

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.id = "add-video";
  addButton.className = "admin-btn";
  addButton.textContent = "+ Adicionar vídeo";
  fieldset.append(addButton);

  groupsContainer.append(fieldset);
}

function addVideo() {
  const videos = collectVideos();
  videos.push({ url: "", title: "", guest: "", description: "" });
  renderVideos(videos);
  const cards = form.querySelectorAll("[data-video-index]");
  const lastCard = cards[cards.length - 1];
  if (lastCard) lastCard.querySelector('[data-video-key="url"]').focus();
  queueSave();
}

function removeVideo(index) {
  const videos = collectVideos();
  videos.splice(index, 1);
  renderVideos(videos);
  queueSave();
}

function moveVideo(index, direction) {
  const videos = collectVideos();
  const target = index + direction;
  if (target < 0 || target >= videos.length) return;
  [videos[index], videos[target]] = [videos[target], videos[index]];
  renderVideos(videos);
  const card = form.querySelector(`[data-video-index="${target}"]`);
  if (card) card.querySelector('[data-video-key="url"]').focus();
  queueSave();
}

function renderFields(values) {
  groupsContainer.replaceChildren();

  const configFieldset = document.createElement("fieldset");
  const configLegend = document.createElement("legend");
  configLegend.textContent = "Evento e publicação";
  configFieldset.append(configLegend);
  const configGrid = document.createElement("div");
  configGrid.className = "fields";
  CONFIG_FIELDS.forEach((field) => {
    configGrid.append(createField("config", field, values.config[field.path] || ""));
  });
  configFieldset.append(configGrid);
  groupsContainer.append(configFieldset);

  CONTENT_GROUPS.forEach((group) => {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = group.title;
    fieldset.append(legend);
    const grid = document.createElement("div");
    grid.className = "fields";
    group.fields.forEach((field) => {
      grid.append(createField("content", field, values.content[field.path] || ""));
    });
    fieldset.append(grid);
    groupsContainer.append(fieldset);
  });

  renderVideos(values.videos || []);
}

function collectValues() {
  const values = { config: {}, content: {}, videos: collectVideos() };
  form.querySelectorAll("[data-path]").forEach((control) => {
    values[control.dataset.section][control.dataset.path] = control.value;
  });
  return values;
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const saved = publishDraft(collectValues());
    setStatus(saved ? "Rascunho salvo neste navegador." : "Não foi possível salvar o rascunho.", saved ? "success" : "error");
  }, 400);
}

function buildFile(values) {
  const data = { config: {}, content: {}, videos: (values.videos || []).map(normalizeVideo) };
  CONFIG_FIELDS.forEach((field) => {
    data.config[field.path] = values.config[field.path] || "";
  });
  CONTENT_GROUPS.forEach((group) => {
    group.fields.forEach((field) => {
      data.content[field.path] = values.content[field.path] || "";
    });
  });

  const json = JSON.stringify(data, null, 2)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return `window.EVENT_SITE = ${json};\n`;
}

function validDates(values) {
  const start = new Date(values.config.startISO || "");
  const end = new Date(values.config.endISO || "");
  return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());
}

downloadButton.addEventListener("click", () => {
  const values = collectValues();

  const videos = values.videos
    .filter((video) => video.url || video.title || video.guest || video.description)
    .map(normalizeVideo);

  for (let index = 0; index < videos.length; index++) {
    if (!youtubeId(videos[index].url)) {
      setStatus(`Vídeo ${index + 1}: informe uma URL válida do YouTube.`, "error");
      return;
    }
    if (!videos[index].title) {
      setStatus(`Vídeo ${index + 1}: informe um título.`, "error");
      return;
    }
  }

  values.videos = videos;

  if (!validDates(values)) {
    setStatus("Verifique as datas de início e término (formato ISO com fuso).", "error");
    return;
  }

  publishDraft(values);

  const blob = new Blob([buildFile(values)], { type: "text/javascript;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "content.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);

  setStatus("content.js gerado. Substitua o arquivo no repositório.", "success");
});

previewButton.addEventListener("click", () => {
  const values = collectValues();
  if (!publishDraft(values)) {
    setStatus("Não foi possível salvar o rascunho para pré-visualizar.", "error");
    return;
  }
  window.open("index.html?preview=1", "_blank", "noopener");
});

if (previewBastidoresButton) {
  previewBastidoresButton.addEventListener("click", () => {
    const values = collectValues();
    if (!publishDraft(values)) {
      setStatus("Não foi possível salvar o rascunho para pré-visualizar.", "error");
      return;
    }
    window.open("bastidores.html?preview=1", "_blank", "noopener");
  });
}

discardButton.addEventListener("click", () => {
  if (!window.confirm("Descartar o rascunho salvo neste navegador?")) return;
  localStorage.removeItem(DRAFT_KEY);
  location.reload();
});

form.addEventListener("click", (event) => {
  if (event.target.closest("#add-video")) {
    addVideo();
    return;
  }

  const actionButton = event.target.closest("[data-video-action]");
  if (!actionButton) return;

  const card = actionButton.closest("[data-video-index]");
  if (!card) return;

  const index = Number(card.dataset.videoIndex);
  const action = actionButton.dataset.videoAction;

  if (action === "up") moveVideo(index, -1);
  else if (action === "down") moveVideo(index, 1);
  else if (action === "remove") removeVideo(index);
});

form.addEventListener("input", queueSave);
form.addEventListener("change", queueSave);
form.addEventListener("submit", (event) => event.preventDefault());

if (!window.EVENT_SITE && warning) warning.hidden = false;

const initialValues = baseValues();
renderFields(initialValues);

const hasDraft = Boolean(readDraft());
setStatus(hasDraft ? "Rascunho carregado deste navegador." : "Editando o conteúdo publicado.", "success");
