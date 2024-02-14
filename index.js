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
        var roomaddress = address1;
        var building = "";
    
        var keysList = [];
        for (var key in dataDictionary) {
            if (dataDictionary.hasOwnProperty(key)) {
                keysList.push(key);
            }
        }
        console.log(keysList);
        for (var i = 0; i < keysList.length; i++) {
            var key = keysList[i];
    
            if (roomaddress.includes(key)) {
                building = key;
                // Remove the key from the string (replace it with an empty string)
                roomaddress = roomaddress.replace(key, '');
    
                // Break out of the loop once a match is found
                break;
            }
        }
        var match = roomaddress.match(/\d{3}/);

        // If numbers are found, extract the first 3 or 2 if only 2 are found
        roomaddress = match ? match[0] : null;
        console.log(roomaddress);
        console.log(building);
    
        // Create a Geocoder object
        var geocoder = new google.maps.Geocoder();

        // Make a request to the Geocoding service
        geocoder.geocode({ 'address': address }, function (results, status) {
            console.log(status)
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
                console.log(text);
                markers.unshift({
                    latitude: latitude,
                    longitude: longitude,
                    text: text
                });
            }
            else{
                var innerDictionary = dataDictionary[building];

            if (innerDictionary) {
                for (var key2 in innerDictionary) {
                    var location = innerDictionary[key2];

                    // Check if the search value matches the desired condition
                    if (key2 === roomaddress) {
                        // Access latitude and longitude
                        var latitude = location.lat;
                        var longitude = location.long;

                        // Perform further actions with latitude and longitude
                        console.log("Found:", building, key2, "Latitude:", latitude, "Longitude:", longitude);
                        markers.unshift({
                            latitude: latitude,
                            longitude: longitude,
                            text: text
                        });
                    }
                }
            } else {
                console.log("Target key not found in dictionary");
            }
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

    // Create a dictionary to store combined text for markers with the same coordinates
    var combinedText = {};

    // Loop through the markers array and combine text for markers with the same coordinates
    for (var i = 0; i < markers.length; i++) {
        console.log(markers[i].latitude);
        var key = markers[i].latitude + "_" + markers[i].longitude;
        console.log("works")
        if (!combinedText[key]) {
            combinedText[key] = markers[i].text;
        } else {
            combinedText[key] += '\n' + markers[i].text;
        }
    }

    // Loop through the combinedText dictionary and create markers
    for (var coord in combinedText) {
        var [latitude, longitude] = coord.split("_").map(parseFloat);

        var marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
        });

        var infoWindow = new google.maps.InfoWindow({
            content: combinedText[coord],
        });

        attachInfoWindow(marker, infoWindow, map);
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