/**
* Circle
* @constructor
*/
function Circle(scene, slices, b_radius, t_radius, side) {
 	CGFobject.call(this,scene);

	this.b_radius=b_radius;
	this.t_radius=t_radius;
	this.slices=slices;
	this.side=side;
 	this.initBuffers();

};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

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

			var x1 = Math.cos(ang_now) * this.t_radius;
			var y1 = Math.sin(ang_now) * this.t_radius;

			ang_now += ang;

			var x2 = Math.cos(ang_now) * this.t_radius;
			var y2 = Math.cos(ang_now) * this.t_radius;


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(0); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(0); // vertice 1

			this.vertices.push(0);
			this.vertices.push(0);
			this.vertices.push(0); // vertice 2

			this.indices.push(ind_i); 	  // 0
			this.indices.push(ind_i + 1); // 1
			this.indices.push(ind_i + 2); // 2

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

			var x1 = Math.cos(ang_now) * this.b_radius;
			var y1 = Math.sin(ang_now) * this.b_radius;

			ang_now += ang;

			var x2 = Math.cos(ang_now) * this.b_radius;
			var y2 = Math.cos(ang_now) * this.b_radius;


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(-0.5); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(-0.5); // vertice 1

			this.vertices.push(0);
			this.vertices.push(0);
			this.vertices.push(-0.5); // vertice 2

			this.indices.push(ind_i); 	  // 0
			this.indices.push(ind_i + 1); // 1
			this.indices.push(ind_i + 2); // 2

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
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 };
