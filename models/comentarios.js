const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
	comentario: String,
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'usuarios',
	},
	meeti: {
		type: Schema.Types.ObjectId,
		ref: 'meeti',
	}
});

module.exports = mongoose.model('comentario', comentarioSchema);