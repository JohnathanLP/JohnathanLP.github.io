let Graphics = (function(){
  let context = null
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
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc-spec.center.x, yLoc-spec.center.y,
          spec.clip.w, spec.clip.h);

        context.restore();
      }
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
    Particle: Particle
  }
}());
