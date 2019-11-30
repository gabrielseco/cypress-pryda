/* eslint-disable no-console */
const axios = require('axios');
const express = require('express');

const { sleep, getDateRightNow } = require('./utils');
const Twitter = require('./twitter');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const twitter = new Twitter({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
});

function executingFunction({ minutes }) {
  const ms = minutes * 60 * 1000;
  axios
    .get('https://kaboodle.co.uk/event/eric-prydz')
    .then(response => {
      const matches = response.data.match(/Sold Out/gi).length;

      if (matches === 3) {
        console.log('It seems there are not tickets left');
        console.log(`date executed: `, getDateRightNow());
        sleep(ms).then(() => executingFunction({ minutes }));
      }

      if (matches !== 3) {
        console.log('Probably tickets');
        twitter
          .sendTweet(
            `Hey @GGarciaSeco10,\nI have news for you it seems like there are tickets to see Eric Prydz in Printworks.\nCheck this out ➡️ https://kaboodle.co.uk/event/eric-prydz`
          )
          .then(() => console.log('Tweet sent'))
          .catch(err => console.error('Error sending tweet of error OMG', err));
      }
    })
    .catch(err => {
      console.log('err axios get', err);
    });
}

app.listen(port, () => {
  console.log('Listening in port: ', port);
  const minutes = 10;
  executingFunction({ minutes });
});
