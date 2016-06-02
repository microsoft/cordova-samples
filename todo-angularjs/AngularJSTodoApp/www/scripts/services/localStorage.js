(function () {
	'use strict';

	angular.module('xPlat.services').service('localStorage', ['$q', '$window', 'guidGenerator', LocalStorage]);

	/**
	 * Local storage service.
	 * @param {angular.Service} $q
	 * @param {angular.Service} $window
	 * @param {angular.Service} guidGenerator
	 * @constructor
	 */
	function LocalStorage($q, $window, guidGenerator) {
		this.$q = $q;
		this.$window = $window;
		this.guidGenerator = guidGenerator;
	}

	/**
	 * Key for storing todo items locally.
	 * @type {string}
	 * @const
	 */
	LocalStorage.prototype.LOCAL_STORAGE_KEY = 'toDoItems';

	/**
	 * Load JSON data from the local storage.
	 * @return {Object} Todo items.
	 */
	LocalStorage.prototype.loadFromStorage = function () {
		return angular.fromJson(this.$window.localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
	};

	/**
	 * Save JSON data in the local storage.
	 * @params {Object} items Todo items.
	 */
	LocalStorage.prototype.saveToStorage = function (items) {
		this.$window.localStorage.setItem(this.LOCAL_STORAGE_KEY, angular.toJson(items));
	}

	/**
	 * Retrieve all data from local storage.
	 */
	LocalStorage.prototype.getAll = function () {

	    var items;
	    var _this = this;
	    items = _this.loadFromStorage();
	    return _this.$q.when(items);
	};

	/**
	 * Create a new todo to local storage.
	 * @param {string} text Text of the todo item.
	 * @param {string} address Address of the todo item.
	 */
	LocalStorage.prototype.create = function (text, address) {
		var item = {
			id: this.guidGenerator.get(),
			text: text,
			address: address,
			done: false
		}
		var items = this.loadFromStorage();
		items.push(item);

		this.saveToStorage(items);
		return this.$q.when(item);
	};

	/**
	 * Update an existing todo in local storage.
	 * @param {Object} item Todo item to modify.
	 */
	LocalStorage.prototype.update = function (item) {
		var items = this.loadFromStorage();
		for (var i = 0; i < items.length; i++) {
			if (items[i].id === item.id) {
				items[i] = item;
				break;
			}
		}

		this.saveToStorage(items);
		return this.$q.when(item);
	};

	/**
	 * Remove a todo from local storage.
	 * @param {Object} item Todo item to remove from local storage.
	 */
	LocalStorage.prototype.del = function (item) {
		var items = this.loadFromStorage();
		for (var i = 0; i < items.length; i++) {
			if (items[i].id === item.id) {
				items.splice(i, 1);
				break;
			}
		}

		this.saveToStorage(items);
		return this.$q.when(item);
	};
})();