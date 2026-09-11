const DISCORD_USER_ID = "1393852466495356946";
const dot = document.getElementById("discordStatusDot");
const text = document.getElementById("discordStatusText");

const labels = { online: "Online", idle: "AFK", dnd: "Do Not Disturb", offline: "Offline" };

function setStatus(status) {
  const normalized = ["online","idle","dnd","offline"].includes(status) ? status : "offline";
  dot.className = `presence-dot status-${normalized}`;
  text.textContent = labels[normalized];
}

async function fetchPresence() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Lanyard request failed");
    const json = await response.json();
    setStatus(json?.data?.discord_status || "offline");
    return true;
  } catch (error) {
    setStatus("offline");
    return false;
  }
}

// Initial status + a lightweight fallback refresh.
fetchPresence();
setInterval(fetchPresence, 15000);

// Live Lanyard WebSocket: updates immediately when Discord presence changes.
let socket;
let heartbeat;
let reconnectTimer;

function connectLanyard() {
  clearTimeout(reconnectTimer);
  try {
    socket = new WebSocket("wss://api.lanyard.rest/socket");
  } catch { return; }

  socket.addEventListener("message", (event) => {
    let packet;
    try { packet = JSON.parse(event.data); } catch { return; }

    if (packet.op === 1) {
      const interval = packet.d?.heartbeat_interval || 30000;
      clearInterval(heartbeat);
      heartbeat = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 }));
      }, interval);
      socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
      return;
    }

    if (packet.op === 0 && packet.t === "INIT_STATE") {
      const presence = packet.d?.discord_status;
      if (presence) setStatus(presence);
      return;
    }

    if (packet.op === 0 && packet.t === "PRESENCE_UPDATE") {
      const presence = packet.d?.discord_status;
      if (presence) setStatus(presence);
    }
  });

  socket.addEventListener("close", () => {
    clearInterval(heartbeat);
    reconnectTimer = setTimeout(connectLanyard, 5000);
  });

  socket.addEventListener("error", () => {
    try { socket.close(); } catch {}
  });
}

connectLanyard();
