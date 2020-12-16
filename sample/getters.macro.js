const assert = require("assert");

/*
 * In this example class, we are autogenerating getters and setters
 * for a class with many properties based on the constructor properties
 * We'll need to execute the code in this file before macro replacement,
 * so all macros will be in "open comment" format as to not interfere with
 * the class code itself.
 */

class Customer {

	/*
	 * We initialize all values so we can infer types from them
	 */
	constructor (template) {
		this.username = "";
		this.firstName = "";
		this.lastName = "";
		this.title = "";
		this.level = -1;
		this.address = {
			street: "",
			number: "",
			doorNumber: "",
			city: "",
			country: "",
			postcode: "",
			details: "",
			confirmed: false
		};
		this.homePhone = "";
		this.workPhone = "";
		this.email = "";
		this.active = false;

		if (template)
			this.applyTemplate(template);
	}

	/*
	 * Apply a template by copying all values defined in the template
	 */
	applyTemplate (template) {
		/* MACRO.HEADER 1

		// we want to autogenerate the part which copies existing properties from
		// template to this object; for this we need an instance of the object to
		// determine the property list and their respective types
		const Customer = require(path.join(__dirname, "./getters.macro.js"));
		const instance = new Customer();
		const RANGES = [ { keys: instance } ];

		// in the tokens function, we want to generate the condition for each field
		const TOKENS = (r) => {
			let field = instance[r];
			if (typeof(field) === "object") {
				let ret = [];
				for (let i in field)
					ret.push({
						condition: "template." + r + "." + i + " !== undefined",
						property: r + "." + i
					});
				return ret;
			}
			return [ {
				condition: "template." + r + " !== undefined",
				property: r
			} ];
		};
		/* MACRO.BODY 1
		if (%condition%)
			this.%property% = template.%property%;
		*/
	}

	/* MACRO.HEADER 2
	
	// we want to autogenerte the getters and setters for all properties,
	// as well as "deep" getters and setters for nested properties (1 level deep)
	// for this we need an instance of the object to determine the property list and
	// their respective types
	const Customer = require(path.join(__dirname, "./getters.macro.js"));
	const instance = new Customer();
	const RANGES = [ { keys: instance } ];

	// in the tokens function, we want to generate the capitalized name of the property
	// for the camelcase function, a short name for the argument, the type (from instance)
	// and a path to the property for read and write access
	// as a bonus, the getters for boolean values should be named isSomething instead of getSomething
	const TOKENS = (r) => {
		let field = instance[r];
		let type = typeof(field);
		let ret = [ {
			Property: r.slice(0, 1).toUpperCase() + r.slice(1),
			shortName: r,
			type: type,
			property: r,
			get: type === "boolean" ? "is" : "get"
		} ];
		if (type === "object") {
			for (let i in field)
				ret.push({
					Property: r.slice(0, 1).toUpperCase() + r.slice(1) + i.slice(0, 1).toUpperCase() + i.slice(1),
					shortName: i,
					type: typeof(field[i]),
					property: r + "." + i,
					get: typeof(field[i]) === "boolean" ? "is" : "get"
				});
		}
		return ret;
	};
	/* MACRO.BODY 2
	set%Property% (%shortName%) {
		assert.equal(typeof(%shortName%), "%type%");
		this.%property% = %shortName%;
	}

	%get%%Property% () {
		return this.%property%;
	}

	*/
}

module.exports = Customer;
