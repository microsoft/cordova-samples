#Customized SAP Fiori Mobile Client Sample
[With over 500+ role-based apps SAP solutions](http://go.microsoft.com/fwlink/?LinkID=691659), such as SAP S/4HANA, SAP Simple Finance, and the SAP Business Suite are applying the [SAP Fiori UX](http://experience.sap.com/fiori-design/) to provide a personalized, responsive and simple user experience.

Custom Fiori clients allow you to extend these base features and brand your Fiori client, add additional device capabilities by with Cordova plugins, remove plugins you do not intend to use to reduce your app’s size, and even add additional code packaged with the client app to meet your own specific needs (such as customizing your offline experience). 

The [SAP Mobile SDK](http://go.microsoft.com/fwlink/?LinkID=691667) enables developers to integrate a number of different technology platforms and Cordova enablement is provided through provided [Kapsel SDK](http://go.microsoft.com/fwlink/?LinkID=691662). The Kapsel SDK contains a [set of Cordova plugins](http://go.microsoft.com/fwlink/?LinkID=691664) that you can add to your own Cordova project. In addition, the SDK provides a script to generate a Custom Fiori Client project.

You can build and edit these apps in Visual Studio [Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkId=398477) or [VS Code](http://go.microsoft.com/fwlink/?LinkID=691671) and the [TACO CLI](http://go.microsoft.com/fwlink/?LinkID=691672) in a few simple steps.

##Building the Custom Fiori Mobile Client Sample

###Before You Begin

1. First, if you intend to build an Android version of your app:

	1. Be sure to install the **Google Repository** and **Google Play Services** (under extras) via the Android SDK Manager
	2. Install a **64-bit JVM** and set your JAVA_HOME environment variable to its location or use Tools &gt; Options &gt; Tools for Apache Cordova &gt; Environment Variable Overrides

	3. Bump up your Java heap to 1500M - the 512M default is not enough. To do so, set an environment variable of **_JAVA_OPTIONS=-Xmx1500M**. You may need to restart for these settings to take effect.
	
2. Next, download the **SAP Mobile SDK 3.0 SP 10** (or a [free trial from the SAP Store](http://go.microsoft.com/fwlink/?LinkID=691663) and install it on your machine.

3. At this point you may [build a Custom Fiori Mobile Client in VS or VS Code](#custom) or simply [add SAP plugins to your Cordova project](#plugins).

<a name="custom"></a>
###Building a Custom Fiori Client Using VS or VS Code

1. First, place the **taco_create.js** and the **lib** folder in the **KapselSDK/apps/fiori_client** folder where you installed the SAP Mobile SDK

2. Next, **[follow the instructions on SAP's site](http://go.microsoft.com/fwlink/?LinkID=691661)** or (simply follow the instructions in README.md in the fiori_client folder) to configure the client generation script in this folder but type **node taco_create.js** instead of create_fiori_client.js.

	> This script copies a few files that are placed inside the "platforms" folder directly by the Fiori client script into the main project so the platforms folder does not need to be added to source control and for improved iOS compatibility when remotely building from Windows.

3. **Visual Studio:** 
	1. At this point you can install Visual Studio 2015, select the Tools for Apache Cordova option. **Be sure you are running at least Tools for Apache Cordova Update 4.**
	2. Next, simply open the project in Visual Studio using the **File &gt; New &gt; Project From Existing Code...** option. 

4. **VS Code or other Text Editor:** Follow these steps:
	1.	Install the [taco-cli](http://go.microsoft.com/fwlink/?LinkID=691672) and use it to help you install any pre-requisites
	2.	Simply open the folder containing your project in VS code or your text editor and start editing!  Use the taco-cli to build and run your app as appropriate!

5. When building or targeting iOS, take note of suggested workarounds for [common challenges when building for iOS with Xcode 7 and with Cordova 5.3.3 and below](http://go.microsoft.com/fwlink/?LinkID=691679).  **Some of these are pre-applied by the script.**

<a name="plugins"></a>
##Add SAP Plugins to a Custom Cordova App 
If you would prefer to use SAP plugins without the Custom Fiori Client script, you can do that too by following these steps:

1. Download [samples/.cordova/config.json](http://go.microsoft.com/fwlink/?LinkID=691677). **Note: Download, do not cut and paste from the web.** Copying from the web can result in unexpected characters in the file that can cause Cordova errors.
2. Place it in a **.cordova** folder in the root of your project
3. Update the path in this file to point to your SAP KapselSDK plugins folder (Ex: "C:\\SAP\\KapselSDK\\plugins").
4. You may now add plugins from the "plugins" folder of the Kapsel SDK using the "Custom" tab in the config.xml designer.  API documentation can be found [on SAP's website](http://go.microsoft.com/fwlink/?LinkID=691664).

## Known Issues
- Custom Fiori Clients make use of quite a few custom Cordova plugins, so you will want to be sure to pick an Android or iOS device or emulator / simulator target when debugging your app. Ripple will not be able to simulate the app.
- Cordova 5.3.3 and below have known incompatibilities with Xcode 7. Some workarounds are applied in this sample, but [see known issues for more details](http://go.microsoft.com/fwlink/?LinkID=691679).
- Windows and Windows Phone 8.0 are not supported by the Custom Fiori Client creation script today

## Terms of Use
By downloading and running this project, you agree to the license terms of the third party application software, Microsoft products, and components to be installed. 

The third party software and products are provided to you by third parties. You are responsible for reading and accepting the relevant license terms for all software that will be installed. Microsoft grants you no rights to third party software.

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
