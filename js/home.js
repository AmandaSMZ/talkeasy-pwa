const baseUrl = "http://localhost:8000"; 

const token = localStorage.getItem("token");
if (!token) {
  // Si no hay token, va a login
  window.location.href = "index.html";
}

const usernameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");
const conversationsList = document.getElementById("conversationsList");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Función para obtener info del usuario actual (opcional)
async function fetchCurrentUser() {
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("No autorizado");
    const user = await res.json();
    usernameEl.textContent = user.email || "Usuario";
  } catch {
    // Si falla, limpia token y redirige
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

// Función para obtener conversaciones
async function fetchConversations() {
  try {
    const res = await fetch(`${baseUrl}/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error cargando conversaciones");
    const conversations = await res.json();

    conversationsList.innerHTML = "";  // limpiar

    conversations.forEach(conv => {
      // Suponiendo conv tiene user1_id y user2_id, por ejemplo
      // Ajusta según la estructura real de datos
      const otherUser = conv.user1_id === tokenUserId ? conv.user2_id : conv.user1_id;
      
      const a = document.createElement("a");
      a.href = `chat.html?user=${otherUser}`;
      a.className = "list-group-item list-group-item-action";
      a.textContent = `Usuario: ${otherUser}`; // Puedes poner nombre si lo tienes
      conversationsList.appendChild(a);
    });
  } catch (error) {
    alert(error.message);
  }
}

// Extraer userId del token para lógica (decodifica JWT)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const tokenPayload = parseJwt(token);
const tokenUserId = tokenPayload ? tokenPayload.sub : null;

// Inicialización
fetchCurrentUser();
fetchConversations();