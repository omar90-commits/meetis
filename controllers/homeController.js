const Categorias = require('../models/categorias');
const Meeti = require('../models/meeti');
const { orderDate } = require('../helper');

exports.home = async (req, res) => {

	const proximoArr = [];
	const meetiProximos = [];
	const categorias = await Categorias.find();
	const meeti = await Meeti.find().populate('usuarios', 'nombre imagen');

	meeti.forEach(meet => orderDate(meet, proximoArr));
	meeti.forEach((meet, i) => {

		proximoArr[i] ? null : meetiProximos.push(meet);
	});

	meetiProximos.sort((a,b) => a.fecha - b.fecha);

	res.render('home', {
		nombrePagina: 'inicio',
		categorias,
		noAutenticado: !req.isAuthenticated(),
		meetiProximos,
	});
}