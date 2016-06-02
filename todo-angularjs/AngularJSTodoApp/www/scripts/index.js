// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

(function () {
    'use strict';

    //document.addEventListener('deviceready', function () {
    //    angular.bootstrap(document, ['Your App Name']);

        //var elem = document.getElementById('xPlat');
        //angular.bootstrap(elem, ["xPlat"]);

    //}, false);

    angular.module('xPlat', ['xPlat.services', 'xPlat.controllers', 'xPlat.directives']);
    angular.module('xPlat.directives', []);
    angular.module('xPlat.controllers', []);
    angular.module('xPlat.services', ['ngResource']);

})();