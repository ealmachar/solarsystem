app.service('webgl', function(){
	
	//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_objects_with_WebGL
	
	var gl; // A global variable for the WebGL context
	var canvas;
	
	var cubeVerticesBuffer;
	var cubeVerticesColorBuffer;
	var cubeVerticesIndexBuffer;
	var cubeVerticesIndexBuffer;
	var cubeRotation = 0.0;
	var cubeXOffset = 0.0;
	var cubeYOffset = 0.0;
	var cubeZOffset = 0.0;
	var lastCubeUpdateTime = 0;
	var xIncValue = 0.2;
	var yIncValue = -0.4;
	var zIncValue = 0.3;
	
	var mvMatrix;
	var shaderProgram;
	var vertexPositionAttribute;
	var vertexColorAttribute;
	var perspectiveMatrix;

	var squareRotation = 0.0;
	
	this.start = function() {
		canvas = document.getElementById("glcanvas");

		// Initialize the GL context
		gl = initWebGL(canvas);

		// Only continue if WebGL is available and working
		if (!gl) {
		return;
		}

		// Set clear color to black, fully opaque
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// Enable depth testing
		gl.enable(gl.DEPTH_TEST);
		// Near things obscure far things
		gl.depthFunc(gl.LEQUAL);
		// Clear the color as well as the depth buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		initShaders();
		
		initBuffers();
		gl.viewport(0, 0, window.innerWidth, window.innerHeight)
		glcanvas.width = window.innerWidth;
		glcanvas.height = window.innerHeight;
		window.onresize = function(){
			//gl.viewport(0, 0, window.innerWidth, window.innerHeight)
			glcanvas.width = window.innerWidth;
			glcanvas.height = window.innerHeight;
		};
		setInterval(drawScene, 15);
	}

	function initWebGL(canvas) {
		gl = null;

		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// If we don't have a GL context, give up now
		if (!gl) {
			alert("Unable to initialize WebGL. Your browser may not support it.");
		}

		return gl;
	}

	function initBuffers() {
		cubeVerticesBuffer  = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer );

		var vertices = [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0
		];
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
		var colors = [
			[1.0,  1.0,  1.0,  1.0],    // Front face: white
			[1.0,  0.0,  0.0,  1.0],    // Back face: red
			[0.0,  1.0,  0.0,  1.0],    // Top face: green
			[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
			[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
			[1.0,  0.0,  1.0,  1.0]     // Left face: purple
		];

		var generatedColors = [];

		for (j=0; j<6; j++) {
			var c = colors[j];

			for (var i=0; i<4; i++) {
				generatedColors = generatedColors.concat(c);
			}
		}

		cubeVerticesColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

		cubeVerticesIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		var cubeVertexIndices = [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23    // left
		];

		// Now send the element array to GL

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
		
	}
	
	function initShaders() {
		var fragmentShader = getShader(gl, "shader-fs");
		var vertexShader = getShader(gl, "shader-vs");

		// Create the shader program

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// If creating the shader program failed, alert

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
		}

		gl.useProgram(shaderProgram);

		vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPositionAttribute);
		vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(vertexColorAttribute);
	}
	
	function getShader(gl, id, type) {
		var shaderScript, theSource, currentChild, shader;

		shaderScript = document.getElementById(id);

		if (!shaderScript) {
			return null;
		}

		theSource = shaderScript.text;
		if (!type) {
			if (shaderScript.type == "x-shader/x-fragment") {
				type = gl.FRAGMENT_SHADER;
			} else if (shaderScript.type == "x-shader/x-vertex") {
				type = gl.VERTEX_SHADER;
			} else {
				// Unknown shader type
				return null;
			}
		}
		shader = gl.createShader(type);
		gl.shaderSource(shader, theSource);

		// Compile the shader program
		gl.compileShader(shader);  

		// See if it compiled successfully
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
			gl.deleteShader(shader);
			return null;  
		}

		return shader;
	}
	
	function drawScene() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		perspectiveMatrix = makePerspective(30, 640/480, 0.1, 100.0);

		loadIdentity();
		mvTranslate([-0.0, 0.0, -6.0]);

		mvPushMatrix();
		mvRotate(cubeRotation, [1, 0, 1]);
//		mvTranslate([squareXOffset, squareYOffset, squareZOffset]);

		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
		gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
		
		mvPopMatrix();
		
		var currentTime = (new Date).getTime();
		if (lastCubeUpdateTime) {
			var delta = currentTime - lastCubeUpdateTime;

			cubeRotation += (30 * delta) / 1000.0;
			cubeXOffset += xIncValue * ((30 * delta) / 1000.0);
			cubeYOffset += yIncValue * ((30 * delta) / 1000.0);
			cubeZOffset += zIncValue * ((30 * delta) / 1000.0);

			if (Math.abs(cubeYOffset) > 2.5) {
				xIncValue = -xIncValue;
				yIncValue = -yIncValue;
				zIncValue = -zIncValue;
			}
		}

		lastCubeUpdateTime = currentTime;
	}
	
	function loadIdentity() {
		mvMatrix = Matrix.I(4);
	}

	function multMatrix(m) {
		mvMatrix = mvMatrix.x(m);
	}

	function mvTranslate(v) {
		multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
	}

	function setMatrixUniforms() {
		var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
	}
	
	var mvMatrixStack = [];

	function mvPushMatrix(m) {
		if (m) {
			mvMatrixStack.push(m.dup());
			mvMatrix = m.dup();
		} else {
			mvMatrixStack.push(mvMatrix.dup());
		}
	}

	function mvPopMatrix() {
		if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
		}

		mvMatrix = mvMatrixStack.pop();
		return mvMatrix;
	}

	function mvRotate(angle, v) {
		var inRadians = angle * Math.PI / 180.0;

		var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
		multMatrix(m);
	}
});