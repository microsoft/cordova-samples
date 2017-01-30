var cordovahostedweb;
(function (cordovahostedweb) {
    var Cordova;
    (function (Cordova) {
        "use strict";
        var StartHostedWebApp;
        (function (StartHostedWebApp) {
            var oReq = new XMLHttpRequest();
            function checkConnectionAndRedirect() {
                //oReq.addEventListener("progress", updateProgress);
                oReq.addEventListener("load", transferComplete);
                oReq.addEventListener("error", transferFailed);
                oReq.addEventListener("abort", transferCanceled);
                oReq.open("GET", "https://cordovahostedweb.azurewebsites.net/");
                oReq.send();
            }
            StartHostedWebApp.checkConnectionAndRedirect = checkConnectionAndRedirect;
            function transferComplete(data) {
                var targetUrl = "https://cordovahostedweb.azurewebsites.net/cordova/setPlatformCookie?platform=" + cordova.platformId;
                window.location.replace(targetUrl);
            }
            function transferFailed(err) {
                console.log(err.target.reason);
                console.log(oReq.status);
            }
            function transferCanceled(data) {
                console.log(data.target.reason);
            }
        })(StartHostedWebApp = Cordova.StartHostedWebApp || (Cordova.StartHostedWebApp = {}));
    })(Cordova = cordovahostedweb.Cordova || (cordovahostedweb.Cordova = {}));
})(cordovahostedweb || (cordovahostedweb = {}));
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
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
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = CordovaHostedApp.Application || (CordovaHostedApp.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(CordovaHostedApp || (CordovaHostedApp = {}));
//# sourceMappingURL=appBundle.js.map