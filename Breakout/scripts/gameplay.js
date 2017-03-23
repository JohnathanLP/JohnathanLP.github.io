  myGame.screens['id-gameplay'] = (function(game){
  'use-strict';
  var cancelNextRequest = false;

  var myKeyboard = myGame.input.Keyboard();

  var brickArray = [];

  var particles = [];
  var lastTimeStamp = performance.now();

  var ballPos = {x:224, y:200};
  var ballVel = {x:1, y:1};
  var paddPos = 224;

  var lives = 3;
  var score = 0;

  var newBall = true;
  var newBallCountdown = 0;
  var gameOver = false;
  var smallPaddle = false;
  var bricksBroken = 0;

  let yellowBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:0, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  });

  let blueBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:9, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  });

  let orangeBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:18, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  });

  let greenBrick = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:0, y:0},
    clip: {x:0, y:27, w:32, h:8},
    width: 32,
    height: 8,
    rotation: 0
  });

  let ball = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:8, y:8},
    clip: {x:0, y:36, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  });

  let paddle = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:32, y:0},
    clip: {x:0, y:56, w:64, h:8},
    width: 64,
    height: 8,
    rotation: 0
  });

  let life = Graphics.Texture({
    imageSource: 'images/breakouttextures.png',
    center: {x:32, y:0},
    clip: {x:0, y:56, w:64, h:8},
    width: 64,
    height: 8,
    rotation: 0
  });

  let scoreDisp = Graphics.Text({
    text : 'Score: 0',
    font : '20px Courier New, sans-serif',
    fill : 'rgba(200, 200, 200, 1)',
    stroke : 'rgba(200, 200, 200, 1)',
    pos : {x : 10, y : 10},
    rotation : 0
  });
  let messDisp = Graphics.Text({
    text : '3...',
    font : '30px Courier New, sans-serif',
    fill : 'rgba(200, 200, 200, 1)',
    stroke : 'rgba(200, 200, 200, 1)',
    pos : {x : 145, y : 150},
    rotation : 0
  });

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
      life.draw(400-(70*i),20);
    }
  }

  function checkCollisions(){
    //paddle
    if(ballPos.y > 292 && ballPos.y < 300 && ballVel.y > 0){
      var diff = ballPos.x - paddPos;
      var thresh = 40;
      if(smallPaddle){
        thresh = 20;
      }
      if(diff <= thresh && diff >= -thresh){
        ballVel.y *= -1;
        ballVel.x += (diff/10);
        //limit horizontal speed to 7
        if(ballVel.x > 5){
          ballVel.x = 5;
        }
        if(ballVel.x < -5){
          ballVel.x = -5;
        }
      }
      console.log('velocity: x: ', ballVel.x, ' y: ', ballVel.y);
    }

    function breakBrick(xIn,yIn){
      //TODO - breaking brick particles
      if(yIn == 1 && !smallPaddle){
        //console.log('top row');
        paddle.setClip({
          x:16,
          y:56,
          w:32,
          h:8,
          center:{x:16,y:0}
        });
        smallPaddle = true;
      }
      if(yIn > 0){
        if(yIn < 9){
          var strokeString = 'rgba(250, 250, 0, 1)'
          score += 1;
        }
        if(yIn < 7){
          var strokeString = 'rgba(250, 100, 0, 1)'
          score += 2;
        }
        if(yIn < 5){
          var strokeString = 'rgba(0, 0, 250, 1)'
          score += 3;
        }
        if(yIn < 3){
          var strokeString = 'rgba(0, 250, 0, 1)'
          score += 5;
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
      bricksBroken++;
      if(bricksBroken >= 0 && bricksBroken < 4){
        if(ballVel.y < 0){
          ballVel.y = -1;
        }
        else{
          ballVel.y = 1;
        }
      }
      else if(bricksBroken >= 4 && bricksBroken < 12){
        if(ballVel.y < 0){
          ballVel.y = -2;
        }
        else{
          ballVel.y = 2;
        }
      }
      else if(bricksBroken >= 12 && bricksBroken < 36){
        if(ballVel.y < 0){
          ballVel.y = -3;
        }
        else{
          ballVel.y = 3;
        }
      }
      else if(bricksBroken >= 62){
        if(ballVel.y < 0){
          ballVel.y = -4;
        }
        else{
          ballVel.y = 4;
        }
      }
      var fullRow = true;
      for(var i=0; i<14; i++){
        if(brickArray[i][yIn] == 1){
          fullRow = false;
        }
      }
      if(fullRow){
        score += 25;
      }
    }

    //bricks
    var xFlag = false;
    var yFlag = false;
    if(ballPos.y<=130 && ballPos.y>=40){
      var ballCell={x:Math.floor(ballPos.x/32), y:Math.floor((ballPos.y-40)/9)};
      //console.log('x: ', ballCell.x, 'y: ', ballCell.y);

      //bricks above
      if(ballCell.y>0){
        if(brickArray[ballCell.x][ballCell.y-1] == 1){
          yFlag = true;
          breakBrick(ballCell.x, ballCell.y-1);
        }
        //right up diag
        else if(ballPos.x % 32 > 24 && brickArray[ballCell.x+1][ballCell.y-1] == 1){
          yFlag = true;
          breakBrick(ballCell.x+1, ballCell.y-1);
        }
        //left up diag
        else if(ballPos.x % 32 < 8 && brickArray[ballCell.x-1][ballCell.y-1] == 1){
          yFlag = true;
          breakBrick(ballCell.x-1, ballCell.y-1);
        }
      }
      //bricks below
      else if(ballCell.y<11){
        if(brickArray[ballCell.x][ballCell.y+1] == 1){
          yFlag = true;
          breakBrick(ballCell.x, ballCell.y+1);
        }
        //right down diag
        else if(ballPos.x % 32 > 24 && brickArray[ballCell.x+1][ballCell.y+1] == 1){
          yFlag = true;
          breakBrick(ballCell.x+1, ballCell.y+1);
        }
        //left down diag
        else if(ballPos.x % 32 < 8 && brickArray[ballCell.x-1][ballCell.y+1] == 1){
          yFlag = true;
          breakBrick(ballCell.x-1, ballCell.y+1);
        }
      }
      //bricks to right
      else if(ballPos.x % 32 > 24){
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
      else if(ballPos.x % 32 < 8){
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
    myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
  	myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);
    document.getElementById('id-button-gpreturntomenu').addEventListener(
      'click',
      function(){
        game.showScreen('id-menu');
        cancelNextRequest = true;
      });
  }

  function moveBall(){
    ballPos.x += ballVel.x;
    ballPos.y += ballVel.y;
    if(ballPos.x < 8){
      ballPos.x = 8;
      ballVel.x *= -1;
    }
    if(ballPos.y < 8){
      ballVel.y *= -1;
    }
    if(ballPos.x > 440){
      ballPos.x = 440;
      ballVel.x *= -1;
    }
    if(ballPos.y > 400){
      //uncomment this line for testing
      //ballVel.y *= -1;
      lives -= 1;
      if(lives > 0){
        newBall = true;
        ballPos = {x:224, y:200};
        ballVel = {x:Random.nextGaussian(0,2), y:1};
      }
    }
    if(ballPos.y > 200){
      //ballVel.y *= -1;
    }
  }

  function ballStart(elapsedTime){
    if(smallPaddle)
    {
      paddle.setClip({
        x:0,
        y:56,
        w:64,
        h:8,
        center:{x:32,y:0}
      });
      smallPaddle = false;
    }
    newBallCountdown += elapsedTime;
    if(newBallCountdown >= 0 && newBallCountdown < 1000){
      messDisp.setText('3...');
    }
    if(newBallCountdown >= 1000 && newBallCountdown < 2000){
      messDisp.setText('2...');
    }
    if(newBallCountdown >= 2000 && newBallCountdown < 3000){
      messDisp.setText('1...');
    }
    messDisp.centerText();
    //console.log(newBallCountdown);
    if(newBallCountdown >= 3000){
      newBall = false;
      newBallCountdown = 0;
    }
  }

  function update(elapsedTime){
    //If not waiting for a new ball...
    if(!newBall && !gameOver){
        moveBall();
        checkCollisions();
    }
    //If waiting for a new ball...
    else if(!gameOver){
        ballStart(elapsedTime);
    }
    //Always
    if(lives < 0){
      gameOver = true;
      messDisp.setText('Game Over!');
      messDisp.centerText();
      Persistence.add(score,score);
    }

    if(bricksBroken >= 112){
      gameOver = true;
      messDisp.setText('You win!');
      messDisp.centerText();
      Persistence.add(score,score);
    }
    var particle = 0;
    var aliveParticles = [];
    var p;

    scoreDisp.setText('Score: ' + score);

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
    if(ballVel.x > 0){
      ball.rotate(.05*ballVel.x);
    }
    else{
      ball.rotate(.05*ballVel.x);
    }
  }

  function render(){
    Graphics.beginRender();
    drawBricks();
    paddle.draw(paddPos,300);
    drawLives();
    scoreDisp.draw();
    // ballPos = {x:224, y:168};
    var particle;
    for(particle=0; particle<particles.length; particle++){
      particles[particle].draw();
    }
    ball.draw(ballPos.x,ballPos.y);
    if(newBall || gameOver){
      messDisp.draw();
    }
  }

  function gameLoop(time){
    var elapsedTime = (time-lastTimeStamp);
    update(elapsedTime);
    lastTimeStamp=time;
    render();
    if(!cancelNextRequest){
      requestAnimationFrame(gameLoop);
    }
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

    paddle.setClip({
      x:0,
      y:56,
      w:64,
      h:8,
      center:{x:32,y:0}
    });

    score = 0;
    newBall = true;
    lives = 3;
    gameOver = false;
    smallPaddle = false;
    ballPos = {x:224, y:200};
    ballVel = {x:Random.nextGaussian(0,2), y:1};
    paddPos = 224;
    newBallCountdown = -1000;
    bricksBroken = 0;

    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  function movePaddleRight(){
    if(!smallPaddle){
      if(paddPos <= 416){
        paddPos += 5;
      }
    }
    else{
      if(paddPos <= 432){
        paddPos += 5;
      }
    }
  }

  function movePaddleLeft(){
    if(!smallPaddle){
      if(paddPos >= 32){
        paddPos -= 5;
      }
    }
    else{
      if(paddPos >= 16){
        paddPos -= 5;
      }
    }
  }

  return{
    initialize: initialize,
    run: run,
    movePaddleLeft: movePaddleLeft,
    movePaddleRight: movePaddleRight
  };
}(myGame.game));
