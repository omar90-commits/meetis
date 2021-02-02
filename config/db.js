const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/devMetti', { 
		useUnifiedTopology: true,
		useNewUrlParser: true,
	}, 
	(err, res) => {

	if (err) throw err;
	else console.log('bases de datos online');
});

// Todo se derrumbo dentor de mi