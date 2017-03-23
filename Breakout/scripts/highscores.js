myGame.screens["id-highscores"] = (function(game){
  'use-strict';

  var hs1;
  var hs2;
  var hs3;
  var hs4;
  var hs5;
  var rawHS = null;

  function initialize(){
    document.getElementById('id-button-hsreturntomenu').addEventListener(
      'click',
      function(){game.showScreen('id-menu');});
    document.getElementById('id-button-reseths').addEventListener(
      'click',
      function(){Persistence.clear();});
  }

  function run(){
    hs1 = 0;
    hs2 = 0;
    hs3 = 0;
    hs4 = 0;
    hs5 = 0;

    rawHS = null;
    rawHS = Persistence.highScores;

    var iter;

    for (iter in rawHS){
      console.log('Now sorting: ' + rawHS[iter]);
      if(rawHS[iter] > hs1){
        hs5 = hs4;
        hs4 = hs3;
        hs3 = hs2;
        hs2 = hs1;
        hs1 = rawHS[iter];
      }
      else if(rawHS[iter] > hs2){
        hs5 = hs4;
        hs4 = hs3;
        hs3 = hs2;
        hs2 = rawHS[iter];
      }
      else if(rawHS[iter] > hs3){
        hs5 = hs4;
        hs4 = hs3;
        hs3 = rawHS[iter];
      }
      else if(rawHS[iter] > hs4){
        hs5 = hs4;
        hs4 = rawHS[iter];
      }
      else if(rawHS[iter] > hs5){
        hs5 = rawHS[iter];
      }
    }

    document.getElementById('id-hs1').innerHTML = '1: ' + hs1;
    document.getElementById('id-hs2').innerHTML = '2: ' + hs2;
    document.getElementById('id-hs3').innerHTML = '3: ' + hs3;
    document.getElementById('id-hs4').innerHTML = '4: ' + hs4;
    document.getElementById('id-hs5').innerHTML = '5: ' + hs5;
  }

  function printHS(){
    var iter;
    for(iter in rawHS){
      console.log(rawHS[iter]);
    }
  }

  return{
    initialize: initialize,
    run: run,
    printHS: printHS
  };
}(myGame.game));
