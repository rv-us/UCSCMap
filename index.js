alert('script works')
// import { eventsToday } from './main.js';
var markers = [];
var counter = 0;
var LocationData = {
    "Baskin Engineering": {latitude: 37.00106407252911, longitude: -122.06274894048028},
    "Porter": {latitude: 36.994427880972744, longitude: -122.06544000979235},
};
function printEvents() {
    alert('I was pressed')
    var text;
    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 }, // Set the initial map center
        zoom: 14 // Set the initial zoom level
    });
    for (const event of eventsToday) {
        if(event.location === undefined){
            console.log('online');
        }
        else{
            counter++;
            text = `Event: ${event.summary}, Date: ${event.start.dateTime || event.start.date}`;
            geocodeAddress(event.location,text);
        }
        console.log(`Event: ${event.summary}, Date: ${event.start.dateTime || event.start.date}, Location: ${event.location}`);
    }
    setTimeout(function() {
        console.log("Waited for 2 seconds!");
        console.log(markers);
        displayMarkersOnMap(map);
    }, 2000);
    
    }
    function geocodeAddress(address1,text) {
        var address = address1;

        // Create a Geocoder object
        var geocoder = new google.maps.Geocoder();

        // Make a request to the Geocoding service
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                // Get the first result (assuming it's the most accurate)
                var location = results[0].geometry.location;
                var formattedAddress = results[0].formatted_address;
                console.log('Formatted Address:', formattedAddress);
                // Extract latitude and longitude
                var latitude = location.lat();
                var longitude = location.lng();
                console.log(latitude);
                console.log(longitude);
                markers.unshift(latitude, longitude, text);
            }
        });
    }
function add2arryloc(){
    var location = document.getElementById('location').value;
    if (!(location in LocationData)) {
        alert('Please enter a Valid location');
        return;
    }
    var loc = LocationData[location]
    var latitude = loc.latitude
    var longitude = loc.longitude
    var text = document.getElementById('text').value;
    counter++;
    alert('I ran' + latitude + longitude + text + counter);

    // Check if latitude and longitude are valid numbers
    markers.unshift(latitude, longitude, text);

    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 }, // Set the initial map center
        zoom: 14 // Set the initial zoom level
    });

    displayMarkersOnMap(map);
}
function add2array() {
    var latitude = parseFloat(document.getElementById('latitude').value);
    var longitude = parseFloat(document.getElementById('longitude').value);
    var text = document.getElementById('text').value;
    counter++;
    alert('I ran' + latitude + longitude + text + counter);

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid numeric values for latitude and longitude.');
        return;
    }
    markers.unshift(latitude, longitude, text);

    var map = new google.maps.Map(document.getElementById('map'), {
        mapId: 'bcfa2e27e0216909',
        center: { lat: 36.99137080167048, lng: -122.05817034570666 }, // Set the initial map center
        zoom: 14 // Set the initial zoom level
    });

    displayMarkersOnMap(map);
}

function displayMarkersOnMap(map) {
    console.log(markers);
    console.log(counter);
    var counter2 = -1;

    // Loop through the markers array and display each marker on the map
    for (var i = 0; i < counter; i++) {
        console.log(markers[counter2 + 1]);
        console.log(markers[counter2 +2]);
        var marker = new google.maps.Marker({
            position: { lat: markers[counter2 + 1], lng: markers[counter2 + 2] },
            map: map,
        });

        var infoWindow = new google.maps.InfoWindow({
            content: markers[counter2 + 3],
        });

        attachInfoWindow(marker, infoWindow, map);

        counter2 += 3;
    }
}

function attachInfoWindow(marker, infoWindow, map) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infoWindow.close();
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
//36.995361645213855, -122.05914907855643
//36.99563233442705, -122.0592310991228