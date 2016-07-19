// test07.js
// Multiple UI tests with assertions using the Chai assertion library. With minimal changes, the
// code here works with either Mocha or Jasmine. 

var yiewd = require("yiewd");
var chai = require("chai");
var expect = chai.expect;

// See test05.js for explanations of this framework-switching code.  
var debugging = true;

var timeouts = {
    appium: debugging ? 300 : 10,             // Timeout before Appium stops the app (seconds)           
    framework: 1000 * (debugging ? 600 : 30), // Timeout for completing each test (ms)      
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


    //Test template, to copy/paste when a new test is needed.
    /*  
    it ('description', function (done) {
      appDriver.run(function* () {
        done();
      });        
    });
    */


    it('displays either weather data or an error message on startup', function (done) {
        appDriver.run(function* () {
            var eitherVisible = yield checkDataErrVisibility(this);
            expect(eitherVisible).to.equal(true);
            done();
        });
    });


    it('disallows non-numerical characters in ZIP code field', function (done) {
        appDriver.run(function* () {
            var txtZip = yield this.elementById('zip-code-input');
            yield txtZip.clear();
            yield txtZip.sendKeys("abced98");
            yield this.sleep(5000);
            var zipText = yield txtZip.getValue();            
            expect(zipText).to.equal("98");
            done();
        });
    });

    it('disallows more than five characters in ZIP code field', function (done) {
        appDriver.run(function* () {
            var txtZip = yield this.elementById('zip-code-input');
            yield txtZip.clear();
            yield txtZip.sendKeys("987654321");
            yield this.sleep(5000);
            var zipText = yield txtZip.getValue();            
            expect(zipText).to.equal("98765");
            done();
        });
    });

    it('disables the Get Weather button if the ZIP code field contains fewer than five digits', function (done) {
        appDriver.run(function* () {
            var txtZip = yield this.elementById('zip-code-input');
            yield txtZip.clear();
            yield txtZip.sendKeys("987");
            var enabled = yield isGetWeatherEnabled(this);
            expect(enabled).to.equal(false);
            done();
        });
    });

    it('enables the Get Weather button if the ZIP code field contains five digits', function (done) {
        appDriver.run(function* () {
            var txtZip = yield this.elementById('zip-code-input');
            yield txtZip.clear();
            yield txtZip.sendKeys("98765");
            var enabled = yield isGetWeatherEnabled(this);
            expect(enabled).to.equal(true);
            done();
        });
    });

    it('displays either weather data or an error message on Get Weather press with valid ZIP code', function (done) {
        appDriver.run(function* () {
            var txtZip = yield this.elementById('zip-code-input');
            yield txtZip.clear();
            yield txtZip.sendKeys("95959");

            var btnGetWeather = yield this.elementById('get-weather-btn');
            yield btnGetWeather.click();

            // Wait for the request to complete--value may need to be changed if you test
            // test other network conditions like 2G with poor connectivity.
            yield this.sleep(3000);

            //Note that if you refactor code into separate functions that make async,
            //calls those must be declared as function* and you must call them using yield.
            var eitherVisible = yield checkDataErrVisibility(this);

            expect(eitherVisible).to.equal(true);
            done();
        });
    });
});


/*
 * Code that's shared between multiple tests. When working with yiewd, these
 * will generally be function* and use yield themselves. They must then be
 * called with yield.
 */

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

function* isGetWeatherEnabled(appSession) {
    var btnGetWeather = yield appSession.elementById('get-weather-btn');
    return yield btnGetWeather.isEnabled();
}