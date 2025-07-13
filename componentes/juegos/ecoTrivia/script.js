const nivelesCompletos = [
  [
    { texto: "¿Los árboles producen oxígeno?", respuesta: true },
    { texto: "¿El desierto tiene muchas plantas de agua dulce?", respuesta: false }
  ],
  [
    { texto: "¿El vidrio puede reciclarse infinitas veces?", respuesta: true },
    { texto: "¿Las bolsas de plástico se biodegradan en 1 año?", respuesta: false }
  ],
  [
    { texto: "¿La energía solar es renovable?", respuesta: true },
    { texto: "¿El carbón genera energía limpia?", respuesta: false }
  ],
  [
    { texto: "¿Las abejas son vitales para los ecosistemas?", respuesta: true },
    { texto: "¿Los lobos comen plantas acuáticas?", respuesta: false }
  ],
  [
    { texto: "¿El agua cubre más del 70% del planeta?", respuesta: true },
    { texto: "¿Podemos beber agua del mar directamente?", respuesta: false }
  ],
  [
    { texto: "¿Los gases de autos contribuyen al cambio climático?", respuesta: true },
    { texto: "¿Los residuos industriales son 100% seguros?", respuesta: false }
  ],
  [
    { texto: "¿El deshielo afecta el nivel del mar?", respuesta: true },
    { texto: "¿El cambio climático es solo un ciclo natural?", respuesta: false }
  ],
  [
    { texto: "¿Los pesticidas pueden contaminar el suelo?", respuesta: true },
    { texto: "¿Todas las semillas modificadas son ecológicas?", respuesta: false }
  ],
  [
    { texto: "¿Separar residuos ayuda al reciclaje?", respuesta: true },
    { texto: "¿La basura electrónica no contamina?", respuesta: false }
  ],
  [
    { texto: "¿Las ciudades verdes usan energía limpia?", respuesta: true },
    { texto: "¿No hacer nada es una forma de cuidar el planeta?", respuesta: false }
  ]
];

// 🧡 Vidas
let vidas = 3;

function actualizarVidas() {
  const contenedor = document.getElementById("heart-container");
  contenedor.innerHTML = "";
  for (let i = 0; i < vidas; i++) {
    const corazon = document.createElement("span");
    corazon.textContent = "❤️";
    corazon.style.fontSize = "24px";
    corazon.style.marginRight = "5px";
    contenedor.appendChild(corazon);
  }
}

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
        return isNaN(num) ? 1 : Math.max(1, Math.min(num, nivelesCompletos.length));
      });
    }
    nivelesSeleccionados = [...new Set(arr.filter(n => !isNaN(n) && n > 0 && n <= nivelesCompletos.length))];
    if (nivelesSeleccionados.length === 0) nivelesSeleccionados = [1];
  } catch (e) {
    console.warn("Error al leer nivelesBd", e);
    nivelesSeleccionados = [1];
  }
} else {
  nivelesSeleccionados = [1];
}

const niveles = nivelesSeleccionados.map(n => nivelesCompletos[n - 1]).filter(Boolean);

let nivelActual = 0;
let indice = 0;
let puntos = 0;
let preguntasJugadas = 0;
let tiempoRestante = 10;
let temporizador;

function iniciarTemporizador() {
  clearInterval(temporizador);
  let tiempoGuardado = localStorage.getItem("tiempoBd");
  let tiempoBase = parseInt(JSON.parse(tiempoGuardado));
  if (isNaN(tiempoBase) || tiempoBase <= 0) tiempoBase = 10;
  tiempoRestante = tiempoBase;

  document.getElementById("tiempo").style.display = "block";
  document.getElementById("tiempo").textContent = `⏱️ ${tiempoRestante} segundos`;

  temporizador = setInterval(() => {
    tiempoRestante--;
    document.getElementById("tiempo").textContent = `⏱️ ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      document.getElementById("feedback").textContent = "⏰ Tiempo agotado";
      preguntasJugadas++;
      vidas--;
      actualizarVidas();
      if (vidas <= 0) {
        finalizarPartida();
      } else {
        indice++;
        document.getElementById("tiempo").style.display = "none";
        setTimeout(mostrarPregunta, 1500);
      }
    }
  }, 1000);
}

function mostrarPregunta() {
  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelesSeleccionados[nivelActual] || (nivelActual + 1)} / ${nivelesCompletos.length}`;
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("buttons").style.display = "flex";
    document.getElementById("tiempo").style.display = "block";
    iniciarTemporizador();
  } else {
    nivelActual++;
    indice = 0;

    if (nivelActual < niveles.length) {
      const numeroNivelReal = nivelesSeleccionados[nivelActual] || (nivelActual + 1);
      document.getElementById("question").textContent = `🎉 ¡Subiste al Nivel ${numeroNivelReal}!`;
      document.getElementById("feedback").textContent = "";
      document.getElementById("buttons").style.display = "none";
      document.getElementById("tiempo").style.display = "none";
      setTimeout(mostrarPregunta, 2000);
    } else {
      finalizarPartida();
    }
  }
}

function finalizarPartida() {
  clearInterval(temporizador);
  document.getElementById("nivelLabel").textContent = "";
  document.getElementById("question").textContent = vidas <= 0
    ? "💀 ¡Se acabaron tus vidas! Fin del juego."
    : "🎊 ¡Terminaste todos los niveles!";
  document.getElementById("buttons").style.display = "none";
  document.getElementById("tiempo").style.display = "none";
  document.getElementById("score").style.display = "none";

  document.getElementById("result-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";

  fetch('https://backend-rocket-k6wn.onrender.com/api/resultados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: "jugador",
      puntaje: puntos,
      nivel: nivelActual + 1,
      preguntas_jugadas: preguntasJugadas
    })
  })
    .then(res => res.json())
    .then(data => {
      const resumenHTML = `
        <div style="
          background: linear-gradient(135deg, #fff0f6, #f0fff4);
          border: 2px solid #e4c1f9;
          border-radius: 15px;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          color: #4a4a4a;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          max-width: 500px;
          margin: 20px auto;
          animation: fadeIn 0.6s ease-in-out;
        ">
          <h3 style="color: #ff70a6; margin-bottom: 12px;">🌼 Resumen de Partida 🌼</h3>
          <p><strong>📚 Preguntas jugadas:</strong> ${preguntasJugadas}</p>
          <p><strong>💎 Puntos acumulados:</strong> ${puntos}</p>
          <p><strong>🚀 Nivel alcanzado:</strong> ${nivelActual}</p>
          <p><strong>🏅 Posición en el ranking:</strong> ${data.posicion}</p>
          <p style="margin-top: 15px; font-size: 16px; color: #ffa6c1;">
            🎉 ¡Gracias por jugar, <strong>jugador</strong>! 🌸
          </p>
        </div>
      `;
      document.getElementById("server-feedback").innerHTML = resumenHTML;
      const btnDescargar = document.getElementById("btn-descargar");
      btnDescargar.style.display = "inline-block";
      btnDescargar.onclick = () => {
        descargarResumen(preguntasJugadas, puntos, nivelActual, data.posicion);
      };
    })
    .catch(err => {
      console.error("Error al guardar resultado:", err);
      document.getElementById("feedback").textContent = `
  ⚠️ No se pudo guardar el resultado, pero aquí está tu resumen:

  🧾 Resumen de Partida:
  • Preguntas jugadas: ${preguntasJugadas}
  • Puntos acumulados: ${puntos}
  • Nivel alcanzado: ${nivelActual}
      `;
    });
}

 function answer(seleccion) {
  clearInterval(temporizador);
  document.getElementById("tiempo").style.display = "none";

  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    const correcta = preguntas[indice].respuesta;
    const esCorrecto = seleccion === correcta;

    document.getElementById("feedback").textContent = esCorrecto
      ? "😊 ¡Correcto!"
      : "🙃 Ups... incorrecto";

    if (esCorrecto) {
      puntos++;
    } else {
      vidas--;                    // 👈 Quitar vida si se equivocó
      actualizarVidas();          // 👈 Actualizar corazones
      if (vidas <= 0) {
        finalizarPartida();       // 👈 Termina si se quedó sin vidas
        return;                   // 👈 Detener aquí
      }
    }

    preguntasJugadas++;
    document.getElementById("score").textContent = `🌟 Puntos: ${puntos}`;
    indice++;
    setTimeout(mostrarPregunta, 1500);
  }
}

function restartGame() {
  nivelActual = 0;
  indice = 0;
  puntos = 0;
  preguntasJugadas = 0;
  vidas = 3;
  actualizarVidas();
  document.getElementById("score").textContent = `🌟 Puntos: 0`;
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("tiempo").style.display = "block";
  document.getElementById("score").style.display = "block";
  document.getElementById("btn-descargar").style.display = "none";
  document.getElementById("feedback").textContent = "";
  mostrarPregunta();
}

function descargarResumen(preguntasJugadas, puntos, nivel, posicionGenerada) {
  const resumen = `
🌼 EcoTrivia - Resumen de Partida 🌼

📚 Preguntas jugadas: ${preguntasJugadas}
💎 Puntos acumulados: ${puntos}
🚀 Nivel alcanzado: ${nivel}
🏅 Posición en el ranking: ${posicionGenerada}
🎉 ¡Gracias por jugar, jugador! 🌸
  `;

  const blob = new Blob([resumen], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ecoTrivia_resumen.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

actualizarVidas();
mostrarPregunta();
