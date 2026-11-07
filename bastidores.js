(function () {
  const {
    config: CONFIG,
    content: CONTENT,
    videos: RAW_VIDEOS,
    applyContent,
    applyEventData,
    applyMeta,
    youtubeId
  } = window.Site;

  const namespace =
    String(CONFIG.likesNamespace || "")
      .trim()
      .replace(/[^A-Za-z0-9_.-]/g, "-")
      .slice(0, 64) || "uern-ii-mostra-compositores-rn";
  const LIKED_KEY = `eventSiteLikedVideos:${namespace}`;
  const COUNTS_KEY = `eventSiteLikeCounts:${namespace}`;
  const countFormatter = new Intl.NumberFormat("pt-BR");
  const likeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  const playIcon = '<span class="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7-11-7Z"/></svg></span>';

  applyContent();
  applyEventData();
  applyMeta(`Bastidores — ${CONFIG.eventName}`, CONTENT["bastidores.seoDescription"]);

  const list = document.getElementById("video-list");
  const empty = document.getElementById("videos-empty");
  const note = document.getElementById("likes-note");

  if (!list || !empty) return;

  function readLiked() {
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (error) {
      return {};
    }
  }

  function readCountsCache() {
    try {
      const raw = localStorage.getItem(COUNTS_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (error) {
      return {};
    }
  }

  const cachedCounts = readCountsCache();

  const items = (Array.isArray(RAW_VIDEOS) ? RAW_VIDEOS : [])
    .map((video) => ({
      id: youtubeId(video.url),
      title: String(video.title || "").trim(),
      guest: String(video.guest || "").trim(),
      description: String(video.description || "").trim()
    }))
    .filter((video) => video.id)
    .map((video) => ({
      ...video,
      title: video.title || "Vídeo da II Mostra",
      count: Number(cachedCounts[video.id]) || 0,
      busy: false
    }));

  let noteTimer;
  let client = null;

  function showNote(message, isError, autoHide) {
    if (!note) return;
    note.textContent = message;
    note.classList.toggle("is-error", Boolean(isError));
    note.hidden = false;
    clearTimeout(noteTimer);
    if (autoHide) {
      noteTimer = setTimeout(() => {
        note.hidden = true;
        note.classList.remove("is-error");
      }, 6000);
    }
  }

  function hideNote() {
    if (!note) return;
    note.hidden = true;
    note.classList.remove("is-error");
  }

  function isLiked(id) {
    return Boolean(readLiked()[id]);
  }

  function markLiked(id) {
    const map = readLiked();
    map[id] = 1;
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(map));
    } catch (error) {
      return;
    }
  }

  function cacheCounts(counts) {
    const cache = readCountsCache();
    Object.entries(counts || {}).forEach(([id, count]) => {
      cache[id] = Number(count) || 0;
    });
    try {
      localStorage.setItem(COUNTS_KEY, JSON.stringify(cache));
    } catch (error) {
      return;
    }
  }

  function updateLikeUI(item) {
    if (!item.likeBtn) return;
    const liked = isLiked(item.id);
    item.countEl.textContent = countFormatter.format(item.count);
    item.likeBtn.setAttribute("aria-pressed", String(liked));
    item.likeBtn.setAttribute(
      "aria-label",
      liked ? `Você curtiu o vídeo: ${item.title}` : `Curtir vídeo: ${item.title}`
    );
    item.likeBtn.disabled = !client || liked || item.busy;
  }

  function showPlayer(item) {
    if (!item.player || item.player.querySelector("iframe")) return;
    const iframe = document.createElement("iframe");
    iframe.className = "video-embed";
    iframe.src = `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = item.title;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    item.player.replaceChildren(iframe);
    iframe.focus();
  }

  function createFacade(item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "video-facade";
    button.setAttribute("aria-label", `Assistir: ${item.title}`);
    button.innerHTML = `<img loading="lazy" src="https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg" alt="" />${playIcon}`;

    const image = button.querySelector("img");
    image.addEventListener("error", () => {
      if (!image.dataset.fallback) {
        image.dataset.fallback = "1";
        image.src = `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
      } else {
        image.remove();
      }
    });

    button.addEventListener("click", () => showPlayer(item));
    return button;
  }

  function createCard(item) {
    const card = document.createElement("article");
    card.className = "video-card";

    const player = document.createElement("div");
    player.className = "video-player";
    player.append(createFacade(item));
    item.player = player;

    const body = document.createElement("div");
    body.className = "video-body";

    const title = document.createElement("h2");
    title.className = "video-title";
    title.textContent = item.title;
    body.append(title);

    if (item.guest) {
      const guest = document.createElement("p");
      guest.className = "video-guest";
      guest.textContent = `Convidado: ${item.guest}`;
      body.append(guest);
    }

    if (item.description) {
      const description = document.createElement("p");
      description.className = "video-description";
      description.textContent = item.description;
      body.append(description);
    }

    const actions = document.createElement("div");
    actions.className = "video-actions";

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = "like-button";
    likeButton.disabled = true;
    likeButton.setAttribute("aria-pressed", "false");
    likeButton.setAttribute("aria-label", `Curtir vídeo: ${item.title}`);
    likeButton.innerHTML = `${likeIcon}<span class="like-count">0</span>`;
    likeButton.addEventListener("click", () => likeVideo(item));

    item.likeBtn = likeButton;
    item.countEl = likeButton.querySelector(".like-count");

    actions.append(likeButton);
    body.append(actions);
    card.append(player, body);

    updateLikeUI(item);
    return card;
  }

  async function likeVideo(item) {
    if (!client || item.busy || isLiked(item.id)) return;

    const countBefore = item.count;
    item.busy = true;
    item.count = countBefore + 1;
    updateLikeUI(item);

    try {
      const serverCount = await client.like(item.id);
      item.count = serverCount;
      markLiked(item.id);
      cacheCounts({ [item.id]: serverCount });
      hideNote();
    } catch (error) {
      item.count = countBefore;
      showNote("Não foi possível registrar sua curtida. Tente novamente.", true, true);
    } finally {
      item.busy = false;
      updateLikeUI(item);
    }
  }

  async function refreshCounts() {
    if (!client || !items.length) return;
    try {
      const counts = await client.fetchCounts(items.map((item) => item.id));
      items.forEach((item) => {
        if (!(item.id in counts)) return;
        item.count = counts[item.id];
        updateLikeUI(item);
      });
      cacheCounts(counts);
    } catch (error) {
      showNote("Não foi possível atualizar as curtidas agora.", true, true);
    }
  }

  async function initLikes() {
    if (!items.length) {
      if (note) note.hidden = true;
      return;
    }

    const factory = window.createAbacusLikesClient;
    if (typeof factory !== "function") {
      showNote("Curtidas indisponíveis no momento.");
      return;
    }

    try {
      client = factory(namespace);
      const counts = await client.fetchCounts(items.map((item) => item.id));
      items.forEach((item) => {
        if (!(item.id in counts)) return;
        item.count = counts[item.id];
        updateLikeUI(item);
      });
      cacheCounts(counts);
      items.forEach(updateLikeUI);
      hideNote();
    } catch (error) {
      client = null;
      showNote("Curtidas indisponíveis no momento.");
      items.forEach(updateLikeUI);
      return;
    }

    let lastRefresh = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastRefresh < 15000) return;
      lastRefresh = Date.now();
      refreshCounts();
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== LIKED_KEY) return;
      items.forEach(updateLikeUI);
    });
  }

  items.forEach((item) => list.append(createCard(item)));
  empty.hidden = items.length > 0;

  initLikes();
})();
