var names = [];
var itvls = [];
var reps = [];
var elpsd = [];

var ts1 = performance.now();
var ts2;

//called when button is pressed, adds new event into arrays
function addEvent(){
  //gets input from each field
  var nameIn = document.getElementById('name-input').value;
  var intervalIn = document.getElementById('interval-input').value;
  var repsIn = document.getElementById('reps-input').value;

  //clears input fields
  document.getElementById('name-input').value='';
  document.getElementById('interval-input').value='';
  document.getElementById('reps-input').value='';

  //checks if any fields were left empty, else adds new event to arrays
  if(nameIn != '' && intervalIn != '' && repsIn != ''){
    names.push(nameIn);
    itvls.push(intervalIn);
    reps.push(repsIn);
    //elpsd starts at intervalIn-1 so that the event will post immediately
    elpsd.push(intervalIn - 1);
  }
}

//update function, updates each event and removes expired ones
function update(elapsedTime){
  //iterate through all events
  for (var index=0; index<names.length; index++){
    //removes event if it has expired
    if(reps[index] <= 0){
      names.splice(index, 1);
      itvls.splice(index, 1);
      reps.splice(index, 1);
      elpsd.splice(index, 1);
    }
    //checks if elapsed time since last occurence is more than interval time
    if(elpsd[index] >= itvls[index]){
      //resets elapsed time
      elpsd[index] = elpsd[index] - itvls[index];
      //decrements reps remaining
      reps[index]--;
    }
    //else updates elpsd (elapsed time since that event occured)
    else{
      elpsd[index] += elapsedTime;
    }
  }
}

//render function, prints all events that are due
function render(){
  //iterates through all events
  for (var index=0; index<names.length; index++){
    //checks if elapsed time since last occurence is more than interval time
    if(elpsd[index] >= itvls[index]){
      //gets console, outputs string
      var dispString = 'Event: ' + names[index] + ' (' + (reps[index]-1) + ' remaining) <br/>';
      var consoleOut = document.getElementById('html-console');
      consoleOut.innerHTML += dispString;
      consoleOut.scrollTop = consoleOut.scrollHeight - consoleOut.clientHeight;
    }
  }
}

//gameloop function, runs constantly, calls update and render functions
function gameLoop(){
  ts2 = ts1;
  ts1 = performance.now();
  update(ts1-ts2);
  render();
  requestAnimationFrame(gameLoop);
}

//initial call of gameLoop function
gameLoop();
