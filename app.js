let map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.Routing.control({
    // the begin coordinate
    waypoints: [
        L.latLng(43.074722, -89.406389),
        L.latLng(43.076424, -89.406722)
    ],
    routeWhileDragging: true, //allows users to drag a waypoint
    geocoder: L.Control.Geocoder.nominatim(), // use the geocode
    //router: L.Routing.graphHopper('b998e59b-7730-4892-a04c-db63ec9227a9'),
    
}).addTo(map);