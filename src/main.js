
var jump = false,
    boost = false,
    bun = false,
    muerto = false;
    lives = 100,
    game = null;


(function Main()
{

    var bU = new Box2DUtils(),
        pU = new PixiUtils();

    //const STAGE_WIDTH = window.innerWidth, STAGE_HEIGHT = window.innerHeight;
    const STAGE_WIDTH = 640, STAGE_HEIGHT = 480;
    const METER = 23;
    const MOVEX = true;



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
            return;
        }


        muerto = ! collidingPixElement.getActualPower().checkWinner(collidingEnemy);

        if (muerto){
            console.error("muerto a los " + bodyA.GetPosition().x + " metros");
            console.error("killed by an evil " + collidingEnemy.name );
            console.log(world);
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
    
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    
    requestAnimFrame( update );
    
    // create a texture from an image path
    //var texture = PIXI.Texture.fromImage("assets/bunny.png");
    // create a new Sprite using the texture
    //var bunny = new PIXI.Sprite(texture);
    
    //var bunny = pU.createBox("");

    //var bunny = new PixiBox();

    //bunny.createBox(containerDisplay);

    var texture = PIXI.Texture.fromImage("assets/b3.png");
    //var bunny = createBox(200,150, 1, 1, texture);

    // center the sprites anchor point
    //bunny.anchor.x = 0.1;
    //bunny.anchor.y = 0;
    
    // move the sprite t the center of the screen
    //bunny.position.x = 200;
    //bunny.position.y = 150;


    




    function addVel(body, parV){
        var b = body;
        var v = b.GetLinearVelocity();
    
        var vel = new b2Vec2(1,0);
        v.Add(vel);
        
        //check for max horizontal and vertical velocities and then set
        if(Math.abs(v.y) > this.max_ver_vel)
        {
            v.y = this.max_ver_vel * v.y/Math.abs(v.y);
        }
        
        if(Math.abs(v.x) > this.max_hor_vel)
        {
            v.x = this.max_hor_vel * v.x/Math.abs(v.x);
        }

        //v.x = 0.267 ;//Math.random();

        v.x = parV;
        //v.x = 0.65;

        
        b.SetLinearVelocity(v);
    };

    function addJump(body, jump) {

        var b = body;
        var v = b.GetLinearVelocity();
    
        var vel = new b2Vec2(1,0);
        v.Add(vel);
        
        //check for max horizontal and vertical velocities and then set
        if(Math.abs(v.y) > this.max_ver_vel)
        {
            v.y = this.max_ver_vel * v.y/Math.abs(v.y);
        }
        
        if(Math.abs(v.x) > this.max_hor_vel)
        {
            v.x = this.max_hor_vel * v.x/Math.abs(v.x);
        }

        //v.x = 0.267 ;//Math.random();

        v.y = jump;
        //v.x = 0.65;

        
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

    function createObject(name, x, y, texture, userData) {

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
    var character = createObject(1, 0.5, 5, bluetexture, game.pixElement);

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


    
	function update()
	{
        cont++;

        if(!muerto)

        requestAnimFrame(update);

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

        if(cont%(60/15)==0){

            var texture = bluetexture,
                muerte = 2,
                enemy = null;
            
            var rndTexture = Math.random();

            if( rndTexture < 0.3){
                texture = redtexture;
                muerte = 100;
                enemy = new RedPower();

            }
            else if(rndTexture >= 0.3 && rndTexture < 0.6){
                texture = greentexture;
                muerte = 100;
                enemy = new GreenPower();

            }
            else{
                enemy = new BluePower();
            }

            createObject(muerte, Math.random()*16 + 10, Math.random()*19 + 3, texture, enemy);
        }


        if(cont%(60/2)==0){
            createFloor(floorActualX*6+1, 0.5);
            createFloor(floorActualX*6+1, 20);
            createFloor(floorActualX*6+1, Math.random()*10+5);
            floorActualX++;
        }


        
        world.world.Step(1 / 60,  3,  3);
        world.world.ClearForces();
        
        const n = world.actors.actors.length;
        for (var i = 0; i < n; i++)
        {
            var body  = world.actors.bodies[i];

            if(body === undefined) continue;

            var actor = world.actors.actors[i];


            var position = actor.GetPosition();
          

            //body.position.x = 500;
            //body.position.y = 500;
            body.position.x = position.x * METER;
            body.position.y = (STAGE_HEIGHT - position.y * METER);
            body.rotation = -1 * actor.GetAngle();
            //body.alpha = 0.4;



        //addVel(actor);



        if( actor.GetUserData() != 0){}
            if(position.x + 10 < character.GetPosition().x){
                console.log("destroy");
                world.world.DestroyBody(actor);

                world.actors.actors.splice(i,1);
                world.actors.bodies.splice(i,1);
                //console.log(n);
            }
        }
            
            //actor.rotation = body.GetAngle();
        

        var position = character.GetPosition();
        
        world.actors.bodies[0].alpha = 1;

        //console.log(position.x*METER);
        //console.log(containerDisplay.position.x);
        if(position.x*METER+containerDisplay.position.x < METER){
            //addVel(character,2.267);

        //console.log(containerDisplay.position.x);
            addVel(character, 0.267*4);


        }
        else{
            addVel(character, 0.267*10);
        }

        if (jump){
            addJump(character, 5);

            //console.log("jump");
            jump = false;
        }

        if (boost){
            addVel(character, 50);
            addVel(character, 50);

            //console.log("boost");
            boost = false;
        }

        if(MOVEX)
            containerDisplay.position.x = position.x*METER*-1 + 3*METER;


        //console.log(position.x*METER);
        //console.log(containerDisplay.position.x);
        
        renderer.render(stage);
        //stats.update();


	}




    //console.log(world);



//var world;
var ctx;
var canvas_width;
var canvas_height;
var canvas_width_m, canvas_height_m;

///box2d to canvas scale , therefor 1 metre of box2d = 30px of canvas :)
var scale = METER/20;


 
    var canvas = $('#canvas');
    ctx = canvas.get(0).getContext('2d');
     
    //get internal dimensions of the canvas
    canvas_width = parseInt(canvas.attr('width'));
    canvas_height = parseInt(canvas.attr('height'));
     
    canvas_height_m = canvas_height / scale;
    canvas_width_m = canvas_width / scale;




    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
     
    world.world.SetDebugDraw(debugDraw);


function draw_world(world, context) 
{
    //convert the canvas coordinate directions to cartesian coordinate direction by translating and scaling

     
    //write some text
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px arial';
    ctx.fillText('box2d model', canvas_width - 10, canvas_height - 10);
}


currentX = 0;
function step() 
{
    var fps = 60;
    var timeStep = 1.0/(fps * 0.8);

     //ctx.translate(-1, 0);
    //move the box2d world ahead
    world.world.Step(timeStep , 8 , 3);
    world.world.ClearForces();
     
    //redraw the world
    //draw_world(world.world , ctx);
        ctx.save();
    ctx.clearRect( 0, 0, canvas_width, canvas_height); 


    ctx.translate(currentX , canvas_height);
    ctx.scale(1 , -1);
    world.world.DrawDebugData();
    ctx.restore();
if(MOVEX){
//currentX--;
//currentX--;
}
    //call this function again after 1/60 seconds or 16.7ms
    setTimeout(step , 1000 / fps);
}

step();



})();








$(function(){

    $(document).keydown(function(e){
        //console.log(e.keyCode);
        jump = true;

        return false;
    });
     
    $(document).keyup(function(e){
        //console.log(e.keyCode);

        jump = false;

        return false;
    });
    

    $(document).mousedown(function(e){
        //console.log(e);

       // jump = true;
        bun = !bun;

        var nextPower = game.pixElement.nextPower();
        console.log(nextPower);

        console.log(nextPower.texture);


        game.pixElement.representation.setTexture(PIXI.Texture.fromImage("assets/"+nextPower.texture));



        return false;
    });
     

});
