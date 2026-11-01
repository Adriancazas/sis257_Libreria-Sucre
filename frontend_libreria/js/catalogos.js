// CRUD genérico para los 3 catálogos: categorías, autores y libros.
const CATALOGOS = {
  categorias: {
    titulo: 'Categorías', icono: 'bi-tags', ruta: '/categorias',
    columnas: [
      { campo: 'id', titulo: 'ID' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'descripcion', titulo: 'Descripción' },
    ],
    campos: [
      { campo: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
    ],
  },
  autores: {
    titulo: 'Autores', icono: 'bi-person-lines-fill', ruta: '/autores',
    columnas: [
      { campo: 'id', titulo: 'ID' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'nacionalidad', titulo: 'Nacionalidad' },
    ],
    campos: [
      { campo: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { campo: 'nacionalidad', etiqueta: 'Nacionalidad', tipo: 'text' },
    ],
  },
  libros: {
    titulo: 'Libros', icono: 'bi-book', ruta: '/libros',
    columnas: [
      { campo: 'id', titulo: 'ID' },
      { campo: 'titulo', titulo: 'Título' },
      { campo: 'autor', titulo: 'Autor', mostrar: (l) => l.autor?.nombre },
      { campo: 'categoria', titulo: 'Categoría', mostrar: (l) => l.categoria?.nombre },
      { campo: 'precio', titulo: 'Precio (Bs)', mostrar: (l) => Number(l.precio).toFixed(2) },
      { campo: 'stock', titulo: 'Stock' },
    ],
    campos: [
      { campo: 'titulo', etiqueta: 'Título', tipo: 'text', requerido: true },
      { campo: 'isbn', etiqueta: 'ISBN', tipo: 'text' },
      { campo: 'precio', etiqueta: 'Precio (Bs)', tipo: 'number', step: '0.01', requerido: true },
      { campo: 'stock', etiqueta: 'Stock', tipo: 'number', step: '1', requerido: true },
      { campo: 'categoriaId', etiqueta: 'Categoría', tipo: 'select', origen: '/categorias', requerido: true, valorDe: (l) => l.categoria?.id },
      { campo: 'autorId', etiqueta: 'Autor', tipo: 'select', origen: '/autores', requerido: true, valorDe: (l) => l.autor?.id },
    ],
  },
};

let catalogoActual = null;
let registros = [];
let editandoId = null;

async function mostrarCatalogo(clave) {
  catalogoActual = CATALOGOS[clave];
  const seccion = document.getElementById('seccion');
  seccion.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-success"></div></div>';
  try {
    registros = await api(catalogoActual.ruta);
  } catch (e) {
    seccion.innerHTML = '';
    return mostrarAlerta(e.message, 'danger');
  }
  const c = catalogoActual;
  const filas = registros.map((r) => `
    <tr>
      ${c.columnas.map((col) => `<td>${esc(col.mostrar ? col.mostrar(r) : r[col.campo])}</td>`).join('')}
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-primary" onclick="abrirFormulario(${r.id})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminar(${r.id})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
  seccion.innerHTML = `
    <div class="card"><div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0"><i class="bi ${c.icono} me-2"></i>${c.titulo}</h2>
        <button class="btn btn-libreria" onclick="abrirFormulario()"><i class="bi bi-plus-lg me-1"></i>Nuevo</button>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead><tr>${c.columnas.map((col) => `<th>${col.titulo}</th>`).join('')}<th></th></tr></thead>
          <tbody>${filas || `<tr><td colspan="${c.columnas.length + 1}" class="text-center text-muted py-4">Sin registros</td></tr>`}</tbody>
        </table>
      </div>
    </div></div>`;
}

async function abrirFormulario(id = null) {
  editandoId = id;
  const c = catalogoActual;
  const registro = id ? registros.find((r) => r.id === id) : {};
  document.getElementById('modalTitulo').textContent = (id ? 'Editar ' : 'Nuevo ') + c.titulo.toLowerCase().replace(/s$/, '').replace(/ore$/, 'or');

  let html = '';
  for (const f of c.campos) {
    const valor = f.valorDe ? f.valorDe(registro) : registro[f.campo];
    let control;
    if (f.tipo === 'select') {
      const opciones = await api(f.origen);
      control = `<select class="form-select" name="${f.campo}" ${f.requerido ? 'required' : ''}>
        <option value="">Seleccione...</option>
        ${opciones.map((o) => `<option value="${o.id}" ${o.id === valor ? 'selected' : ''}>${esc(o.nombre)}</option>`).join('')}
      </select>`;
    } else {
      control = `<input class="form-control" name="${f.campo}" type="${f.tipo}" ${f.step ? `step="${f.step}"` : ''}
        value="${esc(valor)}" ${f.requerido ? 'required' : ''}>`;
    }
    html += `<div class="mb-3"><label class="form-label">${f.etiqueta}</label>${control}</div>`;
  }
  document.getElementById('modalCampos').innerHTML = html;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalForm')).show();
}

async function guardar(evento) {
  evento.preventDefault();
  const c = catalogoActual;
  const datos = {};
  for (const f of c.campos) {
    const valor = evento.target.elements[f.campo].value.trim();
    if (valor === '') continue; // los campos vacíos no se envían
    datos[f.campo] = f.tipo === 'number' || f.tipo === 'select' ? Number(valor) : valor;
  }
  try {
    if (editandoId) await api(`${c.ruta}/${editandoId}`, 'PATCH', datos);
    else await api(c.ruta, 'POST', datos);
    bootstrap.Modal.getInstance(document.getElementById('modalForm')).hide();
    mostrarAlerta(editandoId ? 'Registro actualizado' : 'Registro creado');
    mostrarCatalogo(Object.keys(CATALOGOS).find((k) => CATALOGOS[k] === c));
  } catch (e) {
    mostrarAlerta(e.message, 'danger');
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este registro?')) return;
  try {
    await api(`${catalogoActual.ruta}/${id}`, 'DELETE');
    mostrarAlerta('Registro eliminado');
    mostrarCatalogo(Object.keys(CATALOGOS).find((k) => CATALOGOS[k] === catalogoActual));
  } catch (e) {
    mostrarAlerta(e.message, 'danger');
  }
}

document.getElementById('formulario').addEventListener('submit', guardar);
