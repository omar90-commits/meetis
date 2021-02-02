const moment = require('moment');

const orderDate = (meet, proximoArr) => {

	const anio = new Date().getFullYear();
	const mes = new Date().getMonth() + 1;
	const dia = new Date().getDate();
	const fecha = '20' + moment(meet.fecha).format('YY-MM-DD');
	const fechaActual = (`${anio}-0${mes}-${dia}`).split('-');
	const fechaArr = fecha.split('-');

	if (fechaArr[0] > fechaActual[0]) proximoArr.push(false);
	else if (fechaArr[0] < fechaActual[0]) proximoArr.push(true);
	else if (fechaArr[1] > fechaActual[1]) proximoArr.push(false);
	else if (fechaArr[1] < fechaActual[1]) proximoArr.push(true);
	else if (fechaArr[2] > fechaActual[2]) proximoArr.push(false);
	else if (fechaArr[2] < fechaActual[2]) proximoArr.push(true);
	else proximoArr.push(false);

	return proximoArr;
}

module.exports = {
	orderDate,
}