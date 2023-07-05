// Setting up the maps
var map = L.map("map").setView([17.38000, 78.49000], 11)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var map2 = L.map("map2").setView([17.38000, 78.49000], 11)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map2);

// Variables to use
var geo_loc = document.getElementById("GeoLoc");

var bound = [];
var marker = [];
var img = L.imageOverlay();

var time = document.getElementById("time");
time.disabled = true;


// Event Listeners

// Get Location and relocate map 2
geo_loc.onclick = function(){
  const bounds = [map.getBounds().getWest(), map.getBounds().getSouth(), map.getBounds().getEast(), map.getBounds().getNorth()];
  bound = [
    [map.getBounds().getNorth(), map.getBounds().getWest()],
    [map.getBounds().getSouth(), map.getBounds().getEast()]
  ];
  
  console.log(bounds);

  map2.fitBounds( bound );

  // img = L.imageOverlay("img/img1.jfif", bound);

  if (map2.hasLayer(img)){
    map2.removeLayer(img);
  };

  // img = L.imageOverlay("img/img1.jfif", bound).addTo(map2);

  time.disabled = false;
  time.value = 100;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://b1bb-34-123-217-130.ngrok-free.app/visual-image/', true)
  xhr.setRequestHeader('Content-type', 'application/json');
  // xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

  xhr.onload = function() {
    // console.log(this.responseText)
    var image = this.response;
    img = L.imageOverlay(image, bound).addTo(map2);
  }

  parms = JSON.stringify({"bbox": [14.344822, 14.366206, 77.581514, 77.601144],"time_of_interest": "2022-04-07/2022-05-07"});

  xhr.send(parms);
  
};

// Changing the overlay with slider
time.onchange = function(){
  val = time.value;
  console.log(val);

  if(val>75 && val <= 100){
    imgURL = "img/img1.jfif";
  }
  else if(val>50 && val <= 75){
    imgURL = "img/img2.jfif";
  }
  else if(val>25 && val <= 50){
    imgURL = "img/img3.gif";
  }
  else{
    imgURL = "img/img4.webp";
  };

  if (map2.hasLayer(img)){
    map2.removeLayer(img);
  };

  img = L.imageOverlay(imgURL, bound).addTo(map2);
};

// Setting of markers on the map
// map2.on('click', function(e) {
//   // var latitude = e.latlng.lat; 
//   // var longitude = e.latlng.lng;

//   var cords = [e.latlng.lat, e.latlng.lng];

//   if (marker != []){
//     map2.removeLayer(marker);
//   };

//   marker = L.marker(cords).addTo(map2);
//   console.log(cords);
//   console.log(e);
// });

// Create polygons on map
var drawn_items = new L.FeatureGroup();
map2.addLayer(drawn_items);
     
var draw_control = new L.Control.Draw({
  position: 'topright',
  draw: {
    polyline: false,
    circle: false,
    polygon:{
      shapeOptions:{
        color:'red'
      }
    },
    rectangle:{
      shapeOptions:{
        color:'purple'
      }
    }
  },
  edit: {
    featureGroup: drawn_items,
    edit: false
  }
});
map2.addControl(draw_control);

map2.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
      layer = e.layer;
      
  var coordinates = layer.toGeoJSON().geometry.coordinates
      
  // if (type === 'marker') {
    
  // }

  console.log(layer.toGeoJSON())
  console.log(coordinates)

  drawn_items.addLayer(layer);
});

$("#fetchBtn").on("click", function() {
  console.log("Fetching Data");

  const xhr = new XMLHttpRequest;

  xhr.open("GET", "https://jsonplaceholder.typicode.com/posts", true);

  xhr.onload = function() {
    console.log(this.responseText)
  }

  xhr.send();
});

$("#postBtn").on("click", function() {
  console.log("Posting Data");

  const xhr = new XMLHttpRequest;

  xhr.open("POST", "https://jsonplaceholder.typicode.com/posts", true);
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onload = function() {
    console.log(this.responseText)
  }

  parms = JSON.stringify({"userId": 1, "id": 1, "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"});

  xhr.send(parms);
});