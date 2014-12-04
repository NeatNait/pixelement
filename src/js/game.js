(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2 - 200
        , y = this.game.height / 2;

      this.game.world.setBounds(0, 0, 1000000, this.game.height);

      this.player = this.add.sprite(0, 0, 'player');
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      //this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

      this.player.anchor.setTo(0.5, 0.5);
      this.player.scale = new Phaser.Point(0.5, 0.5);



      //this.player.body.velocity.x = 150;
      //this.player.body.velocity.setTo(150, 0);
      this.input.onDown.add(this.onInputDown, this);
      //this.game.camera.follow(this.player);

      this.game.physics.p2.gravity.y = 500;
      //this.game.physics.p2.restitution = 0.8;

      //  Make things a bit more bouncey
      //this.game.physics.p2.defaultRestitution = 0.8;

      

      //  Enable if for physics. This creates a default rectangular body.
      this.game.physics.p2.enable(this.player);

      //this.player.body.rotateLeft(20);

//this.player.rotation = 0.5;
      //  Modify a few body properties
      //this.player.body.setZeroDamping();
      //this.player.body.fixedRotation = true;

      //this.game.plugins.Splatter = this.game.plugins.add(Phaser.Plugin.Splatter);
      //this.game.plugins.Splatter.addSprite(this.add.sprite(x, y, 'splatter'));
    },

    update: function () {
      //this.player.rotation += 0.01;
      this.player.body.rotateRight(50);
      this.player.body.velocity.x = 350;
      this.camera.position = new Phaser.Point(this.player.position.x - 150, this.player.position.y - 150);
      //this.player.body.thrust(50);
      //this.player.body.rotateLeft(20);

    },

    onInputDown: function () {
      //this.game.state.start('menu');
      this.player.body.velocity.y = -350;
    },

    render: function (){
      this.game.debug.cameraInfo(this.game.camera, 32, 32);
      this.game.debug.spriteCoords(this.player, 32, 500);
      this.game.debug.body(this.player);
    }

  };

  window['testaculo'] = window['testaculo'] || {};
  window['testaculo'].Game = Game;

}());
