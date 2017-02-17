//initialize'use strict';

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
  let previousTime = performance.now();
  let elapsedTime = 0;
  let mazeSize = 5;

  let myTexture = Graphics.Texture({
    imageSource: 'maze_texture.png',
    center: {x:32, y:16},
    clip: {x:0, y:0, w:32, h:32},
    width: 64,
    height: 32,
    rotation: 0
  })

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

  var mazeArray = []; //holds a 0 for empty spaces, a 1 for full spaces
  var wallArray = []; //Stores all walls of the maze

  var wide=9;
  var high=9;

  var startX=0;
  var startY=0;

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

  that.newMaze = function(size){
    let canvas = document.getElementById('canvas-main');

    canvas.width = ((size*16) + ((size+1)*3));
    canvas.height = ((size*16) + ((size+1)*3));

    high = (size*2)-1;
    wide = high;
    mazeSize = size;

    generateMaze();
    //printMaze();
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
    endTile.draw((16*size),(16*size));
  }

  function update(){
    //myTexture.update();
  }

  function render(){
    Graphics.beginRender();
    drawMaze(mazeSize);
  }

  function gameLoop(time){
    elapsedTime = time - previousTime;
    previousTime = time;

    update();
    render();

    lastTimeStamp = time;
    requestAnimationFrame(gameLoop);
  }

  that.initialize = function(){
    Graphics.initialize();

    generateMaze();
    printMaze();

    gameLoop();
  }

  return that;
}());
