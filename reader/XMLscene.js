
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
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();


    /*for(var i in this.graph.lights){

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

		this.lights[i].setPosition(px, py, pz, pw);
		this.lights[i].setAmbient(ar,ab,ag,aa);
    	this.lights[i].setDiffuse(dr,dg,db,da);
    	this.lights[i].setSpecular(sr,sg,sb,sa);
    	this.lights[i].shouldEnable = this.graph.lights[i].enable; 
   		this.lights[i].update();

	}*/
 
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

	this.drawNode(this.graph.nodes[this.graph.scene_id]);
	
    
};

XMLscene.prototype.createTransfMatrixes = function(){
	for(var i in this.graph.nodes){
		var tmatrix = mat4.create();
		for(var j in this.graph.nodes[i].transf){
			if(this.graph.nodes[i].transf[j]._type == 0){
				var tx = this.graph.nodes[i].transf[j].tx;
				var ty = this.graph.nodes[i].transf[j].ty;
				var tz = this.graph.nodes[i].transf[j].tz;
				mat4.translate(tmatrix, tmatrix, tx, ty, tz);
			}
			else if(this.graph.nodes[i].transf[j]._type == 1){

			}
			else if(this.graph.nodes[i].transf[j]._type == 2){

			}
		}
		this.graph.nodes[i].matrix = tmatrix;
	}
};

XMLscene.prototype.drawNode = function (node){
	console.log(node.id);
	this.pushMatrix();

	for(var i in node.descendants){
		if(this.isLeaf(node.descendants[i])){
			console.log(node.descendants[i]);
			return;
		}
		else this.drawNode(this.graph.nodes[node.descendants[i]]);
	}
};

XMLscene.prototype.drawLeaf = function (leaf, s, t){

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

