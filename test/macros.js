const fs = require("fs");
const path = require("path");

const assert = require("assert-one");

const Macros = require("../src/macros.js");

describe ("Macro processing tests", () => {

	describe ("extractPattern()", () => {

		it ("Extracts macro header pattern with open comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.HEADER    ");
			assert.equal(res.pattern, "MACRO_HEADER");
		});

		it ("Extracts macro header pattern with closed comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.HEADER  */   ");
			assert.equal(res.pattern, "MACRO_HEADER");
		});

		it ("Extracts macro header pattern with name, open comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.HEADER foo   ");
			assert.equal(res.pattern, "MACRO_HEADER");
			assert.equal(res.args.name, "foo");
		});

		it ("Extracts macro header pattern with name, closed comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.HEADER  foo  */   ");
			assert.equal(res.pattern, "MACRO_HEADER");
			assert.equal(res.args.name, "foo");
		});

		it ("Extracts macro body pattern with open comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.BODY    ");
			assert.equal(res.pattern, "MACRO_BODY");
		});

		it ("Extracts macro body pattern with closed comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.BODY  */   ");
			assert.equal(res.pattern, "MACRO_BODY");
		});

		it ("Extracts macro body pattern with name, open comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.BODY foo   ");
			assert.equal(res.pattern, "MACRO_BODY");
			assert.equal(res.args.name, "foo");
		});

		it ("Extracts macro body pattern with name, closed comment", () => {
			let res = Macros.extractPattern("  /*  MACRO.BODY  foo  */   ");
			assert.equal(res.pattern, "MACRO_BODY");
			assert.equal(res.args.name, "foo");
		});

		it ("Extracts macro ending", () => {
			let res = Macros.extractPattern("    */    ");
			assert.equal(res.pattern, "MACRO_END");
		});

	});

	describe ("extractMacros()", () => {

		it ("Extracts macros in sequential order", () => {
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/input1.js")).toString().split("\n");
			let expected = fs.readFileSync(path.join(__dirname, "../sample/tests/output1.js")).toString();
			let res = Macros.extractMacros(input);
			assert.length(res.macros, 2);
			assert.equal(res.macros[0].name, "1");
			assert.equal(res.macros[1].name, "2");
			assert.fieldValues(res.macros[0].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[0].body, [
				'\tget%1% () {',
				'\t\treturn this.%2%;',
				'\t}',
				''
			]);
			assert.fieldValues(res.macros[1].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[1].body, [
				'\tset%1% (%2%) {',
				'\t\tthis.%2% = %2%;',
				'\t}',
				''
			]);
			assert.equal(res.code.join("\n"), expected);
		});

		it ("Extracts macros in sequential order, no names", () => {
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/input2.js")).toString().split("\n");
			let expected = fs.readFileSync(path.join(__dirname, "../sample/tests/output2.js")).toString();
			let res = Macros.extractMacros(input);
			assert.length(res.macros, 2);
			assert.equal(res.macros[0].name, undefined);
			assert.equal(res.macros[1].name, undefined);
			assert.fieldValues(res.macros[0].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[0].body, [
				'\tget%1% () {',
				'\t\treturn this.%2%;',
				'\t}',
				''
			]);
			assert.fieldValues(res.macros[1].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[1].body, [
				'\tset%1% (%2%) {',
				'\t\tthis.%2% = %2%;',
				'\t}',
				''
			]);
			assert.equal(res.code.join("\n"), expected);
		});

		it ("Extracts macros in sequential order, open comments", () => {
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/input3.js")).toString().split("\n");
			let expected = fs.readFileSync(path.join(__dirname, "../sample/tests/output3.js")).toString();
			let res = Macros.extractMacros(input);
			assert.length(res.macros, 2);
			assert.equal(res.macros[0].name, "1");
			assert.equal(res.macros[1].name, "2");
			assert.fieldValues(res.macros[0].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[0].body, [
				'\tget%1% () {',
				'\t\treturn this.%2%;',
				'\t}',
				''
			]);
			assert.fieldValues(res.macros[1].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[1].body, [
				'\tset%1% (%2%) {',
				'\t\tthis.%2% = %2%;',
				'\t}',
				''
			]);
			assert.equal(res.code.join("\n"), expected);
		});

		it ("Extracts macros with headers defined first", () => {
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/input4.js")).toString().split("\n");
			let expected = fs.readFileSync(path.join(__dirname, "../sample/tests/output4.js")).toString();
			let res = Macros.extractMacros(input);
			assert.length(res.macros, 2);
			assert.equal(res.macros[0].name, "1");
			assert.equal(res.macros[1].name, "2");
			assert.fieldValues(res.macros[0].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[0].body, [
				'\tget%1% () {',
				'\t\treturn this.%2%;',
				'\t}',
				''
			]);
			assert.fieldValues(res.macros[1].header, [
				'\tconst TOKENS = (r) => { "1": r[0], "2": r[1] };',
				'\tconst RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];'
			]);
			assert.fieldValues(res.macros[1].body, [
				'\tset%1% (%2%) {',
				'\t\tthis.%2% = %2%;',
				'\t}',
				''
			]);
			assert.equal(res.code.join("\n"), expected);
		});

	});

	describe ("extractMacros() error conditions", () => {

		it ("Detects duplicate macro name, fresh header", () => {
			let msg = "Macro name already exists";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error1.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects duplicate macro name, header as body closing tag", () => {
			let msg = "Macro name already exists";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error2.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects macro name not found", () => {
			let msg = "Macro name not found";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error3.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects unnamed macro missing header", () => {
			let msg = "Macro header missing";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error4.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects macro name mismatch (header open vs close tag)", () => {
			let msg = "Macro name mismatch";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error5.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects macro name mismatch (body open vs close tag)", () => {
			let msg = "Macro name mismatch";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error6.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("Detects macro name mismatch (header open vs body open tag)", () => {
			let msg = "Macro name mismatch";
			let input = fs.readFileSync(path.join(__dirname, "../sample/tests/error7.js")).toString().split("\n");
			let caught = false;
			try {
				Macros.extractMacros(input);
			}
			catch (e) {
				assert.begins(e.message, msg);
				caught = true;
			}
			assert.equal(caught, true);
		});

	});

	describe ("expandRange()", () => {

		it ("expands 'each' range", () => {
			let o = { a: 0, b: 15, c: "foo" };
			let res = Macros.expandRange({ each: o });
			assert.length(res, 3);
			assert.fieldValues(res, [ 0, 15, "foo" ]);
		});

		it ("expands 'each' range, empty object", () => {
			let res = Macros.expandRange({ each: {} });
			assert.length(res, 0);
		});

		it ("expands 'keys' range", () => {
			let o = { a: 0, b: 15, c: "foo" };
			let res = Macros.expandRange({ keys: o });
			assert.fieldValues(res, [ "a", "b", "c" ]);
		});

		it ("expands 'keys' range, empty object", () => {
			let res = Macros.expandRange({ keys: {} });
			assert.length(res, 0);
		});

		it ("expands 'from' 'to' range", () => {
			let res = Macros.expandRange({ from: 10, to: 20 });
			assert.length(res, 11);
			assert.fieldValues(res, [ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]);
		});

		it ("expands 'from' 'to' range, from == to", () => {
			let res = Macros.expandRange({ from: 10, to: 10 });
			assert.length(res, 1);
			assert.fieldValues(res, [ 10 ]);
		});

		it ("expands 'values' range", () => {
			let o = [ 0, 10, 20 ];
			let res = Macros.expandRange({ values: o });
			assert.fieldValues(res, [ 0, 10, 20 ]);
		});

		it ("expands 'values' range, empty array", () => {
			let res = Macros.expandRange({ values: [] });
			assert.length(res, 0);
		});

		it ("throws on bad from-to interval", () => {
			let caught = false;
			try {
				Macros.expandRange({ from: 20, to: 10 });
			}
			catch (e) {
				assert.begins(e.message, "Bad interval (from > to)");
				caught = true;
			}
			assert.equal(caught, true);
		});

		it ("throws on bad range format", () => {
			let caught = false;
			try {
				Macros.expandRange({ from: 20, too: 10 });
			}
			catch (e) {
				assert.begins(e.message, "Bad range format");
				caught = true;
			}
			assert.equal(caught, true);
		});

	});

	describe ("combineRanges()", () => {

		it ("combines a set of ranges", () => {
			let ranges = [ [ 0, 1, 2 ], [ 5, 6 ], [ false, true ] ];
			let res = Macros.combineRanges(ranges);
			assert.length(res, 12);
			res = res.map((e) => e.join("-"));
			assert.fieldValues(res, [
				"0-5-false", "0-5-true", "0-6-false", "0-6-true",
				"1-5-false", "1-5-true", "1-6-false", "1-6-true",
				"2-5-false", "2-5-true", "2-6-false", "2-6-true"
			]);
		});

		it ("combines a set with a single range", () => {
			let ranges = [ [ 0, 1, 2 ] ];
			let res = Macros.combineRanges(ranges);
			assert.length(res, 3);
			res = res.map((e) => e.join("-"));
			assert.fieldValues(res, [ "0", "1", "2" ]);
		});

		it ("combines a set with a single range and single value", () => {
			let ranges = [ [ 0 ] ];
			let res = Macros.combineRanges(ranges);
			assert.length(res, 1);
			res = res.map((e) => e.join("-"));
			assert.fieldValues(res, [ "0" ]);
		});

		it ("combines a set with no range", () => {
			let ranges = [];
			let res = Macros.combineRanges(ranges);
			assert.length(res, 0);
		});

	});

});
