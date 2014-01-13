// This library uses howler.js api for the reproduction of the sounds in Pixelement

var loadedSounds = 0;


// Constructor
// ------------------------
var SoundModule = function (opts) {

	// Relative path to the sound assets.
	const path = "./assets/sound/";

	// Background sound playing continuosly
	this.backgroundSound = new Howl({
		urls: [ path+'loop1.mp3'],
	  	onload: this.loadProgress,
		loop: true,
	});
 

	this.deadSound = new Howl({
	  urls: [ path+'dead1.mp3'],
	  onload: this.loadProgress,
	  volume: 0.2
	});

	this.touchSound = new Howl({
		urls: [ path+'touch.mp3'],
	  	onload: this.loadProgress,
    	sprite: {
		    0: [0, 923],
		    1: [923, 1866],
		    2: [1866, 2791],
		    3: [2791, 3725]
		},
	  	volume: 0.1
	});


	this.shieldSound = new Howl({
		urls: [ path+'shield.mp3'],
	  	onload: this.loadProgress,
    	sprite: {
		    on: [0, 1158],
		    off: [1158, 2263],
		},
	  	volume: 0.4,
	  	onend: function (){
			setTimeout(function(){
				this.shieldSoundIsPlaying = false;
			}, 1000);
	  	}
	});

	this.shieldSoundIsPlaying = false;


	/*this.shieldSound = new Howl({
		urls: [ path+'shield-loop.mp3'],
	  	onload: this.loadProgress,
		loop: true
	});*/

	/*this.sounds = 3;

	this.loadedSounds = 0;

	this.onLoadEnd = opts.onLoadEnd;
	this.loaded = false;*/


		
};

// Methods of the class
// --------------------
// Loader. Check if all sounds have been loaded.
SoundModule.prototype.loadProgress = function (argument) {

	loadedSounds++;

	if(loadedSounds == 4){
		onSoundLoaded();
	}
}


// Functions used for concrete events in the game. The name of the method are auto descriptive for the event they are used.

SoundModule.prototype.endGame = function() {

    this.deadSound.play();
    this.backgroundSound.fade(1, 0, 800);

};

SoundModule.prototype.startGame = function() {
	
    
    this.backgroundSound.play().fade(0.2, 1, 1000);

};


SoundModule.prototype.touch = function() {
	

	var rnd = Math.floor(Math.random() * 3);
    
    this.touchSound.play(rnd+"");

};


SoundModule.prototype.shieldOn = function() {

	if(this.shieldSoundIsPlaying) return;

    this.shieldSound.play("on", function(soundId){
		this.shieldSoundIsPlaying = true;

	});

};


SoundModule.prototype.shieldOff = function() {

    this.shieldSound.play("off", function(soundId){

	});
	
};