// test06a.js
// Multiple UI tests with assertions using the Chai assertion library. With minimal changes, the
// code here works with either Mocha or Jasmine. 

var yiewd = require("yiewd");
var chai = require("chai");
var expect = chai.expect;

// See test05.js for explanations of this framework-switching code.  
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

//Main tests
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

  before(function (done) {
    //Jasmine: beforeAll(function* (done) {
    appDriver.run(function* () {
      var session = yield this.init(config.android19Hybrid);
      yield this.sleep(3000);
      done();
    });
  });

  after(function (done) {
    //Jasmine: afterAll(function* (done) {
    appDriver.run(function* () {
      yield appDriver.quit();
      done();
    });
  });


  it('displays either weather data or an error message on startup', function (done) {
    appDriver.run(function* () {
      var eitherVisible = yield checkDataErrVisibility(this);
      expect(eitherVisible).to.equal(true);
      done();
    });
  });

  // This test enters a ZIP  code, taps Find Weather, and checks that the UI shows either
  // the element with weather data, or the element with an error message.

  it('displays either weather data or an error message on Get Weather press', function (done) {
    appDriver.run(function* () {
      //Moved this to "before"
      //var session = yield this.init(config.android19Hybrid);

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

      //Note that if you refactor code into separate functions that make async,
      //calls those must be declared as function* and you must call them using yield.
      var eitherVisible = yield checkDataErrVisibility(this);

      expect(eitherVisible).to.equal(true);
      done();
    });
  });
});


//Utility functions/shared code
function* checkDataErrVisibility(appSession) {
  var elemData = yield appSession.elementById('weather-data');
  var elemErr = yield appSession.elementById('error-msg');

  // Do an XOR on element visibility. isDisplayed is an API from wd, see
  // https://github.com/admc/wd/blob/master/lib/element-commands.js. Remember
  // that even this API is async, so use yield to retrieve the values.
  var visData = yield elemData.isDisplayed();
  var visErr = yield elemErr.isDisplayed();
  var eitherVisible = (visData && !visErr) || (!visData && visErr);
  return eitherVisible;
}