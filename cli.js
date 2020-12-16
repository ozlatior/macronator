const fs = require("fs");
const path = require("path");

const Macros = require("./src/macros.js");

/*
 * Exit application in case of error
 * `error`: string, error message to display
 * Prints the error information and exits with code -1
 */
const die = function(error) {
	console.log(error);
	console.log("");
	process.exit(-1);
}

/*
 * Print help message and exit
 */
const printHelpAndExit = function() {
	console.log("");
	console.log([
		"Macronator Command Line Interface Help",
		"",
		"Usage:",
		"    node path/to/cli.js <inputfile> [outputfile]",
		"",
		"The utility processes all macros in the input file and saves the output in the output file.",
		"If no output file is given, the output will be overwritten over the input file and a copy of",
		"the input file will be saved next to it with the '.macro' extension instead.",
		"",
		"Other options",
		" -h, --help    print this help text",
		" --readme      print readme contents",
		""].join("\n"));
	process.exit(0);
}

/*
 * Print contents of readme file and exit
 */
const printReadmeAndExit = function() {
	let content = fs.readFileSync("./README.md").toString();
	console.log("");
	console.log(content);
	process.exit(0);
}

let args = process.argv.slice(2);

switch (args[0]) {
	case "-h":
	case "--help":
		printHelpAndExit();
	case "--readme":
		printReadmeAndExit();
}

let inputFile = args[0];
let outputFile = args[1];

if (args.length === 0)
	die("No input file. Please use --help for instructions");
if (args.length > 2)
	die("Unexpected argument " + args[2] + ". Please use --help for instructions");

if (outputFile === undefined)
	outputFile = inputFile;

let scriptPath = path.join(process.cwd(), inputFile.split("/").slice(0, -1).join("/"));

let input, macros, code;

try {
	input = fs.readFileSync(inputFile).toString().split("\n");
}
catch (e) {
	die(e.message);
}

try {
	macros = Macros.extractMacros(input);
}
catch (e) {
	die(e.message);
}

try {
	code = Macros.processMacros(macros.macros, macros.code, scriptPath);
}
catch (e) {
	if (e instanceof MacroError)
		die(e.message);
	else
		throw e;
}

if (inputFile === outputFile) {
	let backupFile = inputFile + ".macro";
	try {
		fs.writeFileSync(backupFile, input.join("\n"));
	}
	catch (e) {
		die(e.message);
	}
	console.log("Using same file for output. Original file contents copied to " + backupFile);
}

try {
	fs.writeFileSync(outputFile, code.join("\n"));
}
catch (e) {
	die(e.message);
}

console.log("Output written to " + outputFile);
