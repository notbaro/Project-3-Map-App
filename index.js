// Initialize and add the map
let map;
let marker;
/**
 * Array of points of interest (POIs).
 * @type {Array<Object>}
 */
const pois = [
  {
    lat1: 34.24251491947838,
    lng1: -118.52703094482422,
    lat2: 34.24130199538592,
    lng2: -118.5253946876064,
    title: "Matadrome",
  },
  {
    lat1: 34.24196385937947,
    lng1: -118.52931414261761,
    lat2: 34.24103367177424,
    lng2: -118.52784434959068,
    title: "Jacaranda Hall",
  },
  {
    lat1: 34.24133326956706,
    lng1: -118.5297795151298,
    lat2: 34.241008127230636,
    lng2: -118.52951547604901,
    title: "Arbor Grill",
  },
  {
    lat1: 34.23844683857952,
    lng1: -118.53136410199077,
    lat2: 34.23811712136042,
    lng2: -118.53005166458505,
    title: "Sierra Hall",
  },
  {
    lat1: 34.24058962849595,
    lng1: -118.52518375258005,
    lat2: 34.239345118911714,
    lng2: -118.52472526054382,
    title: "Student Recreation Center",
  },
];
//
/**
 * Checks if the given latitude and longitude are within the specified point of interest (POI).
 * @param {number} lat - The latitude value.
 * @param {number} lng - The longitude value.
 * @param {number} poiIndex - The point of interest in the pois array.
 * @returns {boolean} - Returns true if the latitude and longitude are within the POI, otherwise returns false.
 */
const isInPoi = (lat, lng, poi) => {
  if (lat < poi.lat1 && lat > poi.lat2 && lng > poi.lng1 && lng < poi.lng2) {
    return true;
  }
  return false;
};

async function initMap() {
  // The location of CSUN
  const position = { lat: 34.2401, lng: -118.5298 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  //@ts-ignore
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at CSUN
  map = new Map(document.getElementById("map"), {
    center: position,
    mapId: "b01f010105a35503",
    clickableIcons: false,
    draggable: false,
    scrollwheel: false,
    panControl: false,
    maxZoom: 17,
    minZoom: 17,
    zoom: 17,
  });

  marker = new AdvancedMarkerElement({
    position,
    map,
    title: "CSUN",
  });
  questionaireMaker(map);
}

async function questionaireMaker(map) {
  //randomize pois
  pois.sort(() => Math.random() - 0.5);
  for (const poi of pois) {
    $("#questionaire").append(
      "<h3>Where is <strong>" + poi.title + "</strong>?</h3>"
    );
    const correct = await userClicksOnMap(poi, map);
    if (correct) {
      $("#questionaire")
        .append("<p>Correct!</p>")
        .children("*:last-child")
        .css("color", "green");
    } else {
      $("#questionaire")
        .append("<p>Incorrect!</p>")
        .children("*:last-child")
        .css("color", "red");
    }
    const rectangle = new google.maps.Rectangle({
      strokeColor: "#FFFFFF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: correct ? "#00FF00" : "#FF0000",
      fillOpacity: 0.35,
      map,
      bounds: {
        north: poi.lat1,
        south: poi.lat2,
        east: poi.lng2,
        west: poi.lng1,
      },
    });
  }
  $("#questionaire")
    .append('<button class="btn" id="reset">Retry</button>')
    .children("button")
    .on("click", () => {
      document.location.reload();
    });
}

const userClicksOnMap = async (poi, map) => {
  return new Promise((resolve, reject) => {
    const listener = map.addListener("dblclick", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const isCorrect = isInPoi(lat, lng, poi);
      if (isCorrect) {
        resolve(true);
      } else {
        resolve(false);
      }
      google.maps.event.removeListener(listener);
    });
  });
};

initMap();
