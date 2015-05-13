var app = app || {};

(function () {
    'use strict';

    var TodoCollection = Backbone.Collection.extend({
        model: app.TodoModel,
    });

    app.todoCollection = new TodoCollection;
})();