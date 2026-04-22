// ============================================================
// EJERCICIO 5 - INTEGRADOR
// Combina: Lista (productos), Pila (acciones UNDO),
//          Cola (pedidos clientes), Diccionario (precios)
// ============================================================

// --- LISTA de productos ---
class NodoProducto {
  constructor(nombre) {
    this.nombre = nombre;
    this.siguiente = null;
  }
}

class ListaProductos {
  constructor() {
    this.cabeza = null;
    this.cola = null;
    this.tamanio = 0;
  }

  agregar(nombre) {
    const nodo = new NodoProducto(nombre);
    if (!this.cabeza) {
      this.cabeza = nodo;
      this.cola = nodo;
    } else {
      this.cola.siguiente = nodo;
      this.cola = nodo;
    }
    this.tamanio++;
  }

  eliminar(nombre) {
    if (!this.cabeza) return false;

    if (this.cabeza.nombre === nombre) {
      this.cabeza = this.cabeza.siguiente;
      if (!this.cabeza) this.cola = null;
      this.tamanio--;
      return true;
    }

    let actual = this.cabeza;
    while (actual.siguiente) {
      if (actual.siguiente.nombre === nombre) {
        if (actual.siguiente === this.cola) this.cola = actual;
        actual.siguiente = actual.siguiente.siguiente;
        this.tamanio--;
        return true;
      }
      actual = actual.siguiente;
    }
    return false;
  }

  contiene(nombre) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.nombre === nombre) return true;
      actual = actual.siguiente;
    }
    return false;
  }

  aArray() {
    const arr = [];
    let actual = this.cabeza;
    while (actual) {
      arr.push(actual.nombre);
      actual = actual.siguiente;
    }
    return arr;
  }
}

// --- PILA de acciones (UNDO) ---
class PilaAcciones {
  constructor() {
    this.stack = [];
  }
  push(accion) { this.stack.push(accion); }
  pop() { return this.stack.length > 0 ? this.stack.pop() : null; }
  peek() { return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null; }
  estaVacia() { return this.stack.length === 0; }
  print() { return [...this.stack]; }
}

// --- COLA de pedidos ---
class ColaPedidos {
  constructor() {
    this.deque = [];
  }
  enqueue(pedido) { this.deque.push(pedido); }
  dequeue() { return this.deque.length > 0 ? this.deque.shift() : null; }
  estaVacia() { return this.deque.length === 0; }
  print() { return [...this.deque]; }
}

// --- DICCIONARIO de precios ---
class DiccionarioPrecios {
  constructor() {
    this.precios = {};
  }
  agregar(nombre, precio) { this.precios[nombre] = parseFloat(precio); }
  obtener(nombre) { return this.precios[nombre] ?? null; }
  eliminar(nombre) { delete this.precios[nombre]; }
  existe(nombre) { return Object.prototype.hasOwnProperty.call(this.precios, nombre); }
  todos() { return { ...this.precios }; }
}

// ---- Instancias globales ----
const listaProductos = new ListaProductos();
const pilaAcciones = new PilaAcciones();
const colaPedidos = new ColaPedidos();
const dicPrecios = new DiccionarioPrecios();

function mostrarSistema() {
  // Productos
  const productos = listaProductos.aArray();
  let htmlProductos = productos.length === 0
    ? `<p class="pila-vacia">Sin productos</p>`
    : productos.map(p => {
        const precio = dicPrecios.obtener(p);
        return `<span class="tag-producto">📦 ${p} ${precio !== null ? `($${precio})` : ''}</span>`;
      }).join(" ");

  // Pila de acciones
  const acciones = pilaAcciones.print();
  let htmlPila = acciones.length === 0
    ? `<p class="pila-vacia">Sin acciones</p>`
    : acciones.slice().reverse().map((a, i) =>
        `<div class="pila-elemento ${i === 0 ? 'tope' : ''}">${i === 0 ? '👆 ' : ''}${a}</div>`
      ).join("");

  // Cola de pedidos
  const pedidos = colaPedidos.print();
  let htmlCola = pedidos.length === 0
    ? `<p class="pila-vacia">Sin pedidos</p>`
    : pedidos.map((p, i) =>
        `<div class="cola-elemento ${i === 0 ? 'frente' : ''}">${i === 0 ? '🏦 ' : `${i + 1}. `}${p}</div>`
      ).join("");

  document.getElementById("vistaProductos").innerHTML = htmlProductos;
  document.getElementById("vistaPila").innerHTML = htmlPila;
  document.getElementById("vistaCola").innerHTML = htmlCola;
}

function agregarProducto() {
  const nombre = document.getElementById("inputProducto").value.trim();
  const precio = document.getElementById("inputPrecio").value.trim();

  if (!nombre || precio === "") {
    mostrarMensajeInt("Ingresa nombre y precio del producto.", "error");
    return;
  }

  const precioNum = parseFloat(precio);
  if (isNaN(precioNum) || precioNum < 0) {
    mostrarMensajeInt("El precio debe ser un número positivo.", "error");
    return;
  }

  if (listaProductos.contiene(nombre)) {
    mostrarMensajeInt(`❌ El producto "${nombre}" ya existe.`, "error");
    return;
  }

  listaProductos.agregar(nombre);
  dicPrecios.agregar(nombre, precioNum);
  pilaAcciones.push(`AGREGAR: "${nombre}" ($${precioNum})`);

  document.getElementById("inputProducto").value = "";
  document.getElementById("inputPrecio").value = "";
  mostrarMensajeInt(`✅ Producto "${nombre}" agregado con precio $${precioNum}.`, "exito");
  mostrarSistema();
}

function eliminarProducto() {
  const nombre = document.getElementById("inputEliminarProducto").value.trim();
  if (!nombre) {
    mostrarMensajeInt("Ingresa el nombre del producto a eliminar.", "error");
    return;
  }

  if (!listaProductos.contiene(nombre)) {
    mostrarMensajeInt(`❌ El producto "${nombre}" no existe en la lista.`, "error");
    return;
  }

  const precio = dicPrecios.obtener(nombre);
  listaProductos.eliminar(nombre);
  dicPrecios.eliminar(nombre);
  pilaAcciones.push(`ELIMINAR: "${nombre}" ($${precio})`);

  document.getElementById("inputEliminarProducto").value = "";
  mostrarMensajeInt(`✅ Producto "${nombre}" eliminado.`, "exito");
  mostrarSistema();
}

function registrarPedido() {
  const cliente = document.getElementById("inputCliente").value.trim();
  const producto = document.getElementById("inputProductoPedido").value.trim();

  if (!cliente || !producto) {
    mostrarMensajeInt("Ingresa el nombre del cliente y el producto.", "error");
    return;
  }

  if (!listaProductos.contiene(producto)) {
    mostrarMensajeInt(`❌ El producto "${producto}" no existe en el catálogo.`, "error");
    return;
  }

  const precio = dicPrecios.obtener(producto);
  const pedido = `${cliente} → ${producto} ($${precio})`;
  colaPedidos.enqueue(pedido);
  pilaAcciones.push(`PEDIDO: ${pedido}`);

  document.getElementById("inputCliente").value = "";
  document.getElementById("inputProductoPedido").value = "";
  mostrarMensajeInt(`✅ Pedido registrado: ${pedido}`, "exito");
  mostrarSistema();
}

function deshacerUltimaAccion() {
  if (pilaAcciones.estaVacia()) {
    mostrarMensajeInt("❌ No hay acciones para deshacer.", "error");
    return;
  }

  const accion = pilaAcciones.pop();
  mostrarMensajeInt(`↩️ Acción deshecha: "${accion}"`, "exito");

  // Revertir la acción en las estructuras
  if (accion.startsWith("AGREGAR:")) {
    const nombre = accion.match(/"([^"]+)"/)?.[1];
    if (nombre) {
      listaProductos.eliminar(nombre);
      dicPrecios.eliminar(nombre);
    }
  } else if (accion.startsWith("ELIMINAR:")) {
    const match = accion.match(/"([^"]+)"\s*\(\$([^)]+)\)/);
    if (match) {
      listaProductos.agregar(match[1]);
      dicPrecios.agregar(match[1], parseFloat(match[2]));
    }
  } else if (accion.startsWith("PEDIDO:")) {
    colaPedidos.dequeue(); // Quita el último pedido agregado
  }

  mostrarSistema();
}

function mostrarMensajeInt(msg, tipo) {
  const el = document.getElementById("mensajeInt");
  el.textContent = msg;
  el.className = tipo === "error" ? "mensaje-error" : "mensaje-exito";
}
