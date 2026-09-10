const btn = document.getElementById("soundBtn");
let audioCtx = null;
let muted = true;

btn.addEventListener("click", () => {
  muted = !muted;
  btn.textContent = muted ? "🔊" : "🔇";
  if (!muted) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = 220;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.2);
  }
});

document.querySelectorAll(".link").forEach(a => {
  a.addEventListener("click", e => {
    if (a.getAttribute("href") === "#") {
      e.preventDefault();
      alert("Edit this link in index.html and add your real profile URL.");
    }
  });
});
