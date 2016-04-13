// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var elem = document.getElementById('selection');
        elem.addEventListener("change", selectionChanged.bind(this), false);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function selectionChanged(args) {
        var elem = document.getElementById('selection');
        // var idx = elem.selectedIndex;
        var value = elem.value;
        var func;

        switch (value) {
            case "camera":
                func = openCamera;
                break;
            case "camera-thmb":
                func = openCamera;
                break;
            case "camera-get-fileentry":
                func = openCamera;
                break;
            case "picker":
                func = openFilePicker;
                break;
            case "picker-thmb":
                func = openFilePicker;
                break;
            case "picker-get-fileentry":
                func = openFilePicker;
                break;
            default:
                func = noSelection;
        }
        func(value);
    }

    function openCamera(selection) {

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = setOptions(srcType);
        var func = createNewFileEntry;

        if (selection == "camera-thmb") {
            // Set box size for resize (maintains aspect ratio)
            options.targetHeight = 100;
            options.targetWidth = 100;
        }
        if (selection == "camera-get-fileentry") {
            // options.destinationType = Camera.DestinationType.NATIVE_URI;
            func = getFileEntry;
        }

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            displayImage(imageUri);
            // You may choose to copy the picture, save it somewhere, or upload.
            func(imageUri);

        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
    }

    function openFilePicker(selection) {

        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);
        var func = createNewFileEntry;

        if (selection == "picker-thmb") {
            // Set box size for resize (maintains aspect ratio)
            options.targetHeight = 100;
            options.targetWidth = 100;
        }
        if (selection == "picker-get-fileentry") {
            // options.destinationType = Camera.DestinationType.NATIVE_URI;
            func = getFileEntry;
        }

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            displayImage(imageUri);
            // You may choose to copy the picture, save it somewhere, or upload.
            func(imageUri);

        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
    }

    function setOptions(srcType) {
        var options = {
            quality: 20,
            // Use FILE_URI instead of DATA_URL to avoid memory issues
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            // JPEG is recommended for Android
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }

    // Get the FileEntry for the returned image.
    function getFileEntry(imgUri) {
        window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

            // Do something with it, like write to it, upload it, etc.
            // writeFile(fileEntry, imgUri);
            console.log("got file: " + fileEntry.fullPath);
            displayFileData(fileEntry.nativeURL, "Native URL");

        }, function () {
            // If don't get the FileEntry (which may happen when testing
            // on some emulators), copy to a new FileEntry.
            createNewFileEntry(imgUri);
        });
    }

    function createNewFileEntry(imgUri) {
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

            // JPEG file
            dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

                // Do something with it, like write to it, upload it, etc.
                // writeFile(fileEntry, imgUri);
                console.log("got file: " + fileEntry.fullPath);
                displayFileData(fileEntry.fullPath, "File copied to");

            }, onErrorCreateFile);

        }, onErrorResolveUrl);
    }

    function noSelection() {
        console.log("no selection!");
    }

    function displayFileData(fileData, msg) {

        var elem = document.getElementById('output');
        elem.textContent = msg + ": " + fileData;

    }

    function displayImage(imgUri) {

        var elem = document.getElementById('imageFile');
        elem.src = imgUri;
    }

    function onErrorCreateFile(e) {
        console.log("error creating file: " + console.log(e));
    }

    function onErrorResolveUrl(e) {
        console.log("error resolving URL: " + e.toString());
    }

} )();