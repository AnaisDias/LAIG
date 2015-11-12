function degToRad(deg){
	return (deg*Math.PI/180);
}
function XMLscene() {
    CGFscene.call(this);
}

var currMat;
var currTex;

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.setUpdatePeriod(10);
    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    this.camera.zoom(-10);

	//added code for application defaults
	
   	this.gl.frontFace(this.gl.CCW);
   	this.gl.cullFace(this.gl.BACK);


	this.axis=new CGFaxis(this);
	this.lightsBool = [];

	this.controlPoints = [];
	this.controlPoints[0] = [];
	this.controlPoints[0][0] = 0;

	console.log("this.controlPoints[0][0] " + this.controlPoints[0][0]);

	this.controlPoints[0][1] = 0;
	this.controlPoints[0][2] = 0;

	this.controlPoints[1] = [];
	this.controlPoints[1][0] = 1;
	this.controlPoints[1][1] = 1;
	this.controlPoints[1][2] = 1;

	this.controlPoints[2] = [];
	this.controlPoints[2][0] = 1;
	this.controlPoints[2][1] = 1;
	this.controlPoints[2][2] = 0;

	this.controlPoints[3] = [];
	this.controlPoints[3][0] = 1;
	this.controlPoints[3][1] = 1;
	this.controlPoints[3][2] = 1;

	this.controlPoints[4] = [];
	this.controlPoints[4][0] = 3;
	this.controlPoints[4][1] = 1;
	this.controlPoints[4][2] = 1;

	this.cyl = new ClosedCylinder(this, 1, 8, 8, 0.5,0.5);

	this.circA = new CircularAnimation(this, 5, [5,5,5], 2, 20, 90);

	console.debug(this);
};

XMLscene.prototype.initLights = function () {
	
	this.lightids=[];
	this.lights = [];

    this.shader.bind();

    j=0;

	for(var i in this.graph.lights){
		this.lights[j]= new CGFlight(this, j);

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

		this.lights[j].setPosition(px,py, pz, pw);
		this.lights[j].setAmbient(ar,ab,ag,aa);
    	this.lights[j].setDiffuse(dr,dg,db,da);
    	this.lights[j].setSpecular(sr,sg,sb,sa);

    	this.lightids[j]=[];
    	this.lightids[j].id = i;
    	this.lights[j].setVisible(true);

    	if(this.graph.lights[i].enable == "1"){
			this.lights[j].enable();
			eval("this.lightsBool" + j + " = " + true);
			this.lightsBool[j] = true;
    	}
    	else{
			this.lights[j].disable();
			eval("this.lightsBool" + j + " = " + false);
			this.lightsBool[j] = false;
    	}


   		this.lights[j].update();
   		j++;

	}

	this.lightsloaded = true;
 
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

	this.camera.near = this.graph.initials.fnear;
	this.camera.far = this.graph.initials.ffar;

	this.initLights();

	this.axis=new CGFaxis(this, this.graph.initials.rlength);

	//illumination

	this.gl.clearColor(this.graph.illumination.background.r,
		this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a);
	this.setGlobalAmbientLight(this.graph.illumination.ambient.r, this.graph.illumination.ambient.g, this.graph.illumination.ambient.b,
		this.graph.illumination.ambient.a);
	
	//Animations
	this.animations = [];

	for(var i in this.graph.animations){
		if(this.graph.animations[i].type == "linear"){

			var span = parseFloat(this.graph.animations[i].span);
			var cp = [];
			var j = 0;
			for(var control in this.graph.animations[i].controlpoint){
				cp[j] = [];
				cp[j][0] = parseFloat(this.graph.animations[i].controlpoint[control].xx);		
				cp[j][1] = parseFloat(this.graph.animations[i].controlpoint[control].yy);
				cp[j][2] = parseFloat(this.graph.animations[i].controlpoint[control].zz);
				j++;
			}
			//console.debug(cp);
			this.animations[i] = new LinearAnimation(this, span, cp);
		}

		else if(this.graph.animations[i].type == "circular"){
			var span = this.graph.animations[i].span;
			var center = [];
			center[0] = this.graph.animations[i].center.x;
			center[1] = this.graph.animations[i].center.y;
			center[2] = this.graph.animations[i].center.z;

			var radius = parseFloat(this.graph.animations[i].radius);
			var initAng = parseFloat(this.graph.animations[i].startang);
			var rotAng = parseFloat(this.graph.animations[i].rotang);

			this.animations[i] = new CircularAnimation(this, span, center, radius, initAng, rotAng);
		}
	}

	//Textures
	this.texture = [];
	if(this.graph.textures.length>0){
		this.texturesEnabled = true;
	}
	for(var i in this.graph.textures){

		this.texture[i] = new CGFtexture(this, "scenes/"+this.graph.textures[i].filepath);
		this.texture[i].filepath = this.graph.textures[i].filepath;
		this.texture[i].amplif = [];
		this.texture[i].amplif.s = parseFloat(this.graph.textures[i].amplif.s);
		this.texture[i].amplif.t = parseFloat(this.graph.textures[i].amplif.t);



	}

	//Materials
	this.materials = [];
	for(var i in this.graph.materials){

		this.materials[i] = new CGFappearance(this);
		this.materials[i].setShininess(parseFloat(this.graph.materials[i].shininess));

		var r = parseFloat(this.graph.materials[i].specular.r);
		var g = parseFloat(this.graph.materials[i].specular.g);
		var b = parseFloat(this.graph.materials[i].specular.b);
		var a = parseFloat(this.graph.materials[i].specular.a);
		this.materials[i].setSpecular(r,g,b,a);


		r = parseFloat(this.graph.materials[i].diffuse.r);
		g = parseFloat(this.graph.materials[i].diffuse.g);
		b = parseFloat(this.graph.materials[i].diffuse.b);
		a = parseFloat(this.graph.materials[i].diffuse.a);
		this.materials[i].setDiffuse(r,g,b,a);


		r = parseFloat(this.graph.materials[i].ambient.r);
		g = parseFloat(this.graph.materials[i].ambient.g);
		b = parseFloat(this.graph.materials[i].ambient.b);
		a = parseFloat(this.graph.materials[i].ambient.a);
		this.materials[i].setAmbient(r,g,b,a);


		r = parseFloat(this.graph.materials[i].emission.r);
		g = parseFloat(this.graph.materials[i].emission.g);
		b = parseFloat(this.graph.materials[i].emission.b);
		a = parseFloat(this.graph.materials[i].emission.a);
		this.materials[i].setEmission(r,g,b,a);

	}

	this.leaves = [];
	for(var i in this.graph.leaves){
		switch(this.graph.leaves[i]._type){
			case "rectangle":
				var ltx = parseFloat(this.graph.leaves[i].args.ltx);
				var lty = parseFloat(this.graph.leaves[i].args.lty);
				var rbx = parseFloat(this.graph.leaves[i].args.rbx);
				var rby = parseFloat(this.graph.leaves[i].args.rby);
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

				this.leaves[i] = new Triangle(this, x1, y1, z1, x2, y2, z2, x3, y3, z3, 1, 1);
				this.leaves[i]._type = "triangle";
				break;
			case "cylinder":
				var height = parseFloat(this.graph.leaves[i].args.height);
				var brad = parseFloat(this.graph.leaves[i].args.brad);
				var trad = parseFloat(this.graph.leaves[i].args.trad);
				var stacks = parseFloat(this.graph.leaves[i].args.stacks);
				var slices = parseFloat(this.graph.leaves[i].args.slices);

				this.leaves[i] = new ClosedCylinder(this, height, slices, stacks, trad,brad);//, 1, 1);
				this.leaves[i]._type = "cylinder";
				break;
			case "sphere":
				var radius = this.graph.leaves[i].args.radius;
				var stacks = this.graph.leaves[i].args.stacks;
				var slices = this.graph.leaves[i].args.slices;

				this.leaves[i] = new Sphere(this, radius, stacks, slices, 1, 1);
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
				var tx = parseFloat(this.graph.nodes[i].transf[j].tx);
				var ty = parseFloat(this.graph.nodes[i].transf[j].ty);
				var tz = parseFloat(this.graph.nodes[i].transf[j].tz);
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

					case "z": 
							mat4.rotate(tmatrix, tmatrix, degToRad(angle), [0,0,1]);
							break;
				}
			}
			else if(this.graph.nodes[i].transf[j]._type == 2){
				var sx = parseFloat(this.graph.nodes[i].transf[j].sx);
				var sy = parseFloat(this.graph.nodes[i].transf[j].sy);
				var sz = parseFloat(this.graph.nodes[i].transf[j].sz);
				mat4.scale(tmatrix,tmatrix,[sx,sy,sz]);
			}
		}
		this.graph.nodes[i].matrix = tmatrix;
		

	}
};

XMLscene.prototype.setDescMaterialsTextures = function (node){
	for(var i in node.descendants){
		var id = node.descendants[i];

		if(!this.isLeaf(node.descendants[i])){
		if(this.graph.nodes[node.descendants[i]].material=="null"){
			if(node.material=="null" && node.inheritedMat!=undefined){
				this.graph.nodes[node.descendants[i]].inheritedMat=node.inheritedMat;
			}
			else{
			this.graph.nodes[node.descendants[i]].inheritedMat=node.material;
		}
		
		}
		if(this.graph.nodes[node.descendants[i]].texture=="null" && node.texture!="clear"){
			if(node.texture=="null" && node.inheritedTex!=undefined){
				this.graph.nodes[node.descendants[i]].inheritedTex=node.inheritedTex;	
			}
			else{
			this.graph.nodes[node.descendants[i]].inheritedTex=node.texture;
		}
		}
	}
	}
};

XMLscene.prototype.drawNode = function (node){
	
	this.pushMatrix();


	var matID = node.material;
	var texID = node.texture;


	if(texID != "null" ) {

		if(matID != "null"){

			if(texID=="clear"){
				this.materials[matID].setTexture(null);
				this.materials[matID].apply();
			}
			else{
				this.materials[matID].setTexture(this.texture[texID]);
				this.materials[matID].apply();
			}
			}
		else{
			if(texID=="clear"){
				if(node.inheritedMat!=undefined && node.inheritedMat!="null"){
				this.materials[node.inheritedMat].setTexture(null);
				this.materials[node.inheritedMat].apply();
			}
			}
			else{
				if(node.inheritedMat!=undefined && node.inheritedMat!="null"){
				this.materials[node.inheritedMat].setTexture(this.texture[texID]);
				this.materials[node.inheritedMat].apply();
			}
			}
		}
	}
	else if(matID != "null"){
		if(node.inheritedTex!="null" || node.inheritedTex!=undefined){
		this.materials[matID].setTexture(this.texture[node.inheritedTex]);
		}
		this.materials[matID].apply();
		
	}

	else{
		if(node.inheritedMat!="null" && node.inheritedMat!=undefined){
			if(node.inheritedTex!="null" && node.inheritedTex!=undefined){
				this.materials[node.inheritedMat].setTexture(this.texture[node.inheritedTex]);
			}
			this.materials[node.inheritedMat].apply();
		}
	}/*
	if(matID!="null"){

		if(texID=="clear"){
		this.materials[matID].setTexture(null);
		}

		else{
			this.materials[matID].setTexture(this.texture[texID]);
		}
		this.materials[matID].apply();


	}*/

	this.multMatrix(node.matrix);
	if(node.animation != undefined){
		this.animations[node.animation].display();
		//console.debug(this.animations[node.animation]);
		//console.log("should animate");
	}

	for(var i in node.descendants){

		if(this.isLeaf(node.descendants[i])){
			if(texID == "null" || texID == "clear"){
				this.drawLeaf(this.leaves[node.descendants[i]], 1, 1);
			}
			else{
				this.drawLeaf(this.leaves[node.descendants[i]], this.texture[texID].amplif.s, this.texture[texID].amplif.t);
			}
		}
		else {
			this.setDescMaterialsTextures(this.graph.nodes[node.descendants[i]]);
			this.drawNode(this.graph.nodes[node.descendants[i]]);
		}
	}

	this.popMatrix();
};

XMLscene.prototype.drawLeaf = function (leaf, s, t){

	if(leaf._type == "rectangle"){
		leaf.changeTextureAmplif(s,t);
		leaf.updateTexCoordsGLBuffers();
		leaf.display();
	}
	else if(leaf._type == "triangle"){
		leaf.changeTextureAmplif(s,t);
		leaf.updateTexCoordsGLBuffers();
		leaf.display();
	}
	else if (leaf._type== "cylinder"){
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

XMLscene.prototype.updateLights = function(){

	for(var i in this.lights){

		var id= this.lightids[i];
		eval("this.enabledlight = this.lightsBool"+i);
		
		if(this.enabledlight){
			this.lights[i].enable();
			this.lights[i].update();
		}
		else if(!this.enabledlight){
			this.lights[i].disable();
			this.lights[i].update();
		}
	}
};



XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
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

	/*//this.circA.update();
	this.pushMatrix();

	this.circA.display();
	this.cyl.display();
	this.popMatrix();*/
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.updateLights();

		//initial transformations

		this.translate(this.graph.initials.tx, this.graph.initials.ty, this.graph.initials.tz);
		this.rotate(degToRad(this.graph.initials.rotations[0]), 1,0,0);
		this.rotate(degToRad(this.graph.initials.rotations[1]), 0,1,0);
		this.rotate(degToRad(this.graph.initials.rotations[2]), 0,0,1);
		this.scale(this.graph.initials.sx, this.graph.initials.sy, this.graph.initials.sz);


		//nodes
		
		this.drawNode(this.graph.nodes[this.graph.scene_id]);
	

	}	

};


XMLscene.prototype.update = function (currTime){
	if(this.animations != undefined){
	for(var i in this.animations){
		this.animations[i].update(currTime);
		console.log("update done");
	}
}

};