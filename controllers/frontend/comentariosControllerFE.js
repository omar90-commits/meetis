const Comentarios = require('../../models/comentarios');
const Meeti = require('../../models/meeti');

exports.agregarComentario = async (req, res) => {

	const comentario = new Comentarios(req.body);

	comentario.usuario = req.user._id;
	comentario.meeti = req.params.id;
	
	comentario.save();
	res.redirect('back');
}

exports.eliminarComentario = async (req, res, next) => {

	const id = Object.keys(req.body)[0];

	try {

		const comentario = await Comentarios.findById(id);
		const meeti = await Meeti.findOne({ _id: comentario.meeti });
	
		if (comentario.usuario.toString() === req.user._id.toString() || req.user._id.toString() === meeti.usuarios.toString()) {

			comentario.remove();
			res.status(200).send('Eliminado correctamente');
			return next();
		
		} else {

			res.status(403).send('Accion no valida');
			return next();
		}

	} catch(err) {

		res.status(404);
		return next();
	}

}