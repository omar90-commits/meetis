const Meeti = require('../../models/meeti');
const Grupos = require('../../models/grupos');

exports.mostrarGrupo = async (req, res) => {

	const consultas = [];
	consultas.push( Grupos.findById(req.params.id) );
	consultas.push( Meeti.find( { grupoId: req.params.id } ) );

	const [grupo, meetis] = await Promise.all( consultas );

	if (!grupo) return res.redirect('/');

	res.render('mostrar-grupo', {
		nombrePagina: `Informacion Grupo: ${grupo.nombre}`,
		grupo,
		meetis,
		noAutenticado: !req.isAuthenticated(),
	});
}