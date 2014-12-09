(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(320, 240, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.image('player', 'assets/red.png');
      this.load.image('blue', 'assets/blue.png');
      this.load.image('red', 'assets/red.png');
      this.load.image('green', 'assets/green.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');


      this.load.audio('touch', 'assets/audio/touch.mp3');

      //  Here we set-up our audio sprite
      this.game.fx = this.game.add.audio('touch');
      this.game.fx.allowMultiple = true;

      //  And this defines the markers.
      //this.game.fx.addMarker(name, start, end, volume)
      this.game.fx.addMarker('touch0', 0.000, 0.923, 0.1);
      this.game.fx.addMarker('touch1', 0.923, 1.866, 0.1);
      this.game.fx.addMarker('touch2', 1.866, 2.791, 0.1);
      this.game.fx.addMarker('touch3', 2.791, 3.725, 0.1);

    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['testaculo'] = window['testaculo'] || {};
  window['testaculo'].Preloader = Preloader;

}());
