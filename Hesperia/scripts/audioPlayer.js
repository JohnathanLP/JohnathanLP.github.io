let AudioPlayer = (function(){

  function initialize(){
    loadAudio();
  }

	function loadSound(source) {
		let sound = new Audio();
		sound.src = source;
		return sound;
	}

	//This might be a control that we want in options
	//https://www.w3schools.com/tags/av_prop_volume.asp
	function updateVolume(level){

	}

	function loadAudio() {
		myGame.sounds = {}
		myGame.sounds['audio/castle'] = loadSound('audio/Castle.mp3');
		myGame.sounds['audio/desert'] = loadSound('audio/Desert.mp3');
	}

	function playSound(whichSound){
		myGame.sounds[whichSound].loop = true;
		myGame.sounds[whichSound].play();

		//Might end up trying something like this
		//myAudio.addEventListener('ended', function() {
    //this.currentTime = 0;
    //this.play();
		//}, false);
		//myAudio.play();

	}

  return{
    initialize: initialize,
		loadSound: loadSound,
		loadAudio: loadAudio,
		playSound: playSound
  }
}());
