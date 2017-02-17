
let Maze = (function(){
  var mazeArray = []; //holds a 0 for empty spaces, a 1 for full spaces
  var wallArray = []; //Stores all walls of the maze

  var wide=31;
  var high=31;

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

  return {
    generateMaze: generateMaze,
    printMaze: printMaze
  };
});
