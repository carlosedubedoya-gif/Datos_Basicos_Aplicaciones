// ============================================================
// EJERCICIO 4 - DICCIONARIOS
// Estructura: Objeto/Map como diccionario
// Registro de estudiantes: código (clave) → {nombre, nota}
// ============================================================

class RegistroEstudiantes {
  constructor() {
    this.diccionario = {}; // clave: código, valor: {nombre, nota}
  }

  // Agrega un estudiante, valida que el código no exista
  agregar(codigo, nombre, nota) {
    if (this.existe(codigo)) return false;
    this.diccionario[codigo] = { nombre, nota: parseFloat(nota) };
    return true;
  }

  // Busca un estudiante por código
  buscar(codigo) {
    if (!this.existe(codigo)) return null;
    return this.diccionario[codigo];
  }

  // Actualiza la nota de un estudiante
  actualizarNota(codigo, nuevaNota) {
    if (!this.existe(codigo)) return false;
    this.diccionario[codigo].nota = parseFloat(nuevaNota);
    return true;
  }

  // Elimina un estudiante
  eliminar(codigo) {
    if (!this.existe(codigo)) return false;
    delete this.diccionario[codigo];
    return true;
  }

  // Verifica si el código existe
  existe(codigo) {
    return Object.prototype.hasOwnProperty.call(this.diccionario, codigo);
  }

  // Retorna todos los estudiantes como array
  todos() {
    return Object.entries(this.diccionario).map(([codigo, datos]) => ({
      codigo,
      ...datos
    }));
  }

  // Calcula el promedio de notas
  promedio() {
    const estudiantes = this.todos();
    if (estudiantes.length === 0) return 0;
    const suma = estudiantes.reduce((acc, e) => acc + e.nota, 0);
    return (suma / estudiantes.length).toFixed(2);
  }
}

// ---- Instancia global ----
const registro = new RegistroEstudiantes();

function mostrarTodos() {
  const estudiantes = registro.todos();
  const contenedor = document.getElementById("tablaEstudiantes");

  if (estudiantes.length === 0) {
    contenedor.innerHTML = `<p class="pila-vacia">📭 No hay estudiantes registrados</p>`;
    return;
  }

  let html = `<table>
    <thead>
      <tr><th>Código</th><th>Nombre</th><th>Nota Final</th></tr>
    </thead><tbody>`;

  estudiantes.forEach(e => {
    html += `<tr>
      <td>${e.codigo}</td>
      <td>${e.nombre}</td>
      <td>${e.nota}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  html += `<p><strong>Promedio de notas:</strong> ${registro.promedio()}</p>`;
  contenedor.innerHTML = html;
}

function agregarEstudiante() {
  const codigo = document.getElementById("inputCodigo").value.trim();
  const nombre = document.getElementById("inputNombre").value.trim();
  const nota = document.getElementById("inputNota").value.trim();

  if (!codigo || !nombre || nota === "") {
    mostrarMensajeDic("Completa todos los campos: código, nombre y nota.", "error");
    return;
  }

  const notaNum = parseFloat(nota.replace(',', '.'));
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
    mostrarMensajeDic("La nota debe ser un número entre 0 y 5.", "error");
    return;
  }

  if (!registro.agregar(codigo, nombre, notaNum)) {
    mostrarMensajeDic(`❌ El código "${codigo}" ya existe en el registro.`, "error");
    return;
  }

  document.getElementById("inputCodigo").value = "";
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputNota").value = "";
  mostrarMensajeDic(`✅ Estudiante "${nombre}" registrado correctamente.`, "exito");
  mostrarTodos();
}

function buscarEstudiante() {
  const codigo = document.getElementById("inputBuscar").value.trim();
  if (!codigo) {
    mostrarMensajeDic("Ingresa un código para buscar.", "error");
    document.getElementById("resultadoBusqueda").innerHTML = "";
    return;
  }

  const estudiante = registro.buscar(codigo);
  if (!estudiante) {
    mostrarMensajeDic(`❌ No se encontró ningún estudiante con el código "${codigo}".`, "error");
    document.getElementById("resultadoBusqueda").innerHTML = "";
    return;
  }

  // Mostrar resultado en el div
  const resultadoDiv = document.getElementById("resultadoBusqueda");
  resultadoDiv.innerHTML = `
    <div class="resultado-encontrado">
      <h3>Estudiante encontrado:</h3>
      <p><strong>Código:</strong> ${codigo}</p>
      <p><strong>Nombre:</strong> ${estudiante.nombre}</p>
      <p><strong>Nota Final:</strong> ${estudiante.nota}</p>
    </div>
  `;
  mostrarMensajeDic(`✅ Estudiante encontrado.`, "exito");
}

function actualizarNota() {
  const codigo = document.getElementById("inputActCodigo").value.trim();
  const nuevaNota = document.getElementById("inputActNota").value.trim();

  if (!codigo || nuevaNota === "") {
    mostrarMensajeDic("Ingresa el código y la nueva nota.", "error");
    return;
  }

  const notaNum = parseFloat(nuevaNota.replace(',', '.'));
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
    mostrarMensajeDic("La nota debe ser un número entre 0 y 5.", "error");
    return;
  }

  if (!registro.existe(codigo)) {
    mostrarMensajeDic(`❌ El código "${codigo}" no existe en el registro.`, "error");
    return;
  }

  registro.actualizarNota(codigo, notaNum);
  mostrarMensajeDic(`✅ Nota actualizada para el código "${codigo}".`, "exito");
  mostrarTodos();
  // Limpiar resultado de búsqueda para evitar mostrar datos obsoletos
  document.getElementById("resultadoBusqueda").innerHTML = "";
}

function eliminarEstudiante() {
  const codigo = document.getElementById("inputEliminarCodigo").value.trim();
  if (!codigo) {
    mostrarMensajeDic("Ingresa el código del estudiante a eliminar.", "error");
    return;
  }

  if (!registro.existe(codigo)) {
    mostrarMensajeDic(`❌ El código "${codigo}" no existe en el registro.`, "error");
    return;
  }

  registro.eliminar(codigo);
  document.getElementById("inputEliminarCodigo").value = "";
  mostrarMensajeDic(`✅ Estudiante con código "${codigo}" eliminado.`, "exito");
  mostrarTodos();
  // Limpiar resultado de búsqueda
  document.getElementById("resultadoBusqueda").innerHTML = "";
}

function mostrarMensajeDic(msg, tipo) {
  const el = document.getElementById("mensajeDic");
  el.textContent = msg;
  el.className = tipo === "error" ? "mensaje-error" : "mensaje-exito";
}
