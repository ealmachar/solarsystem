app.service('camera', ['planets', 'attributes', 'state', 'effects', function(planets, attributes, state, effects){
	var camera = new THREE.PerspectiveCamera(camerafov, window.innerWidth / window.innerHeight, 0.01, 999999999999 );
	
	var theta = 0; // camera's horizontal plane coordinate = starting coordinate
	var phi = 1*Math.PI/8; // camera's vertical plane coordinate = starting coordinate
	var radius = 1000000000000; // camera's distance

	var cameraRotateModifer = 1;
	var cameraMoveModifier = .001;

	var camerafov = 65;
	var cameraFocus = new THREE.Vector3(0, 0, 0);;
	
	var idleRotation = 0.00005;
	
	this.mouseOverExhibit = false;
	this.mouseOverPanel = false;
	
	var worldPos = new THREE.Vector3();

	// whether camera should fly or not
	this.cameraFly = true;
	
	// these variables are used by flyTick to handle contiguous camera movement
	var focused = false;

	var targetLast = null;
	var radiusStart = radius;
	var radiusEnd;
	var flying = false;
	var flyStart = new THREE.Vector3();
	var flyProgress = 0;
	var flyMax = 200;

	

	this.addPauseAnim;
	
	/*
	// camera flies in accordance to this travel function
	var travFcn = [];
	*/
	
	this.camera = camera;
	
	this.mouseInit = function(){
		var move = false;
		
		document.addEventListener('contextmenu', function(ev) {
			ev.preventDefault();
			return false;
		}, false);

		document.addEventListener("mousedown", function(event){
			move = true;
		}, false);

		document.addEventListener("mouseup", function(event){
			move = false;
		}, false);
		
		document.addEventListener("mousemove", function(event){

			if(move){
				if(state.isChrome && event.which == 1 ||
					((state.isEdge || state.isFirefox) && event.buttons == 1)){
					if(!this.mouseOverPanel){
						cameraRotate(event.movementX * 0.2, event.movementY * 0.2);
					}
				}
				else if(state.isChrome && event.which == 3 ||
						((state.isEdge || state.isFirefox) && event.buttons == 2)){
					
					// if the world has been moved, the focus target is cancelled
					this.resetFlyingCam(false);
					this.resetFlyingRotateCam();
					
					worldMove(event.movementX, -event.movementY);
				}
			}
		}.bind(this), false);

		document.addEventListener( 'wheel', function(event){
			
			if(!this.mouseOverExhibit){
				if(event.deltaY < 0)
					radius /= 1.1;
				else if(event.deltaY > 0)
					radius *= 1.1;
				
				cameraApply();
			}
		}.bind(this), false );
	}
	


	this.cameraInit = function(){
		//this.initTravFcn();
	}
	
	/*
	// when the camera flies, it flies in a gauss like fashion
	// slow start, fast middle, slow end
	// f(x) = ((sin(sin(sin(sin( PI/2 )))) + 1 ) * 0.5)^3 - ((sin(sin(sin(sin( -x )))) + 1 ) * 0.5)^3
	// where -pi/2 < x < pi/2
	this.initTravFcn = function(){
		var min, max, progress;
		
		var fcn = function(x){
			// x is 0 < x < flyMax
			// translate to -pi/2 < x < pi/2
			// end goal: sin(-pi/2) = -1 to sin(pi/2) = 1
			var input = ( x / flyMax ) * Math.PI - Math.PI / 2;
			
			// traversal function
			var travFcn = function(input){
				
				var core = Math.sin( Math.sin( Math.sin( Math.sin( input ) ) ) );
				
				// -1 < result < 1
				// to
				// 0 < result < 1
				core = ( core + 1 ) * 0.5;
				
				// exponent of 3 to dampen
				core = Math.pow(core, 3);
				
				return core;
			}
			
			
			var result = travFcn( Math.PI/2 ) - travFcn( -input );
			
			return result;
		}

		// min and max for translation
		min = fcn(flyProgress);
		max = fcn(flyMax);

		// apply the calculated values to a flyMax element array
		for(var i = flyProgress; i < flyMax; i++){
			progress = fcn(i);
			
			// translate result from min < x < max to 0 < x < 1
			progress = ( progress + ( 1 - max ) ) * ( ( progress - min) / (max - min) );

			travFcn.push(progress);
		}
	}
	*/
	
	// rotation in degrees
	function cameraRotate(x, y){
		// theta is horizontally around the sphere
		// phi is up and down
		theta += cameraRotateModifer * x *2*Math.PI/360;
		phi -= cameraRotateModifer * y * 2*Math.PI/360;
		
		// keep 0 < theta < 2*pi
		theta = ( theta % ( 2 * Math.PI ) + 2 * Math.PI ) % ( 2 * Math.PI );
		
		// phi1 and phi2 are the rotation coordinates
		// for the two corona planes of the sun
		planets.phi1 -= .001 * x;
		planets.phi2 -= .001 * x;
		planets.phi1 %= Math.PI * 2;
		planets.phi2 %= Math.PI * 2;
		
		// spherical coordinate restriction: 0 < phi < PI
		if(phi >= Math.PI)
			phi = Math.PI;
		else if(phi < 2 * Math.PI/360)
			phi = 2 * Math.PI/360;
		
		cameraApply();
	}
	/*
	// because WebGL coordinates have y axis up, rotate coordinates: (x, y, z) -> (z, x, y)
	function cameraMove(z, x){
		var _theta = phi > Math.PI/2 ? theta : -theta;
		var rotate = _theta - Math.PI/2;

		// 2-d rotation matrix, camera pos movement -> world pos movement
		var zDelta = z * Math.cos(rotate) - x * Math.sin(rotate);
		var xDelta = z * Math.sin(rotate) + x * Math.cos(rotate);
		
		zDelta *= radius * cameraMoveModifier;
		xDelta *= radius * cameraMoveModifier;
		
		zDelta *= phi > Math.PI/2 ? -1 : 1;
		
		cameraWorldPosZ += zDelta;
		cameraWorldPosX += xDelta

		cameraFocus.z += zDelta;
		cameraFocus.x += xDelta;

		cameraApply();
	}
	*/
	function cameraApply(){
		// convert (x, y) mouse movement to webgl spherical coordinates (z, x, y)
		var z =  radius * Math.sin(phi) * Math.cos(-theta);
		var x =  radius * Math.sin(phi) * Math.sin(-theta);
		var y =  radius * Math.cos(phi);

		planets.stars.position = cameraFocus;

		var starScale = radius * attributes.au;
		planets.stars.scale.set(starScale,starScale,starScale);
		
		camera.position.set(x, y, z);
		camera.lookAt(cameraFocus);
	}
	

	
	function worldMove(z, x){
		var _theta = phi > Math.PI/2 ? theta : -theta;
		var rotate = -theta + Math.PI/2;

		x *= phi > Math.PI/2 ? -1 : 1;
		
		// 2-d rotation matrix, camera pos movement -> world pos movement
		var zDelta = z * Math.cos(rotate) - x * Math.sin(rotate);
		var xDelta = z * Math.sin(rotate) + x * Math.cos(rotate);
		
		zDelta *= radius * cameraMoveModifier;
		xDelta *= radius * cameraMoveModifier;
		
		worldPos.z += zDelta;
		worldPos.x += xDelta;

		worldApply();
	}
	
	function worldApply(){
		planets.universe.position.set(worldPos.x, worldPos.y, worldPos.z);
	}

	function idleRotate(){
		cameraRotate(-.01, 0);
	}
	
	this.resetFlyingCam = function(keepFocus){
		
		if(!keepFocus){
			focused = false;
			state.deselect();
			targetLast = null;

		}
		
		flying = false;
		flyProgress = 0;
		
	}.bind(this);
	
	this.resetFlyingRotateCam = function(){
		cameraFocus.x = 0;
		cameraFocus.y = 0;
		cameraFocus.z = 0;
		flyRotate = false;
		rotateProgress = 0;
	}
	
	// used by click event to establish target celestial and latch on
	this.camfocus = function(obj){

		focused = true;

		this.initFlyTravel(obj);
		if( state.options.flying && state.options.flyingRotate ){
			this.initFlyRotate(obj);
		}
	}
	
	this.initFlyTravel = function(obj){
		flying = true;
		flyProgress = 0;
		flyStart = negv(planets.universe.position);

		radiusStart = radius;
		radiusEnd = planets.universe.getObjectByName(obj).geometry.parameters.radius * 4;
	}
	
	this.initFlyRotate = function(obj){
		var sunDir = unitv(planets.universe.getObjectByName(obj + "Group").position, planets.universe.getObjectByName("sunGroup").position);
		var sunAngle = Math.atan2(sunDir.x, sunDir.z);
		
		flyRotate = true;
		
		if( sunAngle > 0 ){
			sunAngle -= Math.PI * 2;
		}
		sunAngle *= -1;

		rotateInterval = Math.PI / 6;

		if( theta < sunAngle ){
			if( sunAngle - theta < Math.PI ){
//				rotateEnd = theta + rotateInterval;
			}
			else{
				rotateInterval *= -1;
			}
		}
		else{
			if( theta - sunAngle < Math.PI ){
				rotateInterval *= -1;
			}
			else{
//				rotateEnd = theta + rotateInterval;
			}
		}

		rotateEnd = theta + rotateInterval;

/*
		if(theta > rotateEnd)
			rotateInterval = theta - rotateEnd;
		else{
			rotateInterval = Math.PI * 2 - rotateEnd + theta
		}*/

		//			rotateInterval = theta - rotateEnd;
	}
	
	// called per render tick to calculate camera movement and radius when flying
	this.flyTick = function(){

		var flyEnd = planets.celestials[state.target].position;

		// if the starting point is moving, keep flystart moving with it
		if( targetLast != null ) {
			flyStart = planets.celestials[targetLast].position;
		}
		
		var stepModifier;

		// piecewise camera travel function (same as camera rotate-while-flying function)
		// -( (1 - (2*x)^ 6 ) * 0.5 - 0.5) for  0 < x <= 0.5
		// ( 1 - (2*x - 2 )^6 ) * 0.5 + 0.5 for 0.5 < x < 1
		if(flyProgress/flyMax <= 0.5){
			stepModifier = -( (1 - Math.pow( (2 * flyProgress/flyMax), 6 ) ) * 0.5 - 0.5);
		}
		else{
			stepModifier = ( 1 - Math.pow( ( 2 * flyProgress/flyMax - 2 ), 6 ) ) * 0.5 + 0.5;
		}
		
		//stepModifier = travFcn[flyProgress];
		//stepModifier = (1 - Math.pow((flyProgress/flyMax - 1), 6));
		//var stepModifier = 1 - Math.pow( (flyProgress/flyMax - 1), 2);
		
		// find the difference between camera start and target and
		// travel along that distance from 0.0x t 1.0x of that distance per tick
		var pos = new THREE.Vector3();
		pos.x = -flyStart.x - ( flyEnd.x - flyStart.x ) * stepModifier;
		pos.y = -flyStart.y - ( flyEnd.y - flyStart.y ) * stepModifier;
		pos.z = -flyStart.z - ( flyEnd.z - flyStart.z ) * stepModifier;

		worldPos = pos;
		
		worldApply();

		radius = radiusEnd + ( radiusStart - radiusEnd ) * ( 1 - stepModifier );

		cameraApply();
		
		flyProgress += 1;
		
		if(flyProgress/flyMax > 0.8){
			state.exhibit();
		}
		
		if(flyProgress > flyMax){
			this.resetFlyingCam(true);
		}
	}
	
		
	var flyRotate = false;
	var rotateStart = theta;
	var rotateProgress = 0;
	var rotateMax = flyMax;
	var rotateInterval;
	
	// called per render tick to calculate camera rotation and focus while flying
	this.flyRotateTick = function(){
		var stepModifier;		

		// piecewise camera rotate-while-flying function (same as travel function)
		if(rotateProgress/rotateMax <= 0.5){
			stepModifier = -( (1 - Math.pow( (2 * rotateProgress/rotateMax), 6 ) ) * 0.5 - 0.5);
		}
		else{
			stepModifier = ( 1 - Math.pow( ( 2 * rotateProgress/rotateMax - 2 ), 6) ) * 0.5 + 0.5;
		}
		
		// focus on new target, then transition focus back to (0, 0, 0)
		// where target will be eventually
		cameraFocus = planets.celestials[state.target].getWorldPosition().multiplyScalar(rotateProgress/rotateMax);

		
		// apply rotation with theta already modified
		cameraRotate(0, 0);

		rotateProgress += 1;
		
		if(rotateProgress > rotateMax){
			this.resetFlyingRotateCam();
		}
	}

	this.tick = function(){


		
		if( this.cameraFly && flying ){
			if( !state.options.flying )
				flyProgress = flyMax;
			this.flyTick();
			effects.tick();
		}
		else if(focused){

			// if the camera is focused on a celestial
			// keep on that celestial
			// i.e. move the world so the camera (0, 0, 0) can keep eyes on it
			worldPos = negv( planets.celestials[state.target].position );
			worldApply();
		}
		

		
		planets.sunAnimate(camera, radius);
//		planets.earth.material.specular = specular;
		planets.universe.updateMatrixWorld( true );
		
		if(flyRotate){
			this.flyRotateTick();
		}

		idleRotate();
	}
	
}]);

var log = 60;

var specular = {r:0.5, g:0.5, b:0.5};

function toRGB(r, g, b){
	specular.r = r/255;
	specular.g = g/255;
	specular.b = b/255;
}