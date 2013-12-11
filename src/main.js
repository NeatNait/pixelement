(function Main()
{

    var bU = new Box2DUtils(),
        pU = new PixiUtils();

    //const STAGE_WIDTH = window.innerWidth, STAGE_HEIGHT = window.innerHeight;
    const STAGE_WIDTH = 640, STAGE_HEIGHT = 480;
    const METER = 100;


    var world = new PixelWorld();

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

    var texture = PIXI.Texture.fromImage("assets/box.jpg");
    //var bunny = createBox(200,150, 1, 1, texture);

    // center the sprites anchor point
    //bunny.anchor.x = 0.1;
    //bunny.anchor.y = 0;
    
    // move the sprite t the center of the screen
    //bunny.position.x = 200;
    //bunny.position.y = 150;


    




    function addVel(body){
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

        //v.x = 0.267 *2;//Math.random();
        v.x = 0.8;//Math.random();
        
        b.SetLinearVelocity(v);
    };



    function createFloor(x) {

        var suelo = world.createBox(x, 1, 6, 1, {density : 5.0, type: b2Body.b2_staticBody});
        var texture = PIXI.Texture.fromImage("assets/box.jpg");

        sueloPixi = createBox(x, 1, 6, 1, texture);

        world.actors.actors.push(suelo);
        world.actors.bodies.push(sueloPixi);
        containerDisplay.addChild(sueloPixi);
    }



    function createObject(x) {

        texture = PIXI.Texture.fromImage("assets/box.jpg");
        bunny = createBox(1, 5, 0.5, 1, texture);

        containerDisplay.addChild(bunny);


        var b = world.createBox(x+containerDisplay.position.x/METER * -1, 5, 0.5, 1, {density : 1.0});


        //addVel(b);

        world.actors.addActor(b);
        world.actors.addBody(bunny);

        return b;

    }

    var cont = 0,
        floorActualX = 2;


    //Character
    var character = createObject(1.5);

    createFloor(1);

    createFloor(7);

    
	function update()
	{
        cont++;

		requestAnimFrame(update);

        containerDisplay.position.x -= 2;


        if(cont%(60*1)==0){
            createObject(Math.random()*20);
        }


        if(cont%(60*3.5)==0){
            createFloor(floorActualX*6+1);
            floorActualX++;
        }


        
        world.world.Step(1 / 60,  3,  3);
        world.world.ClearForces();
        
        const n = world.actors.actors.length;
        for (var i = 0; i < n; i++)
        {
            var body  = world.actors.bodies[i];
            var actor = world.actors.actors[i];
            var position = actor.GetPosition();
            var position = actor.GetPosition();

            //body.position.x = 500;
            //body.position.y = 500;
            body.position.x = position.x * 100;
            body.position.y = (STAGE_HEIGHT - position.y * 100);
            body.rotation = -1 * actor.GetAngle();

        //addVel(actor);



            
            //actor.rotation = body.GetAngle();
        }

        
        addVel(character);

        
        renderer.render(stage);
        //stats.update();
	}




    console.log(world);



//var world;
var ctx;
var canvas_width;
var canvas_height;
var canvas_width_m, canvas_height_m;

///box2d to canvas scale , therefor 1 metre of box2d = 30px of canvas :)
var scale = 100;


 
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

currentX--;
currentX--;
    //call this function again after 1/60 seconds or 16.7ms
    setTimeout(step , 1000 / fps);
}

step();



})();
