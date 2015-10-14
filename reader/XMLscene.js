
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
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

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
	//this.camera.near = this.graph.initials.fnear;
	//this.camera.far = this.graph.initials.ffar;
	//caso seja para mudar valores da camara
	/*this.camera.translate(vec3.fromValues(this.graph.tx, this.graph.ty, this.graph.tz));
	this.camera.orbit(this.X, this.graph.rotations[0]);
	this.camera.orbit(this.Y, this.graph.rotations[1]);
	this.camera.orbit(this.Z, this.graph.rotations[2]);*/

	//caso seja para mudar valores da cena

	this.axis=new CGFaxis(this, this.graph.initials.rlength);
	/*
	this.translate(this.graph.tx, this.graph.ty, this.graph.tz);
	this.rotate(this.graph.rotations[0], 1,0,0);
	this.rotate(this.graph.rotations[1], 0,1,0);
	this.rotate(this.graph.rotations[2], 0,0,1);*/


	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	
	//lights
	var j = 0;
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

	for(var i in this.graph.textures){

		this.texture[i] = [];
		this.texture[i].filepath = this.graph.textures[id].filepath;
		this.texture[i].amplif = [];
		this.texture[i].amplif.s = this.graph.textures[id].amplif.s;
		this.texture[i].amplif.t = this.graph.textures[id].amplif.t;

	}
	/*for(i = 0; i < this.lights.length; i++){

		if(this.lights[i].shouldEnable){
			this.lights[i].setVisible(true);
			this.lights[i].enable();
		}
		else {
			this.lights[i].setVisible(false);
			this.lights[i].enable();
		}
	}
	
	this.lights[0].setVisible(true);
    this.lights[0].enable();*/
    
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

	};	

    this.shader.unbind();
};

