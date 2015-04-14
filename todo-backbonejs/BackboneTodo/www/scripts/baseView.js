// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

var app = app || {};
var ENTER_KEY = 13;

(function ($) {
    'use strict';

    app.BaseView = Backbone.View.extend({
        // This is the DOM element for the base view
        el: '#todoapp',

        // Hook up event handler to DOM keypress event
        events: {
            'keypress #new-todo': 'createNewTodo',
        },

        initialize: function () {
            // Retrieve DOM elements
            this.$input = this.$('#new-todo');
            this.$todoList = this.$('#todo-list');

            // Hook up some event handlers to the data source
            this.listenTo(app.todoCollection, 'add', this.addTodo);
            this.listenTo(app.todoCollection, 'reset', this.createNewTodosFromCollection);
            this.listenTo(app.todoCollection, 'all', this.render);

            // Retrieve existing data from storage
            app.Storage.getData();
        },

        // Create a new view from a todo and append it to our list.
        addTodo: function (todo) {
            var view = new app.TodoView({ model: todo });
            this.$todoList.append(view.render().el);
        },

        // Regenerates the entire todo list from the data source
        createNewTodosFromCollection: function () {
            this.$todoList.html('');
            app.todoCollection.each(this.addTodo, this);
        },

        // Creates a new todo from user input
        createNewTodo: function (e) {
            if (e.which === ENTER_KEY && this.$input.val().trim()) {
                var todo = app.todoCollection.create({
                    title: this.$input.val().trim(),
                    done: false
                });
                app.Storage.saveTodo(todo);

                // This callback will take data from the RESTful service, retrieve the street address,
                // and set it in the todo, then save it.
                var onSuccess = function (data) {
                    todo.save({
                        location: data.resourceSets[0].resources[0].address.formattedAddress
                    })

                    app.Storage.editTodo(todo);
                };

                var onError = function (error, position) {
                    todo.save({
                        location: position.coords.latitude + "," + position.coords.longitude
                    })

                    app.Storage.editTodo(todo);
                };

                // Retrieve the location data
                app.Geolocation.getLocation(onSuccess, onError).then(app.Geolocation.getAddressFromLocation);

                // Clear the input
                this.$input.val('');
            }
        }
    })

})(jQuery);