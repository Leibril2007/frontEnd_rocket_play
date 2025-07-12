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
        return isNaN(num) ? 1 : Math.max(1, Math.min(num, 10)); // Asegura que esté entre 1 y 10
      });
    }
    nivelesSeleccionados = [...new Set(arr.filter(n => !isNaN(n) && n > 0 && n <= 10))]; // Elimina duplicados
    if (nivelesSeleccionados.length === 0) nivelesSeleccionados = [1];
  } catch (e) {
    console.warn("Error al leer nivelesBd", e);
    nivelesSeleccionados = [1];
  }
} else {
  nivelesSeleccionados = [1];
}

// Obtener tiempo de localStorage
let tiempoBase = 20; // Valor por defecto
const tiempoRaw = localStorage.getItem("tiempoBd");
if (tiempoRaw) {
  try {
    const tiempoConfig = parseInt(JSON.parse(tiempoRaw));
    if (!isNaN(tiempoConfig) && tiempoConfig > 0) {
      tiempoBase = tiempoConfig;
    }
  } catch (e) {
    console.warn("Error al leer tiempoBd", e);
  }
}

let indiceNivelActual = 0;
let preguntasPorNivel = 1;
let puntaje = 0;
let vidas = 3;
let tiempo = 10;
let temporizador;
let preguntasJugadas = 0;
let totalPreguntas = 0;

const preguntas = [
  { pregunta: "¿Cuál es la capital de Francia?", opciones: ["Berlín", "París", "Madrid", "Roma"], correcta: 1 },
  { pregunta: "¿Qué planeta es conocido como el 'Planeta Rojo'?", opciones: ["Venus", "Marte", "Júpiter", "Saturno"], correcta: 1 },
  { pregunta: "¿Quién pintó 'La Mona Lisa'?", opciones: ["Van Gogh", "Picasso", "Da Vinci", "Dalí"], correcta: 2 },
  { pregunta: "¿Cuál es el río más largo del mundo?", opciones: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correcta: 1 },
  { pregunta: "¿En qué año llegó el hombre a la Luna?", opciones: ["1965", "1969", "1972", "1958"], correcta: 1 },
  { pregunta: "¿Cuál es el océano más grande?", opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"], correcta: 2 },
  { pregunta: "¿Quién escribió 'Cien años de soledad'?", opciones: ["Vargas Llosa", "G. García Márquez", "P. Neruda", "J. Cortázar"], correcta: 1 },
  { pregunta: "¿Qué gas usan las plantas?", opciones: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"], correcta: 2 },
  { pregunta: "¿Cuánto es 12 x 8?", opciones: ["96", "86", "108", "112"], correcta: 0 },
  { pregunta: "¿Quién inventó la bombilla?", opciones: ["Tesla", "Edison", "Franklin", "Newton"], correcta: 1 },
  { pregunta: "¿Dónde se originaron los Juegos Olímpicos?", opciones: ["Roma", "Grecia", "Egipto", "Persia"], correcta: 1 },
  { pregunta: "¿Qué animal es el más rápido?", opciones: ["León", "Chita", "Tigre", "Antílope"], correcta: 1 },
  { pregunta: "¿Cuál es el idioma más hablado?", opciones: ["Inglés", "Chino", "Español", "Hindi"], correcta: 1 },
  { pregunta: "¿Cuál es el país más grande del mundo?", opciones: ["EE.UU.", "Canadá", "Rusia", "China"], correcta: 2 },
  { pregunta: "¿Cuántos huesos tiene el cuerpo humano?", opciones: ["206", "201", "210", "198"], correcta: 0 },
  { pregunta: "¿Qué instrumento tiene teclas negras y blancas?", opciones: ["Violín", "Piano", "Flauta", "Guitarra"], correcta: 1 },
  { pregunta: "¿Qué planeta tiene anillos?", opciones: ["Tierra", "Venus", "Saturno", "Marte"], correcta: 2 },
  { pregunta: "¿Quién descubrió América?", opciones: ["Magallanes", "Colón", "Pizarro", "Cortés"], correcta: 1 },
  { pregunta: "¿Cuál es el símbolo químico del oro?", opciones: ["Au", "Ag", "Go", "Or"], correcta: 0 },
  { pregunta: "¿Cuántos continentes hay?", opciones: ["5", "6", "7", "4"], correcta: 2 },
  { pregunta: "¿Qué animal pone huevos?", opciones: ["Ballena", "Murciélago", "Gallina", "León"], correcta: 2 },
  { pregunta: "¿Cuál es el resultado de 5²?", opciones: ["10", "20", "25", "15"], correcta: 2 },
  { pregunta: "¿Qué forma tiene una pelota de fútbol?", opciones: ["Cubo", "Esfera", "Cilindro", "Pirámide"], correcta: 1 },
  { pregunta: "¿Dónde vive el pingüino?", opciones: ["Ártico", "África", "Antártida", "Amazonas"], correcta: 2 },
  { pregunta: "¿Qué día sigue al viernes?", opciones: ["Jueves", "Sábado", "Domingo", "Lunes"], correcta: 1 },
  { pregunta: "¿Qué significa 'WWW'?", opciones: ["World Web Wave", "World Wide Web", "Web Wide World", "Wide Web Work"], correcta: 1 },
  { pregunta: "¿Qué número sigue al 99?", opciones: ["100", "101", "98", "99.5"], correcta: 0 },
  { pregunta: "¿Qué animal ruge?", opciones: ["Gato", "León", "Loro", "Tortuga"], correcta: 1 },
  { pregunta: "¿Qué color resulta al mezclar azul y amarillo?", opciones: ["Verde", "Naranja", "Rojo", "Violeta"], correcta: 0 },
  { pregunta: "¿Qué se usa para medir temperatura?", opciones: ["Regla", "Balanza", "Termómetro", "Cronómetro"], correcta: 2 }
];
let disponibles = [...preguntas];

function cargarPregunta() {
  if (preguntasJugadas >= preguntasPorNivel || vidas <= 0 || disponibles.length === 0) {
    if (vidas <= 0 || disponibles.length === 0) {
      mostrarResultados(true);
    } else if (indiceNivelActual >= nivelesSeleccionados.length - 1) {
      mostrarResultados(false);
    } else {
      pasarDeNivel();
    }
    return;
  }

  const index = Math.floor(Math.random() * disponibles.length);
  const pregunta = disponibles.splice(index, 1)[0];

  totalPreguntas++;
  const nivelActual = nivelesSeleccionados[indiceNivelActual];
  document.getElementById("pregunta").textContent = pregunta.pregunta;
  document.getElementById("nivel").textContent = nivelActual;

  const opcionesContainer = document.getElementById("opciones");
  opcionesContainer.innerHTML = "";
  pregunta.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.onclick = () => verificarRespuesta(i === pregunta.correcta);
    opcionesContainer.appendChild(btn);
  });

  tiempo = tiempoBase; // Usamos el valor configurado
  document.getElementById("tiempo").textContent = tiempo;  
  
  clearInterval(temporizador);
  temporizador = setInterval(() => {
    tiempo--;
    document.getElementById("tiempo").textContent = tiempo;
    if (tiempo <= 0) {
      clearInterval(temporizador);
      perderVida();
    }
  }, 1000);
}

function verificarRespuesta(esCorrecta) {
  clearInterval(temporizador);
  if (esCorrecta) {
    puntaje += 10;
    document.getElementById("puntaje").textContent = puntaje;
  } else {
    perderVida();
    return;
  }
  preguntasJugadas++;
  setTimeout(cargarPregunta, 1000);
}

function perderVida() {
  vidas--;
  preguntasJugadas++;
  document.getElementById("vidas").textContent = "❤️".repeat(Math.max(0, vidas));
  if (vidas <= 0) {
    mostrarResultados(true);
  } else {
    setTimeout(cargarPregunta, 1000);
  }
}

function pasarDeNivel() {
  indiceNivelActual++;
  preguntasPorNivel++;
  preguntasJugadas = 0;
  cargarPregunta();
}

function mostrarResultados(perdio = false) {
  clearInterval(temporizador);
  document.getElementById("gameTab").classList.remove("active");
  document.getElementById("resultTab").classList.add("active");
  
  const nivelAlcanzado = nivelesSeleccionados[indiceNivelActual] || nivelesSeleccionados[nivelesSeleccionados.length-1];

  document.getElementById("tituloResultado").textContent = perdio ? "😞 Has perdido" : "🎉 ¡Juego completado!";

  const mensaje = `
    <p>Nivel alcanzado: ${nivelAlcanzado}</p>
    <p>Puntaje final: ${puntaje} pts</p>
    <p>Preguntas jugadas: ${totalPreguntas}</p>
    <p>Vidas restantes: ${vidas}</p>
    <p>${perdio ? "¡Te has quedado sin vidas!" : "¡Bien hecho, astronauta!"}</p>
    <p>Lugar obtenido: ${puntaje >= 70 ? "1° lugar" : puntaje >= 50 ? "2° lugar" : "3° lugar"}</p>
  `;
  document.getElementById("resultados").innerHTML = mensaje;

  fetch('https://backend-rocket-k6wn.onrender.com/api/resultadosDania', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nivel: nivelAlcanzado,
      puntaje,
      preguntas_jugadas: totalPreguntas,
      vidas_restantes: vidas
    })
  })
  .then(res => res.json())
  .then(data => console.log('✅ Resultado guardado:', data))
  .catch(err => console.error('❌ Error al guardar resultado:', err));
}

function descargarResultados() {
  const nivelAlcanzado = nivelesSeleccionados[indiceNivelActual] || nivelesSeleccionados[nivelesSeleccionados.length-1];
  const texto = `
Trivia Espacial - Resultados Finales
-------------------------------------
Nivel alcanzado: ${nivelAlcanzado}
Puntaje final: ${puntaje} pts
Preguntas jugadas: ${totalPreguntas}
Vidas restantes: ${vidas}
Lugar obtenido: ${puntaje >= 70 ? "1° lugar" : puntaje >= 50 ? "2° lugar" : "3° lugar"}
-------------------------------------
Gracias por jugar.
  `;
  const blob = new Blob([texto], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resultados_trivia.txt";
  link.click();
}

cargarPregunta();
