var WeatherApp = {};

(function ($, ns, navigator) {
    ns.getWeather = function () {
        var zipcode = $('#zip-code-input').val();

        // get weather using zip code
        var queryString =
            'https://query.yahooapis.com/v1/public/yql?q='
            + 'select+*+from+weather.forecast+where+location='
            + zipcode + '&format=json';

        $.getJSON(queryString, function (results) {
            if (results.query.count > 0 && results.query.results.channel.wind) {
                $('#error-msg').hide();
                $('#weather-data').show();

                var weather = results.query.results.channel;
                $('#title').text(weather.title);

                var wind = weather.wind;
                $('#temperature').text(wind.chill);
                $('#wind').text(wind.speed);

                var atmosphere = weather.atmosphere;
                $('#humidity').text(atmosphere.humidity);
                $('#visibility').text(atmosphere.visibility);

                var astronomy = weather.astronomy;
                $('#sunrise').text(astronomy.sunrise);
                $('#sunset').text(astronomy.sunset);

                $('#summary img').attr('src', $(weather.item.description)[0].src);

            } else {
                $('#weather-data').hide();
                $('#error-msg').show();
                $('#error-msg').text("Error retrieving data. " + results.query.results.channel.item.title);
            }
        }).fail(function (jqXHR) {
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        });

        return false;
    }

    ns.getLocation = function () {
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError, { enableHighAccuracy: true });

        $('#error-msg').show();
        $('#error-msg').text('Determining your current location ...');

        $('#get-weather-btn').prop('disabled', true);
    }

    var onGetLocationSuccess = function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // get zip code by using latitude and longitude.
        var queryString = 'http://gws2.maps.yahoo.com/findlocation?pf=1&locale=en_US&offset=15&flags=&q='
            + latitude + '%2c' + longitude + '&gflags=R&start=0&format=json';

        $.getJSON(queryString, function (results) {
            $('#error-msg').hide();

            if (results.Found > 0) {
                // put the zip code into the input box for the user if we get a location
                var zipCode = results.Result.uzip
                $('#zip-code-input').val(zipCode);
            }
        }).fail(function () {
            $('#error-msg').text('Error retrieving data.');
        }).always(function () {
            // always reset the UI even if we fail to get a ZIP code from the service.
            $('#get-weather-btn').prop('disabled', false);
        });
    }

    var onGetLocationError = function (error) {
        $('#error-msg').text('Error getting location. Leaving zip code field blank');
        $('#get-weather-btn').prop('disabled', false);
    }

})($, WeatherApp, navigator);