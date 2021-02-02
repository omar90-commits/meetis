const Usuario = require('../models/usuarios');
const enviarEmail = require('../handlers/email');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

exports.sanatizeCampos = async (req, res, next) => {

	const usuario = await Usuario.findOne({ email: req.body.email });

	// Sanatizar campos
	req.sanitizeBody('nombre').escape();
	req.sanitizeBody('email').escape();
	req.sanitizeBody('password').escape();
	req.sanitizeBody('confirmar').escape();

	// Validar campos
	req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
	req.checkBody('email', 'El email es obligatorio').isEmail();
	req.checkBody('password', 'El password es obligatorio').notEmpty();
	req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

	if (usuario) {

		req.checkBody('email', 'Usuario ya esta registrado').not().equals(req.body.email);
	}

	const errores = req.validationErrors();

	if (errores) {

		req.flash('error', errores.map(error => error.msg));

		return res.redirect('/crear-cuenta');
	} 

	next();
}

exports.formCrearCuenta = (req, res) => {

	res.render('crear-cuenta', {
		nombrePagina: 'Crea tu Cuenta',
		noAutenticado: true,
	});
}

exports.crearNuevoUsuario = async (req, res) => {

	const usuario = new Usuario(req.body);
	usuario.activo = 0;

	try {

		await usuario.save();

		// Enviar email de confirmacion
		const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

		// Enviar notificacion por email
		await enviarEmail.enviar({
			usuario,
			url,
			subject: 'Confirmar Tu cuenta de meeti',
			archivo: 'confirmar-cuenta',
		});

		req.flash('correcto', 'Hemos enviado un E-mail confirma tu cuenta');
		res.redirect('/iniciar-sesion');
	
	} catch (error) {

		console.log(error)
	}
}

// Confirmar cuenta
exports.confirmarCuenta = async (req, res, next) => {

	// Verificar que el usuario existe
	const usuario = await Usuario.findOne({ email: req.params.correo });

	// Si no existe
	if (!usuario) {

		req.flash('error', 'No existe esa cuenta');
		res.redirect('/crear-cuenta');
		return next();
	}

	// Si existe confirmar y redireccionar
	usuario.activo = 1;
	await usuario.save();
	req.flash('correcto', 'La cuenta se a confirmado ya puedes iniciar sesion');
	res.redirect('/iniciar-sesion');
}

// Editar Perfil
exports.formEditarPerfil = async (req, res) => {

	const usuario = await Usuario.findById(req.user.id);

	res.render('editar-perfil', {
		nombrePagina: 'Editar Perfil',
		usuario,
	});
}

exports.editarPerfil = async (req, res) => {

	const usuario = await Usuario.findById(req.user.id);

	req.sanitizeBody('nombre').escape();
	req.sanitizeBody('email').escape();

	const { nombre, descripcion, email } = req.body;

	usuario.nombre = nombre;
	usuario.descripcion = descripcion;
	usuario.email = email;

	await usuario.save();
	req.flash('correcto', 'Cambios Guardados Correctamente');
	res.redirect('/administracion');
}

// Resetear password
exports.formCambiarPassword = async (req, res) => {

	res.render('cambiar-password', {
		nombrePagina: 'Cambiar Password',
	});
}

exports.cambiarPassword = async (req, res) => {

	const usuario = await Usuario.findById(req.user.id);

	// Verificar que el password anterior sea correcto
	const validPassword = bcrypt.compareSync(req.body.anterior, usuario.password);

	if (!validPassword) {

		req.flash('error', 'El password actual es incorrecto.');
		return res.redirect('/administracion');
	}

	// Guardar en la base de datos
	usuario.password = req.body.nuevo;
	await usuario.save();

	// Redireccionar
	req.logout();
	req.flash('correcto', 'Password Modificado Correctamente, Vuelve a iniciar sesion.');
	res.redirect('/iniciar-sesion');
}

// Subir imagen de perfil
exports.formSubirImagenPerfil = async (req, res) => {

	const usuario = await Usuario.findById(req.user.id);

	res.render('imagen-perfil', {
		nombrePagina: 'Subir Imagen perfil',
		usuario,
	});
}

exports.subirImagen = (req, res, next) => {

	if (!req.files) return next();

	const archivo = req.files.imagen;
	const cortarNombre = archivo.name.split('.');
	const extension = cortarNombre[cortarNombre.length - 1];
	const extensionesPermitidas = ['jpg', 'jpeg', 'png'];

	if (!extensionesPermitidas.includes(extension)) {

		req.flash('error', `El tipo de extension '${extension}', no es valida`);
		return res.redirect('/nuevo-grupo');
	
	} else if (archivo.size > 100000) {

		req.flash('error', 'El archivo es muy grande, maximo 100kb');
		return res.redirect('/nuevo-grupo');
	}

	const nombreImg = `${new Date().getMilliseconds()}-${archivo.name}`;
	archivo.mv(`public/uploads/perfiles/${nombreImg}`);
	req.imagen = nombreImg;

	next();
}

exports.guardarImagen = async (req, res) => {

	const usuario = await Usuario.findById(req.user.id);
	const pathImage = path.resolve(__dirname, `../public/uploads/perfiles/${usuario.imagen}`);

	// Si hay imagen anterior, eliminarla
	if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);

	usuario.imagen = req.imagen;

	try {

		await usuario.save();

		req.flash('correcto', 'Cambios almacenados correctamente');
		res.redirect('/administracion');

	} catch (error) {

		console.log(error);
		req.flash('error', 'Ah ocurrido un error');
		res.redirect('/nuevo-grupo');
	}
}