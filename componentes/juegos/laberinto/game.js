const mazeContainer = document.getElementById("mazeContainer");
const info = document.getElementById("info");
const nivelLabel = document.getElementById("nivelLabel");

let timerInterval;

// Obtener niveles y tiempo de localStorage
let nivelesSeleccionados = [];
const nivelesRaw = localStorage.getItem("nivelesBd");

if (nivelesRaw) {
  try {
    let arr;
    if (nivelesRaw.startsWith("[")) {
      arr = JSON.parse(nivelesRaw);
    } else {
      arr = nivelesRaw.split(',').map(n => {
        const num = parseInt(n.trim());
        return isNaN(num) ? 1 : Math.max(1, Math.min(num, 10)); // Asegura que esté entre 1 y 10
      });
    }
    nivelesSeleccionados = [...new Set(arr.filter(n => !isNaN(n) && n > 0 && n <= 10))]; // Elimina duplicados
    if (nivelesSeleccionados.length === 0) nivelesSeleccionados = [1];
  } catch (e) {
    console.warn("Error al leer nivelesBd", e);
    nivelesSeleccionados = [1];
  }
} else {
  nivelesSeleccionados = [1];
}

// Obtener tiempo de localStorage
let timeSel = 0;
const tiempoRaw = localStorage.getItem("tiempoBd");
if (tiempoRaw) {
  try {
    timeSel = parseInt(JSON.parse(tiempoRaw));
    if (isNaN(timeSel) || timeSel <= 0) timeSel = 0;
  } catch (e) {
    console.warn("Error al leer tiempoBd", e);
    timeSel = 0;
  }
}

let nivelActualIndex = 0;
let level = nivelesSeleccionados[nivelActualIndex];
let playerPos = { x: 0, y: 0 };
let totalMoves = 0;
let startTime = Date.now();
let vidas = 3;
let resultados = [];
let tiempoTotal = 0;
let posicionFinalRanking = ""; // 🏅 Guarda posición para mostrar y descargar


const mazes = [
  // Nivel 1 (5x5)
  [
    [0,1,0,0,0],
    [0,1,0,1,0],
    [0,0,0,1,0],
    [1,1,0,1,0],
    [0,0,0,0,0],  // Removida la trampa del camino principal
  ],
  // Nivel 2 (5x5)
  [
    [0,0,1,0,0],
    [1,0,1,1,2],  // Trampa movida al final de un camino falso (1,4)
    [1,0,0,0,0],
    [1,1,1,1,0],  // Eliminada trampa que bloqueaba
    [0,0,0,0,0],
  ],
  // Nivel 3 (6x6)
  [
    [0,1,1,1,1,0],
    [0,0,0,0,1,0], // Removida trampa que bloqueaba
    [1,1,0,1,1,0],
    [1,0,0,0,0,0],
    [1,0,1,0,1,1], // Removida trampa del camino
    [1,0,0,0,0,0],
  ],
  // Nivel 4 (6x6)
  [
    [0,1,0,1,0,0],
    [0,1,0,1,0,1], // Removida trampa
    [0,1,0,0,0,1],
    [0,1,1,1,0,1],
    [0,0,0,0,0,1], // Removida trampa
    [1,1,0,0,0,0],
  ],
  // Nivel 5 (7x7)
  [
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,1,0],
    [1,0,1,1,0,1,0], // Removida trampa
    [1,0,0,1,0,0,0],
    [1,0,1,1,1,1,0],
    [1,0,0,0,0,0,0], // Removida trampa
    [1,1,1,1,1,1,0],
  ],
  // Nivel 6 (7x7)
  [
    [0,1,1,1,1,1,1],
    [0,0,0,0,0,1,0],
    [1,1,1,1,0,1,2],  // Trampa al final de camino falso (2,6)
    [1,0,0,0,0,2,0],  // Camino principal libre
    [1,0,1,1,1,0,0],  // Eliminada trampa que bloqueaba
    [1,0,0,0,0,0,0],
    [1,2,2,0,1,0,0],
  ],
  // Nivel 7 (8x8)
  [
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,1,0,0,0],
    [1,1,1,0,1,0,1,1],
    [1,0,0,0,1,0,1,1],  // Eliminada trampa que bloqueaba
    [1,0,1,1,1,0,0,0],  // Trampa en camino lateral (4,5)
    [1,0,1,0,0,0,2,0],
    [1,0,0,0,2,1,1,0],
    [1,1,1,2,0,0,0,0],
  ],
  // Nivel 8 (8x8)
  [
    [0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,1],
    [1,1,1,0,1,2,0,0],
    [1,0,0,0,0,0,2,0],
    [1,0,1,1,1,0,1,0],
    [1,0,0,0,1,0,1,0],
    [1,1,1,0,1,2,1,0],
    [1,1,1,0,1,1,1,0],
  ],
  // Nivel 9 (9x9)
  [
    [0,0,2,1,1,1,1,1,1],
    [1,0,0,2,0,0,0,1,1],
    [1,2,0,1,1,1,0,1,1],
    [1,0,0,0,0,2,0,0,1],  // Camino principal libre
    [1,0,2,1,0,1,1,2,1],  // Trampa en camino lateral (4,7)
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,2,0,0,1],
    [1,2,0,0,0,0,0,2,1],
    [1,1,1,1,2,2,0,0,0],
  ],
  // Nivel 10 (10x10)
  [
    [0,0,2,1,1,1,1,1,1,1],
    [1,0,0,0,2,0,0,1,1,1],
    [1,0,2,0,0,1,0,1,1,1],  // Eliminada trampa que bloqueaba
    [1,0,1,0,0,2,2,0,0,1],  // Trampa en camino lateral (3,6)
    [1,0,1,2,0,1,1,1,0,1],
    [1,0,0,1,0,0,0,2,0,1],
    [1,2,2,1,2,1,0,2,0,1],
    [1,0,0,0,0,1,0,0,0,2],
    [1,0,1,1,0,0,2,2,0,0],
    [1,1,1,1,1,1,1,1,2,0],
  ],
];

// Crear contenedor de resultados
const resultadosContainer = document.createElement("div");
resultadosContainer.style.marginTop = "20px";
resultadosContainer.style.display = "none";
document.body.appendChild(resultadosContainer);

// Crear botón de descarga
const downloadBtn = document.createElement("button");
downloadBtn.textContent = "⬇️ Descargar Resultados";
downloadBtn.style.display = "none";
downloadBtn.style.padding = "10px 20px";
downloadBtn.style.borderRadius = "10px";
downloadBtn.style.border = "none";
downloadBtn.style.backgroundColor = "#4CAF50";
downloadBtn.style.color = "white";
downloadBtn.style.cursor = "pointer";
downloadBtn.onclick = descargarResultados;
document.body.appendChild(downloadBtn);

function renderMaze(level) {
  // Validar que el nivel exista
  if (level < 1 || level > mazes.length) {
    console.error(`Nivel ${level} no existe`);
    finalizarJuego();
    return;
  }

  const maze = mazes[level - 1];
  if (!maze) {
    console.error(`Laberinto para nivel ${level} no definido`);
    return;
  }

  // Reiniciar variables del nivel
  mazeContainer.innerHTML = "";
  mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 40px)`;
  playerPos = { x: 0, y: 0 };
  totalMoves = 0;
  startTime = Date.now();

  // Limpiar temporizador anterior
  clearInterval(timerInterval);

  // Actualizar UI
  nivelLabel.textContent = `Nivel: ${level}`;
  
  // Mostrar vidas
  const vidasEl = document.getElementById("vidas") || document.createElement("p");
  vidasEl.id = "vidas";
  vidasEl.textContent = `❤️ Vidas: ${vidas}`;
  if (!document.getElementById("vidas")) {
    document.body.insertBefore(vidasEl, mazeContainer);
  }

  // Configurar tiempo
  const tiempoEl = document.getElementById("tiempo") || document.createElement("p");
  tiempoEl.id = "tiempo";
  if (!document.getElementById("tiempo")) {
    document.body.insertBefore(tiempoEl, mazeContainer);
  }

  if (timeSel > 0) {
    // Modo con tiempo límite
    let timeLeft = timeSel;
    tiempoEl.textContent = `⏱️ Tiempo restante: ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      tiempoEl.textContent = `⏱️ Tiempo restante: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        manejarTiempoAgotado();
      }
    }, 1000);
  } else {
    // Modo sin tiempo límite (mostrar tiempo transcurrido)
    tiempoEl.textContent = "⏱️ Tiempo: 0s";
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      tiempoEl.textContent = `⏱️ Tiempo: ${elapsed}s`;
    }, 1000);
  }

  function manejarTiempoAgotado() {
    vidas--;
    info.textContent = `❌ Se acabó el tiempo. Te queda${vidas === 1 ? '' : 'n'} ${vidas} vida${vidas === 1 ? '' : 's'}.`;
  
    if (vidas > 0) {
      setTimeout(() => {
        info.textContent = "";
        renderMaze(level);
      }, 2500);
    } else {
      finalizarJuego();
    }
  }

  // Renderizar laberinto
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      
      if (maze[y][x] === 1) cell.classList.add("wall");
      else if (maze[y][x] === 2) cell.classList.add("trap");
      else cell.classList.add("path");

      if (x === 0 && y === 0) cell.classList.add("start");
      if (x === maze[y].length - 1 && y === maze.length - 1) {
        cell.classList.add("end");
        cell.textContent = "SALIDA";
      }

      cell.dataset.x = x;
      cell.dataset.y = y;
      mazeContainer.appendChild(cell);
    }
  }

  drawPlayer();
}

function drawPlayer() {
  document.querySelectorAll(".cell").forEach(cell =>
    cell.classList.remove("player")
  );
  const selector = `[data-x="${playerPos.x}"][data-y="${playerPos.y}"]`;
  const playerCell = document.querySelector(selector);
  if (playerCell) playerCell.classList.add("player");
}

function movePlayer(dx, dy) {
  const maze = mazes[level - 1];
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;

  if (
    newY >= 0 &&
    newY < maze.length &&
    newX >= 0 &&
    newX < maze[0].length &&
    maze[newY][newX] !== 1
  ) {
    playerPos = { x: newX, y: newY };
    totalMoves++;
    drawPlayer();

    // Revisar si es trampa
    if (maze[newY][newX] === 2) {
      vidas--;
      info.textContent = `⚠️ ¡Trampa! Pierdes una vida. Vidas restantes: ${vidas}`;
      
      // Actualizar display de vidas
      const vidasEl = document.getElementById("vidas");
      if (vidasEl) vidasEl.textContent = `❤️ Vidas: ${vidas}`;
      
      if (vidas <= 0) {
        clearInterval(timerInterval);
        finalizarJuego();
        return;
      } else {
        // Reiniciar el nivel después de pisar una trampa
        setTimeout(() => {
          info.textContent = "";
          renderMaze(level);
        }, 1500);
        return;
      }
    }

    checkVictory();
  }
}

function checkVictory() {
  const maze = mazes[level - 1];
  if (
    playerPos.x === maze[0].length - 1 &&
    playerPos.y === maze.length - 1
  ) {
    clearInterval(timerInterval);

    let elapsedTime;
    if (timeSel && !isNaN(timeSel) && timeSel > 0) {
      const tiempoMostrado = parseInt(document.getElementById("tiempo").textContent.replace(/\D/g, ''));
      elapsedTime = timeSel - tiempoMostrado;
    } else {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }

    tiempoTotal += elapsedTime;
    
    // Guardar resultado del nivel
    const resultadoNivel = {
      nivel: level,
      movimientos: totalMoves,
      tiempo: elapsedTime,
      completado: true
    };
    
    guardarResultado(level, totalMoves, elapsedTime);
    resultados.push(resultadoNivel);

    info.textContent = `✅ ¡Nivel ${level} completado! Movimientos: ${totalMoves}, Tiempo: ${elapsedTime}s`;

    // Avanzar al siguiente nivel
    nivelActualIndex++;
    if (nivelActualIndex < nivelesSeleccionados.length) {
      level = nivelesSeleccionados[nivelActualIndex];
      setTimeout(() => {
        info.textContent = "";
        renderMaze(level);
      }, 2000);
    } else {
      // Todos los niveles completados
      setTimeout(() => {
        finalizarJuego();
      }, 2000);
    }
  }
}

function guardarResultado(nivel, movimientos, tiempo) {
  console.log("🔄 Enviando datos a Render:", { nivel, movimientos, tiempo });

  fetch("https://backend-rocket-k6wn.onrender.com/laberinto/guardar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nivel, movimientos, tiempo })
  })
  .then(res => res.json())
  .then(data => console.log("✅ Guardado OK:", data))
  .catch(err => console.error("❌ Error guardando en Render:", err));
}


function finalizarJuego() {
  clearInterval(timerInterval);

  let mensaje, posicionResumen;

  if (vidas > 0 && resultados.length === nivelesSeleccionados.length) {
    mensaje = `🎉 ¡Felicitaciones! Has completado todos los niveles!`;
    posicionResumen = "🏆 GANADOR - Completaste todos los niveles seleccionados";
  } else if (vidas <= 0) {
    mensaje = `💀 Juego terminado. Te quedaste sin vidas.`;
    posicionResumen = `❌ ELIMINADO en el Nivel ${level} - Sin vidas restantes`;
  } else {
    mensaje = `🎮 Juego finalizado.`;
    posicionResumen = `🔄 INCOMPLETO - Completaste ${resultados.length} de ${nivelesSeleccionados.length} niveles`;
  }

  const movimientosTotales = resultados.reduce((sum, r) => sum + r.movimientos, 0);
  const nivelesCompletados = resultados.length;

  // 🧠 Cálculo local del ranking
  const eficiencia = Math.floor((nivelesCompletados * 10000) / (movimientosTotales + tiempoTotal));
  const posicion = Math.max(1, 101 - Math.floor(eficiencia / 100));
  posicionFinalRanking = `#${posicion} de 100 jugadores`;

  const resultadosHTML = resultados.map(r => 
    `<li>Nivel ${r.nivel}: ${r.movimientos} movimientos en ${r.tiempo}s ✅</li>`
  ).join("");

  resultadosContainer.innerHTML = `
    <h2>📋 Resultados del Juego</h2>
    <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <h3>${posicionResumen}</h3>
    </div>
    <ul style="text-align: left; padding-left: 20px;">
      ${resultadosHTML}
    </ul>
    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <p><strong>📊 Estadísticas Finales:</strong></p>
      <p>⏱️ Tiempo total: ${tiempoTotal}s</p>
      <p>❤️ Vidas restantes: ${vidas}</p>
      <p>🎯 Niveles completados: ${nivelesCompletados} de ${nivelesSeleccionados.length}</p>
      <p>🏃 Movimientos totales: ${movimientosTotales}</p>
      <p>🏅 Posición en el ranking: ${posicionFinalRanking}</p>
    </div>
  `;

  resultadosContainer.style.display = "block";
  info.textContent = mensaje;
  downloadBtn.style.display = "inline-block";
}



function descargarResultados() {
  const posicionResumen = vidas > 0 && resultados.length === nivelesSeleccionados.length
    ? "🏆 GANADOR - Completaste todos los niveles seleccionados"
    : vidas <= 0
      ? `❌ ELIMINADO en el Nivel ${level} - Sin vidas restantes`
      : `🔄 INCOMPLETO - Completaste ${resultados.length} de ${nivelesSeleccionados.length} niveles`;

  const texto = [
    "🎮 RESULTADOS DEL JUEGO DE LABERINTO",
    "=".repeat(50),
    "",
    `📍 POSICIÓN FINAL: ${posicionResumen}`,
    `🏅 RANKING: ${posicionFinalRanking || "No disponible"}`,
    "",
    "📋 RESULTADOS POR NIVEL:",
    ...resultados.map(r => `  • Nivel ${r.nivel}: ${r.movimientos} movimientos en ${r.tiempo}s`),
    "",
    "📊 ESTADÍSTICAS FINALES:",
    `  ⏱️ Tiempo total: ${tiempoTotal}s`,
    `  ❤️ Vidas restantes: ${vidas}`,
    `  🎯 Niveles completados: ${resultados.length} de ${nivelesSeleccionados.length}`,
    `  🏃 Movimientos totales: ${resultados.reduce((sum, r) => sum + r.movimientos, 0)}`,
    "",
    `📅 Fecha: ${new Date().toLocaleString()}`,
    "",
    "¡Gracias por jugar! 🎮"
  ].join("\n");

  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `resultados_laberinto_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}


// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});
function mover(direccion) {
  switch (direccion) {
    case "up": movePlayer(0, -1); break;
    case "down": movePlayer(0, 1); break;
    case "left": movePlayer(-1, 0); break;
    case "right": movePlayer(1, 0); break;
  }
}


// Iniciar el juego
renderMaze(level);