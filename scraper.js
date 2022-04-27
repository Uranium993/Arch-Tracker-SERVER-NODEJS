const puppeteer = require("puppeteer");
const connectDB = require("./config/db");
//const cron = require("node-cron");
const Users = require("./models/Users");

const loginBot = async () => {
  connectDB();

  const admin = await Users.findOne({ role: "admin" });

  const scraperEmail = admin.scraperCredentials.email;
  const scraperPassword = admin.scraperCredentials.password;

  const browser = await puppeteer.launch({
    headless: false,
    arg: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://morning-cove-85067.herokuapp.com/login");
  await page.waitForSelector("input");
  await page.focus(".form > div > input[type='email']");
  await page.keyboard.type(scraperEmail);
  await page.focus(".form > div > input[type='password']");
  await page.keyboard.type(scraperPassword);
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

  const dataToSave = grabExperience;

  console.log(dataToSave);

  const res = await Users.findOneAndUpdate(
    {
      role: "admin",
    },
    {
      $set: {
        "scraperData.company": dataToSave[0],
        "scraperData.level": dataToSave[1],
      },
      // company: dataToSave[0],
      // level: dataToSave[1],
    },
    { upsert: true, new: true }
  );

  await console.log(res);
  // await ScrapeData.create({ dataArray }, (err, data) => {
  //   if (err) console.log("error log", err);
  //   console.log(data);
  // });

  // setTimeout(() => {
  //   console.log(grabExperience);
  // }, 3000);
};

//cron.schedule("* * * * *", () => loginBot())
//loginBot();

module.exports.loginBot = loginBot;
