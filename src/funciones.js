//Create standard boxes of given height , width at x,y

var Box2DUtils = function(){

	function createBox(world, x, y, width, height, options) 
	{
	     //default setting
	    options = $.extend(true, {
	        'density' : 1.0 ,
	        'friction' : 1.0 ,
	        'restitution' : 0.5 ,
	         
	        'type' : b2Body.b2_dynamicBody
	    }, options);
	       
	    var body_def = new b2BodyDef();
	    var fix_def = new b2FixtureDef();
	     
	    fix_def.density = options.density;
	    fix_def.friction = options.friction;
	    fix_def.restitution = options.restitution;
	     
	    fix_def.shape = new b2PolygonShape();
	         
	    fix_def.shape.SetAsBox( width/2 , height/2 );
	     
	    body_def.position.Set(x , y);
	     
	    body_def.type = options.type;
	    body_def.userData = options.user_data;
	     
	    var b = world.CreateBody( body_def );
	    var f = b.CreateFixture(fix_def);
	     
	    return b;
	}

}


var PixiUtils = function(){

	//function createBox(world, x, y, width, height, options) 
	this.createBox = function createBox(texture) 
	{
	     //default setting
	var     options = $.extend(true, {
	        'density' : 1.0 ,
	        'friction' : 1.0 ,
	        'restitution' : 0.5 ,
	         
	        'type' : b2Body.b2_dynamicBody
	    }, options);
	       
		//var texture = new PIXI.Texture.fromFrame("assets/bunny.png"),
		var	box = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/bunny.png"));
        
        box.i = i;
        box.anchor.x = box.anchor.y = 0.5;
        box.scale.x = 50 / 50;
        box.scale.y = 50 / 50;
	     
	    return box;
	}

}

var PixiBox = function () {



        
	this.texture;
	this.box;

	//function createBox(world, x, y, width, height, options) 
	this.createBox = function createBox(containerDisplay) 
	{
	     //default setting
	var     options = $.extend(true, {
	        'density' : 1.0 ,
	        'friction' : 1.0 ,
	        'restitution' : 0.5 ,
	         
	        'type' : b2Body.b2_dynamicBody
	    }, options);

	       
	const loader = new PIXI.AssetLoader(["assets/ball.png",
                                             "assets/box.jpg",
                                             "assets/bunny.png"]);
	
		this.texture = new PIXI.Texture.fromFrame("assets/bunny.png"),
		this.box = new PIXI.Sprite(this.texture);
        
        this.box.i = i;
        this.box.anchor.x = this.box.anchor.y = 0.5;
        this.box.scale.x = 50 / 50;
        this.box.scale.y = 50 / 50;

        containerDisplay.addChild(this.box);
	     
	    //return box;
	}


}



function createBox(posx, posy, scalex, scaley, texture){
    
	box = new PIXI.Sprite(texture);
    
	//box.i = i;
    box.anchor.x = box.anchor.y = 0.5;
    box.scale.x = scalex;
    box.scale.y = scaley;
	box.position.x = posx;
    box.position.y = posy;

    box.buttonMode = true;
    box.interactive = true;

    box.mouseover = function(data){
			
		this.isOver = true;
		
		if(this.isdown)return
		
		//this.setTexture(textureButtonOver)
	}

		// set the mouseout callback..
	box.mouseout = function(data){
		
		this.isOver = false;
		if(this.isdown)return
	}
	
	box.click = function(data){
		// click!
		console.log("CLICK!");
	//	alert("CLICK!")
	}
	
	box.tap = function(data){
		// click!
		console.log("TAP!!");
		//this.alpha = 0.5;
	}

	console.log("create box");
     
    return box;
}