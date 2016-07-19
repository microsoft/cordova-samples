// test03.js
// Raw node.js code to connect to and configure the Appium server, and run a simple
// test using explicit promise chaining. No test framework is being used at this point.

// Pull in the Appium node.js client library
var wd = require("wd");

// Configure the Appium server to listen to localhost:4723.
// Note the use of wd.promiseChainRemote instead of wd.Remote, which allows
// use of chaining for async methods.
var appDriver = wd.promiseChainRemote({
  hostname: 'localhost',
  port: 4723,
});

// Configure the Appium server for Android API level 19 and the app
// we want to test.
var config = {};

config.android19Hybrid = { 
   automationName: 'Appium',
   browserName: '',     
   platformName: 'Android', 
   platformVersion: 19,    // API level integer, or a version string like '4.4.2'
   autoWebview: true,
   deviceName: 'any value; Appium uses the first device from *adb devices*',  
   app: "D:\\g\\cordova-samples\\weather-app\\WeatherApp\\bin\\Android\\Debug\\android-debug.apk" 
}; 

// This launches the app on the device. Note that init is an asynchronous method and returns
// before work is complete. To execute sequential actions, you can simply chain methods one 
// after the other. Every command is asynchronous and should therefore be in its own callback. 

var txtZip; //Intermediate to use in multiple callbacks

appDriver.init(config.android19Hybrid)
    .then(function () {
        // Wait 3 seconds for the app to fully start
        return appDriver.sleep(3000);
    }).then(function () {
        // Locate the text entry field
        return appDriver.elementById('zip-code-input');
    }).then(function (e) {
        txtZip = e;
        // Clear contents
        return txtZip.clear();
    }).then(function () {
        // Enter a value
        return txtZip.sendKeys("95959");
    }).then(function () {
        // Locate the Find Weather button
        return appDriver.elementById('get-weather-btn');
    }).then(function (btnGetWeather) {
        // Tap the button
        return btnGetWeather.click();
    }).then(function () {
        // Wait five seconds
        return appDriver.sleep(5000);
    }).fin(function () {  //.fin means "finally" for the end of the chain
        appDriver.quit()
    }).done();