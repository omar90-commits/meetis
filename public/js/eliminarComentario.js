import Swal from 'sweetalert2'

const formEliminar = Array.from(document.querySelectorAll('.eliminar-comentario'));

if (formEliminar.length > 0) {

	formEliminar.forEach(form => form.addEventListener('submit', function(e) {
		
		e.preventDefault();
		
		Swal.fire({
		  title: 'Eliminar Comentario',
		  text: "Un comentario eliminado no se puede recuperar",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, borrar!',
		  cancelButtonText: 'Cancelar',

		}).then(result => {

			if (result.isConfirmed) {

				const tagInput = Array.from(this.children)[0];
				const id = tagInput.value;

				fetch(this.action, {
					method: 'POST',
					headers: {
				      'Content-Type': 'application/x-www-form-urlencoded',
				    },
					body: id,
				}).then(res => {

					if (res.status === 200) return res.text();
					else if (res.status === 404 || res.status === 403) throw new Error('Accion no valida');
				})
				.then(res => {

					Swal.fire(
						res + "!",
						'El comentario se a eliminado.',
						'success'
					);

					tagInput.parentElement.parentElement.parentElement.remove();
				
				}).catch(err => {

					console.log(err)
					Swal.fire('Error', 'Accion no valida', 'error');
				})
			} 
		})
	}) );
}