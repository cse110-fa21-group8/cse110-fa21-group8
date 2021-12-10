/*
const puppeteer = require("puppeteer");
module.exports = async function () {
  // According to
  // (1) https://jestjs.io/docs/puppeteer
  // (2) https://developers.google.com/web/tools/puppeteer/troubleshooting
  // (3) https://stackoverflow.com/questions/62228154/puppeteer-fails-to-initiate-in-github-actions
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
};
*/

module.exports = {
  launch: {
    headless: false,
    slowMo: 5,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  },
};

