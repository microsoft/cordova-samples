(function () {
	'use strict';

	angular.module("xPlat.controllers").controller('ToDoCtrl', ['maps', 'storage', '$scope', ToDoCtrl]);

	/**
	 * Controller for the todo list.
	 * 
	 * @param {!angular.Service} maps
	 * @param {!angular.Service} storage
	 * @constructor
	 * @export
	 */
	function ToDoCtrl(maps, storage, $scope) {

	    this.maps = maps;
	    this.storage = storage;
	    var that = this;

	    storage.getAll().then(function (items) {
	        that.todos = items;
            // Refresh on another thread.
	        setTimeout(function () {
	            $scope.$apply();
	        }, 0);
	    });

	    this.updateAddress = function (toDoItem) {
	        var _this = this;

	        return this.maps.getCurrentPosition()
                .then(_this.maps.getAddressFromPosition.bind(_this.maps), function (error) { return error.message; })
                .then(function (address) {
                    toDoItem.address = address;
                    return _this.storage.update(toDoItem);
                }, function (errorMessage) {
                    toDoItem.address = errorMessage;
                    return _this.storage.update(toDoItem);
                });
	    }

	    this.refresh = function () {
	        setTimeout(function () {
	            $scope.$apply();
	        }, 0);
	    }

	}

	/**
	 * Update the item location with an address.
	 * @param toDoItem
	 */

	/**
	 * Add a todo item to the list.
	 */
	ToDoCtrl.prototype.addToDo = function () {
		var _this = this;

		var text = this.newToDoText;
		if (!text) {
			return;
		};

		this.newToDoText = '';
		this.storage.create(text, 'Getting location...')
			.then(function (todo) {
				_this.todos.push(todo);
				return todo;
			}).then(this.updateAddress.bind(this));
	};

	/**
	 * Update the text of a todo item.
	 */
	ToDoCtrl.prototype.changeToDoText = function (toDoItem) {
		this.storage.update(toDoItem)
			.then(this.updateAddress.bind(this))
	};

	/**
	 * Check/uncheck a todo item.
	 */
	ToDoCtrl.prototype.toggleToDoDone = function (toDoItem) {
		toDoItem.done = !toDoItem.done;
		this.storage.update(toDoItem);
	};

	/**
	 * Remove a todo item from the list.
	 */
	ToDoCtrl.prototype.removeToDo = function (toDoItem, $index) {
		var _this = this;
		this.storage.del(toDoItem).then(function (todo) {
			// var index = _this.todos.indexOf(todo);
			_this.todos.splice($index, 1);
		    _this.refresh();
		});
	};
})();