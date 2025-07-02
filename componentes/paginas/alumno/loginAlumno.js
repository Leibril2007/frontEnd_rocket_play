document.getElementById("contenedor").innerHTML = `
  <div class="container">
    <h3>Elige tu avatar</h3>
    <div class="avatar-box" id="avatarBox" style="display:flex;flex-wrap:wrap;gap:5px;">
      ${["😀", "😇", "😅", "😂", "😎", "😠", "😡", "😲", "😴", "😢", "😤", "😷", "🥴", "🤓", "😕", "🤯", "😬", "🥵", "🥶", "🤠", "🤡", "🤥", "😑", "😶", "🙄", "😳", "😈", "👿", "👻", "👽"]
        .map(emoji => `<span>${emoji}</span>`)
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
    <div id="mensaje" style="margin-top:10px; font-weight:bold;"></div>
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
  // const mensajeDiv = document.getElementById("mensaje");
  // mensajeDiv.textContent = "";
  // mensajeDiv.style.color = "black";

  if (!usuario) {
    return; // no mostrar mensaje, solo no continuar
  }
  if (!codigo) {
    return;
  }
  if (!avatar) {
    return;
  }

  try {
    // Crear jugador
    const resPlayer = await fetch("http://localhost:3000/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, avatar }),
    });

    if (!resPlayer.ok) {
      // const errorData = await resPlayer.json();
      // throw new Error(errorData.message || "Error creando jugador");
      return; // sin mensajes
    }

    const dataPlayer = await resPlayer.json();
    const id_player = dataPlayer.id;

    // Añadir jugador a la partida
    const resJugadoresPartida = await fetch("http://localhost:3000/jugadores_partida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_player, codigo_partida: codigo }),
    });

    if (!resJugadoresPartida.ok) {
      // const errorData = await resJugadoresPartida.json();
      // throw new Error(errorData.message || "Error añadiendo jugador a la partida");
      return;
    }

    // Limpiar inputs y selección
    document.getElementById("usuario").value = "";
    document.getElementById("codigo").value = "";
    if (seleccionado) {
      seleccionado.classList.remove("selected");
      seleccionado = null;
    }
  } catch (error) {
    // No mostrar mensajes
  }
}

document.getElementById("btnListo").addEventListener("click", enviarDatos);
