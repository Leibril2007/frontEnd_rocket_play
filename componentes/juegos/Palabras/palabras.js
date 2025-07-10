// ... niveles y variables sin cambios
const niveles = [
    ["sol", "mar"],
    ["mesa", "luna", "flor"],
    ["barco", "cielo", "verde", "rojo"],
    ["ratón", "avión", "bosque", "cuadro", "espejo"],
    ["elefante", "camarón", "murciélago", "teléfono", "valiente", "zanahoria"],
    ["murmullo", "cartílago", "estómago", "descubrimiento", "carácter", "matemática", "historia"],
    ["bicicleta", "astronauta", "serenidad", "tembloroso", "complejidad", "especialidad", "océano", "planeta"],
    ["metáfora", "hermenéutica", "voluntariado", "circunstancia", "fantasmagórico", "legislativo", "organización", "dimensión"],
    ["electromagnetismo", "transformación", "revolucionario", "electrocardiograma", "interdisciplinario", "autenticación"],
    ["hipopotomonstrosesquipedaliofobia", "otorrinolaringólogo", "inconstitucionalidad", "desafortunadamente", "responsabilidad"]
  ];
  
  let nivelActual = 0;
  let vidas = 3;
  let tiempo = 10;
  let preguntasJugadas = 0;
  let puntaje = 0;
  let palabrasRestantes = [];
  let palabraActual = "";
  let intervalo;
  let htmlOriginal = "";
  
  // 🔠 Función para normalizar texto (elimina acentos)
  function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  window.onload = () => {
    htmlOriginal = document.getElementById("pantalla").innerHTML;
    iniciarNivel();
  };
  
  function iniciarNivel() {
    palabrasRestantes = [...niveles[nivelActual]];
    siguientePalabra();
  }
  
  function siguientePalabra() {
    if (palabrasRestantes.length === 0) {
      if (nivelActual < niveles.length - 1) {
        nivelActual++;
        iniciarNivel();
      } else {
        mostrarResultado("¡Ganaste!");
      }
      return;
    }
  
    palabraActual = palabrasRestantes.splice(Math.floor(Math.random() * palabrasRestantes.length), 1)[0];
    tiempo = Math.max(3, 10 - nivelActual);
  
    document.getElementById("palabra").textContent = palabraActual;
    document.getElementById("nivel").textContent = nivelActual + 1;
    document.getElementById("vidas").textContent = vidas;
    document.getElementById("tiempo").textContent = tiempo;
    document.getElementById("puntos").textContent = puntaje;
    document.getElementById("entrada").value = "";
  
    clearInterval(intervalo);
    intervalo = setInterval(contarTiempo, 1000);
  }
  
  function contarTiempo() {
    tiempo--;
    document.getElementById("tiempo").textContent = tiempo;
    if (tiempo === 0) {
      perderVida();
    }
  }
  
  function verificarEntrada() {
    const entrada = normalizarTexto(document.getElementById("entrada").value.trim());
    const palabra = normalizarTexto(palabraActual);
  
    if (entrada === palabra) {
      preguntasJugadas++;
      puntaje += 10;
      clearInterval(intervalo);
      siguientePalabra();
    }
  }
  
  function perderVida() {
    preguntasJugadas++;
    clearInterval(intervalo);
    vidas--;
    if (vidas <= 0) {
      mostrarResultado("Fin del juego");
    } else {
      siguientePalabra();
    }
  }
  
  function mostrarResultado(mensaje) {
    guardarResultadoEnDB();
    document.getElementById("pantalla").innerHTML = `
      <h2>${mensaje}</h2>
      <div class="resultado">
        <p>🎯 Nivel: ${nivelActual + 1}</p>
        <p>⭐ Puntaje: ${puntaje}</p>
        <p>✍️ Preguntas jugadas: ${preguntasJugadas}</p>
        <p>❤️ Vidas restantes: ${vidas}</p>
        <button onclick="descargarResultados()">📥 Descargar resultados</button>
        <button onclick="reiniciarJuego()">🔄 Volver a jugar</button>
      </div>
    `;
  }
  
  function descargarResultados() {
    const datos = `Nivel: ${nivelActual + 1}\nPuntaje: ${puntaje}\nPreguntas jugadas: ${preguntasJugadas}\nVidas restantes: ${vidas}`;
    const blob = new Blob([datos], { type: "text/plain" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "resultado.txt";
    enlace.click();
  }
  
  function guardarResultadoEnDB() {
    fetch('http://localhost:3000/api/resultados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nivel: nivelActual + 1,
        puntaje,
        preguntas: preguntasJugadas,
        vidas
      })
    })
    .then(res => res.json())
    .then(data => console.log('Resultado guardado:', data))
    .catch(err => console.error('Error al guardar en DB:', err));
  }
  
  function reiniciarJuego() {
    document.getElementById("pantalla").innerHTML = htmlOriginal;
  
    setTimeout(() => {
      nivelActual = 0;
      vidas = 3;
      preguntasJugadas = 0;
      puntaje = 0;
      iniciarNivel();
    }, 30);
  }
  