app.service('physics', ['planets', 'attributes', 'ui', 'state', function(planets, attributes, ui, state){
	var g = 6.674E-11;
	var earthSystem = planets.celestials;

	
	this.init = function(){

	}
	
	this.distance;

	this.tick = function(){
		planets.earthSurface.rotation.y += 0.0001;
		planets.earthClouds.rotation.y += 0.00013;

		planets.venusSurface.rotation.y += 0.0001;
		planets.venusClouds.rotation.y += 0.0002;
/*		
		var earth = attributes.earthSystem.earth;
		var moon = attributes.earthSystem.moon;
		var sun = attributes.sunSystem.sun;

		
		
		var force_s = calcForce(earth, sun);
		var x_s = force_s.x;
		var y_s = force_s.y;
		var z_s = force_s.z;
		var r_s = Math.sqrt(Math.pow(x_s, 2) + Math.pow(y_s, 2) + Math.pow(z_s, 2));
		
		//console.log("moon: " + Math.sqrt(Math.pow(moon.vx,2) + Math.pow(moon.vy,2) + Math.pow(moon.vz,2)));
		
		var force = calcForce(moon, earth);
		var x = force.x;
		var y = force.y;
		var z = force.z;
//		var x = moon.fx;
//		var y = moon.fy;
//		var z = moon.fz;
		var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
		

		
		x /= r;
		y /= r;
		z /= r;
		var dis = distance(earth, sun);
		x *= dis;
		y *= dis;
		z *= dis;
		
		//this.distance = r.toExponential();
		this.distance = dis;

		
		//console.log(unitx + " " + unity + " " + unitz);
		
		var sphere = planets.forceSphere.position.set(
			earthSystem.moon.position.x + x,
			earthSystem.moon.position.y + y,
			earthSystem.moon.position.z + z
		);
*/
		

//console.log("-------------");

		// calculate force for every celestial:
		// there are two levels:
		// - planet system
		// - solar system
		
		// for each celestial, calculate force with every other celestial within
		// the same planet system.
		// e.g.
		// phobos -> mars, phobos -> deimos,
		// mars -> phobos, mars -> deimos,
		// deimos -> phobos, deimos -> mars
		
		// then, for each celestial, calculate force with every other planetary system.
		// e.g.
		// phobos -> earth system
		// phobos -> jupiter system
		// etc.
		attributes.systems.forEach(function(system, sysIndexa){
			for(var body in system){
				if(body != 'core'){
					for(var target in system){
						if(target != body && target != 'core'){
//							console.log("target: " + target + ", body: " + body);
							updateForce(system[body], system[target]);
						}
					}
					attributes.systems.forEach(function(targetPlanet, sysIndexb){
						if(sysIndexb != sysIndexa){
//							console.log("target: " + targetPlanet.core.name + ", body: " + body + " | target stats: " + targetPlanet.core.mass + ", x: " + targetPlanet.core.x + ", z: " + targetPlanet.core.z);
							updateForce(system[body], targetPlanet.core);
						}
					})
				}
			}
		});

		// apply the accumulated calculated force of every celestial body down to their position
		attributes.systems.forEach(function(system, sysIndexa){
			for(var body in system){
				if(body != 'core'){
					updateAcceleration(system[body]);
					updateVelocity(system[body]);
					updatePosition(system[body]);
//					if(body != "earth")
						applyPosition(planets.celestials[body], system[body], body, system['core']);
					
					if(ui.panelTickTime > ui.panelTickRate){
						if(body == state.target){
							ui.panelTick(system[body]);
							ui.panelTickTime = 0;
						}
					}
					
					resetForce(system[body]);
				}
			}
		});

		
		attributes.updateCore();
		
		/*
		
		updateForce(earth, moon);
		updateForce(moon, earth);
		updateForce(earth, sun);
		updateForce(sun, earth);
		updateForce(moon, sun);
		updateForce(sun, moon);
		
		updateAcceleration(earth);
		updateAcceleration(moon);
		updateAcceleration(sun);
		
		updateVelocity(earth);
		updateVelocity(moon);
		updateVelocity(sun);
		
		updatePosition(earth);
		updatePosition(moon);
		updatePosition(sun);
		
		applyPosition(planets.celestials.earth, earth);
		applyPosition(planets.celestials.moon, moon);
		applyPosition(planets.celestials.sun, sun);
		
		resetForce(earth);
		resetForce(moon);
		resetForce(sun);
		*/
		
	}
	
	function applyCore(render, core){
		render.position.x = core.x;
		render.position.y = core.y;
		render.position.z = core.z;
	}
	
	function applyPosition(render, attr, body, core){
		render.position.x = attr.x;
		render.position.y = attr.y;
		render.position.z = attr.z;
	}

	function updatePosition(body){
		body.x += body.vx * state.t;
		body.y += body.vy * state.t;
		body.z += body.vz * state.t;
	}

	function updateVelocity(body1){
		body1.vx += body1.ax * state.t;
		body1.vy += body1.ay * state.t;
		body1.vz += body1.az * state.t;
	}

	function updateAcceleration(body1){
		body1.ax += body1.fx / body1.mass;
		body1.ay += body1.fy / body1.mass;
		body1.az += body1.fz / body1.mass;
	}

	function resetForce(body){
		body.ax = 0;
		body.ay = 0;
		body.az = 0;
		body.fx = 0;
		body.fy = 0;
		body.fz = 0;
	}

	function updateForce(body1, body2){
		var force = calcForce(body1, body2);
		body1.fx += force.x;
		body1.fy += force.y;
		body1.fz += force.z;
	}

	function calcForce(body1, body2){
		var m1 = body1.mass;
		var m2 = body2.mass;
		var r = distance(body1, body2);
		
		var force = ( g * m1 * m2 ) / Math.pow(r, 2);
		var unit = unitDistance(body1, body2, r);

		return new THREE.Vector3(
			unit.x * force,
			unit.y * force,
			unit.z * force
		);
	}

	function distance(body1, body2){
		var x = Math.pow( ( body1.x - body2.x ), 2);
		var y = Math.pow( ( body1.y - body2.y ), 2);
		var z = Math.pow( ( body1.z - body2.z ), 2);

		return Math.sqrt(x + y + z);
	}

	function unitDistance(body1, body2, r){
		var x = (body2.x - body1.x) / r;
		var y = (body2.y - body1.y) / r;
		var z = (body2.z - body1.z) / r;

		return new THREE.Vector3(x, y, z);
	}
	
	function toAu(number){
		return number / 149597870.700;
	}
	
	function toKm(number){
		return number * 149597870.700;
	}
	
}]);