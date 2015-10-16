/**
 * Sphere
 * @constructor
 */
 function Sphere(scene, slices , stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {

 	var degToRad = Math.PI / 180;

	var ang_slices = 360 * degToRad / this.slices;
	var ang_stacks = 180 * degToRad / this.stacks;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang_stacks_now = 0;
	var ang_stacks_then = ang_stacks;
	var ind_j = 0;
	var aux_j = 4 * this.slices;
	
	for (j = 0; j < this.stacks; j++) {
		
		var ang_slices_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x0 = (Math.sin(ang_stacks_now) * Math.cos(ang_slices_now))/2;
			var y0 = Math.cos(ang_stacks_now)/2;
			var z0 = (Math.sin(ang_stacks_now) * Math.sin(ang_slices_now))/2;

			var x2 = (Math.sin(ang_stacks_then) * Math.cos(ang_slices_now))/2;
			var y2 = Math.cos(ang_stacks_then)/2;
			var z2 = (Math.sin(ang_stacks_then) * Math.sin(ang_slices_now))/2;

			ang_slices_now += ang_slices;

			var x1= (Math.sin(ang_stacks_now) * Math.cos(ang_slices_now))/2;
			var y1 = Math.cos(ang_stacks_now)/2;
			var z1 = (Math.sin(ang_stacks_now) * Math.sin(ang_slices_now))/2;

			var x3 = (Math.sin(ang_stacks_then) * Math.cos(ang_slices_now))/2;
			var y3 = Math.cos(ang_stacks_then)/2;
			var z3 = (Math.sin(ang_stacks_then) * Math.sin(ang_slices_now))/2;

			this.vertices.push(x0);
			this.vertices.push(y0);
			this.vertices.push(z0); // vertice 0

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z1); // vertice 1

			this.vertices.push(x2)
			this.vertices.push(y2);
			this.vertices.push(z2); // vertice 2

			this.vertices.push(x3);
			this.vertices.push(y3);
 			this.vertices.push(z3); // vertice 3

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j); 	// 0
			this.indices.push(ind_i_j + 1); // 1
			this.indices.push(ind_i_j + 2); // 2

			this.indices.push(ind_i_j + 3); // 3
			this.indices.push(ind_i_j + 2); // 2
			this.indices.push(ind_i_j + 1); // 1

			ind_i += 4;

			// normal a vertice 0
			this.normals.push(x0);
			this.normals.push(y0);
			this.normals.push(z0);
			
			// normal a vertice 1
            this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(z1);

			// normal a vertice 2
			this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(z2);
			
			// normal a vertice 3
            this.normals.push(x3);
			this.normals.push(y3);
			this.normals.push(z3);

			// coordenadas textura
			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
		}

		ang_stacks_now += ang_stacks;
		ang_stacks_then += ang_stacks;
		ind_j += aux_j;

	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
