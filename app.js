// set the map
let map = L.map('map').setView([43.074722, -89.406389], 30);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// get the coordinate of a clicked point
function getCoordinateClickPoint() {
  map.on("contextmenu", function (event) {
    console.log("Coordinates: " + event.latlng.toString());
  });
}

// example json
let geoJson = {
  "type": "Feature",
  "properties": [10, 8, 9, 7, 5],
  "segmentNum": 5,
  "geometry": {
    "type": "Point",
    "coordinates": [
      [43.074722, -89.406389],
      [43.07471, -89.40621],
      [43.07528, -89.4062],
      [43.07609, -89.40588],
      [43.07644, -89.40661],
      [43.07629, -89.4067]
    ]
  }
}

// 10 means the most safety, 1 means the most unsafety
let safetyValueColor = {
  10: "blue",
  9: "green",
  8: "orange",
  7: "yellow",
  6: "pink",
  5: "red",
  4: "gray",
  3: "brown",
  2: "purple",
  1: "black",
};

function createPopup(startLat, startLng, endLat, endLng, safetyValue) {
  let popup = L.popup()
    .setLatLng([(startLat + endLat) / 2, (startLng + endLng) / 2])
    .setContent("Safety Value is " + safetyValue);

  return popup;
}

let popupLayer = L.layerGroup(); // Create a layer group for the popups

function drawColorRoadSegment(geoJson) {
  let idx = geoJson.geometry.coordinates.length;
  let startCoorLat = geoJson.geometry.coordinates[0][0];
  let startCoorLng = geoJson.geometry.coordinates[0][1];
  let endCoorLat = geoJson.geometry.coordinates[idx - 1][0];
  let endCoorLng = geoJson.geometry.coordinates[idx - 1][1];
  let colorRoad = L.layerGroup();

  geoJson.geometry.coordinates.forEach((coordinate, index) => {
    if (index < geoJson.geometry.coordinates.length - 1) {
      let color = safetyValueColor[geoJson.properties[index]];
      let nextCoordinate = geoJson.geometry.coordinates[index + 1];
      let coordinateArray = [coordinate, nextCoordinate];
      let polyline = new L.Polyline(coordinateArray, {
        color: color,
        weight: 10,
        opacity: 0.5,
        smoothFactor: 1
      });
      colorRoad.addLayer(polyline);

      let popup = createPopup(coordinate[0], coordinate[1], nextCoordinate[0], nextCoordinate[1], geoJson.properties[index]);
      popupLayer.addLayer(popup);
    }
  });

  colorRoad.addTo(map);

  let routingControl = L.Routing.control({
    // the begin coordinate
    waypoints: [
        L.latLng(startCoorLat, startCoorLng),
        L.latLng(endCoorLat, endCoorLng)
    ],
    routeWhileDragging: true, //allows users to drag a waypoint
    router: L.Routing.graphHopper('b998e59b-7730-4892-a04c-db63ec9227a9'),
    geocoder: L.Control.Geocoder.nominatim(), // use the geocode
    lineOptions: {
      styles: [
        {
          color: '#3388ff',
          opacity: 0.6,
          weight: 2
        }
      ]
    }
    
  }).addTo(map);

}


drawColorRoadSegment(geoJson);

popupLayer.addTo(map); // Add the popup layer to the map






