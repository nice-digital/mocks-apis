const { query } = require("express");
const path = require("path"),
  express = require("express"),
  fs = require("fs-extra"),
  cors = require("cors");

const resultsDirectory = (index) =>
    path.join(__dirname, "data", index, "results"),
  typeAheadDirectory = (index) =>
    path.join(__dirname, "data", index, "typeahead");
dataDirectory = path.join(__dirname, "data");

const removeJsonFileExtension = (fileName) => path.basename(fileName, ".json");

const possibleIndexes = ["cks", "bnf", "indicators"];
const app = express();

app.use(cors());
// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

// Response extensions for sending the mock search responses
app.use(async (req, res, next) => {
  const index = req.query?.index;
  const emptyResult = path.join(dataDirectory, `empty.json`);
  const sendResponse = async (fileName, directory, emptyResult) => {
    const filePath = path.join(directory, `${fileName}.json`);
    if (await fs.pathExists(filePath)) res.sendFile(filePath);
    else emptyResult();
  };

  res.sendResults = async (fileName, next) => {
    console.info(`Search request for ${fileName} for ${index}`);
    sendResponse(fileName, resultsDirectory(index), () =>
      res.sendFile(emptyResult)
    );
  };

  res.typeAhead = async (fileName, index, next) => {
    console.info(`TypeAhead request for ${fileName}`);
    sendResponse(fileName, typeAheadDirectory(index), () =>
      res.status(200).send([])
    );
  };

  res.noSearchTerm = async (fileName, index, next) => {
    console.info(`No Search Term specified for index ${index}`);
    sendResponse(fileName, resultsDirectory(index), () =>
      res.sendFile(emptyResult)
    );
  };

  next();
});

app.get("/api/search", async (req, res, next) => {
  const queryTerm = req.query?.q?.toLowerCase();
  const index = req.query?.index?.toLowerCase();
  if (!queryTerm) {
    return res.noSearchTerm("noSearchTerm", index, next);
  }
  if (!index || possibleIndexes.indexOf(index) < 0) {
    return res.status(400).send(`Specified index - ${index} not found.`);
  }
  if (typeof queryTerm === "undefined") return res.sendResults("empty", next);
  // Look for a file in the results directory that matches the given query term
  const resultFileName = (await fs.readdir(resultsDirectory(index)))
    .map(removeJsonFileExtension)
    .find((f) => new RegExp(f, "i").test(queryTerm));

  return res.sendResults(resultFileName || queryTerm, next);
});

app.get("/api/typeahead", async (req, res, next) => {
  const queryTerm = req.query?.q?.toLowerCase();
  const index = req.query?.index?.toLowerCase();
  if (!queryTerm) {
    return res.status(404).send("No search query provided");
  }
  return res.typeAhead(queryTerm, index, next);
});

app.get("/api/typeahead/all", async (req, res, next) => {
  const queryTerm = req.query?.q?.toLowerCase();
  const index = req.query?.index.toLowerCase();
  if (!queryTerm) {
    return res.status(404).send("No search query provided");
  }
  return res.typeAhead(queryTerm, index, next);
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
