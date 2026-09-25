const audio = document.getElementById("calmAudio");
const heroPlay = document.getElementById("heroPlay");
const playerPlay = document.getElementById("playerPlay");
const seek = document.getElementById("seek");
const currentTime = document.getElementById("currentTime");
const volumeBtn = document.getElementById("volumeBtn");

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const togglePlay = () => {
  if (!audio) return;

  if (audio.paused) {
    audio.play().catch(() => {
      alert("Agregá tu archivo 'assets/audio-calma.mp3' para activar el reproductor.");
    });
  } else {
    audio.pause();
  }
};

heroPlay?.addEventListener("click", togglePlay);
playerPlay?.addEventListener("click", togglePlay);

audio?.addEventListener("play", () => {
  heroPlay?.querySelector(".play-circle")?.replaceChildren(document.createTextNode("❚❚"));
  if (playerPlay) playerPlay.textContent = "❚❚";
});

audio?.addEventListener("pause", () => {
  heroPlay?.querySelector(".play-circle")?.replaceChildren(document.createTextNode("▶"));
  if (playerPlay) playerPlay.textContent = "▶";
});

audio?.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  seek.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio?.addEventListener("loadedmetadata", () => {
  currentTime.textContent = "0:00";
});

seek?.addEventListener("input", () => {
  if (!audio?.duration) return;
  audio.currentTime = (Number(seek.value) / 100) * audio.duration;
});

volumeBtn?.addEventListener("click", () => {
  if (!audio) return;
  audio.muted = !audio.muted;
  volumeBtn.textContent = audio.muted ? "🔇" : "◖)))";
});

audio?.addEventListener("ended", () => {
  seek.value = 0;
  currentTime.textContent = "0:00";
});
