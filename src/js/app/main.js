app.service('main', ['planets', 'physics', 'attributes', 'ui', 'camera', function(planets, physics, attributes, ui, camera){
	var scene, renderer;
	var composer;
	
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
start = performance.now();
		renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		scene = new THREE.Scene();
end = performance.now();
console.log("webglrenderer init: " + (end - start));
start = end;
		planets.init(scene, camera.radius);
end = performance.now();
console.log("planets.init: " + (end - start));
start = end;
		physics.init();
end = performance.now();
console.log("physics.init: " + (end - start));
start = end;
		attributes.init();
end = performance.now();
console.log("attributes.init: " + (end - start));
start = end;		
		camera.cameraInit();
end = performance.now();
console.log("camera.camerainit: " + (end - start));
start = end;
		camera.mouseInit();
end = performance.now();
console.log("camrea.mouseinit: " + (end - start));
start = end;
		ui.init();
end = performance.now();
console.log("ui.init: " + (end - start));
start = end;
		physics.tick();
		
end = performance.now();
console.log("physics.init: " + (end - start));
start = end;
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
end = performance.now();
console.log("shaders: " + (end - start));

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