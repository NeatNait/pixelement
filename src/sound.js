// #sound.js
//



var loadedSounds = 0;

var SoundModule = function (opts) {


	const path = "./assets/sound/";

	this.backgroundSound = new Howl({
		urls: [ path+'loop1.mp3'],
	  	onload: this.loadProgress,
		loop: true
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
				console.log("soundend");
			}, 1000);
	  	}
	});

	this.shieldSoundIsPlaying = false;


	/*this.shieldSound = new Howl({
		urls: [ path+'shield-loop.mp3'],
	  	onload: this.loadProgress,
		loop: true
	});*/


	//TODO
	/*this.sounds = 3;

	this.loadedSounds = 0;

	this.onLoadEnd = opts.onLoadEnd;
	this.loaded = false;*/


		
};

SoundModule.prototype.loadProgress = function (argument) {

	loadedSounds++;

	if(loadedSounds == 4){
		onSoundLoaded();
	}
}


SoundModule.prototype.endGame = function() {

    this.deadSound.play();
    this.backgroundSound.fade(1, 0, 800);

};

SoundModule.prototype.startGame = function() {
	
    
    this.backgroundSound.play().fade(0.2, 1, 1000);

};


SoundModule.prototype.touch = function() {
	

	//this.touchSound.stop();
	var rnd = Math.floor(Math.random() * 3);
    
    this.touchSound.play(rnd+"");//.fade(0.1, 0.3, 500).fade(0.3, 0, 500);

};


SoundModule.prototype.shieldOn = function() {

    //this.shieldSound.play().fade(0.2, 1, 1000);



	if(this.shieldSoundIsPlaying) return;

    this.shieldSound.play("on", function(soundId){
    	//console.log(soundId);
		this.shieldSoundIsPlaying = true;

	});//.fade(0.1, 0.3, 500).fade(0.3, 0, 500);



};


SoundModule.prototype.shieldOff = function() {
    

    //this.shieldSound.stop().fade(1, 0.2, 1000);
    

    
    this.shieldSound.play("off", function(soundId){
    // do what you want with soundId
	});//.fade(0.1, 0.3, 500).fade(0.3, 0, 500);
	
};