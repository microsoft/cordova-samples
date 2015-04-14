// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

var app = app || {};

(function ($) {
	'use strict';
	var dataKey = "toDoItems";
	var localToDoItems;

	// Determine if we have access to the mobile service and the todoitem table. If so,
	// use zumo storage implementation. Otherwise, resort to local storage.
	app.initializeStorage = function () {
		if (!mobileServiceClient) {
			app.Storage = localStorage;
			return;
		}

		app.todoTable = mobileServiceClient.getTable('todoitem');
		if (!app.todoTable) {
			app.Storage = localStorage;
			return;
		}
		app.Storage = azureStorage;
	};

	// Local Storage implementation
	var localStorage = {
		// Generates a GUID to use as an ID for the todos
		generateGuid: function () {
			return app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart();
		},

		// Generates a small part of a GUID
		generateGuidPart: function () {
			var guidPartNumber = (Math.random() * 0x10000) | 0;
			return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
		},

		// Retrieve all data from local storage
		getData: function () {
			localToDoItems = JSON.parse(window.localStorage.getItem(dataKey)) || [];

			if (localToDoItems) {
				app.Storage.parseData(localToDoItems);
			}
		},

		// Adds a new todo to local storage
		saveTodo: function (todo) {
			todo.save({
				id: app.Storage.generateGuid()
			});

			var todoData = {
				text: todo.get('title'),
				address: todo.get('location'),
				done: todo.get('done'),
				id: todo.get('id')
			};

			localToDoItems.push(todoData);
			window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
		},

		// Edits an existing todo in local storage
		editTodo: function (todo) {
			var todoData = {
				text: todo.get('title'),
				address: todo.get('location'),
				done: todo.get('done'),
				id: todo.get('id')
			};

			for (var i = localToDoItems.length - 1; i >= 0; i--) {
				if (localToDoItems[i].id === todoData.id) {
					localToDoItems[i] = todoData;
					break;
				}
			}

			window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
		},

		// Removes a todo from local storage
		removeTodo: function (todo) {
			var todoId = todo.get('id');

			for (var i = localToDoItems.length - 1; i >= 0; i--) {
				if (localToDoItems[i].id === todoId) {
					localToDoItems.splice(i, 1);
					break;
				}
			}

			window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
		},

		// Parses the data retrieved from storage and adds it to the app's data source
		parseData: function (data) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				app.todoCollection.create({
					title: data[i].text,
					done: data[i].done,
					location: data[i].address,
					id: data[i].id
				})
			}
		}
	}

	// Azure Mobile Services Implementation
	var azureStorage = {
		// Generates a GUID to use as an ID for the todos
		generateGuid: function () {
			return app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart();
		},

		// Generates a small part of a GUID
		generateGuidPart: function () {
			var guidPartNumber = (Math.random() * 0x10000) | 0;
			return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
		},

		// Retrieve all data from zumo storage
		getData: function () {
			app.todoTable.read().done(function (results) {
				app.Storage.parseData(results);
			})
		},

		// Adds a new todo to zumo storage
		saveTodo: function (todo) {
			todo.save({
				id: app.Storage.generateGuid()
			});

			var todoData = {
				text: todo.get('title'),
				address: todo.get('location'),
				done: todo.get('done'),
				id: todo.get('id')
			};

			app.todoTable.insert(todoData);
		},

		// Edits an existing todo in zumo storage
		editTodo: function (todo) {
			var todoData = {
				text: todo.get('title'),
				address: todo.get('location'),
				done: todo.get('done'),
				id: todo.get('id')
			};

			app.todoTable.update(todoData);
		},

		// Removes a todo from local storage
		removeTodo: function (todo) {
			var todoData = {
				text: todo.get('title'),
				address: todo.get('location'),
				done: todo.get('done'),
				id: todo.get('id')
			};

			app.todoTable.del(todoData);
		},

		// Parses the data retrieved from storage and adds it to the app's data source
		parseData: function (data) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				app.todoCollection.create({
					title: data[i].text,
					done: data[i].done,
					location: data[i].address,
					id: data[i].id
				})
			}
		}
	};

})(jQuery);