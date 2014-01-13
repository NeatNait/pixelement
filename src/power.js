
var Power = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Power";
  this.weakness = [];

  this.texture = "default.png"

}

Power.prototype.specialAction = function (){
    return 0;
}



/*
 Check whether the power being questioned is the winner or the
 Power p passed as argument
 
 returns the power winner

*/
Power.prototype.checkWinner = function (p){

  //if the opponent is not a power the first wins
  if (p instanceof Power == false)
    return this;


  //if theres no weakness the first wins
  if (this.weakness.length == 0)
    return this;


  //return !(a instanceof this.weakness[0]);
  
  if (p instanceof this.weakness[0])
    return false;
  else
    return true;
}


/**

REDPOWER

**/
var RedPower = function(opts){
 // console.log(opts);
  Power.call(this, opts);
  
  this.name = "Red Pixel";
  
  this.weakness.push(BluePower);
  this.texture = "r7.png"

}

// inherit Power
RedPower.prototype = new Power();

// correct the constructor pointer because it points to Power
RedPower.prototype.constructor = RedPower;



RedPower.prototype.especialAction = function (){
  return Power.prototype.specialAction.call(this) + " red";
}




/**

GREENPOWER

**/
var GreenPower = function(opts){

  Power.call(this, opts);
  this.name = "Green Pixel";

  
  this.weakness.push(RedPower);
  this.texture = "g7.png"

}

// inherit Power
GreenPower.prototype = new Power();

// correct the constructor pointer because it points to Power
GreenPower.prototype.constructor = GreenPower;


GreenPower.prototype.especialAction = function (){
    return "green";
}





/**

BLUEPOWER

**/
var BluePower = function(opts){
	
	Power.call(this, opts);
	this.name = "Blue Pixel";


	this.weakness.push(GreenPower);
	this.texture = "b6.png"

}

// inherit Power
BluePower.prototype = new Power();

// correct the constructor pointer because it points to Power
BluePower.prototype.constructor = BluePower;


BluePower.prototype.especialAction = function (){
    return "blue";
}





var Floor = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Floor";
  

}


/*var PowerUp = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "PowerUp";
  

}*7



/**

POWERUP

**/
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



//TODO get powers inside of enemys
var Enemy = function(opts){

  if (opts === undefined)
    opts = [];
  
  this.name = opts.name || "Enemy";
  this.power = new GreenPower();

}