


// Client ID and Client Secret received from ADM
// For more info, see: https://developer.amazon.com/public/apis/engage/device-messaging/tech-docs/02-obtaining-adm-credentials
var CLIENT_ID = "replace_with_client_id";
var CLIENT_SECRET = "replace_with_client_secret";

// Registration ID, received on device after it registers with ADM server
var REGISTRATION_IDS = ["replace_with_registration_ids"];

// Message payload to be sent to client
var payload = {
        data: {
            message: "PushPlugin works!!",
            sound: "beep.wav",
            url: "http://www.amazon.com",
            timeStamp: new Date().toISOString(),
            foo: "baz"
        },
        consolidationKey: "my app",
        expiresAfter: 3600
};


//*********************************


var https = require("https");
var querystring = require("querystring");


if(CLIENT_ID == "" || CLIENT_SECRET == "" || REGISTRATION_IDS.length == 0){
    console.log("******************\nSetup Error: \nYou need to edit the pushADM.js file and enter your ADM credentials and device registration ID(s).\n******************");
    process.exit(1);
}


// Get access token from server, and use it to post message to device
getAccessToken(function(accessToken){

    for(var i = 0; i < REGISTRATION_IDS.length; i++){

        var registrationID = REGISTRATION_IDS[i];

        postMessage(accessToken, registrationID, payload);
    }

});




// Query OAuth server for access token
// For more info, see: https://developer.amazon.com/public/apis/engage/device-messaging/tech-docs/05-requesting-an-access-token

function getAccessToken(callback){

    console.log("Requesting access token from server...");

    var credentials = {
            scope: "messaging:push",
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
    }

    var post_data = querystring.stringify(credentials);

    var post_options = {
      host: "api.amazon.com",
      port: "443",
      path: "/auth/O2/token",
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    };

    var req = https.request(post_options, function(res) {

        var data = "";

        res.on("data", function (chunk) {
            data += chunk;
        });

        res.on("end", function() {
            console.log("\nAccess token response:", data);
            var accessToken = JSON.parse(data).access_token;
            callback(accessToken);
        });

    });

    req.on("error", function(e) {
      console.log("\nProblem with access token request: ", e.message);
    });

    req.write(post_data);
    req.end();

}


// Post message payload to ADM server
// For more info, see: https://developer.amazon.com/public/apis/engage/device-messaging/tech-docs/06-sending-a-message

function postMessage(accessToken, registrationID, payload){

    if(accessToken == undefined || registrationID == undefined || payload == undefined){
        return;
    }

    console.log("\nSending message...");

    var post_data = JSON.stringify(payload);

    var api_path = "/messaging/registrations/" + registrationID + "/messages";

    var post_options = {
      host: "api.amazon.com",
      port: "443",
      path: api_path,
      method: "POST",
      headers: {
            "Authorization": "Bearer " + accessToken,
            "X-Amzn-Type-Version": "com.amazon.device.messaging.ADMMessage@1.0",
            "X-Amzn-Accept-Type" : "com.amazon.device.messaging.ADMSendResult@1.0",
            "Content-Type": "application/json",
            "Accept": "application/json",
      }
    };

    var req = https.request(post_options, function(res) {

        var data = "";

        res.on("data", function (chunk) {
            data += chunk;
        });

        res.on("end", function() {
            console.log("\nSend message response: ", data);
        });

    });

    req.on("error", function(e) {
      console.log("\nProblem with send message request: ", e.message);
    });

    req.write(post_data);
    req.end();

}


