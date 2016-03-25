// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var watchID = undefined;

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        $('#check-div').hide();
        $('#weather').hide();
        $('#pictures').hide();
        $('#places').hide();
        $('#map').hide();

        

        $('#geo-select').on('change', function (e) {

            if (this.value == "weather") {
                $('#check-div').show();
                $('#map').hide();
                $('#pictures').hide();
                $('#places').hide();
                $('#weather').show();

                getWeatherLocation();

                $('check-div').attr('checked', false);

                if (watchID != undefined) {
                    navigator.geolocation.clearWatch(watchID);
                }

            } else if (this.value == "places") {

                $('#check-div').show();
                $('#weather').hide();
                $('#pictures').hide();
                $('#map').hide();
                $('#places').show();

                getPlacesLocation();

                $('#geo_check').attr('checked', false);

                if (watchID != undefined) {
                    navigator.geolocation.clearWatch(watchID);
                }

            }else if (this.value == "pictures") {
                $('#check-div').show();
                $('#weather').hide();
                $('#map').hide();
                $('#places').hide();
                $('#pictures').show();

                getPicturesLocation();

                $('#geo_check').attr('checked', false);

                if (watchID != undefined) {
                    navigator.geolocation.clearWatch(watchID);
                }

            } else if (this.value == "map") {
                $('#check-div').show();
                $('#weather').hide();
                $('#pictures').hide();
                $('#places').hide();
                $('#map').show();

                getMapLocation();

                $('#geo_check').attr('checked', false);

                if (watchID != undefined) {
                    navigator.geolocation.clearWatch(watchID);
                }

            } else {
                $('#check-div').hide();
                $('#geo_check').attr('checked', false);

                if (watchID != undefined) {
                    navigator.geolocation.clearWatch(watchID);
                }

            }
        });

        $('#geo_check').on('change', function (e) {

            if (this.checked == true) {

                if ($('#weather').is(":visible")) {

                    watchID = watchWeatherPosition();

                } else if ($('#places').is(":visible")) {

                    watchID = watchPlacesPosition();

                } else if ($('#pictures').is(":visible")) {

                    watchID = watchPicturePosition();

                } else if ($('#map').is(":visible")) {

                    watchID = watchMapPosition();
                } else {

                    // Do nothing.
                }

            } else {

                navigator.geolocation.clearWatch(watchID);
            }
        });
            
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

