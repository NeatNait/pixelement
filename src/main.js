// General conditions in the game
var jump = false,
    dead = false;
    game = null,
    points = 0,
    shield = false;

// Params used in some operations
var params = {
    difficultyFactor: 20,
    difficulty: 1,
    maxDifficulty: 35,
    fps:0,
    pixElementScale: 1.6,
    boxScale: 1,
    shieldOffTime: 500
};


//Get the sound module into action
var sound = new SoundModule({onLoadEnd: onSoundLoaded});


//Assets graphics preloader
const loader = new PIXI.AssetLoader(["assets/b6.png",
                                     "assets/g7.png",
                                     "assets/r7.png",
                                     "assets/w1.png",
                                     "assets/shields/b6.png",
                                     "assets/shields/g7.png",
                                     "assets/shields/r7.png",
                                     "assets/floor2.png"]);


function onSoundLoaded (argument) {
    //When every sound is loaded use callback to start loading assest
    loader.onComplete = onAssetsLoaded;
    loader.load();
}
    
function onAssetsLoaded (argument) {

    start();
}


function start(){


    var bU = new Box2DUtils(),
        pU = new PixiUtils();

    /*const STAGE_WIDTH = window.innerWidth, STAGE_HEIGHT = window.innerHeight;*/
    const STAGE_WIDTH = 640, STAGE_HEIGHT = 480;
    const METER = 23.4;
    const CHAR_OFFSET = 3*METER;
    const DEBUG = true;


    var world = new PixelWorld();
    game = world;

    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = function(contact) {

        var collidingPixElement,
            collidingEnemy;

        if (dead)
            return;


        var bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody(),
            bodyAUserData = bodyA.GetUserData(),
            bodyBUserData = bodyB.GetUserData();


        /*FIXME insert BULLET MODE*/
        //Ignore the Floor
        if(bodyAUserData instanceof Floor || bodyBUserData instanceof Floor)
            return;


        /*Ignore all but PixElement collisions
        no longer used
        if (!(bodyAUserData instanceof PixElement) && (!(bodyBUserData instanceof PixElement)))
            return;*/


        /*TODO get powers of enemies and check enemys power: something like enemy.getPower()*/

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
        //If PixElement and a Power are not involved in the collision
        //we are not interested in the collision
        else {
            return;
        }

        //If the Power is a PowerUp set it as active
        if(collidingEnemy instanceof PowerUp){

            sound.shieldOn();

            shield = true;
            game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/shields/"+game.pixElement.getActualPower().texture));

        }


        //Check whether the actual element kills or not pixElement
        dead = ! collidingPixElement.getActualPower().checkWinner(collidingEnemy);


        if (dead){

            //God has just saved your live, pixElement had a shield. Ehmmm... no longer does.
            if(shield){
                dead = false;
                
                sound.shieldOff();

                game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+game.pixElement.getActualPower().texture));

                //Get some extra time so you can really escape from the enemy
                setTimeout(function () {
                    shield = false;
                }, params.shieldOffTime);
                return;
            }

            var meters = bodyA.GetPosition().x.toFixed(2);

            $(".result").html("Dead at <a href='#'>" + meters + " meters</a>\n"
                + "killed by an evil <a href='#'>" + collidingEnemy.name + "</a>\n"
                + "with a total of <a href='#'>" + points + " points</a>.");
            
            /*console.log(world);*/
            
            //Show the gui element for the game over event
            $("#end-game").slideDown();


            //Simple achivement, achivement module integration pendding
            if(points < 1)
                $("#achivement").slideDown();

            //Active again the new game button
            $(".new-game").removeClass("disabled");

              /*//TODO screen captures*/

              /*save canvas image as data url (png format by default)*/

              /*var canvas = document.getElementById('game-canvas', {preserveDrawingBuffer: true});
              var dataURL = canvas.toDataURL();

              set canvasImg image src to dataURL
              so it can be saved as an image
              document.getElementById('canvasImg').src = dataURL;*/
                        

            //Play Game Over sound
            sound.endGame();


            localStorage.playedGames++;

            //Check wether ther's a new local record
            if(localStorage.points < points){

                actualPlayer = localStorage.player;

                var player = prompt("New local record! \nPlease enter your name", actualPlayer);

                localStorage.points = points;
                localStorage.player = player;
                localStorage.meters = meters;

                $(".result").append("<p><strong>New local record!</strong> " +localStorage.player + " has earned <a href='#'>" + localStorage.points + " points</a> and ran <a href='#'>"
                                    + localStorage.meters + " meters</a>.</p>");

            }

            //Send score to the server
            sendScore({player:localStorage.player, points:points, meters:meters});
            $(".player").html(localStorage.player);

            //Emit end game event to the controllers: handhelds and tablets
            emitEndGame(points, meters);

        }
        else{
            points++;


            sound.touch();

            $(".points").html(points);
        }


    }
    //Other collision events
    listener.EndContact = function(contact) {

    }
    listener.PostSolve = function(contact, impulse) {
        
    }
    listener.PreSolve = function(contact, oldManifold) {

    }
    //Attach the contact listener to our world
    world.world.SetContactListener(listener);


    //Create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3333333, true),
    containerDisplay = new PIXI.DisplayObjectContainer();
    
    stage.addChild(containerDisplay);

    //Create a renderer instance
    var renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT, null);
    
    renderer.view.id="game-canvas";
    //Add the renderer view element to the DOM
    document.getElementById("game-canvas-wrapper").appendChild(renderer.view);


    //Request Animation Frame allows an optimal call of update() function. 
    //Is used instead of the clasical timeout or the manual setup to 60 calls per second, 
    //and relays in the browser for obtaining the best possible performance.
    requestAnimFrame( update );
    

    var texture = PIXI.Texture.fromImage("assets/b3.png");

    //Adds a linear velocity equal to parV to the body in the x axis for a horizontal movement
    function addVel(body, parV){
        var b = body,
            v = b.GetLinearVelocity(),
            vel = new b2Vec2(1,0);
        
        v.Add(vel);
        v.x = parV;
        b.SetLinearVelocity(v);
    };


    //Adds a linear velocity equal to parV to the body in the y axis for a vertical jump
    function addJump(body, parV) {

        var b = body,
            v = b.GetLinearVelocity(),
            vel = new b2Vec2(1,0);
        
        v.Add(vel);
        v.y = parV;
        b.SetLinearVelocity(v);

    };


    //Create Floor or Ceil in the position especificated by the coordenates
    function createFloor(x, y) {

        var suelo = world.createBox(x, y, 6, 1, {density : 5.0, type: b2Body.b2_staticBody, user_data: new Floor()});
        var texture = PIXI.Texture.fromImage("assets/floor2.png");

        sueloPixi = createBox(x, y, 3*METER/100, 2*METER/100, texture);

        world.actors.actors.push(suelo);
        world.actors.bodies.push(sueloPixi);
        containerDisplay.addChild(sueloPixi);
    }


    // Set the scale of pixElement bigger than the rest
    params.boxScale = params.pixElementScale;

    // Create the rest of the objets such as: Pixelement, Enemies and Power Ups
    function createObject(x, y, texture, userData) {

        texture = PIXI.Texture.fromImage("assets/"+texture);
        bunny = createBox(1, 5, params.boxScale*METER/100, params.boxScale*METER/100, texture);

        containerDisplay.addChild(bunny);


        var b = world.createBox(x+containerDisplay.position.x/METER * -1, y, params.boxScale, params.boxScale, {restitution : 0.0, user_data: userData});

        world.actors.addActor(b);
        world.actors.addBody(bunny);

        return b;
    }

    var cont = 0,
        floorActualX = 6;



    var redtexture = "r7.png",
        bluetexture = "b6.png",
        greentexture = "g7.png";

    //Creation and adding of the main character
    var character = createObject(0.5, 5, bluetexture, game.pixElement);

    game.pixElement.setBody(character);
    var charPixi = world.actors.bodies[0];
    game.pixElement.setRepresentation(charPixi);


    game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+redtexture));

    // Set the rest of the elements scale
    params.boxScale = 1;

    // Create several floors at the begining
    createFloor(1, 0.5);
    createFloor(7, 0.5);
    createFloor(13, 0.5);
    createFloor(19, 0.5);
    createFloor(25, 0.5);
    createFloor(31, 0.5);

    // Create several ceils at the begining
    createFloor(1, 20);
    createFloor(7, 20);
    createFloor(13, 20);
    createFloor(19, 20);
    createFloor(25, 20);
    createFloor(31, 20);

    var changeTexture = false,
        $bar = $('#lvl-bar');

    // Start sound
    sound.startGame();
    
    var oldtime = new Date;

    // Used to update the world
	function update(time)
	{

        //stats.begin();

        cont++;

        // Need to update only if not dead
        if(!dead)
            requestAnimFrame(update);

        // Establish the fps used in the rest of the operations
        fps = 1000/(time-oldtime);
        oldtime = time;
        params.fps = fps;


        //Create enemies at a rate modified by params.difficulty
        if(cont%(Math.round(60/params.difficulty))==0){
           
           // Change color of difficulty var
            var barPercent = params.difficulty*100/params.maxDifficulty;
            $bar.width(barPercent+"%");

            if(barPercent > 33 && barPercent < 66){
                $bar.removeClass("progress-bar-success").addClass("progress-bar-info");
            }
            else if(barPercent > 66){
                $bar.removeClass("progress-bar-info").addClass("progress-bar-danger");
            }

            /*FIXME*/
            // Creation of different powers enemies
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

            // Creates enemies at different positions
            createObject(Math.random()*16 + 10, Math.random()*19 + 3, texture, enemy);

            if(Math.random()<0.1)
                createObject(Math.random()*16 + 10, Math.random()*19 + 3, "w1.png", new PowerUp());

        }



        /*console.log(Math.floor(containerDisplay.position.x-STAGE_WIDTH));
        if(Math.floor(containerDisplay.position.x-STAGE_WIDTH)%STAGE_WIDTH == 0){
        */
        // The rate of the floor and ceil creation
        if(cont%(60/1)==0){
            createFloor(floorActualX*6+1, 0.5);
            createFloor(floorActualX*6+1, 20);
            createFloor(floorActualX*6+1, Math.random()*10+5);
            floorActualX++;
        }

        /*createFloor(containerDisplay.position.x*6+1*-1, 0.5);
        createFloor(containerDisplay.position.x*6+1*-1, 20);
        createFloor(containerDisplay.position.x*6+1*-1, Math.random()*10+5);*/

        //The world steps at the same frame rate as the fps given by requestAnimFrame        
        world.world.Step(1 / fps*2,  8,  3);
        world.world.ClearForces();
        
        const n = world.actors.actors.length;

        //iterate through actors and get their positions updated from the physics engine
        for (var i = 0; i < n; i++)
        {
            var body  = world.actors.bodies[i];

            if(body === undefined) continue;
            
            var actor = world.actors.actors[i],
                position = actor.GetPosition();

            body.position.x = position.x * METER;
            body.position.y = (STAGE_HEIGHT - position.y * METER);
            body.rotation = -1 * actor.GetAngle();


            //Optimization of actors: if the actor has passed the 
            //left of the screen and is not visible, destroy it.
            if(position.x + 10 < character.GetPosition().x){
                world.world.DestroyBody(actor);
                world.actors.actors.splice(i,1);
                world.actors.bodies.splice(i,1);
            }
        }
            

        var position = character.GetPosition();
        
        //set difficulty
        //difficulty = Math.round(position.x/params.difficultyFactor);
        if(params.difficulty < params.maxDifficulty)
            params.difficulty = position.x/params.difficultyFactor + 3;


        //make the character run
        addVel(character, 0.267*10);

        if (jump){
            addJump(character, 5);
            jump = false;
        }

        //update the position of the screen to the position of the character plus a given offset
        containerDisplay.position.x = position.x*METER*-1 + CHAR_OFFSET;

        //call method render from Pixi
        renderer.render(stage);

	}

}

$(function(){

    $(".new-game").addClass("disabled");
    $(".alert").hide();


    $(document).keydown(function(e){
        
        //Esc for reloading
        if(e.keyCode == 27){
            document.location.reload(true)
            return false;
        }
        
        //Enter key for changing color
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
    

    // Left click for changing color
    $(document).mousedown(function(e){
        changeElement();
    });

    // Default values for local storage
    if(localStorage.points === undefined){
        localStorage.points = 0;
        localStorage.meters = 0;
        localStorage.playedGames = 0;
        localStorage.player = "Player";
    }

    // Load saved player name from local storage into the gui
    $(".player").html(localStorage.player);

    /*$(".record").html("Last Record: " +localStorage.player + ": " + localStorage.points + " points, "
        + localStorage.meters + " meters");*/

});

// Used to change our element to the next one
function changeElement () {

    var nextPower = game.pixElement.nextPower(),
        shieldTexture;

    // Check if shields textures shall be loaded
    if(shield)
        shieldTexture = "shields/"
    else
        shieldTexture = "";

    /*game.world.SetGravity( new b2Vec2(-1 * (Math.random() * 10), -1 * (Math.random() * 10)) );*/
    game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+shieldTexture+nextPower.texture));

    return false;
}

// Makes the character jump
function jump () {
    jump = true;
}