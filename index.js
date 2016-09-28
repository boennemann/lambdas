const express = require('express')
const cors = require('cors')

const config = {
  secrets: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: 'http://localhost:8000/callback'
  }
}

const foursquare = require('node-foursquare')(config)

let lastFetched = 0
let lastLocation

const app = express()
app.use(cors())
app.get('/', (req, res) => {
  const now = Date.now()

  if (lastLocation && (lastFetched - now < 600000)) {
    console.log('location from cache')
    return res.status(200).send({
      location: lastLocation
    })
  }

  foursquare.Users.getCheckins('self', {limit: '1'}, process.env.AUTH_TOKEN, (err, data) => {
    if (err) return res.status(500).send(err)

    console.log('location from 4sq')
    lastLocation = data.checkins.items[0].venue.location
    lastFetched = now
    res.status(200).send({location: lastLocation})
  })
})

app.listen(process.env.PORT || 8000)
