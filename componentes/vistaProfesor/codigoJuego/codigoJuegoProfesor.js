import { headerProf } from "../headerProfe/headerProfe.js";

let codJuegoP = document.querySelector("#confJuegosP");

codJuegoP.appendChild(headerProf());

function cargarCodigoJuego(){
    let secCodP = document.createElement('section');
    secCodP.className = "secConfProf";

    let prtCreadaP =  document.createElement('h2');
    prtCreadaP.className = "prt-creada-p";
    prtCreadaP.textContent = "Partida Creada";
    secCodP.appendChild(prtCreadaP);

    let codGP = document.createElement('p');
    codGP.className = "cod-g-p";
    codGP.textContent = "ASK456";
    secCodP.appendChild(codGP);

    let titJugP =  document.createElement('h3');
    titJugP.className = "prt-creada-p tit-jug-p";
    titJugP.textContent = "Jugadores";
    secCodP.appendChild(titJugP);

    let baseCadJug =  document.createElement('div');
    baseCadJug.className = "base-cad-jug";
    
    let numJugP =  document.createElement('p');
    numJugP.className = "num-jug-p";
    numJugP.textContent = "1";
    secCodP.appendChild(titJugP);

    let pNomUsuarioP = document.createElement('p');
    pNomUsuarioP.className = "p-nom-usuario-p";
    pNomUsuarioP.textContent = "usuario 1";
    secCodP.appendChild(pNomUsuarioP);

    let avUsuP = document.createElement('span');
    avUsuP.className = "av-usu-p";
    avUsuP.textContent = "";
    secCodP.appendChild(avUsuP);

    let btnInJuegP = document.createElement('div');
    btnInJuegP.className = "btn-in-jueg-p";
    btnInJuegP.textContent = "Iniciar Juego";
    secCodP.appendChild(btnInJuegP);

    secCodP.appendChild(baseCadJug);

    
    return secCodP;
}

codJuegoP.appendChild(cargarCodigoJuego());


