//import { ventConfigNivel } from "../configuracionJuego/configuracionJuego.js";
import { headerProf } from "../headerProfe/headerProfe.js";

let pageProfesor = document.querySelector('#seccionProfesor');

pageProfesor.appendChild(headerProf());

function cargarJuegos(){

    let secProfesor = document.createElement('section');
    secProfesor.className = "sec-profesor";

    let titSecJuegProf =  document.createElement('h2');
    titSecJuegProf.className = "tit-sec-jueg-prof tit-conf-p";
    titSecJuegProf.textContent = "¿Qué jugaremos hoy?";
    secProfesor.appendChild(titSecJuegProf);

    let divMemProf = document.createElement('div');
    divMemProf.className = "cuadro-juego div-mem-prof";
    secProfesor.appendChild(divMemProf);

    let titMemP =  document.createElement('h3');
    titMemP.className = "tit-jueg-p tit-mem-p";
    titMemP.textContent = "Space Card";
    secProfesor.appendChild(titMemP);

    divMemProf.addEventListener("click", function(){
        window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })


    let divEmoProf = document.createElement('div');
    divEmoProf.className = "cuadro-juego div-emo-prof";
    secProfesor.appendChild(divEmoProf);

    let titEmoP =  document.createElement('h3');
    titEmoP.className = "tit-jueg-p tit-emo-p";
    titEmoP.textContent = "Emoji Game";
    secProfesor.appendChild(titEmoP);

    let divSimonProf = document.createElement('div');
    divSimonProf.className = "cuadro-juego div-simon-prof";
    secProfesor.appendChild(divSimonProf);

    let titSimonP =  document.createElement('h3');
    titSimonP.className = "tit-jueg-p tit-simon-p";
    titSimonP.textContent = "Simon Dice";
    secProfesor.appendChild(titSimonP);

    let divMedAmP = document.createElement('div');
    divMedAmP.className = "cuadro-juego div-med-am-p";
    secProfesor.appendChild(divMedAmP);

    let titMedAmP =  document.createElement('h3');
    titMedAmP.className = "tit-jueg-p tit-med-am-p";
    titMedAmP.textContent = "Recicla y Gana";
    secProfesor.appendChild(titMedAmP);

/*     let titTimeP =  document.createElement('h2');
    titTimeP.className = "tit-time-p tit-conf-p";
    titTimeP.textContent = "Tiempo para cada nivel";
    secProfesor.appendChild(titTimeP); */


    return secProfesor;

}

pageProfesor.appendChild(cargarJuegos());