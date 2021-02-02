import { OpenStreetMapProvider } from 'leaflet-geosearch';
import './eliminarComentario';

const alertas = Array.from(document.querySelectorAll('.alerta'));
const latitud = document.querySelector('#lat');
const longitud = document.querySelector('#lng');
const direccion = document.querySelector('#direccion');
const h1 = document.querySelector('h1');
const editar = new RegExp('Editar Meeti:', 'gi').test(`${h1.textContent}`);

alertas.forEach((alerta, i) => setTimeout(() => alerta.remove(), (i+1) + '500'));

if (document.getElementById('mapa')) {

	let lat = 51.505;
	let lng = -0.09;
	const map = L.map('mapa').setView([lat, lng], 13);
	let markers = new L.FeatureGroup().addTo(map);
	let marker;

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	if (latitud && longitud && editar) {
				
		marker = new L.marker([latitud.value, longitud.value], {
			draggable: true,
			autoPan: true
		})
		.addTo(map)
		.bindPopup(direccion)
		.openPopup()
	}

	const buscador = document.getElementById('formbuscador');

	buscador.addEventListener('input', buscarDireccion);
	
	function buscarDireccion(e) {

		if (e.target.value.length > 8) {

			// Si existe un pin anterior limpiarlo
			if (marker) map.removeLayer(marker);

			// Utilizar el provider y GeoCode
			const provider = new OpenStreetMapProvider();

			provider.search({ query: e.target.value })
				.then(res => {

					if (!res[0]) return;

					res.length > 0 && map.setView(res[0].bounds[0], 15);

					document.getElementById('lat').value = res[0].bounds[0][0];
					document.getElementById('lng').value = res[0].bounds[0][1];

					marker = new L.marker(res[0].bounds[0], {
						draggable: true,
						autoPan: true
					})
					.addTo(map)
					.bindPopup(res[0].label)
					.openPopup()
					
					// Detectar movimiento del marker
					marker.on('moveend', function(e) {
						
						marker = e.target;
						const position = marker.getLatLng();
						map.panTo(new L.LatLng(position.lat, position.lng))
						document.getElementById('lat').value = position.lat;
						document.getElementById('lng').value = position.lng;
					});
				})

		}
	}
}
