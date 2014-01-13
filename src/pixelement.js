//Representation of the character on the game physics and rendering motors
PixElement = function(){
	
	this.body = null;
	this.representation = null;

	this.powers = [];


	// Done like this in case we want to add more powers
	this.powers.push(new RedPower({name:"red"}));
	this.powers.push(new GreenPower());
	this.powers.push(new BluePower());

	// Set actual power
	this.indexActualPower = 0;

	this.actualPower = this.powers[this.indexActualPower];

}

// Select next power of the array
PixElement.prototype.nextPower = function() {
	
	this.indexActualPower++;


	if(this.indexActualPower > this.powers.length-1)
		this.indexActualPower = 0;

	return this.getActualPower();

};

// Get actual power
PixElement.prototype.getActualPower = function() {
	return this.powers[this.indexActualPower];
}

// Set body
PixElement.prototype.setBody = function(body) {
	return this.body = body;
}

// Set representation
PixElement.prototype.setRepresentation = function(r) {
	return this.representation = r;
}