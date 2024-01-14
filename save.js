var markers = [];
function addMarker() {
    var latitude = parseFloat(document.getElementById('latitude').value);
    var longitude = parseFloat(document.getElementById('longitude').value);
    var text = document.getElementById('text').value;
    // var latitude = 36.99137080167048
    // var longitude = -122.05817034570666
    // var text = "asdfasdfasdf"
    alert('I ran'+latitude+longitude+text);


        // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid numeric values for latitude and longitude.');
        return;
    }
    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 }, // Set the initial map center
        zoom: 14 // Set the initial zoom level

    });
    var marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
    })
    var infoWindow = new google.maps.InfoWindow({
        content: text
    });
    google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infoWindow.close();
    });
    markers.push({ marker: marker, infoWindow: infoWindow });
    displayMarkersOnMap()
    return marker

}
function displayMarkersOnMap() {
    for (var i = 0; i < markers.length; i++) {
        alert(markers[i]);
    }
    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 },
        zoom: 14
    });

    // Loop through the markers array and display each marker on the map
    markers.forEach(function (markerInfo) {
        var marker = markerInfo.marker;
        var infoWindow = markerInfo.infoWindow;

        marker.setMap(map);

        google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.open(map, marker);
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            infoWindow.close();
        });
    });
}
function initMap() {
    // Replace 'YOUR_MAP_ID' with your actual Map ID
    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 }, // Set the initial map center
        zoom: 14 // Set the initial zoom level

    });
    // const marker = new google.maps.Marker({
    //     position: {lat: 36.99137080167048, lng: -122.05817034570666},
    //     map: map,
    //     Label: "E",
    //     animation: google.maps.Animation.DROP,
    // })
    // var marker1 = addMarker(map, 36.99137080167048, -122.05817034570666,"Event:xyzasdfasdf Time: 4:00 - 5:00pm");
    // var marker2 = addMarker(map, 36.99145981370278, -122.06457980622133,"Event:xyzasdfasdf Time: 4:00 - 6:00pm");
    // var marker1 = addMarker(map)
    

}


//36.99137080167048, -122.05817034570666