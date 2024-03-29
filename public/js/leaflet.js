export function displayMap(locations) {
  // Create map
  var map = L.map('map', {
    // Center is irrelevant here. As we will be setting 'bounds' later on based on locations
    center: [0, 0],
    // Zoom is irrelevant here. As we will be setting 'bounds' later on based on locations
    zoom: 0,
    // Zoom controls removed here. As default is 'topleft' which is outside of our skewed 'map box'
    zoomControl: false,
    // Remove the annoying zoom with scroll wheel
    scrollWheelZoom: false
  });

  // Add tile layer, else you cannot see the map
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Change Zoom controls to top right of map div
  L.control
    .zoom({
      position: 'topright'
    })
    .addTo(map);

  // Customize the icon for the 'markers'
  const myIcon = L.icon({
    classname: 'marker',
    iconUrl: '/img/pin.png',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -30]
  });

  // Create markers and popups for locations
  locations.forEach(loc => {
    // 1) get lat lng coordinates
    loc.latLng = [loc.coordinates[1], loc.coordinates[0]];
    // 2) create marker
    loc.marker = L.marker(loc.latLng, { icon: myIcon, className: 'marker' });
    // 3) create popup content and popup
    loc.popupContent = `Day ${loc.day}: ${loc.description}`;
    loc.popup = L.popup(loc.latLng, {
      content: loc.popupContent,
      // These settings keep all popups open. The default is to have one open at a time, change on click
      autoClose: false,
      closeOnClick: false
    });

    // 4) add markers and popups to the map
    loc.marker.addTo(map);
    loc.marker.bindPopup(loc.popup).openPopup();
  });

  // Setting map to automatically fit all markers
  // 1) set bounds
  const bounds = L.latLngBounds(locations.map(loc => loc.latLng));
  map.fitBounds(bounds);

  // 2) Set Zoom level to not be too close and to not be covered my 'masked' skewed shape
  const boundsZoom = map.getBoundsZoom(bounds);
  map.setZoom(boundsZoom > 14 ? 13 : boundsZoom - 1);
}
