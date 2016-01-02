/**
* Converts from degree to radian
* @param {float} deg - Degree to convert
*/ 
function degToRad(deg){
	return (deg*Math.PI/180);
}

/**
 * XMLscene CGFscene object
 * @constructor
 */
function XMLscene() {
    CGFscene.call(this);
}

var movesAllowed;
var prologBoard;
var player;
var nextPlay;
var neutron;
var clearBoard;
var animating;
var lastBoard;
var checkBoard;
var finished;
var winner;
var waiting;
var movie;
var camerachange = false;
var cameraangle = 0;
var camerasetposition = false;

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene
 * @param {CGFapplication} application - CGFapplication used
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.setUpdatePeriod(10);
    this.initCameras();

    this.linearTime = 1;
    this.upTime = 0;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    this.camera.zoom(-20);
	
   	this.gl.frontFace(this.gl.CCW);
   	this.gl.cullFace(this.gl.BACK);


	this.axis=new CGFaxis(this);

	/*this.shader = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
	this.shader.setUniformsValues({normScale: 10});
	this.shader.setUniformsValues({uSampler2: 1});
	*/
	this.lightsBool = [];

	this.possMoveSquare = new CGFappearance(this);
	this.possMoveSquare.setShininess(60);
	this.possMoveSquare.setSpecular(0,0,255,1);
	this.possMoveSquare.setDiffuse(0,0,255,1);
	this.possMoveSquare.setAmbient(0,0,255,1);
	

	this.mapPos = [[0,0], [0,1], [0,2], [0,3], [0,4],
					[1,0], [1,1], [1,2], [1,3], [1,4],
					[2,0], [2,1], [2,2], [2,3], [2,4],
					[3,0], [3,1], [3,2], [3,3], [3,4],
					[4,0], [4,1], [4,2], [4,3], [4,4]];

	prologBoard = [[1,1,1,1,1],
						[0,0,0,0,0],
						[0,0,3,0,0],
						[0,0,0,0,0],
						[2,2,2,2,2]];

	lastBoard = prologBoard;

	player = "1"; //"1" or "2"

	nextPlay = "2"; //"1" for neutron, "2" for jogada, "3" for end

	movesAllowed = [];

	this.lastPicked = [];

	movie = [];
	movie.push(prologBoard);

	this.first_check = false;

	clearBoard = false;

	checkBoard = true;

	waiting = false;

	this.count = 1;
	this.replay = false;

	this.board = new Board(this);

	neutron = new Sphere(this, 1, 10, 10, 1, 1);
	neutron.x = 2;
	neutron.y = 2;
	neutron.moving = false;
	neutron.animation = [];
	neutron.animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
	neutron.animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);

	this.pieces = [];

	for(var i = 0; i<5; i++){
			this.pieces[i] = [];
			this.pieces[i].obj = new Piece(this);
			this.pieces[i].x = i;
			this.pieces[i].y = 0;
			this.pieces[i].animation = [];
			this.pieces[i].animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i].animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i].moving = false;
	}

	for(var i = 0; i<5; i++){
			this.pieces[i+5] = [];
			this.pieces[i+5].obj = new Piece(this);
			this.pieces[i+5].x = i;
			this.pieces[i+5].y = 4;
			this.pieces[i+5].animation = [];
			this.pieces[i+5].animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i+5].animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i+5].moving = false;
	}

	//this.materials[i].setEmission(r,g,b,a);

	this.textinterface = new TextInterface(this, 10,10,"start");
	this.modeinterface = new TextInterface(this,10,10,"mode");
	this.difficultyinterface = new TextInterface(this, 10, 10, "diff");
	this.endinterface = new TextInterface(this, 10, 10, "end");
	this.undointerface = new TextInterface(this, 10,10, "undo");
	this.resetinterface = new TextInterface(this, 10, 10, "reset");
	
	this.activeStartInterface = true;
	this.activeDifficultyInterface = false;
	this.activeModeInterface = false;
	this.activeEndInterface = false;

	this.winner = null;
	this.finished = false;
	this.hvhmode = false;
	this.hvmmode = false;
	this.mvmmode = false;
	this.intelMachine=false;
	this.player1 = true;
	this.player2 = true;

	this.pieceufo = new Piece(this);
	this.piecesphere = new Sphere(this, 0.5, 15, 15, 1, 1);
	this.piececube = new Cube(this);
};

XMLscene.prototype.positionToTranslation = function (position) {
	return position*3 + 1.5;
}
/**
 * Initializes lights of the scene
 */
XMLscene.prototype.initLights = function () {
	
	this.lightids=[];
	this.lights = [];

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
 
};


/**
 * Initializes the camera of the scene
 */
XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(7.5, 9, -12), vec3.fromValues(7.5, 0, 7.5));
    //this.camera.orbit(vec3.fromValues(0,1,0), degToRad(180));

};

/**
 * Initializes the camera of the scene based on the graph
 */
XMLscene.prototype.initGraphCameras = function () {
    this.camera = new CGFcamera(0.4, this.graph.fnear, this.graph.ffar, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

};

/**
 * Changes the CGFappearance used in the scene
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

/**
 * Handler called when the graph is finally loaded. 
 */
XMLscene.prototype.onGraphLoaded = function () 
{
	//Initials

	this.camera.near = this.graph.initials.fnear;
	this.camera.far = this.graph.initials.ffar;

	this.initLights();

	for(var i=0; i<5; i++){
		if(this.graph.game.piece.type == "ufo"){
			this.pieces[i].obj = this.pieceufo;
		}
		else if(this.graph.game.piece.type == "sphere"){
			this.pieces[i].obj = this.piecesphere;
		}

		else if(this.graph.game.piece.type == "cube"){
			this.pieces[i].obj = this.piececube;
		}


		this.pieces[i].material = this.graph.game.piece.p1.material;
		this.pieces[i].texture = this.graph.game.piece.p1.texture;
	}

	for(var i=5; i<10; i++){
		if(this.graph.game.piece.type == "ufo"){
			this.pieces[i].obj = this.pieceufo;
		}
		else if(this.graph.game.piece.type == "sphere"){
			this.pieces[i].obj = this.piecesphere;
		}

		else if(this.graph.game.piece.type == "cube"){
			this.pieces[i].obj = this.piececube;
		}


		this.pieces[i].material = this.graph.game.piece.p2.material;
		this.pieces[i].texture = this.graph.game.piece.p2.texture;
	}

	this.boardoptions = [];

	this.boardoptions.material = this.graph.game.board.material;
	this.boardoptions.texture = this.graph.game.board.texture;

	this.neutronoptions = [];
	this.neutronoptions.material = this.graph.game.neutron.material;
	this.neutronoptions.texture = this.graph.game.neutron.texture;


	this.axis=new CGFaxis(this, this.graph.initials.rlength);

	//Illumination
	this.gl.clearColor(this.graph.illumination.background.r,
		this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a);
	this.setGlobalAmbientLight(this.graph.illumination.ambient.r, this.graph.illumination.ambient.g, this.graph.illumination.ambient.b,
		this.graph.illumination.ambient.a);
	
	//Animations
	for(var i in this.graph.nodes){

		if(this.graph.nodes[i].animationNr != undefined){
			this.graph.nodes[i].newAnimations = [];

			for(j = 0; j < this.graph.nodes[i].animation.length; j++){
				var name = this.graph.nodes[i].animation[j];
				if(this.graph.animations[name].type == "linear"){

					var span = parseFloat(this.graph.animations[name].span);
					var cp = [];
					var k = 0;
					for(var control in this.graph.animations[name].controlpoint){
						cp[k] = [];
						cp[k][0] = parseFloat(this.graph.animations[name].controlpoint[control].xx);		
						cp[k][1] = parseFloat(this.graph.animations[name].controlpoint[control].yy);
						cp[k][2] = parseFloat(this.graph.animations[name].controlpoint[control].zz);
						k++;
					}
					this.graph.nodes[i].newAnimations[j] = new LinearAnimation(this, span, cp);

				}

				else if(this.graph.animations[name].type == "circular"){

					var span = parseFloat(this.graph.animations[name].span);
					var center = [];
					center[0] = this.graph.animations[name].center.x;
					center[1] = this.graph.animations[name].center.y;
					center[2] = this.graph.animations[name].center.z;

					var radius = parseFloat(this.graph.animations[name].radius);
					var initAng = parseFloat(this.graph.animations[name].startang);
					var rotAng = parseFloat(this.graph.animations[name].rotang);

					this.graph.nodes[i].newAnimations[j] = new CircularAnimation(this, span, center, radius, initAng, rotAng);
				}
			}
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

	//Leaves
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
			case "plane":
				var parts = this.graph.leaves[i].parts;

				this.leaves[i] = new Plane(this, parts);
				this.leaves[i]._type = "plane";
				break;
			case "patch":
				var order = this.graph.leaves[i].order;
				var partsU = this.graph.leaves[i].partsU;
				var partsV = this.graph.leaves[i].partsV;
				var cp = this.graph.leaves[i].controlpoints;

				this.leaves[i] = new Patch(this, order, partsU, partsV, cp);
				this.leaves[i]._type = "patch";
				break;
			case "terrain":
				var ttexture = this.graph.leaves[i].texture;
				var heightmap = this.graph.leaves[i].heightmap;

				this.leaves[i] = new Terrain(this);
				this.leaves[i]._type = "terrain";
				this.leaves[i].texture = new CGFtexture(this,ttexture);
				this.leaves[i].heightmap = new CGFtexture(this,heightmap);
				break;
			case "vehicle":
				this.leaves[i] = new Vehicle(this);
				this.leaves[i]._type = "vehicle";
				break;
		}



	}

	//Transformation matrices
	this.createTransfMatrices();

    
};

/**
* Creates transformation matrices for each node
*/
XMLscene.prototype.createTransfMatrices = function(){

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

/**
* Sets materials and textures for each descendant of a node
* @param node - Current node
*/
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

/**
* Draws the current node and it's descendants
* @param node - Current node
*/
XMLscene.prototype.drawNode = function (node){
	
	this.pushMatrix();


	var matID = node.material;
	var texID = node.texture;
	var descMat;

	if(texID != "null" ) {

		if(matID != "null"){
			descMat = matID;

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
			descMat = node.inheritedMat;
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
		descMat = matID;
		if(node.inheritedTex!="null" || node.inheritedTex!=undefined){
		this.materials[matID].setTexture(this.texture[node.inheritedTex]);
		}
		this.materials[matID].apply();
		
	}

	else{
		descMat = node.inheritedMat;
		if(node.inheritedMat!="null" && node.inheritedMat!=undefined){
			if(node.inheritedTex!="null" && node.inheritedTex!=undefined){
				this.materials[node.inheritedMat].setTexture(this.texture[node.inheritedTex]);
			}
			this.materials[node.inheritedMat].apply();
		}
	}


	this.multMatrix(node.matrix);
	if(node.animation != undefined){

		if(node.firstTime){
			node.firstTime=false;
			node.newAnimations[0].current = true;
		}

		if(node.newAnimations[node.animationCounter].ended && node.animationCounter < (node.animationNr-1)){
			node.animationCounter +=1;
			node.newAnimations[node.animationCounter].current = true;
		}

		for(i = 0; i <= node.animationCounter;i++)
			node.newAnimations[i].display();
	}

	for(var i in node.descendants){

		if(this.isLeaf(node.descendants[i])){
			if(texID == "null" || texID == "clear"){
				this.drawLeaf(this.leaves[node.descendants[i]], 1, 1, descMat);
			}
			else{
				this.drawLeaf(this.leaves[node.descendants[i]], this.texture[texID].amplif.s, this.texture[texID].amplif.t, descMat);
			}
		}
		else {
			this.setDescMaterialsTextures(this.graph.nodes[node.descendants[i]]);
			this.drawNode(this.graph.nodes[node.descendants[i]]);
		}
	}

	this.popMatrix();
};

/**
* Draws the current leaf
* @param leaf - Current leaf
* @param {float} s - S amplification factor for texture
* @param {float} t - T amplification factor for texture
* @param {string} descMat - Material id to be applied on 'terrain' type
*/
XMLscene.prototype.drawLeaf = function (leaf, s, t, descMat){

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
	else if(leaf._type == "plane" || leaf._type == "patch" || leaf._type=="vehicle"){
		leaf.display();
	}
	else if(leaf._type == "terrain"){

		if(descMat != null && descMat != undefined){
			this.materials[descMat].setTexture(leaf.texture);
			this.materials[descMat].apply();
			this.pushMatrix();
			this.setActiveShader(this.shader);
			leaf.heightmap.bind(1);
			leaf.display();
			leaf.heightmap.unbind(1);
			this.setActiveShader(this.defaultShader);
			this.popMatrix();
		}


	}


};

/**
* Checks if an id belongs to a leaf
* @param {string} id - ID to check
* @return true if id is a leaf, false otherwise 
*/
XMLscene.prototype.isLeaf = function (id){
	for(var i in this.graph.leaves){
		if (id==i) return true;
	}
	return false;
};

/**
* Updates lights of the scene
*/
XMLscene.prototype.updateLights = function(){

	for(var i in this.lights){

		var id= this.lightids[i];
		eval("this.enabledlight = this.lightsBool"+i);
		this.lights[i].setVisible(false);
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

/*
* Checks if pos exists in movesAllowed
* @param pos position in this.mapPos
* @return true if pos exists, false otherwise
*/
XMLscene.prototype.existsPos = function (pos){

	for(var i = 0; i < movesAllowed.length; i++){
		if(movesAllowed[i][0] == pos[0] && movesAllowed[i][1] == pos[1]){
			return true;
		}
	}
	return false;
};



/*
* Function to undo one move
*/
XMLscene.prototype.undo = function()
{
	if(movie.length > 1){
		prologBoard = movie.pop();
		lastBoard = prologBoard;
		if(nextPlay == "2"){
			nextPlay = "1";
		}
		else if(nextPlay == "1"){
			nextPlay = "2";
			if(player == "2")
				player = "1";
			else player = "2";

		}
		
	}
	movesAllowed = [];
	this.board.clearMat();
}

/*
* Function to reset the game
*/
XMLscene.prototype.resetGame = function ()
{

	prologBoard = [[1,1,1,1,1],
						[0,0,0,0,0],
						[0,0,3,0,0],
						[0,0,0,0,0],
						[2,2,2,2,2]];

	lastBoard = prologBoard;

	player = "1"; //"1" or "2"

	nextPlay = "2"; //"1" for neutron, "2" for jogada, "3" for end

	movesAllowed = [];

	this.lastPicked = [];

	movie = [];
	movie.push(prologBoard);

	clearBoard = false;

	checkBoard = true;

	waiting = false;

	animating = false;

	this.count = 1;
	this.replay = false;

	finished = false;
	winner = null;

	this.activeStartInterface = true;
	this.activeDifficultyInterface = false;
	this.activeModeInterface = false;
	this.activeEndInterface = false;


	this.hvhmode = false;
	this.hvmmode = false;
	this.mvmmode = false;
	this.intelMachine=false;


	this.player1 = true;
	this.player2 = true;

	this.board = new Board(this);

	neutron = new Sphere(this, 1, 10, 10, 1, 1);
	neutron.x = 2;
	neutron.y = 2;
	neutron.moving = false;
	neutron.animation = [];
	neutron.animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
	neutron.animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);

	for(var i = 0; i<5; i++){
			this.pieces[i].x = i;
			this.pieces[i].y = 0;
			this.pieces[i].animation = [];
			this.pieces[i].animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i].animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i].moving = false;
	}

	for(var i = 0; i<5; i++){
			this.pieces[i+5].x = i;
			this.pieces[i+5].y = 4;
			this.pieces[i+5].animation = [];
			this.pieces[i+5].animation[0] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i+5].animation[2] = new LinearAnimation(this, this.upTime, [[0,0,0],[0,0,0]]);
			this.pieces[i+5].moving = false;
	}

	console.log("Reseted game!");
}

/*
* Logs the object clicked
*/
XMLscene.prototype.logPicking = function ()
{

	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					if(!waiting && !animating && !this.replay){
						var customId = this.pickResults[i][1];
						var pos = this.mapPos[customId - 1];				
						//console.log("Picked object: " + obj + ", with pick id " + customId + " which will have pos: " + pos);
						
						if(customId >= 50){
							if(customId == 50){
								console.log("Game started");
								this.activeStartInterface=false;
								this.activeModeInterface=true;
							}
							else if(customId == 51){
								this.resetGame();//reset function
								this.activeEndInterface = false;
							}
							else if(customId == 52){
								this.intelMachine = false;
								this.activeDifficultyInterface=false;
							}
							else if(customId == 53){
								this.intelMachine=true;
								this.activeDifficultyInterface=false;
							}
							else if(customId == 54){
								this.hvhmode = true;
								this.hvmmode = false;
								this.mvmmode = false;
								this.player1 = true;
								this.player2 = true;
								this.activeModeInterface=false;
								this.activeDifficultyInterface=true;
							}
							else if(customId== 55){
								this.hvhmode = false;
								this.hvmmode = true;
								this.mvmmode = false;
								this.player1 = true;
								this.player2 = false;
								this.activeModeInterface=false;
								this.activeDifficultyInterface=true;
							}
							else if(customId== 56){
								this.hvhmode = false;
								this.hvmmode = false;
								this.mvmmode = true;
								this.player1 = false;
								this.player2 = false;
								this.activeModeInterface=false;
								this.activeDifficultyInterface=true;
							}
							else if(customId == 57){
								this.undo();//undo function
							}
							else if(customId == 58){
								this.resetGame();//reset function
								this.activeEndInterface = false;
							}
							else if(customId == 59){
								for(var j in neutron.animation){
									neutron.animation[j].current = false;
									neutron.animation[j].ended = false;
								}
								console.log("Entering replay mode...");
								this.replay = true;
								this.count = 1;
								this.activeEndInterface = false;
								animating = true;
								this.first_check = true;
								
							}
						}
						else if(!this.activeDifficultyInterface && !this.activeModeInterface && !this.activeStartInterface && !this.activeEndInterface && !this.replay){
							if(player == "1"){
								if(this.hvhmode || this.hvmmode){
									if(this.existsPos(pos)){
									this.requestMove(this.lastPicked, pos);
									}
									else if (nextPlay == "1"){
										this.lastPicked = JSON.parse("[" + neutron.x + "," + neutron.y + "]");
										this.curPossibleMoves(JSON.parse("[" + neutron.x + "," + neutron.y + "]"));
									}
									else if(prologBoard[pos[0]][pos[1]] == 1) {
										this.lastPicked = this.mapPos[customId - 1];
										this.curPossibleMoves(this.mapPos[customId - 1]);
									}
									}
								else{
									if(this.intelMachine){
										this.requestIntMove();
									}
									else {
										this.requestRandMove();
									}
								}
							}
							else {
								if(this.hvhmode){
									if(this.existsPos(pos)){
										this.requestMove(this.lastPicked, pos);
									}
									else if (nextPlay == "1"){
										this.lastPicked = JSON.parse("[" + neutron.x + "," + neutron.y + "]");
										this.curPossibleMoves(JSON.parse("[" + neutron.x + "," + neutron.y + "]"));
									}
									else if(prologBoard[pos[0]][pos[1]] == 2) {
										this.lastPicked = this.mapPos[customId - 1];
										this.curPossibleMoves(this.mapPos[customId - 1]);
									}
								}
								else{
									if(this.intelMachine){
										this.requestIntMove();
									}
									else {
										this.requestRandMove();
									}
								}
							}
						}
					}
				} // end if (obj)
			} //end for
			this.pickResults.splice(0,this.pickResults.length);
		}		  
	}
};

/*
* Function to send the request for prolog
* @param requestString String to request
* @param onSuccess Boolean
* @param onError Boolean
*/
XMLscene.prototype.postGameRequest = function (requestString, onSuccess, onError)
{

	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));

};

/*
* Function to save the current possible moves in the using variables
* @param id Position in prolog
*/
XMLscene.prototype.curPossibleMoves = function(id)
{

	console.log("Requesting possible moves...");
	// Compose Request String
	waiting = true;
	var requestString = "[jog_poss, [";
	for(var i = 0; i < 5; i++){
		if(i == 0)
			requestString = requestString.concat("[" + prologBoard[i] + "]"); 
		else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
	}
	requestString = requestString.concat("]," + id[0] + "," + id[1] + ",");

	if(nextPlay == "1"){
		requestString = requestString.concat("3]");
	}
	else if(nextPlay == "2"){
		requestString = requestString.concat(player + "]");
	}
	this.postGameRequest(requestString,this.posMovesHandler);

};

/*
* Function to request an inteligent move from the game
*/
XMLscene.prototype.requestIntMove = function()
{

	console.log("Requesting inteligent move for P" + player + "...");
	// Compose Request String
	waiting = true;
	if(nextPlay == "2"){
		var requestString = "[jogada_ale, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
	}
	else{
		var requestString = "[jogada_int, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
	}

	this.postGameRequest(requestString,this.moveHandler);

};

/*
* Function to save the current possible moves in the using variables
*/
XMLscene.prototype.requestRandMove = function()
{

	console.log("Requesting random move for P" + player + "...");
	// Compose Request String

	waiting = true;
	if(nextPlay == "2"){
		var requestString = "[jogada_ale, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + neutron.x + ", " + neutron.y + ", " + player + "]");
	}
	else{
		var requestString = "[jogada_ale_neutron, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
	}

	this.postGameRequest(requestString,this.moveHandler);

};

/*
* Function to request making a move from prolog server
* @param id1 Inicial position in prolog
* @param id2 Final position in prolog
*/
XMLscene.prototype.requestMove = function(id1, id2)
{

	movesAllowed = [];
	this.lastPicked = [];
	console.log("Requesting move for P" + player + "...");
	// Compose Request String

	waiting = true;

	if(nextPlay == "2"){
		var requestString = "[jogada, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + neutron.x + ", " + neutron.y + ", " + id1 + ", " + id2 + ", " + player + "]");
	}
	else{
		var requestString = "[jogada_neutrao, [";
		for(var i = 0; i < 5; i++){
			if(i == 0)
				requestString = requestString.concat("[" + prologBoard[i] + "]"); 
			else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
		}
		requestString = requestString.concat("]," + id1 + "," + id2 + "," + player + "]");
	}

	this.postGameRequest(requestString,this.moveHandler);

	

};


/*
* Function to handle reply because of a move
* @param data Variable to get the response from
*/
XMLscene.prototype.moveHandler = function(data){
	response=JSON.parse(data.target.response);
	console.log(response.message);
	if(response.message != "Move Invalid"){
		if(player != response.newPlayer){
			camerachange=true;
			cameraangle=0;
			if(player=="1"){
			camerasetposition=true;
		}
		}
		player = response.newPlayer;
		nextPlay = response.newPlay;
		lastBoard = prologBoard;
		prologBoard = JSON.parse(response.newBoard);
		movie.push(prologBoard);
		animating = true;
		

	}

	if (response.message == "The End"){
		console.log("Player " + player + " won!!");
		winner = player;
		finished=true;
	}
	waiting = false;
	clearBoard = true;
};

/*
* Function to handle reply from curPossMoves
* @param data Variable to get the response from
*/
XMLscene.prototype.posMovesHandler = function (data){
	response=JSON.parse(data.target.response);
	console.log(response.message);
	console.log("Possible moves: " + response.newBoard);
	movesAllowed = JSON.parse(response.newBoard);
	clearBoard = true;
	waiting = false;
};			
	
/**
* Creates a linear animation to be used in update function
*/
XMLscene.prototype.checkBoard = function () {

	
	var xi;
	var yi;
	var xf;
	var yf;
	
	if(this.first_check){
		for(var i = 0; i<5; i++){
			this.pieces[i].x = i;
			this.pieces[i].y = 0;
		}
		for(var i = 5; i<10; i++){
			this.pieces[i].x = i;
			this.pieces[i].y = 4;
		}
	}

	if(!this.replay){
		for(var i = 0; i < 5; i++){
			for (var j = 0; j < 5; j++){
				if(lastBoard[i][j] != prologBoard[i][j]){
					if(lastBoard[i][j] != 0){
						xi = i;
						yi = j;
					}
					else if(prologBoard[i][j] != 0){
						xf = i;
						yf = j;
					}
				}
			}
		}
	}
	else{
		console.log(movie[this.count-1].toString());
		console.log(movie[this.count].toString());


		for(var i = 0; i < 5; i++){
			for (var j = 0; j < 5; j++){
				if(movie[this.count-1][i][j] != movie[this.count][i][j]){
					if(movie[this.count-1][i][j] != 0){
						xi = i;
						yi = j;
					}
					else if(movie[this.count][i][j] != 0){
						xf = i;
						yf = j;
					}
				}
			}
		}
	}
	
	if(neutron.x == xi && neutron.y == yi){
		console.log("Neutron will move");

		neutron.animation[1] = new LinearAnimation(this, this.linearTime, [[0,0,0],[(yf-yi)*3, 0, (xf-xi)*3]]);
		neutron.moving = true;
	}
	else{
		for (var piece in this.pieces){

			if(this.pieces[piece].x == yi && this.pieces[piece].y == xi){
				//console.log("Piece will move");
				this.pieces[piece].animation[1] = new LinearAnimation(this, this.linearTime, [[0,0,0],[(yf-yi)*3, 0, (xf-xi)*3]]);
				this.pieces[piece].moving = true;
				break;
			}
		}
	}
};		

XMLscene.prototype.updateCameraAngle = function(){
	if(camerachange){
		cameraangle+=2;
		if(cameraangle>=182) {
			camerachange = false;
			cameraangle=0;
		}
	}
};

/**
* Displays the scene
*/
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

	if(camerasetposition){
		this.camera.setPosition(vec3.fromValues(7.5, 9, -12));
		this.camera.zoom(-20);
		camerasetposition=false;
	}
	if(camerachange){
	this.camera.orbit(vec3.fromValues(0,1,0), degToRad(2));
}

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup
	
	if (this.replay)
	{
		console.log("Replaying..." + this.count);
		this.clearPickRegistration();
		this.board.clearMat();
		
		this.updateLights();
		//initial transformations

		this.pushMatrix();
			this.materials[this.boardoptions.material].setTexture(this.texture[this.boardoptions.texture]);
			this.materials[this.boardoptions.material];
			this.board.display();
		this.popMatrix();

		var piece = 0;
		for(var i = 0; i < 5; i++){
			
			for(var j = 0; j < 5; j++){
				
				if(movie[this.count-1][i][j] == 1 ){

					this.pushMatrix();
						this.pieces[piece].material = this.graph.game.piece.p1.material;
						this.pieces[piece].texture = this.graph.game.piece.p1.texture;
						this.materials[this.pieces[piece].material].setTexture(this.texture[this.pieces[piece].texture]);
						this.materials[this.pieces[piece].material].apply();
						this.graph.game.piece.p1.material;
						this.pieces[piece].x = j;
						this.pieces[piece].y = i;
						this.translate(this.pieces[piece].x*3+1.5,0.5,this.pieces[piece].y*3+1.5); 
						if(this.pieces[piece].moving){
							for(var a in this.pieces[piece].animation){
								if(this.pieces[piece].animation[a].ended){
									this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
								}
								else if(this.pieces[piece].animation[a].current){
									this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
								}
							}
						}
						this.pieces[piece].obj.display();
					this.popMatrix();

					piece++;
				}
				else if(movie[this.count-1][i][j] == 2){

					this.pushMatrix();
						this.pieces[piece].material = this.graph.game.piece.p2.material;
						this.pieces[piece].texture = this.graph.game.piece.p2.texture;
						this.materials[this.pieces[piece].material].setTexture(this.texture[this.pieces[piece].texture]);
						this.materials[this.pieces[piece].material].apply();
						this.pieces[piece].x = j;
						this.pieces[piece].y = i;
						this.translate(this.pieces[piece].x*3+1.5,0.5,this.pieces[piece].y*3+1.5); 
						if(this.pieces[piece].moving){
							for(var a in this.pieces[piece].animation){
								if(this.pieces[piece].animation[a].ended){
									this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
								}
								else if(this.pieces[piece].animation[a].current){
									this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
								}
							}
						}
						this.pieces[piece].obj.display();
					this.popMatrix();

					piece++;
				}

				else if(movie[this.count-1][i][j] == 3){
					this.pushMatrix();
						this.materials[this.neutronoptions.material].setTexture(this.texture[this.neutronoptions.texture]);
						this.materials[this.neutronoptions.material].apply();
						neutron.y = j;
						neutron.x = i;
						this.translate(neutron.y*3+1.5, 1, neutron.x*3+1.5);
						for(var a in neutron.animation){
							if(neutron.animation[a].current){
								this.translate(neutron.animation[a].tx , neutron.animation[a].ty ,neutron.animation[a].tz);
							}
							else if(neutron.animation[a].ended){
								this.translate(neutron.animation[a].tx , neutron.animation[a].ty ,neutron.animation[a].tz);
							}
						}
						this.scale(1.5,1.5,1.5);
						neutron.display();
					this.popMatrix();
				}

			}
		}

		this.translate(this.graph.initials.tx, this.graph.initials.ty, this.graph.initials.tz);
		this.rotate(degToRad(this.graph.initials.rotations[0]), 1,0,0);
		this.rotate(degToRad(this.graph.initials.rotations[1]), 0,1,0);
		this.rotate(degToRad(this.graph.initials.rotations[2]), 0,0,1);
		this.scale(this.graph.initials.sx, this.graph.initials.sy, this.graph.initials.sz);



		//nodes
		this.setDescMaterialsTextures(this.graph.nodes[this.graph.scene_id]);
		this.clearPickRegistration();
		this.drawNode(this.graph.nodes[this.graph.scene_id]);
	

	}
	else if (this.graph.loadedOk && !animating)
	{

		if(finished){
			this.winner=winner;
			this.activeEndInterface=true;
		}
		
		this.logPicking();
		this.clearPickRegistration();

		if(clearBoard){	
			this.board.clearMat();
			clearBoard = false;
		}
		for(var i = 0; i < movesAllowed.length; i++){
			this.board.squares[movesAllowed[i][0] * 5 + movesAllowed[i][1] + 1].showMaterial = true;
		}
		
		this.updateLights();
		//initial transformations

		this.pushMatrix();
			this.materials[this.boardoptions.material].setTexture(this.texture[this.boardoptions.texture]);
			this.materials[this.boardoptions.material];
			this.board.display();
		this.popMatrix();

		var piece = 0;
		for(var i = 0; i < 5; i++){
			
			for(var j = 0; j < 5; j++){
				
				if(prologBoard[i][j] == 1 ){

					this.pushMatrix();
						this.pieces[piece].material = this.graph.game.piece.p1.material;
						this.pieces[piece].texture = this.graph.game.piece.p1.texture;
						this.materials[this.pieces[piece].material].setTexture(this.texture[this.pieces[piece].texture]);
						this.materials[this.pieces[piece].material].apply();
						this.pieces[piece].x = j;
						this.pieces[piece].y = i;
						this.registerForPick(5*this.pieces[piece].y+this.pieces[piece].x+1,this.pieces[piece]);
						this.translate(this.pieces[piece].x*3+1.5,0.5,this.pieces[piece].y*3+1.5); 
						this.pieces[piece].obj.display();
					this.popMatrix();

					piece++;
				}
				else if(prologBoard[i][j] == 2){

					this.pushMatrix();
						this.pieces[piece].material = this.graph.game.piece.p2.material;
						this.pieces[piece].texture = this.graph.game.piece.p2.texture;
						this.materials[this.pieces[piece].material].setTexture(this.texture[this.pieces[piece].texture]);
						this.materials[this.pieces[piece].material].apply();
						this.pieces[piece].x = j;
						this.pieces[piece].y = i;
						this.registerForPick(5*this.pieces[piece].y+this.pieces[piece].x+1,this.pieces[piece]);
						this.translate(this.pieces[piece].x*3+1.5,0.5,this.pieces[piece].y*3+1.5); 
						this.pieces[piece].obj.display();
					this.popMatrix();

					piece++;
				}

				else if(prologBoard[i][j] == 3){
					this.pushMatrix();
						this.materials[this.neutronoptions.material].setTexture(this.texture[this.neutronoptions.texture]);
						this.materials[this.neutronoptions.material].apply();
						neutron.y = j;
						neutron.x = i;
						this.translate(neutron.y*3+1.5, 1, neutron.x*3+1.5);
						this.scale(1.5,1.5,1.5);
						neutron.display();
					this.popMatrix();
				}
			}
		}

			this.pushMatrix();
				if(player=="2"){
					if(this.activeStartInterface){
					this.translate(5,3,15);
					this.textinterface.display();
					}
					else{
						if(this.activeModeInterface){
							this.translate(5,4,15);
							this.modeinterface.display();
						}
						else if(this.activeDifficultyInterface){
							this.translate(5,4,15);
							this.difficultyinterface.display();
						}
						else if(this.activeEndInterface){
							this.translate(5,3,15);
							this.endinterface.display();
						}
						else{
							this.pushMatrix();
							this.translate(-3,3,15);
							this.undointerface.display();
							this.popMatrix();
							this.pushMatrix();
							this.translate(-3,2,15);
							this.resetinterface.display();
							this.popMatrix();
						}
					}
					
				}
				else if(player=="1"){
					if(this.activeStartInterface){
					
					this.translate(10,3,0);
					this.rotate(degToRad(180),0,1,0);
					this.textinterface.display();
					}
					else{
						if(this.activeModeInterface){
							this.translate(10,4,0);
							this.rotate(degToRad(180),0,1,0);
							this.modeinterface.display();
						}
						else if(this.activeDifficultyInterface){
							this.translate(10,4,0);
							this.rotate(degToRad(180),0,1,0);
							this.difficultyinterface.display();
						}
						else if(this.activeEndInterface){
							console.log(this.activeEndInterface);
							this.translate(10,3,0);
							this.rotate(degToRad(180),0,1,0);
							this.endinterface.display();
						}
						else{
							this.pushMatrix();
							this.translate(17,3,0);
							this.rotate(degToRad(180),0,1,0);
							this.undointerface.display();
							this.popMatrix();
							this.pushMatrix();
							this.translate(17,2,0);
							this.rotate(degToRad(180),0,1,0);
							this.resetinterface.display();
							this.popMatrix();
						}
					}
				}
			this.popMatrix();
		

		this.translate(this.graph.initials.tx, this.graph.initials.ty, this.graph.initials.tz);
		this.rotate(degToRad(this.graph.initials.rotations[0]), 1,0,0);
		this.rotate(degToRad(this.graph.initials.rotations[1]), 0,1,0);
		this.rotate(degToRad(this.graph.initials.rotations[2]), 0,0,1);
		this.scale(this.graph.initials.sx, this.graph.initials.sy, this.graph.initials.sz);



		//nodes
		this.setDescMaterialsTextures(this.graph.nodes[this.graph.scene_id]);
		this.clearPickRegistration();
		this.drawNode(this.graph.nodes[this.graph.scene_id]);
	

	}
	else if(animating){
		
		if(checkBoard){
			this.checkBoard();
			checkBoard = false;
		}
		this.board.clearMat();

		this.clearPickRegistration();

		this.updateLights();
		//initial transformations



		this.pushMatrix();
			this.materials[this.neutronoptions.material].setTexture(this.texture[this.neutronoptions.texture]);
			this.materials[this.neutronoptions.material].apply();
			this.translate(neutron.y*3+1.5, 1, neutron.x*3+1.5);
			for(var a in neutron.animation){
				if(neutron.animation[a].current){
					this.translate(neutron.animation[a].tx , neutron.animation[a].ty ,neutron.animation[a].tz);
				}
				else if(neutron.animation[a].ended){
					this.translate(neutron.animation[a].tx , neutron.animation[a].ty ,neutron.animation[a].tz);
				}
			}
			this.scale(1.5,1.5,1.5);
			neutron.display();
		this.popMatrix();

		this.pushMatrix();
			this.materials[this.boardoptions.material].setTexture(this.texture[this.boardoptions.texture]);
			this.materials[this.boardoptions.material];
			this.board.display();
		this.popMatrix();

		for(var piece in this.pieces){
			this.pushMatrix();
				this.materials[this.pieces[piece].material].setTexture(this.texture[this.pieces[piece].texture]);
				this.materials[this.pieces[piece].material].apply();
				this.translate(this.pieces[piece].x*3+1.5, 0.5, this.pieces[piece].y*3+1.5); 
				if(this.pieces[piece].moving){
					for(var a in this.pieces[piece].animation){
						if(this.pieces[piece].animation[a].ended){
							this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
						}
						else if(this.pieces[piece].animation[a].current){
							this.translate(this.pieces[piece].animation[a].tx , this.pieces[piece].animation[a].ty ,this.pieces[piece].animation[a].tz);
						}
					}
				}

				this.pieces[piece].obj.display();
			this.popMatrix();
		}

		this.translate(this.graph.initials.tx, this.graph.initials.ty, this.graph.initials.tz);
		this.rotate(degToRad(this.graph.initials.rotations[0]), 1,0,0);
		this.rotate(degToRad(this.graph.initials.rotations[1]), 0,1,0);
		this.rotate(degToRad(this.graph.initials.rotations[2]), 0,0,1);
		this.scale(this.graph.initials.sx, this.graph.initials.sy, this.graph.initials.sz);


		//nodes
		this.setDescMaterialsTextures(this.graph.nodes[this.graph.scene_id]);
		this.clearPickRegistration();
		this.drawNode(this.graph.nodes[this.graph.scene_id]);
	}	

};

/**
* Updates the scene based on the current time
* @param {int} currTime - Current time in milliseconds
*/
XMLscene.prototype.update = function (currTime){
	
	if(animating){
		if(this.first_check){
			neutron.x = 2;
			neutron.y = 2;
			this.checkBoard();
			this.first_check = false;
		}
		if(neutron.moving){
			console.log("Neutron is updating");
			if(neutron.animation[2].ended){
				neutron.moving = false;
				if(this.replay){
					this.count++;
					if(this.count < movie.length){
						for(var j in neutron.animation){
							neutron.animation[j].current = false;
							neutron.animation[j].ended = false;
						}
						this.checkBoard();
					}
					else{
						animating = false;
						this.replay = false;
						this.activeEndInterface = true;
					}
				}
				else{
					animating = false;
				}
			}
			else{

				for(var j in neutron.animation){

					if(neutron.animation[j].current){
						neutron.animation[j].update(currTime);
						break;
					}
					else if(!neutron.animation[j].ended){
						neutron.animation[j].current = true;
						neutron.animation[j].update(currTime);
						break;
					}
				}
			}
		}

		else {
			for(var i in this.pieces){
				if(this.pieces[i].moving){
					if(this.pieces[i].animation[2].ended){
						this.pieces[i].moving = false;
						if(this.replay){
							this.count++;
							if(this.count < movie.length){
								for(var j in this.pieces[i].animation){
									this.pieces[i].animation[j].current = false;
									this.pieces[i].animation[j].ended = false;
								}
								this.checkBoard();
							}
							else{
								animating = false;
								this.replay = false;
								this.activeEndInterface = true;
							}
						}
						else{
							animating = false;
						}
					}
					else{
						for(var j in this.pieces[i].animation){
							if(this.pieces[i].animation[j].current){
								this.pieces[i].animation[j].update(currTime);
								break;
							}
							else if(!this.pieces[i].animation[j].ended){
								this.pieces[i].animation[j].current = true;
								this.pieces[i].animation[j].update(currTime);
								break;
							}
						}
					}
				}
			}
		}
	}
	else if(!checkBoard && !this.replay){
		for(var j in neutron.animation){
			neutron.animation[j].current = false;
			neutron.animation[j].ended = false;
		}
		for(var i in this.pieces){
			for(var j in this.pieces[i].animation){
				this.pieces[i].animation[j].current = false;
				this.pieces[i].animation[j].ended = false;
			}
		}
		checkBoard = true;
	}

	this.updateCameraAngle();
	
	for(var i in this.graph.nodes){

		if(this.graph.nodes[i].newAnimations != undefined){

			for(var j in this.graph.nodes[i].newAnimations){

				if(this.graph.nodes[i].newAnimations[j].current){

					this.graph.nodes[i].newAnimations[j].update(currTime);

				}
			}
		}
	}

};