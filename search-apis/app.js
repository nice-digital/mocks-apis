const { query } = require("express");
const path = require("path"),
	express = require("express"),
	fs = require("fs-extra"),
	jsonpath = require("jsonpath");

const resultsDirectory = path.join(__dirname, "data", "results"),
	typeAheadDirectory = path.join(__dirname, "data", "typeahead");

const removeJsonFileExtension = (fileName) => path.basename(fileName, ".json");

const possibleIndexes = ['cks'];
const app = express();

// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

// Response extensions for sending the mock search responses 
app.use(async (req, res, next) => {
	const emptyResult = path.join(resultsDirectory, `empty.json`);
	const sendResponse = async (fileName, directory, emptyResult) => {
		const filePath = path.join(directory, `${fileName}.json`);
		if (await fs.pathExists(filePath)) res.sendFile(filePath);
		else emptyResult();
	};
	
	res.sendResults = async (fileName, next) => {
		console.info(`Search request for ${fileName}`);
		sendResponse(fileName, resultsDirectory, ()=> res.sendFile(emptyResult));
	};

	res.typeAhead = async (fileName, next) => {
		console.info(`TypeAhead request for ${fileName}`);
		sendResponse(fileName, typeAheadDirectory, () => res.status(200).send([]));
	};

	next();
});
app.use(async (req, res, next) => {
	const index = req.query?.index;
	possibleIndexes.find(i => i ===index) ?
		next() :
		res.status(404).send(`Specified index - ${index} not found.`);
})

app.get("/api/search", async(req, res, next) => {
	const queryTerm = req.query?.q?.toLowerCase();
	if(!queryTerm) {
		return res.status(404).send("No search query provided");
	}
	if (typeof queryTerm === "undefined") return res.sendResults("empty", next);
	// Look for a file in the results directory that matches the given query term
	const resultFileName = (await fs.readdir(resultsDirectory))
	.map(removeJsonFileExtension)
	.find((f) => new RegExp(f, "i").test(queryTerm));
	
	return res.sendResults(resultFileName || queryTerm, next);

});

app.get("/api/typeahead", async(req, res, next) => {
	const queryTerm = req.query?.q?.toLowerCase();
	if(!queryTerm) {
		return res.status(404).send("No search query provided");
	}
	return res.typeAhead(queryTerm, next);
});

app.get("/api/typeahead/all", async(req, res, next) => {
	const queryTerm = req.query?.q?.toLowerCase();
	if(!queryTerm) {
		return res.status(404).send("No search query provided");
	}
	return res.typeAhead(queryTerm, next);
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
