// ============================================================
// EJERCICIO 1 - LISTAS
// Estructura: Lista enlazada (LinkedList)
// ============================================================

class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
    this.cola = null;
    this.tamanio = 0;
  }

  // Agrega un nodo al final
  agregar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
    } else {
      this.cola.siguiente = nuevoNodo;
      this.cola = nuevoNodo;
    }
    this.tamanio++;
  }

  // Elimina un nodo por valor, valida si existe
  eliminar(valor) {
    if (!this.cabeza) return false;

    if (this.cabeza.valor === valor) {
      this.cabeza = this.cabeza.siguiente;
      if (!this.cabeza) this.cola = null;
      this.tamanio--;
      return true;
    }

    let actual = this.cabeza;
    while (actual.siguiente !== null) {
      if (actual.siguiente.valor === valor) {
        if (actual.siguiente === this.cola) this.cola = actual;
        actual.siguiente = actual.siguiente.siguiente;
        this.tamanio--;
        return true;
      }
      actual = actual.siguiente;
    }
    return false;
  }

  // Inserta en una posición específica (0-indexado), valida posición
  insertarEn(posicion, valor) {
    if (posicion < 0 || posicion > this.tamanio) return false;

    if (posicion === 0) {
      const nuevoNodo = new Nodo(valor);
      nuevoNodo.siguiente = this.cabeza;
      this.cabeza = nuevoNodo;
      if (this.tamanio === 0) this.cola = nuevoNodo;
      this.tamanio++;
      return true;
    }

    if (posicion === this.tamanio) {
      this.agregar(valor);
      return true;
    }

    const nuevoNodo = new Nodo(valor);
    let actual = this.cabeza;
    for (let i = 0; i < posicion - 1; i++) {
      actual = actual.siguiente;
    }
    nuevoNodo.siguiente = actual.siguiente;
    actual.siguiente = nuevoNodo;
    this.tamanio++;
    return true;
  }

  // Verifica si un valor existe en la lista
  contiene(valor) {
    let actual = this.cabeza;
    while (actual !== null) {
      if (actual.valor === valor) return true;
      actual = actual.siguiente;
    }
    return false;
  }

  // Retorna un array con los valores en orden
  aArray() {
    const resultado = [];
    let actual = this.cabeza;
    while (actual !== null) {
      resultado.push(actual.valor);
      actual = actual.siguiente;
    }
    return resultado;
  }

  // Retorna array ordenado de menor a mayor
  aArrayOrdenado() {
    return [...this.aArray()].sort((a, b) => a - b);
  }

  // Cuenta pares e impares
  contarParesImpares() {
    let pares = 0, impares = 0;
    let actual = this.cabeza;
    while (actual !== null) {
      actual.valor % 2 === 0 ? pares++ : impares++;
      actual = actual.siguiente;
    }
    return { pares, impares };
  }
}

// ---- Instancia global ----
const lista = new ListaEnlazada();

function mostrarEstado() {
  const arr = lista.aArray();
  const ordenada = lista.aArrayOrdenado();
  const { pares, impares } = lista.contarParesImpares();

  let html = `<div class="resultado-bloque">`;
  html += `<p><strong>Lista original:</strong> [${arr.join(", ")}]</p>`;
  html += `<p><strong>Lista ordenada:</strong> [${ordenada.join(", ")}]</p>`;
  html += `<p><strong>Números pares:</strong> ${pares} &nbsp;|&nbsp; <strong>Impares:</strong> ${impares}</p>`;
  html += `<p><strong>Total elementos:</strong> ${lista.tamanio}</p>`;
  html += `</div>`;

  document.getElementById("resultado").innerHTML = html;
}

function ingresarNumeros() {
  const n = parseInt(document.getElementById("cantidadNumeros").value);
  if (isNaN(n) || n <= 0) {
    mostrarMensaje("Por favor ingresa una cantidad válida mayor a 0.", "error");
    return;
  }

  const inputNums = document.getElementById("numerosIngresados").value.trim();
  const nums = inputNums.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

  if (nums.length !== n) {
    mostrarMensaje(`Debes ingresar exactamente ${n} números separados por coma.`, "error");
    return;
  }

  nums.forEach(num => lista.agregar(num));
  mostrarMensaje(`✅ Se agregaron ${n} números a la lista.`, "exito");
  mostrarEstado();
}

function eliminarNumero() {
  const val = parseFloat(document.getElementById("numEliminar").value);
  if (isNaN(val)) {
    mostrarMensaje("Ingresa un número válido para eliminar.", "error");
    return;
  }

  if (!lista.contiene(val)) {
    mostrarMensaje(`❌ El número ${val} no está en la lista.`, "error");
    return;
  }

  lista.eliminar(val);
  mostrarMensaje(`✅ Número ${val} eliminado correctamente.`, "exito");
  mostrarEstado();
}

function insertarEnPosicion() {
  const pos = parseInt(document.getElementById("posInsertar").value);
  const val = parseFloat(document.getElementById("valInsertar").value);

  if (isNaN(pos) || isNaN(val)) {
    mostrarMensaje("Ingresa una posición y un valor válidos.", "error");
    return;
  }

  if (pos < 0 || pos > lista.tamanio) {
    mostrarMensaje(`❌ Posición inválida. Debe estar entre 0 y ${lista.tamanio}.`, "error");
    return;
  }

  lista.insertarEn(pos, val);
  mostrarMensaje(`✅ Número ${val} insertado en la posición ${pos}.`, "exito");
  mostrarEstado();
}

function mostrarMensaje(msg, tipo) {
  const el = document.getElementById("mensaje");
  el.textContent = msg;
  el.className = tipo === "error" ? "mensaje-error" : "mensaje-exito";
}
