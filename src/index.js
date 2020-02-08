/* eslint-disable no-console */
const express = require('express');
const puppeteer = require('puppeteer');

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

async function crawl(url) {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.ticket-selector', { timeout: 3000 });

    const body = await page.evaluate(() => {
      return document.querySelector('body').innerHTML;
    });
    return body;

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

function executingFunction({ minutes }) {
  const ms = minutes * 60 * 1000;
  crawl(
    'https://bookings.kaboodle.co.uk/landing?client_id=68&agent_id=408740&package_id=9924&adults=1&children=0&infants=0&currency_id=98'
  )
    .then(response => {
      const matches = response.match(/fa fa-plus/gm);

      if (matches === null) {
        console.log('It seems there are not tickets left');
        console.log(`date executed: `, getDateRightNow());
        sleep(ms).then(() => executingFunction({ minutes }));
      }

      if (matches !== null) {
        console.log('Probably tickets');
        twitter
          .sendTweet(
            `Hey @GGarciaSeco10,\nI have news for you it seems like there are tickets to see Eric Prydz in Printworks.\nCheck this out ➡️ https://bookings.kaboodle.co.uk/book/9924/ticket`
          )
          .then(() => console.log('Tweet sent'))
          .catch(err => console.error('Error sending tweet of error OMG', err));
      }
    })
    .catch(err => {
      console.log('err puppeteer', err);
    });
}

app.get('*', (req, res) => {
  res.send({ message: 'hello world' });
});

app.post('*', (req, res) => {
  res.send({ message: 'hello world' });
});

app.listen(port, () => {
  console.log('Listening in port: ', port);
  const minutes = 5;
  executingFunction({ minutes });
});
