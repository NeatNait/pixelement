(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {

      this.music = this.game.add.audio('loop1',1,true);

      this.music.play('',0,1,true);

      this.fx = [];

      this.fx.dead = this.game.add.audio('dead');
      this.fx.points = this.game.add.audio('points');
      this.fx.points.addMarker('point', 0, 0.5);

      this.game.points = 0;

      this.velocity = 250;
      
      /*
      var x = this.game.width / 2 - 200,
          y = this.game.height / 2;
          */

      this.game.world.setBounds(0, 0, 1000000, this.game.height);

      this.player = this.add.sprite(0, this.game.height, 'player');

      this.game.physics.startSystem(Phaser.Physics.P2JS);
     
      //  Turn on impact events for the world, without this we get no collision callbacks
      this.game.physics.p2.setImpactEvents(true);

      //  Create our collision groups. One for the player, one for the boxes
      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.boxCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.platformCollisionGroup = this.game.physics.p2.createCollisionGroup();

      //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
      //  (which we do) - what this does is adjust the bounds to use its own collision group.
      this.game.physics.p2.updateBoundsCollisionGroup();

      // Create some platforms
      this.platforms = this.game.add.group();
      this.platforms.enableBody = true;
      this.platforms.physicsBodyType = Phaser.Physics.P2JS;
      
      for(var i=0; i<7; i++){
        var platform = this.platforms.create(-300,this.game.world.height-10, 'platform');
        platform.body.setRectangle(180,40);        
        platform.body.kinematic = true;
        platform.body.setCollisionGroup(this.platformCollisionGroup);
        platform.body.collides([this.boxCollisionGroup, this.playerCollisionGroup]);
        platform.scale.set(1,0.6);
      }

      this.boxes = this.game.add.group();
      this.boxes.enableBody = true;
      this.boxes.physicsBodyType = Phaser.Physics.P2JS;

      for (i = 0; i < 60; i++){

          var color = 'blue',
              beatedBy = [color, 'green'];

          if(i%2){
            color = 'red';
            beatedBy = [color, 'blue'];
          }
          else if(i%3){
            color = 'green';
            beatedBy = [color, 'red'];
          }


          var box = this.boxes.create(-5000, this.game.height, color);
          //var box = this.boxes.create(this.game.world.randomX, this.game.world.randomY, 'blue');
          box.body.setRectangle(40, 40);

          box.power = color;
          box.beatedBy = beatedBy;

          box.scale.set(0.5);

          //  Tell the box to use the boxCollisionGroup 
          box.body.setCollisionGroup(this.boxCollisionGroup);

          //  boxes will collide against themselves and the player
          //  If you don't set this they'll not collide with anything.
          //  The first parameter is either an array or a single collision group.
          box.body.collides([this.boxCollisionGroup, this.playerCollisionGroup, this.platformCollisionGroup]);
      }

      //set attribute reward of every enemy
      this.boxes.setAll('reward', this.game.config.ENEMY_REWARD, false, false, 0, true);
      
      this.player.anchor.setTo(0.5, 0.5);
      //this.player.scale = new Phaser.Point(0.5, 0.5);
      this.player.scale.set(0.75);

      //  Enable if for physics. This creates a default rectangular body.
      this.game.physics.p2.enable(this.player, false);

      this.player.body.data.gravityScale = 2;
      //this.player.body.rotateLeft(200);


      this.player.body.setRectangle(60, 60);
      //ship.body.fixedRotation = true;

      //  Set the ships collision group
      this.player.body.setCollisionGroup(this.playerCollisionGroup);

      //  The ship will collide with the boxes, and when it strikes one the hitbox callback will fire, causing it to alpha out a bit
      //  When boxes collide with each other, nothing happens to them.
      this.player.body.collides(this.boxCollisionGroup, this.hitEnemy, this);
      this.player.body.collides(this.platformCollisionGroup);

      this.player.powers = ['red','blue', 'green'];
      this.player.power = this.player.powers[0];
     


      this.player.body.velocity.x = 250;
      //this.player.body.velocity.setTo(150, 0);
      this.input.onDown.add(this.onMouseDown, this);
      //this.input.keyboard.addCallbacks(this, this.onInputDown);
      
      //this.input.keyboard.onUpCallback = this.onInput
      
      this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      //this.game.camera.follow(this.player);

      this.game.physics.p2.gravity.y = 500;
      //this.game.physics.p2.restitution = 0.8;

      //  Make things a bit more bouncey
      //this.game.physics.p2.defaultRestitution = 0.8;


      //  Modify a few body properties
      //this.player.body.setZeroDamping();
      //this.player.body.fixedRotation = true;

      this.nextEnemy = 0;
      this.nextPlatform = 0;
    },

    update: function () {
      //this.player.rotation += 0.01;
      //this.player.body.rotateRight(50);
      //this.player.body.velocity.x = 350;
      //this.player.body.velocity.x = 250;
      this.player.body.velocity.x = this.velocity;
      this.camera.position = new Phaser.Point(this.player.position.x - 150, this.player.position.y - 150);
      //this.player.body.thrust(50);
      //this.player.body.rotateLeft(20);

      if (this.jumpKey.isDown){
        this.onInputDown();
      }

      this.addEnemy();
      this.addPlatform();      

    },

    onMouseDown: function () {

      var i = this.player.powers.indexOf(this.player.power);

      i++;
      
      if(this.player.powers[i]){
        this.player.power = this.player.powers[i];
      }
      else{
        this.player.power = this.player.powers[0];
      }

      this.player.loadTexture(this.player.power);      

    },

    onInputDown: function () {
      //this.game.state.start('menu');
      //this.player.body.velocity.y = -350;
      this.player.body.velocity.y = -450;
    },

    hitEnemy: function (body1, body2) {
      //  body1 is the player (as it's the body that owns the callback)
      //  body2 is the body it impacted with, in this case our box
      //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
      var enemy = body2.sprite,
          player = body1.sprite;
      //enemy.alpha -= 0.1;

      //enemy kills player
      if(!~enemy.beatedBy.indexOf(player.power)){
        player.kill();
        this.game.state.start('menu');
        this.fx.dead.play();
        this.music.stop();
      }
      //player kills enemy
      else{
        this.game.fx.play('touch' + this.game.rnd.integerInRange(0, 3));

        var tween = this.game.add.tween(enemy).to( { alpha: 0.5 }, 200, Phaser.Easing.Bounce.Out, true);
        tween.onComplete.add(function() { 
          enemy.kill();
        }, this);
        this.game.points += enemy.reward;                
        this.setDifficulty();
      }
      //console.log(enemy.power);
      //console.log('player' + body1.sprite.power);      
    },

    addEnemy: function () {

      var enemyRate = 500 - (this.game.points * 5 > 450 ? 450 : this.game.points * 5)  ;
      //if (game.time.now > nextEnemy && bullets.countDead() > 0){
      if (this.game.time.now > this.nextEnemy){
        this.nextEnemy = this.game.time.now + enemyRate;
        //var box = this.boxes.getFirstAlive();
        
        var box = this.boxes.next();

        if(!box){
          return;
        }

        box.reset(this.player.x + this.game.width + 100, this.game.rnd.integerInRange(0, this.game.height));
        box.alpha = 1;

      }

    },

    addPlatform: function () {

      var platformRate = 800 * this.game.rnd.integerInRange(1, 2);
      
      if (this.game.time.now > this.nextPlatform){
        this.nextPlatform = this.game.time.now + platformRate;              
        
        var platform = this.platforms.next();

        if(!platform){          
          return;
        }

        platform.reset(this.player.x + this.game.width + 100, this.game.rnd.integerInRange(50, this.game.height-50));
        
      }
    },

    setDifficulty: function () {   
      this.velocity = 250 + (this.game.points * 3);
    },

    render: function (){
      this.game.debug.cameraInfo(this.game.camera, 32, 32);
      this.game.debug.spriteCoords(this.player, 32, 500);
     // this.game.debug.body(this.player);
    }

  };

  window['testaculo'] = window['testaculo'] || {};
  window['testaculo'].Game = Game;

}());
