const Categorias = require('../models/categorias');
const Grupos = require('../models/grupos');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

exports.formNuevoGrupo = async (req, res) => {

	const categorias = await Categorias.find();

	res.render('nuevo-grupo', {
		nombrePagina: 'Crea un nuevo grupo',
		categorias,
	});
}

exports.sanatizeCamposGrupos = async (req, res, next) => {

	// Sanatizar campos
	req.sanitizeBody('nombre').escape();
	// req.sanitizeBody('descripcion').escape();
	req.sanitizeBody('categoria').escape();

	// Validar campos
	req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
	// req.checkBody('descripcion', 'La descripcion es obligatorio').notEmpty();
	req.checkBody('categoria', 'La categoria es obligatorio').notEmpty();

	const errores = req.validationErrors();

	if (errores) {

		req.flash('error', errores.map(error => error.msg));

		return res.redirect('/nuevo-grupo');
	} 

	next();
}

exports.subirImagen = async (req, res, next) => {

	const categoria = await Categorias.findOne({ id: req.body.categoria });

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
	archivo.mv(`public/uploads/grupos/${nombreImg}`);
	req.imagen = nombreImg;

	next();
}

exports.crearGrupo = async (req, res) => {

	const grupo = new Grupos(req.body);
	const categoria = await Categorias.findOne({ id: req.body.categoria });

	grupo.categoria = categoria._id;
	grupo.usuarios = req.user._id;

	if (req.imagen) grupo.imagen = req.imagen;

	try {

		await grupo.save();

		req.flash('correcto', 'Se ah creado el grupo correctamente');
		res.redirect('/administracion');

	} catch (error) {

		console.log(error);
		req.flash('error', 'Ah ocurrido un error');
		res.redirect('/nuevo-grupo');
	}
}

exports.formEditarGrupo = async (req, res) => {

	const grupo = await Grupos.findById(req.params.id);
	const categoriaSeleccionada = await Categorias.findById(grupo.categoria);
	const categorias = await Categorias.find();
	const objCategoria = {
		categoriaSeleccionada,
		categorias,
	}

	res.render('editar-grupo', {
		nombrePagina: `Editar Grupo: ${grupo.nombre}`,
		grupo,
		objCategoria,
	});
}

exports.editarGrupo = async (req, res) => {

	const grupo = await Grupos.findOne({_id: req.params.id, usuarios: req.user.id});

	if (!grupo) {

		req.flash('error', 'Operacion no valida');

		return res.redirect('/administracion');
	}

	const { nombre, descripcion, categoria, url } = req.body;
	const categoriaBD = await Categorias.findOne({ id: categoria });

	grupo.nombre = nombre;
	grupo.descripcion = descripcion;
	grupo.categoria = categoriaBD._id;
	grupo.url = url;

	await grupo.save();

	req.flash('correcto', 'Cambios almacenados correctamente');
	res.redirect('/administracion');
}

exports.formEditarImagen = async (req, res) => {

	const grupo = await Grupos.findOne({_id: req.params.id, usuarios: req.user.id});

	res.render('imagen-grupo', {
		nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
		grupo,
	});
}

exports.editarImagen = async (req, res) => {

	const grupo = await Grupos.findOne({_id: req.params.id, usuarios: req.user.id});	
	const pathImage = path.resolve(__dirname, `../public/uploads/grupos/${grupo.imagen}`);

	if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);

	if (req.imagen) grupo.imagen = req.imagen;

	try {

		await grupo.save();

		req.flash('correcto', 'Se ah editado la imagen correctamente');
		res.redirect('/administracion');

	} catch (error) {

		console.log(error);
		req.flash('error', 'Ah ocurrido un error');
		res.redirect('/nuevo-grupo');
	}
}

// Eliminar grupo

exports.formEliminarGrupo = async (req, res) => {

	const grupo = await Grupos.findOne({_id: req.params.id, usuarios: req.user.id});

	if (!grupo) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}

	res.render('eliminar-grupo', {
		nombrePagina: `Eliminar Grupo: ${grupo.nombre}`,
		grupo,
	});
}

// Eliminar grupo e imagen
exports.eliminarGrupo = async (req, res) => {

	const grupo = await Grupos.findOne({_id: req.params.id, usuarios: req.user.id});
	const pathImage = path.resolve(__dirname, `../public/uploads/grupos/${grupo.imagen}`);

	if (!grupo) {

		req.flash('error', 'Operacion no valida');
		return res.redirect('/administracion');
	}

	if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);
		
	grupo.remove();

	req.flash('exito', 'Grupo Eliminado');

	res.redirect('/administracion');
}