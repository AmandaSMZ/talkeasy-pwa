const baseUrl = "http://localhost:8000";
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const newTagForm = document.getElementById("newTagForm");
const backBtn = document.getElementById("backBtn");

backBtn.onclick = () => window.location.href = "tags.html";