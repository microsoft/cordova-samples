(function () {
	'use strict';

	angular.module('xPlat.services').service('azureStorage', ['$resource', 'guidGenerator', AzureStorage]);

	/**
	 * Azure Mobile Service Application Key.
	 * TODO: Add your Azure Mobile Service Application Key.
	 *
	 * @type {string}
	 * @const
	 */ 
	var AZURE_MOBILE_SERVICES_KEY = '';

	/**
	 * Azure Mobile Service Application URL.
	 * TODO: Add your Azure Mobile Service Application URL.
	 *
	 * @type {string}
	 * @const
	 */
	var AZURE_MOBILE_SERVICES_ADDRESS = '';

	/**
	 * Use the Azure Mobile Service to store todo items in the cloud.
	 *
	 * @param {angular.Service} $resource
	 * @param {angular.Service} guidGenerator
	 * @constructor
	 */
	function AzureStorage($resource, guidGenerator) {
		this.isAvailable = AZURE_MOBILE_SERVICES_KEY && AZURE_MOBILE_SERVICES_ADDRESS;
		if (!AZURE_MOBILE_SERVICES_KEY || !AZURE_MOBILE_SERVICES_KEY) {
			console.warn("The Azure Mobile Services key and URL are not set up properly. Items will not be stored on Azure.");
		}

		// Generate the headers to access the Azure Mobile Services table.
		var azureMobileServicesInstallationId = guidGenerator.get();
		var headers = {
			'X-ZUMO-APPLICATION': AZURE_MOBILE_SERVICES_KEY,
			'X-ZUMO-INSTALLATION-ID': azureMobileServicesInstallationId,
			'X-ZUMO-VERSION': 'ZUMO/1.0 (lang=Web; os=--; os_version=--; arch=--; version=1.0.20218.0)',
			'Content-Type': 'application/json'
		};

		// Url of the Azure Mobile Services table to access.
		var azureMobileServicesTableAddress = AZURE_MOBILE_SERVICES_ADDRESS + 'tables/todoitem/:id';

		this.toDoItem = $resource(azureMobileServicesTableAddress, { id: '@id' }, {
			'query': {
				method: 'GET',
				params: { $top: '1000' },
				isArray: true,
				headers: headers
			},
			'delete': {
				method: 'DELETE',
				headers: headers
			},
			'save': {
				method: 'POST',
				headers: headers
			},
			'update': {
				method: 'PATCH',
				headers: headers
			}
		});
	}

	/**
	 * Retrieve all data from Azure storage.
	 */
	AzureStorage.prototype.getAll = function () {
		return this.toDoItem.query();
	};

	/**
	 * Create a new todo to Azure storage.
	 *
	 * @param {string} text Text of the todo item.
	 * @param {string} address Address of the todo item.
	 */
	AzureStorage.prototype.create = function (text, address) {
		var item = new this.toDoItem({
			text: text,
			address: address,
			done: false
		});

		return item.$save();
	};

	/**
	 * Update an existing todo in Azure storage.
	 *
	 * @param {Object} item Todo item to modify.
	 */
	AzureStorage.prototype.update = function (item) {
		return item.$update();
	};

	/**
	 * Remove a todo from Azure storage.
	 *
	 * @param {Object} item Todo item to remove from local storage.
	 */
	AzureStorage.prototype.del = function (item) {
		return item.$delete();
	};
})();