(function () {
    // Append the bind() polyfill
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src', 'scripts/android2.3-jscompat.js');
    if (document.body) {
        document.body.appendChild(scriptElem);
    } else {
        document.head.appendChild(scriptElem);
    }
}());

var login = function () {
    if (!window.cordova) {
        var appId = prompt("Enter FB Application ID", "");
        facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login(["email"],
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var showDialog = function () {
    facebookConnectPlugin.showDialog({ method: "feed" },
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var apiTest = function () {
    facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var getAccessToken = function () {
    facebookConnectPlugin.getAccessToken(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var getStatus = function () {
    facebookConnectPlugin.getLoginStatus(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var logout = function () {
    facebookConnectPlugin.logout(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}