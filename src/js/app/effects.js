app.service('effects', ['planets', 'attributes', function(planets, attributes){
	var renderPass,  effectCopy;
	
	this.composer;
	this.bloomPass;
	this.effectFXAA;
	this.directionalLight;
	
	
	this.init = function(scene, renderer, camera){
		this.composer = new THREE.EffectComposer(renderer);
		
		renderPass = new THREE.RenderPass(scene, camera);
		this.composer.addPass(renderPass);
		
		this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.3, 0.85);
		this.composer.addPass(this.bloomPass);
		
		this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );
		this.composer.addPass(this.effectFXAA);
		
		effectCopy = new THREE.ShaderPass(THREE.CopyShader);
		effectCopy.renderToScreen = true;
		this.composer.addPass(effectCopy);
		
		this.directionalLight = new THREE.PointLight( 0xffffff, 1, 0 );
		this.directionalLight.position.set( planets.celestials.sun.position.x, planets.celestials.sun.position.y, planets.celestials.sun.position.z );
		planets.celestials.sun.add( this.directionalLight );
	}
	
	this.tick = function(){
		this.bloomPass.strength = Math.min( attributes.au/ magv(planets.universe.position.x, planets.universe.position.y, planets.universe.position.z), 1 )

	}.bind(this);
}]);