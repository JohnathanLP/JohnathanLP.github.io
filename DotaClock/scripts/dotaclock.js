var running = false;
var gameTimeSec = 0;
var paused = false;
var thisTime = 0;
var lastTime = 0;
var runTime = 0;

function startClock(){
  if(!running){
    lastTime = performance.now();
    running = true;
  }
}

function stopClock(){
  running = false;
  paused = true;
}

function resumeClock(){
  //TODO - fix pause function
  if(paused){
    running = true;
    paused = false;
  }
}

function resetClock(){
  running = false;
  gameTimeSec = 0;
}

function formatTimeSec(timeIn){
  if(timeIn > 0){
    if((timeIn%60) < 10){
      return Math.floor(timeIn/60) + ':0' + (timeIn%60);
    }
    else {
      return Math.floor(timeIn/60) + ':' + (timeIn%60);
    }
  }
  else{
    if((timeIn%60) > -10){
      return '-' + Math.floor(-timeIn/60) + ':0' + -(timeIn%60);
    }
    else {
      return '-' + Math.floor(-timeIn/60) + ':' + -(timeIn%60);
    }
  }
}

function update(elapsedTime){
  if(running){
    thisTime = performance.now();
    runTime += (thisTime-lastTime);

    gameTimeSec = Math.floor(runTime/1000);

    document.getElementById('id-p1-gametime').innerHTML = formatTimeSec(gameTimeSec);

    //courier upgrade
    if(gameTimeSec < 180 && gameTimeSec >= 0){
      document.getElementById('id-progress-courierupgrade').value = gameTimeSec;
      document.getElementById('id-p2-courierupgrade').innerHTML = 180-gameTimeSec;
    }

    //rune spawn
    if(gameTimeSec >= 0){
      document.getElementById('id-progress-runespawn').value = gameTimeSec%120;
      document.getElementById('id-p2-runespawn').innerHTML = 120-(gameTimeSec%120);
    }

    //ward purchase
    if(gameTimeSec >= 0){
      document.getElementById('id-progress-wardpurchase').value = gameTimeSec%150;
      document.getElementById('id-p2-wardpurchase').innerHTML = 150-(gameTimeSec%150);
    }

    var countdownNumbers = document.getElementsByTagName('p2');
    var iter;
    for(iter in countdownNumbers){
      //console.log(countdownNumbers[iter].innerHTML);
      if(countdownNumbers[iter].innerHTML <= 90){
        //console.log('warning');
        countdownNumbers[iter].classList.add('warning');
      }
    }
    lastTime = thisTime;
  }
  requestAnimationFrame(update);
}

update();
