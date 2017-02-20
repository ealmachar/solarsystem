app.service('attributes', function(){
	this.planetScale = 1000;
	var planetScale = this.planetScale;
	var systemScale = 1;
	var toMet = 149597870700 * systemScale; // convert to meters then scale
	var toSec = 86400;
	var toMps = toMet / toSec; // convert to meters per second
	
	this.au = 149597870700;



	// the core of each planetary system holds the position for each planet system
	// and serves as a reference for every celestial outside of a certain system.
	// This core follows the major planetary body. e.g. Jupiter, Saturn, etc.
	this.updateCore = function(){
		var systems = this.systems;

		systems.forEach(function(obj){
			var planet = obj[obj.core.name];
			obj.core.z = planet.z;
			obj.core.x = planet.x;
			obj.core.y = planet.y;
		});
	}.bind(this);
	
	
	this.init = function(){
		var systems = this.systems;
		
		// the core for each planetary system coalates all masses around each planet
		// to 1 point for easier n-body calculation between all celestials in the solar system
		systems.forEach(function(obj){
			var mass = 0;
			for(var key in obj){
				if(key != 'core'){
					mass += obj[key].mass;
				}
			}

			obj.core.mass = mass;
			this.updateCore();
		}.bind(this));
	};
	

	
	this.sunSystem = {
		core: {
			name: "sun",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		sun: {
			mass: 1.98855e30 * systemScale,
			radius: 695700 * planetScale,
			z: 3.322919884285263E-03 * toMet,	// convert to meters
			x: 4.090892918787003E-03 * toMet,
			y: -1.548215868103130E-04 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -2.833994001153440E-06 * toMps,	// convert to meters per second
			vx: 6.700385532915028E-06 * toMps,
			vy: 5.935134212415621E-08 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}
	
	this.mercurySystem = {
		core: {
			name: "mercury",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		mercury: {
			mass: 3.3011E23 * systemScale,
			radius: 2439.7 * planetScale,
			z: -3.524856044854435E-01 * toMet,
			x: -2.503776956108322E-01 * toMet,
			y: 1.169446198093271E-02 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 1.059839602346408E-02 * toMps,
			vx: -2.162887494246037E-02 * toMps,
			vy: -2.740407643962732E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}
	
	this.venusSystem = {
		core: {
			name: "venus",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		venus: {
			mass: 4.8675E24 * systemScale,
			radius: 6051.8 * planetScale,
			z: 4.475245939506958E-02 * toMet,
			x: 7.227181615964529E-01 * toMet,
			y: 7.308232515389403E-03 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -2.026406994137778E-02 * toMps,
			vx: 1.066002306125315E-03 * toMps,
			vy: 1.183784159608660E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}
	
	this.earthSystem = {
		core: {
			name: "earth",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		earth: {
			mass: 5.97237e24 * systemScale,
			radius: 6371.0 * planetScale,
			z: -5.464223752370574E-01 * toMet,
			x: 8.206832490008480E-01 * toMet,
			y: -1.858493934846421E-04 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -1.456117753403602E-02 * toMps,
			vx: -9.664554773299538E-03 * toMps,
			vy: 6.667427731885614E-07 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		moon: {
			mass: 7.342e22 * systemScale,
			radius: 1737.1 * planetScale,
			z: -5.469665603990332E-01 * toMet,
			x: 8.180578897635700E-01 * toMet,
			y: 5.041830837993954E-05 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -1.400707147674953E-02 * toMps,
			vx: -9.765908067308459E-03 * toMps,
			vy: -1.358604530005099E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}

	this.marsSystem = {
		core: {
			name: "mars",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		mars: {
			mass: 6.4171E23 * systemScale,
			radius: 3389.5 * planetScale,
			z: 1.245474370837632E+00 * toMet,
			x: 7.143047129011287E-01 * toMet,
			y: -1.575689996657593E-02 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -6.414336671170149E-03 * toMps,
			vx: 1.335171186496036E-02 * toMps,
			vy: 4.370642455387109E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		phobos: {
			mass: 1.0659E16 * systemScale,
			radius: 11.2667 * planetScale,
			z: 1.245503999200118E+00 * toMet,
			x: 7.142537810253659E-01 * toMet,
			y: -1.577611429394874E-02 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -5.466687038865857E-03 * toMps,
			vx: 1.404634175130029E-02 * toMps,
			vy: 1.542003797480401E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		deimos: {
			mass: 1.4762E15 * systemScale,
			radius: 6.2 * planetScale,
			z: 1.245427429953440E+00 * toMet,
			x: 7.141552854297236E-01 * toMet,
			y: -1.574895860763139E-02 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -5.747044525910955E-03 * toMps,
			vx: 1.312440385686877E-02 * toMps,
			vy: 1.025490201884129E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}

	
	this.systems = [
		this.sunSystem,
		this.mercurySystem,
		this.venusSystem,
		this.earthSystem,
		this.marsSystem
	];
});   