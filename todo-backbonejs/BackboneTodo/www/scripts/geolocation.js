// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

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
			var key = 'API-KEY-GOES-HERE'; // Add your Bing Maps API key

			if (key == 'API-KEY-GOES-HERE') {
				console.log("http://www.foo.com");
				console.warn("A Bing Maps API key was not provided, skipping the API call. Get an API key at https://msdn.microsoft.com/en-us/library/ff428642.aspx");
				onErrorCallback({}, position);
			}
			else {
				$.ajax({
					url: 'http://dev.virtualearth.net/REST/v1/Locations/' + position.coords.latitude + ',' + position.coords.longitude + '?key=' + key,
					error: function (error) { onErrorCallback(error, position) }
				}).then(onSuccessCallback);
			}


		}
	};

})(jQuery);