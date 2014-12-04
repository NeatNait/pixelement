/**
* A Sample Plugin demonstrating how to hook into the Phaser plugin system.
*/
Phaser.Plugin.Splatter = function (game, parent) {

  Phaser.Plugin.call(this, game, parent);

  this.sprite = null;
  //this.addSprite()

  this.maxTime = 100;
  
};

//  Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.Splatter.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Splatter.prototype.constructor = Phaser.Plugin.Splatter;

/**
* Add a Sprite reference to this Plugin.
* All this plugin does is move the Sprite across the screen slowly.
* @type {Phaser.Sprite}
*/
Phaser.Plugin.Splatter.prototype.addSprite = function (sprite) {

  this.sprite = sprite;

};

/**
* This is run when the plugins update during the core game loop.
*/
Phaser.Plugin.Splatter.prototype.update = function () {

  if (!this.sprite){
    return;
  }

  if(this.maxTime < 0){
    this.sprite.kill();
  }
  else{
    this.maxTime--;
  }

};

(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {


    
    preload: function () {
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.game.input.maxPointers = 1;

      if (this.game.device.desktop) {
        this.game.scale.pageAlignHorizontally = true;
      } else {
        this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth =  480;
        this.game.scale.minHeight = 260;
        this.game.scale.maxWidth = 640;
        this.game.scale.maxHeight = 480;
        this.game.scale.forceLandscape = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.setScreenSize(true);
      }
      this.game.state.start('preloader');
    }
  };

  window['testaculo'] = window['testaculo'] || {};
  window['testaculo'].Boot = Boot;

}());

