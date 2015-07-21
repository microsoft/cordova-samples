// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
// This code was originally based on the code samples provided by the phonegap-facebook-plugin 
//  For more information see https://github.com/Wizcorp/phonegap-facebook-plugin

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // Cordova has been loaded. Initializing UI
        document.getElementById("login").addEventListener('click', app.login)
        document.getElementById("showDialog").addEventListener('click', app.showDialog)
        document.getElementById("apiTest").addEventListener('click', app.apiTest)
        document.getElementById("getAccessToken").addEventListener('click', app.getAccessToken)
        document.getElementById("getStatus").addEventListener('click', app.getStatus)
        document.getElementById("logout").addEventListener('click', app.logout)

        var parentElement = document.getElementById('deviceReadyIndicator');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();
