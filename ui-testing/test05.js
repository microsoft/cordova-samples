// test05.js
// A UI test with assertions using the Chai assertion library. With minimal changes, the
// code here works with either Mocha or Jasmine. 

var yiewd = require("yiewd");
var chai = require("chai");
var expect = chai.expect;

// Appium's default timeout is 60 seconds, which is appropriate for debugging, but when we 
// want to run straight through tests it's helpful to shorten that timeout so that Appium closes
// the app quickly. See the newCommandTimeout capability.
//
// Mocha/Jasmine's default timeout for a test is 2/5 seconds, which is much too short for a UI
// test that starts the app and does any kind of asynchronous work. You'll need to set it to 
// something like 15 or 30 seconds for running tests straight through. When debugging, you'll
// need to set it to something much longer, like 5 minutes, so you have time to examine variables
// and such. See the DEFAULT_TIMEOUT_INTERVAL property.
//
// This bit of code makes it convenient to switch between sets of timeouts.  

var debugging = false;

var timeouts = {
  appium: debugging ? 300 : 10,             // Timeout before Appium stops the app           
  framework: 1000 * (debugging ? 600 : 30), // Timeout for completing each test  
};

// Object to store the names of the frameworks once
var frameworks = {
  "mocha": "mocha",
  "jasmine": "jasmine"
};

// Set this variable according to the framework you're using
var framework = frameworks.mocha;
//var framework = frameworks.jasmine;

// You could put all the configuration in a separate file and require it in,
// which can make it easy to switch between different settings. For examples,
// see https://github.com/appium/sample-code/blob/master/sample-code/examples/node
// and the helper/appium-servers.js file.
var config = {};

config.android19Hybrid = {
  automationName: 'Appium',
  browserName: '',
  platformName: 'Android',
  platformVersion: 19,    // API level integer, or a version string like '4.4.2'
  autoWebview: true,
  deviceName: 'any value; Appium uses the first device from *adb devices*',
  app: "D:\\g\\cordova-samples\\weather-app\\WeatherApp\\bin\\Android\\Debug\\android-debug.apk",
  newCommandTimeout: timeouts.appium,
};

var appDriver = yiewd.remote({
  hostname: 'localhost',
  port: 4723,
});

describe("Find weather page", function () {
  // Set the timeout in the framework
  switch (framework) {
    case frameworks.mocha:
      this.timeout(timeouts.framework)
      break;

    case frameworks.jasmine:
      jasmine.DEFAULT_TIMEOUT_INTERVAL = timeouts.framework;
      break;
  }

  /*
beforeAll(function* (done) {
  console.log("entering before");
  done();
});
    
afterAll(function* (done) {
  console.log("entering after");
  yield appDriver.quit();
  done();    
});
*/

  // This test enters a ZIP  code, taps Find Weather, and checks that the UI shows either
  // the element with weather data, or the element with an error message.

  it('displays either weather data or an error message', function (done) {
    appDriver.run(function* () {
      // 'this' is appDriver     
      var session = yield this.init(config.android19Hybrid);
      yield this.sleep(3000);

      var txtZip = yield this.elementById('zip-code-input');
      yield txtZip.clear();
      yield txtZip.sendKeys("95959");

      var btnGetWeather = yield this.elementById('get-weather-btn');
      yield btnGetWeather.click();

      // The above click generates an HTTP request, so we want to wait long enough
      // for that to complete before checking for the UI state change. If you set an
      // explicit timeout for HTTP requests in the app, it'd be appropriate to use that
      // value here.   
      yield this.sleep(3000);

      var elemData = yield this.elementById('weather-data');
      var elemErr = yield this.elementById('error-msg');

      // Do an XOR on element visibility. isDisplayed is an API from wd, see
      // https://github.com/admc/wd/blob/master/lib/element-commands.js. Remember
      // that even this API is async, so use yield to retrieve the values.
      var visData = yield elemData.isDisplayed();
      var visErr = yield elemErr.isDisplayed();
      var eitherVisible = (visData && !visErr) || (!visData && visErr);

      // Assertion using Chai, works with Jasmine and Mocha
      expect(eitherVisible).to.equal(true);

      // Assertion using Jasmine's built-in expect                   
      //expect(eitherVisible).toBe(false);

      // Tell the framework that we're done with the async series                    
      done();
    });

  });
});