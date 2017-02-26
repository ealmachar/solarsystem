app.service('main', ['planets', 'physics', 'attributes', 'ui', 'camera', 'audio', 'effects', function(planets, physics, attributes, ui, camera, audio, effects){
	var scene, renderer;

	

	
	var time = new Date();
	var start, end;
	
	var clock = new THREE.Clock();
	var stats = new Stats();
	
//	stats.showPanel( 1 );
//	document.body.appendChild( stats.dom );
	
	if (Detector.webgl) {
		init();
		animate();
	} else {
		var warning = Detector.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning);
	}

	function init() {

		renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		scene = new THREE.Scene();
		
		attributes.init();
		planets.init(scene, camera.radius);
		physics.init();
		camera.cameraInit();
		camera.mouseInit();
		ui.init();
		audio.init();
		effects.init(scene, renderer, camera.camera);
		
		physics.tick();
	}
	
	

	function animate() {
		var delta = clock.getDelta();
		
		physics.tick(delta);
		camera.tick();
		ui.tick(renderer, camera.camera);

		effects.composer.render(delta);
		
//		renderer.render( scene, camera.camera);
		

		
		stats.end();
		stats.begin();

		requestAnimationFrame( animate );
	}
}]);