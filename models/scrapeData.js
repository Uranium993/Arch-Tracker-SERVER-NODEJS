const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScrapeDataSchema = new Schema({
    scrapeData: Object
})

const ScraperCredentialsSchema = new Schema({
    ScraperCredentials: {
        username: String,
        password: String
    }
})

module.exports