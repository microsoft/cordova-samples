// test02.js
// Raw node.js code to connect to and configure the Appium server, and run a simple
// test using implicit promise chaining. No test framework is being used at this point.

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
// after the other:
appDriver.init(config.android19Hybrid)
  .sleep(3000)                         // Wait 3 seconds for the app to fully start
  .elementById('zip-code-input')       // Locate the text entry field
  .clear()                             // Clear its contents
  .sendKeys("95959")                   // Enter a value
  .elementById('get-weather-btn')      // Locate the Find Weather button
  .click()                             // Tap it
  .sleep(5000)                         // Wait 5 seconds
  .quit();                             // Stop the app instead of waiting for a timeout

// This chaining structure is very efficient for writing test sequences. Until you're really proficient,
// however, and for debugging purposes, it's often better to use other structures that allow you
// to set breakpoints at specific locations in the test. An more explicit structure also allows for 
// intermediate computation. See test03.js and test04.js for examples.