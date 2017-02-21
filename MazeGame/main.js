//input queue
let inputQueue = {};
//size of maze in cells
let mazeSize;
//position of character
let charX;
let charY;
//stores maze
let mazeArray = [];
//used to generate maze
let wallArray = [];

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

  function Texture(spec){
    var that = {},
        ready = false,
        image = new Image();

    image.onload = () => {
      ready = true;
    };
    image.src = spec.imageSource;
    that.update = function(){
    }

    that.draw = function(xLoc, yLoc){
      if(ready){
        context.save();
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
          image,
          spec.clip.x,
          spec.clip.y,
          spec.clip.w,
          spec.clip.h,
          xLoc,
          yLoc,
          spec.clip.w, spec.clip.h);

        context.restore();
      }
    }
    return that;
  }
});

//generates new maze of mazeSize
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
    //console.log('Considering wallArray index', randIndex, ' x:', tempX, ' y:', tempY);

    //horizontal
    if(tempX%2 == 0){
      //console.log('Wall is Horizontal');
      if(mazeArray[tempX][tempY+1] == 0){
        mazeArray[tempX][tempY] = 1;
        mazeArray[tempX][tempY+1] = 1;
        addWall(tempX,tempY+1);
      }
      else if (mazeArray[tempX][tempY-1] == 0){
        mazeArray[tempX][tempY] = 1;
        mazeArray[tempX][tempY-1] = 1;
        addWall(tempX,tempY-1);
      }
    }
    //vertical
    else {
      //console.log('Wall is Vertical');
      if(mazeArray[tempX+1][tempY] == 0 ){
        mazeArray[tempX][tempY] = 1;
        mazeArray[tempX+1][tempY] = 1;
        addWall(tempX+1,tempY);
      }
      else if(mazeArray[tempX-1][tempY] == 0){
        mazeArray[tempX][tempY] = 1;
        mazeArray[tempX-1][tempY] = 1;
        addWall(tempX-1,tempY);
      }
    }
    //console.log('Splicing ', randIndex);
    wallArray.splice(randIndex, 1);
  }
}

//needed for maze generation
function addWall(xIn,yIn){
  if(xIn+1 < wide-1){
    if(mazeArray[xIn+1][yIn] == 0){
      wallArray.push({
        x:xIn+1,
        y:yIn
      });
    }
  }
  if(yIn-1 > 0){
    if(mazeArray[xIn][yIn-1] == 0){
      wallArray.push({
        x:xIn,
        y:yIn-1
      });
    }
  }
  if(xIn-1 > 0){
    if(mazeArray[xIn-1][yIn] == 0){
      wallArray.push({
        x:xIn-1,
        y:yIn
      });
    }
  }
  if(yIn+1 < high-1){
    if(mazeArray[xIn][yIn+1] == 0){
      wallArray.push({
        x:xIn,
        y:yIn+1
      });
    }
  }
}

//Moves character
function moveCharacter(keyCode){
  console.log('keyCode: ', keyCode);
  if(keyCode === 40){
    //down
  }
  if(keyCode === 38){
    //up
  }
  if(keyCode === 39){
    //right
  }
  if(keyCode === 37){
    //left
  }
}

//Draws maze from maze array - plus character
function drawMaze(){
  //iterate through array, drawing maze
  for(var i=0; i<(mazeSize*2)+1; i++){
    for(var j=0; j<(mazeSize*2)+1; j++){

    }
  }

  //draw character

}

//Generates a new maze, called by buttons
function newMaze(sizeIn){
  mazeSize = sizeIn;
  charX = 0;
  charY = 0;
  //generateMaze();
}

//Render function
function render(){
  context.clear();
  //drawMaze();
}

//Iterates through input queue
function processInput(){
  for(input in inputQueue){
    //moveCharacter(inputQueue[input]);
  }
  inputStage = {};
}

//Game loop function
function gameLoop(){
  processInput();
  render();

  requestAnimationFrame(gameLoop);
}

//Initializes the game, called from html
function initialize(){


  window.addEventListener('keydown', function(event){
    inputStage[event.keyCode] = event.keyCode;
  });

  requestAnimationFrame(gameLoop);
}
