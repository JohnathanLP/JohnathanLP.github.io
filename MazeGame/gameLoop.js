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
  let that = {};
  //Size of maze in terms of cells
  let mazeSize = 5;

  let playX = 0;
  let playY = 0;

  let inputQueue = {};

  let floorCell = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:8},
    clip: {x:8, y:0, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let startTile = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:8},
    clip: {x:42, y:16, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let endTile = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:8},
    clip: {x:26, y:17, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let wallCorner = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:1, y:1},
    clip: {x:25, y:8, w:3, h:3},
    width: 3,
    height: 3,
    rotation: 0
  })

  let wallVert = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:1, y:8},
    clip: {x:0, y:0, w:3, h:16},
    width: 3,
    height: 3,
    rotation: 0
  })

  let passVert = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:1, y:8},
    clip: {x:4, y:0, w:3, h:16},
    width: 3,
    height: 3,
    rotation: 0
  })

  let wallHori = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:1},
    clip: {x:25, y:0, w:16, h:3},
    width: 3,
    height: 3,
    rotation: 0
  })

  let passHori = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:1},
    clip: {x:25, y:4, w:16, h:3},
    width: 3,
    height: 3,
    rotation: 0
  })

  let playerOrb = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:8, y:8},
    clip: {x:8, y:16, w:16, h:16},
    width: 16,
    height: 16,
    rotation: 0
  })

  let solDot = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:25, y:12, w:4, h:4},
    width: 4,
    height: 4,
    rotation: 0
  })

  let hintDot = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:2, y:2},
    clip: {x:35, y:12, w:4, h:4},
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

    for(var i=0; i<mazeSize; i++){
      solArray.push(new Array(mazeSize));
    }

    //also intitializes the solArray
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize; j++){
        solArray[i][j] = -1;
      }
    }

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

  //Prints maze to terminal - for debugging only
  function printMaze(){
    var stringOut = '';
    for (var i=0; i<wide+2; i++){
      stringOut += '+';
      stringOut += ' ';
    }
    stringOut += '\n';
    for (var i=0; i<high; i++){
      stringOut += '+ ';
      for (var j=0; j<wide; j++){
        if(mazeArray[j][i] == 0){
          stringOut += '+';
        }
        else {
          stringOut += ' ';
        }
        //stringOut += (mazeArray[j][i]);
        stringOut += (' ');
      }
      stringOut += '+';
      stringOut += '\n';
    }
    for (var i=0; i<wide+2; i++){
      stringOut += '+';
      stringOut += ' ';
    }
    stringOut += '\n';
    console.log(stringOut);
  }

  //Print solution map to terminal - for debugging only
  function printSol(){
    var printStrin = '';
    for(var i=0; i<mazeSize; i++){
      for(var j=0; j<mazeSize; j++){
        if(solArray[j][i] == -1){
          printStrin += 'o';
        }
        if(solArray[j][i] == 0){
          printStrin += '^';
        }
        if(solArray[j][i] == 1){
          printStrin += '>';
        }
        if(solArray[j][i] == 2){
          printStrin += 'v';
        }
        if(solArray[j][i] == 3){
          printStrin += '<';
        }
      }
      printStrin += '\n';
    }
    console.log(printStrin);
  }

  //Called whenever a button is pressed to make a new maze - takes maze size in cells
  that.newMaze = function(size){
    //Gets canvas object
    let canvas = document.getElementById('canvas-main');
    //Resizes canvas object
    canvas.width = ((size*16) + ((size+1)*3));
    canvas.height = ((size*16) + ((size+1)*3));

    //Sets array sizes correctly
    high = (size*2)-1;
    wide = high;

    //Sets mazeSize correctly
    mazeSize = size;

    //startX = mazeSize-1;
    //startY = mazeSize-1;

    //sets player Position
    playX = 0;
    playY = 0;

    //resets solved
    solved = false;

    score = 0;

    startX = wide-1;
    startY = high-1;

    //generates a new maze
    generateMaze();

    printSol();
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

      solDot.draw(9+(19*solX),9+(19*solY));
    }
  }

  function drawHint(){
    if(solArray[playX][playY] == 0){
      hintDot.draw(9+(19*playX),9+(19*(playY-1)));
    }
    else if(solArray[playX][playY] == 1){
      hintDot.draw(9+(19*(playX+1)),9+(19*playY));
    }
    else if(solArray[playX][playY] == 2){
      hintDot.draw(9+(19*playX),9+(19*(playY+1)));
    }
    else if(solArray[playX][playY] == 3){
      hintDot.draw(9+(19*(playX-1)),9+(19*playY));
    }
  }

  function drawMaze(size){
    //fills in corners
    for(var i=0; i<(size+1); i++){
      for(var j=0; j<(size+1); j++){
        wallCorner.draw(i*19,j*19);
      }
    }
    //fills in cells
    for(var i=0; i<size; i++){
      for(var j=0; j<size; j++){
        floorCell.draw((i*19)+3,(j*19)+3);
      }
    }
    //fills in vertical walls
    for(var i=0; i<size;i++){
      wallVert.draw(0,(i*19)+3);
      wallVert.draw(size*19,(i*19)+3);
    }
    //fills in horizontal walls
    for(var i=0; i<size;i++){
      wallHori.draw((i*19)+3,0);
      wallHori.draw((i*19)+3,size*19);
    }

    //add interior walls and passages
    for(var i=0; i<wide; i++){
      for(var j=0; j<high; j++){
        //vertical
        if(j%2 == 0){
          if(i%2 == 1){
            if(mazeArray[i][j] == 0){
              wallVert.draw(((i/2)*19)+9,((j/2)*19)+3);
            } else {
              passVert.draw(((i/2)*19)+9,((j/2)*19)+3);
            }
          }
        }
        //horizontal
        if(j%2 == 1){
          if(i%2 == 0){
            if(mazeArray[i][j] == 0){
              wallHori.draw(((i/2)*19)+3,((j/2)*19)+9);
            } else {
              passHori.draw(((i/2)*19)+3,((j/2)*19)+9);
            }
          }
        }
      }
    }

    startTile.draw(3,3);
    endTile.draw(((size-1)*19)+4,((size-1)*19)+4);
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
      moveCharacter(inputQueue[input]);
  		console.log(inputQueue[input]);
  	}
  	inputQueue = {};
  }

  function moveCharacter(input){
    if(!solved){
      //up
      if(input == 38){
        if(playY > 0){
          if(mazeArray[playX*2][(playY*2)-1] == 1){
            playY--;
          }
        }
      }
      //down
      if(input == 40){
        if(playY < mazeSize-1){
          if(mazeArray[playX*2][(playY*2)+1] == 1){
            playY++;
          }
        }
      }
      //right
      if(input == 39){
        if(playX < mazeSize-1){
          if(mazeArray[(playX*2)+1][playY*2] == 1){
            playX++;
          }
        }
      }
      //left
      if(input == 37){
        if(playX > 0){
          if(mazeArray[(playX*2)-1][playY*2] == 1){
            playX--;
          }
        }
      }
      if(playX == mazeSize-1 && playY == mazeSize-1){
        solved = true;
      }
    }
  }

  function render(){
    Graphics.beginRender();
    document.getElementById('id-score').innerHTML = score;
    drawMaze(mazeSize);
    drawPlayer();
    if(showSol){
      drawSol();
    }
    if(showHint){
      drawHint();
    }
  }

  function gameLoop(){
    update();
    render();

    requestAnimationFrame(gameLoop);
  }

  function drawPlayer(){
    playerOrb.draw((19*playX)+3,(19*playY)+3);
  }

  that.initialize = function(){
    Graphics.initialize();
    generateMaze();

    window.addEventListener('keydown', function(event) {
  		inputQueue[event.keyCode] = event.keyCode;
  	});

    gameLoop();
  }

  return that;
}());
