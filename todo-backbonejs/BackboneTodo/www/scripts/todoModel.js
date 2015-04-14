// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

var app = app || {};

(function () {
    'use strict';

    app.TodoModel = Backbone.Model.extend({

        defaults: {
            title: '',
            done: false,
            // This placeholder text is displayed while the app is querying the device's
            // location and supplying it to the restful service to obtain a street address.
            location: 'Getting your location...'
        },

        toggleCompleted: function () {
            this.save({
                done: !this.get('done')
            });
        },

        // We don't want to sync. We have a local/zumo storage implementation
        sync: function () { return false; }
    });

})();