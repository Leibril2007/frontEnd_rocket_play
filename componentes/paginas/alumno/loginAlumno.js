document.getElementById("contenedor").innerHTML = `
  <div class="container">
    <h3>elige tu avatar</h3>
    <div class="avatar-box" id="avatarBox">
      ${["😀", "😇", "😅", "😂", "😎", "😠", "😡", "😲", "😴", "😢", "😤", "😷", "🥴", "🤓", "😕", "🤯", "😬", "🥵", "🥶", "🤠", "🤡", "🤥", "😑", "😶", "🙄", "😳", "😈", "👿", "👻", "👽"]
        .map(emoji => `<span>${emoji}</span>`)
        .join("")}
    </div>
    <div>
      <label for="usuario">usuario</label><br/>
      <input type="text" id="usuario" placeholder="Tu nombre" />
    </div>
    <div>
      <label for="codigo">codigo</label><br/>
      <input type="text" id="codigo" placeholder="XXX" />
    </div>
    <button onclick="enviarDatos()">listo</button>
  </div>
`;

const avatarBox = document.getElementById("avatarBox");
let seleccionado = null;

avatarBox.addEventListener("click", e => {
  if (e.target.tagName === "SPAN") {
    if (seleccionado) seleccionado.classList.remove("selected");
    e.target.classList.add("selected");
    seleccionado = e.target;
  }
});

function enviarDatos() {
  const usuario = document.getElementById("usuario").value;
  const codigo = document.getElementById("codigo").value;
  const avatar = seleccionado ? seleccionado.textContent : "Ninguno";

  alert(`Usuario: ${usuario}\nCódigo: ${codigo}\nAvatar: ${avatar}`);
}
