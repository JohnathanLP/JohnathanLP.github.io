myGame.screens["id-menu"] = (function(game){
  'use-strict';

  function initialize(){
    document.getElementById('id-button-newgame').addEventListener(
      'click',
      function(){game.showScreen('id-gameplay');});
  }

  function run(){

  }

  return{
    initialize: initialize,
    run: run
  };
}(myGame.game));
