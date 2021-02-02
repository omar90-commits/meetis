const Meeti = require('../../models/meeti');
const Grupos = require('../../models/grupos');
const Usuarios = require('../../models/usuarios');

exports.resultadoBusquedas = async (req, res) => {

	const { categoria, titulo, ciudad, pais } = req.query;
	const grupos = await Grupos.find({categoria});
	const meetis = await Meeti.find({
		titulo,
		ciudad,
		pais,
	});

	console.log(grupos)

	res.render('busqueda', {
		nombrePagina: 'Resultados Busqueda',
		meetis,
		grupos,
	});
}
