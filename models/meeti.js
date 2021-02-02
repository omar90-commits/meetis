const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const meetiSchema = new Schema({
	titulo: {
		type: String,
		required: [true, 'El titulo es obligatorio'],
		maxlength: 60,
		trim: true,
	},
	invitado: String,
	cupo: {
		type: Number,
		default: 0,
	},
	descripcion: {
		type: String,
		trim: true,
		required: [true, 'La descripcion es obligatorio'],
	},
	fecha: {
		type: Date,
		required: [true, 'La fecha es obligatoria'],
	},
	hora: {
		type: String,
		required: [true, 'La hora es obligatoria'],
	},
	direccion: {
		type: String,
		required: [true, 'La hora es obligatoria'],
		maxlength: 60,
		trim: true,
	},
	ciudad: {
		type: String,
		required: [true, 'La ciudad es obligatoria'],
		maxlength: 60,
		trim: true,
	},
	estado: {
		type: String,
		required: [true, 'El estado es obligatoria'],
		maxlength: 60,
		trim: true,
	},
	pais: {
		type: String,
		required: [true, 'El pais es obligatoria'],
		maxlength: 60,
		trim: true,
	},
	ubicacion: [Number],
	interesados: {
		type: [String],
		default: [],
	},
	usuarios: {
		type: Schema.Types.ObjectId,
		ref: 'usuarios',
	},
	grupoId: String,
	imgGrupo: String,
	url: String,
});

meetiSchema.pre('save', function() {

	if (this.url) return;
	
	const url = `${slug(this.titulo)}-${shortid.generate()}`;
	this.url = url;
});

module.exports = mongoose.model('meeti', meetiSchema);