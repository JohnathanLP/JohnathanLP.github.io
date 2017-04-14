let Persistence = (function (){
		'use strict';

		//this is only going to take event.keyCode (value)
		function add(value) {
			localStorage.clear();
			var controls = {},
				previousControls = localStorage.getItem('myGame.controls');
			if (previousControls !== null) {
				controls = JSON.parse(previousControls);
			}
			//Backspace key
			if(value != 8){
				controls['jump'] = value;
				localStorage['myGame.controls'] = JSON.stringify(controls);
			}else{
				//Default back to 74
				//controls['jump'] = 74;
				//localStorage['myGame.controls'] = JSON.stringify(controls);
			}
			//THESE ARE FOR TESTING
			var keyBoardControls = Persistence.getControls();
	    console.log(keyBoardControls);
		}

		function getControls() {
      var controls = {},
  			previousControls = localStorage.getItem('myGame.controls');
  		if (previousControls !== null) {
  			controls = JSON.parse(previousControls);
  		}
			return controls;
		}

		return {
			add : add,
			getControls : getControls
		};
	}());
