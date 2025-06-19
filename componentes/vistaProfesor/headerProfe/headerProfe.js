function headerProf(){

    let headerPr = document.createElement('header');
    headerPr.className = "header-pr";

    let dImgLHead = document.createElement('div');
    dImgLHead.className = "d-img-l-head";

    let imgLProf = document.createElement('img');
    imgLProf.className = "img-l-head";
    imgLProf.src = "https://github.com/Leibril2007/img_rocketPlay/blob/main/image.png?raw=true";
    dImgLHead.appendChild(imgLProf)
    headerPr.appendChild(dImgLHead);

    let titJuegHead = document.createElement('h1');
    titJuegHead.className = "tit-jueg-head";
    titJuegHead.textContent = "Rocket Play";

    headerPr.appendChild(titJuegHead);

    return headerPr;

}

export { headerProf };