import { headerProf } from "../headerProfe/headerProfe.js";

let codJuegoP = document.querySelector("#confJuegosP");
codJuegoP.appendChild(headerProf());

let estadoVar = "false";
let codGenerado = ""; // Almacena el código generado globalmente

// Función para generar código de juego aleatorio
function generarCodigoJuego() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

// Enviar la partida al backend al inicio
function enviarCodigoJuego(codigoRec, estRec) {

  console.log("codg", codGenerado, "est", estRec);

  fetch('http://localhost:3000/partidas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo: codigoRec, estado: estRec })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al guardar la partida');
      return response.json();
    })
    .then(data => {
      console.log('Partida guardada:', data);
    })
    .catch(error => console.error('Error al enviar partida:', error));
}

// Obtener jugadores
function obtenerJugadores(codigo) {
  fetch(`http://localhost:3000/jugadores_partida/${codigo}`)
    .then(response => {
      if (!response.ok) throw new Error('No se pudo obtener jugadores');
      return response.json();
    })
    .then(data => {
      if (data.success) {
        mostrarJugadores(data.jugadores);
      }
    })
    .catch(err => {
      console.error("Error al obtener jugadores:", err);
    });
}

// Mostrar jugadores en el DOM
function mostrarJugadores(jugadores) {
  const baseCadJug = document.querySelector(".base-cad-jug");
  if (!baseCadJug) return;
  baseCadJug.innerHTML = "";

  jugadores.forEach((jugador, index) => {
    let pNomUsuarioP = document.createElement('p');
    pNomUsuarioP.className = "p-nom-usuario-p";
    pNomUsuarioP.textContent = `${index + 1}. ${jugador.name}`;
    baseCadJug.appendChild(pNomUsuarioP);

    let avUsuP = document.createElement('span');
    avUsuP.className = "av-usu-p";
    avUsuP.textContent = jugador.avatar;
    baseCadJug.appendChild(avUsuP);
  });
}

// Crear toda la sección de la partida
function cargarCodigoJuego() {
  let secCodP = document.createElement('section');
  secCodP.className = "secConfProf";

  let prtCreadaP = document.createElement('h2');
  prtCreadaP.className = "prt-creada-p";
  prtCreadaP.textContent = "Partida Creada";
  secCodP.appendChild(prtCreadaP);

  codGenerado = generarCodigoJuego();

  let codGP = document.createElement('p');
  codGP.className = "cod-g-p";
  codGP.textContent = codGenerado;
  secCodP.appendChild(codGP);

  let titJugP = document.createElement('h3');
  titJugP.className = "prt-creada-p tit-jug-p";
  titJugP.textContent = "Jugadores";
  secCodP.appendChild(titJugP);

  let baseCadJug = document.createElement('div');
  baseCadJug.className = "base-cad-jug";
  secCodP.appendChild(baseCadJug);

  let btnInJuegP = document.createElement('button');
  btnInJuegP.className = "btn-in-jueg-p";
  btnInJuegP.textContent = "Iniciar Juego";

  localStorage.setItem("codigoGen", codGenerado);

  btnInJuegP.addEventListener('click', function () {
    if (estadoVar === "false") {
      estadoVar = "true";
      fetch(`http://localhost:3000/partidasEstadoCambio/${codGenerado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: estadoVar })
      })

      alert("se cambio estado");

    }
  });

  secCodP.appendChild(btnInJuegP);

  return secCodP;
}

// Ejecuta al cargar pantalla
codJuegoP.appendChild(cargarCodigoJuego());
enviarCodigoJuego(codGenerado, estadoVar); // Se envía la partida automáticamente

// Polling para actualizar lista de jugadores cada 5 segundos
setInterval(() => {
  if (codGenerado) {
    obtenerJugadores(codGenerado);
  }
}, 5000);
