const fs = require("fs");
const path = require("path");

class Vector {

	constructor (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/* MACRO.BODY */
	get%1% () {
		return this.%2%;
	}

	/* MACRO.BODY */
	/* MACRO.HEADER 2 */
	const TOKENS = (r) => { "1": r[0], "2": r[1] };
	const RANGES = [ { values: [ "X", "x" ], [ "Y", "y" ], [ "Z", "z" ] } ];
	/* MACRO.HEADER 2 */
	/* MACRO.BODY 2 */
	set%1% (%2%) {
		this.%2% = %2%;
	}

	/* MACRO.BODY 2 */
}

module.exports = Vector;
