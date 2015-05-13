var app = app || {};

(function ($) {
    'use strict';

    app.Geolocation = {
        // Retrieves the position of your device. Designed to be used with getAddressFromLocation, as callback is
        // passed to the next function in the promise chain, along with the position object.
        getLocation: function (onSuccessCallback, onErrorCallback) {
            var deferred = new $.Deferred();

            var onSuccess = function (position) {
                deferred.resolve(position, onSuccessCallback, onErrorCallback);
            }

            var onError = function (position) {
                onErrorCallback(position);
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

            return deferred.promise();
        },

        // Queries a RESTful service in order to convert latitude and longitude into more detailed location information,
        // then passes this information to the callback supplied by getLocation.
        getAddressFromLocation: function (position, onSuccessCallback, onErrorCallback) {
            var key = ''; // Add your Bing Maps API key
            var requestUrl = 'http://dev.virtualearth.net/REST/v1/Locations/' + position.coords.latitude + ',' + position.coords.longitude + '?key=' + key;


            $.ajax({
                url: requestUrl,
                error: function (error) { onErrorCallback(error, position) }
            }).then(onSuccessCallback);
        }
    };

})(jQuery);