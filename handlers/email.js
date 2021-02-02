const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');
const fs = require('fs');

const transport = nodemailer.createTransport({
	host: emailConfig.host,
	port: emailConfig.port,
	auth: {
		user: emailConfig.user,
		pass: emailConfig.pass,
	}
});

// Utilizar templetes de handlebars
transport.use('compile', hbs({
	viewEngine: 'hbs',
	viewPath: __dirname + '/../views/emails',
	extName: '.hbs',
}));

exports.enviar = async(opciones) => {
	
	const opcionesEmail = {
		from: 'Meeti <noreply@meeti.com',
		to: opciones.usuario.email,
		subject: opciones.subject,
		template: opciones.archivo,
		context: {
			url: opciones.url
		}
	}

	const sendMail = util.promisify(transport.sendMail, transport);
	return sendMail.call(transport, opcionesEmail);
}