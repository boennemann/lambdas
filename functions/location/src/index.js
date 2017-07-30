const qs = require('querystring')

const λ = require('apex.js')
const axios = require('axios')

let fetched = 0
let location

exports.handle = λ(async () => {
  const now = Date.now()

  if (location && (fetched - now < 600000)) {
    return {
      statusCode: 200,
      body: {location}
    }
  }

  const {data} = await axios.get(
    'https://api.foursquare.com/v2/users/self/checkins?' +
    qs.stringify({
      limit: 1,
      m: 'swarm',
      v: '20170730',
      oauth_token: process.env.FOURSQUARE_OAUTH_TOKEN
    })
  )

  location = data.response.checkins.items[0].venue.location
  fetched = now

  return {
    statusCode: 200,
    body: {location}
  }
})
