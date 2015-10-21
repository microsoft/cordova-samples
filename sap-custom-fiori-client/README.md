#Customized SAP Fiori Mobile Client Sample
[With over 500+ role-based apps SAP solutions](http://scn.sap.com/docs/DOC-41598), such as SAP S/4HANA, SAP Simple Finance, and the SAP Business Suite are applying the [SAP Fiori UX](http://experience.sap.com/fiori-design/) to provide a personalized, responsive and simple user experience.

Custom Fiori clients allow you to extend these base features and brand your Fiori client, add additional device capabilities by with Cordova plugins, remove plugins you do not intend to use to reduce your app’s size, and even add additional code packaged with the client app to meet your own specific needs (such as customizing your offline experience). 

The [SAP Mobile SDK](http://scn.sap.com/community/developer-center/mobility-platform/blog/2015/09/30/smp-sdk-sp10-released--what-is-new) enables developers to integrate a number of different technology platforms and Cordova enablement is provided through provided [Kapsel SDK](http://scn.sap.com/blogs/johnwargo/2014/05/22/kapsel-sdk-and-the-sap-fiori-client). The Kapsel SDK contains a [set of Cordova plugins](http://help.sap.com/saphelp_smp308sdk/helpdata/en/7c/041aaa7006101481a7fc662daecd3f/content.htm) that you can add to your own Cordova project. In addition, the SDK provides a script to generate a Custom Fiori Client project.

You can build and edit these apps in Visual Studio Tools for Apache Cordova or VS Code and the [taco-cli](http://taco.tools) in a few simple steps.

##Building the Sample

###Getting Started

1. First, if you intend to build an Android version of your app:

	1. Be sure to install the "Google Repository" and "Google Play Services" (under extras) via the Android SDK Manager
	2. Install a 64-bit JVM and bump up your Java heap to 1500M - the 512M default is not enough. (_JAVA_OPTIONS=-Xmx1500M). You may need to restart for these settings to take effect.
	
2. Next, download the SAP Mobile SDK (or a [free trial from the SAP Store](https://store.sap.com/sap/cp/ui/resources/store/html/SolutionDetails.html?pid=0000013098&catID=&pcntry=US&sap-language=EN&_cp_id=id-1409756206625-0)) and install it on your machine. This script was written and tested on **SAP Mobile SDK 3.0 SP10.**

###Building a Fiori Client in VS or VS Code

1. Place the "taco_create.js" and the "append" folder in the "KapselSDK/apps/fiori_client" folder where you installed the SAP Mobile SDK
2. Next, follow the instructions under README.md in this folder but type "node taco_create.js" instead of create_fiori_client.js.

	This script simply copies some content that is placed inside the platforms folder directly into the "res/native" folder and moves splash screens and icons into a location officially supported by the Cordova CLI. This elminiates the chances of platform folder contents being overwritten unexpectedly.

3. **Visual Studio:** At this point you can install Visual Studio 2015, select the Tools for Apache Cordova option, and simply open the project in Visual Studio using the *File &gt; New &gt; Project From Existing Code...* option.

4. **VS Code or other Text Editor:** Follow these steps:
	1.	Install the [taco-cli](http://taco.tools) and use it to help you install any pre-requisites
	2.	Simply open the folder containing your project in VS code or your text editor and start editing!  Use the taco-cli to build and run your app as appropriate!

##[Optional Alternative] Building a Custom Cordova App Using SAP Plugins
If you would prefer to use SAP plugins without the Custom Fiori Client script, you can do that too by following these steps:

1. Download [samples/.cordova/config.json](https://raw.githubusercontent.com/Chuxel/cordova-samples/master/sap-custom-fiori-client/samples/.cordova/config.json). **Note: Download, do not cut and paste from the web.** Copying from the web can result in unexpected characters in the file that can cause Cordova errors.
2. Place it in .cordova folder in the root of your project
3. Update the path in this file to point to your SAP KapselSDK plugins folder (Ex: "C:\\SAP\\KapselSDK\\plugins").
4. You may now add plugins from the "plugins" folder of the Kapsel SDK.  API documentation can be found under "docs/api".

## Known Issues
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
