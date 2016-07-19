// test04.js
// Raw node.js code to connect to and configure the Appium server, and run a simple
// test using yiewld and yield. No test framework is being used at this point.

// Pull in yiewd
var yiewd = require("yiewd");

// Configure the Appium server to listen to localhost:4723, using the 
// yiewd wrapper instead of wd.
var appDriver = yiewd.remote({
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

// Yiewd lets us write more clearly procedural code using intermediate variables for elements
// and so forth, allowing you to work with two elements at the same time. This is also easy
// to debug, and doesn't have the surrounding ceremony of .then and callbacks. 

appDriver.run(function* () {
  // 'this' is appDriver
  var session = yield this.init(config.android19Hybrid);
  yield this.sleep(3000);

  var txtZip = yield this.elementById('zip-code-input');
  yield txtZip.clear();
  yield txtZip.sendKeys("95959");

  var btnGetWeather = yield this.elementById('get-weather-btn');
  yield btnGetWeather.click();

  yield this.sleep(5000);

  // OK to omit yield on the last call 
  this.quit();
});