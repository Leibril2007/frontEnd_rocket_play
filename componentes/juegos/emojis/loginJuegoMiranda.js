document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    
    startBtn.addEventListener('click', function() {
        // Lógica para iniciar el juego directamente
        console.log("Iniciando Emoji Game");
        
        // Redirección o inicio del juego
        iniciarJuego();
    });

    function iniciarJuego() {
        // Aquí iría la lógica para comenzar el juego
        // Por ejemplo, redireccionar a la pantalla del juego:
        // window.location.href = "ruta/al/juego.html";
        
        alert("¡El juego está por comenzar!");
    }
});