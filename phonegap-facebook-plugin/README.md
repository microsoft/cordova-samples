# Cordova Sample App - FacebookOAuth App
Visual Studio Tools for Apache Cordova combines the goodness of your favorite IDE with the ease of creating apps for multiple mobile operating systems, all in a simple to use workflow. One of the major pain points for our enterprise developers is the effort required to build apps for multiple platforms, while keeping costs and effort down. Visual Studio Tools for Apache Cordova allows developers to use HTML5 and JavaScript, along with their favorite open source framework libraries to build web applications.

Leveraging the Apache Cordova framework, we create packaged mobile apps that feel and behave like native device applications. What's great is that all this can be done completely from within Visual Studio, with full tooling support for building, debugging and packaging that our customers love. Our highlight features include attaching and debugging to the Android emulator and devices, plus, being able to build and simulate remotely for the iOS platform.

The FacebookOAuth sample helps you get up and running with an app that you can F5 and start playing around with. It showcases the use of the phonegap-facebook plugin for Cordova, that lets the app interact with Facebook.


## Building the Sample
### Facebook Application ID and Application Name
For simplicity we added a sample APP_ID and APP_NAME to the config.xml file so that you can build and deploy the application out of the box. You can also create or use your own application [https://developers.facebook.com/apps](https://developers.facebook.com/apps). If you don't change the default APP_ID, APP_NAME when you sign into the FacebookOAuth sample app it will ask you to grant permission to a Facebook app called "TACO".


### Running The App
You can download [VS Community 2015 RC in English](http://go.microsoft.com/fwlink/?LinkId=524433) to get started right away (or [go here for other languages and editions](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200626830)) and don’t forget to check “Tools for Apache Cordova” during setup. After you have Visual Studio 2015 installed, you can open up the project in Visual Studio.

Press F5 and you're on your way! If you haven't already done so, consider taking a look at our landing page for more information (http://go.microsoft.com/fwlink/?LinkID=398477).

#### Code Walkthrough
For a detailed explanation of the code see [Sample Code Walkthrough](Walkthrough.md)

#### Dependencies
When you run the app for the first time, the [phonegap-facebook-pluin](https://github.com/wizcorp/phonegap-facebook-plugin) is downloaded and installed. You will need to have a working internet connection for the installation to happen successfully. This step is performed by the CLI as this plugin is referenced in the config.xml file.


### Known Issues
- This sample only runs on VS Android emulators, it doesn't run on Ripple. 


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
