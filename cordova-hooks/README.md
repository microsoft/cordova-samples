# Cordova Sample App - Cordova Hooks
Visual Studio Tools for Apache Cordova combines the goodness of your favorite IDE with the ease of creating apps for multiple mobile operating systems, all in a simple to use workflow. One of the major pain points for our enterprise developers is the effort required to build apps for multiple platforms, while keeping costs and effort down. Visual Studio Tools for Apache Cordova allows developers to use HTML5 and JavaScript, along with their favorite open source framework libraries to build web applications.

##What is a Cordova Hook?
One challenge that can exist in certain scenarios is that you need to be able to modify something fundamental about the Cordova project or move content around within the generated underlying native project. On the surface it may appear there is not a way to do this in Visual Studio or the Apache Cordova Command Line Interface (CLI) but this is not true.  You can in fact wire in your own into almost any Cordova event (or even CLI command) using something called a [Cordova Hook](http://go.microsoft.com/fwlink/?LinkID=533744).

Hooks can be added to your project in two ways:

1. **Project Hooks** - Referenced in config.xml
2. **Plugin Hooks** - Referenced in plugin.xml

When developing hooks it is often easiest to **first build the hook as a project hook** and **then migrate it to a plugin later.** Plugins allow you to reuse hooks in a modular fashion, are easier to install, and can be published publicly for easy access like other plugins. However, certain events only occur when a plugin is "installed" for a given platform which can complicate intial development.

Hooks are implemented as simple JavaScript modules that are then referenced in either your project's config.xml or plugin.xml. Ex:

~~~~~~~~~~
<hook type="before_prepare" src="hooks/hook-res-native.js" />
~~~~~~~~~~

This will fire the hook in "hook-res-native.js" before a native project used to build a platform has been "prepared." "Prepare" is a key Cordova lifecycle event that is responsible for copying content from plugins and your project to an underlying generated native project (found in the "platforms" folder). 

You may also want to fire a hook only for certain platforms. This an be done easily using the platform element.

~~~~~~~~~~
<platform name="ios>
	<hook type="before_compile" src="hooks/hook-symlink-fix.js" />
</platform>
~~~~~~~~~~

This will fire the hook in hook-symlink-fix.js before compilation occurs but after the native project has been "prepared" only when building for iOS.

See the **[Cordova Hooks Readme](http://go.microsoft.com/fwlink/?LinkID=533744)** for additional details on creating hooks and a list of available events. 

While there is an older "shell script" based way to add hooks into your project, this is missing a number of useful features and requires an "execute bit" to be set on the script for iOS on OSX which makes authoring them on Windows challenging.


##The Sample Project
In this sample project you can find here has two hooks designed to deal with two documented, known issues. The sample project adds one hook via a plugin and another at the project level via config.xml.

- **Project hook sample: iOS Symlink Fix.** This hook is based on a workaround for the problem described in [this article](https://github.com/Microsoft/cordova-docs/tree/master/tips-and-workarounds/ios/ios-plugin-symlink-fix). Note the use of context.requireCordovaModule to access some node modules in the Cordova hook. Any node module referenced in [package.json for cordova-lib](https://github.com/apache/cordova-lib/blob/master/cordova-lib/package.json) for the version of Cordova you are targeting is available to you via this mechanism.
- **Plugin hook sample: Support for the res/native folder in the Base Cordova CLI.** The "res/native" folder structure that allows you to drop in native project assets into a Cordova project is currently not part of the base Cordova CLI. This hook adds in support when using the Cordova CLI or related CLIs like Ionic. It follows the method described in the general [Team Build / CI tutorial](https://github.com/Microsoft/cordova-docs/tree/master/tutorial-team-build).

###Sample Files of Note
- **Project hook sample**
	- Inside the VS project: 
		- **config.xml** contains a reference to "hooks/hook-symlink-fix.js" that is wrapped in a platform element that causes the hook to only fire for iOS.
		- **hooks/hook-symlink-fix.js** is an iOS specific fix to deal with broken symlinks described in [this article](https://github.com/Microsoft/cordova-docs/tree/master/tips-and-workarounds/ios/ios-plugin-symlink-fix).

- **Plugin hook sample**
	- At the solution root:
		- **cordova-plugin-res-native** is the plugin source code. You can install it using the Custom => Local option in the config.xml designer. For simplicity sake it has already been added to the sample project.
		- **cordova-plugin-res-native/plugin.xml** contains a reference to "hooks/hook-res-native.js" relative to the plugin root (plugins/cordova-plugin-res-native/hooks/hook-res-native.js). Since it is not wrapped in a platform element it will fire for all platforms.
		- **cordova-plugin-res-native/hooks/hook-res-native.js** is a hook designed to ensure the res/native feature works outside of Visual Studio.
	- Inside the VS project: 
		- **plugins/cordova-plugin-res-native** contains the above source code pre-installed in the project

### Building the Sample
This sample can be built from Visual Studio Tools for Apache Cordova on Windows or the Apache Cordova Command Line Interface (CLI) from either Windows or OSX.

**To build from VS:**

1. Download the project to your filesystem

2. Open "HooksSample.sln" in VS 2015 RC or later

3. Select your platform in the dropdown and build for a "Device", "Remote Device", "Local Machine" or Emulator/Simulator target.

**To build from the CLI:**

1. Download the project to your filesystem

2. Open the Developer Command Prompt on Windows with VS installed or the Terminal app on OSX and navigate to the project root (under the solution)

3. Ensure the following environment variables are set when building for Android: ANDROID_HOME, JAVA_HOME

4. Ensure Node.js and npm are in the path

5. Execute the following commands:

	~~~~~~~~~~~~~~~~~~~~~~~~
	npm install -g cordova@5.0.0
	cordova platform add android
	cordova build android
	~~~~~~~~~~~~~~~~~~~~~~~~

	...replacing android with the platform you want to build.

## Verifying it Works
To verify everything is working, you can look for some messages in the Output Window or command line output.

**Building for a Device from VS for Android, Windows, or WP8**
- You will see the following in the Output Window from the plugin hook: "**Build running inside of MSBuild or Visual Studio - skipping res/native hook given built in support.**" See "plugins/cordova-plugin-res-native" for details. The hook is wired in through plugin.xml. 
- You should see the file **res-native-works.txt** in the "platforms\&lt;platform&gt;" folder where &lt;platform&gt; is the platform you built. This file comes from the res/native folder in the project.</li>

**Building from the command line using the Cordova CLI for Android, Windows, or WP8**
- You will see the following in the build command line output from the plugin hook: "**Processing res/native for android**," (where "android is replaced with the platform you used to build.") See "plugins/cordova-plugin-res-native" for details. The hook is wired in through plugin.xml.  
- You should see the file **res-native-works.txt** in the "platforms\&lt;platform&gt;" folder where &lt;platform&gt; is the platform you built. This file comes from the res/native folder in the project.

**Building for an iOS Device**
- You will see the following in the Output Window or build command line output from the project hook: "**Detecting broken symlinks**." The hook is wired in via config.xml in the project. See "plugins/cordova-plugin-res-native" for details. You can Right Click => View Code on config.xml to see the XML elements that cause this hook to fire.
- You will see the following in the Output Window or build command line ooutput from the plugin hook: "**Processing res/native for ios**." See "plugins/cordova-plugin-res-native" in your project for details. The hook is wired in through plugin.xml.
- You should see the file **res-native-works.txt** in thb "remote-builds/&lt;buildnum&gt;/cordovaApp/platforms/ios" folder where &lt;buildnum&gt; is the build number you see in the Output Window if built using the remote agent. Otherwise the file will be under "platforms/ios". This file comes from the res/native folder in the project.

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
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read Tutorials, Tips, issues, and Workarounds](http://github.com/Microsoft/cordova-docs)
* [Read MSDN docs](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto://vscordovatools@microsoft.com)
