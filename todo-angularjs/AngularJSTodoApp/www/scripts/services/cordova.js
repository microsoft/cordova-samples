(function () {
	'use strict';

	angular.module('xPlat.services').factory('cordova', ['$q', '$window', '$timeout', cordova]);

	/**
	 * Service that allows access to Cordova when it is ready.
	 * 
	 * @param {!angular.Service} $q
	 * @param {!angular.Service} $window
	 * @param {!angular.Service} $timeout
	 */
	function cordova($q, $window, $timeout) {
		var deferred = $q.defer();
		var resolved = false;

		// Listen to the 'deviceready' event to resolve Cordova.
		// This is when Cordova plugins can be used.
		document.addEventListener('deviceready', function () {
			resolved = true;
			deferred.resolve($window.cordova);
			console.log('deviceready fired');
		}, false);

		// If the 'deviceready' event didn't fire after a delay, continue.
		$timeout(function () {
			if (!resolved && $window.cordova) {
				deferred.resolve($window.cordova);
			}
		}, 1000);

		return { ready: deferred.promise };
	}
})();