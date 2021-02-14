
function updateProgressBar() {
	const progress = document.querySelector('.progress-bar');
	let cont = 0;
	const updateWidth = setInterval(() => {
		if (cont <= 100) {
			progress.style.opacity = 1;
			progress.style.width = cont + '%';

			cont++;
		} else {
			clearInterval(updateWidth);
			progress.style.opacity = 0;
			progress.width = 0 + '%';
		}
	}, 30);
}
function imprimirAlerta(mensaje, tipo) {
	const alerta = document.querySelector('.alerta');

	if (!alerta) {
		// crear el mensaje
		const divMensaje = document.createElement('div');
		divMensaje.classList.add('px-4', 'py-4', 'mt-4', 'rounded', 'max-w-lg', 'mx-auto', 'text-center', 'border', 'alerta');
		if (tipo === 'error') {
			divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
		} else {
			divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
		}
		divMensaje.textContent = mensaje;

		formulario.appendChild(divMensaje);

		setTimeout(() => {
			divMensaje.remove();
		}, 3000);
	}
}
function conectarDB() {
	const abrirConexion = window.indexedDB.open('crm', 1);

	abrirConexion.onerror = () => {
		console.log('Hubo un error');
	};

	abrirConexion.onsuccess = () => {
		DB = abrirConexion.result;
	};
}
