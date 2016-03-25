
var Latitude = undefined;
var Longitude = undefined;

// Get geo coordinates

function getWeatherLocation() {

    navigator.geolocation.getCurrentPosition(onWeatherSuccess, onWeatherError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onWeatherSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getWeather(Latitude, Longitude);
}

// Get weather by using coordinates

function getWeather(latitude, longitude) {

    var queryString = "http://gws2.maps.yahoo.com/findlocation?pf=1&locale=en_US&offset=15&flags=&q="
        + latitude + "%2c" + longitude + "&gflags=R&start=0&format=json";

    $.getJSON(queryString, function (results) {

        if (results.Found > 0) {
            var zipCode = results.Result.uzip;
            var queryString = "https://query.yahooapis.com/v1/public/yql?q="
              + "select+*+from+weather.forecast+where+location="
              + zipCode + "&format=json";

            $.getJSON(queryString, function (results) {

                if (results.query.count > 0) {
                    var weather = results.query.results.channel;

                    $('#description').text(weather.description);
                    $('#temp').text(weather.wind.chill);
                    $('#wind').text(weather.wind.speed);
                    $('#humidity').text(weather.atmosphere.humidity);
                    $('#visibility').text(weather.atmosphere.visibility);
                    $('#sunrise').text(weather.astronomy.sunrise);
                    $('#sunset').text(weather.astronomy.sunset);
                }
            });
        }
    }).fail(function () {
        console.log("error getting location");
    });
}

// Success callback for watching your changing position

var onWeatherWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getWeather(updatedLatitude, updatedLongitude);
    }
}

// Error callback

function onWeatherError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchWeatherPosition() {

    return navigator.geolocation.watchPosition(onWeatherWatchSuccess, onWeatherError, { enableHighAccuracy: true });
}