const asistencia = document.querySelector('#confirmar-asistencia');

if (asistencia) {

	function confirmarAsistencia(e) {
		
		e.preventDefault();
		const btn = document.querySelector('#confirmar');
		const container = document.querySelector('.pregunta-asistencia');
		const div = document.createElement('div');

		if (Array.from(container.children)[1]) container.removeChild(Array.from(container.children)[1]);

		const datos = {
			accion: btn.value,
		}

		fetch(this.action, { 
			method: 'POST',
			 headers: {
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify(datos),
		})
		.then(resp => resp.text())
		.then(resp => {
		
			if (btn.value === 'Confirmar') {

				btn.value = 'Cancelar';
				btn.classList.remove('btn-azul');
				btn.classList.add('btn-rojo');
			
			} else {

				btn.value = 'Confirmar';
				btn.classList.remove('btn-rojo');
				btn.classList.add('btn-azul');
			}

			div.appendChild(document.createTextNode(resp));
			container.appendChild(div);
		})
	}

	asistencia.addEventListener('submit', confirmarAsistencia);
}
