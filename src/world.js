//world


var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2World = Box2D.Dynamics.b2World
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    , b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef
    ;


PixelWorld = function (opts) {

    //Gravity vector x, y - 10 m/s2 - thats earth!!
    var gravity = new b2Vec2(0, -10);
     
    this.world = new b2World(gravity, true);

	this.actors = new Actors();




	this.createBox = function ( x, y, width, height, options) 
	{
	     //default setting
	    options = $.extend(true, {
	        'density' : 1.0 ,
	        'friction' : 1.0 ,
	        'restitution' : 0.5 ,
	         
	        'type' : b2Body.b2_dynamicBody,
			'angle' : 35

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
	     
	    var b = this.world.CreateBody( body_def );
	    var f = b.CreateFixture(fix_def);
	     
	    return b;
	}


}


Actors = function () {
	
	this.actors = [];
	this.bodies = [];

	this.addActor = function (actor) {
		this.actors.push(actor);
	}

	this.addBody = function (body) {
		this.bodies.push(body);
	}

}

/*
Actor.prototype.add_velocity = function(vel)
{
	var b = this.body;
	var v = b.GetLinearVelocity();
	
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
	
	//set the new velocity
	b.SetLinearVelocity(v);
}*/