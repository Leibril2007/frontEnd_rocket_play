import { headerProf } from "../headerProfe/headerProfe.js";

let codJuegoP = document.querySelector("#confJuegosP");

codJuegoP.appendChild(headerProf());

let estadoVar = "false";

function enviarCodigoJuego(codigoRec, estRec){

    fetch('http://localhost:3000/partidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codigo: codigoRec,
            estado: estRec
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar el usuario');
        }
        return response.json();
      })
      .then(data => {
        console.log('Codigo enviado con exito:', data);
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      }); 


}


// Función para generar un código de juego aleatorio
function generarCodigoJuego() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// Función para crear la sección con el código de juego y los jugadores
function cargarCodigoJuego() {
    let secCodP = document.createElement('section');
    secCodP.className = "secConfProf";

    let prtCreadaP =  document.createElement('h2');
    prtCreadaP.className = "prt-creada-p";
    prtCreadaP.textContent = "Partida Creada";
    secCodP.appendChild(prtCreadaP);

    // Genera un código único para cada partida
    let codGP = document.createElement('p');
    codGP.className = "cod-g-p";
    codGP.textContent = generarCodigoJuego(); // Código aleatorio generado
    secCodP.appendChild(codGP);

    let titJugP =  document.createElement('h3');
    titJugP.className = "prt-creada-p tit-jug-p";
    titJugP.textContent = "Jugadores";
    secCodP.appendChild(titJugP);

    let baseCadJug =  document.createElement('div');
    baseCadJug.className = "base-cad-jug";

    // Aquí podrías agregar los jugadores dinámicamente
    // Simulando un jugador para ejemplo
    let jugadores = [
        { nombre: 'usuario 1', avatar: 'avatar1.png' }, // Puedes obtener estos datos del backend
        { nombre: 'usuario 2', avatar: 'avatar2.png' }
    ];

    // Mostrar jugadores
    jugadores.forEach((jugador, index) => {
        let pNomUsuarioP = document.createElement('p');
        pNomUsuarioP.className = "p-nom-usuario-p";
        pNomUsuarioP.textContent = `${index + 1}. ${jugador.nombre}`;
        baseCadJug.appendChild(pNomUsuarioP);

        let avUsuP = document.createElement('span');
        avUsuP.className = "av-usu-p";
        avUsuP.textContent = jugador.avatar; // Aquí deberías agregar la imagen del avatar
        baseCadJug.appendChild(avUsuP);
    });

    secCodP.appendChild(baseCadJug);

    // Botón de iniciar juego (ahora como un <button>)
    let btnInJuegP = document.createElement('button');
    btnInJuegP.className = "btn-in-jueg-p";
    btnInJuegP.textContent = "Iniciar Juego";
    
    // Agregar un event listener al botón si es necesario (por ejemplo, para cambiar el estado de la partida)
    btnInJuegP.addEventListener('click', function() {
        // Aquí puedes agregar la lógica para iniciar la partida, como actualizar el estado en el backend
        console.log("Juego Iniciado");

        if(estadoVar == "false"){
            estadoVar = "true";
            let codGenerado = codGP.textContent;
            enviarCodigoJuego(codGenerado, estadoVar);
            alert("CODIGO ENVIADO");      
        }
    });
    
    secCodP.appendChild(btnInJuegP);
    
    return secCodP;
}

codJuegoP.appendChild(cargarCodigoJuego());
