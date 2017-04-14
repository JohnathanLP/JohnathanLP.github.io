myGame.screens['sound'] = (function(game) {
	'use strict';

	function initialize() {
		document.getElementById('id-sound-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}

	function run() {
	}

	return {
		initialize : initialize,
		run : run
	};
}(myGame.game));
