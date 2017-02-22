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
			tilt: 7.25,
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
			tilt: 0.03,
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
			tilt: 2.64,
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
			tilt: 23.44,
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
			tilt: 6.68,
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
			tilt: 25.19,
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
	
	this.jupiterSystem = {
		core: {
			name: "jupiter",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		jupiter: {
			tilt: 3.13,
			mass: 1.8986E27 * systemScale,
			radius: 71492 * planetScale,
			z: -5.323666822504500E+00 * toMet,
			x: -1.170565812612325E+00 * toMet,
			y: 1.239211904490369E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 1.531760621096628E-03 * toMps,
			vx: -7.012904658898982E-03 * toMps,
			vy: -5.170898979077413E-06 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		io: {
			mass: 8.931938E22 * systemScale,
			radius: 1821.6 * planetScale,
			z: -5.320966055233946E+00 * toMet,
			x: -1.171402760871349E+00 * toMet,
			y: 1.239302664108334E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 4.456083803386890E-03 * toMps,
			vx: 2.525565004954336E-03 * toMps,
			vy: 3.748470078145973E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		europa: {
			mass: 4.799844E22 * systemScale,
			radius: 1560.8 * planetScale,
			z: -5.326558172311016E+00 * toMet,
			x: -1.173970347982178E+00 * toMet,
			y: 1.237224908364314E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 7.650727413371084E-03 * toMps,
			vx: -1.210687405266714E-02 * toMps,
			vy: -1.219074024635514E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		ganymede: {
			mass: 1.4819E23 * systemScale,
			radius: 2634.1 * planetScale,
			z: -5.324365386419746E+00 * toMet,
			x: -1.177677094268297E+00 * toMet,
			y: 1.236431090771750E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 7.790001142833770E-03 * toMps,
			vx: -7.623620225616394E-03 * toMps,
			vy: 5.429130634748440E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		callisto: {
			mass: 1.075938E23 * systemScale,
			radius: 2410.3 * planetScale,
			z: -5.329942351085570E+00 * toMet,
			x: -1.181527217197104E+00 * toMet,
			y: 1.234894093922478E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 5.642049290252793E-03 * toMps,
			vx: -9.331329697969249E-03 * toMps,
			vy: -2.383606630577504E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}
	
	this.saturnSystem = {
		core: {
			name: "saturn",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		saturn: {
			tilt: 26.73,
			mass: 5.6836E26 * systemScale,
			radius: 58232 * planetScale,
			z: -1.745924800046244E+00 * toMet,
			x: -9.889249288621437E+00 * toMet,
			y: 2.414337933526216E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 5.188719833757616E-03 * toMps,
			vx: -9.876337352590107E-04 * toMps,
			vy: -1.893641935602027E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		mimas: {
			mass: 3.7493E19 * systemScale,
			radius: 198.2 * planetScale,
			z: -1.744708588767967E+00 * toMet,
			x: -9.889328203266706E+00 * toMet,
			y: 2.413681074420811E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 5.348008127768450E-03 * toMps,
			vx: 6.339945861936707E-03 * toMps,
			vy: -4.295465291694064E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		enceladus: {
			mass: 1.08022E20 * systemScale,
			radius: 252.1 * planetScale,
			z: -1.747284104625882E+00 * toMet,
			x: -9.888467904083832E+00 * toMet,
			y: 2.411561676572130E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 1.472171740483067E-03 * toMps,
			vx: -6.389088311672477E-03 * toMps,
			vy: 3.000420327791102E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		tethys: {
			mass: 6.17449E20 * systemScale,
			radius: 531.1 * planetScale,
			z: -1.747065809308882E+00 * toMet,
			x: -9.887798737906691E+00 * toMet,
			y: 2.407449258545723E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -1.354610823723231E-04 * toMps,
			vx: -4.165770848712278E-03 * toMps,
			vy: 1.938393459637861E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		dione: {
			mass: 1.095452E21 * systemScale,
			radius: 561.4 * planetScale,
			z: -1.743544130033009E+00 * toMet,
			x: -9.888616070065332E+00 * toMet,
			y: 2.408726285298083E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 3.307024720600712E-03 * toMps,
			vx: 3.928906374643929E-03 * toMps,
			vy: -2.583810920688671E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		rhea: {
			mass: 2.306518E21  * systemScale,
			radius: 763.8 * planetScale,
			z: -1.743725954325991E+00 * toMet,
			x: -9.886893902756295E+00 * toMet,
			y: 2.400108456405849E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 1.382475340629571E-03 * toMps,
			vx: 1.882807461580119E-03 * toMps,
			vy: -1.328179101489104E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		titan: {
			mass: 1.3452E23 * systemScale,
			radius: 2575.5 * planetScale,
			z: -1.746271785525971E+00 * toMet,
			x: -9.881919877472027E+00 * toMet,
			y: 2.376903893964003E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 2.010306301786404E-03 * toMps,
			vx: -9.016808362619786E-04 * toMps,
			vy: 8.163582852658927E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		iapetus: {
			mass: 1.805635E21 * systemScale,
			radius: 734.5 * planetScale,
			z: -1.735830310316000E+00 * toMet,
			x: -9.869244151985125E+00 * toMet,
			y: 2.347645676312908E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 3.515278642266117E-03 * toMps,
			vx: -5.432937075323744E-05 * toMps,
			vy: -6.769256326170701E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}
    

	this.uranusSystem = {
		core: {
			name: "uranus",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		uranus: {
			tilt: -82.23,
			mass: 8.6810E25 * systemScale,
			radius: 25362 * planetScale,
			z: 1.830626495120643E+01 * toMet,
			x: 7.909055891170896E+00 * toMet,
			y: -2.077864632341689E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -1.588574653786703E-03 * toMps,
			vx: 3.427182108197761E-03 * toMps,
			vy: 3.337098020955977E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		ariel: {
			mass: 1.353E21 * systemScale,
			radius: 578.9 * planetScale,
			z: 1.830725792354167E+01 * toMet,
			x: 7.908948218989409E+00 * toMet,
			y: -2.069934460278584E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 2.921812844244092E-04 * toMps,
			vx: 2.674732854767351E-03 * toMps,
			vy: -2.423214076109357E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		umbriel: {
			mass: 1.172E21  * systemScale,
			radius: 584.7 * planetScale,
			z: 1.830763699376759E+01 * toMet,
			x: 7.908611135010714E+00 * toMet,
			y: -2.088363660915978E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -3.210521203051856E-03 * toMps,
			vx: 3.485037945282428E-03 * toMps,
			vy: -2.107670806576378E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		titania: {
			mass: 3.527E21 * systemScale,
			radius: 788.4 * planetScale,
			z: 1.830764302503677E+01 * toMet,
			x: 7.908406208786011E+00 * toMet,
			y: -2.102670483938070E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -3.390383266252124E-03 * toMps,
			vx: 3.673204558163995E-03 * toMps,
			vy: -1.033868038625985E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		oberon: {
			mass: 3.014E21 * systemScale,
			radius: 761.4 * planetScale,
			z: 1.830321355669432E+01 * toMet,
			x: 7.909377167181916E+00 * toMet,
			y: -2.101954330652213E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -2.657047183264700E-03 * toMps,
			vx: 3.859792030186448E-03 * toMps,
			vy: 1.441479979196472E-03 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		miranda: {
			mass: 6.59E19 * systemScale,
			radius: 235.8 * planetScale,
			z: 1.830620405353133E+01 * toMet,
			x: 7.909158895413776E+00 * toMet,
			y: -2.069258055089396E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 2.217220684593230E-03 * toMps,
			vx: 2.915317053641167E-03 * toMps,
			vy: 3.616677734832078E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}


	this.neptuneSystem = {
		core: {
			name: "neptune",
			mass: 0,
			z: 0,
			x: 0,
			y: 0
		},
		neptune: {
			tilt: 28.32,
			mass: 1.0243E26 * systemScale,
			radius: 24622 * planetScale,
			z: 2.836226263648292E+01 * toMet,
			x: -9.620707654835959E+00 * toMet,
			y: -4.555164999264276E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: 9.878781568812549E-04 * toMps,
			vx: 2.991782159135671E-03 * toMps,
			vy: -8.431817572085201E-05 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		},
		triton: {
			mass: 2.14E22 * systemScale,
			radius: 1353.4 * planetScale,
			z: 2.836341771309743E+01 * toMet,
			x: -9.621692707379474E+00 * toMet,
			y: -4.573383530940803E-01 * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz: -8.286251665316374E-04 * toMps,
			vx: 1.234579309468241E-03 * toMps,
			vy: -2.859066805064568E-04 * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	}

	/*
	: {
			mass:  * systemScale,
			radius:  * planetScale,
			z:  * toMet,
			x:  * toMet,
			y:  * toMet,
			fz: 0,
			fx: 0,
			fy: 0,
			vz:  * toMps,
			vx:  * toMps,
			vy:  * toMps,
			az: 0,
			ax: 0,
			ay: 0
		}
	*/
	
	
	this.systems = [
		this.sunSystem,
		this.mercurySystem,
		this.venusSystem,
		this.earthSystem,
		this.marsSystem,
		this.jupiterSystem,
		this.saturnSystem,
		this.uranusSystem,
		this.neptuneSystem
	];
});   