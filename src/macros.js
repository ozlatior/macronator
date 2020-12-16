const path = require("path");
const vm = require("vm");

/*
 * Macro pattern definitions and arguments
 * `MACRO_HEADER`: a macro header, eg `/* MACRO.HEADER <name>`
 * - `name`: string, the name of this macro, if any
 * `MACRO_BODY`: a macro body, eg `/* MACRO.BODY <name>`
 * - `name`: string, the name of this macro, if present, it must match name in header
 * `MACRO_END`: a single end of comment `*\/` ends a macro header or body; no arguments
 */
const PATTERNS = {
	MACRO_HEADER: /^[ \t]*\/\*+[ \t]*MACRO\.HEADER.*$/,
	MACRO_BODY: /^[ \t]*\/\*+[ \t]*MACRO\.BODY.*$/,
	MACRO_END: /^[ \t]*\*\/[ \t]*$/
};

class MacroError extends Error {

	/*
	 * Constructor
	 * `error`: string, error message to display
	 * `row`: string, optional, the row where the error occured
	 * `index`: number, optional, the row number where the error occured
	 * `details`: string, optional, additional details on error condition
	 */
	constructor (message, row, index, details) {
		if (row !== undefined && row !== null)
			message += "\n  " + row;
		if (!details)
			details = "";
		message += "\n  " + details + (index ? " on row " + index : "");

		super(message);

		this.name = "MacroError";
		this.row = row;
		this.index = index;
		this.details = details;
	}

};

/*
 * Extract a pattern from a single row
 * `row`: string, row where to look for pattern
 * Returns a single pattern object or `null` if pattern not found. Pattern object fields:
 * `pattern`: string, name of the matched pattern (not the pattern itself), eg `MACRO_HEADER`
 * `args`: object, arguments for this pattern (eg `name`)
 */
const extractPattern = function (row) {
	let match = null;
	for (let i in PATTERNS) {
		if (row.match(PATTERNS[i]) !== null)
			match = i;
	}
	if (match === null)
		return null;
	let ret = {
		pattern: match,
		args: {}
	};
	if (match === "MACRO_HEADER" || match === "MACRO_BODY") {
		row = row.replace(/\/\*/, "").replace(/\*\//, "")
			.replace(/^[ \t]*/g, "").replace(/[ \t]*$/g, "").replace(/[ \t]+/g, " ");
		row = row.split(" ");
		ret.args.name = row[1];
	}
	return ret;
};

/*
 * Extract macros from a set of rows of code
 * `rows`: array of strings, the code as read from a file
 * Macro state machine
 * - state 0: no current block
 *  -> no pattern -> do nothing
 *  -> header block start -> create new block, state 1
 *  -> body block start -> find block, state 2
 *  -> other pattern -> error
 * - state 1: header block
 *  -> no pattern -> add to current header block
 *  -> header block end -> state 0
 *  -> general block end -> state 0
 *  -> body block start, same block -> state 2
 *  -> other pattern -> error
 * - state 2: body block
 *  -> no pattern -> add to current body block
 *  -> body block end -> state 0
 *  -> general block end -> state 0
 *  -> header block start, different block -> state 1
 *  -> other pattern -> error
 * Returns object, a list of macros as well as the code rows without the macro code
 * `macros`: array of objects, the list of macros found in code, each described by:
 * - `name`: string, name if any
 * - `header: array of strings, macro header code
 * - `body`: array of strings, macro body code (this will be duplicated with tokens replaced)
 * `code`: array of strings, the remaining rows of code; header bodies will be replaced by
 *         a token such as `<<< MACRO BODY [i] >>>` where i is the actual index in the macros array
 */
const extractMacros = function (rows) {
	let ret = [];
	let code = [];
	let current = null;

	let getBlockByName = function(name) {
		for (let i=0; i<ret.length; i++)
			if (ret[i].name === name)
				return ret[i];
		return null;
	};

	for (let i=0; i<rows.length; i++) {
		let e = extractPattern(rows[i]);
		/* state 0 - no pattern: do nothing */
		if (current === null && e === null) {
			code.push(rows[i]);
			continue;
		}
		/* state 0 - no current block: macro header start */
		if (current === null && e && e.pattern === "MACRO_HEADER") {
			if (e.args.name && getBlockByName(e.args.name))
				throw new MacroError("Macro name already exists", rows[i], i+1,
					"Macro name '" + e.args.name + "' already exists");
			current = { name: e.args.name, header: [], body: null };
			continue;
		}
		/* state 0 - no current block: macro body start */
		if (current === null && e && e.pattern === "MACRO_BODY") {
			if (e.args.name) {
				current = getBlockByName(e.args.name);
				if (current === null)
					throw new MacroError("Macro name not found", rows[i], i+1,
						"Macro header not defined for '" + e.args.name + "'");
			}
			else {
				if (ret.length === 0)
					throw new MacroError("Macro header missing", rows[i], i+1,
						"Defining a unnamed macro body, but no previous macro header defined");
				current = ret[ret.length-1];
			}
			current.body = [];
			continue;
		}

		/* state 1 - current block header: no pattern, new header row */
		if (current && current.body === null && e === null) {
			current.header.push(rows[i]);
			continue;
		}
		/* state 1 - current block header: macro header as ending */
		if (current && current.body === null && e && e.pattern === "MACRO_HEADER") {
			if (e.args.name && current.name !== e.args.name)
				throw new MacroError("Macro name mismatch", rows[i], i+1,
					"Macro header starts as '" + current.name + "', ends as '" + e.args.name + "'");
			ret.push(current);
			current = null; // back to state 0
			continue;
		}
		/* state 1 - current block header: generic ending */
		if (current && current.body === null && e && e.pattern === "MACRO_END") {
			ret.push(current);
			current = null; // back to state 0
			continue;
		}
		/* state 1 - current block header, macro body start */
		if (current && current.body === null && e && e.pattern === "MACRO_BODY") {
			if (e.args.name && current.name !== e.args.name)
				throw new MacroError("Macro name mismatch", rows[i], i+1,
					"Macro header starts as '" + current.name + "', ends as '" + e.args.name + "'");
			ret.push(current);
			current.body = [];
			continue;
		}

		/* state 2 - current block body: no pattern, new body row */
		if (current && current.body !== null && e === null) {
			current.body.push(rows[i]);
			continue;
		}
		/* state 2 - current block body: macro body as ending */
		if (current && current.body !== null && e && e.pattern === "MACRO_BODY") {
			if (e.args.name && current.name !== e.args.name)
				throw new MacroError("Macro name mismatch", rows[i], i+1,
					"Macro body starts as '" + current.name + "', ends as '" + e.args.name + "'");
			code.push("<<< MACRO BODY " + ret.indexOf(current) + " >>>");
			current = null; // back to state 0
			continue;
		}
		/* state 2 - current block body: generic ending */
		if (current && current.body !== null && e && e.pattern === "MACRO_END") {
			code.push("<<< MACRO BODY " + ret.indexOf(current) + " >>>");
			current = null; // back to state 0
			continue;
		}
		/* state 2 - current block body, macro header start */
		if (current && current.body !== null && e && e.pattern === "MACRO_HEADER") {
			if (e.args.name && getBlockByName(e.args.name))
				throw new MacroError("Macro name already exists", rows[i], i+1,
					"Macro name '" + e.args.name + "' already exists");
			code.push("<<< MACRO BODY " + ret.indexOf(current) + " >>>");
			current = { name: e.args.name, header: [], body: null }; // straight to state 1
			continue;
		}

		/* any state, unexpected pattern */
		if (e) {
			if (e.pattern === "MACRO_END")
				code.push(rows[i]);
			else
				throw new MacroError("Unexpected pattern", rows[i], i+1, "Unexpected " + e.pattern + " pattern");
		}
	}
	return {
		macros: ret,
		code: code
	};
};

/*
 * Get an array of all possible values for a range
 * `range`: range object, contains keys and corresponding values depending on range type
 * - `{ each: <object> }`: each value in an object, produces an array of all values
 * - `{ keys: <object> }`: all keys in an object, produces an array of all keys (strings or numbers)
 * - `{ values: <array> }`: explicit list of values, copies array (eg [ 0, 5, 10 ])
 * - `{ from: <number>, to: <number> }`: all integers between `from` and `to`, inclusive
 * Returns array, corresponding array of values for the range object
 */
const expandRange = function(range) {
	let ret = [];
	if (range.each) {
		for (let i in range.each)
			ret.push(range.each[i]);
		return ret;
	}
	if (range.keys) {
		for (let i in range.keys)
			ret.push(i);
		return ret;
	}
	if (range.from !== undefined && range.to !== undefined) {
		if (range.from > range.to)
			throw new MacroError("Bad interval (from > to) " + JSON.stringify(range));
		for (let i=range.from; i<=range.to; i++)
			ret.push(i);
		return ret;
	}
	if (range.values) {
		return range.values.slice(0);
	}
	throw new MacroError("Bad range format " + JSON.stringify(range));
};

/*
 * Get an array of all possible combinations for a set of ranges
 * `ranges`: array of arrays, all possible values for each range,
 *           eg `[ [ 0, 1, 2 ], [ 'a', 'b' ] ]`
 * Returns array of arrays, all possible combinations for input ranges,
 *           eg `[ [ 0, 'a' ], [ 0, 'b' ], [ 1, 'a' ], [ 1, 'b' ], [ 2, 'a' ], [ 2, 'b' ] ]`
 */
const combineRanges = function(ranges) {
	let ret = [];
	let combinations = [];
	let count = 1;
	let bases = [];
	if (ranges.length === 0)
		return ret;
	for (let i=ranges.length-1; i>=0; i--) {
		count *= ranges[i].length;
		bases.unshift(ranges[i].length);
	}
	for (let i=0; i<count; i++) {
		let digits = [];
		let basesc = bases.slice(0);
		let number = i;
		while (number > 0) {
			let base = basesc.pop();
			digits.unshift(number % base);
			number = parseInt(number / base);
		}
		while (digits.length < bases.length)
			digits.unshift(0);
		combinations.push(digits);
	}
	for (let i=0; i<combinations.length; i++) {
		let toPush = [];
		for (let j=0; j<combinations[i].length; j++)
			toPush.push(ranges[j][combinations[i][j]]);
		ret.push(toPush);
	}
	return ret;
};

/*
 * Expand and replace tokens in template code
 * `tokens`: array of token objects, each token object contains token name fields and values:
 *           `{ <token1>: <value1>, <token2>: <value2>, ...`; token names without "%" marks
 * `template`: array of strings, template rows of code
 * For each token array element, it replaces all tokens in the template code.
 *
 * Returns: array of strings, generated code rows for all tokens in array
 */
const replaceTokens = function(tokens, template) {
	let ret = [];
	template = template.join("\n");
	for (let i=0; i<tokens.length; i++) {
		let code = template;
		for (let j in tokens[i])
			code = code.replace(new RegExp("%" + j + "%", "g"), tokens[i][j]);
		ret = ret.concat(code.split("\n"));
	}
	return ret;
};

/*
 * Execute macro code and generate code based on template
 * `macro`: macro object
 * - `header`: array of strings, macro header code (will run in a vm)
 * - `body`: array of strings, code template rows (with tokens to be replaced)
 * This function executes the header code to obtain the `TOKENS` function and `RANGES` object,
 * then it obtains the actual range values and replaces the tokens in the body code
 *
 * Returns array of strings, the expanded macro body with replaced tokens
 */
const runMacro = function(macro, scriptPath) {
	if (scriptPath === undefined)
		scriptPath = __dirname;
	let ret = [];
	let header = macro.header.join("\n");
	header += "\n__done__(TOKENS, RANGES)";
	let tokens = null;
	let ranges = null;
	let ctx = vm.createContext({
		__dirname: scriptPath,
		console: console,
		require: require,
		path: path,
		__done__: (TOKENS, RANGES) => { tokens = TOKENS; ranges = RANGES }
	});
	vm.runInContext(header, ctx);
	for (let i=0; i<ranges.length; i++)
		ranges[i] = expandRange(ranges[i]);
	ranges = combineRanges(ranges);
	for (let i=0; i<ranges.length; i++) {
		let tok = tokens.apply(null, ranges[i]);
		ret = ret.concat(replaceTokens(tok, macro.body));
	}
	return ret;
};

/*
 * Process extracted macros on remaining code
 * `macros`: array of objects, extracted macro objects
 * - `header`: array of strings, macro header code (will run in a vm)
 * - `body`: array of strings, code template rows (with tokens to be replaced)
 * `code`: array of strings, the code after macro extraction (with placeholders for macro output)
 * Returns array of strings, the code with extracted macro expanded output
 */
const processMacros = function(macros, code, scriptPath) {
	for (let i=0; i<macros.length; i++) {
		let res = runMacro(macros[i], scriptPath);
		let index = code.indexOf("<<< MACRO BODY " + i + " >>>");
		res.unshift(1);
		res.unshift(index);
		code.splice.apply(code, res);
	}
	return code;
};

module.exports.combineRanges = combineRanges;
module.exports.expandRange = expandRange;
module.exports.extractMacros = extractMacros;
module.exports.extractPattern = extractPattern;
module.exports.processMacros = processMacros;
module.exports.replaceTokens = replaceTokens;
module.exports.runMacro = runMacro;
