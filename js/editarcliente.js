(function () {
	let idCliente;
	const nombreInput = document.getElementById('nombre');
	const correoInput = document.getElementById('email');
	const telefonoInput = document.getElementById('telefono');
	const empresaInput = document.getElementById('empresa');

	const formulario = document.getElementById('formulario');

	document.addEventListener('DOMContentLoaded', () => {
		conectarDB();

		// actualizar el registro
		formulario.addEventListener('submit', actualizarCliente);

		// verificar el id de la URL

		const parametroURL = new URLSearchParams(window.location.search);
		idCliente = parametroURL.get('id');
		if (idCliente) {
			setTimeout(() => {
				obtenerCliente(idCliente);
			}, 100);
		}
	});

	function actualizarCliente(e) {
		e.preventDefault();
		if (nombreInput.value.trim() === '' || correoInput.value.trim() === '' || telefonoInput.value.trim() === '' || empresaInput.value.trim() === '') {
			imprimirAlerta('Todos los campos son obligatorios', 'error');
			return;
		}
		// actualizar cliente
		const clienteActualizado = {
			nombre: nombreInput.value,
			correo: correoInput.value,
			telefono: telefonoInput.value,
			empresa: empresaInput.value,
			id: Number(idCliente),
		};

		const transaction = DB.transaction(['crm'], 'readwrite');

		const objectStore = transaction.objectStore('crm');

		objectStore.put(clienteActualizado);

		transaction.oncomplete = () => {
			imprimirAlerta('Editado correctamente');

			setTimeout(() => {
				window.location.href = 'index.html';
			}, 3000);
		};

		transaction.onerror = () => {
			console.log('Ha ocurrido un error');
		};
	}

	function obtenerCliente(id) {
		const transaction = DB.transaction(['crm'], 'readonly');

		const objectStore = transaction.objectStore('crm');

		const cliente = objectStore.openCursor();

		cliente.onsuccess = (e) => {
			const cursor = e.target.result;
			if (cursor) {
				if (cursor.value.id === Number(id)) {
					llenarFormulario(cursor.value);
				}
				cursor.continue();
			}
		};
	}

	function llenarFormulario(cliente) {
		const { nombre, telefono, correo, empresa } = cliente;
		nombreInput.value = nombre;
		telefonoInput.value = telefono;
		correoInput.value = correo;
		empresaInput.value = empresa;
	}
})();
