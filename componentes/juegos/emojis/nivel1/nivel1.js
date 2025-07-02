document.addEventListener('DOMContentLoaded', function() {
  const emojis = ['😊', '😂', '😍', '😎', '😢', '😡', '🤔', '🥶', '🤯', '👻'];
  const emojiGrid = document.getElementById('emoji-grid');
  const targetEmoji = document.getElementById('target');
  const scoreElement = document.getElementById('score');
  const timeElement = document.getElementById('time');
  const nextLevelBtn = document.getElementById('next-level');
  
  let score = 0;
  let timeLeft = 90;
  let gameInterval;
  let currentTarget = '';
  const targetScore = 10;
  
  function initGame() {
      score = 0;
      timeLeft = 90;
      scoreElement.textContent = `${score}/${targetScore}`;
      timeElement.textContent = timeLeft;
      nextLevelBtn.innerHTML = '';
      
      setNewTarget();
      createEmojiGrid();
      gameInterval = setInterval(updateTimer, 1000);
  }
  
  function setNewTarget() {
      currentTarget = emojis[Math.floor(Math.random() * emojis.length)];
      targetEmoji.textContent = currentTarget;
  }
  
  function createEmojiGrid() {
      emojiGrid.innerHTML = '';
      let emojiArray = Array(9).fill(currentTarget);
      
      while(emojiArray.length < 16) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          if(randomEmoji !== currentTarget) {
              emojiArray.push(randomEmoji);
          }
      }
      
      emojiArray = shuffleArray(emojiArray);
      
      emojiArray.forEach(emoji => {
          const emojiElement = document.createElement('div');
          emojiElement.className = 'emoji-item';
          emojiElement.textContent = emoji;
          emojiElement.addEventListener('click', () => checkEmoji(emoji, emojiElement));
          emojiGrid.appendChild(emojiElement);
      });
  }
  
  function checkEmoji(emoji, element) {
      if(emoji === currentTarget) {
          score++;
          scoreElement.textContent = `${score}/${targetScore}`;
          element.classList.add('correct');
          setTimeout(() => {
              element.classList.remove('correct');
              if(score < targetScore) {
                  setNewTarget();
                  createEmojiGrid();
              } else {
                  clearInterval(gameInterval);
                  nextLevelBtn.innerHTML = '<button onclick="window.location.href=\'nivel2.html\'">Siguiente Nivel</button>';
              }
          }, 300);
      } else {
          element.classList.add('incorrect');
          setTimeout(() => element.classList.remove('incorrect'), 300);
      }
  }
  
  function updateTimer() {
      timeLeft--;
      timeElement.textContent = timeLeft;
      
      if(timeLeft <= 0) {
          clearInterval(gameInterval);
          alert(`¡Tiempo terminado! Puntuación: ${score}/${targetScore}`);
      }
  }
  
  function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
  }
  
  initGame();
});