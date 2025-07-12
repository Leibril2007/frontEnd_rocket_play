
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
    let tiempoTotal = 0; 
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

const mazes = [
  // Nivel 1 (5x5)
  [
    [0,1,0,0,0],
    [0,1,0,1,0],
    [0,0,0,1,0],
    [1,1,0,1,0],  // Trampa movida de (3,2)
    [0,0,2,0,0],  // Trampa colocada en camino lateral (4,2)
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
    [0,0,0,0,1,2], // Trampa movida a (1,5) - final de camino falso
    [1,1,0,1,1,0],
    [1,0,0,0,0,0],
    [1,2,1,0,1,1],
    [1,0,0,0,0,0], // Trampa original en (5,3) removida
  ],
  // Nivel 4 (6x6)
  [
    [0,1,0,1,0,0],
    [0,1,0,1,2,1], // Trampa movida a (1,4) - camino lateral
    [0,1,0,0,0,1],
    [0,1,1,1,0,1],
    [0,0,0,2,0,1], // Trampa original en (4,4) movida
    [1,1,0,0,0,0],
  ],
  // Nivel 5 (7x7)
  [
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,1,0],
    [1,0,1,1,0,1,2], // Trampa movida a (2,6) - final de camino falso
    [1,0,0,1,0,0,0],
    [1,0,1,1,1,1,0],
    [1,0,0,2,0,0,0],
    [1,1,1,1,1,1,0],
  ],
  // Nivel 6 (7x7)
  [
    [0,1,1,1,1,1,1],
    [0,0,0,0,0,1,0],
    [1,1,1,1,0,1,2],  // Trampa al final de camino falso (2,6)
    [1,0,0,0,0,2,0],  // Camino principal libre
    [1,0,1,1,1,2,0],  // Eliminada trampa que bloqueaba
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
    [1,0,2,0,2,1,0,1,1,1],  // Eliminada trampa que bloqueaba
    [1,0,1,0,0,2,2,0,0,1],  // Trampa en camino lateral (3,6)
    [1,0,1,2,0,1,1,1,0,1],
    [1,0,0,1,0,0,0,2,0,1],
    [1,2,2,1,2,1,0,2,0,1],
    [1,0,0,0,0,1,0,0,0,2],
    [1,0,1,1,0,0,2,2,0,0],
    [1,1,1,1,1,1,1,1,2,0],
  ],
];


const resultadosContainer = document.createElement("div");
resultadosContainer.style.marginTop = "20px";
document.body.appendChild(resultadosContainer);

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
/* nivelLabel.textContent = `Nivel: ${level}`; */

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
      if (vidas <= 0) {
        finalizarJuego();
        return;
      } else {
        // Puedes reiniciar el nivel o devolver al inicio
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
  console.log("tiempoTotal:", tiempoTotal);
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
    guardarResultado(level, totalMoves, elapsedTime);
    resultados.push(`Nivel ${level}: ${totalMoves} movimientos, ${elapsedTime}s`);

    info.textContent = `✅ ¡Nivel ${level} completado!`;

    nivelActualIndex++;
    if (nivelActualIndex < nivelesSeleccionados.length) {
      level = nivelesSeleccionados[nivelActualIndex];
      setTimeout(() => {
        info.textContent = "";
        renderMaze(level);
      }, 1500);
    } else {
      finalizarJuego();
    }
  }
}

function guardarResultado(nivel, movimientos, tiempo) {
  fetch("https://backend-rocket-k6wn.onrender.com/laberinto/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nivel, movimientos, tiempo })
  })
  .then(res => res.json())
  .then(data => console.log("✔️ Resultado guardado:", data))
  .catch(err => console.error("❌ Error al guardar resultado:", err));
}

function finalizarJuego() {
  clearInterval(timerInterval);
  const mensaje = vidas > 0
    ? `🎉 ¡Juego completado! Tiempo total: ${tiempoTotal}s`
    : `💀 Juego terminado. No te quedan vidas.`;

  resultadosContainer.innerHTML = `<h2>📋 Resultados</h2>
    <ul>${resultados.map(r => `<li>${r}</li>`).join("")}</ul>
    <p><strong>Tiempo total:</strong> ${tiempoTotal}s</p>
    <p><strong>Vidas restantes:</strong> ${vidas}</p>
    <p><strong>Niveles completados:</strong> ${resultados.length}</p>
  `;
  info.textContent = mensaje;
  downloadBtn.style.display = "inline-block";
}

function descargarResultados() {
  const texto = [
    "🎮 Resultados del juego:",
    ...resultados,
    `⏱️ Tiempo total: ${tiempoTotal}s`,
    `❤️ Vidas restantes: ${vidas}`,
    `🔢 Niveles completados: ${resultados.length}`
  ].join("\n");

  const blob = new Blob([texto], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resultados_laberinto.txt";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

renderMaze(level);
