(function () {
	const formulario = document.getElementById('formulario');
	document.addEventListener('DOMContentLoaded', () => {
		conectarDB();
		formulario.addEventListener('submit', validarCliente);
	});
	
	function validarCliente(e) {
		e.preventDefault();

		const nombre = document.getElementById('nombre').value;
		const correo = document.getElementById('email').value;
		const telefono = document.getElementById('telefono').value;
		const empresa = document.getElementById('empresa').value;
		if (nombre === '' || correo === '' || telefono === '' || empresa === '') {
			imprimirAlerta('Todos los campos son obligatorios', 'error');
			return;
		}
		const cliente = {
			nombre,
			correo,
			telefono,
			empresa,
		};
		cliente.id = Date.now();
		crearNuevoCliente(cliente);
	}
	function crearNuevoCliente(cliente) {
		const transaction = DB.transaction(['crm'], 'readwrite');

		const objectStore = transaction.objectStore('crm');

		objectStore.add(cliente);

		transaction.onerror = () => {
			imprimirAlerta('Revisa los campos, es posible que ya este cliente este registrado', 'error');
		};
		transaction.oncomplete = () => {
			imprimirAlerta('El cliente se ha agregado correctamente');
      
			updateProgressBar();
			setTimeout(() => {
				window.location.href = 'index.html';
			}, 3000);
		};
	}

})();
