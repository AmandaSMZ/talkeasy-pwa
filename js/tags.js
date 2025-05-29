const baseUrl = "http://localhost:8000";
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const tagsList = document.getElementById("tagsList");
const newTagBtn = document.getElementById("newTagBtn");
const backBtn = document.getElementById("backBtn");

backBtn.onclick = () => window.location.href = "home.html";

newTagBtn.onclick = () => window.location.href = "new-tag.html";

async function fetchTags() {
  try {
    const res = await fetch(`${baseUrl}/tags/available`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(!res.ok) throw new Error("Error cargando tags");
    const tags = await res.json();

    tagsList.innerHTML = "";
    tags.forEach(tag => {
      const btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.textContent = tag.name;
      btn.onclick = () => {
        window.location.href = `tag-detail.html?tagId=${tag.id}&tagName=${encodeURIComponent(tag.name)}`;
      };
      tagsList.appendChild(btn);
    });
  } catch(e) {
    alert(e.message);
  }
}

fetchTags();