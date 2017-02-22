app.service('audio', ['camera', 'state', function(camera, state){
	
	//Create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	camera.camera.add( listener );
	
	// create a global audio source
	this.sounds = {
		background: null,
		tick: null,
		boop: null,
		select: null
	}

	var onbttn = angular.element('#panelVolOn');
	var offbttn = angular.element('#panelVolOff');
	
	var audioLoader = new THREE.AudioLoader();
	
	this.init = function(){
		if( state.options.isMuted ){
			onbttn.hide();
			offbttn.show();
		}
		else{
			
			onbttn.show();
			offbttn.hide();
		}
	}

	audioLoader.load( 'src/sounds/masseffect.mp3', function( buffer ) {
		var sound = new THREE.Audio( listener );
		sound.setBuffer( buffer );
		sound.setLoop(true);
		sound.setVolume(0.5);
		if(!state.options.isMuted)
			sound.play();
		this.sounds.background = sound;
	}.bind(this));

	audioLoader.load( 'src/sounds/tick.mp3', function( buffer ) {
		var sound = new THREE.Audio( listener );
		sound.setBuffer( buffer );
		sound.setVolume(1);
		this.sounds.tick = sound;
	}.bind(this));

	audioLoader.load( 'src/sounds/boop.mp3', function( buffer ) {
		var sound = new THREE.Audio( listener );
		sound.setBuffer( buffer );
		sound.setVolume(1.6);
		this.sounds.boop = sound;
	}.bind(this));
	
	audioLoader.load( 'src/sounds/select.mp3', function( buffer ) {
		var sound = new THREE.Audio( listener );
		sound.setBuffer( buffer );
		sound.setVolume(0.5);
		this.sounds.select = sound;
	}.bind(this));
	
	this.mute = function(){

			for(var sound in this.sounds){
				if(this.sounds[sound].isPlaying)
					this.sounds[sound].stop();
				this.sounds[sound].hasPlaybackControl = false;
			}

			state.options.isMuted = true;
			
			onbttn.hide();
			offbttn.show();

	}.bind(this);
	
	this.unmute = function(){

			for(var sound in this.sounds){

				this.sounds[sound].hasPlaybackControl = true;
			}
			this.sounds.background.play();

			state.options.isMuted = false;
			
			onbttn.show();
			offbttn.hide();

	}.bind(this);

}]);
