# Cordova Sample App - WinJS TODO App
Visual Studio Tools for Apache Cordova combines the goodness of your favorite IDE with the ease of creating apps for multiple mobile operating systems, all in a simple to use workflow. One of the major pain points for our enterprise developers is the effort required to build apps for multiple platforms, while keeping costs and effort down. Visual Studio Tools for Apache Cordova allows developers to use HTML5 and JavaScript, along with their favorite open source framework libraries to build web applications.

Leveraging the Apache Cordova framework, we create packaged mobile apps that feel and behave like native device applications. What's great is that all this can be done completely from within Visual Studio, with full tooling support for building, debugging and packaging that our customers love. Our highlight features include attaching and debugging to the Android emulator and devices, plus, being able to build and simulate remotely for the iOS platform.

The TODO sample helps you get up and running with an app that you can F5 and start playing around with. It showcases the use of the Geolocation plugin from Cordova, that lets the app use native device capabilities. It also uses Microsoft Azure as its cloud backend, to sync and make data available on any device, at any time.

## Building the Sample
### [optional] Bing Maps API
For purposes of distribution, we have removed our API key. Please [create and copy over your Bing Maps API key](https://msdn.microsoft.com/en-us/library/ff428642.aspx) for the app to work as expected. If the Bing Maps key is not present, the location information shows up as "<latitude>, <longitude>" in the app instead of the actual address.

### [optional] Microsoft Azure
For purposes of distribution, we have removed our API key and added a comment instead. The app falls back to local storage if you choose not to enter an API key.

If you are not familar with Azure, this guide to [creating a new Mobile Service and adding a table](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-get-started-data/#create-service) will be helpful.

This application looks for a Mobile Service table named TodoItem and a dynamic schema to handle changing columns.

Create your Azure Mobile Service [Optional]
- Navigate to http://azure.microsoft.com
- Go to Portal and login with your Microsoft account
- Create a new Azure Mobile Service
- Create a table in your database with the following schema (id:string, __createdAt:date, __updatedAt:date, __version:timestamp, text:string, done:boolean, address:string)


### Running The App
You can download [VS Community 2015 RC in English](http://go.microsoft.com/fwlink/?LinkId=524433) to get started right away (or [go here for other languages and editions](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200626830)) and don’t forget to check “Tools for Apache Cordova” during setup. After you have Visual Studio 2015 installed, you can open up the project in Visual Studio.

Add any API keys as explained above. Press F5 and you're on your way! If you haven't already done so, consider taking a look at our landing page for more information (http://go.microsoft.com/fwlink/?LinkID=398477).


## Terms of Use
By downloading and running this project, you agree to the license terms of the third party application software, Microsoft products, and components to be installed. 

The third party software and products are provided to you by third parties. You are responsible for reading and accepting the relevant license terms for all software that will be installed. Microsoft grants you no rights to third party software.


## Important links
1. winstore-jscompat.js License (https://github.com/MSOpenTech/winstore-jscompat/blob/master/License.txt)


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
