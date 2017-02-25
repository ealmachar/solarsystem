

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