const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
	id: Number,
	nombre: {
		type: String,
		require: [true, 'El nombre es obligatorio'],
		maxlength: 60,
		trim: true,
	},
	slug: String,
});

module.exports = mongoose.model('categorias', categoriaSchema);