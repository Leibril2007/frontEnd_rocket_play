let inicioRocket = document.querySelector('#principal');

function inicioApp() {
    let secPrincipal = document.createElement('section');
    secPrincipal.className = "sec-principal";

    let baseTitLogPrin = document.createElement('div');
    baseTitLogPrin.className = "base-tit-log-prin";

    let dImgLPrin = document.createElement('div');
    dImgLPrin.className = "d-img-l-prin";

    let imgLPrin = document.createElement('img');
    imgLPrin.className = "img-l-prin";
    imgLPrin.src = "https://github.com/Leibril2007/img_rocketPlay/blob/main/image.png?raw=true";

    let titRPPrin = document.createElement('h1');
    titRPPrin.className = "tit-r-p-prin";
    titRPPrin.textContent = "Rocket Play";

    dImgLPrin.appendChild(imgLPrin);
    baseTitLogPrin.appendChild(dImgLPrin);
    baseTitLogPrin.appendChild(titRPPrin);
    secPrincipal.appendChild(baseTitLogPrin);

    let pregPrin = document.createElement('h1');
    pregPrin.className = "preg-prin";
    pregPrin.textContent = "¿Eres alumno o maestro?";
    secPrincipal.appendChild(pregPrin);

    let btnAlumPrin = document.createElement('div');
    btnAlumPrin.className = "btn-prin-gen btn-alum-prin";
    btnAlumPrin.textContent = "Alumno";
    secPrincipal.appendChild(btnAlumPrin);

    let btnProfPrin = document.createElement('div');
    btnProfPrin.className = "btn-prin-gen btn-prof-prin";
    btnProfPrin.textContent = "Maestro";
    secPrincipal.appendChild(btnProfPrin);

    btnProfPrin.addEventListener("click", function(){
        window.location.href = "componentes/paginas/paginasProfesor/loginProfesor.html";
    })

    

    return secPrincipal;
}

inicioRocket.appendChild(inicioApp());

export { inicioApp };