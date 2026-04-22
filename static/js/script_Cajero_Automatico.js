function cajero() {
    let saldo = 100000;
    let opcion;

    do {
        opcion = prompt(`
1. Consultar saldo
2. Retirar
3. Depositar
4. Salir
        `);

        switch (opcion) {
            case "1":
                alert("Saldo actual: " + saldo);
                break;

            case "2":
                let retiro = parseFloat(prompt("Valor a retirar:"));
                if (retiro <= saldo) {
                    saldo -= retiro;
                    alert("Retiro exitoso");
                } else {
                    alert("Saldo insuficiente");
                }
                break;

            case "3":
                let deposito = parseFloat(prompt("Valor a depositar:"));
                saldo += deposito;
                alert("Depósito exitoso");
                break;
        }

    } while (opcion !== "4");
}