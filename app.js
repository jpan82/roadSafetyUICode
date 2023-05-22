var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.Routing.control({
    waypoints: [
        L.latLng(43.074722, -89.406389),
        L.latLng(43.076424, -89.406722)
    ],
    routeWhileDragging: true
}).addTo(map);