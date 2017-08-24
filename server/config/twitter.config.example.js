// create a new twitter app here: https://apps.twitter.com/app/new
// fill in below variables with values from your Twitter app
// rename file to 'twitter.config.js'

// Local development use 127.0.0.1:PORT/auth/twitter/callback, not localhost:PORT/auth/twitter/callback

module.exports = {
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: TWITTER_CALLBACK_URL
};