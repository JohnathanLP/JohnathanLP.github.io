let Graphics = (function(){
  let context = null;
  function initialize(){
    let canvas = document.getElementById('id-maincanvas');
    context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
  }

  function beginRender(){
    context.clear();
  }

  //Does not have animations
  function Tile(spec){
    var that = {};
    var ready = false;
    var image = new Image();
    var animations = [];
    var currentAnimation;
    var counter = 0;
    var frame = 0;
    var animationSpeed = 1;

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.drawAbs = function(xLoc, yLoc){
      if(ready){
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc, yLoc,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.drawCurr = function(){
      if(ready){
        context.save();
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          spec.position.x,spec.position.y,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.setFrame = function(frame){
      spec.clip.x = frame.x*32;
      spec.clip.y = frame.y*32;
    }

    return that;
  }

  //Has animations
  function Sprite(spec){
    var that = {};
    var ready = false;
    var image = new Image();
    var animations = [];
    var currentAnimation;
    var counter = 0;
    var frame = 0;

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.drawAbs = function(xLoc, yLoc){
      if(ready){
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc, yLoc,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.drawCurr = function(){
      if(ready){
        context.save();
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          spec.position.x,spec.position.y,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.setFrame = function(frame){
      spec.clip.x = frame.x*32;
      spec.clip.y = frame.y*32;
    }

    that.jump = function(){
      console.log("WTF");
    }

    that.move = function(x,y){
      spec.position.x += x;
      spec.position.y += y;
    }

    that.getY = function(){
      return spec.position.y;
    }

    that.setPosition = function(x,y){
      spec.position.x = x;
      spec.position.y = y;
    }

    that.addAnimation = function(spec){
      //TODO - filter and check that animations are valid
      animations[spec.name] = spec;
      console.log('Animation Registered');
    }

    //IMPORTANT! You have to set an animation! If you don't set at least one, it'll crash
    that.setAnimation = function(spec){
      currentAnimation = spec;
      counter = 0;
      frame = 0;
    }

    that.animate = function(elapsedTime, speed){
      counter += (elapsedTime*speed);
      //console.log(counter);
      if(counter > (animations[currentAnimation].delay[frame]*20)/speed){
        counter = 0;
        frame++;
        if(frame >= animations[currentAnimation].frames){
          frame = 0;
        }
      }
      that.setFrame({x:animations[currentAnimation].frameX[frame], y:animations[currentAnimation].frameY[frame]});
    }

    return that;
  }

  function Particle(spec){
    var that = {};

    spec.alive = 0;

    that.draw = function(){
      context.save();
      context.translate(spec.position.x + spec.width / 2, spec.position.y + spec.height / 2);
      context.rotate(spec.rotation);
      context.translate(-(spec.position.x + spec.width / 2), -(spec.position.y + spec.height / 2));

      context.fillStyle = spec.fill;
      context.fillRect(spec.position.x, spec.position.y, spec.width, spec.height);

      context.strokeStyle = spec.stroke;
      context.strokeRect(spec.position.x, spec.position.y, spec.width, spec.height);

      context.restore();
    }

    that.update = function(elapsedTime) {
      elapsedTime = elapsedTime / 1000;

      spec.alive += elapsedTime;
      spec.position.x += (elapsedTime * spec.speed * spec.direction.x);
      spec.position.y += (elapsedTime * spec.speed * spec.direction.y);
      if(spec.position.y > 126){
        spec.direction.y *= -.3;
      }

      spec.rotation += spec.speed / 500;

      return (spec.alive < spec.lifetime);
    };

    return that;
  }

  function ParticleSystem(){
    var that = {};
    var particles = [];

    that.add = function(spec){
      var p = Particle(spec);
      particles.push(p);
    }

    that.update = function(elapsedTime){
      var iter;
      for (iter in particles){
        particles[iter].update(elapsedTime);
      }

      var iter;
  		var temp = [];

  		temp.length = 0;
  		for (iter in particles) {
  			if (particles[iter].update(elapsedTime)) {
  				temp.push(particles[iter]);
  			}
  		}
  		particles = temp;
    }

    that.draw = function(){
      var iter;
      for (iter in particles){
        particles[iter].draw();
      }
    }

    return that;
  }

  return{
    initialize: initialize,
    beginRender: beginRender,
    Tile: Tile,
    ParticleSystem: ParticleSystem,
    Sprite: Sprite
  };
}());
