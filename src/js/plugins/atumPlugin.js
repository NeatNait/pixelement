/**
* ATUM
* automatic or awesome timed unit manager
*/

Phaser.Plugin.AtumPlugin = function (game, parent) {

  Phaser.Plugin.call(this, game, parent);

  //default values
  this.settings = {
    unitsPerTick: 2,
    timeUpdateRate: Phaser.Timer.SECOND * 5,
    //timeUpdateRate = Phaser.Timer.MINUTE * 10,
    maxUnits: 1000,
    localStoragePrefix: 'com.neatnait.pixelement.'
  };

  this.init();

};

//  Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.AtumPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.AtumPlugin.prototype.constructor = Phaser.Plugin.AtumPlugin;


Phaser.Plugin.AtumPlugin.prototype.init = function (config) {
  this.settings = Phaser.Utils.extend(false, this.settings, config);

  var units = parseInt(this.getKey('units'));
  this.units = !isNaN(units) ? units : this.settings.maxUnits;

  if(!this.getLastUpdate()){
    this.setLastUpdate();
  }
};

/*Phaser.Plugin.AtumPlugin.prototype.setup = function (config) {
  this.settings = Phaser.Utils.extend(false, this.settings, config);
};*/

Phaser.Plugin.AtumPlugin.prototype.getUnits = function () {
  return this.units;
};

Phaser.Plugin.AtumPlugin.prototype.addUnits = function (qty) {
  var units = this.units + qty;
  this.units = (units <= this.settings.maxUnits) ? units : this.settings.maxUnits;
  this.setKey('units', this.units);
  console.log(this.units);
};

Phaser.Plugin.AtumPlugin.prototype.removeUnits = function (qty) {
  var units = this.units - qty;
  this.units = (units > 0) ? units : 0;
  console.log(this.units);
};

Phaser.Plugin.AtumPlugin.prototype.removeLive = function () {
  this.removeUnits(1);
};

/*Phaser.Plugin.AtumPlugin.prototype.updateUnits = function () {
  var units = this.units + this.settings.unitsPerTick;
  this.units = (units <= this.settings.maxUnits) ? units : this.settings.maxUnits;
  console.log(this);
  console.log(this.units);
  this.setLastUpdate();
};*/

Phaser.Plugin.AtumPlugin.prototype.updateUnits = function () {
  var ticks = Math.floor(this.timeElapsed() / this.settings.timeUpdateRate);
  if(ticks < 1) return;
  
  this.addUnits(ticks * this.settings.unitsPerTick);
  console.log('ticks', ticks);
  this.setLastUpdate();
  return this.units;
};

Phaser.Plugin.AtumPlugin.prototype.timeElapsed = function () {
  return new Date().getTime() - this.getLastUpdate();
};

Phaser.Plugin.AtumPlugin.prototype.getLastUpdate = function () {
  this.lastUpdate = this.getKey('lastUpdate');
  return this.lastUpdate;
};

Phaser.Plugin.AtumPlugin.prototype.setLastUpdate = function () {
  this.lastUpdate = new Date().getTime();
  this.setKey('lastUpdate', this.lastUpdate);
};

/*
  localStorage wrapper for easy change manamegent
*/
Phaser.Plugin.AtumPlugin.prototype.setKey = function (key, value) {
  return localStorage.setItem(this.settings.localStoragePrefix + key, value);
};

Phaser.Plugin.AtumPlugin.prototype.getKey = function (key) {
  return localStorage.getItem(this.settings.localStoragePrefix + key);
};


Phaser.Plugin.AtumPlugin.prototype.run = function () {
  //game.time.events.loop(Phaser.Timer.MINUTE * 30, updateUnits, this);
  //this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.updateUnits, this);
  console.log('go');
};

/**
* This is run when the plugins update during the core game loop.
*/
/*Phaser.Plugin.AtumPlugin.prototype.update = function () {
};*/
