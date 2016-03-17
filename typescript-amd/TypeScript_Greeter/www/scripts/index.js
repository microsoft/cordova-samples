define(["require", "exports", './Student'], function (require, exports, Student) {
    // For an introduction to the Blank template, see the following documentation:
    // http://go.microsoft.com/fwlink/?LinkID=397705
    // To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
    // and then run "window.location.reload()" in the JavaScript Console.
    var TypeScriptGreeter;
    (function (TypeScriptGreeter) {
        var Application;
        (function (Application) {
            "use strict";
            var current = 0;
            function initialize() {
                document.addEventListener('deviceready', onDeviceReady, false);
            }
            Application.initialize = initialize;
            function onDeviceReady() {
                // Handle the Cordova pause and resume events
                document.addEventListener('pause', onPause, false);
                document.addEventListener('resume', onResume, false);
                // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
                var element = document.getElementById('geo');
                element.addEventListener('click', onClick.bind(this), false);
            }
            function createUser(loc) {
                var lastName = "User " + current++;
                var user = new Student("Jane", "M.", lastName, loc);
                showGreeter(user);
            }
            function showGreeter(person) {
                var element = document.getElementById('hello');
                element.textContent = "Hello, " + person.firstname + " " + person.lastname + " @latitude: " + person.latitude;
            }
            function onClick(args) {
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 3000 });
            }
            function onSuccess(position) {
                createUser(position.coords.latitude);
                console.log("found location data");
            }
            function onError(err) {
                createUser("no location data");
                console.log("location data not available");
            }
            function onPause() {
                // TODO: This application has been suspended. Save application state here.
            }
            function onResume() {
                // TODO: This application has been reactivated. Restore application state here.
            }
        })(Application || (Application = {}));
        Application.initialize();
    })(TypeScriptGreeter || (TypeScriptGreeter = {}));
});
//# sourceMappingURL=index.js.map