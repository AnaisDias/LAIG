/**
 * Cylinder
 * @constructor
 */
 function Cylinder(scene, height, slices, stacks, topradius, botradius) {
 	CGFobject.call(this,scene);


	/*console.debug(height);
	console.debug(slices);
	console.debug(stacks);
	console.debug(topradius);
	console.debug(botradius);*/


	this.slices=slices;
	this.stacks=stacks;
	this.height=height;
	this.botradius=botradius;
	this.topradius=topradius;
	this.initBuffers();
 	/*this.topcircle = new Circle(scene,slices,botradius,topradius,"top");
 	this.topcircle.initBuffers();
 	this.botcircle = new Circle(scene,slices,botradius,topradius,"bot");
 	this.botcircle.initBuffers();

 	console.log(this);*/

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

	var aux_br = 1;
	var aux_tr = 0;

	for (j = 0; j < this.stacks; j++) {
		
		var ang_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x1 = Math.cos(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
			var y1 = Math.sin(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
			var z1 = j / this.stacks - 0.5;

			ang_now += ang;

			var x2 = Math.cos(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
			var y2 = Math.sin(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
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
		aux_br -= 1/this.stacks;
		aux_tr += 1/this.stacks;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();


 };

