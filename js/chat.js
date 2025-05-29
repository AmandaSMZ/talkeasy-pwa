const baseUrl = "http://localhost:8000";
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

const urlParams = new URLSearchParams(window.location.search);
const withUserId = urlParams.get("user");
if (!withUserId) {
  alert("Usuario no especificado");
  window.location.href = "home.html";
}

const chatWithEl = document.getElementById("chatWith");
const chatMessagesEl = document.getElementById("chatMessages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const backBtn = document.getElementById("backBtn");

chatWithEl.textContent = `Chat con Usuario ${withUserId}`;

backBtn.addEventListener("click", () => {
  window.location.href = "home.html";
});

// Función para añadir mensaje a la lista
function addMessage(text, isSent) {
  const div = document.createElement("div");
  div.textContent = text;
  div.className = isSent ? "message-sent" : "message-received";
  chatMessagesEl.appendChild(div);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Obtener mensajes previos
async function fetchChat() {
  try {
    const res = await fetch(`${baseUrl}/messages/chat/${withUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error cargando chat");
    const messages = await res.json();
    chatMessagesEl.innerHTML = "";
    messages.forEach(msg => {
      const isSent = msg.from_user_id === getCurrentUserId();
      addMessage(msg.text, isSent);
    });
  } catch (e) {
    alert(e.message);
  }
}

// Extraer userId actual del token
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => ("%"+ ("00" + c.charCodeAt(0).toString(16)).slice(-2)))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
function getCurrentUserId() {
  const payload = parseJwt(token);
  return payload ? payload.sub : null;
}

// Enviar mensaje
messageForm.addEventListener("submit", async e => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const messagePayload = {
    text,
    to_user_id: withUserId,
    from_user_tags: [],  // Puedes agregar tags si quieres
    to_user_tags: []
  };

  try {
    const res = await fetch(`${baseUrl}/messages/send`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(messagePayload)
    });
    if (!res.ok) throw new Error("Error al enviar mensaje");
    messageInput.value = "";
    addMessage(text, true);
  } catch (e) {
    alert(e.message);
  }
});

// Conexión WebSocket para mensajes en tiempo real
function connectWebSocket() {
  const wsUrl = `wss://tu-gateway-api.com/ws?token=${token}`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        const msg = data.message;
        // Solo añadir si es del usuario con quien chateamos
        if (msg.from_user_id === withUserId || msg.to_user_id === withUserId) {
          const isSent = msg.from_user_id === getCurrentUserId();
          addMessage(msg.text, isSent);
        }
      }
    } catch {}
  };

  socket.onclose = () => {
    console.log("WebSocket cerrado, reconectando en 5s...");
    setTimeout(connectWebSocket, 5000);
  };

  socket.onerror = err => {
    console.error("Error WebSocket:", err);
    socket.close();
  };
}

fetchChat();
connectWebSocket();