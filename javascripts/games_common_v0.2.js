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
// Physics: is where physics functions will go. Really just helper functions
//-----------------------------------------------------------------------------------
angle_of_velocity_radians = function(entity){
  return Math.abs(Math.atan2(entity.ax, entity.ay));
}

angle_of_velocity_radians_real = function(entity){
  angle = Math.atan2(entity.ax, entity.ay)*(180/Math.PI);
  angle -= Math.PI/2;
  if(angle < 0) return angle+(2*Math.PI);
  return angle;
}

angle_of_velocity_degrees = function(entity){
  return Math.atan2(entity.ax, entity.ay)*(180/Math.PI);
}

angle_of_velocity_degrees_real = function(entity){
  angle = Math.atan2(entity.ax, entity.ay)*(180/Math.PI);
  angle -= 90;
  if(angle < 0) return angle+360;
  return angle;
}


velocity_of_collision = function(entity, angle_of_collision){

  return ;
}


//-----------------------------------------------------------------------------------
// OBJECTS: The objects for our tiny game library
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
// keyHandler: keyHandler takes care of all the key strokes as well as tracking multiple keys and their states.
//-----------------------------------------------------------------------------------
function KeyHandler(use_mouse){
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
  
  this.setMouse = function(e){
    this.mousePos(e);
    if(this.keyStates[0] == null) this.keyStates["mouse_left"] = false;
    this.keyStates[0] = true;
    return true;
  }

  this.unsetMouse = function(e){
    this.mousePos(e);
    this.keyStates[0] = false;
    return true;
  }

  this.mousePos = function(e){
    if(e == null) return null;
    this.mx = e.pageX-this.listenOffsetX;
    this.my = e.pageY-this.listenOffsetY;
  }

  this.mouse = function(){
    return [this.mx, this.my];
  }

  this.stop = function(){
    
  }

  // This is just a getter to make the later syntax easier to read through
  this.key = function(key_value){
    if(this.keyStates[key_value]) return true;
    return false;
  }

  this.keyIs = function(letter){
    if(this.keyStates[keyHash[letter]]) return true;
    return false;
  }

  this.listenOffsetX = 0;
  this.listenOffsetY = 0;
  this.mx = 0;
  this.my = 0;

  this.keyStates = {};
  var keyHash = {'backspace': 8,'tab': 9,'enter': 13,'shift': 16,'ctrl': 17,'alt': 18,'pause_break': 19,'caps_lock': 20,'escape': 27,'page_up': 33,'page_down': 34,'end': 35,'home': 36,'left_arrow': 37,'up_arrow': 38,'right_arrow': 39,'down_arrow': 40,'insert': 45,'delete': 46,'0': 48,'1': 49,'2': 50,'3': 51,'4': 52,'5': 53,'6': 54,'7': 55,'8': 56,'9': 57,'a': 65,'b': 66,'c': 67,'d': 68,'e': 69,'f': 70,'g': 71,'h': 72,'i': 73,'j': 74,'k': 75,'l': 76,'m': 77,'n': 78,'o': 79,'p': 80,'q': 81,'r': 82,'s': 83,'t': 84,'u': 85,'v': 86,'w': 87,'x': 88,'y': 89,'z': 90,'left_window_key': 91,'right_window_key': 92,'select_key': 93,'numpad_0': 96,'numpad_1': 97,'numpad_2': 98,'numpad_3': 99,'numpad_4': 100,'numpad_5': 101,'numpad_6': 102,'numpad_7': 103,'numpad_8': 104,'numpad_9': 105,'multiply': 106,'add': 107,'subtract': 109,'decimal_point': 110,'divide': 111,'f1': 112,'f2': 113,'f3': 114,'f4': 115,'f5': 116,'f6': 117,'f7': 118,'f8': 119,'f9': 120,'f10': 121,'f11': 122,'f12': 123,'num_lock': 144,'scroll_lock': 145,'semi_colon': 186,'equal_sign': 187,'comma': 188,'dash': 189,'period': 190,'forward_slash': 191,'grave_accent': 192,'open_bracket': 219,'back_slash': 220,'close_braket': 221,'single_quote': 222};
  window.addEventListener("keydown", bind(this, this.setKey), false);
  window.addEventListener("keyup", bind(this, this.unsetKey), false);
  if(use_mouse){
    window.addEventListener("mousedown", bind(this, this.setMouse), false);
    window.addEventListener("mouseup", bind(this, this.unsetMouse), false);
    window.addEventListener("mousemove", bind(this, this.mousePos), false);
  }

  console.log("KeyHandler initialized!");
}


//-----------------------------------------------------------------------------------
// ImageHandler: This handles static images not frames just images
//-----------------------------------------------------------------------------------
function ImageHandler(params){
  
  this.draw = function(sx, sy, sw, sh, dx, dy, dw, dh){
    this.context.save();
    this.context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);
    this.context.restore();
  }

  this.context = params.context;
  this.image_path = params.image_path;
  this.image = new Image();
  this.image.src = this.image_path;

}

//-----------------------------------------------------------------------------------
// SpriteHandler: This handles the images, there frames if it is an animation and any transformations
//-----------------------------------------------------------------------------------
function SpriteHandler(params){
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
  
  this.context = params.context;
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

  this.collidesAt = function(entity){
    // var left1, left2;
    // var right1, right2;
    // var top1, top2;
    // var bottom1, bottom2;

    var left1 = (this.x-this.width/2);
    var left2 = (entity.x-entity.width/2);
    var right1 = (this.x+this.width/2);
    var right2 = (entity.x+entity.width/2);
    var top1 = (this.y-this.height/2);
    var top2 = (entity.y-entity.height/2);
    var bottom1 = (this.y+this.height/2);
    var bottom2 = (entity.y+entity.height/2);

    var ret = [false, false, false, false, false];

    if(bottom1 > top2 && bottom1 < bottom2 && this.x < (entity.x+entity.width/2) && this.x > (entity.x-entity.width/2))  ret[1] = true; // im colliding with the top of entity
    if(top1 < bottom2 && top1 > top2 && this.x < (entity.x+entity.width/2) && this.x > (entity.x-entity.width/2))        ret[2] = true; // im colliding with the bottom of entity
    if(right1 > left2 && right1 < right2 && this.y < (entity.y+entity.height/2) && this.y > (entity.y-entity.height/2))  ret[3] = true; // im colliding with the left the entity
    if(left1 < right2 && left1 > left2 && this.y < (entity.y+entity.height/2) && this.y > (entity.y-entity.height/2))    ret[4] = true; // im colliding with the right of entity

    return ret;

  }

  this.isCollidingWith = function(entity){
    x1 = this.x-this.width/2 + this.width;
    y1 = this.y-this.height/2 + this.height;
    x3 = entity.x-entity.width/2 + entity.width;
    y3 = entity.y-entity.height/2 + entity.height;

    return !(x1<entity.x-entity.width/2 || x3<this.x-this.width/2 || y1<entity.y-entity.height/2 || y3<this.y-this.height/2);
  }

  this.isCollidingWith_preEmptive = function(entity){
    x1 = (this.x+this.ax)-(this.width+this.ax)/2 + this.width;
    y1 = (this.y+this.ay)-(this.height+this.ay)/2 + this.height;
    x3 = entity.x-entity.width/2 + entity.width;
    y3 = entity.y-entity.height/2 + entity.height;
    
    return !(x1<entity.x-entity.width/2 || x3<this.x-this.width/2 || y1<entity.y-entity.height/2 || y3<this.y-this.height/2);
  }

  this.isCollidingWithPos = function(x2, y2, w1, h1){
    x1 = this.x-this.width/2 + this.width;
    y1 = this.y-this.height/2 + this.height;
    x3 = x2 + w1;
    y3 = y2 + h1;
    return !(x1<x2 || x3<this.x-this.width/2 || y1<y2 || y3<this.y-this.height/2);
  }

  this.isCollidingWithPos_preEmptive = function(x2, y2, w1, h1){
    x1 = (this.x+this.ax)-this.width/2 + this.width;
    y1 = (this.y+this.ay)-this.width/2 + this.height;
    x3 = x2 + w1;
    y3 = y2 + h1;
    return !(x1<x2 || x3<this.x-this.width/2 || y1<y2 || y3<this.y-this.height/2);
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
  // this.collision_map = new CollisionMap(640, 480);
  // this.collision_map.createMapTable();
  
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
    for(var i = 0; i < this.size; i++){
      this.entities[i].update();
    } 
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
// TODO: Finish this
function CollisionMap(params){
  // This gets called when you create the object
  this.init = function(){
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
  
  this.nearbyObjects = function(entity){
    
  }
  
  this.cols = 0;
  this.rows = 0;
  this.width = params.width;
  this.height = params.height;
  this.cell_size = params.cell_size; // in pixels
  this.hash_size = 0;
  this.hash = [];

  this.entity_list = params.entity_list || new EntityList();

  this.init();
}