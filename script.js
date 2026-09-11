// Static site status: always shown as ONLINE as requested.
const dot = document.getElementById("discordDot");
const text = document.getElementById("discordText");
dot.className = "status-online";
text.textContent = "ONLINE";

// Background music. Browsers may block autoplay with sound until the first tap/click.
const music = document.getElementById("bgMusic");
let musicStarted = false;
async function startMusic(){
  if(musicStarted) return;
  try {
    await music.play();
    musicStarted = true;
    document.removeEventListener("pointerdown", startMusic);
    document.removeEventListener("keydown", startMusic);
  } catch (_) {}
}
// Try immediately; if the browser blocks it, the first user interaction starts it.
startMusic();
document.addEventListener("pointerdown", startMusic, {passive:true});
document.addEventListener("keydown", startMusic, {passive:true});
