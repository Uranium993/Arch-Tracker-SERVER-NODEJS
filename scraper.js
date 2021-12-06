const puppeteer = require("puppeteer");

const loginBot = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://morning-cove-85067.herokuapp.com/login");
  await page.waitForSelector("input");
  await page.focus(".form > div > input[type='email']");
  await page.keyboard.type("vesna@gmail.com", { delay: 100 });
  await page.focus(".form > div > input[type='password']");
  await page.keyboard.type("vesna123", { delay: 100 });
  await page.click(".btn.btn-primary");
  await page.waitForSelector("td");
  const options = {
    path: "images/website.png",
    fullPage: true,
  };

  await page.screenshot(options);
  //await page.goto("https://morning-cove-85067.herokuapp.com/dashboard");

  const grabExperience = await page.evaluate(() => {
    const table = document.querySelector(".container > table");
    const td = table.querySelectorAll("td");
    let scrapedData = [];

    td.forEach((item) => scrapedData.push(item.innerHTML));
    return scrapedData;
  });

  await console.log(grabExperience);
  // setTimeout(() => {
  //   console.log(grabExperience);
  // }, 3000);
};

module.exports.loginBot = loginBot;
