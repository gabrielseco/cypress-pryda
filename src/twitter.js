const TwitterLib = require('twitter');

class Twitter {
  constructor({ consumerKey, consumerSecret, accessToken, accessTokenSecret }) {
    this.client = new TwitterLib({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessToken,
      access_token_secret: accessTokenSecret
    });
  }

  sendTweet(status) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/update', { status: status }, function(
        error,
        tweet,
        response
      ) {
        if (error) reject(error);
        resolve({ tweet, response });
      });
    });
  }
}

module.exports = Twitter;
