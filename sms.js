const SDK = require("@ringcentral/sdk").SDK;

const fs = require("fs");

// dummy recipient number
RECIPIENT = "+14153338888";
RINGCENTRAL_SERVER = "https://platform.devtest.ringcentral.com";

global.rcsdk;
global.platform;
global.rc_user;
global.rc_password;
global.rc_ext;

function loadCred(credfile, callback, to, msg) {
    console.log("reading credentials...");
    // Load client id/secrets and SMS user app credential from a local file.
    // separated this from the original RC sample code in order to check this into github
    fs.readFile(credfile, (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Load ring credentials
        var ringCred = JSON.parse(content);
        console.log(ringCred);
        authorize(ringCred, callback, to, msg);
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

  console.log("1 RC User = " + global.rc_user);
  global.rc_user = RINGCENTRAL_USERNAME;
  global.rc_password = RINGCENTRAL_PASSWORD;
  global.rc_ext = RINGCENTRAL_EXTENSION;
  console.log("2 RC User = " + global.rc_user);

  global.rcsdk = new SDK({
    server: RINGCENTRAL_SERVER,
    clientId: RINGCENTRAL_CLIENTID,
    clientSecret: RINGCENTRAL_CLIENTSECRET,
  });

  global.platform = rcsdk.platform();
  platform
    .login({
      username: rc_user,
      password: rc_password,
      extension: rc_ext,
    })
    .then(function (resp) {
      console.log("Successfully logged into Ring Central");
      callback(rc_user, to, msg);
    });
    
}

function send_sms(from, to, message) {
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
  loadCred('ring-cred.json', send_sms, RECIPIENT, "Brushing Up API and coding skill.");
}

//main();

module.exports = {
  RECIPIENT,
  loadCred,
  send_sms,
};
