const niveles = [
    { id: 1, objetivo: "😺", opciones: ["😺", "🐶", "🐵", "🦊", "🐯", "🐸"] },
    { id: 2, objetivo: "🎈", opciones: ["🎂", "🎉", "🎈", "🎁", "🎃", "🎊"] },
    { id: 3, objetivo: "🍕", opciones: ["🌭", "🍔", "🍕", "🍟", "🥪", "🍗"] },
    { id: 4, objetivo: "🌵", opciones: ["🌳", "🌲", "🌴", "🌵", "🌺", "🌾"] },
    { id: 5, objetivo: "🚀", opciones: ["🚁", "✈️", "🚀", "🚂", "🚗", "🛸"] },
    { id: 6, objetivo: "⚽", opciones: ["🏀", "🏈", "⚾", "🎾", "🏐", "⚽"] },
    { id: 7, objetivo: "🐙", opciones: ["🦑", "🦐", "🐠", "🐡", "🐙", "🦀"] },
    { id: 8, objetivo: "🧠", opciones: ["🫀", "🧠", "🦴", "🦷", "👁️", "👂"] },
    { id: 9, objetivo: "👑", opciones: ["🎩", "🧢", "👒", "👑", "🪖", "🥽"] },
    { id: 10, objetivo: "🧃", opciones: ["🥤", "🧃", "☕", "🍵", "🍼", "🍶"] }
  ];
  
  const tiempoRaw = localStorage.getItem("tiempoBd");
  const nivelesRaw = localStorage.getItem("nivelesBd");
  
  let tiempoPorNivel = 15;
  let nivelesSeleccionados = [];
  
  if (tiempoRaw) {
    try {
      const tiempoParseado = JSON.parse(tiempoRaw);
      const tiempoNum = parseInt(tiempoParseado);
      if (!isNaN(tiempoNum) && tiempoNum > 0) {
        tiempoPorNivel = tiempoNum;
      }
    } catch (e) {
      console.warn("⚠️ Error al leer tiempoBd:", e);
    }
  }
  
  if (nivelesRaw) {
    try {
      let arr;
      if (nivelesRaw.startsWith("[")) {
        arr = JSON.parse(nivelesRaw);
      } else {
        arr = nivelesRaw.split(',').map(n => parseInt(n.trim()));
      }
  
      nivelesSeleccionados = arr.filter(n => !isNaN(n) && n > 0 && n <= 10);
    } catch (e) {
      console.warn("⚠️ Error al leer nivelesBd:", e);
      nivelesSeleccionados = [];
    }
  }
  
  // Si no hay niveles válidos, usar todos por defecto
  if (nivelesSeleccionados.length === 0) {
    nivelesSeleccionados = [1,2,3,4,5,6,7,8,9,10];
  }
  
  // Nivel actual según índice en nivelesSeleccionados
  let nivelIndex = 0;
  let nivel = nivelesSeleccionados[nivelIndex];   

  let aciertos = 0;
  let fallos = 0;
  let vidas = 3;
  let inicioTiempo = Date.now();
  let tiempoRestante = tiempoPorNivel;
  let temporizador;
  
// Nivel completo
function cargarNivel() {
  if (vidas <= 0) return;

  const nivelActual = niveles.find(n => n.id === nivel);
  if (!nivelActual) {
    console.error("Nivel no encontrado:", nivel);
    mostrarResumen();
    return;
  }

  document.getElementById("nivel").textContent = nivelActual.id;
  document.getElementById("emoji-target").textContent = nivelActual.objetivo;
  actualizarVidas();

  const contenedor = document.getElementById("emoji-options");
  contenedor.innerHTML = "";

  nivelActual.opciones.forEach(e => {
    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = e;
    span.onclick = () => {
      clearInterval(temporizador);
      if (e === nivelActual.objetivo) {
        aciertos++;
        document.getElementById("next-level").style.display = "inline";
      } else {
        procesarFallo();
      }
    };
    contenedor.appendChild(span);
  });

  document.getElementById("next-level").style.display = "none";
  iniciarTemporizador();
}
  
  function actualizarVidas() {
    const vidasDiv = document.getElementById("vidas");
    if (vidasDiv) {
      vidasDiv.innerHTML = `Vidas: ${"❤️".repeat(vidas)}${"🤍".repeat(3 - vidas)}`;
    }
  }
  
  function procesarFallo() {
    fallos++;
    vidas--;
    actualizarVidas();
    if (vidas <= 0) {
      clearInterval(temporizador);
      mostrarResumen();
    } else {
      document.getElementById("next-level").style.display = "inline";
    }
  }
  
  function iniciarTemporizador() {
    tiempoRestante = tiempoPorNivel;
  
    let tiempoDisplay = document.getElementById("tiempo-restante");
    if (!tiempoDisplay) {
      tiempoDisplay = document.createElement("p");
      tiempoDisplay.id = "tiempo-restante";
      document.getElementById("game-container").appendChild(tiempoDisplay);
    }
  
    tiempoDisplay.textContent = `⏱ Tiempo: ${tiempoRestante}s`;
  
    temporizador = setInterval(() => {
      tiempoRestante--;
      tiempoDisplay.textContent = `⏱ Tiempo: ${tiempoRestante}s`;
      if (tiempoRestante <= 0) {
        clearInterval(temporizador);
        procesarFallo();
        tiempoDisplay.textContent = "⏱ Tiempo agotado!";
      }
    }, 1000);
  }
  
  document.getElementById("next-level").onclick = () => {
    const tiempoUI = document.getElementById("tiempo-restante");
    if (tiempoUI) tiempoUI.remove();
  
    nivelIndex++;
    if (nivelIndex >= nivelesSeleccionados.length || vidas <= 0) {
      mostrarResumen();
    } else {
      nivel = nivelesSeleccionados[nivelIndex];
      cargarNivel();
    }
  };
  
  function mostrarResumen() {
    const tiempoTotal = Math.floor((Date.now() - inicioTiempo) / 1000);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("summary").style.display = "block";
    document.getElementById("aciertos").textContent = aciertos;
    document.getElementById("fallos").textContent = fallos;
    document.getElementById("tiempo-total").textContent = tiempoTotal;
  
    const puntuacion = aciertos * 10 - fallos * 5 - tiempoTotal;
    let ranking;
  
    if (puntuacion >= 70) {
      ranking = "🥇 Oro – ¡Emoji Maestro!";
    } else if (puntuacion >= 40) {
      ranking = "🥈 Plata – ¡Buen trabajo!";
    } else if (puntuacion >= 20) {
      ranking = "🥉 Bronce – ¡Sigue practicando!";
    } else {
      ranking = "😿 Sin medalla – ¡No te rindas!";
    }
  
    document.getElementById("ranking").textContent = ranking;
  
    document.getElementById("descargar-resumen").onclick = () => {
      const resumen = `
  Resumen de Partida – Encuentra el Emoji
  ---------------------------------------
  ✅ Aciertos: ${aciertos}
  ❌ Fallos: ${fallos}
  ⏱ Tiempo total: ${tiempoTotal} segundos
  🏆 Ranking: ${ranking}
  `;
      const blob = new Blob([resumen], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resumen_partida.txt";
      link.click();
    };
  
    // Enviar partida al backend (sin nombre)
    fetch("https://backend-rocket-k6wn.onrender.com/api/partidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aciertos: aciertos,
        fallos: fallos,
        tiempo_total: tiempoTotal,
        ranking: ranking
      })
    })
    .then(res => res.json())
    .then(data => console.log("✅ Partida enviada:", data))
    .catch(err => console.error("❌ Error al enviar partida:", err));
  }
  
  cargarNivel();
  