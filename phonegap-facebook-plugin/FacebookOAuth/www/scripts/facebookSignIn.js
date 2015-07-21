// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
// This code was originally based on the code samples provided by the phonegap-facebook-plugin 
//  For more information see https://github.com/Wizcorp/phonegap-facebook-plugin

(function (global) {
    function displayResponse(response) {
        navigator.notification.alert(JSON.stringify(response));
    }

    var app = {

        login: function () {
            if (!window.cordova) {
                var appId = prompt("Enter FB Application ID", "");
                facebookConnectPlugin.browserInit(appId);
            }
            facebookConnectPlugin.login(["email"],
                displayResponse,
                displayResponse);
        },

        showDialog: function () {
            facebookConnectPlugin.showDialog({ method: "feed" },
                displayResponse,
                displayResponse);
        },

        apiTest: function () {
            facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
                displayResponse,
                displayResponse);
        },

        getAccessToken: function () {
            facebookConnectPlugin.getAccessToken(
                displayResponse,
                displayResponse);
        },

        getStatus: function () {
            facebookConnectPlugin.getLoginStatus(
                displayResponse,
                displayResponse);
        },

        logout: function () {
            facebookConnectPlugin.logout(
                displayResponse,
                displayResponse);
        }
    };

    global.app = app;
})(window);