function showHelp(url) {
    
    var target = "_blank";

    var options = "location=yes,hidden=yes,mediaPlaybackRequiresUserAction=no";

    var inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

    inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });

    with (inAppBrowserRef) {

        addEventListener('loadstart', loadStartCallBack);

        addEventListener('loadstop', loadStopCallBack);

        addEventListener('loaderror', loadErrorCallBack);
    }

    function loadStartCallBack() {

        $('#status-message').text("loading please wait ...");

    }

    function loadStopCallBack() {


        if (inAppBrowserRef != undefined) {

            $('#status-message').text("");

            inAppBrowserRef.show();
        }

    }

    function loadErrorCallBack(params) {

        $('#status-message').text("");

        var scriptErrorMesssage = "alert('Sorry we cannot open that page. Message from the server is : " + params.message + "');"

        inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);

        inAppBrowserRef.close();

        inAppBrowserRef = undefined;

    }

    function executeScriptCallBack(params) {

        if (params[0] == null) {

            $('#status-message').text(
               "Sorry we couldn't open that page. Message from the server is : '"
               + params.message + "'");
        }

    }

}


