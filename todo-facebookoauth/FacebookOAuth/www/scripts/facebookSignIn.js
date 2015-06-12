var login = function () {
    if (!window.cordova) {
        var appId = prompt("Enter FB Application ID", "");
        facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login(["email"],
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}

var showDialog = function () {
    facebookConnectPlugin.showDialog({ method: "feed" },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}

var apiTest = function () {
    facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}

var getAccessToken = function () {
    facebookConnectPlugin.getAccessToken(
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}

var getStatus = function () {
    facebookConnectPlugin.getLoginStatus(
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}

var logout = function () {
    facebookConnectPlugin.logout(
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() },
        function (response) { Windows.UI.Popups.MessageDialog(JSON.stringify(response)).showAsync() });
}
