const Meeti = require('../../models/meeti');
const Grupos = require('../../models/grupos');
const Usuarios = require('../../models/usuarios');
const Categorias = require('../../models/categorias');
const Comentarios = require('../../models/comentarios');

exports.mostrarMeeti = async (req, res) => {

	const meeti = await Meeti.findOne({url: req.params.url});
	const grupos = await Grupos.findById(meeti.grupoId);
	const usuarios = await Usuarios.findById(meeti.usuarios);
	const lat = meeti.ubicacion[0];
	const lng = meeti.ubicacion[1];
	const confirmar = meeti.interesados.includes(!req.user || req.user._id);
	let eliminarComentario;
	
	if (!meeti) return res.redirect('/');

	let comentarios = await Comentarios.find({ meeti: meeti._id }).populate('usuario', '_id nombre imagen');

	res.render('mostrar-meeti', {
		nombrePagina: meeti.titulo,
		meeti,
		grupos,
		usuarios,
		logeadoUser: req.user,
		noAutenticado: !req.isAuthenticated(),
		lat,
		lng,
		confirmar,
		comentarios,
		userLogeado: req.user ? req.user._id : null,
	});
}

// Confirma o cancela si el usuario asistira al meet
exports.confirmarAsistencia = async (req, res) => {

	const { accion } = req.body;

	const meeti = await Meeti.findOne({ url: req.params.url });

	if (accion === 'Confirmar') {


		meeti.interesados.push( req.user._id.toString() );
		await meeti.save();

		res.status(200).send('Haz confirmado tu asistencia');

	} else {

		const interesados = meeti.interesados.filter(el => el !== req.user._id.toString());
		meeti.interesados = interesados;

		await meeti.save();
		res.status(200).send('Haz cancelado tu asistencia');
	}
}

// Muestra el listado de los asistentes
exports.mostrarAsistentes = async (req, res) => {

	const { interesados } = await Meeti.findOne({ url: req.params.url });
	const asistentes = await Usuarios.find({ _id: interesados });

	res.render('asistentes-meeti', {
		nombrePagina: 'Listado Asistentes Meeti',
		asistentes,
	});
}

// Muestra los meetis por categoria
exports.mostrarCategoria = async (req, res) => {

	const grupos = await Grupos.find({ categoria: req.params.categoria }).populate('categoria');

	if (!grupos) {

		const categoria = await Categorias.findById(req.params.categoria);

		res.render('categoria', {
			nombrePagina: `Categoria: ${categoria.nombre}`,
			noAutenticado: !req.isAuthenticated(),
		});

		return;
	}

	const gruposIdArr = grupos.map(grupo => grupo.id);
	const meetis = await Meeti.find({ grupoId: gruposIdArr }).populate('usuarios');

	res.render('categoria', {
		nombrePagina: `Categoria: ${grupos[0].categoria.nombre}`,
		meetis,
		noAutenticado: !req.isAuthenticated(),
	});
}