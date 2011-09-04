//-----------------------------------------------------------------------------------
// GamesCommon JS v0.2
// Created By: Brett Beers
// Contact: beersbr@gmail.com // twitter: @mramaizng // github: beersbr
//
// This is version 0.20 of the games_common.js library
//
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
// COMMON METHODS: Common methods that don't really fit into an object
//-----------------------------------------------------------------------------------

// Extends the `Array` object. Accepts an object of arbutrary type and returns bool on whether the item exists in the array
Array.prototype.includes = function(object){
  for(var i = 0; i < this.length; i++)
    if(this[i] == object)
      return true;

  return false;
}

// Returns the curren time in seconds
function timeSeconds(){
  return Date.now()/1000;
}

// Returns a random number between 0 and max
function randomInt(max){
  return Math.floor(Math.random()*max+1);
}

// Returns a random number between 0 and max where the return is not guaranteed to be an integer.
function randomFloat(max){
  return Math.random()*max+1;
}

// Returns the distance between 2 points d1 and d2. The number is returned as an INTEGER for speed in use.
function distance(p1, p2){
  return parseInt(Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2)));
}

// Binds a scope to a function so when passing function pointers we can use functions that have 'this' in it.
function bind(scope, fn){
  return function(){
    fn.apply(scope, arguments);
  };
}

//-----------------------------------------------------------------------------------
// OBJECTS: The objects for our tiny game library
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// keyHandler: keyHandler takes care of all the key strokes as well as tracking multiple keys and their states.
//-----------------------------------------------------------------------------------
function KeyHandler(){
  this.setKey = function(key){
    // If we are setting the key for the first time make sure it has a value
    if(this.keyStates[key.keyCode] == null) this.keyStates[key.keyCode] = false;
    this.keyStates[key.keyCode] = true;
    return true;
  }

  // unsets the key in the buffer variable
  this.unsetKey = function(key){
    this.keyStates[key.keyCode] = false;
    return true;
  }
  
  // This is just a getter to make the later syntax easier to read through
  this.key = function(key_value){
    if(this.keyStates[key_value]) return true;
    return false;
  }

  this.debug = false;
  this.keyStates = {};
  window.addEventListener("keydown", bind(this, this.setKey), false);
  window.addEventListener("keyup", bind(this, this.unsetKey), false);
}


//-----------------------------------------------------------------------------------
// SpriteHandler: This handles the images, there frames if it is an animation and any transformations
//-----------------------------------------------------------------------------------
function SpriteHandler(){
  this.initSprite = function(params){
    this.context = params.context;
    this.path = params.path;
    this.image = new Image();
    this.image.src = this.path;
  }

  this.rotate = function(angle){
    this.rot = angle;
    this.direction += this.rot;
    return this.rot;
  }
  
  this.scale = function(x, y){
    
  }
  
  this.draw = function(at_x, at_y){
    this.context.save();
    this.context.translate(at_x+(this.image.width/2), at_y+(this.image.height/2));
    this.context.rotate(this.direction * Math.PI / 180);
    this.rot = 0;
    this.context.drawImage(this.image, -this.image.width/2, -this.image.height/2);
    this.context.restore();
  }
  
  this.getDirection = function(){
    return this.direction - 90;
  }
  
  this.context = context;
  this.direction = 0; // degrees
  this.rot = 0;
}


//-----------------------------------------------------------------------------------
// PARTICLE: A simple particle object for fun particle systems
//-----------------------------------------------------------------------------------
function Particle(params){

  this.update = function(){
    // These only get calculated once
    if(this.dx == null) this.dx = Math.cos(this.direction * (Math.PI/180));
    if(this.dy == null) this.dy = Math.sin(this.direction * (Math.PI/180));

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if(--this.ttl > 0) return false;
    return true;
  }
  
  this.draw = function(){
    this.context.save();
    this.context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+", "+0.6+")";
    this.context.fillRect(this.x-2, this.y-2, 4, 4);
    this.context.restore();
  }

  this.dx = null;
  this.dy = null;
  
  this.ttl = params.ttl || 10+randomInt(30); // How many frames does this particle live for

  this.r = params.red || 0;
  this.g = params.green || 0;
  this.b = params.blue || 0;
  this.x = params.x || 0;
  this.y = params.y || 0;
  this.speed = params.speed || 1;
  this.direction = params.direction || 0;
  this.context = params.context || 0;
}


//-----------------------------------------------------------------------------------
// PARTICLE FOUNTAIN: A simple particle object for fun particle systems
//-----------------------------------------------------------------------------------
function ParticleFountain(params){
  this.init = function(){
    for(var i = 0; i < this.count; i++){
      this.particles.push(new Particle({'x': this.x, 
                                          'y': this.y, 
                                          'context': this.context,
                                          'red': this.r+150,
                                          'green': this.g+150/2,
                                          'blue': this.b+150/2,
                                          'direction': this.direction-40+randomInt(80),
                                          'speed': (this.speed)+randomInt(3),
                                          'ttl': this.ttl + randomInt(30)
                                        })
                            );
    }
  }

  this.update = function(){
    for(var i = 0; i < this.count; i++){
      if(this.particles[i].update()){
        var color_mod = randomInt(150);
        this.particles.splice(i, 1);
        this.particles.push(new Particle({'x': this.x, 
                                        'y': this.y, 
                                        'context': this.context,
                                        'red': this.r+color_mod,
                                        'green': this.g+color_mod/2,
                                        'blue': this.b+color_mod/2,
                                        'direction': this.direction-40+randomInt(80),
                                        'speed': (this.speed)+randomInt(3),
                                        'ttl': this.ttl + randomInt(30)
                                      })
                            );
      }
      else{
        this.particles[i].draw();
      }
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
        var color_mod = randomInt(150);
        this.particles.push(new Particle({'x': this.x, 
                                        'y': this.y, 
                                        'context': this.context,
                                        'red': this.r+color_mod,
                                        'green': this.g+color_mod/2,
                                        'blue': this.b+color_mod/2,
                                        'direction': this.direction-30+randomInt(60),
                                        'speed': this.speed*randomInt(2)+1,
                                        'ttl': this.ttl + randomInt(30)
                                      })
                            );
      };
    }
  }
  
  this.ttl = params.ttl || 60;
  this.context = params.context;
  this.direction = params.direction; // degrees
  this.x = params.x;
  this.y = params.y;
  this.count = params.count;
  this.speed = params.speed; // this will be ~randomized
  this.r = params.red;
  this.g = params.green;
  this.b = params.blue;
  this.particles = [];
  this.init();
}


//-----------------------------------------------------------------------------------
// ENTITY: Entity is the base object for all our movable objects
//-----------------------------------------------------------------------------------
function Entity(init){
  this.inheritFrom = SpriteHandler;
  this.inheritFrom(init.context, init.sprite_path);
  
  this.isCollidingWith = function(x2, y2, w1, h1){
    x1 = this.x + this.width;
    y1 = this.y + this.height;
    x3 = x2 + w1;
    y3 = y2 + h1;
    return !(x1<x2 || x3<this.x || y1<y2 || y3<this.y);
  }

  // These functions must be here so that they always exist in the child objects
  this.update = function(){}
  
  get_id = function(){
    if(typeof Entity.ids == 'undefined') Entity.ids = 0;
    return Entity.ids++;
  }
  
  this.id = get_id();
  
  this.width = init.width || 0;
  this.height = init.height || 0;
  this.x = init.x || 0;
  this.y = init.y || 0;
  this.ax = init.ax || 0; // the acceleration
  this.ay = init.ay || 0;
  this.context = init.context;
  this.sprite_path = init.sprite_path
}


//-----------------------------------------------------------------------------------
// ENTITYLIST: EntityList is a list of entities. It will batch your entity stuff together
//-----------------------------------------------------------------------------------
function EntityList(){
  this.collision_map = new CollisionMap(640, 480);
  this.collision_map.createMapTable();
  
  this.entities = [];
  this.size = 0;
  
  this.add = function(entity){
    this.size += 1;
    this.entities.push(entity);
    return entity;
  }
  
  this.remove = function(id){
    this.size -= 1;
  }
  
  this.update = function(){
    this.collision_map.updateMap();
    
    for(var i = 0; i < this.size; i++){
      if(!this.entities[i].update()){
        this.entities.splice(i, 1);
        this.size -= 1;
        continue;
      }
      
      // Check the collision
      if(this.entities[i].in_collision(this.collision_map.nearbyObjects(this.entities[i])) ){
        //TODO finish this function
        // this.entities.
      }
      
      this.collision_map.addObject(this.entities[i]);
    }
    
    return true;
  }
  
  this.draw = function(){
    for(var i = 0; i < this.size; i++){
      this.entities[i].draw();
    }
  }
}


//-----------------------------------------------------------------------------------
// CollisionMap: accepts two arguments, the width and height in pixels of the current context. This object
// provides collision detection in a fast, portable way
//-----------------------------------------------------------------------------------
function CollisionMap(width, height){
  
  // This gets called when you create the object
  this.createMapTable = function(){
    this.cols = this.width / this.cell_size;
    this.rows = this.height / this.cell_size;
    this.map_size = this.cols * this.rows;
    
    for(var i = 0; i < this.map_size; i++){
      this.map[i] = [];
    }
    return true;
  }
  
  this.clearMap = function(){
    for(var i = 0; i < this.map_size; i++){
      this.map[i] = [];
    }
    return true;
  }
  
  this.updateMap = function(){
    this.clearMap();
  }
  
  // This returns the nearby objects of a single object. Accepts an object as the argument
  this.nearbyObjects = function(entity){
    // don't operate on a ~null object
    if(entity == undefined){
      return -1;
    }
        
    var object_cell_id = ((Math.floor(entity.x/this.cell_size)) + (Math.floor(entity.y/this.cell_size)) * (this.width/this.cell_size) );
    
    if(object_cell_id >= this.map_size || object_cell_id < 0){
      return false;
    }
    
    if(this.map[object_cell_id].length > 0){
      return this.map[object_cell_id];
    }
    return false;
  }
  
  this.cols = 0;
  this.rows = 0;
  this.width = width;
  this.height = height;
  this.cell_size = 40; // in pixels
  this.map_size = 0;
  this.map = []

  this.createMapTable();
}