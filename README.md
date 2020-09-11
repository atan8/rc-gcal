## RingCentral SMS API and Google Calendar Integration

This repository desmonstrates how to combine RingCentral SMS API and Google Calendar API. 

Logic:
* Retrieve a list of events from the Google Calendar and print out the event on a Table 
* Review the description area for a phone number entry (currently it assume the description contains a validate phone number)
  * Future version will do error handling and pattern validation
* For each calendar entry with a valid phone number, send a SMS message that inclue the title for the calendar event

## Prerequisites:
* [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
* A Google account with Google Calendar enabled
* A [Google NodeJS Calendar QuickStart](https://developers.google.com/calendar/quickstart/nodejs)
* A [RingCentral Developer Account](https://developers.ringcentral.com/)

## Setup Steps
### 1. Setup Google Calendar Dev Account for using the Google Calendar API by following the stps via this [link](https://developers.google.com/calendar/quickstart/nodejs).
*  Note: after Step1 **DOWNLOAD CLIENT CONFIGURATION**, *credentials.json* will be saved to your local file system.  Be sure to rename "web" to "installed" in the json file before proceeding because the Google sample code *index.js* 
*  Step 2 install *googleapis*
```
npm install googleapis@39 --save
```
* Step 3: download sample index.js to local filesystem
* Step 4: `` node index.js `` 
  * Follow recommended steps to obtain **authoization code** and use the code to generate **access token** and **refresh token** file as "*token.json*".


### 2. Setup RingCentral Account and Credentials
* Sign up for [RingCental developer account](https://developers.ringcentral.com/).
* Create [SMS QuickStart App](https://developers.ringcentral.com/guide/messaging/quick-start/node)
  * Click on the "Create SMS App" button
  * Select "**Other Non-UI**" this uses *Password Grant* for Oauth.
    * To do: work on "Web App" **Auth Code** approach later.
  * Keep everything as default on the next screen and hit "Create"
  * Setup Account Password as needed
  * Be sure to note the *Client ID*, *Client Secret*, *Username*, *Password*, *Extension* from the **Credentials** page.
* Install RC SDK
```
npm install @ringcentral/sdk --save
```
* Copy 'ring-cred.json.template' as 'ring-cred.json' and using information from the **Credentials** page to update the details.

### 3. Create sample events on your Google Calendar
* Add calendar information
* Add phone number in the 'Description' field.  e.g. +1415333888
  * Please do not include anything else in the field

## Test The Code
```
node server.js
```
### Once the Server is up and running, enter this in the browser: 
http://localhost:5000/list






