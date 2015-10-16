/**
 * Cylinder
 * @constructor
 */
 function Cylinder(scene, slices, stacks, b_radius, t_radius) {
 	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;
	this.b_radius=b_radius;
	this.t_radius=t_radius;
 	this.initBuffers();
 	this.initBuffersCircle("top");
 	this.initBuffersCircle("bot");

};

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;

 Cylinder.prototype.initBuffers = function() {

 	var degToRad = Math.PI / 180.0;

	var ang = 360 * degToRad / this.slices;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ind_j = 0;
	var aux_j = 4 * this.slices;

	var aux_br = 0;
	var aux_tr = 0;

	for (j = 0; j < this.stacks; j++) {
		
		var ang_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x1 = Math.cos(ang_now);
			var y1 = Math.sin(ang_now);
			var z1 = j / this.stacks - 0.5;

			ang_now += ang;

			var x2 = Math.cos(ang_now);
			var y2 = Math.sin(ang_now);
			var z2 = (j + 1) / this.stacks - 0.5;

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z1); // vertex 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(z1); // vertex 1

			this.vertices.push(x1)
			this.vertices.push(y1);
			this.vertices.push(z2); // vertex 2

			this.vertices.push(x2);
			this.vertices.push(y2);
 			this.vertices.push(z2); // vertex 3

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j);		// 0
			this.indices.push(ind_i_j + 1); // 1
			this.indices.push(ind_i_j + 2); // 2

			this.indices.push(ind_i_j + 3); // 3
			this.indices.push(ind_i_j + 2); // 2
			this.indices.push(ind_i_j + 1); // 1

			ind_i += 4;

			// normal to vertex 0
			this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(0);
			
			// normal to vertex 1
            this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(0);

			// normal to vertex 2
			this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(0);
			
			// normal to vertex 3
            this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(0);

			// texture coordenates
			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);

		}			
		ind_j += aux_j;
	}

	ang_now = 0;

	//top circle

	for (i=0; i < this.slices; i++){

		var z1 = - Math.cos(ang_now);
		var y1 = Math.sin(ang_now);

		ang_now += ang;

		var z2 = - Math.cos(ang_now);
		var y2 = Math.cos(ang_now);


		this.vertices.push(0.5);
		this.vertices.push(y1);
		this.vertices.push(z1); // vertice 0

		this.vertices.push(0.5);
		this.vertices.push(y2);
		this.vertices.push(z2); // vertice 1

		this.vertices.push(0.5)
		this.vertices.push(0);
		this.vertices.push(0); // vertice 2

		this.indices.push(ind_i); 	  // 0
		this.indices.push(ind_i + 1); // 1
		this.indices.push(ind_i + 2); // 2

		ind_i += 3;

		// normal a vertice 0
		this.normals.push(1);
		this.normals.push(0);
		this.normals.push(0);
		
		// normal a vertice 1
        this.normals.push(1);
		this.normals.push(0);
		this.normals.push(0);

		// normal a vertice 2
		this.normals.push(1);
		this.normals.push(0);
		this.normals.push(0);

		// coordenadas textura
		this.texCoords.push(y1 / 2 + 0.5, -z1 / 2 + 0.5);
		this.texCoords.push(y2 / 2 + 0.5, -z2 / 2 + 0.5);
		this.texCoords.push(0.5, 0.5);

	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();


 };

Cylinder.prototype.initBuffersCircle = function (side) {

	var degToRad = Math.PI / 180.0;

	var ang = 360 * degToRad / this.slices;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ind_i = 0;
	var ang_now = 0;

	//top circle
	if(side == "top"){
		for (i=0; i < this.slices; i++){

			var x1 = Math.cos(ang_now);
			var y1 = Math.sin(ang_now);

			ang_now += ang;

			var x2 = Math.cos(ang_now);
			var y2 = Math.cos(ang_now);


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(0); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(0); // vertice 1

			this.vertices.push(0)
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

			var z1 = - Math.cos(ang_now);
			var y1 = Math.sin(ang_now);

			ang_now += ang;

			var z2 = - Math.cos(ang_now);
			var y2 = Math.cos(ang_now);


			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(-0.5); // vertice 0

			this.vertices.push(x2);
			this.vertices.push(y2);
			this.vertices.push(-0.5); // vertice 1

			this.vertices.push(0)
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
