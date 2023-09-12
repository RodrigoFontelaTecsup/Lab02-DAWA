function enviarFormulario() {
  window.location.href = 'confirmacion.html';
}

const botonEnviar = document.getElementById('boton-enviar');
botonEnviar.addEventListener('click', enviarFormulario);
