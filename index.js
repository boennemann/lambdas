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

var app = express()

app.use(cors())

app.get('/location', function(req, res) {
  foursquare.Users.getCheckins('self', {
    limit: '1'
  }, process.env.AUTH_TOKEN, function(err, data) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({
      location: data.checkins.items[0].venue.location
    })
  })
})

app.listen(process.env.PORT || 8000)
