const express = require('express');
const DB = require('./USPS.json');
const API_KEY = process.env.ZIPCODE_API_KEY; // API Key to the ZIPCODE API
const http = require('https');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Source for ranges: https://postalpro.usps.com/NZCM_Overview

function getZoneFromMiles(miles) {
  var result = 0;
  if (miles <= 50) result = 1;
  else if (miles <= 150) result = 2;
  else if (miles <= 300) result = 3;
  else if (miles <= 600) result = 4;
  else if (miles <= 1000) result = 5;
  else if (miles <= 1400) result = 6;
  else if (miles <= 1800) result = 7;
  else if (miles > 1800) result = 8;
  return result;
}

// Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// Set views for view engine
app.set('views', path.join(__dirname, 'views'));

// Set ejs as view engine
app.set('view engine', 'ejs');

// Request to root path
app.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, 'views/pages/index.html'));
});

app.get('/getRate', (req, res) => {
  var weight = Number(req.query.weight);
  var mailType = req.query.mail;

  switch (mailType) {
    case 'letters_stamped':
      var index = 0;
      if (weight <= 0) index = 0;
      else if (weight > 3) index = 3;
      else index = Math.ceil(weight) - 1;
      var cost = DB['letters']['stamped'][index].toFixed(2);
      res.render('pages/rates', {weight: weight.toFixed(1), mailType, cost});
      break;
    case 'letters_metered':
      var index = 0;
      if (weight <= 0) index = 0;
      else if (weight > 3) index = 3;
      else index = Math.ceil(weight) - 1;
      var cost = DB['letters']['metered'][index].toFixed(2);
      res.render('pages/rates', {weight: weight.toFixed(1), mailType, cost});
      break;
    case 'large_envelopes_flats':
      var index = 0;
      if (weight <= 0) index = 0;
      else if (weight > 13) index = 12;
      else index = Math.ceil(weight) - 1;
      var cost = DB['large envelopes'][index].toFixed(2);
      res.render('pages/rates', {weight: weight.toFixed(1), mailType, cost});
      break;
    case 'first_class_package_service':
        var senderZip = req.query['sender_zip'];
        var recipientZip = req.query['recipient_zip'];
        const endpoint =
          `https://app.zipcodebase.com/api/v1/`+
          `distance?apikey=${API_KEY}`+
          `&unit=miles`+
          `&code=${senderZip}`+
          `&compare=${recipientZip}`+
          `&country=us`;
        var resp = '';
        http.get(endpoint, (response) => {
          response.on('data', (chunk) => {
            resp += chunk;
          });
          response.on('end', () => {
            var dist = JSON.parse(resp)['results'][recipientZip];
            if (dist) {
              console.log("Distance: " + dist);
              var zone = getZoneFromMiles(dist);
              var index = Math.ceil(Number(weight)) <= 0 ? 1 : Math.ceil(Number(weight)) - 1;
              if (index > 12) index = 12;
              console.log(DB['parcel service'][zone][index]);
              var cost = Number(DB['parcel service'][zone][index]).toFixed(2);
              res.render('pages/rates', { weight: weight.toFixed(1), mailType, cost });
            }
            else {
              res.render('pages/invalid', {});
            }
          })
        });
      break
      
    }
});

// Handle 404
app.use(function(req, res) {
  res.status(404).send('404: Page not Found');
});

// Handle server errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})