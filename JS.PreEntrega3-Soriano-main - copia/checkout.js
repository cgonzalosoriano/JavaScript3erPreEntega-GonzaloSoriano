document.addEventListener('DOMContentLoaded', function() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

    if (!checkoutData) {
        alert('No hay datos de checkout disponibles');
        return;
    }

    mostrarDetallePago(checkoutData);
    document.getElementById('tipoCliente').addEventListener('change', () => mostrarDetallePago(checkoutData));
    document.getElementById('metodoPago').addEventListener('change', () => {
        mostrarDetallePago(checkoutData);
        mostrarInstruccionesPago();
    });
    document.getElementById('pagar').addEventListener('click', pagar);
});

function mostrarDetallePago(data) {
    const detallePagoDiv = document.getElementById('detallePago');
    const { carrito, tipoEnvio, cuotas } = data;
    const tipoCliente = document.getElementById('tipoCliente').value;
    const metodoPago = document.getElementById('metodoPago').value;
    
    const envioCost = tipoEnvio === 'domicilio' ? 1500 : 0;
    let subtotal = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    const interes = calcularInteres(cuotas);

    const iva = subtotal * 0.21;

    if (tipoCliente === 'consumidorFinal') {
        subtotal += iva;
    }

    let metodoPagoCargo = 0;
    switch(metodoPago) {
        case 'reembolso':
            metodoPagoCargo = 0;
            break;
        case 'transferencia':
            metodoPagoCargo = (subtotal + envioCost) * 0.012;
            break;
        case 'tarjeta':
            metodoPagoCargo = (subtotal + envioCost) * 0.03;
            break;
        case 'rapipago':
            metodoPagoCargo = (subtotal + envioCost) * 0.015;
            break;
    }

    const totalConIva = subtotal + envioCost + metodoPagoCargo;
    const totalFinal = totalConIva * interes;

    detallePagoDiv.innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Envío: $${envioCost.toFixed(2)}</p>
        ${tipoCliente === 'responsableInscripto' ? `<p>IVA (21%): $${iva.toFixed(2)}</p>` : ''}
        <p>Cargo por método de pago: $${metodoPagoCargo.toFixed(2)}</p>
        <p>Total a pagar: $${totalFinal.toFixed(2)}</p>
        <p>Cuotas: ${cuotas}</p>
        <p>Valor de cada cuota: $${(totalFinal / cuotas).toFixed(2)}</p>
    `;
}

function mostrarInstruccionesPago() {
    const metodoPago = document.getElementById('metodoPago').value;
    const instruccionesPagoDiv = document.getElementById('instruccionesPago');

    let instrucciones;
    switch(metodoPago) {
        case 'elegir':
            instrucciones = '';
            break;
        case 'reembolso':
            instrucciones = 'Por favor, prepare el monto exacto para el reembolso. El producto será despachado tras recibir el pago.';
            break;
        case 'transferencia':
            instrucciones = 'Por favor, transfiera el monto exacto a la cuenta bancaria indicada. El producto será despachado tras confirmar la transferencia.';
            break;
        case 'tarjeta':
            instrucciones = 'Ingrese los detalles de su tarjeta para procesar el pago. El producto será despachado tras confirmar el pago.';
            break;
        case 'rapipago':
            instrucciones = 'Realice el pago en cualquier sucursal de Rapipago con el código proporcionado. El producto será despachado tras confirmar el pago.';
            break;
    }

    instruccionesPagoDiv.innerText = instrucciones;
}

function calcularInteres(cuotas) {
    if (cuotas <= 1) {
        return 1; 
    }

    const tasaInteresAnual = 0.60; 
    const tasaInteresMensual = tasaInteresAnual / 12; 
    const interesTotal = tasaInteresMensual * cuotas; 
    return 1 + interesTotal; 
}

function pagar() {
    alert('Pago realizado con éxito. Su producto será despachado pronto.');
    localStorage.removeItem('checkoutData');
    window.location.href = 'index.html';
}
