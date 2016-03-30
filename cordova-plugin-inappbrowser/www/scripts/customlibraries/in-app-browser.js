var inAppBrowserRef = undefined;

var articleUrl = undefined;
var videoUrl = undefined;
var searchUrl = undefined;

function getHelpUrls() {

    switch ($('#page-title').text()) {

        case "Open an in-app browser":

            articleUrl = "https://cordova.apache.org/docs/en/latest/"
            + "reference/cordova-plugin-inappbrowser/index.html";

            videoUrl = "https://youtu.be/F-GlVrTaeH0";
            searchUrl = "https://www.google.com/#q=inAppBrowser+plugin";
            
            break;

        case "A different app page 1":
            
            articleUrl = "Some URL";
            videoUrl = "Some URL";
            searchUrl = "Some URL";
            
            break;
    }
}

function showArticle() {

    showHelp(articleUrl);
}

function showVideo() {

    showHelp(videoUrl);
 }

function showSearch() {

    showHelp(searchUrl);
}

function showHelp(url) {
    
    var target = "_blank";

    var options = "location=yes,hidden=yes,mediaPlaybackRequiresUserAction=no";

    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

    with (inAppBrowserRef) {

        addEventListener('loadstart', loadStartCallBack);

        addEventListener('loadstop', loadStopCallBack);

        addEventListener('loaderror', loadErrorCallBack);
    }

}

function loadStartCallBack() {

    $('#status-message').text("loading please wait ...");
    
}

function loadStopCallBack() {

    if (inAppBrowserRef != undefined) {

        inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });

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

