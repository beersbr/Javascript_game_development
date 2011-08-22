// These are a bunch of helper functions that are basically one liners for making other parts
// of the code more readable
function TimeSeconds(){
  return Date.now()/1000;
};

function random(max){
  return Math.floor(Math.random()*max+1);
}

function pythag(d1, d2){
  return parseInt(Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2)));
}

// This method lets us choose scope for functions so that when we use eventHandlers in javascript we 
// retain the scope of our choosing inside that eventHandler callback.
bind = function(scope, fn){
  return function(){
    fn.apply(scope, arguments);
  };
}

// This is the keyhandler on the window. You initalize it and grab the keys out of the keyHander#key(value);
// keyHandler#key(value) will return a true or false value on wheather that key is pressed or not.
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

function mouseHandler(){
  
}

function spriteHandler(){
  
}