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
        var btn1 = document.getElementById('crFile');
        var btn2 = document.getElementById('crTempFile');
        var btn3 = document.getElementById('crFetchFile');
        var btn4 = document.getElementById('crDir');
        var btn5 = document.getElementById('appendFile');
        
        btn1.addEventListener('click', onCreateFile.bind(this),false);
        btn2.addEventListener('click', onCreateTempFile.bind(this), false);
        btn3.addEventListener('click', onFetchFile.bind(this), false);
        btn4.addEventListener('click', onCreateDir.bind(this), false);
        btn5.addEventListener('click', onAppendData.bind(this), false);
        // initFileSystem();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function onCreateFile() {
        // In Cordova non-browser targets, you don't need to call requestQuota
        // before getting a file system reference.
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            console.log('file system open: ' + fs.name);
            // fs.root is a DirectoryEntry object pointing to the persistent storage location
            // in the app's sandboxed file system.
            fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {

                console.log("fileEntry is file?" + fileEntry.isFile.toString());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                writeFile(fileEntry, null);

            }, onErrorCreateFile);

        }, onErrorLoadFs);
    }

    function onCreateTempFile() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024 /*5MB*/, function (fs) {

            console.log('file system open: ' + fs.name);
            createFile(fs.root, "newTempFile.txt");

        }, onErrorLoadFs);
    }

    function onFetchFile() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            // fs.root is a DirectoryEntry object pointing to the application cache
            // in the app's sandboxed file system.
            getSampleFile(fs.root);

        }, onErrorLoadFs);
    }

    function onCreateDir() {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            createDirectory(fs.root);

        }, onErrorLoadFs);
    }

    function onAppendData() {

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            console.log('file system open: ' + dirEntry.name);
            var isAppend = true;
            createFile(dirEntry, "fileToAppend.txt", isAppend);
        }, onErrorLoadFs);
    }

    function createFile(dirEntry, fileName, isAppend) {
        // Creates a new file or returns the file if it already exists.
        dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

            writeFile(fileEntry, null, isAppend);

        }, onErrorCreateFile);

    }

    function createDirectory(rootDirEntry) {

        rootDirEntry.getDirectory('NewDirInRoot', { create: true }, function (dirEntry) {
            dirEntry.getDirectory('images', { create: true }, function (subDirEntry) {

                createFile(subDirEntry, "fileInNewSubDir.txt");

            }, onErrorGetDir);
        }, onErrorGetDir);
    }

    function writeFile(fileEntry, dataObj, isAppend) {

        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
                if (dataObj.type == "image/png") {
                    readBinaryFile(fileEntry);
                }
                else {
                    readFile(fileEntry);
                }
            };

            fileWriter.onerror = function() {
                console.log("Failed file write: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }
            // If we are appending data to file, go to the end of the file.
            if (isAppend) {
                setFileWritePosition(fileWriter);
            }
            fileWriter.write(dataObj);
        });
    }

    function setFileWritePosition(fileWriter) {

        try {
            fileWriter.seek(fileWriter.length);
        }
        catch (e) {
            console.log("file doesn't exist!");
        }
    }

    // Called after file write to verify file data.
    function readFile(fileEntry) {

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                displayFileData(fileEntry.fullPath + ": " + this.result);
            };

            reader.readAsText(file);

        }, onErrorReadFile);
    }

    function readBinaryFile(fileEntry) {

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {

                console.log("Successful file read: " + this.result);
                displayFileData(fileEntry.fullPath + ": " + this.result);

                var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
                displayImage(blob);
            };

            reader.readAsArrayBuffer(file);

        }, onErrorReadFile);
    }

    function saveFile(dirEntry, fileData, fileName) {

        dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

            writeFile(fileEntry, fileData);

        }, onErrorCreateFile);
    }

    // Obtain sample data via xhr, display, and save the reference.
    function getSampleFile(dirEntry) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (this.status == 200) {

                var blob = new Blob([this.response], { type: 'image/png' });
                saveFile(dirEntry, blob, "downloadedImage.png");
            }
        };
        xhr.send();
    }

    function displayFileData(fileData) {

        var elem = document.getElementById('output');
        elem.textContent = "file content: " + fileData;

    }

    function displayImage(blob) {

        var img = new Image();
        // Note: Use window.URL.revokeObjectURL when finished with image.
        img.src = window.URL.createObjectURL(blob);
        // Displays image if result is a valid DOM string for an image.
        var elem = document.getElementById('imageFile');
        elem.src = img.src;
    }

    function onErrorGetDir(e) {
        console.log("error getting directory: " + e.toString());
    }

    function onErrorResolveUrl(e) {
        console.log("error resolving URL: " + e.toString());
    }

    function onErrorResolveFile(e) {
        console.log("error resolving file ref: " + e.toString());
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