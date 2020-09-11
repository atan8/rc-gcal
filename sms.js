// prerequisite: please install the RingCentral SDK first via npm
// $ npm install @ringcentral/sdk –save

const SDK = require("@ringcentral/sdk").SDK;

const fs = require("fs");

// dummy recipient number
RECIPIENT = "+1415xxxxxxx"; // << to be updated 
RINGCENTRAL_SERVER = "https://platform.devtest.ringcentral.com";
RC_CREDENTIALS = 'ring-cred.json';

global.platform;

function send_sms(to, msg) {
    console.log("Reading credentials...");
    // Load client id/secrets and SMS user app credential from a local file.
    // separated this from the original RC sample code in order to check this into github
    fs.readFile(RC_CREDENTIALS, (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Load ring credentials
        var ringCred = JSON.parse(content);
        //console.log(ringCred);
        authorize(ringCred, send_sms2, to, msg);
  });
}

function authorize(credentials, callback, to, msg) {
  const {
    RINGCENTRAL_CLIENTID,
    RINGCENTRAL_CLIENTSECRET,
    RINGCENTRAL_USERNAME,
    RINGCENTRAL_PASSWORD,
    RINGCENTRAL_EXTENSION,
  } = credentials.ringcred;

  var rcsdk = new SDK({
    server: RINGCENTRAL_SERVER,
    clientId: RINGCENTRAL_CLIENTID,
    clientSecret: RINGCENTRAL_CLIENTSECRET,
  });

  platform = rcsdk.platform();
  platform
    .login({
      username: RINGCENTRAL_USERNAME,
      password: RINGCENTRAL_PASSWORD,
      extension: RINGCENTRAL_EXTENSION,
    })
    .then(function (resp) {
      console.log("Successfully logged into Ring Central");
      callback(RINGCENTRAL_USERNAME, to, msg);
    });
    
}

function send_sms2(from, to, message) {
  console.log("from: " + from + " - to: " + to + " | msg: " + message);

  platform
    .post("/restapi/v1.0/account/~/extension/~/sms", {
      from: { phoneNumber: from },
      to: [{ phoneNumber: to }],
      text: message,
    })
    .then(function (resp) {
      console.log("SMS sent. Message status: " + resp.json().messageStatus);
    })
    .catch(err => console.error(err));
}

function main() {
  send_sms(RECIPIENT, "Testing SMS message.");
}

//main();

module.exports = {
  RECIPIENT,
  send_sms,
};
