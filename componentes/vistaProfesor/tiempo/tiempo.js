// Crear contenedor
const contenedor = document.createElement('div');
contenedor.className = 'ventana-info';

// Crear elementos de texto
const tiempoTexto = document.createElement('p');
tiempoTexto.innerHTML = '⏱️ Tiempo: <span id="tiempo">0</span> segundos';

const nivelTexto = document.createElement('p');
nivelTexto.innerHTML = '🎮 Nivel: <span id="nivel">1</span>';

// Añadir al contenedor principal
contenedor.appendChild(tiempoTexto);
contenedor.appendChild(nivelTexto);

document.body.appendChild(contenedor);

// Crear sección de jugadores aparte
const seccionJugadores = document.createElement('section');
seccionJugadores.className = 'seccion-jugadores';

const tituloJugadores = document.createElement('h3');
tituloJugadores.textContent = 'Jugadores';
seccionJugadores.appendChild(tituloJugadores);

const apartadoProceso = document.createElement('div');
apartadoProceso.className = 'apartado-jugadores proceso';
const tituloProceso = document.createElement('h4');
tituloProceso.textContent = 'En proceso';
apartadoProceso.appendChild(tituloProceso);
const listaProceso = document.createElement('div');
listaProceso.id = 'lista-proceso';
apartadoProceso.appendChild(listaProceso);

const apartadoFinalizado = document.createElement('div');
apartadoFinalizado.className = 'apartado-jugadores finalizado';
const tituloFinalizado = document.createElement('h4');
tituloFinalizado.textContent = 'Finalizado';
apartadoFinalizado.appendChild(tituloFinalizado);
const listaFinalizado = document.createElement('div');
listaFinalizado.id = 'lista-finalizado';
apartadoFinalizado.appendChild(listaFinalizado);

seccionJugadores.appendChild(apartadoProceso);
seccionJugadores.appendChild(apartadoFinalizado);

document.body.appendChild(seccionJugadores);

// Obtener referencias a los elementos
const tiempoElem = document.getElementById("tiempo");
const nivelElem = document.getElementById("nivel");
const listaJugadoresElem = document.getElementById("lista-jugadores");

// Leer tiempo y niveles desde localStorage
let tiempoSeleccionado = parseInt(localStorage.getItem("timeSel"), 10) || 0;
const nivelesSeleccionados = localStorage.getItem("nivSel")
  ? localStorage.getItem("nivSel").split(",").map(Number)
  : [1];

tiempoElem.textContent = tiempoSeleccionado;
nivelElem.textContent = nivelesSeleccionados[0];

// Cuenta regresiva en tiempo real
let tiempoRestante = tiempoSeleccionado;
let cuentaActiva = false;

function iniciarCuentaRegresiva() {
  if (cuentaActiva) return;
  cuentaActiva = true;
  tiempoRestante = parseInt(localStorage.getItem("timeSel"), 10) || 0;
  tiempoElem.textContent = tiempoRestante;
  const interval = setInterval(() => {
    if (tiempoRestante > 0) {
      tiempoRestante--;
      tiempoElem.textContent = tiempoRestante;
    } else {
      clearInterval(interval);
      cuentaActiva = false;
    }
  }, 1000);
}

// Escuchar cambios en localStorage para reiniciar la cuenta si cambia el tiempo
window.addEventListener('storage', (event) => {
  if (event.key === 'timeSel') {
    tiempoSeleccionado = parseInt(event.newValue, 10) || 0;
    tiempoRestante = tiempoSeleccionado;
    tiempoElem.textContent = tiempoRestante;
    cuentaActiva = false;
    iniciarCuentaRegresiva();
  }
  if (event.key === 'nivSel') {
    const niveles = event.newValue ? event.newValue.split(",").map(Number) : [1];
    nivelElem.textContent = niveles[0];
  }
});

// Función para obtener y mostrar jugadores y su estado en dos apartados
function actualizarJugadores() {
  const codigo = localStorage.getItem("codigoGen");
  if (!codigo) return;
  fetch(`https://backend-rocket-k6wn.onrender.com/jugadores_partida/${codigo}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.jugadores)) {
        listaProceso.innerHTML = "";
        listaFinalizado.innerHTML = "";
        data.jugadores.forEach(jugador => {
          const div = document.createElement('div');
          div.className = 'jugador-item';
          div.innerHTML = `
            <span>${jugador.name}</span>
            <span style="margin-left:10px;">${jugador.avatar || ''}</span>
          `;
          if (jugador.terminado) {
            div.innerHTML += '<span style="margin-left:10px; font-weight:bold; color:#4caf50;">✅</span>';
            listaFinalizado.appendChild(div);
          } else {
            div.innerHTML += '<span style="margin-left:10px; font-weight:bold; color:#ffeb3b;">⏳</span>';
            listaProceso.appendChild(div);
          }
        });
      }
    })
    .catch(err => {
      listaProceso.innerHTML = '<span style="color:red">Error al obtener jugadores</span>';
      listaFinalizado.innerHTML = '';
    });
}

// Actualizar jugadores cada 5 segundos
globalThis._intervalJugadores = setInterval(actualizarJugadores, 5000);
actualizarJugadores();

// Iniciar cuenta regresiva al cargar
iniciarCuentaRegresiva();