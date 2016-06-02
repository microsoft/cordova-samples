(function () {
	'use strict';

	angular.module('xPlat.services').service('azureStorage', ['$resource', 'guidGenerator', AzureStorage]);

	/**
	 * Azure Mobile Apps Application URL.
	 * TODO: Add your Azure Mobile App URL.
	 *
	 * @type {string}
	 * @const
	 */
	//var AZURE_MOBILE_APPS_ADDRESS = 'http://youraddress.azurewebsites.net';
	var AZURE_MOBILE_APPS_ADDRESS = '';
	var client;

	if (AZURE_MOBILE_APPS_ADDRESS) {
	    client = new WindowsAzure.MobileServiceClient(AZURE_MOBILE_APPS_ADDRESS);
	}


	/**
	 * Use the Azure Mobile Service to store todo items in the cloud.
	 *
	 * @param {angular.Service} $resource
	 * @param {angular.Service} guidGenerator
	 * @constructor
	 */
	function AzureStorage($resource, guidGenerator) {
	    this.isAvailable = AZURE_MOBILE_APPS_ADDRESS;

	    if (!AZURE_MOBILE_APPS_ADDRESS) {
	        console.warn("The Azure Mobile Apps URL is not set up properly. Items will not be stored on Azure.");
		}
		else {
	        this.todoItem = client.getTable('todoitem');
            // default todo item
		    // this.todos = [ { text: "testing", address: 67777 } ];
		}
	}

    AzureStorage.prototype.getAll = function () {

        return this.todoItem.read()
            .then(function (items) {
                console.log("items:");
                console.log(items);
                return items;
            }, handleError);
    };

    function refreshList(thisArg) {

        return thisArg.todoItem.read()
            .then(function (items) {
                console.log("refresh items:");
                console.log(items);
                return items;
            }, handleError);
    }

    function createTodoItemList(items) {
        return items;
    }

	/**
	 * Create a new todo to Azure storage.
	 *
	 * @param {string} text Text of the todo item.
	 * @param {string} address Address of the todo item.
	 */
    AzureStorage.prototype.create = function (itemText, itemAddress) {

	    console.log("creating..." + itemText);
	    return this.todoItem.insert({
	        text: itemText,
            address: itemAddress,
	        complete: false
	    }).then(success, handleError);
	};

	/**
	 * Update an existing todo in Azure storage.
	 *
	 * @param {Object} item Todo item to modify.
	 */
	AzureStorage.prototype.update = function (item) {

	    return this.todoItem.update({
	        id: item.id,
	        complete: item.complete
	    }).then(success, handleError);
	};

	/**
	 * Remove a todo from Azure storage.
	 *
	 * @param {Object} item Todo item to remove from local storage.
	 */
	AzureStorage.prototype.del = function (item) {

	    return this.todoItem.del({
	        id: item.id
	    }).then(success, handleError)
	};

	function handleError(error) {
	    var text = error + (error.request ? ' - ' + error.request.status : '');
	    console.error(text);
	    console.log('error', error.request.status);
	    if (error.request.status == '0' || error.request.status == '404') {
	        alert({
	            title: 'Connection Failure',
	            template: 'Connection with backend can not be established.'
	        });
	    }
	}

	function success(retVal) {
	    console.log("successful operation");
	    return retVal;
	}

})();