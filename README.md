---
Macronator - Macro Replacement and Code Generator for nodejs
---

Macronator is a macro replacement utility for easy generation of boilerplate or
other repetitive code, function stubs, dummy functions and other usually boring and
tedious tasks.

* improves coding speed for repetitive, "boilerplate" sections of the code
* prevents easily avoidable copy-paste "antipattern" bugs
* easy to integrate as a library in visual editor codes
* easy to use as a command-line utility


# How to use


## Define a macro

You can define macros in your code files for any piece of code that is repetitive in nature. The macro
body should define the piece of code that is to be duplicated, with tokens for parts that are different
for each duplication. For example, the example below will produce field definitions for all possible
combinations of three values:

	const VALUES = {};
	/* MACRO.BODY */
	VALUES.%KEY% = %VALUE%;
	/* MACRO.BODY */

In order for the macro to work, a header must be defined (before the body) which declares two local-scope
values:

* `TOKENS`: function (range1, ...), a function that returns an array of token objects for a given set of
            range values
* `RANGES`: array of objects, each range object contains keys and corresponding values depending on range type:
    - `{ each: <object> }`: each value in an object, produces an array of all values
    - `{ keys: <object> }`: all keys in an object, produces an array of all keys (strings or numbers)
    - `{ values: <array> }`: explicit list of values, copies array (eg [ 0, 5, 10 ])
    - `{ from: <number>, to: <number> }`: all integers between `from` and `to`, inclusive

For example, let's combine three values into ranges (this header has to be defined before the body above).
The tokens function will receive three arguments, for instance `("min", "speed", "z")` and must return the
values for the `%KEY%` and `%VALUE%` tokens.

	/* MACRO.HEADER */
	const RANGES = [
		{ values: [ "min", "avg", "max" ] },
		{ values: [ "position", "velocity", "acceleration", "momentum", "force" ] },
		{ values: [ "x", "y", "z" ] }
	];
	const TOKENS = (r1, r2, r3) => ({
		KEY: (r1 + "_" + r2 + "_" + r3).toUpperCase(),
		VALUE: '{ range: "' + r1 + '", value: "' + r2 + '", axis: "' + r3 + '" }'
	});
	/* MACRO.HEADER */

This will generate all possible values:

	const VALUES = {};
	VALUES.MIN_POSITION_X = { range: "min", value: "position", axis: "x" };
	VALUES.MIN_POSITION_Y = { range: "min", value: "position", axis: "y" };
	VALUES.MIN_POSITION_Z = { range: "min", value: "position", axis: "z" };
	VALUES.MIN_VELOCITY_X = { range: "min", value: "velocity", axis: "x" };
	...


## Run the engine via CLI

The command line interface is a very simple script that parses and processes all macros from an input
file and saves the generated code (plus all the untouched code) in the output file.

	node path/to/cli.js <inputFile> <outputFile>

In case the output file is not specified, the same file will be used, and a back-up will be saved
alongside the input / output file.


## Run the engine as module

There are two functions of interest provided in the module:

	const macronator = require("macronator");

	const inputRows = ...; // maybe read them from a file or via HTTP request

	// extract macros from rows, macros will be returned as res.macros, the remaining code as res.code
	let res = macronator.extractMacros(inputRows);

	// execute the extracted macros
	let outputRows = macronator.processMacros(res.macros, res.code);

For more information, there is full documentation in the documentation directory.


# Quick reference


## Macro block definitions

Macro blocks are defined using comments and keywords. Keywords are:

* `MACRO.HEADER`: a macro header, eg `/* MACRO.HEADER <name>`
    - `name`: string, the name of this macro, if any
* `MACRO.BODY`: a macro body, eg `/* MACRO.BODY <name>`
    - `name`: string, the name of this macro, if present, it must match name in header
* `MACRO.END`: a single end of comment `*\/` ends a macro header or body; no arguments

A macro block can be either fully commented or included between two macro comments, as such:

	/* MACRO.HEADER */
	... [ macro code ] ...
	/* MACRO.HEADER */

or

	/* MACRO.HEADER */
	... [ macro code ] ...
	/* MACRO.END */

or

	/* MACRO.HEADER
	... [ macro code ] ...
	*/

A macro block ends by default if a block of a different type begins:

	/* MACRO.HEADER */
	... [ header code ] ...
	/* MACRO.BODY */
	... [ body code ] ...
	/* MACRO.EBD */

By default, each body is coupled with the header before. However, headers can be defined
separately anywhere before the body (in the same file). Names come handy for this purpose:

	/* MACRO.HEADER myMacro1 */
	...
	/* MACRO.HEADER myMacro1 */
	
	/* MACRO.HEADER myMacro2 */
	...
	/* MACRO.HEADER myMacro2 */
	
	// some code here
	
	/* MACRO.BODY myMacro1 */
	...
	/* MACRO.BODY myMacro1 */
	
	/* MACRO.BODY myMacro2 */
	...
	/* MACRO.BODY myMacro2 */


## Macro header context

The header context defines "input" and "output" variables. Available input objects:

* `__dirname`: the actual script path, regardless of where the utility is called from
* `console`: the `console` object for `console.log()`
* `require`: the `require()` function for including modules
* `path`: the `path` module for path operations

The header must define two objects, the `TOKENS` function and the `RANGES` array.


## The RANGES array

The `RANGES` array is defined in the macro header and provides all the input data for the
`TOKENS` function. The data is provided in series which will be combined (all possible values)
when calling the `TOKENS` function. Keywords can be used to define the series:

- `{ each: <object> }`: each value in an object, produces an array of all values
- `{ keys: <object> }`: all keys in an object, produces an array of all keys (strings or numbers)
- `{ values: <array> }`: explicit list of values, copies array (eg [ 0, 5, 10 ])
- `{ from: <number>, to: <number> }`: all integers between `from` and `to`, inclusive

For example, the following will produce a dataset of all possible pairs of months and years
(between 2010 and 2020):

	const RANGES = [
		{ values: [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ] },
		{ from: 2010, to: 2020 }
	];
	// resolves to
	// [ [ "jan", 2010 ], [ "jan", 2011 ], ... , [ "dec", 2019 ], [ "dec", 2020 ] ]

If you want the list sorted by year, place the year `{ from ... to  }` on the first position in the
`RANGES` array.

	const RANGES = [
		{ from: 2010, to: 2020 },
		{ values: [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ] }
	];
	// resolves to
	// [ [ 2010, "jan" ], [ 2010, "feb" ], [ 2010, "mar" ], ... , [ 2020, "dec" ] ]


## The TOKENS function

The TOKENS function is called with every set in the resolved ranges array. It has to be defined with as
many arguments as there are series in the `RANGES` array. The return value is an array of objects, with
each object containing token values. The objects returned in the array will be put together in the final
array used for expanding the macro body. You can return more objects or you can return no objects
(empty array) if you want to skip a data set altogether.

	const TOKENS = (year, month) => {
		// called automatically with month and year, eg: 'jan', 2010
		// skip the month of july 2015
		if (month === "jul" && year === 2015)
			return [];
		// for all other months, return the month and year as tokens
		let ret = [ {
			MONTH: month,
			YEAR: year
		} ];
		// for the month of december, return an extra element for the end of year report
		if (month === "dec")
			ret.push({
				MONTH: "final",
				YEAR: year
			});
		return ret;
	};

The function above will return all months and years as tokens, minus july 2015, and an extra element
for each year with the month set to "final".


## The macro body

The macro body will be expanded, ie duplicated for each token set returned by the `TOKENS` function.

	/* MACRO.BODY */
	addEntry("%YEAR%", "%MONTH%");
	/* MACRO.BODY */

The macro above will be expanded to:

	addEntry("2010", "jan");
	addEntry("2010", "feb");
	...
	addEntry("2010", "dec");
	addEntry("2010", "final");
	addEntry("2011", "jan");
	addEntry("2011", "feb");
	...
	addEntry("2020", "dec");
	addEntry("2020", "final");


## Calling the module programatically

Importing the module via `require` gives access to the two relevant functions, `extractMacros` and
`processMacros`.

`extractMacros` takes a single argument, the array of rows of code as they are read from the file,
and returns an object containing the list of extracted macros, as well as an array of strings containing
the remaining code and placeholders (processed macros will be inserted instead of placeholders):

* `macros`: array of objects, the list of macros found in code, each described by:
    - `name`: string, name if any
    - `header: array of strings, macro header code
    - `body`: array of strings, macro body code (this will be duplicated with tokens replaced)
* `code`: array of strings, the remaining rows of code; header bodies will be replaced by
          a token such as `<<< MACRO BODY [i] >>>` where i is the actual index in the macros array

This object is used to call the `processMacros` function, which takes three arguments:

* `macros`: array of objects, extracted macro objects
    -`header`: array of strings, macro header code (will run in a vm)
    - `body`: array of strings, code template rows (with tokens to be replaced)
* `code`: array of strings, the code after macro extraction (with placeholders for macro output)
* `scriptPath`: string, the path to the code being processed, this will be used as __dirname in macro execution

And returns an array of strings, the newly generated code with the macros expanded.

See the example above and documentation for more details.
