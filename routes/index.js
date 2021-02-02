const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const gruposController = require('../controllers/gruposController');
const mettiController = require('../controllers/mettiController');

const meetiControllerFE = require('../controllers/frontend/meetiControllerFE');
const usuariosControllerFE = require('../controllers/frontend/usuariosControllerFE');
const gruposControllerFE = require('../controllers/frontend/gruposControllerFE');
const comentariosControllerFE = require('../controllers/frontend/comentariosControllerFE');
const busquedaControllerFE = require('../controllers/frontend/busquedaControllerFE');

module.exports = function() {
	
	// Area publica
	router.get('/', homeController.home);

	// Muestra un meeti
	router.get('/meeti/:url', meetiControllerFE.mostrarMeeti);

	// Confirma la asistencia a meeti
	router.post('/confirmar-asistencia/:url', meetiControllerFE.confirmarAsistencia);

	// Muestra asistencia al meeti
	router.get('/asistentes/:url', meetiControllerFE.mostrarAsistentes);

	// Comentarios en el meeti
	router.post('/meeti/:id', comentariosControllerFE.agregarComentario);

	// Eliminar comentarios en el meeti
	router.post('/eliminar-comentario', comentariosControllerFE.eliminarComentario);

	// Muestra perfiles en el front end
	router.get('/usuarios/:id', usuariosControllerFE.mostrarUsuario);	

	// Muestra los grupos en el front end
	router.get('/grupos/:id', gruposControllerFE.mostrarGrupo);

	// Mostrar meeti's por categoria
	router.get('/categoria/:categoria', meetiControllerFE.mostrarCategoria);

	// Añade la busqueda
	router.get('/busqueda', busquedaControllerFE.resultadoBusquedas);

	// Crear cuenta y confirmar cuenta
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta',
		usuariosController.sanatizeCampos, 
		usuariosController.crearNuevoUsuario
	);
	router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

	// Iniciar sesion
	router.get('/iniciar-sesion', authController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.autenticarUsuario);

	// Cerrar sesion
	router.get('/cerrar-sesion', 
		authController.usuarioAutenticado,
		authController.cerrarSesion,
	);

	// Area privada

	// Panel de administracion
	router.get('/administracion',
		authController.usuarioAutenticado, 
		authController.administracion
	);

	// Nuevos grupos
	router.get('/nuevo-grupo',
		authController.usuarioAutenticado,
		gruposController.formNuevoGrupo
	);
	router.post('/nuevo-grupo',
		authController.usuarioAutenticado,
		gruposController.subirImagen,
		gruposController.sanatizeCamposGrupos,
		gruposController.crearGrupo,
	);

	// Editar grupos
	router.get('/editar-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.formEditarGrupo,
	);
	router.post('/editar-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.editarGrupo,
	);

	// Editar La Imagen del grupo
	router.get('/imagenes-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.formEditarImagen,
	);
	router.post('/imagenes-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.subirImagen,
		gruposController.editarImagen,
	);

	// Eliminar Grupos
	router.get('/eliminar-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.formEliminarGrupo,
	);
	router.post('/eliminar-grupo/:id',
		authController.usuarioAutenticado,
		gruposController.eliminarGrupo,
	);

	// Nuevo metti
	router.get('/nuevo-meeti',
		authController.usuarioAutenticado,
		mettiController.formNuevoMeeti,
	);
	router.post('/nuevo-meeti',
		authController.usuarioAutenticado,
		mettiController.sanatizeCampos,
		mettiController.crearMeeti,
	);

	// Editar meeti
	router.get('/editar-meeti/:id',
		authController.usuarioAutenticado,
		mettiController.formEditarMeeti,
	);
	router.post('/editar-meeti/:id',
		authController.usuarioAutenticado,
		mettiController.editarMeeti,
	);

	//Eliminar meeti
	router.get('/eliminar-meeti/:id',
		authController.usuarioAutenticado,
		mettiController.formEliminarMeeti,
	);
	router.post('/eliminar-meeti/:id',
		authController.usuarioAutenticado,
		mettiController.eliminarMeeti,
	);

	// Editar informacion de perfil
	router.get('/editar-perfil',
		authController.usuarioAutenticado,
		usuariosController.formEditarPerfil,
	);
	router.post('/editar-perfil',
		authController.usuarioAutenticado,
		usuariosController.editarPerfil,
	);

	// Modificar password
	router.get('/cambiar-password',
		authController.usuarioAutenticado,
		usuariosController.formCambiarPassword,
	);
	router.post('/cambiar-password',
		authController.usuarioAutenticado,
		usuariosController.cambiarPassword,
	);

	// Imagen de perfil
	router.get('/imagen-perfil',
		authController.usuarioAutenticado,
		usuariosController.formSubirImagenPerfil,
	);
	router.post('/imagen-perfil',
		authController.usuarioAutenticado,
		usuariosController.subirImagen,
		usuariosController.guardarImagen,
	);

	return router;
}