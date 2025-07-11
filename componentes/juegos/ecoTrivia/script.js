const nivelesCompletos = [
  [ { texto: "¿Los árboles producen oxígeno?", respuesta: true }, { texto: "¿El desierto tiene muchas plantas de agua dulce?", respuesta: false } ],
  [ { texto: "¿El vidrio puede reciclarse infinitas veces?", respuesta: true }, { texto: "¿Las bolsas de plástico se biodegradan en 1 año?", respuesta: false } ],
  [ { texto: "¿La energía solar es renovable?", respuesta: true }, { texto: "¿El carbón genera energía limpia?", respuesta: false } ],
  [ { texto: "¿Las abejas son vitales para los ecosistemas?", respuesta: true }, { texto: "¿Los lobos comen plantas acuáticas?", respuesta: false } ],
  [ { texto: "¿El agua cubre más del 70% del planeta?", respuesta: true }, { texto: "¿Podemos beber agua del mar directamente?", respuesta: false } ],
  [ { texto: "¿Los gases de autos contribuyen al cambio climático?", respuesta: true }, { texto: "¿Los residuos industriales son 100% seguros?", respuesta: false } ],
  [ { texto: "¿El deshielo afecta el nivel del mar?", respuesta: true }, { texto: "¿El cambio climático es solo un ciclo natural?", respuesta: false } ],
  [ { texto: "¿Los pesticidas pueden contaminar el suelo?", respuesta: true }, { texto: "¿Todas las semillas modificadas son ecológicas?", respuesta: false } ],
  [ { texto: "¿Separar residuos ayuda al reciclaje?", respuesta: true }, { texto: "¿La basura electrónica no contamina?", respuesta: false } ],
  [ { texto: "¿Las ciudades verdes usan energía limpia?", respuesta: true }, { texto: "¿No hacer nada es una forma de cuidar el planeta?", respuesta: false } ]
];

// Configuración del juego
let nivelesSeleccionados = localStorage.getItem("nivSel")?.split(",").map(n => parseInt(n) - 1) || [0];
const niveles = nivelesSeleccionados.map(i => nivelesCompletos[i]).filter(Boolean);

// Variables del juego
let nivelActual = 0;
let indice = 0;
let puntos = 0;
let preguntasJugadas = 0;
let vidas = 3;
let tiempo = 0;
let temporizador;
let resultadosFinales = {
  nombre: "Jugador",
  puntaje: 0,
  nivelMaximo: 0,
  preguntasCorrectas: 0,
  preguntasTotales: 0,
  porcentajeExito: 0,
  fecha: ""
};

// Inicializar el juego
updateHearts();
mostrarPregunta();

function updateHearts() {
  const heartContainer = document.getElementById("heart-container");
  heartContainer.innerHTML = "";
  for (let i = 0; i < vidas; i++) {
    heartContainer.innerHTML += "❤️";
  }
}

function mostrarPregunta() {
  clearInterval(temporizador);

  // ✅ Validar que exista un nivel válido
  if (!Array.isArray(niveles) || niveles.length === 0) {
    console.error("❌ No hay niveles válidos cargados");
    finalizarJuego();
    return;
  }

  const preguntas = niveles[nivelActual];

  // ✅ Validar que haya preguntas para el nivel actual
  if (!preguntas || !Array.isArray(preguntas)) {
    console.error(`⚠️ No hay preguntas para el nivel ${nivelActual}`);
    finalizarJuego();
    return;
  }

  if (indice < preguntas.length) {
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelesSeleccionados[nivelActual] + 1}`;
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "";
    document.getElementById("buttons").style.display = "flex";

    // Configurar tiempo
    let tiempoGuardado = localStorage.getItem("timeSel");
    let tiempoBase = parseInt(tiempoGuardado);
    if (isNaN(tiempoBase) || tiempoBase <= 0) tiempoBase = 20;

    tiempo = tiempoBase;
    document.getElementById("tiempo").textContent = `⏱️ ${tiempo} segundos`;

    temporizador = setInterval(() => {
      tiempo--;
      document.getElementById("tiempo").textContent = `⏱️ ${tiempo} segundos`;
      if (tiempo <= 0) {
        clearInterval(temporizador);
        answer(null);
      }
    }, 1000);
  } else {
    nivelActual++;
    indice = 0;

    if (nivelActual < niveles.length) {
      document.getElementById("question").textContent = `🎉 ¡Subiste al Nivel ${nivelesSeleccionados[nivelActual] + 1}!`;
      document.getElementById("feedback").textContent = "";
      document.getElementById("buttons").style.display = "none";
      setTimeout(mostrarPregunta, 2000);
    } else {
      finalizarJuego();
    }
  }
}

function answer(seleccion) {
  clearInterval(temporizador);

  const preguntas = niveles[nivelActual];

  if (!preguntas || !preguntas[indice]) {
    console.warn("❌ No hay pregunta válida en el índice actual");
    return;
  }
  const correcta = preguntas[indice].respuesta;
  const esCorrecto = seleccion === correcta;

  // Actualizar feedback visual
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = seleccion === null
    ? "⏰ ¡Tiempo agotado!"
    : esCorrecto
      ? "✅ ¡Correcto!"
      : "❌ Incorrecto";
  
  feedbackElement.className = esCorrecto ? "correcto" : "incorrecto";
  feedbackElement.classList.add("pulse");

  preguntasJugadas++;
  if (esCorrecto) {
    puntos++;
  } else {
    vidas--;
    updateHearts();
    if (vidas <= 0) {
      setTimeout(finalizarJuego, 1500);
      return;
    }
  }

  document.getElementById("score").textContent = `Puntos: ${puntos}`;
  indice++;
  setTimeout(mostrarPregunta, 1500);
}

function finalizarJuego() {
  // Guardar resultados
  resultadosFinales = {
    nombre: "Jugador",
    puntaje: puntos,
    nivelMaximo: nivelesSeleccionados[Math.min(nivelActual, nivelesSeleccionados.length - 1)] + 1,
    preguntasCorrectas: puntos,
    preguntasTotales: preguntasJugadas,
    porcentajeExito: Math.round((puntos / preguntasJugadas) * 100),
    fecha: new Date().toLocaleString()
  };

  // Mostrar pantalla de resultados
  document.getElementById("game-container").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  
  const finalStats = document.getElementById("final-stats");
  finalStats.innerHTML = `
    <p><strong>${resultadosFinales.nombre}</strong>, estos son tus resultados:</p>
    <p>🏆 Puntos obtenidos: ${resultadosFinales.puntaje}</p>
    <p>📊 Nivel máximo alcanzado: ${resultadosFinales.nivelMaximo}</p>
    <p>✅ Preguntas correctas: ${resultadosFinales.preguntasCorrectas} de ${resultadosFinales.preguntasTotales}</p>
    <p>🎯 Porcentaje de éxito: ${resultadosFinales.porcentajeExito}%</p>
    <p>📅 Fecha: ${resultadosFinales.fecha}</p>
    <div id="server-feedback"></div>
  `;

  // Enviar resultados al servidor
  enviarResultadosAlServidor();
}

function downloadResults() {
  // Ocultar botones temporalmente
  const downloadBtn = document.getElementById('download-btn');
  const restartBtn = document.getElementById('restart-btn');
  const originalDisplay = [downloadBtn.style.display, restartBtn.style.display];
  downloadBtn.style.display = 'none';
  restartBtn.style.display = 'none';

  // Asegurar fondo blanco
  const resultScreen = document.getElementById("result-screen");
  const originalBackground = resultScreen.style.background;
  resultScreen.style.background = 'white';

  // Capturar como imagen
  html2canvas(resultScreen, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: true,
    useCORS: true
  }).then(canvas => {
    // Restaurar estilos
    resultScreen.style.background = originalBackground;
    downloadBtn.style.display = originalDisplay[0];
    restartBtn.style.display = originalDisplay[1];
    
    // Descargar imagen
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Resultados_EcoQuiz_${new Date().toISOString().slice(0,10)}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(err => {
    console.error('Error al generar imagen:', err);
    // Restaurar y ofrecer JSON como alternativa
    resultScreen.style.background = originalBackground;
    downloadBtn.style.display = originalDisplay[0];
    restartBtn.style.display = originalDisplay[1];
    downloadAsJSON();
  });
}

function downloadAsJSON() {
  const blob = new Blob([JSON.stringify(resultadosFinales, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultados_eco_quiz_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function enviarResultadosAlServidor() {
  const datosParaEnviar = {
    nombre: resultadosFinales.nombre || "Anónimo",
    puntaje: Number(resultadosFinales.puntaje),
    nivel: Number(resultadosFinales.nivelMaximo),
    preguntas_jugadas: Number(resultadosFinales.preguntasTotales)
  };

  console.log("Enviando al servidor:", datosParaEnviar); // 🔍 útil para depurar

  fetch('https://backend-rocket-k6wn.onrender.com/api/resultados', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(datosParaEnviar)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("✅ Resultado guardado:", data);
    document.getElementById("server-feedback").textContent = "✔️ Resultado guardado correctamente.";
  })
  .catch(err => {
    console.error("❌ Error al guardar resultado:", err);
    document.getElementById("server-feedback").textContent = "❌ No se pudo guardar el resultado.";
  });
}

function guardarResultadosLocalmente() {
  try {
    const historial = JSON.parse(localStorage.getItem('historialResultados') || '[]');
    historial.push({
      nombre: resultadosFinales.nombre,
      puntaje: resultadosFinales.puntaje,
      nivel: resultadosFinales.nivelMaximo,
      preguntas_jugadas: resultadosFinales.preguntasTotales,
      fecha: new Date().toISOString()
    });
    localStorage.setItem('historialResultados', JSON.stringify(historial));
  } catch (e) {
    console.error("Error al guardar localmente:", e);
  }
}
function restartGame() {
  // Reiniciar variables
  nivelActual = 0;
  indice = 0;
  puntos = 0;
  preguntasJugadas = 0;
  vidas = 3;
  
  // Restablecer UI
  document.getElementById("game-container").style.display = "block";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("score").textContent = "Puntos: 0";
  updateHearts();
  
  // Comenzar nuevo juego
  mostrarPregunta();
}