// Crear contenedor
const contenedor = document.createElement('div');
contenedor.className = 'ventana-info';

// Crear elementos de texto
const tiempoTexto = document.createElement('p');
tiempoTexto.innerHTML = '⏱️ Tiempo: <span id="tiempo">0</span> segundos';

const nivelTexto = document.createElement('p');
nivelTexto.innerHTML = '🎮 Nivel: <span id="nivel">1</span>';

// Añadir al contenedor
contenedor.appendChild(tiempoTexto);
contenedor.appendChild(nivelTexto);

// Añadir al body
document.body.appendChild(contenedor);

// Función para obtener datos del backend
const tiempoElem = document.getElementById("tiempo");
const nivelElem = document.getElementById("nivel");

setInterval(() => {
    let cod = localStorage.getItem("codBd");

    if (!cod) {
        console.error("❌ No hay código en localStorage (codBd)");
        return;
    }

    fetch(`http://localhost:3000/estado-juego/${cod}`)
        .then(res => res.json())
        .then(data => {
            tiempoElem.textContent = data.tiempo;
            nivelElem.textContent = data.nivel;
        })
        .catch(err => console.error('Error:', err));
}, 1000);