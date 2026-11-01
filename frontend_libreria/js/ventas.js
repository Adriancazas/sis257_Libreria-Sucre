// Pantalla de venta: elegir cliente, agregar libros al carrito y registrar la venta.
let carrito = [];
let librosVenta = [];

async function mostrarVentas() {
  const seccion = document.getElementById('seccion');
  seccion.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-success"></div></div>';
  let clientes, ventas;
  try {
    [clientes, librosVenta, ventas] = await Promise.all([api('/clientes'), api('/libros'), api('/ventas')]);
  } catch (e) {
    seccion.innerHTML = '';
    return mostrarAlerta(e.message, 'danger');
  }
  carrito = [];
  seccion.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card"><div class="card-body">
          <h2 class="h4 mb-3"><i class="bi bi-cart3 me-2"></i>Nueva venta</h2>
          <div class="mb-3">
            <label class="form-label">Cliente</label>
            <div class="input-group">
              <select id="ventaCliente" class="form-select">
                <option value="">Seleccione...</option>
                ${clientes.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}
              </select>
              <button class="btn btn-outline-secondary" onclick="nuevoCliente()"><i class="bi bi-person-plus"></i> Nuevo</button>
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-7">
              <select id="ventaLibro" class="form-select">
                <option value="">Libro...</option>
                ${librosVenta.map((l) => `<option value="${l.id}">${esc(l.titulo)} — Bs ${Number(l.precio).toFixed(2)} (stock ${l.stock})</option>`).join('')}
              </select>
            </div>
            <div class="col-3"><input id="ventaCantidad" type="number" min="1" value="1" class="form-control"></div>
            <div class="col-2"><button class="btn btn-libreria w-100" onclick="agregarAlCarrito()"><i class="bi bi-plus-lg"></i></button></div>
          </div>
          <div id="carrito"></div>
          <button class="btn btn-libreria w-100 mt-3" onclick="registrarVenta()"><i class="bi bi-check2-circle me-1"></i>Registrar venta</button>
        </div></div>
      </div>
      <div class="col-lg-5">
        <div class="card"><div class="card-body">
          <h2 class="h5 mb-3"><i class="bi bi-receipt me-2"></i>Últimas ventas</h2>
          <ul class="list-group list-group-flush">
            ${ventas.slice(0, 8).map((v) => `
              <li class="list-group-item d-flex justify-content-between">
                <span>#${v.id} · ${esc(v.cliente?.nombre)}<br><small class="text-muted">${new Date(v.fecha).toLocaleString()}</small></span>
                <strong>Bs ${Number(v.total).toFixed(2)}</strong>
              </li>`).join('') || '<li class="list-group-item text-muted">Aún no hay ventas</li>'}
          </ul>
        </div></div>
      </div>
    </div>`;
  dibujarCarrito();
}

function agregarAlCarrito() {
  const libroId = Number(document.getElementById('ventaLibro').value);
  const cantidad = Number(document.getElementById('ventaCantidad').value);
  if (!libroId || cantidad < 1) return mostrarAlerta('Elige un libro y una cantidad válida', 'warning');
  const libro = librosVenta.find((l) => l.id === libroId);
  const existente = carrito.find((i) => i.libroId === libroId);
  if (existente) existente.cantidad += cantidad;
  else carrito.push({ libroId, titulo: libro.titulo, precio: Number(libro.precio), cantidad });
  dibujarCarrito();
}

function quitarDelCarrito(libroId) {
  carrito = carrito.filter((i) => i.libroId !== libroId);
  dibujarCarrito();
}

function dibujarCarrito() {
  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  document.getElementById('carrito').innerHTML = carrito.length
    ? `<table class="table table-sm align-middle">
        <thead><tr><th>Libro</th><th>Cant.</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${carrito.map((i) => `<tr><td>${esc(i.titulo)}</td><td>${i.cantidad}</td>
          <td>Bs ${(i.precio * i.cantidad).toFixed(2)}</td>
          <td><button class="btn btn-sm btn-outline-danger" onclick="quitarDelCarrito(${i.libroId})"><i class="bi bi-x"></i></button></td></tr>`).join('')}</tbody>
        <tfoot><tr><th colspan="2" class="text-end">Total</th><th colspan="2">Bs ${total.toFixed(2)}</th></tr></tfoot>
      </table>`
    : '<p class="text-muted text-center my-3">El carrito está vacío</p>';
}

async function nuevoCliente() {
  const nombre = prompt('Nombre del cliente:');
  if (!nombre || !nombre.trim()) return;
  try {
    await api('/clientes', 'POST', { nombre: nombre.trim() });
    mostrarAlerta('Cliente creado');
    mostrarVentas();
  } catch (e) {
    mostrarAlerta(e.message, 'danger');
  }
}

async function registrarVenta() {
  const clienteId = Number(document.getElementById('ventaCliente').value);
  if (!clienteId) return mostrarAlerta('Selecciona un cliente', 'warning');
  if (!carrito.length) return mostrarAlerta('Agrega al menos un libro', 'warning');
  try {
    const venta = await api('/ventas', 'POST', {
      clienteId,
      detalles: carrito.map((i) => ({ libroId: i.libroId, cantidad: i.cantidad })),
    });
    mostrarAlerta(`Venta #${venta.id} registrada. Total: Bs ${Number(venta.total).toFixed(2)}`);
    mostrarVentas();
  } catch (e) {
    mostrarAlerta(e.message, 'danger');
  }
}
