  myGame.screens['id-gameplay'] = (function(game){
  'use-strict';
  var cancelNextRequest = false;

  var myKeyboard = myGame.input.Keyboard();

  var brickArray = [];

  var particles = [];
  var lastTimeStamp = performance.now();

  var ballPos = {x:224, y:200};
  var ballVel = {x:1, y:3};
  var paddPos = 224;

  var lives = 3;

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

  let life = Graphics.Texture({
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

  function drawLives(){
    for(var i=0; i<lives; i++){
      paddle.draw(400-(70*i),20);
    }
  }

  function checkCollisions(){
    //paddle
    if(ballPos.y > 292 && ballPos.y < 300 && ballVel.y > 0){
      var diff = ballPos.x - paddPos;
      if(diff <= 36 && diff >= -36){
        ballVel.y *= -1;
        ballVel.x += (diff/10);
        //limit horizontal speed to 7
        if(ballVel.x > 7){
          ballVel.x = 7;
        }
        if(ballVel.x < -7){
          ballVel.x = -7;
        }
      }
    }

    function breakBrick(xIn,yIn){
      //TODO - breaking brick particles
      if(yIn > 0){
        if(yIn < 9){
          var strokeString = 'rgba(250, 250, 0, 1)'
        }
        if(yIn < 7){
          var strokeString = 'rgba(250, 100, 0, 1)'
        }
        if(yIn < 5){
          var strokeString = 'rgba(0, 0, 250, 1)'
        }
        if(yIn < 3){
          var strokeString = 'rgba(0, 250, 0, 1)'
        }
      }
      for(particle=0; particle<50; particle++){
        p={
            position:{x:(xIn*32)+16+Random.nextGaussian(0,8), y:(yIn*8)+49+Random.nextGaussian(0,2)},
            direction:Random.nextCircleVector(),
            //direction:{x:0, y:1},
            //direction:{x:ballVel.x, y:ballVel.y+Random.nextGaussian(3,2)},
            speed:Random.nextGaussian(15,4),
            rotation:0,
            stroke: strokeString,
            lifetime:Random.nextGaussian(1,.5)
        };
        particles.push(Graphics.Particle(p));
      }
      brickArray[xIn][yIn]=0;
    }

    //bricks
    var xFlag = false;
    var yFlag = false;
    if(ballPos.y<=130 && ballPos.y>=40){
      var ballCell={x:Math.floor(ballPos.x/32), y:Math.floor((ballPos.y-40)/9)};
      console.log('x: ', ballCell.x, 'y: ', ballCell.y);
      //bricks above
      if(ballCell.y>0){
        if(brickArray[ballCell.x][ballCell.y-1] == 1){
          yFlag = true;
          breakBrick(ballCell.x, ballCell.y-1);
        }
      }
      //bricks below
      if(ballCell.y<11){
        if(brickArray[ballCell.x][ballCell.y+1] == 1){
          yFlag = true;
          breakBrick(ballCell.x, ballCell.y+1);
        }
      }
      //bricks to right
      if(ballPos.x % 32 > 24){
        if(ballCell.x<13){
          if(brickArray[ballCell.x+1][ballCell.y] == 1){
            xFlag = true;
            breakBrick(ballCell.x+1, ballCell.y);
          }
          //down and to the right
          // if(brickArray[ballCell.x+1][ballCell.y+1] == 1){
          //   xFlag = true;
          //   yFlag = true;
          //   breakBrick(ballCell.x+1, ballCell.y+1);
          // }
          // //up and to the right
          // if(brickArray[ballCell.x+1][ballCell.y-1] == 1){
          //   xFlag = true;
          //   yFlag = true;
          //   breakBrick(ballCell.x+1, ballCell.y-1);
          // }
        }
      }
      //bricks to left
      if(ballPos.x % 32 < 8){
        if(ballCell.x>0){
          if(brickArray[ballCell.x-1][ballCell.y] == 1){
            xFlag = true;
            breakBrick(ballCell.x-1, ballCell.y);
          }
          //down and to the left
          // if(brickArray[ballCell.x-1][ballCell.y+1] == 1){
          //   xFlag = true;
          //   yFlag = true;
          //   breakBrick(ballCell.x-1, ballCell.y+1);
          // }
          // //up and to the left
          // if(brickArray[ballCell.x-1][ballCell.y-1] == 1){
          //   xFlag = true;
          //   yFlag = true;
          //   breakBrick(ballCell.x-1, ballCell.y-1);
          // }
        }
      }
      if(xFlag){
        ballVel.x *= -1;
      }
      if(yFlag){
        ballVel.y *= -1;
      }
    }
  }

  function initialize(){
    Graphics.initialize();
    myKeyboard.registerCommand(KeyEvent.DOM_VK_A, paddle.moveLeft);
  	myKeyboard.registerCommand(KeyEvent.DOM_VK_D, paddle.moveRight);
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
      //uncomment this line for testing
      ballVel.y *= -1;
      lives -= 1;
    }
  }

  function update(elapsedTime){
    moveBall();
    if(ballVel.x > 0){
      ball.rotate(.1);
    }
    else{
      ball.rotate(-.1);
    }
    checkCollisions();
    var particle = 0;
    var aliveParticles = [];
    var p;

    //console.log('Padddle position: ', paddPos);

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
          speed:Random.nextGaussian(10,10),
          rotation:0,
          stroke: 'rgba(255,'+Math.floor(Random.nextGaussian(150,100))+', 0, 1)',
          lifetime:Random.nextGaussian(0,.5)
      };
      particles.push(Graphics.Particle(p));
    }
    myKeyboard.update(elapsedTime);
  }

  function render(){
    Graphics.beginRender();
    drawBricks();
    paddle.draw(paddPos,300);
    drawLives();
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

  function movePaddleRight(){
    if(paddPos <= 416){
      paddPos += 5;
    }
  }

  function movePaddleLeft(){
    if(paddPos >= 32){
      paddPos -= 5;
    }
  }

  return{
    initialize: initialize,
    run: run,
    movePaddleLeft: movePaddleLeft,
    movePaddleRight: movePaddleRight
  };
}(myGame.game));
