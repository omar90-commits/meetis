if (document.querySelector('#ubicacion-meeti')) {

	const map = L.map('ubicacion-meeti').setView([51.505, -0.09], 13);
	const lat = document.querySelector('#lat').value;
	const lng = document.querySelector('#lng').value;

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([lat, lng]).addTo(map)
	    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
	    .openPopup();
}