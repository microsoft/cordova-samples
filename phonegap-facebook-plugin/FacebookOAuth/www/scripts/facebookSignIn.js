// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
// This code was originally based on the code samples provided by the phonegap-facebook-plugin 
//  For more information see https://github.com/Wizcorp/phonegap-facebook-plugin


var app = {

    login: function () {
        if (!window.cordova) {
            var appId = prompt("Enter FB Application ID", "");
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login(["email"],
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    },

    showDialog: function () {
        facebookConnectPlugin.showDialog({ method: "feed" },
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    },

    apiTest: function () {
        facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    },

    getAccessToken: function () {
        facebookConnectPlugin.getAccessToken(
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    },

    getStatus: function () {
        facebookConnectPlugin.getLoginStatus(
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    },

    logout: function () {
        facebookConnectPlugin.logout(
            function (response) { platformAlert(JSON.stringify(response)) },
            function (response) { platformAlert(JSON.stringify(response)) });
    }
};