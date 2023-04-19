const { query } = require("express");
const path = require("path"),
  express = require("express"),
  fs = require("fs-extra"),
  cors = require("cors");

const dataDirectory = path.join(__dirname, "data");

const removeJsonFileExtension = (fileName) => path.basename(fileName, ".json");

const app = express();

app.use(cors());
// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

app.get("/feeds/*", async (req, res, next) => {
  const p = path.join(dataDirectory, req.path + ".json");

  return res.sendFile(p, (err, data) => {
    if(err) {
      console.error(`File at ${req.path} not found`);
      return res.status(404).send(`File at ${req.path} not found`).end()
    }
  });
});

// 404 handler
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send(`Server error: ${err.message} ${err.stack}`);
});

module.exports = app;
