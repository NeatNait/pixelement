(function Main()
{

    var bU = new Box2DUtils(),
        pU = new PixiUtils();


    var world = new PixelWorld();



    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3333333),
        containerDisplay = new PIXI.DisplayObjectContainer();
    
    stage.addChild(containerDisplay);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);
    
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
    var texture = PIXI.Texture.fromImage("assets/bunny.png");
//    var bunny = createBox(200,150, 1, 1, texture);

    // center the sprites anchor point
    //bunny.anchor.x = 0.1;
    //bunny.anchor.y = 0;
    
    // move the sprite t the center of the screen
    //bunny.position.x = 200;
    //bunny.position.y = 150;




    for (var i = 0; i < 20; i++) {
        bunny = createBox(200+(i*10),150+(i*10), 1, 1, texture);
        containerDisplay.addChild(bunny);
        console.log(i);

        world.actors.addActor(world.createBox(100 , 100, 10 , 10, {density : 5.0}));
        world.actors.addBody(bunny);

    };
    
    

    var cont = 0;
    
	function update()
	{
        cont++;

		requestAnimFrame(update);


        //containerDisplay.position.x -= 1;
        

        /*if(cont%(60*1)==0){
           /* createFigure(true);
            console.log("ball added");*/
        //}
        
        //world.Step(1 / 60,  3,  3);
        //world.ClearForces();
        
        /*const n = actors.length;
        for (var i = 0; i < n; i++)
        {
            var body  = bodies[i];
            var actor = actors[i];
            var position = body.GetPosition();
            actor.position.x = position.x * 100;
            actor.position.y = position.y * 100;
            actor.rotation = body.GetAngle();
        }*/
        
        renderer.render(stage);
        //stats.update();
	}


    console.log(world);

})();