(function Main()
{


    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);
    
    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(400, 300);
    
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    
    requestAnimFrame( update );
    
    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("assets/bunny.png");
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);
    
    // center the sprites anchor point
    bunny.anchor.x = 0.1;
    bunny.anchor.y = 0;
    
    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;
    
    stage.addChild(bunny);

    var cont = 0;
    
	function update()
	{
        cont++;

		requestAnimFrame(update);


           // containerDisplay.position.x -= 1;
        

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
})();