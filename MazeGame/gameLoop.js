//graphics library
let Graphics = (function(){
  let context = null;

  function initialize(){
    let canvas = document.getElementById('canvas-main');
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
        //not needed unless you want to rotate textures
        // context.translate(spec.center.x, spec.center.y);
        // context.rotate(spec.rotation);
        // context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc, yLoc,
          spec.clip.w, spec.clip.h);

        context.restore();
      }
    }
    return that;
  }

  function beginRender(){
    context.clear();
  }

  return {
    beginRender: beginRender,
    initialize: initialize,
    Texture: Texture
  };
}());

let myGame = (function(){
  let that = [];
  //Size of maze in terms of cells
  let mazeSize = 5;

  let playX = 0;
  let playY = 0;

  let inputQueue = [];

  let hsArray = [];

  let floorCell = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:8},
    clip: {x:0, y:0, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let startTile = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:4, y:4},
    clip: {x:22, y:9, w:8, h:8},
    width: 8,
    height: 8,
    rotation: 0
  })

  let endTile = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:4, y:4},
    clip: {x:22, y:0, w:8, h:8},
    width: 8,
    height: 8,
    rotation: 0
  })

  let wallCorner = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:17, y:17, w:4, h:4},
    width: 4,
    height: 4,
    rotation: 0
  })

  let wallVert = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:8},
    clip: {x:17, y:0, w:4, h:16},
    width: 4,
    height: 16,
    rotation: 0
  })

  let wallHori = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:2},
    clip: {x:0, y:17, w:16, h:4},
    width: 16,
    height: 4,
    rotation: 0
  })

  let playerOrb = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:4, y:4},
    clip: {x:20, y:21, w:10, h:10},
    width: 8,
    height: 8,
    rotation: 0
  })

  let solDot = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:0, y:22, w:4, h:4},
    width: 4,
    height: 4,
    rotation: 0
  })

  let crumbDot = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:5, y:22, w:4, h:4},
    width: 4,
    height: 4,
    rotation: 0
  })

  let hintDot = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:10, y:22, w:4, h:4},
    width: 4,
    height: 4,
    rotation: 0
  })

  //Stores maze
  var mazeArray = []; //holds a 0 for empty spaces, a 1 for full spaces
  //Used for maze generation
  var wallArray = []; //Stores all walls of the maze
  //used to help solve maze, give hints, etc.
  var solArray = [];
  //keeps track of where you have been, used for breadcrumbs and score
  var crumbArray = [];

  //Size of mazeArray
  var wide=9;
  var high=9;

  //Position of start (Currently used only for generation)
  //THIS IS ACTUALLY THE END OF THE MAZE
  var startX=8;
  var startY=8;

  //Sets to true if maze is solved, prevents further movement
  var solved = false;

  var showSol = false;
  var showHint = false;
  var showCrumb = false;
  var showScore = true;

  var score = 0;

  /*Takes height and width in terms of cells only! This means that the actual
  array will end up being (2*height)+1 by (2*width)+1 to include edges.*/
  function generateMaze(){
    //clear the maze
    mazeArray.splice(0,mazeArray.length);

    for(var i=0; i<high; i++){
      mazeArray.push(new Array(wide));
    }

    //initialize the maze to the correct size, fill with 0's
    for(var i=0; i<high; i++){
      for(var j=0; j<wide; j++){
        mazeArray[i][j] = 0;
      }
    }

    solArray.splice(0,solArray.length);
    crumbArray.splice(0,solArray.length);

    for(var i=0; i<mazeSize; i++){
      solArray.push(new Array(mazeSize));
      crumbArray.push(new Array(mazeSize));
    }

    //also intitializes the solArray
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize; j++){
        solArray[i][j] = -1;
        crumbArray[i][j] = 0;
      }
    }

    crumbArray[0][0] = 1;

    //set starting space to cell
    mazeArray[startX][startY] = 1;
    //add walls of starting space to wall list
    addWall(startX,startY);

    var tempX;
    var tempY;
    while(wallArray.length > 0){
      var randIndex = Math.floor(Math.random()*wallArray.length);
      tempX = wallArray[randIndex].x;
      tempY = wallArray[randIndex].y;

      //horizontal
      if(tempX%2 == 0){
        if(mazeArray[tempX][tempY+1] == 0){
          mazeArray[tempX][tempY] = 1;
          mazeArray[tempX][tempY+1] = 1;
          addWall(tempX,tempY+1);
          solArray[tempX/2][(tempY+1)/2] = 0;
        }
        else if (mazeArray[tempX][tempY-1] == 0){
          mazeArray[tempX][tempY] = 1;
          mazeArray[tempX][tempY-1] = 1;
          addWall(tempX,tempY-1);
          solArray[tempX/2][(tempY-1)/2] = 2;
        }
      }
      //vertical
      else {
        if(mazeArray[tempX+1][tempY] == 0 ){
          mazeArray[tempX][tempY] = 1;
          mazeArray[tempX+1][tempY] = 1;
          addWall(tempX+1,tempY);
          solArray[(tempX+1)/2][tempY/2] = 3;
        }
        else if(mazeArray[tempX-1][tempY] == 0){
          mazeArray[tempX][tempY] = 1;
          mazeArray[tempX-1][tempY] = 1;
          addWall(tempX-1,tempY);
          solArray[(tempX-1)/2][tempY/2] = 1;
        }
      }
      //console.log('Splicing ', randIndex);
      wallArray.splice(randIndex, 1);
    }
  }

  //Given a cell, adds any appropriate walls to wallArray - Used for generation
  function addWall(xIn,yIn){
    //console.log('adding walls around ', xIn, ' ', yIn);
    if(xIn+1 < wide-1){
      if(mazeArray[xIn+1][yIn] == 0){
        wallArray.push({
          x:xIn+1,
          y:yIn
        });
        //console.log('Created a wall at ', xIn+1, ',', yIn);
      }
    }
    if(yIn-1 > 0){
      if(mazeArray[xIn][yIn-1] == 0){
        wallArray.push({
          x:xIn,
          y:yIn-1
        });
        //console.log('Created a wall at ', xIn, ',', yIn-1);
      }
    }
    if(xIn-1 > 0){
      if(mazeArray[xIn-1][yIn] == 0){
        wallArray.push({
          x:xIn-1,
          y:yIn
        });
        //console.log('Created a wall at ', xIn-1, ',', yIn);
      }
    }
    if(yIn+1 < high-1){
      if(mazeArray[xIn][yIn+1] == 0){
        wallArray.push({
          x:xIn,
          y:yIn+1
        });
        //console.log('Created a wall at ', xIn, ',', yIn+1);
      }
    }
    //console.log('wallArray length is now' , wallArray.length);
  }

  //Called whenever a button is pressed to make a new maze - takes maze size in cells
  that.newMaze = function(size){
    //Gets canvas object
    let canvas = document.getElementById('canvas-main');
    //Resizes canvas object
    canvas.width = size*16;
    canvas.height = size*16;

    //Sets array sizes correctly
    high = (size*2)-1;
    wide = high;

    //Sets mazeSize correctly
    mazeSize = size;

    //sets player Position
    playX = 0;
    playY = 0;

    //resets solved
    solved = false;

    score = 0;

    startX = wide-1;
    startY = high-1;

    showHint = false;
    showCrumb = false;
    showSol = false;

    //generates a new maze
    generateMaze();
  }

  that.toggleScore = function(){
    if(showScore){
      var scoreDisplay = document.getElementById('id-score');
      scoreDisplay.style.display = 'none';
      var scoreLabel = document.getElementById('id-scorelabel');
      scoreLabel.style.display = 'none';
      showScore = false;
    }
    else{
      var scoreDisplay = document.getElementById('id-score');
      scoreDisplay.style.display = 'inline';
      var scoreLabel = document.getElementById('id-scorelabel');
      scoreLabel.style.display = 'inline';
      showScore = true;
    }
  }

  function drawSol(){
    var solX = playX;
    var solY = playY;
    while(solX != mazeSize-1 || solY != mazeSize-1){
      if(solArray[solX][solY] == 0){
        solY--;
      }
      else if(solArray[solX][solY] == 1){
        solX++;
      }
      else if(solArray[solX][solY] == 2){
        solY++;
      }
      else if(solArray[solX][solY] == 3){
        solX--;
      }

      solDot.draw((solX*16)+6,(solY*16)+6);
    }
  }

  function drawCrumbs(){
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize; j++){
        if(crumbArray[i][j] == 1){
          crumbDot.draw((i*16)+6,(j*16)+6);
        }
      }
    }
  }

  function drawHint(){
    if(solArray[playX][playY] == 0){
      hintDot.draw(((playX)*16)+6,((playY-1)*16)+6);
    }
    else if(solArray[playX][playY] == 1){
      hintDot.draw(((playX+1)*16)+6,((playY)*16)+6);
    }
    else if(solArray[playX][playY] == 2){
      hintDot.draw(((playX)*16)+6,((playY+1)*16)+6);
    }
    else if(solArray[playX][playY] == 3){
      hintDot.draw(((playX-1)*16)+6,((playY+-1)*16)+6);
    }
  }

  function drawMaze(){
    //draw floor
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize; j++){
        floorCell.draw(i*16, j*16);
      }
    }

    //draw interior walls
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize-1; j++){
        if(mazeArray[i*2][(j*2)+1] == 0){
          wallHori.draw(i*16, ((j+1)*16)-2);
        }
      }
    }
    for(var i=0; i<mazeSize-1; i++){
      for(var j=0; j<mazeSize; j++){
        if(mazeArray[(i*2)+1][j*2] == 0){
          wallVert.draw(((i+1)*16)-2, j*16);
        }
      }
    }

    //draw exterior walls
    for(var i=0; i<mazeSize; i++){
      wallHori.draw(i*16, -2);
      wallHori.draw(i*16, (mazeSize*16)-2);
    }
    for(var i=0; i<mazeSize; i++){
      wallVert.draw(-2, i*16);
      wallVert.draw((mazeSize*16)-2,i*16);
    }

    //draw corners
    for(var i=0; i<=mazeSize; i++){
      for(var j=0; j<=mazeSize; j++){
        wallCorner.draw((i*16)-2,(j*16)-2);
      }
    }

    //draw start and finish
    startTile.draw(4,4);
    endTile.draw((mazeSize*16)-12,(mazeSize*16)-12);
  }

  function update(){
    processInput();
  }

  function processInput() {
  	for (input in inputQueue) {
      if(inputQueue[input] == 80){
        showSol = !showSol;
      }
      if(inputQueue[input] == 72){
        showHint = !showHint;
      }
      if(inputQueue[input] == 66){
        showCrumb = !showCrumb;
      }
      if(inputQueue[input] == 89){
        myGame.toggleScore();
      }
      moveCharacter(inputQueue[input]);
  	}
  	inputQueue = {};
  }

  function moveCharacter(input){
    if(!solved){
      //up
      if(input == 38 || input == 87 || input == 73){
        if(playY > 0){
          if(crumbArray[playX][playY-1] != 1){
            if(solArray[playX][playY] == 0){
              score += 5;
            }
            else{
              score -= 2;
            }
          }
          if(mazeArray[playX*2][(playY*2)-1] == 1){
            playY--;
          }
        }
      }
      //down
      if(input == 40 || input == 75 || input == 83){
        if(playY < mazeSize-1){
          if(crumbArray[playX][playY+1] != 1){
            if(solArray[playX][playY] == 2){
              score += 5;
            }
            else{
              score -= 2;
            }
          }
          if(mazeArray[playX*2][(playY*2)+1] == 1){
            playY++;
          }
        }
      }
      //right
      if(input == 39 || input == 76 || input == 68){
        if(playX < mazeSize-1){
          if(crumbArray[playX+1][playY] != 1){
            if(solArray[playX][playY] == 1){
              score += 5;
            }
            else{
              score -= 2;
            }
          }
          if(mazeArray[(playX*2)+1][playY*2] == 1){
            playX++;
          }
        }
      }
      //left
      if(input == 37 || input == 65 || input == 74){
        if(playX > 0){
          if(crumbArray[playX-1][playY] != 1){
            if(solArray[playX][playY] == 3){
              score += 5;
            }
            else{
              score -= 2;
            }
          }
          if(mazeArray[(playX*2)-1][playY*2] == 1){
            playX--;
          }
        }
      }
      if(playX == mazeSize-1 && playY == mazeSize-1){
        solved = true;
        if(score > hsArray[0].score){
          hsArray.splice(0,0,{score:score,time:Math.floor(performance.now()/1000),size:mazeSize})
          hsArray.splice(5,1);
        }
        else if(score > hsArray[1].score){
          hsArray.splice(1,0,{score:score,time:Math.floor(performance.now()/1000),size:mazeSize})
          hsArray.splice(5,1);
        }
        else if(score > hsArray[2].score){
          hsArray.splice(2,0,{score:score,time:Math.floor(performance.now()/1000),size:mazeSize})
          hsArray.splice(5,1);
        }
        else if(score > hsArray[3].score){
          hsArray.splice(3,0,{score:score,time:Math.floor(performance.now()/1000),size:mazeSize})
          hsArray.splice(5,1);
        }
        else if(score > hsArray[4].score){
          hsArray.splice(4,0,{score:score,time:Math.floor(performance.now()/1000),size:mazeSize})
          hsArray.splice(5,1);
        }
      }
      crumbArray[playX][playY] = 1;
    }
  }

  function render(){
    Graphics.beginRender();
    document.getElementById('id-score').innerHTML = score;
    document.getElementById('id-time').innerHTML = Math.floor((performance.now()/1000));

    if(hsArray[0].score != 0){
      document.getElementById('id-hs1').innerHTML = (hsArray[0].score+' points, '+hsArray[0].time+' seconds, size '+hsArray[0].size);
    }
    if(hsArray[1].score != 0){
      document.getElementById('id-hs2').innerHTML = (hsArray[1].score+' points, '+hsArray[1].time+' seconds, size '+hsArray[1].size);
    }
    if(hsArray[2].score != 0){
      document.getElementById('id-hs3').innerHTML = (hsArray[2].score+' points, '+hsArray[2].time+' seconds, size '+hsArray[2].size);
    }
    if(hsArray[3].score != 0){
      document.getElementById('id-hs4').innerHTML = (hsArray[3].score+' points, '+hsArray[3].time+' seconds, size '+hsArray[3].size);
    }
    if(hsArray[4].score != 0){
      document.getElementById('id-hs5').innerHTML = (hsArray[4].score+' points, '+hsArray[4].time+' seconds, size '+hsArray[4].size);
    }

    drawMaze();
    if(showCrumb){
      drawCrumbs();
    }
    if(showSol){
      drawSol();
    }
    if(showHint){
      drawHint();
    }
    drawPlayer();
  }

  function gameLoop(){
    update();
    render();

    requestAnimationFrame(gameLoop);
  }

  function drawPlayer(){
    playerOrb.draw((16*playX)+3,(16*playY)+3);
  }

  that.initialize = function(){
    Graphics.initialize();
    generateMaze();

    for(var i=0; i<5; i++){
      hsArray.push({
        score: 0,
        time: 0,
        size: 0
      });
    }

    window.addEventListener('keydown', function(event) {
  		inputQueue[event.keyCode] = event.keyCode;
  	});

    gameLoop();
  }

  return that;
}());
