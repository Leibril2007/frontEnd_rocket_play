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

let nivelesSeleccionados = localStorage.getItem("nivSel")?.split(",").map(n => parseInt(n) - 1) || [0];
const niveles = nivelesSeleccionados.map(i => nivelesCompletos[i]).filter(Boolean);

let nivelActual = 0;
let indice = 0;
let puntos = 0;
let preguntasJugadas = 0;

let tiempo = 0;
let temporizador;

function mostrarPregunta() {
  clearInterval(temporizador);

  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelesSeleccionados[nivelActual] + 1}`;
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("buttons").style.display = "flex";

    // Tiempo configurado
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
        answer(null); // Tiempo agotado = respuesta incorrecta
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
      document.getElementById("nivelLabel").textContent = "";
      document.getElementById("question").textContent = "🎊 ¡Terminaste todos los niveles seleccionados!";
      document.getElementById("buttons").style.display = "none";
      document.getElementById("feedback").textContent = `Tu puntaje final fue: ${puntos} / ${preguntasJugadas}`;
      document.getElementById("tiempo").textContent = "";

      fetch('https://backend-rocket-k6wn.onrender.com/api/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: "jugador",
          puntaje: puntos,
          nivel: nivelesSeleccionados.length,
          preguntas_jugadas: preguntasJugadas
        })
      })
      .then(res => res.json())
      .then(data => console.log("Resultado guardado:", data))
      .catch(err => console.error("Error al guardar resultado:", err));
    }
  }
}

function answer(seleccion) {
  clearInterval(temporizador);

  const preguntas = niveles[nivelActual];
  const correcta = preguntas[indice].respuesta;
  const esCorrecto = seleccion === correcta;

  document.getElementById("feedback").textContent = seleccion === null
    ? "⏰ Se acabó el tiempo..."
    : esCorrecto
      ? "😊 ¡Correcto!"
      : "🙃 Ups... incorrecto";

  preguntasJugadas++;
  if (esCorrecto) puntos++;

  document.getElementById("score").textContent = `🌟 Puntos: ${puntos}`;
  indice++;
  setTimeout(mostrarPregunta, 1500);
}

mostrarPregunta();
