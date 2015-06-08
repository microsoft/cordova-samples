// Copyright (c) Microsoft. All rights reserved.  
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
//
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Use InAppBrowser to open links
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            var href = anchor.getAttribute("href");
            anchor.setAttribute("href", "#");
            anchor.addEventListener("click", function () {
                window.open(href, "_blank");
            });
        }
    };
} )();