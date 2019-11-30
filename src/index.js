/* eslint-disable no-console */
const cypress = require('cypress')
const { sleep, getDateRightNow } = require('./utils');
const Twitter = require('./twitter');

require('dotenv').config();


const twitter = new Twitter({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
});

function executingFunction({ minutes }) {
  const ms = minutes * 60 * 1000;
  cypress.run({
    spec: 'cypress/integration/pryda.spec.js'
  }).then(results => {
    if(results.totalFailed > 0) {
      twitter.sendTweet(
          `Hey @GGarciaSeco10,\nI have news for you it seems like there are tickets to see Eric Prydz in Printworks.\nCheck this out ➡️ https://kaboodle.co.uk/event/eric-prydz`
        )
        .then(() => console.log('Tweet sent'))
        .catch(err => console.error('Error sending tweet of error OMG', err));
    }

    if(results.totalPassed === results.totalTests) {
      console.log(`date executed: `, getDateRightNow());
      sleep(ms).then(() => executingFunction({ minutes }));
    }
  }).catch(err => {
    console.log('err cypress run', err);
  })
}

const minutes = 10;
executingFunction({ minutes });
