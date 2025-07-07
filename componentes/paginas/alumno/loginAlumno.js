document.getElementById("contenedor").innerHTML = `
  <div class="container">
    <h3>Elige tu avatar</h3>
    <div class="avatar-box" id="avatarBox" style="display:flex;flex-wrap:wrap;gap:5px;">
      ${["😀", "😇", "😅", "😂", "😎", "😠", "😡", "😲", "😴", "😢", "😤", "😷", "🥴", "🤓", "😕", "🤯", "😬", "🥵", "🥶", "🤠", "🤡", "🤥", "😑", "😶", "🙄", "😳", "😈", "👿", "👻", "👽"]
        .map(emoji => `<span style="cursor:pointer;font-size:24px;">${emoji}</span>`)
        .join("")}
    </div>
    <div style="margin-top:10px;">
      <label for="usuario">Usuario</label><br/>
      <input type="text" id="usuario" placeholder="Tu nombre" />
    </div>
    <div style="margin-top:10px;">
      <label for="codigo">Código de partida</label><br/>
      <input type="text" id="codigo" placeholder="XXX" />
    </div>
    <button id="btnListo" style="margin-top:10px;">Listo</button>
    <div id="mensaje" style="margin-top:10px; font-weight:bold; color:red;"></div>
    <style>
      .selected {
        border: 2px solid blue;
        border-radius: 4px;
        padding: 2px;
        background-color: #e0f0ff;
      }
    </style>
  </div>
`;

const avatarBox = document.getElementById("avatarBox");
let seleccionado = null;

avatarBox.addEventListener("click", e => {
  if (e.target.tagName === "SPAN") {
    if (seleccionado) seleccionado.classList.remove("selected");
    e.target.classList.add("selected");
    seleccionado = e.target;
  }
});

async function enviarDatos() {
  const usuario = document.getElementById("usuario").value.trim();
  const codigo = document.getElementById("codigo").value.trim().replace(/["\\]/g, "");
  const avatar = seleccionado ? seleccionado.textContent : null;
  const mensajeDiv = document.getElementById("mensaje");

  mensajeDiv.textContent = "";

  if (!usuario) {
    mensajeDiv.textContent = "Por favor ingresa un nombre de usuario.";
    return false;
  }
  if (!codigo) {
    mensajeDiv.textContent = "Por favor ingresa un código de partida.";
    return false;
  }
  if (!avatar) {
    mensajeDiv.textContent = "Por favor selecciona un avatar.";
    return false;
  }

  try {
    const resPlayer = await fetch("http://localhost:3000/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, avatar }),
    });

    if (!resPlayer.ok) {
      mensajeDiv.textContent = "Error al crear el jugador.";
      return false;
    }

    const dataPlayer = await resPlayer.json();
    const id_player = dataPlayer.id;

    const resJugadoresPartida = await fetch("http://localhost:3000/jugadores_partida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_player, codigo_partida: codigo }),
    });

    if (!resJugadoresPartida.ok) {
      mensajeDiv.textContent = "Error al unirse a la partida. ¿El código es correcto?";
      return false;
    }

    // Limpiar inputs y selección
    document.getElementById("usuario").value = "";
    document.getElementById("codigo").value = "";
    if (seleccionado) {
      seleccionado.classList.remove("selected");
      seleccionado = null;
    }

    return true;

  } catch (error) {
    mensajeDiv.textContent = "Error de conexión con el servidor.";
    return false;
  }
}

document.getElementById("btnListo").addEventListener("click", async function () {
  const ok = await enviarDatos();
  if (ok) {
    const codigo = localStorage.getItem("codigoGen");

    if (!codigo) {
      console.error("❌ No se encontró el código en localStorage.");
      return;
    }

    console.log("📦 Código obtenido:", codigo);

    const intervalo = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3000/partidas/inicio?codigo=${encodeURIComponent(codigo)}`);
        const data = await response.json();

        console.log("🔍 Estado recibido:", data);

        // La condición corregida (estado es booleano, no string)
        if (data.success && data.estado === true) {
          clearInterval(intervalo);
          console.log("✅ Partida iniciada, redirigiendo...");
          window.location.href = "/componentes/juegos/simonDice/indexTrivia.html";
        }
      } catch (error) {
        console.error("🚨 Error al consultar estado de partida:", error);
      }
    }, 3000);
  }
});


