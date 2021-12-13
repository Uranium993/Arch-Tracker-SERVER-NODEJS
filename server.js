const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const axios = require("axios");
// const scraper = require("./scraper");
const http = require("http");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/projects", require("./routes/api/projects"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// -------- SQL TEST -------------//

// const connection = mysql.createConnection({
//   host: "sql11.freesqldatabase.com",
//   user: "sql11449825",
//   database: "sql11449825",
//   password: "lBESIciFHc",
// });

// connection.query("SELECT * FROM `bums`", function (err, results, fields) {
//   console.log(results); // results contains rows returned by server
//   // console.log(fields); // fields contains extra meta data about results, if available
// });
