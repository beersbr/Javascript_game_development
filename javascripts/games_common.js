// These are a bunch of helper functions that are basically one liners for making other parts
// of the code more readable

// Helper function for arrays... 
//:arrayIncludes This is a small helper function for javascript arrays. It is necessary to ask if an item exists in an array. Returns true or false.
function arrayIncludes(array, item){
  for(var i = 0; i < array.length; i++){
    if(array[i] == item)
      return true;
  }
  return false;
}

// Check if two boxes collide
//:collision accepts 8 arguments. The x position, y position, width and height of two objects and will return true or false if they are colliding.
function collision(x0, y0, w0, h0, x2, y2, w1, h1){
  x1 = x0 + w0;
  y1 = y0 + h0;
  x3 = x2 + w1;
  y3 = y2 + h1;
  return !(x1<x2 || x3<x0 || y1<y2 || y3<y0);
}

//:TimeSeconds returns the current time in seconds
function TimeSeconds(){
  return Date.now()/1000;
};

//:random get a random integer between 0 and max
function random(max){
  return Math.floor(Math.random()*max+1);
}

//:pythag gets the distance between two points d1 and d2. 
function pythag(d1, d2){
  return parseInt(Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2)));
}

NULL = "undefined";

//:bind This method lets us choose scope for functions so that when we use eventHandlers in javascript we retain the scope of our choosing inside that eventHandler callback.
function bind(scope, fn){
  return function(){
    fn.apply(scope, arguments);
  };
}

//:keyHandler This is the keyhandler on the window. You initalize it and grab the keys out of the keyHander#key(value); keyHandler#key(value) will return a true or false value on wheather that key is pressed or not.
function keyHandler(){
  // sets the key in the buffer variable
  this.setKey = function(key){
    // If we are setting the key for the first time make sure it has a value
    if(this.keyStates[key.keyCode] == null){
      this.keyStates[key.keyCode] = false;
    }
    this.keyStates[key.keyCode] = true;
    
    if(this.debug){
      console.log("KEY: "+key.keyCode+" => "+this.keyStates[key.keyCode]);
    }
  }

  // unsets the key in the buffer variable
  this.unsetKey = function(key){
    this.keyStates[key.keyCode] = false;
    
    if(this.debug){
      console.log("KEY: "+key.keyCode+" => "+this.keyStates[key.keyCode]);
    }
  }
  
  // This is just a getter to make the later syntax easier to read through
  this.key = function(key_value){
    if(this.keyStates[key_value]){
      return true;
    }
    return false;
  }

  // the 'constructor' values
  this.debug = false;
  this.keyStates = {};
  window.addEventListener("keydown", bind(this, this.setKey), false);
  window.addEventListener("keyup", bind(this, this.unsetKey), false);
}

function particle(x, y, context, color_r, color_g, color_b, direction, speed){
  this.update = function(){
    ctx.fillStyle = "rgba("+this.r+","+this.g+","+this.b+", "+0.6+")";
    // ctx.fillRect(Math.round(this.x)-2, Math.round(this.y)-2, 4, 4);
    ctx.fillRect(this.x-2, this.y-2, 4, 4);
    
    this.delta_x = Math.cos(this.direction * (Math.PI/180)) * this.speed;
    this.delta_y = Math.sin(this.direction * (Math.PI/180)) * this.speed;
    
    this.x += this.delta_x;
    this.y += this.delta_y;
    
    this.travel += pythag(this.delta_x, this.delta_y);
    
    if(this.travel > this.max_dist){
      return true;
    }
    return false;
  }
  
  this.created_at = TimeSeconds();
  
  this.delta_x = 0;
  this.delta_y = 0;
  
  this.travel = 0;
  this.max_dist = 20+random(50);
  
  this.r = color_r;
  this.g = color_g;
  this.b = color_b;
  
  this.speed = speed;
  this.direction = direction;
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.ctx = context;
}

function particleFountain(sx, sy, context, cnt, speed, color_r, color_g, color_b, direction){
  this.start = function(){
    for(var i = 0; i < this.count; i++){
      var color_mod = random(150);
      this.particles.push(new particle(this.x, this.y, this.ctx, this.r+color_mod, this.g+color_mod/2, this.b+color_mod/2, this.direction-30+random(60), this.speed*random(2)+1))
    }
  }
  
  this.update = function(){
    for(var i = 0; i < this.count; i++){
      if(this.particles[i].update()){
        var color_mod = random(150);
        this.particles.splice(i, 1);
        this.particles.push(new particle(this.x, this.y, this.ctx, this.r+color_mod, this.g+color_mod/2, this.b+color_mod/2, this.direction-30+random(60), this.speed*random(2)+1) );

      };
    }
  }
  
  this.update_ex = function(params){
    var cust_dir = params.direction || this.direction;
    var cust_x = params.x || this.x;
    var cust_y = params.y || this.y;
    var cust_create = params.create;
    
    for(var i = 0; i < this.count; i++){
      
      if(this.particles[i].update()){
        this.particles.splice(i, 1);
        var color_mod = random(150);
        this.particles.push(new particle(cust_x, cust_y, this.ctx, this.r+color_mod, this.g+color_mod/2, this.b+color_mod/2, cust_dir-30+random(60), this.speed*random(2)+1) );
      };
    }
  }
  
  this.direction = direction; // degrees
  this.x = sx;
  this.y = sy;
  this.count = cnt;
  this.speed = speed; // this will be ~randomized
  this.r = color_r;
  this.g = color_g;
  this.b = color_b;
  this.particles = [];
  this.ctx = context;
}

// This handles the images, there frames if it is an animation and any transformations
function SpriteHandler(context, image_path){
  this.rotate = function(angle){
    this.rot = angle;
    this.direction += this.rot;
    return this.rot;
  }
  
  this.scale = function(x, y){
    
  }
  
  this.draw_with_canvas = function(at_x, at_y){
    // we dont need this
  }
  
  this.draw_with_image = function(at_x, at_y){
    this.context.save();
    this.context.translate(at_x+(this.image.width/2), at_y+(this.image.height/2));
    this.context.rotate(this.direction * Math.PI / 180);
    this.rot = 0;
    this.context.drawImage(this.image, -this.image.width/2, -this.image.height/2);
    this.context.restore();
  }
  
  this.get_dir = function(){
    return this.direction - 90;
  }
  
  if(image_path != ""){
    this.draw = this.draw_with_image;
    this.image = new Image();
    this.image.src = image_path;
  }else{
    this.draw = this.draw_with_canvas;
    this.image = null;
  }
  
  this.context = context;
  this.direction = 0; // degrees
  this.rot = 0;
}

function Entity(p){
  this.inheritFrom = SpriteHandler;
  this.inheritFrom(p.context, p.sprite_path);
  
  this.in_collision = function(){
    
  }
  
  this.update = function(){
    
  }
  
  get_id = function(){
    if(typeof Entity.ids == 'undefined'){
      Entity.ids = 0;
    }
    return Entity.ids++;
  }
  
  this.id = get_id();
  
  // starting values
  this.collision = false;
  this.collision_map = null;
  
  this.width = p.width || 0;
  this.height = p.height || 0;
  this.x = p.x || 0;
  this.y = p.y || 0;
  this.ax = p.ax || 0;
  this.ay = p.ay || 0;
  this.context = p.context;
  this.sprite_path = p.sprite_path
  // this.uber(this.context, this.sprite_path);
}