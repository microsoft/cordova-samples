// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var SERVER = "http://cordova-vm.apache.org:5000";
    var dataFileEntry;

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);

        var btn = document.getElementById('test');
        btn.addEventListener('click', onTestConnection.bind(this), false);

        createSomeData();

    };

    function onOffline() {
        // Handle the offline event
        console.log("connection lost");
    }

    function onOnline() {
        // Handle the online event
        var networkState = navigator.connection.type;

        if (networkState !== Connection.NONE) {
            if (dataFileEntry) {
                tryToUploadFile();
            }
        }
        display('Connection type: ' + networkState);
    }

    function onTestConnection() {

        var networkState = navigator.connection.type;
        display('Connection type: ' + networkState);
    }

    // Make a network request
    // Requires File-Transfer and File plugins
    function tryToUploadFile() {
        // !! Assumes variable fileURL contains a valid URL to a text file on the device,
        var fileURL = getDataFileEntry().toURL();

        var success = function (r) {
            console.log("Response = " + r.response);
            display("Uploaded. Response: " + r.response);
        }

        var fail = function (error) {
            console.log("An error has occurred: Code = " + error.code);
            offlineWrite("Failed to upload: some offline data");
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";

        var ft = new FileTransfer();
        // Make sure you add the domain of your server URL to the 
        // Content-Security-Policy <meta> element in index.html.
        ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
    };

    // Requires File plugin
    function offlineWrite(offlineData) {
        // Create a FileWriter object for our FileEntry.
        getDataFileEntry().createWriter(function (fileWriter) {

            fileWriter.onwriteend = function () {
                console.log("Successful file write...");
                display(offlineData);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            fileWriter.write(offlineData);
        });
    }

    // Requires File plugin
    function createSomeData() {

        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            // Creates a new file or returns an existing file.
            fs.root.getFile("data.txt", { create: true, exclusive: false }, function (fileEntry) {

                setDataFileEntry(fileEntry);

            }, onErrorCreateFile);

        }, onErrorLoadFs);
    }

    function display(msg) {
        var elem = document.getElementById('output');
        elem.textContent = msg;
    }

    function getDataFileEntry() {
        return dataFileEntry;
    }

    function setDataFileEntry(fileEntry) {
        dataFileEntry = fileEntry;
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function onErrorCreateFile(e) {
        console.log("error creating file: " + console.log(e));
    }

    function onErrorLoadFs(e) {
        console.log("error loading file system: " + e.code.toString());
    }
} )();