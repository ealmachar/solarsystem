var cel;
app.service('planets', ['attributes', function(attributes){
	var loader = new THREE.TextureLoader();
	var sphereDetail = 256;

	this.universe = new THREE.Group();
	
	this.stars = new THREE.Group();
	
	this.celestials = {
		sun: new THREE.Group(),
		mercury: new THREE.Group(),
		venus: new THREE.Group(),
		earth: new THREE.Group(),
		moon: new THREE.Group(),
		mars: new THREE.Group(),
		phobos: new THREE.Group(),
		deimos: new THREE.Group(),
	};
	
	this.sunCorona = new THREE.Group();
	
	this.earthSurface = new THREE.Mesh();
	this.earthClouds = new THREE.Mesh();
	
	this.venusSurface = new THREE.Mesh();
	this.venusClouds = new THREE.Mesh();

	
	

	
	
	var starTexture = loadTexture('src/images/stars+milky_way.jpg');

	var sunTexture = loadTexture('src/images/sun/texture_sun.jpg');
	var coronaTexture = loadTexture('src/images/sun/lensflare0.png');
	var coronaTextureFar = loadTexture('src/images/sun/lensflare1.png');

	var mercuryTexture = loadTexture('src/images/mercury/2k_mercury.jpg');

	var venusTexture = loadTexture('src/images/venus/2k_venus_surface.jpg');
	var venusClouds = loadTexture('src/images/venus/2k_venus_atmosphere.jpg');


	/*
	var earthTexture = loadTexture('src/images/earth/earth_daymap.jpg');
	var earthBumpmap = loadTexture('src/images/earth/earthbump1k.jpg');
	var earthSpecular = loadTexture('src/images/earth/2k_earth_specular_map.jpg')
	var earthEmissive = loadTexture('src/images/earth/earth_nightmap.jpg')
	var cloudTexture = loadTexture('src/images/earth/earth_clouds.jpg');
	var moonTexture = loadTexture('src/images/earth/moon.jpg');
	*/

	// low res textures
	var earthTexture = loadTexture('src/images/earth/2k_earth_daymap.jpg');
	var earthBumpmap = loadTexture('src/images/earth/earthbump1k.jpg');
	var earthSpecular = loadTexture('src/images/earth/2k_earth_specular_map.jpg')
	var earthEmissive = loadTexture('src/images/earth/2k_earth_nightmap.jpg')
	var cloudTexture = loadTexture('src/images/earth/2k_earth_clouds.jpg');
	var moonTexture = loadTexture('src/images/earth/2k_moon.jpg');

	var marsTexture = loadTexture('src/images/mars/2k_mars.jpg');
	var phobosTexture = loadTexture('src/images/mars/phobos_low.jpg');
	var deimosTexture = loadTexture('src/images/mars/deimos_high.jpg');
	
	
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

	
	
	// render sun object and sub objects
	this.sunMaterial;
	this.coronaPlane1;
	this.coronaPlane2;
	this.coronaPlane3;
	
	this.renderSun = function(group){
		
		var sun = new THREE.Group();
		var corona = this.sunCorona;
		var coronaScale = 18;
		
		var sunRadius = attributes.sunSystem.sun.radius;
		var sunGeometry = new THREE.SphereGeometry(sunRadius, sphereDetail, sphereDetail);
		this.sunMaterial = new THREE.MeshLambertMaterial({
			map: sunTexture,
			emissive: 0xffffff,
			emissiveMap: sunTexture,
			emissiveIntensity: 1
		});
		var sunMesh = new THREE.Mesh(sunGeometry, this.sunMaterial);
		sunMesh.name = "sun";
		sun.add(sunMesh);
		this.celestials.sun.add(sun);
		

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
		
		/*
		this.coronaPlane1.position.x = attributes.sunSystem.sun.radius * 4;
		this.coronaPlane2.position.x = -attributes.sunSystem.sun.radius * 4;

		this.coronaPlane1.position.z = attributes.sunSystem.sun.radius * 4;
		this.coronaPlane1.position.z = -attributes.sunSystem.sun.radius * 4;
*/
		
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
	
	
	

	// render mercury
	this.renderMercury = function(group){
		var mercuryRadius = attributes.mercurySystem.mercury.radius;
		var mercuryGeometry = new THREE.SphereGeometry(mercuryRadius, sphereDetail, sphereDetail);
		var mercuryMaterial = new THREE.MeshLambertMaterial({
			map: mercuryTexture
		});
		var mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
		mercuryMesh.name = "mercury";
		this.celestials.mercury.add(mercuryMesh);
		group.add(this.celestials.mercury);
	}
	
	
	
	// render venus
	this.renderVenus = function(group){

		var venusRadius = attributes.venusSystem.venus.radius;
		var venusGeometry = new THREE.SphereGeometry(venusRadius, sphereDetail, sphereDetail);
		var venusMaterial = new THREE.MeshLambertMaterial({
			map: venusTexture
		});
		this.venusSurface.geometry = venusGeometry;
		this.venusSurface.material = venusMaterial;
		this.venusSurface.name = "venus";
		this.celestials.venus.add(this.venusSurface);
		
		var cloudGeometry = new THREE.SphereGeometry(venusRadius*1.015, sphereDetail, sphereDetail)
		var cloudMaterial = new THREE.MeshPhongMaterial({
			map : venusClouds,
			alphaMap: venusClouds,
			opacity: 0.75,
			transparent: true,
			depthWrite: false
		})
		this.venusClouds.geometry = cloudGeometry;
		this.venusClouds.material = cloudMaterial;
		this.celestials.venus.add(this.venusClouds);
		
		group.add(this.celestials.venus);
	}
	
	
	
	// render earth:
	this.renderEarth = function(group){

		var earth = this.earthSurface;
		var clouds = this.earthClouds;
		var moon = this.celestials.moon;
		
		this.celestials.earth.add(earth);
		this.celestials.earth.add(clouds);
		group.add( this.celestials.earth );
		group.add( moon );


		// render earth surface
		var earthRadius = attributes.earthSystem.earth.radius;
		var earthGeometry = new THREE.SphereGeometry(earthRadius, sphereDetail, sphereDetail);
		var earthMaterial = new THREE.MeshPhongMaterial({
			map: earthTexture,
			bumpMap: earthBumpmap,
			bumpScale: attributes.planetScale,
			specularMap: earthSpecular,
			specular: 0x665A3C,
			emissive: 0xffffff,
			emissiveMap: earthEmissive,
			emissiveIntensity: 1
		});
		earth.geometry = earthGeometry;
		earth.material = earthMaterial;
		earth.name = "earth";

		// render earth clouds
		var cloudGeometry = new THREE.SphereGeometry(earthRadius*1.01, sphereDetail, sphereDetail)
		var cloudMaterial = new THREE.MeshPhongMaterial({
			map : cloudTexture,
			alphaMap: cloudTexture,
			opacity: 1,
			transparent: true,
			depthWrite: false
		})
		clouds.geometry = cloudGeometry;
		clouds.material = cloudMaterial;
		
		// render moon
		var moonRadius = attributes.earthSystem.moon.radius;
		var moonGeometry = new THREE.SphereGeometry(moonRadius, sphereDetail, sphereDetail);
		var moonMaterial = new THREE.MeshLambertMaterial({
			map: moonTexture
		});
		var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
		moonMesh.name = "moon";
		moon.add(moonMesh);
	}
	
	// render mars
	this.renderMars = function(group){		
		var marsRadius = attributes.marsSystem.mars.radius;
		var marsGeometry = new THREE.SphereGeometry(marsRadius, sphereDetail, sphereDetail);
		var marsMaterial = new THREE.MeshLambertMaterial({
			map: marsTexture
		});
		var marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
		marsMesh.name = "mars";
		this.celestials.mars.add(marsMesh);
		group.add(this.celestials.mars);
		
		var phobosRadius = attributes.marsSystem.phobos.radius;
		var phobosGeometry = new THREE.SphereGeometry(phobosRadius, sphereDetail, sphereDetail);
		var phobosMaterial = new THREE.MeshLambertMaterial({
			map: phobosTexture
		});
		var phobosMesh = new THREE.Mesh(phobosGeometry,phobosMaterial);
		phobosMesh.name = "phobos";
		this.celestials.phobos.add(phobosMesh);
		group.add(this.celestials.phobos);
		
		
		var deimosRadius = attributes.marsSystem.deimos.radius;
		var deimosGeometry = new THREE.SphereGeometry(deimosRadius, sphereDetail, sphereDetail);
		var deimosMaterial = new THREE.MeshLambertMaterial({
			map: deimosTexture
		});
		var deimosMesh = new THREE.Mesh(deimosGeometry,deimosMaterial);
		deimosMesh.name = "deimos";
		this.celestials.deimos.add(deimosMesh);
		group.add(this.celestials.deimos);
	}
	
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
		
		scene.add(universe);

		
		for(var body in this.celestials){
			this.celestials[body].name = body + "Group";
		}
		
//		scene.add(this.scenes.earth);
		
//		this.force(scene);
	}
	
	function loadTexture(url){
		// load a resource
		var texture = loader.load(
			// resource URL
			url,
			// Function when resource is loaded
			function ( texture ) {
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'Error loading texture: ' + url );
			}
		);

		return texture;
	}
}]);

