function sistemaProductos() {
    let productos = [];
    let totalGeneral = 0;

    for (let i = 0; i < 5; i++) {
        let nombre = prompt("Nombre del producto:");
        let precio = parseFloat(prompt("Precio:"));
        let cantidad = parseInt(prompt("Cantidad:"));

        let total = precio * cantidad;
        totalGeneral += total;

        productos.push({ nombre, precio, cantidad, total });
    }

    let masCostoso = productos[0];
    let mayorCantidad = productos[0];

    let salida = "<h2>Productos</h2>";

    for (let p of productos) {
        salida += `
        <p>${p.nombre} - Precio: ${p.precio} - Cantidad: ${p.cantidad} - Total: ${p.total}</p>
        `;

        if (p.precio > masCostoso.precio) {
            masCostoso = p;
        }

        if (p.cantidad > mayorCantidad.cantidad) {
            mayorCantidad = p;
        }
    }

    salida += `<h3>Total general: ${totalGeneral}</h3>`;
    salida += `<p>Producto más costoso: ${masCostoso.nombre}</p>`;
    salida += `<p>Mayor cantidad: ${mayorCantidad.nombre}</p>`;

    document.getElementById("resultado").innerHTML = salida;
}