// #sound.js
//





var SoundModule = function (opts) {


	const path = "./assets/sound/";

	this.backgroundSound = new Howl({
		urls: [ path+'loop1.mp3'],
		loop: true
	});

	this.deadSound = new Howl({
	  urls: [ path+'dead1.mp3'],
	  volume: 0.2
	});

	this.touchSound = new Howl({
		urls: [ path+'touch.wav'],
    	sprite: {
		    0: [0, 923],
		    1: [923, 1866],
		    2: [1866, 2791],
		    3: [2791, 3725]
		},
	  	volume: 0.1
	});

	console.log(this.touchSound);

		
};


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