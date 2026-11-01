// Navegación entre secciones.
const SECCIONES = [
  { clave: 'ventas', titulo: 'Venta', icono: 'bi-cart3', abrir: () => mostrarVentas() },
  { clave: 'libros', titulo: 'Libros', icono: 'bi-book', abrir: () => mostrarCatalogo('libros') },
  { clave: 'categorias', titulo: 'Categorías', icono: 'bi-tags', abrir: () => mostrarCatalogo('categorias') },
  { clave: 'autores', titulo: 'Autores', icono: 'bi-person-lines-fill', abrir: () => mostrarCatalogo('autores') },
];

function irA(clave) {
  document.querySelectorAll('#nav-secciones .nav-link').forEach((a) => a.classList.toggle('active', a.dataset.clave === clave));
  SECCIONES.find((s) => s.clave === clave).abrir();
}

document.getElementById('nav-secciones').innerHTML = SECCIONES.map((s) => `
  <li class="nav-item"><a class="nav-link" href="#" data-clave="${s.clave}"
    onclick="irA('${s.clave}'); return false;"><i class="bi ${s.icono} me-1"></i>${s.titulo}</a></li>`).join('');

irA('libros');
