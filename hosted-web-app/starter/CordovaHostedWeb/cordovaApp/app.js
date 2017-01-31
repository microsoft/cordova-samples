/// <reference path="typings/cordova/cordova.d.ts" />
/// <reference path="typings/cordova/plugins/Camera.d.ts" />
var CordovaHostedApp;
(function (CordovaHostedApp) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
        }
        function onPause() {
        }
        function onResume() {
        }
    })(Application = CordovaHostedApp.Application || (CordovaHostedApp.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(CordovaHostedApp || (CordovaHostedApp = {}));
//# sourceMappingURL=app.js.map