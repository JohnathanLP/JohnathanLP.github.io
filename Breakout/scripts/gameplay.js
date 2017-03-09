  myGame.screens['id-gameplay'] = (function(game){
  'use-strict';
  var cancelNextRequest = false;

  var brickArray = [];

  var particles = [];
  var lastTimeStamp = performance.now();

  var ballPos = {x:224, y:200};
  var ballVel = {x:1, y:3};
  var paddPos = 224;

  let yellowBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:0, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  })

  let blueBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:9, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  })

  let orangeBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:18, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  })

  let greenBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:27, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  })

  let ball = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:8, y:8},
    clip: {x:0, y:36, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let paddle = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:32, y:0},
    clip: {x:0, y:56, w:64, h:8},
    width: 64,
    height: 8,
    rotation: 0
  })

  function drawBricks(){
    for(var i=0; i<14; i++)
    {
      var vertOffset = 40;
      for(var j=0; j<10; j++){
        if(brickArray[i][j] == 1)
        {
          if(j == 1 || j == 2){
            greenBrick.draw(i*32, (j*9)+vertOffset);
          }
          if(j == 3 || j == 4){
            blueBrick.draw(i*32, (j*9)+vertOffset);
          }
          if(j == 5 || j == 6){
            orangeBrick.draw(i*32, (j*9)+vertOffset);
          }
          if(j == 7 || j == 8){
            yellowBrick.draw(i*32, (j*9)+vertOffset);
          }
        }
      }
    }
  }

  function checkCollisions(){
    //paddle
    if(ballPos.y > 292 && ballPos.y < 300){
      var diff = paddPos-ballPos.x;
      if(Math.abs(diff) < 38){
        //TODO special angles on bounce
        ballVel.y *= -1;
        ballVel.x += (diff/-10)-2;
        if(ballVel.x > 10){
          ballVel.x = 10;
        }
        if(ballVel.x < -10){
          ballVel.x = -10;
        }
        console.log(ballVel.x);
      }
    }
    if(ballPos.y>130 || ballPos.y<40){
      return true;
    }
    //bricks above
    var ballCell={x:Math.floor(ballPos.x/32), y:Math.floor((ballPos.y-40)/9)};
    //console.log('ball cell: ', ballCell.x, ' ', ballCell.y);
    if(ballCell.y>0){
      if(brickArray[ballCell.x][ballCell.y-1] == 1){
        ballVel.y *= -1;
        brickArray[ballCell.x][ballCell.y-1]=0;
      }
    }
    //bricks below
    if(ballCell.y<11){
      if(brickArray[ballCell.x][ballCell.y+1] == 1){
        ballVel.y *= -1;
        brickArray[ballCell.x][ballCell.y+1]=0;
      }
    }
    //bricks to left
    if(ballPos.x % 32 < 8){
      if(ballCell.x>0){
        if(brickArray[ballCell.x-1][ballCell.y] == 1){
          ballVel.x *= -1;
          brickArray[ballCell.x-1][ballCell.y]=0;
        }
      }
    }
    //bricks to right
    if(ballPos.x % 32 > 24){
      if(ballCell.x<13){
        if(brickArray[ballCell.x+1][ballCell.y] == 1){
          ballVel.x *= -1;
          brickArray[ballCell.x+1][ballCell.y]=0;
        }
      }
    }
  }

  function initialize(){
    Graphics.initialize();
  }

  function moveBall(){
    ballPos.x += ballVel.x;
    ballPos.y += ballVel.y;
    if(ballPos.x < 8){
      ballVel.x *= -1;
    }
    if(ballPos.y < 8){
      ballVel.y *= -1;
    }
    if(ballPos.x > 440){
      ballVel.x *= -1;
    }
    if(ballPos.y > 328){
      ballVel.y *= -1;
    }
  }

  function update(elapsedTime){
    moveBall();
    checkCollisions();
    var particle = 0;
    var aliveParticles = [];
    var p;

    aliveParticles.length = 0;
    for(particle=0; particle<particles.length; particle++){
      if(particles[particle].update(elapsedTime)){
        aliveParticles.push(particles[particle]);
      }
    }
    particles = aliveParticles;

    for(particle=0; particle<2; particle++){
      p={
          position:{x:ballPos.x+Random.nextGaussian(0,2), y:ballPos.y+Random.nextGaussian(0,2)},
          direction:Random.nextCircleVector(),
          speed:Random.nextGaussian(5,3),
          rotation:0,
          stroke: 'rgba(255,'+Math.floor(Random.nextGaussian(150,100))+', 0, 1)',
          lifetime:Random.nextGaussian(0,1)
      };
      particles.push(Graphics.Particle(p));
    }
  }

  function render(){
    Graphics.beginRender();
    drawBricks();
    paddle.draw(paddPos,300);
    // ballPos = {x:224, y:168};
    var particle;
    for(particle=0; particle<particles.length; particle++){
      particles[particle].draw();
    }
    ball.draw(ballPos.x,ballPos.y);
  }

  function gameLoop(time){
    var elapsedTime = (time-lastTimeStamp);
    update(elapsedTime);
    lastTimeStamp=time;
    render();
    requestAnimationFrame(gameLoop);
  }

  function run(){

    //initialize brickArray
    for(var i=0; i<14; i++){
      brickArray.push(new Array(10));
    }
    for(var i=0; i<14; i++)
    {
      for(var j=0; j<10; j++){
        if(j == 0 || j == 9){
          brickArray[i][j] = 0;
        }else{
          brickArray[i][j] = 1;
        }
      }
    }

    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return{
    initialize: initialize,
    run: run
  };
}(myGame.game));
