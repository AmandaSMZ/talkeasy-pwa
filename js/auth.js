const baseUrl = "http://localhost:8000"; // Cambia a la URL de tu gateway API

// Mostrar y ocultar pantallas
const registro = document.getElementById("registro");
const login = document.getElementById("login");

document.getElementById("linkLogin").addEventListener("click", e => {
  e.preventDefault();
  registro.style.display = "none";
  login.style.display = "block";
});

document.getElementById("linkRegistro").addEventListener("click", e => {
  e.preventDefault();
  registro.style.display = "block";
  login.style.display = "none";
});

// Registro
document.getElementById("formRegistro").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("emailRegistro").value;
  const password = document.getElementById("passwordRegistro").value;

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });
    if (!response.ok) throw new Error("Error en el registro");
    alert("Registro exitoso, ya puedes iniciar sesión.");
    registro.style.display = "none";
    login.style.display = "block";
  } catch (error) {
    alert(error.message);
  }
});

// Inicio de sesión
document.getElementById("formLogin").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });
    if (!response.ok) throw new Error("Error en el inicio de sesión");
    const data = await response.json();
    // Suponiendo que el token está en data.token o data.access_token:
    localStorage.setItem("token", data.token || data.access_token);

    // Redirige a la página principal (home.html)
    window.location.href = "home.html";
  } catch (error) {
    alert(error.message);
  }
});