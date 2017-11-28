const setup = require('./starter-kit/setup');
const urlParser = require('url');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  exports.run(event.url, browser, event.trackResponses, event.getCookies).then(
    (result) => callback(null, result)
  ).catch(
    (err) => callback(err)
  );
};

exports.run = async (url, browser
      , trackResponses = false, getCookies = false) => {
  const page = await browser.newPage();
  let responses = {};
  if (trackResponses) {
    const parsedUrl = urlParser.parse(url);
    page.on('response', async (response) => {
      // make sure only tracks response from same host
      if (response.url.indexOf(parsedUrl.hostname) !== -1) {
          responses[response.url] = await response.text();
      }
    });
  }
  await page.goto(url);
  const html = await page.content();
  const cookies = getCookies ? await page.cookies() : '';
  await page.close();
  return {html, responses, cookies};
};
