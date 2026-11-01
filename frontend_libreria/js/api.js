// Funciones para hablar con el backend.
async function api(ruta, metodo = 'GET', cuerpo = null) {
  const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (cuerpo) opciones.body = JSON.stringify(cuerpo);
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, opciones);
  } catch (e) {
    throw new Error('No se pudo conectar con el backend. ¿Está corriendo en ' + API_URL + '?');
  }
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const msg = datos && datos.message ? [].concat(datos.message).join(' | ') : 'Error ' + respuesta.status;
    throw new Error(msg);
  }
  return datos;
}

function mostrarAlerta(texto, tipo = 'success') {
  const el = document.getElementById('alerta');
  el.className = 'alert alert-' + tipo;
  el.textContent = texto;
  setTimeout(() => el.classList.add('d-none'), 5000);
}

function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
