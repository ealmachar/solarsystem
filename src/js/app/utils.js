
var options = {
	flying: true,
	flyingRotate: false,
	textAnimation: false
}

var descriptions = {
	sun:{
		stats: [
		],
		note: ""
	},
	mercury:{
		stats: [
		],
		note: ""
	},
	venus:{
		stats: [
		],
		note: ""
	},
	earth: {
		stats: [
			{stat: "Orbital period", 			value: "1.00001742096 yr"},
			{stat: "Average orbital speed", 	value: "29.78 km/s (18.50 mi/s)"},
			{stat: "Moons", 					value: "1 natural satellite: the Moon<br>5 quasi-satellites"},
			{stat: "Mean radius", 				value: "6,371.0 km (3,958.8 mi)"},
			{stat: "Mass", 						value: "5.97237×1024 kg (1.31668×1025 lb)"},
			{stat: "Surface Gravity", 			value: "9.807 m/s<sup>2</sup>"},
			{stat: "Mean surface Temp",			value: "15 °C"},
			{stat: "Composition", 				value: "78.08% nitrogen (N2) (dry air)<br>20.95% oxygen (O2)<br>0.930% argon<br>0.0402% carbon dioxide"}
		],
		note: "Earth (1 AU from the Sun) is the largest and densest of the inner planets, the only one known to have current geological activity, and the only place where life is known to exist. Its liquid hydrosphere is unique among the terrestrial planets, and it is the only planet where plate tectonics has been observed. Earth's atmosphere is radically different from those of the other planets, having been altered by the presence of life to contain 21% free oxygen. It has one natural satellite, the Moon, the only large satellite of a terrestrial planet in the Solar System."
	},
	moon:{
		stats: [
		],
		note: "moon!"
	},
	mars:{
		stats: [
		],
		note: ""
	},
	phobos:{
		stats: [
		],
		note: ""
	},
	deimos:{
		stats: [
		],
		note: ""
	},
}

function negv(a){
	return {
		x: a.x * -1,
		y: a.y * -1,
		z: a.z * -1
	};
}

function subv(a, b){
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	};
}

function disv(a, b){
	var x = a.x - b.x;
	var y = a.y - b.y;
	var z = a.z - b.z;

	return Math.sqrt(Math.pow( x, 2 ) + Math.pow( y, 2 ) + Math.pow( z, 2 ));
}

function magv(x, y, z){
	return Math.sqrt(Math.pow( x, 2 ) + Math.pow( y, 2 ) + Math.pow( z, 2 ));
}

function unitv(a, b){
	var dis = disv(a, b);

	var result = new THREE.Vector3(
		( b.x - a.x ) / dis,
		( b.y - a.y ) / dis,
		( b.z - a.z ) / dis
	)
	
	return result;
}