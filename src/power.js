
// Power class
// ---------- 
var Power = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Power";
  this.weakness = [];

  this.texture = "default.png"

}

// In the future each power will have an special action
Power.prototype.specialAction = function (){
    return 0;
}




// Check whether the power being questioned is the winner or the
// Power p passed as argument
// returns the winner power

Power.prototype.checkWinner = function (p){

  //If the opponent is not a power the first wins
  if (p instanceof Power == false)
    return this;


  //If theres no weakness the first wins
  if (this.weakness.length == 0)
    return this;
  
  if (p instanceof this.weakness[0])
    return false;
  else
    return true;
}


//RedPower
// ----------
var RedPower = function(opts){

  Power.call(this, opts);
  
  this.name = "Red Pixel";
  
  this.weakness.push(BluePower);
  this.texture = "r7.png"

}

// Inherit Power
RedPower.prototype = new Power();

// correct the constructor pointer because it points to Power
RedPower.prototype.constructor = RedPower;



RedPower.prototype.especialAction = function (){
  return Power.prototype.specialAction.call(this) + " red";
}


// GreenPower
// ----------
var GreenPower = function(opts){

  Power.call(this, opts);
  this.name = "Green Pixel";

  
  this.weakness.push(RedPower);
  this.texture = "g7.png"

}

// Inherit Power
GreenPower.prototype = new Power();

// Correct the constructor pointer because it points to Power
GreenPower.prototype.constructor = GreenPower;


GreenPower.prototype.especialAction = function (){
    return "green";
}





// BluePower
// ----------
var BluePower = function(opts){
	
	Power.call(this, opts);
	this.name = "Blue Pixel";


	this.weakness.push(GreenPower);
	this.texture = "b6.png"

}

// Inherit Power
BluePower.prototype = new Power();

// Correct the constructor pointer because it points to Power
BluePower.prototype.constructor = BluePower;


BluePower.prototype.especialAction = function (){
    return "blue";
}





var Floor = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Floor";
  

}



// Power Up
// ----------
var PowerUp = function(opts){

  Power.call(this, opts);
  this.name = "Power Up";

  
  //this.weakness.push(RedPower);
  this.texture = "w1.png"

}

// inherit Power
PowerUp.prototype = new Power();

// correct the constructor pointer because it points to Power
PowerUp.prototype.constructor = PowerUp;


PowerUp.prototype.especialAction = function (){
    return "powerup";
}



/*TODO get powers inside of enemies*/
// Enemy
// ----------
var Enemy = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Enemy";
  this.power = new GreenPower();

}