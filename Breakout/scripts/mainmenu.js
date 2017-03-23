myGame.screens["id-menu"] = (function(game){
  'use-strict';

  function initialize(){
    document.getElementById('id-button-newgame').addEventListener(
      'click',
      function(){game.showScreen('id-gameplay');});
    document.getElementById('id-button-highscores').addEventListener(
      'click',
      function(){game.showScreen('id-highscores');});
    document.getElementById('id-button-credits').addEventListener(
      'click',
      function(){game.showScreen('id-credits');});
  }

  function run(){

  }

  return{
    initialize: initialize,
    run: run
  };
}(myGame.game));
