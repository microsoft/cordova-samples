//*********************************************************//
//    Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.
//*********************************************************
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