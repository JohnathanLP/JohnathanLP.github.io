var Persistence = (function () {
	'use strict';
	var highScores = {},
		previousScores = localStorage.getItem('MyGame.highScores');
	if (previousScores !== null) {
		highScores = JSON.parse(previousScores);
	}

	function add(key, value) {
		highScores[key] = value;
		localStorage['MyGame.highScores'] = JSON.stringify(highScores);
	}

	function remove(key) {
		delete highScores[key];
		localStorage['MyGame.highScores'] = JSON.stringify(highScores);
	}

	function clear(){
		localStorage.clear();
		var iter;
		for(iter in highScores){
			delete highScores[iter];
		}
	}

	function report() {
		var htmlNode = document.getElementById('div-console'),
			key;

		htmlNode.innerHTML = '';
		for (key in highScores) {
			htmlNode.innerHTML += ('Key: ' + key + ' Value: ' + highScores[key] + '<br/>');
		}
		htmlNode.scrollTop = htmlNode.scrollHeight;
	}

	return {
		add : add,
		remove : remove,
		report : report,
		clear: clear,
		highScores: highScores
	};
}())
