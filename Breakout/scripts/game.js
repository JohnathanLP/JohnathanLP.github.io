var myGame = {
  screens: {},
};

myGame.game = (function(screens){
  'use-strict';

  function showScreen(id){
    var screen = 0;
    var active = null;

    active = document.getElementsByClassName('active');
    for(screen = 0; screen<active.length; screen++){
      active[screen].classList.remove('active');
    }

    screens[id].run();

    document.getElementById(id).classList.add('active');
  }

  function initialize(){
    var screen = null;
    for(screen in screens){
      if(screens.hasOwnProperty(screen)){
        screens[screen].initialize();
      }
    }

    showScreen('id-gameplay');
  }

  return{
    initialize :initialize,
    showScreen :showScreen
  };
}(myGame.screens));
