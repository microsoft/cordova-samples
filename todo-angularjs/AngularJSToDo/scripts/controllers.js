(function () {
	'use strict';
	angular.module("xPlat.controllers")
        .controller('ToDoCtrl', ['$scope', 'maps', 'storage', function ($scope, maps, storage) {
        	var refresh = function () {
        		$scope.todos = storage.getAll();
        	}

        	var updateAddress = function (toDoItem) {
        		return maps.getCurrentPosition()
                    .then(maps.getAddressFromPosition, function (error) { return error.message; })
                    .then(function (address) {
                    	toDoItem.address = address;
                    	return storage.update(toDoItem);
                    }, function (errorMessage) {
                    	toDoItem.address = errorMessage;
                    	return storage.update(toDoItem);
                    });
        	}

        	$scope.addToDo = function () {
        		var text = $scope.newToDoText;
        		if (!text) {
        			return;
        		};

        		$scope.newToDoText = '';
        		storage.create(text, "Getting location...")
                    .then(function (todo) {
                    	$scope.todos.push(todo);
                    	return todo;
                    }).then(updateAddress);
        	}

        	$scope.changeToDoText = function (toDoItem) {
        		storage.update(toDoItem)
                    .then(updateAddress)
        	}

        	$scope.toggleToDoDone = function (toDoItem) {
        		toDoItem.done = !toDoItem.done;
        		storage.update(toDoItem);
        	}

        	$scope.removeToDo = function (toDoItem) {
        		storage.del(toDoItem).then(function (todo) {
        			var index = $scope.todos.indexOf(todo);
        			$scope.todos.splice(index, 1);
        		});
        	}
        	refresh();
        }]);
})();