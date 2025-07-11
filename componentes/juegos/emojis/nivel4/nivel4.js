// Emojis disponibles
const emojis = [
    '😀','😁','😂','😃','😄','😅','😆','😇','😈','😉',
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🍎','🍕','🎮','⚽','🏆','🎸','🚀','🌈','🌟','🍦',
    '🦄','🍣','🚲','🎻','🏝️','🧩','🛸','🍩','🎲','🦕'
];

// Elementos del DOM
const targetElement = document.getElementById('target');
const grid = document.getElementById('emoji-grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const livesDisplay = document.getElementById('lives');
const nextLevelBtn = document.getElementById('next-level');

// Configuración del juego
const config = {
    gridSize: 6,        // 6x6 = 36 emojis
    targetScore: 10,    // 10 aciertos para ganar
    timeLimit: 20,      // 45 segundos
    totalLives: 1       // 3 vidas
};

// Estado del juego
let gameState = {
    score: 0,
    timeLeft: config.timeLimit,
    lives: config.totalLives,
    targetEmoji: '',
    timer: null,
    usedEmojis: new Set()
};

// Inicializar juego
initGame();

function initGame() {
    setupEventListeners();
    resetGame();
}

function setupEventListeners() {
    nextLevelBtn.addEventListener('click', () => {
        window.location.href = 'extremo.html';
    });
}

function resetGame() {
    gameState.score = 0;
    gameState.timeLeft = config.timeLimit;
    gameState.lives = config.totalLives;
    gameState.usedEmojis = new Set();
    
    updateUI();
    setTargetEmoji();
    generateGrid();
    startTimer();
}

function setTargetEmoji() {
    // Limpiar animación anterior
    targetElement.style.animation = 'none';
    void targetElement.offsetWidth; // Forzar reflow
    
    // Seleccionar nuevo emoji
    gameState.targetEmoji = getRandomEmoji();
    targetElement.textContent = gameState.targetEmoji;
    
    // Nueva animación
    targetElement.style.animation = 'targetAnimation 2.5s infinite ease-in-out';
}

function getRandomEmoji() {
    const availableEmojis = emojis.filter(e => !gameState.usedEmojis.has(e));
    const randomEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
    gameState.usedEmojis.add(randomEmoji);
    return randomEmoji;
}

function generateGrid() {
    grid.innerHTML = '';
    const cells = config.gridSize * config.gridSize;
    const emojiSet = [gameState.targetEmoji];
    
    // Llenar con emojis aleatorios
    while (emojiSet.length < cells) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        if (!emojiSet.includes(randomEmoji)) {
            emojiSet.push(randomEmoji);
        }
    }
    
    // Barajar y crear celdas
    shuffleArray(emojiSet).forEach((emoji, index) => {
        const cell = document.createElement('div');
        cell.className = 'emoji-item';
        cell.textContent = emoji;
        cell.style.animationDelay = `${index * 0.02}s`;
        
        cell.addEventListener('click', () => handleCellClick(cell, emoji));
        grid.appendChild(cell);
    });
}

function handleCellClick(cell, emoji) {
    if (emoji === gameState.targetEmoji) {
        // Acierto
        gameState.score++;
        cell.classList.add('correct');
        
        if (gameState.score >= config.targetScore) {
            endGame(true);
        } else {
            setTimeout(() => {
                setTargetEmoji();
                generateGrid();
            }, 800);
        }
    } else {
        // Error
        gameState.lives--;
        cell.classList.add('incorrect');
        
        if (gameState.lives <= 0) {
            endGame(false);
        }
    }
    updateUI();
}

function startTimer() {
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateUI();
        
        if (gameState.timeLeft <= 10) {
            timerDisplay.classList.add('time-critical');
        }
        
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateUI() {
    scoreDisplay.textContent = gameState.score;
    timerDisplay.textContent = `⏱️ ${gameState.timeLeft}s`;
    livesDisplay.textContent = '❤️'.repeat(gameState.lives);
}

function endGame(isWin) {
    clearInterval(gameState.timer);
    
    if (isWin) {
        createConfetti();
        nextLevelBtn.innerHTML = '<button>¡Nivel Extremo! 🔥</button>';
    } else {
        alert(`¡Juego terminado! Puntuación: ${gameState.score}/${config.targetScore}`);
        setTimeout(resetGame, 1500);
    }
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Helper functions
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}