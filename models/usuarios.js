const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		maxlength: 60,
		trim: true,
	},
	descripcion: String,
	email: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		maxlength: 60,
		trim: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'El password es obligatorio'],
		trim: true,
		maxlength: 60,
	},
	activo: {
		type: Number,
		maxlength: 1,
		defaultValue: 0,
	},
	imagen: {
		type: String,
		maxlength: 60
	},
	tokenPassword: String,
	expiraToken: String,
});

usuarioSchema.pre('save', async function(next) {

	if (!this.isModified('password')) return next();
	
	const hash = await bcrypt.hash(this.password, 12);
	this.password = hash;
	next();
});

module.exports = mongoose.model('usuarios', usuarioSchema);