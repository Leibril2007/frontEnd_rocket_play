//import { ventConfigNivel } from "../configuracionJuego/configuracionJuego.js";
import { headerProf } from "../headerProfe/headerProfe.js";

let pageProfesor = document.querySelector('#seccionProfesor');

pageProfesor.appendChild(headerProf());

function cargarJuegos(){

    let secProfesor = document.createElement('section');
    secProfesor.className = "sec-profesor";

    let titSecJuegProf =  document.createElement('h2');
    titSecJuegProf.className = "tit-sec-jueg-prof tit-conf-p    ";
    titSecJuegProf.textContent = "¿Qué jugaremos hoy?";
    secProfesor.appendChild(titSecJuegProf);

    /*-------------------- JUEGOS -------------------- */

    /* MEMORIA */

    let divMemProf = document.createElement('div');
    divMemProf.className = "cuadro-juego div-mem-prof";
    secProfesor.appendChild(divMemProf);

    let titMemP =  document.createElement('h3');
    titMemP.className = "tit-jueg-p tit-mem-p";
    titMemP.textContent = "Space Card";
    secProfesor.appendChild(titMemP);

    divMemProf.addEventListener("click", function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        }


        /* window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html"; */
    })

    /* EMOJIS */

    let divEmoProf = document.createElement('div');
    divEmoProf.className = "cuadro-juego div-emo-prof";
    secProfesor.appendChild(divEmoProf);
    divEmoProf.addEventListener("click", function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        }

        //window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })

    let titEmoP =  document.createElement('h3');
    titEmoP.className = "tit-jueg-p tit-emo-p";
    titEmoP.textContent = "Emoji Game";
    secProfesor.appendChild(titEmoP);
    

    /* SIMON DICE */

    let divSimonProf = document.createElement('div');
    divSimonProf.className = "cuadro-juego div-simon-prof";
    secProfesor.appendChild(divSimonProf);
    divSimonProf.addEventListener("click", function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        }

        //window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })

    let titSimonP =  document.createElement('h3');
    titSimonP.className = "tit-jueg-p tit-simon-p";
    titSimonP.textContent = "Simon Dice";
    secProfesor.appendChild(titSimonP);

    /* MEDIO AMBIENTE */

    let divMedAmP = document.createElement('div');
    divMedAmP.className = "cuadro-juego div-med-am-p";
    secProfesor.appendChild(divMedAmP);
    divMedAmP.addEventListener("click", function(){
        
        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
        //window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })

    let titMedAmP =  document.createElement('h3');
    titMedAmP.className = "tit-jueg-p tit-med-am-p";
    titMedAmP.textContent = "Recicla y Gana";
    secProfesor.appendChild(titMedAmP);

    /* JUEGO 5 */

    let divjueg5p = document.createElement('div');
    divjueg5p.className = "cuadro-juego div-jueg-5";
    secProfesor.appendChild(divjueg5p);
    divjueg5p.addEventListener("click", function(){
        
        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
        //window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })

    let titJueg5P =  document.createElement('h3');
    titJueg5P.className = "tit-jueg-p tit-jueg-5";
    titJueg5P.textContent = "Juego 5";
    secProfesor.appendChild(titJueg5P);


    /*-------------------- NIVELES -------------------- */
    let titNivP =  document.createElement('h2');
    titNivP.className = "tit-time-p tit-niv-p";
    titNivP.textContent = "Selecciona el nivel";
    secProfesor.appendChild(titNivP);

    let dvBaseNivP = document.createElement('div');
    dvBaseNivP.className = "dv-base-time-ps";


    let dvNiv1 =  document.createElement('div');
    dvNiv1.className = "dv-niv niv1";
    dvNiv1.textContent = "Nivel 1";
    dvBaseNivP.appendChild(dvNiv1);

    dvNiv1.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    let dvNiv2 =  document.createElement('div');
    dvNiv2.className = "dv-niv niv2";
    dvNiv2.textContent = "Nivel 2";
    dvBaseNivP.appendChild(dvNiv2);

    dvNiv2.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    let dvNiv3 =  document.createElement('div');
    dvNiv3.className = "dv-niv niv3";
    dvNiv3.textContent = "Nivel 3";
    dvBaseNivP.appendChild(dvNiv3);

    dvNiv3.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    let dvNiv4 =  document.createElement('div');
    dvNiv4.className = "dv-niv niv4";
    dvNiv4.textContent = "Nivel 4";
    dvBaseNivP.appendChild(dvNiv4);

    dvNiv4.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    secProfesor.appendChild(dvBaseNivP);


    /*-------------------- TIEMPO -------------------- */

    let titTimeP =  document.createElement('h2');
    titTimeP.className = "tit-time-p tit-conf-p";
    titTimeP.textContent = "Tiempo para cada nivel";
    secProfesor.appendChild(titTimeP);

    let dvBaseTimeP = document.createElement('div');
    dvBaseTimeP.className = "dv-base-time-ps";

    let dvTime20P =  document.createElement('div');
    dvTime20P.className = "dv-time veints";
    dvTime20P.textContent = "20s";
    dvBaseTimeP.appendChild(dvTime20P);

    dvTime20P.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });


    let dvTime30P =  document.createElement('div');
    dvTime30P.className = "dv-time treint";
    dvTime30P.textContent = "30s";
    dvBaseTimeP.appendChild(dvTime30P);

    dvTime30P.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    let dvTime40P =  document.createElement('div');
    dvTime40P.className = "dv-time cuar";
    dvTime40P.textContent = "40s";
    dvBaseTimeP.appendChild(dvTime40P);

    dvTime40P.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });

    let dvTime50P =  document.createElement('div');
    dvTime50P.className = "dv-time cinc";
    dvTime50P.textContent = "50s";
    dvBaseTimeP.appendChild(dvTime50P);

    dvTime50P.addEventListener('click', function(){

        if(!this.classList.contains("colorMarcar")){
            this.classList.add("colorMarcar");
        } else {
            this.classList.remove("colorMarcar");
        } 
        
    });


    secProfesor.appendChild(dvBaseTimeP);

    let btnCrearP = document.createElement('div');
    btnCrearP.className = "btn-crear-p";
    btnCrearP.textContent = "Crear";
    secProfesor.appendChild(btnCrearP);

    btnCrearP.addEventListener("click", function(){
        window.location.href = "../../paginas/paginasProfesor/codigoJuegoProfesor.html";
    })



    return secProfesor;

}

pageProfesor.appendChild(cargarJuegos());