const qs = require('querystring')

const λ = require('apex.js')
const axios = require('axios')

exports.handle = λ(async () => {
  const {data} = await axios.get(
    'https://api.foursquare.com/v2/users/self/checkins?' +
    qs.stringify({
      limit: 1,
      m: 'swarm',
      v: '20170730',
      oauth_token: process.env.FOURSQUARE_OAUTH_TOKEN
    })
  )

  const {location} = data.response.checkins.items[0].venue

  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'public, max-age=600'
    },
    body: JSON.stringify({location})
  }
})
