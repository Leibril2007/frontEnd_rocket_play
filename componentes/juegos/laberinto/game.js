const mazeContainer = document.getElementById("mazeContainer");
const info = document.getElementById("info");
const nivelLabel = document.getElementById("nivelLabel");

let level = 1;
let playerPos = { x: 0, y: 0 };
let totalMoves = 0;
let startTime = Date.now();

const mazes = [
  [
    [0,1,0,0,0],
    [0,1,0,1,0],
    [0,0,0,1,0],
    [1,1,0,1,0],
    [0,0,0,0,0],
  ],
  [
    [0,0,1,0,0],
    [1,0,1,1,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,0],
  ],
  [
    [0,1,1,1,0],
    [0,0,0,1,0],
    [1,1,0,1,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
  ],
  [
    [0,1,0,0,0],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,0,1,0],
    [1,1,0,0,0],
  ],
  [
    [0,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,1,0],
    [0,1,0,0,0],
    [0,1,1,1,0],
  ],
  [
    [0,0,1,1,0],
    [1,0,1,0,0],
    [1,0,0,0,1],
    [1,1,1,0,1],
    [0,0,0,0,0],
  ],
  [
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,1,0],
  ],
  [
    [0,1,1,1,1],
    [0,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,0],
    [1,0,1,1,0],
  ],
  [
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,1,0],
  ],
  [
    [0,0,0,1,0],
    [1,1,0,1,0],
    [0,0,0,0,0],
    [0,1,1,1,1],
    [0,0,0,0,0],
  ]
];

function renderMaze(level) {
  const maze = mazes[level - 1];
  mazeContainer.innerHTML = "";
  mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 40px)`;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (maze[y][x] === 1) cell.classList.add("wall");
      else cell.classList.add("path");

      if (x === 0 && y === 0) {
        cell.classList.add("start");
        playerPos = { x, y };
        totalMoves = 0;
        startTime = Date.now();
      }

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
  nivelLabel.textContent = `Nivel: ${level}`;
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
    maze[newY][newX] === 0
  ) {
    playerPos = { x: newX, y: newY };
    totalMoves++;
    drawPlayer();
    checkVictory();
  }
}

function checkVictory() {
  const maze = mazes[level - 1];
  if (
    playerPos.x === maze[0].length - 1 &&
    playerPos.y === maze.length - 1
  ) {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    guardarResultado(level, totalMoves, elapsedTime);

    info.textContent = `¡Nivel ${level} completado!`;

    level++;
    if (level <= mazes.length) {
      setTimeout(() => {
        info.textContent = "";
        renderMaze(level);
      }, 1000);
    } else {
      info.textContent = "🎉 ¡Todos los niveles completados!";
    }
  }
}

function guardarResultado(nivel, movimientos, tiempo) {
  fetch("http://localhost:3000/laberinto/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nivel, movimientos, tiempo })
  })
  .then(res => res.json())
  .then(data => console.log("✔️ Resultado guardado:", data))
  .catch(err => console.error("❌ Error al guardar resultado:", err));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

renderMaze(level);
