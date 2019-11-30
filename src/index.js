/* eslint-disable no-console */
const { execCommand, sleep, getDateRightNow } = require('./utils');
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
  execCommand('cypress run')
    .then(({ stdout }) => {
      console.log(`stdout: ${stdout}`);
      console.log(`date executed: `, getDateRightNow());
      sleep(ms).then(() => executingFunction({ minutes }));
    })
    .catch(err => {
      console.log('err', err);
      twitter
        .sendTweet(
          `Hey @GGarciaSeco10,\nI have news for you it seems like there are tickets to see Eric Prydz in Printworks.\nCheck this out ➡️ https://kaboodle.co.uk/event/eric-prydz`
        )
        .then(() => console.log('Tweet sent'))
        .catch(err => console.error('Error sending tweet of error OMG', err));
    });
}

const minutes = 10;
executingFunction({ minutes });
