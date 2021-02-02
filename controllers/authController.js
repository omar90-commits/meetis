const Grupos = require('../models/grupos');
const Meeti = require('../models/meeti');
const passport = require('passport');
const { orderDate } = require('../helper');

exports.autenticarUsuario = passport.authenticate('local', { 
	successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios', 
});

// Revisa si el usuario esta autenticado o no
exports.usuarioAutenticado = (req, res, next) => {

	if (req.isAuthenticated()) return next();

	res.redirect('/iniciar-sesion');
}

// Formulario para iniciar sesion
exports.formIniciarSesion = async (req, res) => {

	res.render('iniciar-sesion', {
		nombrePagina: 'Iniciar Sesion',
		noAutenticado: true,
	});
}

// Panel de administracion
exports.administracion = async (req, res) => {
	
	const proximoArr = [];
	const meetiAnteriores = [];
	const meetiProximos = [];
	const grupos = await Grupos.find({ usuarios: req.user._id });
	const meeti = await Meeti.find({ usuarios: req.user._id });

	meeti.forEach(meet => orderDate(meet, proximoArr));

	meeti.forEach((meet, i) => {

		proximoArr[i] ? meetiAnteriores.push(meet) : meetiProximos.push(meet);
	});

	meetiProximos.sort((a,b) => a.fecha - b.fecha);

	res.render('administracion', {
		nombrePagina: 'Panel de administracion',
		grupos,
		meetiAnteriores,
		meetiProximos,
	});
}

exports.cerrarSesion = (req, res) => {

	req.logout();
	req.flash('correcto', 'Cerraste sesion correctamente');
	res.redirect('/iniciar-sesion');
}