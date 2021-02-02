const Usuarios = require('../../models/usuarios');
const Grupos = require('../../models/grupos');

exports.mostrarUsuario = async (req, res) => {

	const grupos = await Grupos.find( { usuarios: req.params.id }).populate('usuarios', 'nombre descripcion imagen');

	if (!grupos) return res.redirect('/');
	
	res.render('mostrar-perfil', {
		nombrePagina: `Perfil Usuario: ${grupos[0].usuarios.nombre}`,
		usuario: grupos[0].usuarios,
		grupos,
		noAutenticado: !req.isAuthenticated(),
	});
}