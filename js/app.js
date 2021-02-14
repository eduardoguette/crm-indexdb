(function () {
	let DB;

	const listadoClientes = document.getElementById('listado-clientes');
	document.addEventListener('DOMContentLoaded', () => {
		crearDB();
		if (window.indexedDB.open('crm', 1)) {
			obtenerClientes();
		}

		listadoClientes.addEventListener('click', eliminarCliente);
	});

	function eliminarCliente(e) {
		if (e.target.classList.contains('eliminar')) {
			const idEliminar = Number(e.target.dataset.cliente);

		
			var eliminar; //= confirm('Desea eliminar este usuario');
			Swal.fire({
				title: 'Estas seguro que quieres eliminar este cliente',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#FF5D3B',
				confirmButtonClassName: 'bg-indigo-600',
				cancelButtonColor: '#CACACA',
				confirmButtonText: 'Eliminar cliente',
			}).then((result) => {
				if (result.isConfirmed) {
					const transaction = DB.transaction(['crm'], 'readwrite');
					const objectStore = transaction.objectStore('crm');
					objectStore.delete(idEliminar);
					transaction.oncomplete = () => {
						Swal.fire('Eliminado!', 'El usuario se ha eliminado.', 'success');
						e.target.parentNode.parentNode.remove();
					};
					transaction.onerror = () => {
						Swal.fire('Ha ocurrido un error!', 'No se pudo eliminar este cliente.', 'erroor');
					};
				}
			});
			
		}
	}

	function crearDB() {
		const crearDB = window.indexedDB.open('crm', 1);

		crearDB.onerror = () => console.log('Ha ocurrido un error');

		crearDB.onsuccess = () => (DB = crearDB.result);

		crearDB.onupgradeneeded = (e) => {
			const db = e.target.result;

			const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

			objectStore.createIndex('nombre', 'nombre', { unique: false });
			objectStore.createIndex('correo', 'correo', { unique: true });
			objectStore.createIndex('telefono', 'telefono', { unique: false });
			objectStore.createIndex('empresa', 'empresa', { unique: false });

			console.log('DB is Ready');
		};
	}
	function obtenerClientes() {
		const abrirConexion = window.indexedDB.open('crm', 1);

		abrirConexion.onerror = () => console.log('hubo un erro');

		abrirConexion.onsuccess = () => {
			DB = abrirConexion.result;

			const objectStore = DB.transaction('crm').objectStore('crm');

			objectStore.openCursor().onsuccess = (e) => {
				const cursor = e.target.result;
				if (cursor) {
					const { nombre, correo, telefono, empresa, id } = cursor.value;

					listadoClientes.innerHTML += ` <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${correo} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
          </td>
      </tr>
  `;
					cursor.continue();
				} else {
				}
			};
		};
	}
})();
