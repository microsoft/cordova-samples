// connect.js
// Initial code to create the wd client object

var wd = require("wd");
var appDriver = wd.remote({
  hostname: '127.0.0.1',
  port: 4723,
})

// Some debug output to show default configurations
console.log("appDriver.configUrl.host: " + appDriver.configUrl.host);

for (var property in appDriver.defaultCapabilities) {
  console.log("appDriver.defaultCapabilities." + property + ": " + appDriver.defaultCapabilities[property]);
}