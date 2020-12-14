const fs = require("fs");
const path = require("path");

class Vector {

	constructor (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/* MACRO.HEADER  */
	const TOKENS = (r) => { "1": r[0], "2": r[1] };
	const RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];
	/* MACRO.HEADER  */
	/* MACRO.BODY  */
	get%1% () {
		return this.%2%;
	}

	/* MACRO.BODY */
	/* MACRO.HEADER */
	const TOKENS = (r) => { "1": r[0], "2": r[1] };
	const RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];
	/* MACRO.BODY */
	set%1% (%2%) {
		this.%2% = %2%;
	}

	/* MACRO.BODY */
}

module.exports = Vector;
