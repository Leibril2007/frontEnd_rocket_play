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
    const resPlayer = await fetch("https://backend-rocket-k6wn.onrender.com/players", {
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

    const resJugadoresPartida = await fetch("https://backend-rocket-k6wn.onrender.com/jugadores_partida", {
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

  if (!ok) return;

  let codigo = null;

  try {
    const resJugadores = await fetch('https://backend-rocket-k6wn.onrender.com/jugadores_partidas');
    const dataJugadores = await resJugadores.json();

    if (dataJugadores.success && Array.isArray(dataJugadores.jugadores_partidas)) {
      const lista = dataJugadores.jugadores_partidas;
      const ultimoRegistro = lista[lista.length - 1];
      codigo = ultimoRegistro.codigo || ultimoRegistro.codigo_partida;

      if (!codigo) {
        console.error("❌ No se encontró el código en el último registro.");
        alert("No se pudo obtener el código de la partida.");
        return;
      }

      console.log("📦 Código obtenido desde jugadores_partidas:", codigo);
    } else {
      console.error("❌ Formato inesperado al obtener jugadores_partidas.");
      return;
    }
  } catch (err) {
    console.error("❌ Error al obtener jugadores_partidas:", err);
    return;
  }

  const intervalo = setInterval(async () => {
    try {
      const response = await fetch(`https://backend-rocket-k6wn.onrender.com/partidas/inicio?codigo=${encodeURIComponent(codigo)}`);
      const data = await response.json();

      console.log("Estado recibido:", data);

      if (data.success && data.estado === true) {
        clearInterval(intervalo);
        console.log("Partida iniciada, consultando juego...");

        const resJuego = await fetch(`https://backend-rocket-k6wn.onrender.com/partidas/juegoPorProfe/${codigo}`);
        const dataJuego = await resJuego.json();

        if (dataJuego.success) {
          const juego = dataJuego.juego;
          const niveles = dataJuego.niveles;
          const tiempo = dataJuego.tiempo;

          let nivelesArray;
          if (typeof niveles === "string") {
            nivelesArray = niveles.split(",").map(n => Number(n.trim()));
          } else if (Array.isArray(niveles)) {
            nivelesArray = niveles;
          } else {
            nivelesArray = [];
          }

          if (!Array.isArray(nivelesArray) || nivelesArray.length === 0) {
            console.error("❌ Niveles inválidos:", niveles);
            alert("Ocurrió un error con los niveles del juego.");
            return;
          }

          if (typeof tiempo !== "number" || tiempo <= 0) {
            console.error("❌ Tiempo inválido:", tiempo);
            alert("Ocurrió un error con el tiempo configurado.");
            return;
          }

          localStorage.setItem("juegoBd", juego);
          localStorage.setItem("nivelesBd", JSON.stringify(nivelesArray));
          localStorage.setItem("tiempoBd", JSON.stringify(tiempo));
          localStorage.setItem("codigoBd", codigo); // (opcional)

          console.log("✅ Datos guardados:", {
            juego, niveles: nivelesArray, tiempo, codigo
          });

          const rutasJuegos = {
            "EcoTrivia": "/componentes/juegos/ecoTrivia/index.html",
            "Trivia": "/componentes/juegos/simonDice/indexTrivia.html",
            "Emoji Game": "/componentes/juegos/emojis/nivel1/nivel1.html",
            "Laberinto": "/componentes/juegos/laberinto/index.html"
          };

          const ruta = rutasJuegos[juego];

          if (ruta) {
            console.log("Redirigiendo a:", ruta);
            window.location.href = ruta;
          } else {
            alert("No se encontró la ruta del juego: " + juego);
          }
        } else {
          alert("No se pudo obtener el juego de la partida.");
        }
      }
    } catch (error) {
      console.error("❌ Error al consultar estado de la partida:", error);
    }
  }, 3000);
});



