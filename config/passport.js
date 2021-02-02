const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
    	passwordField: 'password'
	},
	async function(email, password, done) {
		
		const usuario = await Usuario.findOne({ email });

		if (!usuario || usuario.activo === 0) return done(null, false, { message: 'Este usuario no existe.' });

		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) return done(null, false, { message: 'Password incorrecto.' });
		
		return done(null, usuario);
	}
));

passport.serializeUser( (usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {

	const usuario = await Usuario.findById(id).exec();

    return done(null, usuario);
});

module.exports = passport;