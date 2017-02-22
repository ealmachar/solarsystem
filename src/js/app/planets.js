var cel;
app.service('planets', ['attributes', function(attributes){

	var sphereDetail = 32;

	this.universe = new THREE.Group();
	
	this.stars = new THREE.Group();
	
	this.celestials = {};
	
	this.sunCorona = new THREE.Group();
	

	

	
	
	/*
	this.forceSphere = new THREE.Group();
	this.force = function(group){
		group.add(this.forceSphere);
		
		var radius = attributes.earthSystem.moon.radius / 2;
		var sphereGeometry = new THREE.SphereGeometry(radius, sphereDetail, sphereDetail);
		var sphereMaterial = new THREE.MeshPhongMaterial();
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.forceSphere.add(sphere);
	}
*/

	// render star field
	this.renderStars = function(scene, radius){
		var starGeometry  = new THREE.SphereGeometry(90, 32, 32)
		var starMaterial  = new THREE.MeshBasicMaterial({
			map: starTexture,
			side: THREE.BackSide
		});
		
		var starMesh  = new THREE.Mesh(starGeometry, starMaterial);
		this.stars.add(starMesh);
		this.stars.scale.set(radius,radius,radius);
		scene.add(this.stars);

	}
	
	
	
	// render sun object and sub objects
	this.sunMaterial;
	this.coronaPlane1;
	this.coronaPlane2;
	this.coronaPlane3;
	
	this.renderSun = function(group){
		
		var sunRadius = attributes.sunSystem.sun.radius;
		
		var sunObj = {
			map: sunTexture,
			emissive: 0xffffff,
			emissiveMap: sunTexture,
			emissiveIntensity: 1
		}
		
		this.createPlanetMesh( attributes.sunSystem, sunObj, 'sun' );
		
		this.sunMaterial = this.celestials.sun.getObjectByName('sun').material;

		var corona = this.sunCorona;
		var coronaScale = 18;
		
		// this mesh is the 1st and 2nd (cloned) corona of the sun
		// both puslating in separate phases and rotating in opposite directions in sunAnimate()
		var coronaGeometry = new THREE.PlaneGeometry( sunRadius * coronaScale, sunRadius * coronaScale, 1 );
		var coronaMaterial = new THREE.MeshBasicMaterial({
			map: coronaTexture,
//			blending: THREE.AdditiveBlending,
			transparent: true,
//			premultipliedAlpha: true,
			opacity: 1,
			alphaMap: coronaTexture,
			depthWrite: false
		});
		
		var coronaMaterialFar = new THREE.MeshBasicMaterial({
			map: coronaTextureFar,
			transparent: true,
			opacity: 1,
			alphaMap: coronaTextureFar,
			depthWrite: false
		});

		this.coronaPlane1 = new THREE.Mesh( coronaGeometry, coronaMaterial );
		
		this.coronaPlane2 = this.coronaPlane1.clone();
		this.coronaPlane2.rotateZ(Math.PI);
		
		this.coronaPlane3 = new THREE.Mesh(coronaGeometry, coronaMaterialFar);
		
		corona.add( this.coronaPlane1 );
		corona.add( this.coronaPlane2 );
		corona.add( this.coronaPlane3 );
		this.celestials.sun.add(this.sunCorona);
		
		group.add(this.celestials.sun);
	}
	
	this.theta = 0;
	this.phi1 = 0;
	this.phi2 = 0;
	this.start = new Date();
	this.end;
	this.coronaPulseFrequency = .002;
	this.coronaRotateSpeed = .00003
	

	// sun animation tick per frame
	this.sunAnimate = function(camera, radius){

		// running pulse frequency
		// and rotate speed
		// based on clock
		this.end = new Date();
		var time = this.end - this.start;
		this.start = new Date();

		this.theta += time * this.coronaPulseFrequency;
		this.theta = this.theta % (Math.PI * 2);
		
		var rotate = time * this.coronaRotateSpeed; 
		
		this.phi1 += rotate;
		this.phi2 += rotate;
		
		// keep rotations within 2PI
		this.phi1 %= Math.PI * 2;
		this.phi2 %= Math.PI * 2;
		
		var corona1size = Math.sin(this.theta) * .05 + 1.1;
		var corona2size = Math.sin(this.theta + Math.PI) * .05 + 1.1;
	
		this.coronaPlane1.rotateZ(this.phi1);
		this.coronaPlane2.rotateZ(-this.phi2);
	
		this.coronaPlane1.scale.set(corona1size, corona1size, 1);
		this.coronaPlane2.scale.set(corona2size, corona2size, 1);
		
		this.phi1 = 0;
		this.phi2 = 0;
		

		// Sun elements based on distance:
		// - light emission of sphere
		// - size of 3rd corona (whiter, more spherical)
		
		// distance
		var campos = camera.getWorldPosition();
		var sun = this.celestials.sun.getWorldPosition();
		var distance = Math.sqrt(Math.pow(campos.x-sun.x,2) + Math.pow(campos.y-sun.y,2) + Math.pow(campos.z-sun.z,2));
		

		// 3rd corona
		// corona scale is based on distance as well as the pulsating effect from 2nd corona
		var corona3size = distance/(attributes.au*2);
		this.coronaPlane3.scale.set(corona3size * corona2size, corona3size * corona2size, 1);
		this.coronaPlane3.material.opacity =  Math.min(corona3size, 1);

		this.sunMaterial.emissiveIntensity = Math.max(1, distance/(attributes.sunSystem.sun.radius*2));
		
		
		// keep coronas looking at camera
		this.sunCorona.lookAt(camera.position);
	}
	
	
	

	this.renderMercury = function(group){
		this.createPlanetMesh( attributes.mercurySystem, {map: mercuryTexture}, 'mercury' );
	}
	
	

	this.renderVenus = function(group){

		this.createPlanetMesh( attributes.venusSystem, {map: venusTexture}, 'venus' );

		var venusAtmMat = {
			map : venusClouds,
			alphaMap: venusClouds,
			opacity: 1.1,
			transparent: true,
			depthWrite: false
		}
		
		this.createPlanetAtmosphere( attributes.venusSystem, venusAtmMat, 'venus' );
	}
	
	

	this.renderEarth = function(group){

		var earthObj = {
			map: earthTexture,
			bumpMap: earthBumpmap,
			bumpScale: attributes.planetScale,
			specularMap: earthSpecular,
			specular: 0x665A3C,
			emissive: 0xffffff,
			emissiveMap: earthEmissive,
			emissiveIntensity: 1
		}
		this.createPlanetMesh( attributes.earthSystem, earthObj, 'earth' )

		var earthAtmObj = {
			map : cloudTexture,
			alphaMap: cloudTexture,
			opacity: 1,
			transparent: true,
			depthWrite: false
		}
		this.createPlanetAtmosphere( attributes.earthSystem, earthAtmObj, 'earth' )

		this.createPlanetMesh( attributes.earthSystem, {map: moonTexture}, 'moon' );
	}
	

	
	this.renderMars = function(group){		
		this.createPlanetMesh( attributes.marsSystem, {map: marsTexture}, 'mars' );
		this.createPlanetMesh( attributes.marsSystem, {map: phobosTexture}, 'phobos' );
		this.createPlanetMesh( attributes.marsSystem, {map: deimosTexture}, 'deimos' );
	}
	


	
	this.renderJupiter = function(group){
		this.createPlanetMesh( attributes.jupiterSystem, {map: jupiterTexture}, 'jupiter' );
		this.createPlanetMesh( attributes.jupiterSystem, {map: ioTexture}, 'io' );
		this.createPlanetMesh( attributes.jupiterSystem, {map: europaTexture}, 'europa' );
		this.createPlanetMesh( attributes.jupiterSystem, {map: ganymedeTexture}, 'ganymede' );
		this.createPlanetMesh( attributes.jupiterSystem, {map: callistoTexture}, 'callisto' );
	}
	

	
	this.renderSaturn = function(group){
		this.createPlanetMesh( attributes.saturnSystem, {map: saturnTexture}, 'saturn' );
		this.createPlanetMesh( attributes.saturnSystem, {map: mimasTexture}, 'mimas' );
		this.createPlanetMesh( attributes.saturnSystem, {map: enceladusTexture}, 'enceladus' );
		this.createPlanetMesh( attributes.saturnSystem, {map: tethysTexture}, 'tethys' );
		this.createPlanetMesh( attributes.saturnSystem, {map: dioneTexture}, 'dione' );
		this.createPlanetMesh( attributes.saturnSystem, {map: rheaTexture}, 'rhea' );
		this.createPlanetMesh( attributes.saturnSystem, {map: titanTexture}, 'titan' );
		this.createPlanetMesh( attributes.saturnSystem, {map: iapetusTexture}, 'iapetus' );
		
		var titanAtmMat = {
			map : titanAtmosphere,
			opacity: 0.9,
			transparent: true,
			depthWrite: false
		}
		
		this.createPlanetAtmosphere( attributes.saturnSystem, titanAtmMat, 'titan' );

		var saturnRingObj = {
			map: saturnRingTexture,
			opacity: 1,
			transparent: true,
			side: THREE.DoubleSide
		}
		
		var rings = this.createPlanetRings( attributes.saturnSystem, saturnRingObj, 'saturn', 74500, 140220 );
		rings.rotateX(Math.PI/2);
	}
	
	
	this.renderUranus = function(group){
		this.createPlanetMesh( attributes.uranusSystem, {map: uranusTexture}, 'uranus' );
		this.createPlanetMesh( attributes.uranusSystem, {map: arielTexture}, 'ariel' );
		this.createPlanetMesh( attributes.uranusSystem, {map: umbrielTexture}, 'umbriel' );
		this.createPlanetMesh( attributes.uranusSystem, {map: titaniaTexture}, 'titania' );
		this.createPlanetMesh( attributes.uranusSystem, {map: oberonTexture}, 'oberon' );
		this.createPlanetMesh( attributes.uranusSystem, {map: mirandaTexture}, 'miranda' );
		
		var uranusRingObj = {
			map: uranusRingTexture,
			alphaMap: uranusRingAlpha,
			opacity: 0.6,
			transparent: true,
			side: THREE.DoubleSide
		}
		
		var rings = this.createPlanetRings( attributes.uranusSystem, uranusRingObj, 'uranus', 41837, 51149 );
		rings.rotateX(Math.PI/2);
	}
	
	this.renderNeptune = function(group){
		this.createPlanetMesh( attributes.neptuneSystem, {map: neptuneTexture}, 'neptune' );
		this.createPlanetMesh( attributes.neptuneSystem, {map: tritonTexture}, 'triton' );
	}
	
	this.createPlanetMesh = function( system, materialObj, celestial ){
		var radius = system[celestial].radius;
		var geometry = new THREE.SphereGeometry( radius, sphereDetail, sphereDetail );
		var material;
		if(celestial == 'earth')
			material = new THREE.MeshPhongMaterial(materialObj);
		else
			material = new THREE.MeshLambertMaterial(materialObj);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.name = celestial;
		
		this.celestials[celestial] = new THREE.Group();
		this.celestials[celestial].add(mesh);

		this.universe.add(this.celestials[celestial]);
		
		if( typeof system[celestial].tilt !== 'undefined'){
			this.celestials[celestial].rotateZ( - (system[celestial].tilt * (Math.PI*2)/360));
		}
	}
	
	this.createPlanetRings = function(system, materialObj, celestial, inner, outer){
	
		var ringGeometry = new THREE.RingGeometry( inner * attributes.planetScale, outer * attributes.planetScale, 64, 1 );

		// http://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
		// http://paulyg.f2s.com/uv.htm
		ringGeometry.faceVertexUvs[0].forEach(function(uv, uvindex){
			
			var side = uvindex % 2;

			if(side == 0){
				uv[0].x = 1;
				uv[0].y = 0;
				
				uv[1].x = 1;
				uv[1].y = 1;
				
				uv[2].x = 0;
				uv[2].y = 0;
			}
			
			if(side == 1){
				uv[0].x = 1;
				uv[0].y = 1;
				
				uv[1].x = 0;
				uv[1].y = 1;
				
				uv[2].x = 0;
				uv[2].y = 0;
			}

		});
		var ringMaterial = new THREE.MeshBasicMaterial(materialObj);
		var ringMesh = new THREE.Mesh( ringGeometry, ringMaterial );
		this.celestials[celestial].add(ringMesh);
		return ringMesh;
	}
	
	this.createPlanetAtmosphere = function( system, materialObj, celestial){
		var radius = system[celestial].radius;
		var geometry = new THREE.SphereGeometry( radius * 1.015, sphereDetail, sphereDetail)
		var material = new THREE.MeshPhongMaterial(materialObj)
		var mesh = new THREE.Mesh(geometry, material);
		mesh.name = celestial + 'Atm';
		this.celestials[celestial].add(mesh);
	};

	
	this.init = function(scene, radius){
		var universe = this.universe;
		
		// bind star field to same node as camera (root THREE.js node, the scene node)
		// bind everything else to a master node just under world node (universe node)
		this.renderStars(scene, radius);
		this.renderSun(universe);
		this.renderMercury(universe);
		this.renderVenus(universe);
		this.renderEarth(universe);
		this.renderMars(universe);
		this.renderJupiter(universe);
		this.renderSaturn(universe);
		this.renderUranus(universe);
		this.renderNeptune(universe);

		
		scene.add(universe);

		
		for(var body in this.celestials){
			this.celestials[body].name = body + "Group";
		}
		
//		scene.add(this.scenes.earth);
		
//		this.force(scene);
	}
}]);

