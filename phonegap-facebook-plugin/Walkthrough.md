
# Walkthrough the FacebookOAuth Sample App
This sample app was originally based on the code provided by the [phonegap-facebook-plugin](https://github.com/wizcorp/phonegap-facebook-plugin). This code has been converted into a Visual Studio solution and modified to exercise 6 specific scenarios. Those scenarios are:
-	Login 
-	Show Dialog 
-	Test API
-	Get access token
-	Get login status
-	Logout
Let’s examine the code.

## index.html
The entry point to this sample is the index.html document located at the www folder.
This document has a div containing 6 buttons for each one of the 6 scenarios mentioned above as well as a device ready indicator.
Below that container there are the \<script\> tags referencing the cordova.js, index.js, facebookSignIn.js and platformOverrides.js

## index.js
This file implements the onDeviceReady() event in which we search for the deviceReadyIndicator element on the index.html file, hide the “Connecting to Device” text and display the “Device is Ready” one.

## facebookSignIn.js
This file contains the logic that interacts with the facebookConnectPlugin. As the plugin is referenced in the config.xml file the CLI downloads it and places it inside the plugins folder in your project, if you expand that folder after the first build you will see the plugin content.
facebookSignIn.js defines an app object that contains the login, showDialog, apiTest, getAccessToken, getStatus and logout methods. All these methods delegate their operation to the equivalent method on the facebookConnectPlugin.

## platformOverrides.js
This sample shows whatever response it receives from feacebookConnectPlugin. That response comes in a JSON format so it stringify it and display it using an alert.
The platformOverrides.js file defines a platformAlert method that allows the application to display alert messages in a platform agnostic manner. You will find a platformOverrides.js file inside the android/scripts, ios/scripts and windows/scripts folders each one with the platform specific implementation of the platformAlert method.

## Implementing a hook for iOS
This sample requires Cordova 5.1.1 to run on iOS. Out of the box it targets Cordova 4.3.1 but if you retarget it to the latest Cordova version then you will be able to run this sample app on an iOS emulator.
To make this happen, we added the hook-symlink-fix.js file inside the hooks folder. This file addresses a known symlink issue. For more information about this issue and the usage of hooks see [cordova-hooks sample](https://github.com/Microsoft/cordova-samples/tree/master/cordova-hooks)

## Terms of Use
By downloading and running this project, you agree to the license terms of the third party application software, Microsoft products, and components to be installed. 

The third party software and products are provided to you by third parties. You are responsible for reading and accepting the relevant license terms for all software that will be installed. Microsoft grants you no rights to third party software.


## Important links
1. phonegap-facebook-plugin (https://github.com/wizcorp/phonegap-facebook-plugin)


## License
```
The MIT License (MIT)

Copyright (c) Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Help us improve our samples
Help us improve out samples by sending us a pull-request or opening a [GitHub Issue](https://github.com/Microsoft/cordova-samples/issues/new)

## More Information
Email us at multidevicehybridapp@microsoft.com
