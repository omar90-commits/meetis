const hbs = require('hbs');
const moment = require('moment');

hbs.registerHelper('mostrarAlertas', (mensajes, opciones) => {

	const menssages = Object.values(mensajes)[0];
	const tipoMensaje = Object.keys(mensajes)[0];

	if (!menssages) return;

	let html = '', estadoMensaje = tipoMensaje === 'correcto' ? true : false;

	menssages.forEach(mensaje => html += `<p class="${estadoMensaje ? 'exito' : 'error'} alerta">${mensaje}</p>`);

	return opciones.fn().html = html;
});

hbs.registerHelper('categoriasSeleccionadas', (categoria, opciones) => {

	const { categoriaSeleccionada, categorias } = categoria;
	const select = categoriaSeleccionada.nombre;

	let html = '';

	categorias.forEach(e => html += `<option value="${e.id}" ${select === e.nombre ? 'selected' : ''}>${e.nombre}</option>`);

	return opciones.fn().html = html;
});

hbs.registerHelper('gruposSeleccionados', (grupos, opciones) => {

	let html = '';

	if (grupos.selected) {

		grupos.grupos.forEach(e => html += `<option value="${e.id}" ${grupos.selected === e.nombre ? 'selected' : ''}>${e.nombre}</option>`);

	} else {

		grupos.forEach(e => html += `<option value="${e.id}">${e.nombre}</option>`);
	}


	return opciones.fn().html = html;
});

hbs.registerHelper('fechas', (fecha, opciones) => {

	moment.locale('es');
	const fechaEditada = moment(fecha).format('LL');

	return opciones.fn().fechaEditada = fechaEditada;
});

hbs.registerHelper('isCurrent', (a, b, c, d, opts) => {

	b = b ? b.toString() : b;
	a = a.toString();
	c = c.toString();

	if (d) d = d._id.toString();

    return (a === b || c === d) ? opts.fn(this) : opts.inverse(this);
});