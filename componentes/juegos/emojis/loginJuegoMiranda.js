document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game');
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    let selectedLevel = 1;

    // Selección de dificultad
    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            difficultyOptions.forEach(opt => opt.style.backgroundColor = '#b2ebf2');
            option.style.backgroundColor = '#80deea';
            selectedLevel = parseInt(option.getAttribute('data-level'));
        });
    });

    // Iniciar juego
    startBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        if(username) {
            localStorage.setItem('emojiPlayer', username);
            localStorage.setItem('gameLevel', selectedLevel);
            window.location.href = `niveles/nivel${selectedLevel}.html`;
        } else {
            alert("¡Por favor ingresa tu nombre!");
        }
    });
});