// Emojis para nivel regular (caritas + animales)
const emojis = [
    '😀','😁','😂','😃','😄','😅','😆','😇','😈','😉',
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦄'
];

const target = document.getElementById('target');
const grid = document.getElementById('emoji-grid');
const scoreDisplay = document.getElementById('score');
const nextLevel = document.getElementById('next-level');
const timerDisplay = document.getElementById('timer');
let score = 0;
let targetEmoji = '';
let timeLeft = 60;
let timer;

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function setTargetEmoji() {
    targetEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    target.textContent = targetEmoji;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏱️ ${timeLeft}s`;
        
        if(timeLeft <= 10) {
            timerDisplay.style.color = '#ff0000';
            timerDisplay.style.animation = 'pulse 0.5s infinite alternate';
        }
        
        if(timeLeft <= 0) {
            clearInterval(timer);
            alert('¡Tiempo terminado! Intenta de nuevo.');
            resetGame();
        }
    }, 1000);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = '0';
    timerDisplay.textContent = '⏱️ 60s';
    timerDisplay.style.color = '';
    timerDisplay.style.animation = '';
    clearInterval(timer);
    setTargetEmoji();
    generateGrid();
    startTimer();
}

function generateGrid() {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Grid 5x5
    
    const used = new Set([targetEmoji]);
    const emojiSet = [targetEmoji];
    
    while (emojiSet.length < 25) { // 25 emojis
        let e = emojis[Math.floor(Math.random() * emojis.length)];
        if (!used.has(e)) {
            emojiSet.push(e);
            used.add(e);
        }
    }
    
    const shuffled = shuffle(emojiSet);
    shuffled.forEach((e, index) => {
        const div = document.createElement('div');
        div.classList.add('emoji-item');
        div.textContent = e;
        div.style.animationDelay = index * 0.03 + 's'; // Aparecen más rápido
        
        div.onclick = () => {
            if (e === targetEmoji) {
                score++;
                scoreDisplay.textContent = `${score}`;
                div.classList.add('correct');
                
                setTimeout(() => {
                    if (score >= 8) { // 8 aciertos requeridos
                        createConfetti();
                        clearInterval(timer);
                        nextLevel.innerHTML = '<button onclick="window.location.href=\'dificil.html\'">¡Siguiente Nivel! ➡️</button>';
                    } else {
                        setTargetEmoji();
                        generateGrid();
                    }
                }, 800);
            } else {
                div.classList.add('incorrect');
                timeLeft = Math.max(5, timeLeft - 3); // Penalización de 3 segundos
                setTimeout(() => div.classList.remove('incorrect'), 300);
            }
        };
        
        grid.appendChild(div);
    });
}

// Iniciar juego
setTargetEmoji();
generateGrid();
startTimer();