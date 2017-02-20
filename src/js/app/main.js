app.service('main', ['planets', 'physics', 'attributes', 'ui', 'camera', function(planets, physics, attributes, ui, camera){
	var scene, renderer;
	var composer;
	
	
	var clock = new THREE.Clock();
	var stats = new Stats();
	stats.showPanel( 1 );

	document.body.appendChild( stats.dom );
	
	if (Detector.webgl) {
		init();
		animate();
	} else {
		var warning = Detector.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning);
	}

	function init() {

		renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		scene = new THREE.Scene();

		planets.init(scene, camera.radius);
		
		physics.init();
		attributes.init();
		
		camera.cameraInit();
		camera.mouseInit();
		ui.init();

		physics.tick();
		
		composer = new THREE.EffectComposer(renderer);
		
		var renderPass = new THREE.RenderPass(scene, camera.camera);
		composer.addPass(renderPass);
		
		var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.3, 0.85);
		composer.addPass(bloomPass);
		bloom = bloomPass;
		
		var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
		effectCopy.renderToScreen = true;
		composer.addPass(effectCopy);
		
		var directionalLight = new THREE.PointLight( 0xffffff, 1, 0 );
		directionalLight.position.set( planets.celestials.sun.position.x, planets.celestials.sun.position.y, planets.celestials.sun.position.z );
		planets.celestials.sun.add( directionalLight );
	}

	function animate() {
		
		


		stats.begin();
		physics.tick();

		camera.tick();
		ui.tick(renderer, camera.camera);

//		renderer.render( scene, camera.camera);
		
		var delta = clock.getDelta();
		composer.render(delta);
stats.end();

		requestAnimationFrame( animate );
	}
}]);
var bloom;