document.addEventListener('DOMContentLoaded', function() {
    mostrarCarrito();
    document.getElementById('tipoEnvio').addEventListener('change', realizarPago);
    document.getElementById('cuotas').addEventListener('input', realizarPago);
    realizarPago();
});

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const lista = document.getElementById('listaCarrito');
    lista.innerHTML = '';
    carrito.forEach((producto, index) => {
        lista.innerHTML += `<div>
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:10%;">
            <p>${producto.nombre} - $${producto.precio} cada uno</p>
            <input type="number" min="1" value="${producto.cantidad}" onchange="actualizarCantidad(${index}, this.value)">
            <button onclick="eliminarProducto(${index})">Eliminar</button>
        </div>`;
    });
    realizarPago();
}

function actualizarCantidad(index, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    nuevaCantidad = parseInt(nuevaCantidad);
    if (nuevaCantidad > 0) {
        carrito[index].cantidad = nuevaCantidad;
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function calcularTotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
}

function calcularEnvio(tipoEnvio) {
    return tipoEnvio === 'domicilio' ? 1500 : 0;
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

function calcularTotalFinal(tipoEnvio, cuotas) {
    const subtotal = calcularTotal();
    const envio = calcularEnvio(tipoEnvio);
    const interes = calcularInteres(cuotas);
    const totalFinal = (subtotal + envio) * interes;
    const valorCuota = totalFinal / cuotas;
    document.getElementById('totalAPagar').innerText = '$' + totalFinal.toFixed(2);
    document.getElementById('valorCuota').innerText = '$' + valorCuota.toFixed(2);
    return totalFinal;
}

function realizarPago() {
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const totalFinal = calcularTotalFinal(tipoEnvio, cuotas);
    document.getElementById('totalAPagar').innerText = '$' + totalFinal.toFixed(2);
    document.getElementById('valorCuota').innerText = '$' + (totalFinal / cuotas).toFixed(2);
}

document.getElementById('irAPagar').addEventListener('click', function() {
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const total = calcularTotalFinal(tipoEnvio, cuotas);

    localStorage.setItem('checkoutData', JSON.stringify({
        carrito: JSON.parse(localStorage.getItem('carrito')),
        tipoEnvio,
        cuotas,
        total
    }));

    window.location.href = 'checkout.html';
});
