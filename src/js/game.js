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
      //  Turn on impact events for the world, without this we get no collision callbacks
      this.game.physics.p2.setImpactEvents(true);
      //this.game.physics.enable(this.player, Phaser.Physics.ARCADE);


      //  Create our collision groups. One for the player, one for the boxes
      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.boxCollisionGroup = this.game.physics.p2.createCollisionGroup();

      //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
      //  (which we do) - what this does is adjust the bounds to use its own collision group.
      this.game.physics.p2.updateBoundsCollisionGroup();

      this.boxes = this.game.add.group();
      this.boxes.enableBody = true;
      this.boxes.physicsBodyType = Phaser.Physics.P2JS;

      for (var i = 0; i < 60; i++){
          var box = this.boxes.create(200, 100, 'blue');
          //var box = this.boxes.create(this.game.world.randomX, this.game.world.randomY, 'blue');
          box.body.setRectangle(40, 40);

          box.scale.set(0.5);

          //  Tell the box to use the boxCollisionGroup 
          box.body.setCollisionGroup(this.boxCollisionGroup);

          //  boxes will collide against themselves and the player
          //  If you don't set this they'll not collide with anything.
          //  The first parameter is either an array or a single collision group.
          box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
      }

      this.player.anchor.setTo(0.5, 0.5);
      //this.player.scale = new Phaser.Point(0.5, 0.5);
      this.player.scale.set(0.5);

      this.game.physics.p2.enable(this.player, true);
      this.player.body.setRectangle(60, 60);
      //this.player.body.setRectangle(this.player.scale.x, this.player.scale.y); 
      //ship.body.fixedRotation = true;
      //  Set the ships collision group
      this.player.body.setCollisionGroup(this.playerCollisionGroup);

      //  The ship will collide with the boxes, and when it strikes one the hitbox callback will fire, causing it to alpha out a bit
      //  When boxes collide with each other, nothing happens to them.
      this.player.body.collides(this.boxCollisionGroup, this.hitEnemy, this);



     


      //this.player.body.velocity.x = 150;
      //this.player.body.velocity.setTo(150, 0);
      this.input.onDown.add(this.onInputDown, this);
      //this.input.keyboard.addCallbacks(this, this.onInputDown);
      
      //this.input.keyboard.onUpCallback = this.onInput
      
      this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);

      //this.game.camera.follow(this.player);

      this.game.physics.p2.gravity.y = 500;
      //this.game.physics.p2.restitution = 0.8;

      //  Make things a bit more bouncey
      //this.game.physics.p2.defaultRestitution = 0.8;

      //  Enable if for physics. This creates a default rectangular body.
      this.game.physics.p2.enable(this.player, true);

      //this.player.body.rotateLeft(20);

      //this.player.rotation = 0.5;
      //  Modify a few body properties
      //this.player.body.setZeroDamping();
      //this.player.body.fixedRotation = true;

      //this.game.plugins.Splatter = this.game.plugins.add(Phaser.Plugin.Splatter);
      //this.game.plugins.Splatter.addSprite(this.add.sprite(x, y, 'splatter'));

      this.nextEnemy = 0;
    },

    update: function () {
      //this.player.rotation += 0.01;
      //this.player.body.rotateRight(50);
      this.player.body.velocity.x = 350;
      this.camera.position = new Phaser.Point(this.player.position.x - 150, this.player.position.y - 150);
      //this.player.body.thrust(50);
      //this.player.body.rotateLeft(20);

      if (this.jumpKey.isDown){
        this.onInputDown();
      }

      this.addEnemy();


    },

    onInputDown: function () {
      //this.game.state.start('menu');
      this.player.body.velocity.y = -350;
    },

    hitEnemy: function (body1, body2) {
      //  body1 is the player (as it's the body that owns the callback)
      //  body2 is the body it impacted with, in this case our box
      //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
      //body2.sprite.alpha -= 0.1;
    },

    addEnemy: function () {

      var enemyRate = 50;
      //if (game.time.now > nextEnemy && bullets.countDead() > 0){
      if (this.game.time.now > this.nextEnemy){
        this.nextEnemy = this.game.time.now + enemyRate;
        //var box = this.boxes.getFirstAlive();
        var box = this.boxes.next();

        if(!box){
          return;
        }

        box.reset(this.player.x + this.game.width + 10, this.game.rnd.integerInRange(0, this.game.height));
      }

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