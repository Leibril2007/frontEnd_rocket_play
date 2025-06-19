let loginProfe = document.querySelector('#loginProfe');

function cargarLoginProfe(){

    let secLogProf = document.createElement('section');
    secLogProf.className = "sec-log-prof";

    let dImgLProf = document.createElement('div');
    dImgLProf.className = "d-img-l-prof";

    let imgLProf = document.createElement('img');
    imgLProf.className = "img-l-prof";
    imgLProf.src = "https://github.com/Leibril2007/img_rocketPlay/blob/main/image.png?raw=true";
    dImgLProf.appendChild(imgLProf)
    secLogProf.appendChild(dImgLProf);

    let bnvProf = document.createElement('h2');
    bnvProf.className = "bnv-prof";
    bnvProf.textContent = "¡Bienvenido a Rocket Play!";
    secLogProf.appendChild(bnvProf);

    let titLProf = document.createElement('h2');
    titLProf.className = "tit-gen-prof tit-l-prof";
    titLProf.textContent = "Login";
    secLogProf.appendChild(titLProf);

    let titUsProf = document.createElement('h2');
    titUsProf.className = "tit-us-prof tit-gen-prof";
    titUsProf.textContent = "Usuario o correo";
    secLogProf.appendChild(titUsProf);

    let inpUserProf = document.createElement('input');
    inpUserProf.className = "inp-prof inp-user-p";
    secLogProf.appendChild(inpUserProf);

    let titPassProf = document.createElement('h2');
    titPassProf.className = "tit-pas-prof tit-gen-prof";
    titPassProf.textContent = "Contraseña";
    secLogProf.appendChild(titPassProf);

    let inpPassProf = document.createElement('input');
    inpPassProf.className = "inp-prof inp-pass-p";
    secLogProf.appendChild(inpPassProf);

    let diIngPLog = document.createElement('div');
    diIngPLog.className = "di-ing-p-log";
    diIngPLog.textContent = "Ingresar";
    secLogProf.appendChild(diIngPLog);

    diIngPLog.addEventListener("click", async function(){

        let capturaUserEm = inpUserProf.value;
        let capturaPass = inpPassProf.value;

        const errorExistente = secLogProf.querySelector(".error");
        if (errorExistente) {
          errorExistente.remove();
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  usuario: capturaUserEm,
                  contraseña: capturaPass
                })
            })

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = document.createElement('p');
                errorMsg.className = "error";
                errorMsg.textContent = data.message || "Error al iniciar sesión";
                secLogProf.appendChild(errorMsg);
                return;
            }

            window.location.href = "../../paginas/paginasProfesor/configJuegos.html";


        } catch (error) {
            console.log("ERROR en alguna parte :v",error)
        }


    });

    
    return secLogProf;

}

loginProfe.appendChild(cargarLoginProfe());