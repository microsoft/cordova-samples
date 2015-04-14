// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

var app = app || {};

(function () {
    'use strict';

    var TodoCollection = Backbone.Collection.extend({
        model: app.TodoModel,
    });

    app.todoCollection = new TodoCollection;
})();