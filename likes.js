(function () {
  const BASE_URL = "https://abacus.jasoncameron.dev";

  function sanitizeNamespace(value) {
    return String(value || "")
      .trim()
      .replace(/[^A-Za-z0-9_.-]/g, "-")
      .slice(0, 64);
  }

  window.createAbacusLikesClient = function (namespace) {
    const safeNamespace = sanitizeNamespace(namespace) || "uern-ii-mostra-compositores-rn";
    const keyFor = (videoId) => `video-${videoId}`;
    const endpoint = (action, videoId) =>
      `${BASE_URL}/${action}/${encodeURIComponent(safeNamespace)}/${encodeURIComponent(keyFor(videoId))}`;

    async function getCount(videoId) {
      const response = await fetch(endpoint("get", videoId), { cache: "no-store" });
      if (response.status === 404) return 0;
      if (!response.ok) throw new Error("Não foi possível obter as curtidas.");
      const data = await response.json();
      return Number(data.value) || 0;
    }

    async function fetchCounts(videoIds) {
      const uniqueIds = [...new Set((videoIds || []).filter(Boolean))];
      const counts = {};
      let failures = 0;

      for (const videoId of uniqueIds) {
        try {
          counts[videoId] = await getCount(videoId);
        } catch (error) {
          failures += 1;
        }
      }

      if (uniqueIds.length && failures === uniqueIds.length) {
        throw new Error("Curtidas indisponíveis no momento.");
      }

      uniqueIds.forEach((videoId) => {
        if (!(videoId in counts)) counts[videoId] = 0;
      });

      return counts;
    }

    async function like(videoId) {
      const response = await fetch(endpoint("hit", videoId), { cache: "no-store" });
      if (!response.ok) throw new Error("Não foi possível registrar a curtida.");
      const data = await response.json();
      return Number(data.value) || 0;
    }

    return { fetchCounts, like, namespace: safeNamespace };
  };
})();
