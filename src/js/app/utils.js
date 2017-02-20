
var options = {
	flying: true,
	flyingRotate: false,
	textAnimation: false
}

var descriptions = {
	sun:{
		stats: [
		{stat: "Age",									value: "≈ 4.6 billion years"},
		{stat: "Mean distance from Milky Way core",		value: "27,200 light-years"},
		{stat: "Equatorial radius",						value: "695,700 km <br>109 × Earth"},
		{stat: "Mass",									value: "(1.98855±0.00025)×10^30 kg<br>333,000 × Earth"},
		{stat: "Equatorial surface gravity",			value:	"274.0 m/s<sup>2</sup><br>27.94 g<br>28 × Earth"},
		{stat: "Temperature",							value: "Center (modeled): 1.57×10^7 K<br>Photosphere (effective): 5,772 K<br>Corona: 5×10^6 K"},
		{stat: "Composition",							value: "73.46% Hydrogen<br>24.85% Helium<br>0.77% Oxygen<br>0.29% Carbon<br>0.16% Iron<br>0.12% Neon<br>0.09% Nitrogen<br>0.07% Silicon<br>0.05% Magnesium<br>0.04% Sulfur<br>"}
		],
		note: "The Sun is the Solar System's star and by far its most massive component. Its large mass (332,900 Earth masses) produces temperatures and densities in its core high enough to sustain nuclear fusion of hydrogen into helium, making it a main-sequence star. This releases an enormous amount of energy, mostly radiated into space as electromagnetic radiation peaking in visible light.<br><br>The Sun is a G2-type main-sequence star. Hotter main-sequence stars are more luminous. The Sun's temperature is intermediate between that of the hottest stars and that of the coolest stars. Stars brighter and hotter than the Sun are rare, whereas substantially dimmer and cooler stars, known as red dwarfs, make up 85% of the stars in the Milky Way."
	},
	mercury:{
		stats: [
			{stat: "Orbital period", 			value: "87.969 1 d"},
			{stat: "Average orbital speed", 	value: "47.362 km/s"},
			{stat: "Moons", 					value: "none"},
			{stat: "Mean radius", 				value: "2,439.7±1.0 km<br>0.3829 Earths"},
			{stat: "Mass", 						value: "3.3011×10^23 kg<br>0.055 Earths"},
			{stat: "Surface Gravity", 			value: "3.7 m/s<sup>2</sup>0.38 g"},
			{stat: "Mean surface Temp",			value: "min: -173.15 °C<br>mean: 66.85 °C<br>max: 426.85 °C"},
			{stat: "Composition", 				value: "42% molecular oxygen<br>29.0% sodium<br>22.0% hydrogen<br>6.0% helium<br>0.5% potassium"}
		],
		note: "Mercury (0.4 AU from the Sun) is the closest planet to the Sun and the smallest planet in the Solar System (0.055 Earth masses). Mercury has no natural satellites; besides impact craters, its only known geological features are lobed ridges or rupes that were probably produced by a period of contraction early in its history. Mercury's very tenuous atmosphere consists of atoms blasted off its surface by the solar wind. Its relatively large iron core and thin mantle have not yet been adequately explained. Hypotheses include that its outer layers were stripped off by a giant impact; or, that it was prevented from fully accreting by the young Sun's energy."
	},
	venus:{
		stats: [
			{stat: "Orbital period", 			value: "224.701 d"},
			{stat: "Average orbital speed", 	value: "35.02 km/s"},
			{stat: "Moons", 					value: "none"},
			{stat: "Mean radius", 				value: "6,051.8±1.0 km<br>0.9499 Earths"},
			{stat: "Mass", 						value: "4.8675×10^24 kg<br>0.815 Earths"},
			{stat: "Surface Gravity", 			value: "8.87 m/s<sup>2</sup><br>0.904 g"},
			{stat: "Mean surface Temp",			value: "mean: 462 °C"},
			{stat: "Composition", 				value: "96.5% carbon dioxide<br>3.5% nitrogen<br>0.015% sulfur dioxide<br>0.007% argon<br>0.002% water vapour<br>0.0017% carbon monoxide<br>0.0012% helium<br>0.0007% neon"}
		],
		note: "Venus (0.7 AU from the Sun) is close in size to Earth (0.815 Earth masses) and, like Earth, has a thick silicate mantle around an iron core, a substantial atmosphere, and evidence of internal geological activity. It is much drier than Earth, and its atmosphere is ninety times as dense. Venus has no natural satellites. It is the hottest planet, with surface temperatures over 400 °C (752°F), most likely due to the amount of greenhouse gases in the atmosphere. No definitive evidence of current geological activity has been detected on Venus, but it has no magnetic field that would prevent depletion of its substantial atmosphere, which suggests that its atmosphere is being replenished by volcanic eruptions."
	},
	earth: {
		stats: [
			{stat: "Orbital period", 			value: "1.00001742096 yr"},
			{stat: "Average orbital speed", 	value: "29.78 km/s (18.50 mi/s)"},
			{stat: "Moons", 					value: "1 natural satellite: the Moon<br>5 quasi-satellites"},
			{stat: "Mean radius", 				value: "6,371.0 km (3,958.8 mi)"},
			{stat: "Mass", 						value: "5.97237×10^24 kg (1.31668×10^25 lb)"},
			{stat: "Surface Gravity", 			value: "9.807 m/s<sup>2</sup>"},
			{stat: "Mean surface Temp",			value: "min: −89.2 °C<br>mean: 15 °C<br>max: 56.7 °C"},
			{stat: "Composition", 				value: "78.08% nitrogen (N2) (dry air)<br>20.95% oxygen (O2)<br>0.930% argon<br>0.0402% carbon dioxide"}
		],
		note: "Earth (1 AU from the Sun) is the largest and densest of the inner planets, the only one known to have current geological activity, and the only place where life is known to exist. Its liquid hydrosphere is unique among the terrestrial planets, and it is the only planet where plate tectonics has been observed. Earth's atmosphere is radically different from those of the other planets, having been altered by the presence of life to contain 21% free oxygen. It has one natural satellite, the Moon, the only large satellite of a terrestrial planet in the Solar System."
	},
	moon:{
		stats: [
			{stat: "Orbital period", 			value: "27.321661 d"},
			{stat: "Average orbital speed", 	value: "1.022 km/s"},
			{stat: "Mean radius", 				value: "1737.1 km  (0.273 Earths)"},
			{stat: "Mass", 						value: "7.342×1^022 kg  (0.012300 Earths)"},
			{stat: "Surface Gravity", 			value: "1.62 m/s<sup>2</sup>  (0.1654 g)"},
			{stat: "Mean surface Temp",			value: "min: -173.15 °C<br>mean: -53.15 °C<br>max: 116.85 °C"}
		],
		note: "The Moon is an astronomical body that orbits planet Earth, being Earth's only permanent natural satellite. It is the fifth-largest natural satellite in the Solar System, and the largest among planetary satellites relative to the size of the planet that it orbits (its primary). Following Jupiter's satellite Io, the Moon is second-densest satellite among those whose densities are known.<br><br>The Moon is thought to have formed about 4.51 billion years ago, not long after Earth. There are several hypotheses for its origin; the most widely accepted explanation is that the Moon formed from the debris left over after a giant impact between Earth and a Mars-sized body called Theia."
	},
	mars:{
		stats: [
			{stat: "Orbital period", 			value: "686.971 d"},
			{stat: "Average orbital speed", 	value: "24.077 km/s"},
			{stat: "Moons", 					value: "2"},
			{stat: "Mean radius", 				value: "3,389.5±0.2 km"},
			{stat: "Mass", 						value: "6.4171×1023 kg<br>0.107 Earths"},
			{stat: "Surface Gravity", 			value: "3.711 m/s<sup>2</sup>0.376 g"},
			{stat: "Mean surface Temp",			value: "min: −143 °C<br>mean: −63 °C<br>max: 35 °C"},
			{stat: "Composition", 				value: "95.97% carbon dioxide<br>1.93% argon<br> 1.89% nitrogen<br>0.146% oxygen<br>0.0557% carbon monoxide"}
		],
		note: "Mars (1.5 AU from the Sun) is smaller than Earth and Venus (0.107 Earth masses). It has an atmosphere of mostly carbon dioxide with a surface pressure of 6.1 millibars (roughly 0.6% of that of Earth). Its surface, peppered with vast volcanoes, such as Olympus Mons, and rift valleys, such as Valles Marineris, shows geological activity that may have persisted until as recently as 2 million years ago. Its red colour comes from iron oxide (rust) in its soil. Mars has two tiny natural satellites (Deimos and Phobos) thought to be captured asteroids."
	},
	phobos:{
		stats: [
			{stat: "Orbital period", 			value: "0.31891023 d<br>(7 h 39.2 min)"},
			{stat: "Average orbital speed", 	value: "2.138 km/s"},
			{stat: "Mean radius", 				value: "11.2667 km"},
			{stat: "Mass", 						value: "1.0659×10^16 kg"},
			{stat: "Surface Gravity", 			value: "0.0057 m/s<sup>2</sup>"},
			{stat: "Mean surface Temp",			value: "-40.15 °C"}
		],
		note: "Phobos (systematic designation: Mars I) is the innermost and larger of the two natural satellites of Mars, the other being Deimos. Both moons were discovered in 1877 by American astronomer Asaph Hall.<br><br>Phobos is a small, irregularly shaped object with a mean radius of 11 km (7 mi), and is seven times larger than the outer moon, Deimos. Phobos is named after the Greek god Phobos, a son of Ares (Mars) and Aphrodite (Venus), and is the personification of horror.<br><br>Phobos orbits closer to its primary body than any other known planetary moon. It is indeed so close that it orbits Mars much faster than Mars rotates, and completes an orbit in just 7 hours and 39 minutes. As a result, from the surface of Mars it appears to rise in the west, move across the sky in 4 hours and 15 minutes or less, and set in the east, twice each Martian day."
	},
	deimos:{
		stats: [
			{stat: "Orbital period", 			value: "1.263 d<br>(30.312 h)"},
			{stat: "Average orbital speed", 	value: "1.3513 km/s"},
			{stat: "Mean radius", 				value: "6.2 ± 0.18 km"},
			{stat: "Mass", 						value: "1.4762×1015 kg"},
			{stat: "Surface Gravity", 			value: "0.003 m/s<sup>2</sup>"},
			{stat: "Mean surface Temp",			value: "-40.15 °C"}
		],
		note: "Deimos (systematic designation: Mars II) is the smaller and outer of the two natural satellites of the planet Mars, the other being Phobos. Deimos has a mean radius of 6.2 km (3.9 mi) and takes 30.3 hours to orbit Mars. In Greek mythology, Deimos was the twin brother of Phobos and personified terror.<br><br>Deimos is 23,460 km (14,580 mi) from Mars, much further than Mars's other moon, Phobos."
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