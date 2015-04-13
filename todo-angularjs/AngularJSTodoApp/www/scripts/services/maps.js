(function () {
	'use strict';

	angular.module('xPlat.services').service('maps', ['$rootScope', '$q', '$window', '$resource', 'cordova', Maps]);

	// Bing maps to retreive addresses from locations.
	function Maps($rootScope, $q, $window, $resource, cordova) {
		var BING_MAPS_API_KEY = 'API-KEY-GOES-HERE'; // TODO: Add your Bing Maps API key
		if (BING_MAPS_API_KEY === 'API-KEY-GOES-HERE') {
			console.warn("A Bing Maps API key was not provided, skipping the API call. Get an API key at https://msdn.microsoft.com/en-us/library/ff428642.aspx");
		}
		this.url = 'http://dev.virtualearth.net/REST/v1/Locations/:latitude,:longitude?key=' + BING_MAPS_API_KEY;

		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$window = $window;
		this.$resource = $resource;
		this.cordova = cordova;
	}

	Maps.prototype.getCurrentPosition = function () {
		var _this = this;
		return this.cordova.ready.then(function () {
			var deferred = _this.$q.defer();
			_this.$window.navigator.geolocation.getCurrentPosition(function (successValue) {
				_this.$rootScope.$apply(function () {
					deferred.resolve(successValue);
				}.bind(_this));
			}, function (errorValue) {
				_this.$rootScope.$apply(function () {
					deferred.reject(errorValue);
				}.bind(_this));
			});

			return deferred.promise;
		});
	};

	/**
	 * Gets an address from a position.
	 * @params position
	 */
	Maps.prototype.getAddressFromPosition = function (position) {
		var _this = this;
		return this.$resource(_this.url, {})
			.get({ latitude: position.coords.latitude, longitude: position.coords.longitude })
			.$promise.then(function (response) {
				return response.resourceSets[0].resources[0].address.formattedAddress;
			}, function (error) {
				return position.coords.latitude + ',' + position.coords.longitude
			});
	};
})();