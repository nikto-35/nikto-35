const btn = document.getElementById("soundBtn");

// Add your Discord User ID here.
const DISCORD_USER_ID = "1393852466495356946";

function setDiscordStatus(status) {
  const dot = document.getElementById("discordStatusDot");
  const label = document.getElementById("discordStatusLabel");
  if (!dot || !label) return;
  dot.classList.remove("status-online","status-offline","status-idle","status-dnd");
  const map = {online:["status-online","ONLINE"],idle:["status-idle","AFK"],dnd:["status-dnd","DND"],offline:["status-offline","OFFLINE"]};
  const [cls,text] = map[status] || map.offline;
  dot.classList.add(cls); label.textContent = text;
}

async function updateDiscordStatus(){
  if (DISCORD_USER_ID === "YOUR_DISCORD_USER_ID") return;
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {cache:"no-store"});
    if (!res.ok) throw new Error();
    const json = await res.json();
    setDiscordStatus(json.data?.discord_status || "offline");
  } catch { setDiscordStatus("offline"); }
}
updateDiscordStatus();
setInterval(updateDiscordStatus,15000);
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
