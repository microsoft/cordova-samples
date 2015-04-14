// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

var app = app || {};
var ENTER_KEY = 13;

(function ($) {
    'use strict';

    app.TodoView = Backbone.View.extend({
        // This is the tag we wrap around our template
        tagName: 'div',

        // HTML item template
        template: _.template($('#todo-template').html()),

        // Hook up event handlers to mousedown and change events
        events: {
            'mousedown .templateToggle': 'toggleCompleted',
            'mousedown .templateRemove': 'deleteTodo',
            'change .templateTitle': 'updateTodo',
        },

        // Hook up event handlers to our model
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'todoDescriptionChanged', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        // "Refresh" the todo in response to a change in the model
        render: function () {
            this.$el.html(this.getTemplateData());
            this.$input = this.$('.templateTitle');
            this.$toggle = this.$('.templateToggle');
            this.updateCrossOut();

            return this;
        },

        // We supply the model (as json) to instantiate our template
        getTemplateData: function () {
            return this.template(this.model.toJSON());
        },

        // Updates the checkbox and style of text based upon whether or not
        // the todo is marked as done
        updateCrossOut: function() {
            if (this.model.get('done')) {
                this.$input.addClass('crossedOut');
                this.$toggle.addClass('checked');
                this.$toggle.removeClass('unchecked');
            }
            else {
                this.$input.removeClass('crossedOut');
                this.$toggle.removeClass('checked');
                this.$toggle.addClass('unchecked');
            }
        },

        // Toggle the completed state of the todo
        toggleCompleted: function () {
            this.model.toggleCompleted();
            this.updateCrossOut();
            app.Storage.editTodo(this.model);
        },

        // Updates the description of the todo and updates the todo in storage
        updateTodo: function () {
            var desc = this.$input.val().trim();
            var todo = this.model;
            if (desc)
            {
            	todo.save({
					title: desc
            	});
            	todo.trigger('todoDescriptionChanged');
            	app.Storage.editTodo(todo);

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
            }
        },

        // Removes the todo and deletes it from storage
        deleteTodo: function () {
            app.Storage.removeTodo(this.model);
            this.model.destroy();
        }
    })

})(jQuery);