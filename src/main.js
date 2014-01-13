


var jump = false,
    boost = false,
    bun = false,
    muerto = false;
    lives = 100,
    game = null,
    points = 0,
    shield = false;



var params = {
    difficultyFactor: 15,
    difficulty: 1,
    fps:0
};


var sound = new SoundModule({onLoadEnd: onSoundLoaded});



const loader = new PIXI.AssetLoader(["assets/b6.png",
                                     "assets/g7.png",
                                     "assets/r7.png",
                                     "assets/w1.png",
                                     "assets/shields/b6.png",
                                     "assets/shields/g7.png",
                                     "assets/shields/r7.png",
                                     "assets/floor2.png"]);



function onSoundLoaded (argument) {

    // use callback
    loader.onComplete = onAssetsLoaded;
     
    loader.load();

}
    
function onAssetsLoaded (argument) {

    start();
}


function restart (argument) {
    $("canvas").remove();
    muerto = false;
    loader = new PIXI.AssetLoader(["assets/b6.png",
                                     "assets/g7.png",
                                     "assets/r7.png",
                                     "assets/shields/b6.png",
                                     "assets/shields/g7.png",
                                     "assets/shields/r7.png",
                                     "assets/floor2.png"]);
    loader.onComplete = onAssetsLoaded;
    loader.load();
}

function start(){



    var bU = new Box2DUtils(),
        pU = new PixiUtils();

    //const STAGE_WIDTH = window.innerWidth, STAGE_HEIGHT = window.innerHeight;
    const STAGE_WIDTH = 640, STAGE_HEIGHT = 480;
    const METER = 23.4;
    const MOVEX = true;
    const CHAR_OFFSET = 3*METER;
    const DEBUG = true;



    var world = new PixelWorld();

    game = world;





    


    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = function(contact) {

        var collidingPixElement,
            collidingEnemy;

        if (muerto)
            return;


        var bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody(),
            bodyAUserData = bodyA.GetUserData(),
            bodyBUserData = bodyB.GetUserData();

        //console.log(bodyA.GetUserData());
        //console.log(bodyB.GetUserData());

        //FIXME insert BULLET MODE
        //ignore Floor
        if(bodyAUserData instanceof Floor || bodyBUserData instanceof Floor)
            return;


        //Ignore all but PixElement collisions
        //if (!(bodyAUserData instanceof PixElement) && (!(bodyBUserData instanceof PixElement)))
        //    return;


        //TODO get powers inside of enemys and check enemys power: something like enemy.getPower()

        //is PixElement the body A?
        if ((bodyAUserData instanceof PixElement) && ((bodyBUserData instanceof Power))) {

            collidingPixElement = bodyAUserData;
            collidingEnemy = bodyBUserData;

        }
        //is PixElement the body B?
        else if ((bodyBUserData instanceof PixElement) && ((bodyAUserData instanceof Power))) {
            
            collidingPixElement = bodyBUserData;
            collidingEnemy = bodyAUserData;
        
        }
        //if PixElement and a Power are not involved in the collision
        //we are not interested in the collision
        else {

            //console.log("power up");
            //shield = true;
            return;
        }

        if(collidingEnemy instanceof PowerUp){

            sound.shieldOn();

            shield = true;
            console.log("escudo");
            game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/shields/"+game.pixElement.getActualPower().texture));

        }



        muerto = ! collidingPixElement.getActualPower().checkWinner(collidingEnemy);


        if (muerto){

            if(shield){
                muerto = false;
                
                sound.shieldOff();
                

                game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+game.pixElement.getActualPower().texture));

                //get some extra time so you can really escape from the enemy
                setTimeout(function () {
                    console.log("fuera escudo");
                    shield = false;


                },500);
                return;
            }

            var meters = bodyA.GetPosition().x.toFixed(2);

            console.error("muerto a los " + meters + " metros");
            console.error("killed by an evil " + collidingEnemy.name );

            $(".result").html("Dead at " + meters + " meters\n"
                + "killed by an evil " + collidingEnemy.name + "\n"
                + "with a total of " + points + " points");
            console.log(world);

            if(points < 1)
                $(".result").append("<p>Achivement: dead at first pixel, uuugh meaned sight.</p>");

            $(".new-game").show();

              // save canvas image as data url (png format by default)

      /*var canvas = document.getElementById('game-canvas', {preserveDrawingBuffer: true});
      var dataURL = canvas.toDataURL();

      // set canvasImg image src to dataURL
      // so it can be saved as an image
      document.getElementById('canvasImg').src = dataURL;*/
            
            sound.endGame();


            localStorage.playedGames++;
            if(localStorage.points < points){

                actualPlayer = localStorage.player;

                var player = prompt("New Record! \nPlease enter your name",actualPlayer);

                localStorage.points = points;
                localStorage.player = player;
                localStorage.meters = meters;

                $(".result").append("<p>New Record: " +localStorage.player + ": " + localStorage.points + " points, "
        + localStorage.meters + " meters</p>");

            }


            emitEndGame(points, meters);

        }
        else{
            points++;


            sound.touch();

            $(".result").html(points);
        }


    }
    listener.EndContact = function(contact) {
        // //console.log(contact.GetFixtureA().GetBody().GetUserData());
        //console.log("EndContact");

    }
    listener.PostSolve = function(contact, impulse) {
        //console.log("PostSolve");
        
    }
    listener.PreSolve = function(contact, oldManifold) {
        //console.log("PreSolve");

    }
    world.world.SetContactListener(listener);

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3333333, true),
    containerDisplay = new PIXI.DisplayObjectContainer();
    
    stage.addChild(containerDisplay);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT, null);
    
    renderer.view.id="game-canvas";
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

console.log(document.getElementById("game-canvas"))
    
    requestAnimFrame( update );
    
    // create a texture from an image path
    //var texture = PIXI.Texture.fromImage("assets/bunny.png");
    // create a new Sprite using the texture
    //var bunny = new PIXI.Sprite(texture);
    
    //var bunny = pU.createBox("");

    //var bunny = new PixiBox();

    //bunny.createBox(containerDisplay);

    var texture = PIXI.Texture.fromImage("assets/b3.png");

    function addVel(body, parV){
        var b = body;
        var v = b.GetLinearVelocity();
    
        var vel = new b2Vec2(1,0);
        v.Add(vel);
        
        if(Math.abs(v.y) > this.max_ver_vel)
        {
            v.y = this.max_ver_vel * v.y/Math.abs(v.y);
        }
        
        if(Math.abs(v.x) > this.max_hor_vel)
        {
            v.x = this.max_hor_vel * v.x/Math.abs(v.x);
        }

        v.x = parV;
        
        b.SetLinearVelocity(v);
    };

    function addJump(body, jump) {

        var b = body;
        var v = b.GetLinearVelocity();
    
        var vel = new b2Vec2(1,0);
        v.Add(vel);
        
        if(Math.abs(v.y) > this.max_ver_vel)
        {
            v.y = this.max_ver_vel * v.y/Math.abs(v.y);
        }
        
        if(Math.abs(v.x) > this.max_hor_vel)
        {
            v.x = this.max_hor_vel * v.x/Math.abs(v.x);
        }

        v.y = jump;
        
        b.SetLinearVelocity(v);

    }



    function createFloor(x, y) {

        var suelo = world.createBox(x, y, 6, 1, {density : 5.0, type: b2Body.b2_staticBody, user_data: new Floor()});
        var texture = PIXI.Texture.fromImage("assets/floor2.png");

        sueloPixi = createBox(x, y, 3*METER/100, 2*METER/100, texture);

        world.actors.actors.push(suelo);
        world.actors.bodies.push(sueloPixi);
        containerDisplay.addChild(sueloPixi);
    }



    var boxScale = 1.6;

    function createObject(x, y, texture, userData) {

        texture = PIXI.Texture.fromImage("assets/"+texture);
        bunny = createBox(1, 5, boxScale*METER/100, boxScale*METER/100, texture);

        containerDisplay.addChild(bunny);


        var b = world.createBox(x+containerDisplay.position.x/METER * -1, y, boxScale, boxScale, {restitution : 0.0, user_data: userData});


        //addVel(b);

        world.actors.addActor(b);
        world.actors.addBody(bunny);

        return b;

    }

    var cont = 0,
        floorActualX = 2;



    var redtexture = "r7.png",
        bluetexture = "b6.png",
        greentexture = "g7.png";

    //Character
    var character = createObject(0.5, 5, bluetexture, game.pixElement);

    game.pixElement.setBody(character);
    var charPixi = world.actors.bodies[0];
    game.pixElement.setRepresentation(charPixi);


    game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+redtexture));

    boxScale = 1;

    createFloor(1, 0.5);
    createFloor(7, 0.5);


    createFloor(1, 20);
    createFloor(7, 20);

    var changeTexture = false;


    sound.startGame();
    
    var oldtime = new Date;
	function update(time)
	{

        //stats.begin();

        cont++;

        if(!muerto)

            requestAnimFrame(update);

        fps = 1000/(time-oldtime);
        oldtime = time;


        params.fps = fps;

/*

        if(bun && changeTexture != "bunny"){

            charPixi.setTexture(PIXI.Texture.fromImage("assets/"+redtexture));

            changeTexture = "bunny";
        }
        else if (!bun && changeTexture != "box"){
            charPixi.setTexture(PIXI.Texture.fromImage("assets/"+bluetexture));
            changeTexture = "box";

        }
*/



        if(cont%(Math.round(60/params.difficulty))==0){
        //if(cont%(60/8)==0){

            $(".difficulty").html(Math.ceil(params.difficulty/params.difficultyFactor) + " lvl");


            var texture = bluetexture,
                enemy = null;
            
            var rndTexture = Math.random();

            if( rndTexture < 0.3){
                texture = redtexture;
                enemy = new RedPower();

            }
            else if(rndTexture >= 0.3 && rndTexture < 0.6){
                texture = greentexture;
                enemy = new GreenPower();

            }
            else{
                enemy = new BluePower();
            }

            createObject(Math.random()*16 + 10, Math.random()*19 + 3, texture, enemy);

            if(Math.random()<0.1)
                createObject(Math.random()*16 + 10, Math.random()*19 + 3, "w1.png", new PowerUp());

        }


        //if((containerDisplay.position.x/METER + STAGE_WIDTH) < floorActualX*6){
        if(cont%(60/2)==0){
            createFloor(floorActualX*6+1, 0.5);
            createFloor(floorActualX*6+1, 20);
            createFloor(floorActualX*6+1, Math.random()*10+5);
            floorActualX++;
        }


        
        //world.world.Step(1 / 60,  3,  3);
        //world.world.ClearForces();
        
        world.world.Step(1 / fps*2,  8,  3);
        world.world.ClearForces();
        
        const n = world.actors.actors.length;
        for (var i = 0; i < n; i++)
        {
            var body  = world.actors.bodies[i];

            if(body === undefined) continue;

            
            var actor = world.actors.actors[i];
            
            //if(actor.GetUserData() instanceof Floor) continue;



            var position = actor.GetPosition();

            body.position.x = position.x * METER;
            body.position.y = (STAGE_HEIGHT - position.y * METER);
            body.rotation = -1 * actor.GetAngle();



        if( actor.GetUserData() != 0){}
            if(position.x + 10 < character.GetPosition().x){
                world.world.DestroyBody(actor);

                world.actors.actors.splice(i,1);
                world.actors.bodies.splice(i,1);
            }
        }
            

        var position = character.GetPosition();
        
        world.actors.bodies[0].alpha = 1;

        //set difficulty
        //difficulty = Math.round(position.x/params.difficultyFactor);
        params.difficulty = position.x/params.difficultyFactor + 3;


   
        //if(position.x*METER+containerDisplay.position.x < METER){
          //  addVel(character, 0.267*4);
        //}
        //else{
            addVel(character, 0.267*10);
        //}

        if (jump){
            addJump(character, 5);
            jump = false;
        }

        if(MOVEX)
            containerDisplay.position.x = position.x*METER*-1 + CHAR_OFFSET;


        //console.log(position.x*METER);
        //console.log(containerDisplay.position.x);
        
        renderer.render(stage);
        //stats.update();

	}




    //console.log(world);



//var world;


}
//)();








$(function(){

    $(".new-game").hide();


    $(document).keydown(function(e){
        
        //console.log(e.keyCode);
        
        //esc for reloading
        if(e.keyCode == 27){
            document.location.reload(true)
            return false;
        }
        
        //enter for changing color
        if(e.keyCode == 13){
            changeElement();
            return false;
        }

        //any key for jumping
        jump = true;

        return false;
    });
     
    $(document).keyup(function(e){
        //console.log(e.keyCode);

        jump = false;

        return false;
    });
    

    $(document).mousedown(function(e){
        changeElement();
    });




    if(localStorage.points === undefined){
        localStorage.points = 0;
        localStorage.meters = 0;
        localStorage.playedGames = 0;
        localStorage.player = "Player";
    }



    $(".record").html("Last Record: " +localStorage.player + ": " + localStorage.points + " points, "
        + localStorage.meters + " meters");

});


function changeElement () {
    bun = !bun;

    var nextPower = game.pixElement.nextPower(),
        shieldTexture;
    //console.log(nextPower);

    if(shield)
        shieldTexture = "shields/"
    else
        shieldTexture = "";
    //console.log(nextPower.texture);

//game.world.SetGravity( new b2Vec2(-1 * (Math.random() * 10), -1 * (Math.random() * 10)) );

    game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+shieldTexture+nextPower.texture));

    return false;
}

function jump () {
    jump = true;
}
