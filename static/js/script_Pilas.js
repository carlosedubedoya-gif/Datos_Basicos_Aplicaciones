// ============================================================
// EJERCICIO 2 - PILAS (UNDO)
// Estructura: Stack (LIFO) - Last In First Out
// ============================================================

class Pila {
  constructor() {
    this.stack = [];
  }

  // push: agrega una acción al tope de la pila
  push(accion) {
    this.stack.push(accion);
    return this.stack;
  }

  // pop: elimina y retorna la última acción, valida si está vacía
  pop() {
    if (this.estaVacia()) return null;
    return this.stack.pop();
  }

  // peek: retorna la última acción sin eliminarla
  peek() {
    if (this.estaVacia()) return null;
    return this.stack[this.stack.length - 1];
  }

  estaVacia() {
    return this.stack.length === 0;
  }

  tamanio() {
    return this.stack.length;
  }

  // Retorna copia del stack para mostrar
  print() {
    return [...this.stack];
  }
}

// ---- Instancia global ----
const pila = new Pila();

function mostrarEstadoPila() {
  const estado = pila.print();
  const contenedor = document.getElementById("estadoPila");

  if (estado.length === 0) {
    contenedor.innerHTML = `<p class="pila-vacia">📭 La pila está vacía</p>`;
    return;
  }

  let html = `<div class="pila-visual">`;
  // Mostrar de arriba hacia abajo (tope primero)
  for (let i = estado.length - 1; i >= 0; i--) {
    const esTope = i === estado.length - 1;
    html += `<div class="pila-elemento ${esTope ? 'tope' : ''}">
      ${esTope ? '👆 TOPE → ' : ''}"${estado[i]}"
    </div>`;
  }
  html += `</div>`;
  html += `<p><strong>Total acciones:</strong> ${pila.tamanio()}</p>`;
  contenedor.innerHTML = html;
}

function agregarAccion() {
  const input = document.getElementById("inputAccion");
  const accion = input.value.trim();

  if (!accion) {
    mostrarMensajePila("Ingresa una acción válida.", "error");
    return;
  }

  if (accion.toLowerCase() === "fin") {
    mostrarMensajePila("ℹ️ Escribe 'fin' solo en el modo de ingreso múltiple.", "error");
    return;
  }

  pila.push(accion);
  input.value = "";
  mostrarMensajePila(`✅ Acción "${accion}" agregada a la pila.`, "exito");
  mostrarEstadoPila();
}

function ingresarMultiples() {
  const texto = document.getElementById("inputMultiples").value.trim();
  if (!texto) {
    mostrarMensajePila("Ingresa acciones separadas por coma o escribe 'fin' al final.", "error");
    return;
  }

  const acciones = texto.split(",").map(a => a.trim()).filter(a => a && a.toLowerCase() !== "fin");

  if (acciones.length === 0) {
    mostrarMensajePila("No se encontraron acciones válidas.", "error");
    return;
  }

  acciones.forEach(a => pila.push(a));
  document.getElementById("inputMultiples").value = "";
  mostrarMensajePila(`✅ Se agregaron ${acciones.length} acciones a la pila.`, "exito");
  mostrarEstadoPila();
}

function deshacerAccion() {
  if (pila.estaVacia()) {
    mostrarMensajePila("❌ No se puede deshacer: la pila está vacía.", "error");
    return;
  }

  const accion = pila.pop();
  mostrarMensajePila(`↩️ Acción deshecha: "${accion}"`, "exito");
  mostrarEstadoPila();
}

function verUltimaAccion() {
  if (pila.estaVacia()) {
    mostrarMensajePila("❌ La pila está vacía, no hay acciones para ver.", "error");
    return;
  }

  const accion = pila.peek();
  mostrarMensajePila(`👁️ Última acción (sin eliminar): "${accion}"`, "exito");
}

function mostrarMensajePila(msg, tipo) {
  const el = document.getElementById("mensajePila");
  el.textContent = msg;
  el.className = tipo === "error" ? "mensaje-error" : "mensaje-exito";
}
