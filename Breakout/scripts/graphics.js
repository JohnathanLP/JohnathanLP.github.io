let Graphics = (function(){
  let context = null;
  function initialize(){
    let canvas = document.getElementById('id-canvasmain');
    context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
  }

  function Text(spec) {
		var that = {};

		that.updateRotation = function(angle) {
			spec.rotation += angle;
		};

		function measureTextHeight(spec) {
			context.save();

			context.font = spec.font;
			context.fillStyle = spec.fill;
			context.strokeStyle = spec.stroke;

			var height = context.measureText('m').width;

			context.restore();

			return height;
		}

		function measureTextWidth(spec) {
			context.save();

			context.font = spec.font;
			context.fillStyle = spec.fill;
			context.strokeStyle = spec.stroke;

			var width = context.measureText(spec.text).width;

			context.restore();

			return width;
		}

		that.draw = function() {
			context.save();

			context.font = spec.font;
			context.fillStyle = spec.fill;
			context.strokeStyle = spec.stroke;
			context.textBaseline = 'top';

			context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
			context.rotate(spec.rotation);
			context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

			context.fillText(spec.text, spec.pos.x, spec.pos.y);
			context.strokeText(spec.text, spec.pos.x, spec.pos.y);

			context.restore();
		};

    that.setText = function(stringIn) {
      spec.text = stringIn;
    };

    that.centerText = function(){
      spec.pos.x = 224-(measureTextWidth(spec)/2);
      spec.pos.y = 168-(measureTextHeight(spec)/2);
    };

    //Makes public some info about the text, it was breaking things so I commented it out
		//that.height = measureTextHeight(spec);
		//that.width = measureTextWidth(spec);
		that.pos = spec.pos;

		return that;
	}

  function Texture(spec) {
    var that = {};
    var ready = false;
    var image = new Image();

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.draw = function(xLoc, yLoc){
      if(ready){
        context.save();
        //context.translate(spec.center.x, spec.center.y);
        context.translate(xLoc, yLoc);
        context.rotate(spec.rotation);
        //context.translate(-spec.center.x, -spec.center.y);
        context.translate(-xLoc, -yLoc);

        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc-spec.center.x, yLoc-spec.center.y,
          spec.clip.w, spec.clip.h);

        context.restore();
      }
    }

    that.moveRight = function(){
      //console.log('move right');
      myGame.screens['id-gameplay'].movePaddleRight();
      //console.log('paddPos: ', myGame.screens['id-gameplay'].paddPos);
    }

    that.moveLeft = function(){
      //console.log('move left');
      myGame.screens['id-gameplay'].movePaddleLeft();
      //console.log('paddPos: ', myGame.screens['id-gameplay'].paddPos);
    }

    that.setClip = function(clipSpec){
      spec.clip.x = clipSpec.x;
      spec.clip.y = clipSpec.y;
      spec.clip.w = clipSpec.w;
      spec.clip.h = clipSpec.h;
      spec.center.x = clipSpec.center.x;
      spec.center.y = clipSpec.center.y;
    }

    that.rotate = function(rot){
      spec.rotation += rot;
    }

    return that;
  }

  function Particle(spec) {
		var that = {};

		spec.width = 1;
		spec.height = 1;
		spec.fill = 'rgba(255, 255, 255, 1)';
		spec.alive = 0;

		that.update = function(elapsedTime) {
			//
			// We work with time in seconds, elapsedTime comes in as milliseconds
			elapsedTime = elapsedTime / 1000;
			//
			// Update how long it has been alive
			spec.alive += elapsedTime;

			//
			// Update its position
			spec.position.x += (elapsedTime * spec.speed * spec.direction.x);
			spec.position.y += (elapsedTime * spec.speed * spec.direction.y);

			//
			// Rotate proportional to its speed
			spec.rotation += spec.speed / 500;

			//
			// Return true if this particle is still alive
			return (spec.alive < spec.lifetime);
		};

		that.draw = function() {
			context.save();
			context.translate(spec.position.x + spec.width / 2, spec.position.y + spec.height / 2);
			context.rotate(spec.rotation);
			context.translate(-(spec.position.x + spec.width / 2), -(spec.position.y + spec.height / 2));

			context.fillStyle = spec.fill;
			context.fillRect(spec.position.x, spec.position.y, spec.width, spec.height);

			context.strokeStyle = spec.stroke;
			context.strokeRect(spec.position.x, spec.position.y, spec.width, spec.height);

			context.restore();
		};

		return that;
	}

  function beginRender(){
    context.clear();
  }

  return{
    beginRender: beginRender,
    initialize: initialize,
    Texture: Texture,
    Particle: Particle,
    Text: Text
  }
}());
