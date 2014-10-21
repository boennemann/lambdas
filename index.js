var express = require('express')
var cors = require('cors')

var config = {
  'secrets' : {
    'clientId' : process.env.CLIENT_ID,
    'clientSecret' : process.env.CLIENT_SECRET,
    'redirectUrl' : 'http://localhost:8000/callback'
  }
}

var foursquare = require('node-foursquare')(config)

var lastFetched = 0;
var lastLocation;

var app = express()
app.use(cors())
app.get('/location', function(req, res) {
  var now = Date.now()
  if (lastLocation && (lastFetched - now < 6e5)) {
    console.log('location from cache')
    return res.status(200).send({
      location: lastLocation
    });
  }
  foursquare.Users.getCheckins('self', {
    limit: '1'
  }, process.env.AUTH_TOKEN, function(err, data) {
    if (err) {
      res.status(500).send(err)
    }
    console.log('location from 4sq')
    lastLocation = data.checkins.items[0].venue.location
    lastFetched = now
    res.status(200).send({
      location: lastLocation
    })
  })
})

app.listen(process.env.PORT || 8000)
