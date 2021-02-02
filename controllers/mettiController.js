const Grupos = require('../models/grupos');
const Meeti = require('../models/meeti');
const moment = require('moment');

// Sanitazar campos
exports.sanatizeCampos = async (req, res, next) => {

	// Sanatizar campos
	req.sanitizeBody('titulo').escape();
	req.sanitizeBody('invitado').escape();
	req.sanitizeBody('cupo').escape();
	req.sanitizeBody('fecha').escape();
	req.sanitizeBody('hora').escape();
	req.sanitizeBody('direccion').escape();
	req.sanitizeBody('ciudad').escape();
	req.sanitizeBody('estado').escape();
	req.sanitizeBody('pais').escape();
	req.sanitizeBody('lat').escape();
	req.sanitizeBody('lng').escape();
	req.sanitizeBody('grupoId').escape();

	// Validar campos
	req.checkBody('titulo', 'El titulo es obligatorio').notEmpty();
	req.checkBody('invitado', 'El invitado es obligatorio').notEmpty();
	req.checkBody('cupo', 'El cupo es obligatorio').notEmpty();
	req.checkBody('fecha', 'La fecha es obligatorio').notEmpty();
	req.checkBody('hora', 'La hora es obligatorio').notEmpty();
	req.checkBody('direccion', 'La direccion es obligatorio').notEmpty();
	req.checkBody('ciudad', 'La ciudad es obligatorio').notEmpty();
	req.checkBody('estado', 'El estado es obligatorio').notEmpty();
	req.checkBody('pais', 'El pais es obligatorio').notEmpty();

	const errores = req.validationErrors();

	if (errores) {

		req.flash('error', errores.map(error => error.msg));

		return res.redirect('/nuevo-meeti');
	} 

	next();
}

// Muestra el formulario de los Metti
exports.formNuevoMeeti = async (req, res) => {

	const grupos = await Grupos.find({ usuarios: req.user._id });

	res.render('nuevo-meeti', {
		nombrePagina: 'Crear Nuevo Meeti',
		grupos,
	});
}

// Crear un nuevo Metti
exports.crearMeeti = async (req, res) => {

	const meeti = new Meeti(req.body);
	const grupos = await Grupos.findById(meeti.grupoId);

	// Almacena la ubicacion con un point
	const point = [parseFloat(req.body.lat), parseFloat(req.body.lng)];
	meeti.ubicacion = point;

	meeti.usuarios = req.user._id;
	meeti.imgGrupo = grupos.imagen;

	// Cupo opcional
	if (req.body.cupo === '') meeti.cupo = 0;

	// Almacenar en la BD
	try {

		await meeti.save();
		req.flash('correcto', 'Se ah creado el meeti correctamente');
		res.redirect('/administracion');

	} catch(error) {

		console.log(error)
		req.flash('error', error);
		res.redirect('/nuevo-meeti');
	}
}

// Editar Meeti
exports.formEditarMeeti = async (req, res) => {

	const grupos = await Grupos.find({ usuarios: req.user._id });
	const meeti = await Meeti.findById(req.params.id);
	const grupoSelected = await Grupos.findById(meeti.grupoId);
	const objgrupos = {
		grupos,
		selected: grupoSelected.nombre,
	}

	if (!grupos || !meeti) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}
	
	const Fecha = '20' + moment(meeti.fecha).format('YY-MM-DD');

	res.render('editar-meeti', {
		nombrePagina: `Editar Meeti: ${meeti.titulo}`,
		objgrupos,
		meeti,
		Fecha,
		lat: meeti.ubicacion[0],
		lng: meeti.ubicacion[1],
	});
}

exports.editarMeeti = async (req, res) => {

	const meeti = await Meeti.findById(req.params.id);

	if (!meeti) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}

	const { grupoId, titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, estado, pais, lat, lng } = req.body;
	const point = [parseFloat(lat), parseFloat(lng)];

	meeti.grupoId = grupoId;
	meeti.titulo = titulo;
	meeti.invitado = invitado;
	meeti.fecha = fecha;
	meeti.hora = hora;
	meeti.cupo = cupo;
	meeti.descripcion = descripcion;
	meeti.direccion = direccion;
	meeti.ciudad = ciudad;
	meeti.estado = estado;
	meeti.pais = pais;

	await meeti.save();
	req.flash('correcto', 'Cambios guardados correctamente');
	res.redirect('/administracion');
}

// Eliminar meeti
exports.formEliminarMeeti = async (req, res) => {

	const meeti = await Meeti.findById(req.params.id);

	if (!meeti) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}

	res.render('eliminar-meeti', {
		nombrePagina: `Eliminar Meeti: ${meeti.titulo}`,
		meeti
	});
}

exports.eliminarMeeti = async (req, res) => {

	const meeti = await Meeti.findById(req.params.id);
	
	if (!meeti) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}

	meeti.remove();
	req.flash('exito', 'Grupo Eliminado');
	res.redirect('/administracion');
}