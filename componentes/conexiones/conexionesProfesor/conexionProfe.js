function enviarCodigoJuego(codigoRec, estRec, nombreJuego, nivSel, timeSel){

    fetch('http://localhost:3000/partidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codigo: codigoRec,
            estado: estRec,
            juego: nombreJuego,
            niveles: nivSel,
            tiempo: timeSel
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

export { enviarCodigoJuego };