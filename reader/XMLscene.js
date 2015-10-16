function degToRad(deg){
	return (deg*Math.PI/180);
}
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	//added code for application defaults
   this.gl.frontFace(this.gl.CCW);
   this.gl.cullFace(this.gl.BACK);

	this.axis=new CGFaxis(this);

	this.rekt = new Rectangle(this,-0.5,0.5,0.5,-0.5,0,1,0,1);
	this.tri = new Triangle(this, -0.5,-0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0);
	this.cyl = new Cylinder(this, 1,8,16,0.5,0.5);
	this.sp = new Sphere(this, 16,16);
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();


    
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

};

XMLscene.prototype.initGraphCameras = function () {
    this.camera = new CGFcamera(0.4, this.graph.fnear, this.graph.ffar, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//initials

	this.axis=new CGFaxis(this, this.graph.initials.rlength);
	console.debug(this.graph.initials.fnear);
	//WHY NOT WORKING????
	//this.camera.near = this.graph.initials.fnear;
	//this.camera.far = this.graph.initials.ffar;


	//illumination done
	this.gl.clearColor(this.graph.illumination.background.r,
		this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a);
	this.setGlobalAmbientLight(this.graph.illumination.ambient.r, this.graph.illumination.ambient.g, this.graph.illumination.ambient.b,
		this.graph.illumination.ambient.a);
	j=0;

	for(var i in this.graph.lights){

		console.log("Reading positions of light " + i + " with value position x of " + this.graph.lights[i].position.x);
		var px = this.graph.lights[i].position.x;
		var py = this.graph.lights[i].position.y;
		var pz = this.graph.lights[i].position.z;
		var pw = this.graph.lights[i].position.w;

		var ar = this.graph.lights[i].ambient.r;
		var ag = this.graph.lights[i].ambient.g;
		var ab = this.graph.lights[i].ambient.b;
		var aa = this.graph.lights[i].ambient.a;

		var dr = this.graph.lights[i].diffuse.r;
		var dg = this.graph.lights[i].diffuse.g;
		var db = this.graph.lights[i].diffuse.b;
		var da = this.graph.lights[i].diffuse.a;

		var sr = this.graph.lights[i].specular.r;
		var sg = this.graph.lights[i].specular.g;
		var sb = this.graph.lights[i].specular.b;
		var sa = this.graph.lights[i].specular.a;

		this.lights[j].setPosition(px, py, pz, pw);
		this.lights[j].setAmbient(ar,ab,ag,aa);
    	this.lights[j].setDiffuse(dr,dg,db,da);
    	this.lights[j].setSpecular(sr,sg,sb,sa);
    	
    	if(this.graph.lights[i].enable == "1"){
    		this.lights[j].setVisible(true);
			this.lights[j].enable();
    	}
    	else{
    		this.lights[j].setVisible(false);
			this.lights[j].enable();
    	}

   		this.lights[j].update();
   		j++;

	}

	//Textures
	this.texture = [];
	for(var i in this.graph.textures){

		this.texture[i] = new CGFtexture(this, this.graph.textures[i].filepath);
		this.texture[i].filepath = this.graph.textures[i].filepath;
		this.texture[i].amplif = [];
		this.texture[i].amplif.s = this.graph.textures[i].amplif.s;
		this.texture[i].amplif.t = this.graph.textures[i].amplif.t;



	}


	//Materials
	this.materials = [];
	for(var i in this.graph.materials){

		this.materials[i] = new CGFappearance(this);
		this.materials[i].setShininess(this.graph.materials[i].shininess);

		var r = this.graph.materials[i].specular.r;
		var g = this.graph.materials[i].specular.g;
		var b = this.graph.materials[i].specular.b;
		var a = this.graph.materials[i].specular.a;
		this.materials[i].setSpecular(r,g,b,a);


		r = this.graph.materials[i].diffuse.r;
		g = this.graph.materials[i].diffuse.g;
		b = this.graph.materials[i].diffuse.b;
		a = this.graph.materials[i].diffuse.a;
		this.materials[i].setDiffuse(r,g,b,a);


		r = this.graph.materials[i].ambient.r;
		g = this.graph.materials[i].ambient.g;
		b = this.graph.materials[i].ambient.b;
		a = this.graph.materials[i].ambient.a;
		this.materials[i].setAmbient(r,g,b,a);


		r = this.graph.materials[i].emission.r;
		g = this.graph.materials[i].emission.g;
		b = this.graph.materials[i].emission.b;
		a = this.graph.materials[i].emission.a;
		this.materials[i].setEmission(r,g,b,a);

	}

	this.leaves = [];
	for(var i in this.graph.leaves){
		switch(this.graph.leaves[i]._type){
			case "rectangle":
				var ltx = this.graph.leaves[i].args.ltx;
				var lty = this.graph.leaves[i].args.lty;
				var rbx = this.graph.leaves[i].args.rbx;
				var rby = this.graph.leaves[i].args.rby;
				this.leaves[i] = new Rectangle(this, ltx, lty, rbx, rby, 1,1);
				this.leaves[i]._type = "rectangle";
				break;
			case "triangle":
				var x1 = this.graph.leaves[i].args.x1;
				var y1 = this.graph.leaves[i].args.y1;
				var z1 = this.graph.leaves[i].args.z1;
				var x2 = this.graph.leaves[i].args.x2;
				var y2 = this.graph.leaves[i].args.y2;
				var z2 = this.graph.leaves[i].args.z2;
				var x3 = this.graph.leaves[i].args.x3;
				var y3 = this.graph.leaves[i].args.y3;
				var z3 = this.graph.leaves[i].args.z3;

				this.leaves[i] = new Triangle(this, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				this.leaves[i]._type = "triangle";
				break;
			case "cylinder":
				var height = this.graph.leaves[i].args.height;
				var brad = this.graph.leaves[i].args.brad;
				var trad = this.graph.leaves[i].args.trad;
				var stacks = this.graph.leaves[i].args.stacks;
				var slices = this.graph.leaves[i].args.slices;

				this.leaves[i] = new Cylinder(this, stacks, slices, brad, trad);
				this.leaves[i]._type = "cylinder";
				break;
			case "sphere":
				var height = this.graph.leaves[i].args.height;
				var stacks = this.graph.leaves[i].args.stacks;
				var slices = this.graph.leaves[i].args.slices;

				this.leaves[i] = new Sphere(this, stacks, slices);
				this.leaves[i]._type = "sphere";
				break;
		}


	}


	this.createTransfMatrixes();
	//this.drawNode(this.graph.nodes[this.graph.scene_id]);

    
};



XMLscene.prototype.createTransfMatrixes = function(){
	for(var i in this.graph.nodes){
		var tmatrix = mat4.create();
		for(var j in this.graph.nodes[i].transf){
			if(this.graph.nodes[i].transf[j]._type == 0){
				var tx = this.graph.nodes[i].transf[j].tx;
				var ty = this.graph.nodes[i].transf[j].ty;
				var tz = this.graph.nodes[i].transf[j].tz;
				mat4.translate(tmatrix, tmatrix, [tx, ty, tz]);
			}
			else if(this.graph.nodes[i].transf[j]._type == 1){
				var angle = this.graph.nodes[i].transf[j].ang;
				switch(this.graph.nodes[i].transf[j].ax){
					case "x": 
							mat4.rotate(tmatrix, tmatrix, degToRad(angle), [1,0,0]);
							break;

					case "y": 
							mat4.rotate(tmatrix, tmatrix, degToRad(angle), [0,1,0]);
							break;

					case "x": 
							mat4.rotate(tmatrix, tmatrix, degToRad(angle), [0,0,1]);
							break;
				}
			}
			else if(this.graph.nodes[i].transf[j]._type == 2){
				var sx = this.graph.nodes[i].transf[j].sx;
				var sy = this.graph.nodes[i].transf[j].sy;
				var sz = this.graph.nodes[i].transf[j].sz;
				mat4.scale(tmatrix,tmatrix,[sx,sy,sz]);
			}
		}
		this.graph.nodes[i].matrix = tmatrix;

	}
};

XMLscene.prototype.drawNode = function (node){
	console.log(node.id);
	this.pushMatrix();
	//CRIAR VARIAVEL GLOBAL TEXTURA E MATERIAL A APLICAR ATUALMENTE???
	this.multMatrix(node.matrix);
	//var matID = node.material;
	//var texID = node.texture;
	//if(texID != null && matID != null) //e se mat for null e tex nao??
	//this.materials[matID].setTexture(this.textures[texID]);
	//this.materials[matID].apply();

	for(var i in node.descendants){
		if(this.isLeaf(node.descendants[i])){
			//if (texID != null)
			this.drawLeaf(this.leaves[node.descendants[i]]/*, textures[texID].amplif.s, textures[texID].amplif.t*/);
			console.log(node.descendants[i]);
			return;
		}
		else this.drawNode(this.graph.nodes[node.descendants[i]]);
	}
	this.popMatrix();
};

XMLscene.prototype.drawLeaf = function (leaf){
	if(leaf._type == "rectangle" || leaf._type == "triangle"){
		leaf.display();
	}
	else if (leaf._type== "cylinder"){
		this.scale(1,leaf.height,1);
		leaf.display();
	}
	else if(leaf._type == "sphere"){
		this.scale(leaf.radius*2, leaf.radius*2, leaf.radius*2);
		leaf.display();
	}
};

XMLscene.prototype.isLeaf = function (id){
	for(var i in this.graph.leaves){
		if (id==i) return true;
	}
	return false;
};



XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	this.pushMatrix();
		//this.scale(2,2,2);
		this.cyl.display();
	this.popMatrix();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		//this.lights[0].update();

		for(i = 0 ; i < this.lights.length; i++){
			this.lights[i].update();
		}

		//initial transformations

		this.translate(this.graph.initials.tx, this.graph.initials.ty, this.graph.initials.tz);
		this.rotate(this.graph.initials.rotations[0], 1,0,0);
		this.rotate(this.graph.initials.rotations[1], 0,1,0);
		this.rotate(this.graph.initials.rotations[2], 0,0,1);
		this.scale(this.graph.initials.sx, this.graph.initials.sy, this.graph.initials.sz);


		//nodes
		//this.drawNode(this.graph.nodes[this.graph.scene_id]);
		

	};	

    this.shader.unbind();
};

