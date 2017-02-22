
var loader = new THREE.TextureLoader();

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


var starTexture = loadTexture('src/images/stars+milky_way.jpg');

var sunTexture = loadTexture('src/images/sun/texture_sun.jpg');
var coronaTexture = loadTexture('src/images/sun/lensflare0.png');
var coronaTextureFar = loadTexture('src/images/sun/lensflare1.png');

var mercuryTexture = loadTexture('src/images/mercury/2k_mercury.jpg');

var venusTexture = loadTexture('src/images/venus/2k_venus_surface.jpg');
var venusClouds = loadTexture('src/images/venus/2k_venus_atmosphere.jpg');

/*
// high res earth textures
var earthTexture = loadTexture('src/images/earth/earth_daymap.jpg');
var earthBumpmap = loadTexture('src/images/earth/earthbump1k.jpg');
var earthSpecular = loadTexture('src/images/earth/2k_earth_specular_map.jpg')
var earthEmissive = loadTexture('src/images/earth/earth_nightmap.jpg')
var cloudTexture = loadTexture('src/images/earth/earth_clouds.jpg');
var moonTexture = loadTexture('src/images/earth/moon.jpg');
*/

// low res earth textures
var earthTexture = loadTexture('src/images/earth/2k_earth_daymap.jpg');
var earthBumpmap = loadTexture('src/images/earth/earthbump1k.jpg');
var earthSpecular = loadTexture('src/images/earth/2k_earth_specular_map.jpg')
var earthEmissive = loadTexture('src/images/earth/2k_earth_nightmap_e.jpg')
var cloudTexture = loadTexture('src/images/earth/2k_earth_clouds.jpg');
var moonTexture = loadTexture('src/images/earth/2k_moon.jpg');

var marsTexture = loadTexture('src/images/mars/2k_mars.jpg');
var phobosTexture = loadTexture('src/images/mars/phobos_low.jpg');
var deimosTexture = loadTexture('src/images/mars/deimos_high.jpg');

var jupiterTexture = loadTexture('src/images/jupiter/2k_jupiter.jpg');
var ioTexture = loadTexture('src/images/jupiter/io.jpg');
var europaTexture = loadTexture('src/images/jupiter/europa.jpg');
var ganymedeTexture = loadTexture('src/images/jupiter/ganymede.jpg');
var callistoTexture = loadTexture('src/images/jupiter/callisto.jpg');


var saturnTexture = loadTexture('src/images/saturn/saturn.jpg');
var mimasTexture = loadTexture('src/images/saturn/mimas.jpg');
var enceladusTexture = loadTexture('src/images/saturn/enceladus.jpg');
var tethysTexture = loadTexture('src/images/saturn/tethys.jpg');
var dioneTexture = loadTexture('src/images/saturn/dione.jpg');
var rheaTexture = loadTexture('src/images/saturn/rhea.jpg');
var titanTexture = loadTexture('src/images/saturn/titan.jpg');
var iapetusTexture = loadTexture('src/images/saturn/iapetus.jpg');

var titanAtmosphere = loadTexture('src/images/saturn/titan_a.jpg');
var saturnRingTexture = loadTexture('src/images/saturn/2k_saturn_ring.png');


var uranusTexture = loadTexture('src/images/uranus/uranus.jpg');
var arielTexture = loadTexture('src/images/uranus/ariel.jpg');
var umbrielTexture = loadTexture('src/images/uranus/umbriel.jpg');
var titaniaTexture = loadTexture('src/images/uranus/titania.jpg');
var oberonTexture = loadTexture('src/images/uranus/oberon.jpg');
var mirandaTexture = loadTexture('src/images/uranus/miranda.jpg');

var uranusRingTexture = loadTexture('src/images/uranus/uranus_rings.jpg');
var uranusRingAlpha = loadTexture('src/images/uranus/uranus_rings_alpha.jpg');


var neptuneTexture = loadTexture('src/images/neptune/neptune.jpg');
var tritonTexture = loadTexture('src/images/neptune/triton.jpg');







