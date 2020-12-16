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
		if (template.username !== undefined)
			this.username = template.username;
		if (template.firstName !== undefined)
			this.firstName = template.firstName;
		if (template.lastName !== undefined)
			this.lastName = template.lastName;
		if (template.title !== undefined)
			this.title = template.title;
		if (template.level !== undefined)
			this.level = template.level;
		if (template.address.street !== undefined)
			this.address.street = template.address.street;
		if (template.address.number !== undefined)
			this.address.number = template.address.number;
		if (template.address.doorNumber !== undefined)
			this.address.doorNumber = template.address.doorNumber;
		if (template.address.city !== undefined)
			this.address.city = template.address.city;
		if (template.address.country !== undefined)
			this.address.country = template.address.country;
		if (template.address.postcode !== undefined)
			this.address.postcode = template.address.postcode;
		if (template.address.details !== undefined)
			this.address.details = template.address.details;
		if (template.address.confirmed !== undefined)
			this.address.confirmed = template.address.confirmed;
		if (template.homePhone !== undefined)
			this.homePhone = template.homePhone;
		if (template.workPhone !== undefined)
			this.workPhone = template.workPhone;
		if (template.email !== undefined)
			this.email = template.email;
		if (template.active !== undefined)
			this.active = template.active;
	}

	setUsername (username) {
		assert.equal(typeof(username), "string");
		this.username = username;
	}

	getUsername () {
		return this.username;
	}

	setFirstName (firstName) {
		assert.equal(typeof(firstName), "string");
		this.firstName = firstName;
	}

	getFirstName () {
		return this.firstName;
	}

	setLastName (lastName) {
		assert.equal(typeof(lastName), "string");
		this.lastName = lastName;
	}

	getLastName () {
		return this.lastName;
	}

	setTitle (title) {
		assert.equal(typeof(title), "string");
		this.title = title;
	}

	getTitle () {
		return this.title;
	}

	setLevel (level) {
		assert.equal(typeof(level), "number");
		this.level = level;
	}

	getLevel () {
		return this.level;
	}

	setAddress (address) {
		assert.equal(typeof(address), "object");
		this.address = address;
	}

	getAddress () {
		return this.address;
	}

	setAddressStreet (street) {
		assert.equal(typeof(street), "string");
		this.address.street = street;
	}

	getAddressStreet () {
		return this.address.street;
	}

	setAddressNumber (number) {
		assert.equal(typeof(number), "string");
		this.address.number = number;
	}

	getAddressNumber () {
		return this.address.number;
	}

	setAddressDoorNumber (doorNumber) {
		assert.equal(typeof(doorNumber), "string");
		this.address.doorNumber = doorNumber;
	}

	getAddressDoorNumber () {
		return this.address.doorNumber;
	}

	setAddressCity (city) {
		assert.equal(typeof(city), "string");
		this.address.city = city;
	}

	getAddressCity () {
		return this.address.city;
	}

	setAddressCountry (country) {
		assert.equal(typeof(country), "string");
		this.address.country = country;
	}

	getAddressCountry () {
		return this.address.country;
	}

	setAddressPostcode (postcode) {
		assert.equal(typeof(postcode), "string");
		this.address.postcode = postcode;
	}

	getAddressPostcode () {
		return this.address.postcode;
	}

	setAddressDetails (details) {
		assert.equal(typeof(details), "string");
		this.address.details = details;
	}

	getAddressDetails () {
		return this.address.details;
	}

	setAddressConfirmed (confirmed) {
		assert.equal(typeof(confirmed), "boolean");
		this.address.confirmed = confirmed;
	}

	isAddressConfirmed () {
		return this.address.confirmed;
	}

	setHomePhone (homePhone) {
		assert.equal(typeof(homePhone), "string");
		this.homePhone = homePhone;
	}

	getHomePhone () {
		return this.homePhone;
	}

	setWorkPhone (workPhone) {
		assert.equal(typeof(workPhone), "string");
		this.workPhone = workPhone;
	}

	getWorkPhone () {
		return this.workPhone;
	}

	setEmail (email) {
		assert.equal(typeof(email), "string");
		this.email = email;
	}

	getEmail () {
		return this.email;
	}

	setActive (active) {
		assert.equal(typeof(active), "boolean");
		this.active = active;
	}

	isActive () {
		return this.active;
	}

}

module.exports = Customer;
