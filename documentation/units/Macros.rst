===============
./src/macros.js
===============



Exported Functions
==================


macros.extractPattern (row)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Extract a pattern from a single row

* `row`: string, row where to look for pattern

Returns a single pattern object or `null` if pattern not found. Pattern object fields:

* `pattern`: string, name of the matched pattern (not the pattern itself), eg `MACRO_HEADER`
* `args`: object, arguments for this pattern (eg `name`)


macros.extractMacros (rows)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Extract macros from a set of rows of code

* `rows`: array of strings, the code as read from a file

Macro state machine

* state 0: no current block
   * no pattern -> do nothing
   * header block start -> create new block, state 1
   * body block start -> find block, state 2
   * other pattern -> error
* state 1: header block
   * no pattern -> add to current header block
   * header block end -> state 0
   * general block end -> state 0
   * body block start, same block -> state 2
   * other pattern -> error
* state 2: body block
   * no pattern -> add to current body block
   * body block end -> state 0
   * general block end -> state 0
   * header block start, different block -> state 1
   * other pattern -> error

Returns object, a list of macros as well as the code rows without the macro code

* `macros`: array of objects, the list of macros found in code, each described by:
   * `name`: string, name if any
   * `header: array of strings, macro header code
   * `body`: array of strings, macro body code (this will be duplicated with tokens replaced)
* `code`: array of strings, the remaining rows of code; header bodies will be replaced by a token such as `<<< MACRO
  BODY [i] >>>` where i is the actual index in the macros array


macros.expandRange (range)
~~~~~~~~~~~~~~~~~~~~~~~~~~

Get an array of all possible values for a range

* `range`: range object, contains keys and corresponding values depending on range type
   * `{ each: <object> }`: each value in an object, produces an array of all values
   * `{ keys: <object> }`: all keys in an object, produces an array of all keys (strings or numbers)
   * `{ values: <array> }`: explicit list of values, copies array (eg [ 0, 5, 10 ])
   * `{ from: <number>, to: <number> }`: all integers between `from` and `to`, inclusive

Returns array, corresponding array of values for the range object


macros.combineRanges (ranges)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get an array of all possible combinations for a set of ranges

* `ranges`: array of arrays, all possible values for each range, eg `[ [ 0, 1, 2 ], [ 'a', 'b' ] ]`

Returns array of arrays, all possible combinations for input ranges, eg `[ [ 0, 'a' ], [ 0, 'b' ], [ 1, 'a' ], [ 1, 'b'
], [ 2, 'a' ], [ 2, 'b' ] ]`


macros.replaceTokens (tokens, template)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Expand and replace tokens in template code

* `tokens`: array of token objects, each token object contains token name fields and values: `{ <token1>: <value1>,
  <token2>: <value2>, ...`; token names without "%" marks
* `template`: array of strings, template rows of code

For each token array element, it replaces all tokens in the template code.

Returns: array of strings, generated code rows for all tokens in array


macros.runMacro (macro, scriptPath)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Execute macro code and generate code based on template

* `macro`: macro object
   * `header`: array of strings, macro header code (will run in a vm)
   * `body`: array of strings, code template rows (with tokens to be replaced)
* `scriptPath`: string, the path to the code being processed, this will be used as __dirname in macro execution

This function executes the header code to obtain the `TOKENS` function and `RANGES` object, then it obtains the actual
range values and replaces the tokens in the body code

Returns array of strings, the expanded macro body with replaced tokens


macros.processMacros (macros, code, scriptPath)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Process extracted macros on remaining code

* `macros`: array of objects, extracted macro objects
   * `header`: array of strings, macro header code (will run in a vm)
   * `body`: array of strings, code template rows (with tokens to be replaced)
* `code`: array of strings, the code after macro extraction (with placeholders for macro output)
* `scriptPath`: string, the path to the code being processed, this will be used as __dirname in macro execution

Returns array of strings, the code with extracted macro expanded output


Variable Declarations
=====================


const PATTERNS
~~~~~~~~~~~~~~

Macro pattern definitions and arguments `MACRO_HEADER`: a macro header, eg `/* MACRO.HEADER <name>` - `name`: string,
the name of this macro, if any `MACRO_BODY`: a macro body, eg `/* MACRO.BODY <name>` - `name`: string, the name of this
macro, if present, it must match name in header `MACRO_END`: a single end of comment `*\/` ends a macro header or body;
no arguments

* not exported
* initial value: `{`

Generated at Thu Dec 24 2020 17:53:43 GMT+0800 (Central Indonesia Time)
