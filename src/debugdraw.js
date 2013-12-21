
if(DEBUG){
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
        //world.world.Step(timeStep , 8 , 3);
        //world.world.ClearForces();
         
        //redraw the world
        draw_world(world.world , ctx);
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

}else{

    function step() 
    {
        var fps = 60;
        var timeStep = 1.0/(fps * 0.8);

        world.world.Step(timeStep , 8 , 3);
        world.world.ClearForces();
         
        setTimeout(step , 1000 / fps);
    }

    //step();

}