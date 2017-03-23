myGame.screens["id-credits"] = (function(game){
  'use-strict';

  function initialize(){
    document.getElementById('id-button-creditsreturntomenu').addEventListener(
      'click',
      function(){game.showScreen('id-menu');});
  }

  function run(){

  }

  return{
    initialize: initialize,
    run: run
  };
}(myGame.game));
