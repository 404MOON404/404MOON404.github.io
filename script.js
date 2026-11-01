const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());

/* ---------- Copy ---------- */
const labels = {
  es: {
    title: "Diego Alexis Becerra Murillo — Desarrollador de software",
    description: "Portafolio de Diego Alexis Becerra Murillo, desarrollador de software y estudiante de Ingeniería en Electrónica y Computación.",
    cv: "cv/Diego-Becerra-Murillo-CV-ES.pdf",
    downloadCv: "Descargar currículum en PDF",
    nav: "Navegación principal",
    language: "Seleccionar idioma",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    player: "Reproductor de música",
    playlist: "Lista de reproducción",
    previous: "Canción anterior",
    play: "Reproducir",
    pause: "Pausar",
    next: "Siguiente canción",
    progress: "Progreso de la canción",
    expand: "Abrir reproductor",
    collapse: "Cerrar reproductor",
    ready: "Listo para reproducir",
    playing: "Reproduciendo",
    paused: "En pausa",
    error: "No se pudo cargar la pista",
    newTab: "se abre en una pestaña nueva",
    tourVideo: "Recorrido del producto MelodyLog",
  },
  en: {
    title: "Diego Alexis Becerra Murillo — Software developer",
    description: "Portfolio of Diego Alexis Becerra Murillo, software developer and Electronics & Computing Engineering student.",
    cv: "cv/Diego-Becerra-Murillo-CV-EN.pdf",
    downloadCv: "Download CV as PDF",
    nav: "Main navigation",
    language: "Select language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    player: "Music player",
    playlist: "Playlist",
    previous: "Previous track",
    play: "Play",
    pause: "Pause",
    next: "Next track",
    progress: "Track progress",
    expand: "Open music player",
    collapse: "Close music player",
    ready: "Ready to play",
    playing: "Now playing",
    paused: "Paused",
    error: "Could not load the track",
    newTab: "opens in a new tab",
    tourVideo: "MelodyLog product walkthrough",
  },
};

const languageStorageKey = "moon404-language-v2";
let currentLanguage = "es";

try {
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  if (savedLanguage === "es" || savedLanguage === "en") currentLanguage = savedLanguage;
} catch {
  // The page still works in Spanish when storage is unavailable.
}

const languageButtons = $$("[data-language-choice]");
const languageGroup = $(".language-toggle");
const mainNav = $(".main-nav");
const header = $(".site-header");
const navWrap = $("#site-nav");
const menuToggle = $("#menu-toggle");

/* ---------- Mobile navigation ---------- */
const mobileQuery = window.matchMedia("(max-width: 900px)");

function setMenu(open) {
  const isMobile = mobileQuery.matches;
  const nextOpen = isMobile && open;
  if (!header || !menuToggle) return;
  header.dataset.navOpen = String(nextOpen);
  document.body.classList.toggle("nav-open", nextOpen);
  menuToggle.setAttribute("aria-expanded", String(nextOpen));
  menuToggle.setAttribute("aria-label", nextOpen ? labels[currentLanguage].closeMenu : labels[currentLanguage].openMenu);
  if (navWrap) navWrap.inert = isMobile && !nextOpen;
}

menuToggle?.addEventListener("click", () => {
  setMenu(header?.dataset.navOpen !== "true");
});

$$(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
  if (!header || header.dataset.navOpen !== "true") return;
  if (!header.contains(event.target)) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || header?.dataset.navOpen !== "true") return;
  setMenu(false);
  menuToggle?.focus();
});

mobileQuery.addEventListener("change", () => setMenu(false));

/* ---------- Language ---------- */
function updateExternalLabels() {
  const text = labels[currentLanguage];
  $$("[data-external]").forEach((link) => {
    link.removeAttribute("aria-label");
    let note = $("[data-external-note]", link);
    if (!note) {
      note = document.createElement("span");
      note.className = "sr-only";
      note.dataset.externalNote = "";
      link.append(note);
    }
    note.textContent = ` (${text.newTab})`;
  });
}

function updateCvLinks() {
  const text = labels[currentLanguage];
  $$("[data-cv-link]").forEach((link) => {
    link.href = text.cv;
    if (link.classList.contains("header-cv")) link.setAttribute("aria-label", `CV — ${text.downloadCv}`);
  });
}

function updateChromeLabels() {
  const text = labels[currentLanguage];
  if (mainNav) mainNav.setAttribute("aria-label", text.nav);
  if (languageGroup) languageGroup.setAttribute("aria-label", text.language);
  if (player) player.setAttribute("aria-label", text.player);
  if (playlistEl) playlistEl.setAttribute("aria-label", text.playlist);
  if (previousButton) previousButton.setAttribute("aria-label", text.previous);
  if (nextButton) nextButton.setAttribute("aria-label", text.next);
  if (progress) progress.setAttribute("aria-label", text.progress);
  const tourVideo = $("#melody-video");
  if (tourVideo) tourVideo.setAttribute("aria-label", text.tourVideo);
  if (playButton) playButton.setAttribute("aria-label", audio && !audio.paused ? text.pause : text.play);
  if (expandButton) {
    const open = player?.classList.contains("is-open");
    expandButton.setAttribute("aria-label", open ? text.collapse : text.expand);
  }
  const menuOpen = header?.dataset.navOpen === "true";
  menuToggle?.setAttribute("aria-label", menuOpen ? text.closeMenu : text.openMenu);
  updateCvLinks();
  updateExternalLabels();
  updatePlayerStatus();
}

function setLanguage(language, persist = true) {
  if (!labels[language]) return;
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = labels[language].title;

  const description = $('meta[name="description"]');
  if (description) description.content = labels[language].description;
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = labels[language].title;
  const ogDescription = $('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = labels[language].description;

  $$("[data-alt-es][data-alt-en]").forEach((image) => {
    image.alt = image.getAttribute(`data-alt-${language}`);
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.languageChoice === language));
  });

  updateChromeLabels();
  setMenu(header?.dataset.navOpen === "true");

  if (persist) {
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // The language remains selected for this page view.
    }
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.languageChoice));
});

/* ---------- Music player ---------- */
const player = $("#music-player");
const audio = $("#audio-engine");
const panel = $("#player-panel");
const playlistEl = $("#playlist");
const trackTitle = $("#track-title");
const trackArtist = $("#track-artist");
const playerStatus = $("#player-status");
const playButton = $("#toggle-play");
const playIcon = $("#play-icon");
const previousButton = $("#previous-track");
const nextButton = $("#next-track");
const expandButton = $("#player-expand");
const progress = $("#track-progress");
const currentTime = $("#current-time");
const duration = $("#duration");

const playlist = [
  { title: "you suck charlie", artist: "Joji", src: "music/joji - you suck charlie [z_8YxAGAKaU].mp3" },
  { title: "Will He", artist: "Joji", src: "music/Will He [vFX50m3bdw0].mp3" },
  { title: "TEST DRIVE", artist: "Joji", src: "music/Joji - TEST DRIVE [PEBS2jbZce4].mp3" },
  { title: "Horses to Water", artist: "Joji", src: "music/Joji - Horses to Water [RgIg6SBm1M0].mp3" },
  { title: "Champagne Shots", artist: "Sainté", src: "music/Champagne Shots [8Wkss0pd-pM].mp3" },
  { title: "Rumors", artist: "Ross Lynch", src: "music/Rumors [PWSGmimnwH4].mp3" },
  { title: "Lo Que Soy", artist: "Los Vaguens", src: "music/Lo Que Soy [crvBrrAf-RQ].mp3" },
];

let currentTrack = 0;

function updateMediaSession(track) {
  if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: "Diego Becerra — portfolio",
    });
  } catch {
    // Lock-screen metadata is a progressive enhancement.
  }
}

function setStatus(message) {
  if (playerStatus) playerStatus.textContent = message;
}

function updatePlayerStatus() {
  const text = labels[currentLanguage];
  if (!audio) return;
  if (audio.error) {
    setStatus(text.error);
    return;
  }
  if (!audio.paused) {
    setStatus(text.playing);
    return;
  }
  setStatus(audio.currentTime > 0 ? text.paused : text.ready);
}

function setPlayIcon(isPlaying) {
  if (playIcon) playIcon.setAttribute("href", isPlaying ? "#i-pause" : "#i-play");
  if (playButton) playButton.setAttribute("aria-label", isPlaying ? labels[currentLanguage].pause : labels[currentLanguage].play);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function updateTrack(index, autoplay = false) {
  if (!audio || playlist.length === 0) return;
  currentTrack = (index + playlist.length) % playlist.length;
  const track = playlist[currentTrack];

  audio.pause();
  audio.src = track.src;
  audio.load();

  if (trackTitle) trackTitle.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;
  updateMediaSession(track);
  if (progress) {
    progress.value = "0";
    progress.disabled = false;
  }
  if (currentTime) currentTime.textContent = "0:00";
  if (duration) duration.textContent = "0:00";
  player?.classList.remove("is-playing");
  setPlayIcon(false);
  setStatus(labels[currentLanguage].ready);

  $$("button[data-track-index]", playlistEl).forEach((button) => {
    button.setAttribute("aria-current", String(Number(button.dataset.trackIndex) === currentTrack));
  });

  if (playButton) playButton.disabled = false;
  if (previousButton) previousButton.disabled = false;
  if (nextButton) nextButton.disabled = false;

  if (autoplay) {
    audio.play().catch(() => {
      setStatus(labels[currentLanguage].ready);
      setPlayIcon(false);
      player?.classList.remove("is-playing");
    });
  }
}

function buildPlaylist() {
  if (!playlistEl) return;
  const fragment = document.createDocumentFragment();

  playlist.forEach((track, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.trackIndex = String(index);
    button.setAttribute("aria-label", `${track.title} — ${track.artist}`);

    const number = document.createElement("span");
    number.className = "track-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("span");
    copy.className = "track-copy";
    const name = document.createElement("span");
    name.className = "track-name";
    name.textContent = track.title;
    const artist = document.createElement("span");
    artist.className = "track-artist";
    artist.textContent = track.artist;
    copy.append(name, artist);

    const bars = document.createElement("span");
    bars.className = "playing-bars";
    bars.setAttribute("aria-hidden", "true");
    bars.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));

    button.append(number, copy, bars);
    button.addEventListener("click", () => updateTrack(index, true));
    item.append(button);
    fragment.append(item);
  });

  playlistEl.append(fragment);
}

function setPlayerOpen(open) {
  if (!player || !expandButton || !panel) return;
  player.classList.toggle("is-open", open);
  expandButton.setAttribute("aria-expanded", String(open));
  expandButton.setAttribute("aria-label", open ? labels[currentLanguage].collapse : labels[currentLanguage].expand);
  panel.inert = !open;
}

playButton?.addEventListener("click", () => {
  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(() => {
      setStatus(labels[currentLanguage].ready);
      setPlayIcon(false);
    });
  } else {
    audio.pause();
  }
});

previousButton?.addEventListener("click", () => {
  if (!audio) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  updateTrack(currentTrack - 1, true);
});

nextButton?.addEventListener("click", () => updateTrack(currentTrack + 1, true));

expandButton?.addEventListener("click", () => {
  setPlayerOpen(!player?.classList.contains("is-open"));
});

document.addEventListener("click", (event) => {
  if (!player?.classList.contains("is-open")) return;
  if (!player.contains(event.target)) setPlayerOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !player?.classList.contains("is-open")) return;
  setPlayerOpen(false);
  expandButton?.focus();
});

progress?.addEventListener("input", () => {
  if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

audio?.addEventListener("play", () => {
  player?.classList.add("is-playing");
  setPlayIcon(true);
  setStatus(labels[currentLanguage].playing);
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
});

audio?.addEventListener("pause", () => {
  player?.classList.remove("is-playing");
  setPlayIcon(false);
  updatePlayerStatus();
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
});

audio?.addEventListener("loadedmetadata", () => {
  if (duration) duration.textContent = formatTime(audio.duration);
});

audio?.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  if (progress) progress.value = String((audio.currentTime / audio.duration) * 100);
  if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
});

audio?.addEventListener("ended", () => updateTrack(currentTrack + 1, true));

audio?.addEventListener("error", () => {
  setStatus(labels[currentLanguage].error);
  setPlayIcon(false);
  player?.classList.remove("is-playing");
});

/* ---------- MelodyLog product film ---------- */
const promo = $("#melody-video");
const promoWindow = promo?.closest(".melody-window");

if (promo) {
  let promoSyncTimer = null;
  let promoUserPaused = false;
  let promoAutoPause = false;

  promo.muted = true;

  function promoInView() {
    const rect = promo.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visible > 0 && visible / Math.max(rect.height, 1) >= 0.35;
  }

  function pauseForVisibility() {
    if (promo.paused) return;
    promoAutoPause = true;
    promo.pause();
  }

  function syncPromo() {
    if (document.hidden || !promoInView()) {
      pauseForVisibility();
      return;
    }
    if (!promoUserPaused) promo.play().catch(() => {});
  }

  function queuePromo() {
    window.clearTimeout(promoSyncTimer);
    promoSyncTimer = window.setTimeout(syncPromo, 120);
  }

  promo.addEventListener("play", () => {
    promoAutoPause = false;
    promoUserPaused = false;
    promoWindow?.classList.add("is-running");
  });

  promo.addEventListener("pause", () => {
    if (promoAutoPause) promoAutoPause = false;
    else promoUserPaused = true;
    promoWindow?.classList.remove("is-running");
  });

  window.addEventListener("scroll", queuePromo, { passive: true });
  window.addEventListener("resize", queuePromo);
  window.addEventListener("load", queuePromo);
  window.setTimeout(syncPromo, 400);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseForVisibility();
    else syncPromo();
  });
}

/* ---------- Initial state ---------- */
buildPlaylist();
// The first track is prepared, never played automatically. Playback only
// starts from a click on the play button or a playlist item.
if (audio) audio.autoplay = false;
if (playlist.length > 0) updateTrack(0, false);
setPlayerOpen(false);
setLanguage(currentLanguage, false);
setMenu(false);

if ("mediaSession" in navigator) {
  const actions = {
    play: () => audio?.play().catch(() => {}),
    pause: () => audio?.pause(),
    previoustrack: () => updateTrack(currentTrack - 1, true),
    nexttrack: () => updateTrack(currentTrack + 1, true),
  };
  Object.entries(actions).forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Browsers expose different subsets of the Media Session API.
    }
  });
}
