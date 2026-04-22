// ============================================================
// EJERCICIO 3 - COLAS (Banco)
// Estructura: Cola real usando deque (double-ended queue)
// Principio FIFO - First In First Out
// ============================================================

class Cola {
  constructor() {
    this.deque = []; // Cola real implementada con array (deque)
  }

  // enqueue: agrega cliente al final de la cola
  enqueue(cliente) {
    this.deque.push(cliente);
  }

  // enqueuePrioritario: agrega cliente al inicio (prioritario)
  enqueuePrioritario(cliente) {
    this.deque.unshift(cliente);
  }

  // dequeue: atiende al primer cliente (lo elimina)
  dequeue() {
    if (this.estaVacia()) return null;
    return this.deque.shift();
  }

  // peek: ve el primer cliente sin eliminarlo
  peek() {
    if (this.estaVacia()) return null;
    return this.deque[0];
  }

  estaVacia() {
    return this.deque.length === 0;
  }

  tamanio() {
    return this.deque.length;
  }

  print() {
    return [...this.deque];
  }
}

// ---- Instancia global ----
const cola = new Cola();

function mostrarEstadoCola() {
  const estado = cola.print();
  const contenedor = document.getElementById("estadoCola");

  if (estado.length === 0) {
    contenedor.innerHTML = `<p class="pila-vacia">📭 No hay clientes en la cola</p>`;
    return;
  }

  let html = `<div class="cola-visual">`;
  estado.forEach((cliente, i) => {
    const esPrimero = i === 0;
    html += `<div class="cola-elemento ${esPrimero ? 'frente' : ''}">
      ${esPrimero ? '🏦 SIGUIENTE → ' : `${i + 1}. `}"${cliente}"
    </div>`;
  });
  html += `</div>`;
  html += `<p><strong>Clientes en espera:</strong> ${cola.tamanio()}</p>`;
  contenedor.innerHTML = html;
}

function ingresarClientes() {
  const texto = document.getElementById("inputClientes").value.trim();
  if (!texto) {
    mostrarMensajeCola("Ingresa nombres separados por coma (escribe 'fin' al final para terminar).", "error");
    return;
  }

  const clientes = texto.split(",").map(c => c.trim()).filter(c => c && c.toLowerCase() !== "fin");

  if (clientes.length === 0) {
    mostrarMensajeCola("No se encontraron nombres válidos.", "error");
    return;
  }

  clientes.forEach(c => cola.enqueue(c));
  document.getElementById("inputClientes").value = "";
  mostrarMensajeCola(`✅ Se agregaron ${clientes.length} clientes a la cola.`, "exito");
  mostrarEstadoCola();
}

function agregarCliente() {
  const nombre = document.getElementById("inputUnCliente").value.trim();
  if (!nombre) {
    mostrarMensajeCola("Ingresa el nombre del cliente.", "error");
    return;
  }

  cola.enqueue(nombre);
  document.getElementById("inputUnCliente").value = "";
  mostrarMensajeCola(`✅ Cliente "${nombre}" agregado al final de la cola.`, "exito");
  mostrarEstadoCola();
}

function agregarPrioritario() {
  const nombre = document.getElementById("inputPrioritario").value.trim();
  if (!nombre) {
    mostrarMensajeCola("Ingresa el nombre del cliente prioritario.", "error");
    return;
  }

  cola.enqueuePrioritario(nombre);
  document.getElementById("inputPrioritario").value = "";
  mostrarMensajeCola(`⭐ Cliente prioritario "${nombre}" agregado al inicio de la cola.`, "exito");
  mostrarEstadoCola();
}

function atenderCliente() {
  if (cola.estaVacia()) {
    mostrarMensajeCola("❌ No hay clientes en la cola para atender.", "error");
    return;
  }

  const cliente = cola.dequeue();
  mostrarMensajeCola(`✅ Cliente atendido: "${cliente}"`, "exito");
  mostrarEstadoCola();
}

function mostrarMensajeCola(msg, tipo) {
  const el = document.getElementById("mensajeCola");
  el.textContent = msg;
  el.className = tipo === "error" ? "mensaje-error" : "mensaje-exito";
}
