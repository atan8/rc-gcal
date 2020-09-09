var http = require('http'); // Import Node.js core module

const myCal = require('./gCal.js'); // Import Google Calendar module
const mySms = require('./sms.js');  // Import RingCentral SMS module

const { calendar } = require('googleapis/build/src/apis/calendar');

// This is a simple NodeJS WebServer that process request and handle them

var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // set response content    
        res.write('<html><body><p>This is home Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/student") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is student Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/admin") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is admin Page.</p></body></html>');
        res.end();
    
    } else if (req.url == '/list') { //check the URL of the current request
        doWork(res);
    }
    else
        res.end('Invalid Request!');

});

async function doWork(res) {
    try {
        console.log("Loading events from google calendar");
        
        await myCal.loadEvents(res, renderEvents);
     } catch (err) {
        console.log(err);
    }
}

// Take Google Calendar Events JSON object and render them as HTML Table
// Include RC Embeddable components for future integration
function renderEvents(res, events) { 
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html>');
    res.write('<head>');
    res.write('<script> (function() { var rcs = document.createElement("script"); rcs.src = "https://ringcentral.github.io/ringcentral-embeddable/adapter.js"; var rcs0 = document.getElementsByTagName("script")[0]; rcs0.parentNode.insertBefore(rcs, rcs0);})();</script>');
    res.write('</head>');

    res.write('<body><p>This is the event listing data Page.</p>');
    if (events.length) {
        res.write('<table border=1><tr><th>Date/Time</th><th>Summary</th><th>Description</th></tr>');
        console.log('Upcoming ' + events.length + ' events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          // include description if not undefined
          var desc = event.description;
          var summary = event.summary;
          console.log(`${i} - ${start} - ${summary} - ${desc}`);
          res.write('<tr><td>' + start + '</td><td>' + summary + '</td><td>');
          if (!desc) {
            desc = "<no description>";
          } else {
            // assuming description has valid phone number for now
            res.write('<br>TEL Link: <a href="tel:'+desc+'">'+desc+'</a></br/>');
            res.write('<br>SMS Link: <a href="sms:'+desc+'">'+desc+'</a></br/>');
            // Send SMS for each valid description/phone number.  
            // Todo: refactor/rename loadCred
            mySms.loadCred('ring-cred.json', mySms.send_sms, desc, ">>> Reminder <<< " + summary + "--- Date: [" + start + "]");
          }
          res.write(desc +'</td></tr>');
        });
        res.write('</table>');
      } else {
        console.log('No upcoming events found.');
      }

    res.write('</body></html>');
    res.end();
}

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')