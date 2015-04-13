(function () {
	'use strict';

	angular.module('xPlat.services').factory('storage', ['$injector', storage]);

	/**
	 * Storage service to abstract specific implementations.
	 *
	 * @params {!angular.Service} $injector
	 */
	function storage($injector) {
		// If Azure storage is available, use it. Otherwise, use local storage.
		var azureService = $injector.get('azureStorage');
		return azureService.isAvailable ? azureService : $injector.get('localStorage');
	}
})();