const fs = require("fs");
const path = require("path");

/*
 * In this example class, we are creating vector getters, setters and a more
 * "complex" set of functions that uses two sets of ranges
 */
class Vector {

	constructor (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/* MACRO.HEADER 1 */
	// this macro generates all getters for the x, y and z properties

	// the token function will receive a two-element array as defined in RANGES and
	// assign each of the two elements to the tokens 1 and 2 respectively
	const TOKENS = (r) => [ { "1": r[0], "2": r[1] } ];

	// values come in pairs of capital and small letter, for the function name and for the field
	const RANGES = [ { values: [ [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] ] } ];
	/* MACRO.HEADER 1 */
	/* MACRO.BODY 1 */
	get%1% () {
		return this.%2%;
	}

	/* MACRO.BODY 1 */
	/* MACRO.HEADER 2 */
	// this macro generates all setters for the x, y and z properties

	// the token function will receive a two-element array as defined in RANGES and
	// assign each of the two elements to the tokens 1 and 2 respectively
	const TOKENS = (r) => [ { "1": r[0], "2": r[1] } ];

	// values come in pairs of capital and small letter, for the function name and for the field
	const RANGES = [ { values: [ [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] ] } ];
	/* MACRO.HEADER 2 */
	/* MACRO.BODY 2 */
	set%1% (%2%) {
		this.%2% = %2%;
	}

	/* MACRO.BODY 2 */
	/* MACRO.HEADER 3 */
	// this macro generates "distance vector" functions for individual projections of the vector
	// the come in pairs, for instance distanceXY, distanceXZ etc

	// the token function will receive two arguments, for instance x and y;
	// if the two are the same, we return an empty array since we don't want to generate
	// functions such as distanceXX, distanceYY and distanceZZ
	const TOKENS = (i, j) => {
		if (i === j)
			return [];
		return [ { name: (i+j).toUpperCase(), from: i, to: j } ];
	};

	// values will be combined from the two equivalent vectors
	const RANGES = [ { values: [ "x", "y", "z" ] }, { values: [ "x", "y", "z" ] } ];
	/* MACRO.HEADER 3 */
	/* MACRO.BODY 3 */
	distance%name% {
		return Math.sqrt(this.%from% * this.%from% + this.%to% * this.%to%);
	}

	/* MACRO.BODY 3 */
}

module.exports = Vector;
