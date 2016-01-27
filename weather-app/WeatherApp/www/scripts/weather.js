function getWeather() {

    var zipcode = $('#input-box').val();
    var queryString =
        "https://query.yahooapis.com/v1/public/yql?q=" +
        "select+*+from+weather.forecast+where+location=" +
         zipcode + "&format=json";

    $.getJSON(queryString, function (results) {
        if (results.query.count > 0) {
            var weather = results.query.results.channel;

            $('#description').text(weather.description);

            var wind = weather.wind;
            $('#temp').text(wind.chill);
            $('#wind').text(wind.speed);

            var atmosphere = weather.atmosphere;
            $('#humidity').text(atmosphere.humidity);
            $('#visibility').text(atmosphere.visibility);

            var astronomy = weather.astronomy;
            $('#sunrise').text(astronomy.sunrise);
            $('#sunset').text(astronomy.sunset);
        }

    });
}

function getLocation() {

    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

    $('#description').text("Determining your current location ...");
    $('#get-weather').prop("disabled", true);
}

var onSuccess = function (position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Get zipCode by using latitude and longitude.


    // Step 1: Use latitude and longitude to get Yahoo API woeid
    var woeidQueryString = "https://query.yahooapis.com/v1/public/yql?q=" +
        "select%20*%20from%20ugeo.reversegeocode%20where%20latitude%3D" + latitude +
        "%20and%20longitude%3D" + longitude + "%20and%20appname%3D%22WeatherApp%22&format=json";

    var woeid;
    $.ajax({
        url: woeidQueryString,
        async: false,
        dataType: 'json',
        success: function (results) {

            if (results.query.count > 0) {

                // Find woeid of geo coordinates.
                woeid = results.query.results.result.locations.woe.id;

            }

        }
    });


    //Step 2: Use woeid to find zipcode
    var zipCodeQueryString = "https://query.yahooapis.com/v1/public/yql?q=" +
        "select%20*%20from%20geo.places%20where%20woeid%3D" + woeid + "&format=json";

    $.getJSON(zipCodeQueryString, function (results) {

        if (results.query.count > 0) {

            // Find zipcode using woeid.
            var zipCode = results.query.results.place.postal.content;
            // Put the zip code into the input box for the user.
            $('#input-box').val(zipCode);

            $('#description').text("Get the Weather");
            $('#get-weather').prop("disabled", false);

        }

    });

}

function onError(error) {
    console.log('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
}
