const fs = require("fs");
const path = require("path");

class Vector {

	constructor (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getX () {
		return this.x;
	}

	getY () {
		return this.y;
	}

	getZ () {
		return this.z;
	}

	setX (x) {
		this.x = x;
	}

	setY (y) {
		this.y = y;
	}

	setZ (z) {
		this.z = z;
	}

	distanceXY {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	distanceXZ {
		return Math.sqrt(this.x * this.x + this.z * this.z);
	}

	distanceYX {
		return Math.sqrt(this.y * this.y + this.x * this.x);
	}

	distanceYZ {
		return Math.sqrt(this.y * this.y + this.z * this.z);
	}

	distanceZX {
		return Math.sqrt(this.z * this.z + this.x * this.x);
	}

	distanceZY {
		return Math.sqrt(this.z * this.z + this.y * this.y);
	}

}

module.exports = Vector;
