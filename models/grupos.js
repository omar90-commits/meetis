const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const gruposSchema = new Schema({
	nombre: {
		type: String,
		require: [true, 'El nombre es obligatorio'],
		maxlength: 60,
		trim: true,
	},
	descripcion: {
		type: String,
		require: [true, 'La descripcion es obligatoria'],
		trim: true,
	},
	url: String,
	imagen: String,
	usuarios: {
		type: Schema.Types.ObjectId,
		ref: 'usuarios',
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: 'categorias',
	},
});

module.exports = mongoose.model('grupos', gruposSchema);