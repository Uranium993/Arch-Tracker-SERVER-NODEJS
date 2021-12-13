const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const scraperLoginDataSchema = Schema({
  user: {
    ref: "user",
  },

  scraperLoginCredentials: {
    email: String,
    password: String,
  },
});

module.exports = scraperLoginData = mongoose.model(
  "scraperLoginData",
  scraperLoginDataSchema
);
