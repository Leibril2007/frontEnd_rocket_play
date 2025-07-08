const emojis = ['😀','😁','😂','😃','😄','😅','😆','😇','😈','😉','😊','😋','😎','😍','😘','😗','😙','😚','😜','😝','😛','🤩','🥳','🤪','👻','🐶','🐱','🦄','🐬','🦁'];
const target = document.getElementById('target');
const grid = document.getElementById('emoji-grid');
const scoreDisplay = document.getElementById('score');
const nextLevel = document.getElementById('next-level');
let score = 0;
let targetEmoji = '';

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function setTargetEmoji() {
    targetEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    target.textContent = targetEmoji;
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

function generateGrid() {
    grid.innerHTML = '';
    const used = new Set([targetEmoji]);
    const emojiSet = [targetEmoji];
    
    while (emojiSet.length < 16) {
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
        div.style.animationDelay = index * 0.05 + 's';
        
        div.onclick = () => {
            if (e === targetEmoji) {
                score++;
                scoreDisplay.textContent = `${score}`;
                div.classList.add('correct');
                
                setTimeout(() => {
                    if (score >= 5) {
                        createConfetti();
                        nextLevel.innerHTML = '<button onclick="alert(\'¡Nivel completado! 🎉\')">¡Siguiente Nivel!</button>';
                    } else {
                        setTargetEmoji();
                        generateGrid();
                    }
                }, 800);
            } else {
                div.classList.add('incorrect');
                setTimeout(() => div.classList.remove('incorrect'), 300);
            }
        };
        
        grid.appendChild(div);
    });
}

setTargetEmoji();
generateGrid();