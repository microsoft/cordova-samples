// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var SERVER = "http://cordova-vm.apache.org:5000";
    var SERVER_WITH_CREDENTIALS = "http://cordova_user:cordova_password@cordova-vm.apache.org:5000";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var btn1 = document.getElementById('uploadFile');
        var btn2 = document.getElementById('downloadFile');
        var btn3 = document.getElementById('downloadImage');
        btn1.addEventListener('click', onUploadFile.bind(this), false);
        btn2.addEventListener('click', onDownloadFile.bind(this), false);
        btn3.addEventListener('click', onDownloadImage.bind(this), false);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function onUploadFile() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            var fileName = "uploadSource.txt";
            var dirEntry = fs.root;
            dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

                // Write something to the file before uploading it.
                writeFile(fileEntry);

            }, onErrorCreateFile);

        }, onErrorLoadFs);
    }

    function onDownloadFile() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            var dirEntry = fs.root;
            // To validate that we have overwritten local data
            // with downloaded content, we will use an empty target file.
            var fileName = "downloadTarget.txt";

            dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                // SERVER must be a URL that can handle the request, like
                // http://some.server.com/download.php 
                // Make sure you add the domain name to the Content-Security-Policy <meta> element.
                download(fileEntry, encodeURI(SERVER));

            }, onErrorCreateFile);

        }, onErrorLoadFs);
    }

    function onDownloadImage() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);

            // Make sure you add the domain name to the Content-Security-Policy <meta> element.
            var url = 'http://cordova.apache.org/static/img/cordova_bot.png';
            // fs.root is a DirectoryEntry object pointing to the cache in the app's
            // sandboxed file system.
            fs.root.getFile('downloaded-image.png', { create: true, exclusive: false }, function (fileEntry) {
                download(fileEntry, url, true);

            }, onErrorCreateFile);

        }, onErrorLoadFs);
    }

    function upload(fileEntry) {
        // !! Assumes variable fileURL contains a valid URL to a text file on the device,
        var fileURL = fileEntry.toURL();

        var success = function (r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            displayFileData(fileEntry.fullPath + " (content uploaded to server)");
        }

        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        // SERVER must be a URL that can handle the request, like
        // http://some.server.com/upload.php 
        ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
    };

    function download(fileEntry, uri, isBinaryData) {

        var fileTransfer = new FileTransfer();
        var fileURL = fileEntry.toURL();

        fileTransfer.download(
            uri,
            fileURL,
            function (entry) {
                console.log("download complete: " + entry.toURL());
                if (isBinaryData) {
                    readBinaryFile(entry);
                }
                else {
                    readFile(entry);
                }
            },
            function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            },
            null, // or, pass false
            {
                //headers: {
                //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                //}
            }
        );
    }

    function writeFile(fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function (e) {
                // testing
                // report("File write");
                console.log("Successful file read...");
                upload(fileEntry);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file read: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['file data to upload'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    }

    function readFile(fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {

                console.log("Successful file read: " + this.result);
                displayFileData(fileEntry.fullPath + ": " + this.result);

            };

            reader.readAsText(file);

        }, onErrorReadFile);
    }

    function readBinaryFile(fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {

                console.log("Successful file read: " + this.result);
                displayFileData(fileEntry.fullPath + ": " + this.result);

                var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
                // Note: Use window.URL.revokeObjectURL when finished with image. 
                var objURL = window.URL.createObjectURL(blob);
                displayImageData(objURL);
            };

            reader.readAsArrayBuffer(file);

        }, onErrorReadFile);
    }

    function displayFileData(fileData) {

        var elem = document.getElementById('output');
        elem.textContent = "FILE NAME/CONTENT: " + fileData;

    }

    function displayImageData(fileData) {

        // Displays image if result is a valid DOM string for an image.
        var elem = document.getElementById('imageFile');
        elem.src = fileData;
    }

    function onErrorResolveUrl(e) {
        console.log("error resolving URL: " + e.toString());
    }

    function onErrorReadFile(e) {
        console.log("error reading file: " + e.toString());
    }

    function onErrorCreateFile(e) {
        console.log("error creating file: " + console.log(e));
    }

    function onErrorLoadFs(e) {
        console.log("error loading file system: " + e.code.toString());
    }

} )();