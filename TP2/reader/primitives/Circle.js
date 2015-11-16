/**
* Circle CGFobject object
* 
* @constructor
* @param scene 		Scene object will be drawn on
* @param slices		Number of slices of circle
* @param bradius 	Radius of bottom of cylinder that circle will be a part of
* @param tradius 	Radius of top of cylinder that circle will be a part of
* @param side		Side of cylinder. Can either be "top" or "bottom"
*/
function Circle(scene, slices, bradius, tradius, side) {
 	CGFobject.call(this,scene);

	this.bradius=bradius;
	this.tradius=tradius;
	this.slices=slices;
	this.side=side;
 	this.initBuffers();

};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;


/**
* Initializes circle buffers
*/
Circle.prototype.initBuffers = function () {

	var degToRad = Math.PI / 180.0;

	var ang = 360 * degToRad / this.slices;


	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ind_i = 0;
	var ang_now = 0;

	//top circle
	if(this.side == "top"){
		for (i=0; i < this.slices; i++){
			console.log("drawing circle top: " + i);

			var x1 = Math.cos(ang_now) * this.tradius;
			var y1 = Math.sin(ang_now) * this.tradius;

			ang_now += ang;

			var x2 = Math.cos(ang_now) * this.tradius;
			var y2 = Math.sin(ang_now) * this.tradius;


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(0.5); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(0.5); // vertice 1

			this.vertices.push(0);
			this.vertices.push(0);
			this.vertices.push(0.5); // vertice 2

			this.indices.push(ind_i + 2); 	  // 2
			this.indices.push(ind_i); // 0
			this.indices.push(ind_i + 1); // 1

			ind_i += 3;

			// normal a vertice 0
			this.normals.push(0);
			this.normals.push(0);
			this.normals.push(1);
			
			// normal a vertice 1
	        this.normals.push(0);
			this.normals.push(0);
			this.normals.push(1);

			// normal a vertice 2
			this.normals.push(0);
			this.normals.push(0);
			this.normals.push(1);

			// coordenadas textura
			this.texCoords.push(x1 / 2 + 0.5, -y1 / 2 + 0.5);
			this.texCoords.push(x2 / 2 + 0.5, -y2 / 2 + 0.5);
			this.texCoords.push(0.5, 0.5);

		}
	}
	//bot circle
	else{

		for (i=0; i < this.slices; i++){
			//console.log("drawing circle bot: " + i);

			var x1 = Math.cos(ang_now) * this.bradius;
			var y1 = Math.sin(ang_now) * this.bradius;

			ang_now += ang;

			var x2 = Math.cos(ang_now) * this.bradius;
			var y2 = Math.sin(ang_now) * this.bradius;


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(-0.5); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(-0.5); // vertice 1

			this.vertices.push(0);
			this.vertices.push(0);
			this.vertices.push(-0.5); // vertice 2

			this.indices.push(ind_i + 2); 	  // 0
			this.indices.push(ind_i + 1); // 1
			this.indices.push(ind_i); // 2

			ind_i += 3;

			// normal a vertice 0
			this.normals.push(0);
			this.normals.push(0);
			this.normals.push(-1);
			
			// normal a vertice 1
	        this.normals.push(0);
			this.normals.push(0);
			this.normals.push(-1);

			// normal a vertice 2
			this.normals.push(0);
			this.normals.push(0);
			this.normals.push(-1);

			// coordenadas textura
			this.texCoords.push(x1 / 2 + 0.5, -y1 / 2 + 0.5);
			this.texCoords.push(x2 / 2 + 0.5, -y2 / 2 + 0.5);
			this.texCoords.push(0.5, 0.5);

		}


	}
	//console.debug(this.vertices);
	//console.debug(this.indices);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 };
