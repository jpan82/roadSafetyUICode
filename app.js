// set the map
let map = L.map('map').setView([43.074722, -89.406389], 30);
let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// get the coordinate of a clicked point
function getCoordinateClickPoint() {
  map.on("contextmenu", function (event) {
    console.log("Coordinates: " + event.latlng.toString());
  });
}

// 10 means the most safety, 1 means the most unsafety
let color = ["blue", "red", "purple"]

let baseLayer = {
  "OpenStreetMap": osm,
};

let overlayer = {};

let layerControl = L.control.layers(baseLayer, overlayer).addTo(map);

// the coordinates of each segments in the road
let roadCoordinates = [];
let colorRoadLayer;

let routingControl = L.Routing.control({
  // the begin coordinate
  waypoints: [
    L.latLng(43.074722, -89.406389),
    L.latLng(43.07629, -89.4067)
  ],
  routeWhileDragging: true, //allows users to drag a waypoint
  router: L.Routing.graphHopper('a986570d-8859-496d-b394-a64290b956ea'),
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

routingControl.on('routesfound', function (event) {
  const route = event.routes[0];

  const coordinate = route.coordinates;
  roadCoordinates.length = 0;

  coordinate.forEach(function (coordinate) {
    let coordinateEach = [coordinate.lat, coordinate.lng];
    roadCoordinates.push(coordinateEach);
  });

  // Remove the previous color road layer if it exists
  if (colorRoadLayer) {
    map.removeLayer(colorRoadLayer);
    layerControl.removeLayer(colorRoadLayer);
  }

  colorRoadLayer = drawColorRoadSegment(roadCoordinates);
  map.addLayer(colorRoadLayer);
  layerControl.addOverlay(colorRoadLayer, "colorRoad");

  let credits = route.summary.totalCredits;
  let remainingCredits = route.summary.remainingCredits;
  console.log('This request consumed ' + credits + ' credit(s)');
  console.log('You have ' + remainingCredits + ' left');
});

let popupLayer = L.layerGroup(); // Create a layer group for the popups
function drawColorRoadSegment(coordinateArray) {
  let colorRoadGroup = L.layerGroup(); // Create a layer group for the color road segments

  for (let i = 0; i < coordinateArray.length - 1; i++) {
    let coordinate = coordinateArray[i];
    let nextCoordinate = coordinateArray[i + 1];
    let coordinateForMap = [coordinate, nextCoordinate];
    console.log(coordinateForMap);
    let idx = Math.floor(Math.random() * 3);
    //console.log(idx)
    let polyline = new L.Polyline(coordinateForMap, {
      color: color[idx],
      weight: 10,
      opacity: 0.5,
      smoothFactor: 1
    });

    //console.log(polyline);
    let segmentGroup = L.layerGroup([polyline]);
    colorRoadGroup.addLayer(segmentGroup);
  }

  return colorRoadGroup;
}
console.log(roadCoordinates);

