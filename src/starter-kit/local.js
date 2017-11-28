const index = require('../index');
const config = require('./config');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: process.env.SLOWMO_MS,
        dumpio: !!config.DEBUG,
        // use chrome installed by puppeteer
    });
    await index.run('https://google.com', browser, false, false)
    .then((result) => console.log(result))
    .catch((err) => console.error(err));
    await browser.close();
})();
