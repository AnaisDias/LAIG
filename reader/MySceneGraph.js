
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLeaves(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseNodes(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	

/*
*	Function to parse INITIALS
*/
MySceneGraph.prototype.parseInitials = function(rootElement){

	var elemsList =  rootElement.getElementsByTagName('INITIALS');
	if (elemsList == null) {
		return "INITIALS element is missing.";
	}

	if(elemsList.length != 1){
		return "INITIALS element is missing or there is more than one.";
	}

	// FRUSTRUM

	this.initials=[];

	// iterate over every element
	var nnodes=elemsList[0].children.length;
	if(nnodes != 7){
		return "INITIALS element must have exactly 7 children.";
	}

	var frustum = elemsList[0].children[0];

/*	for (var i=0; i< nnodes; i++)
	{
		var e=elemsList[0].children[i];

		// process each element and store its information
		this.initials[e.id]=e.attributes.getNamedItem("detalhes").value;
		console.log("Read initials item id "+ e.id+" with value "+this.initials[e.id]);
	};
	var frustum = elemsList.getNamedItem('frustum');

	if(frustum.length != 1){
		return "frustum element is missing or there is more than one.";
	}

	var f = frustum;
*/
	this.fnear = frustum.attributes.getNamedItem("near").value;
	this.ffar = frustum.attributes.getNamedItem("far").value;
	/*
	this.fnear = this.reader.getItem(f, 'near');
	this.ffar = this.reader.getItem(f,'far');

*/
	if (isNaN(this.fnear) || isNaN(this.ffar)){
		return "frustum values must be floats.";
	} 

	console.log("Read INITIALS/frustum item with value near "+this.fnear + " and value far " + this.ffar);

	// TRANSLATE
	var translate = elemsList[0].children[1];


	if(translate == null){
		return "translate element is missing.";
	}

	this.tx = translate.attributes.getNamedItem("x").value;
	this.ty = translate.attributes.getNamedItem("y").value;
	this.tz = translate.attributes.getNamedItem("z").value;

	if (isNaN(this.tx) || isNaN(this.ty) || isNaN(this.tz)){
		return "translate values must be floats.";
	} 

	console.log("Read INITIALS/translate item with value x "+this.tx + ", value y " + this.ty + " and value z " + this.tz);

	// ROTATION
	var rotation1 = elemsList[0].children[2];

	if(rotation1 == null){
		return "The 3 rotation elements are missing.";
	}

	this.rotations = [];

	var r1axis = rotation1.attributes.getNamedItem("axis").value;

	var r1angle = rotation1.attributes.getNamedItem("angle").value;


	if (isNaN(r1angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(r1axis)){
		return "rotation axis values must be chars.";
	}

	if(r1axis == "x"){
		this.rotations[0] = r1angle;
	}
	else if (r1axis == "y"){
		this.rotations[1] = r1angle;
	}
	else if (r1axis == "z"){
		this.rotations[2] = r1angle;
	}

	console.log("Read INITIALS/rotation item with value axis "+this.r1axis + " and value angle " + this.r1angle);

	var rotation2 = elemsList[0].children[3];

	if(rotation2 == null){
		return "The 3 rotation elements are missing.";
	}

	var r2axis = rotation2.attributes.getNamedItem("axis").value;
	var r2angle = rotation2.attributes.getNamedItem("angle").value;

	if (isNaN(r2angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(r2axis)){
		return "rotation axis values must be chars.";
	}

	if(r2axis == "x"){
		this.rotations[0] = r2angle;
	}
	else if (r2axis == "y"){
		this.rotations[1] = r2angle;
	}
	else if (r2axis == "z"){
		this.rotations[2] = r2angle;
	}

	console.log("Read INITIALS/rotation item with value axis "+this.r2axis + " and value angle " + this.r2angle);

	var rotation3 = elemsList[0].children[4];

	if(rotation3 == null){
		return "The 3 rotation elements are missing.";
	}

	var r3axis = rotation3.attributes.getNamedItem("axis").value;
	var r3angle = rotation3.attributes.getNamedItem("angle").value;


	if (isNaN(r3angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(r3axis)){
		return "rotation axis values must be chars.";
	}

	if(r3axis == "x"){
		this.rotations[0] = r3angle;
	}
	else if (r3axis == "y"){
		this.rotations[1] = r3angle;
	}
	else if (r3axis == "z"){
		this.rotations[2] = r3angle;
	}
	else return "rotation must be x, y or z";

	console.log("Read INITIALS/rotation item with value axis "+this.r3axis + " and value angle " + this.r3angle);
	
	// SCALE
	var scale = elemsList[0].children[5];

	if(scale == null){
		return "scale element is missing.";
	} 

	this.sx = scale.attributes.getNamedItem("sx").value;
	this.sy = scale.attributes.getNamedItem("sy").value;
	this.sz = scale.attributes.getNamedItem("sz").value;

	if (isNaN(this.sx) || isNaN(this.sy) || isNaN(this.sz)){
		return "scale values must be floats.";
	} 

	console.log("Read INITIALS/scale item with value x "+this.sx + ", value y " + this.sy + " and value z " + this.sz);


	// REFERENCE
	var reference = elemsList[0].children[6];

	if(reference == null){
		return "reference element is missing.";
	} 


	this.rlength = reference.attributes.getNamedItem("length").value;

	if (isNaN(this.rlength)){
		return "reference length value must be a float.";
	} 

	console.log("Read INITIALS/reference item with value length "+this.rlength);
};

MySceneGraph.prototype.parseIllumination = function(rootElement){

	var elemsList =  rootElement.getElementsByTagName('ILLUMINATION');
	if (elemsList == null) {
		return "ILLUMINATION element is missing.";
	}

	if(elemsList.length != 1){
		return "ILLUMINATION element is missing or there is more than one.";
	}

	this.illumination=[];

	var nnodes=elemsList[0].children.length;
	if(nnodes != 2){
		return "ILLUMINATION element must have exactly 2 children.";
	}

	var amb = elemsList[0].children[0];

	this.illumination.ambient = [];
	console.debug(this.illumination.ambient);
	this.illumination.ambient.r = amb.attributes.getNamedItem("r").value;
	this.illumination.ambient.g = amb.attributes.getNamedItem("g").value;
	this.illumination.ambient.b = amb.attributes.getNamedItem("b").value;
	this.illumination.ambient.a = amb.attributes.getNamedItem("a").value;


	if (isNaN(this.illumination.ambient.r) || isNaN(this.illumination.ambient.g) || isNaN(this.illumination.ambient.b) || isNaN(this.illumination.ambient.a)){
		return "ILLUMINATION/ambient values must be floats.";
	} 

	console.log("Read ILLUMINATION/ambient item with value r "+this.illumination.ambient.r + ", value g " + this.illumination.ambient.g + ", value b " 
		+ this.illumination.ambient.b + " and value a " + this.illumination.ambient.a);



	var background = elemsList[0].children[1];

	if(background == null){
		return "ILLUMINATION/background element is missing.";
	}

	this.illumination.background = [];

	this.illumination.background.r = background.attributes.getNamedItem("r").value;
	this.illumination.background.g = background.attributes.getNamedItem("g").value;
	this.illumination.background.b = background.attributes.getNamedItem("b").value;
	this.illumination.background.a = background.attributes.getNamedItem("a").value;

	if (isNaN(this.illumination.background.r) || isNaN(this.illumination.background.g) || isNaN(this.illumination.background.b) || isNaN(this.illumination.background.a)){
		return "ILLUMINATION/background values must be floats.";
	} 

	console.log("Read ILLUMINATION/background item with value r "+this.illumination.background.r + ", value g " + this.illumination.background.g + ", value b " 
		+ this.illumination.background.b + " and value a " + this.illumination.background.a);

};

MySceneGraph.prototype.parseLights = function(rootElement){
	var elemsList =  rootElement.getElementsByTagName('LIGHTS');
	if (elemsList == null) {
		return "LIGHTS element is missing.";
	}

	if(elemsList.length != 1){
		return "LIGHTS element is missing or there is more than one.";
	}


	var lightElems =  elemsList[0].getElementsByTagName('LIGHT');

	console.debug(lightElems[0].attributes.getNamedItem("id").value);
	
	console.log(lightElems.length + " lights to be processed");
	
	this.lights = [];
	for(i = 0; i<lightElems.length; i++){
		var id = lightElems[i].attributes.getNamedItem("id").value;
		var enable = lightElems[i].children[0];
		var pos = lightElems[i].children[1];
		var amb = lightElems[i].children[2];
		var dif = lightElems[i].children[3];
		var spec = lightElems[i].children[4];

		if (this.lights[id] != undefined){
			return "Light ids must not be repeated";
		}
		this.lights[id]=[];

//try with globals-like parsing later
//add verifications
		this.lights[id].enable = enable.attributes.getNamedItem("value").value;


		this.lights[id].position=[];
		this.lights[id].position.x = pos.attributes.getNamedItem("x").value;
		this.lights[id].position.y = pos.attributes.getNamedItem("y").value;
		this.lights[id].position.z = pos.attributes.getNamedItem("z").value;
		this.lights[id].position.w = pos.attributes.getNamedItem("w").value;

		this.lights[id].ambient=[];
		this.lights[id].ambient.r = amb.attributes.getNamedItem("r").value;
		this.lights[id].ambient.g = amb.attributes.getNamedItem("g").value;
		this.lights[id].ambient.b = amb.attributes.getNamedItem("b").value;
		this.lights[id].ambient.a = amb.attributes.getNamedItem("a").value;

		this.lights[id].diffuse=[];
		this.lights[id].diffuse.r = dif.attributes.getNamedItem("r").value;
		this.lights[id].diffuse.g = dif.attributes.getNamedItem("g").value;
		this.lights[id].diffuse.b = dif.attributes.getNamedItem("b").value;
		this.lights[id].diffuse.a = dif.attributes.getNamedItem("a").value;

		this.lights[id].specular=[];
		this.lights[id].specular.r = dif.attributes.getNamedItem("r").value;
		this.lights[id].specular.g = dif.attributes.getNamedItem("g").value;
		this.lights[id].specular.b = dif.attributes.getNamedItem("b").value;
		this.lights[id].specular.a = dif.attributes.getNamedItem("a").value;

		if (isNaN(this.lights[id].enable) || isNaN(this.lights[id].position.x) || isNaN(this.lights[id].position.y) || isNaN(this.lights[id].position.z) || isNaN(this.lights[id].ambient.r)
		|| isNaN(this.lights[id].ambient.g) || isNaN(this.lights[id].ambient.b) || isNaN(this.lights[id].ambient.a) || isNaN(this.lights[id].diffuse.r) || isNaN(this.lights[id].diffuse.g) 
		|| isNaN(this.lights[id].diffuse.b) || isNaN(this.lights[id].diffuse.a) || isNaN(this.lights[id].specular.r) || isNaN(this.lights[id].specular.g) || isNaN(this.lights[id].specular.b) 
			|| isNaN(this.lights[id].specular.a)) {
			return "Light values must be numbers";
		}
		

		console.log("Read light with id " + id + " , value enable " + this.lights[id].enable + ", value position x " + this.lights[id].position.x 
			+ ", y " + this.lights[id].position.y + ", z " + this.lights[id].position.z + ", value ambient r " + this.lights[id].ambient.r + ", g " + this.lights[id].ambient.g + ", b "
			+ this.lights[id].ambient.b + ", a " + this.lights[id].ambient.a + ", value diffuse r " + this.lights[id].diffuse.r + ", g " + this.lights[id].diffuse.g + ", b " 
			+ this.lights[id].diffuse.b + ", a " + this.lights[id].diffuse.a + "and value specular r " + this.lights[id].specular.r + ", g " + this.lights[id].specular.g + ", b "
			+ this.lights[id].specular.b + ", a " + this.lights[id].specular.a);

	}

};


MySceneGraph.prototype.parseTextures = function(rootElement){
	var elemsList =  rootElement.getElementsByTagName('TEXTURES');
	if (elemsList == null) {
		return "TEXTURES element is missing.";
	}

	if(elemsList.length != 1){
		return "TEXTURES element is missing or there is more than one.";
	}


	var texElems =  elemsList[0].getElementsByTagName('TEXTURE');
	
	console.log(texElems.length + " textures to be processed");
	
	this.textures = [];
	for(i = 0; i<texElems.length; i++){
		var id = texElems[i].attributes.getNamedItem("id").value;
		var file = texElems[i].getElementsByTagName('file');
		var amp = texElems[i].getElementsByTagName('amplif_factor');

		if (this.textures[id] != undefined){
			return "Texture ids must not be repeated";
		}

		this.textures[id]=[];

		this.textures[id].filepath = file[0].attributes.getNamedItem("path").value;

		this.textures[id].amplif=[];
		this.textures[id].amplif.s = amp[0].attributes.getNamedItem("s").value;
		this.textures[id].amplif.t = amp[0].attributes.getNamedItem("t").value;

		if (isNaN(this.textures[id].amplif.s) || isNaN(this.textures[id].amplif.t)) {
			return "Amplif_factor values must be numbers";
		}
		

		console.log("Read texture with id " + id + " , value filepath " + this.textures[id].filepath + ", value amplif_factor s " + this.textures[id].amplif.s 
			+ ", t " + this.textures[id].amplif.t);

	}

};

MySceneGraph.prototype.parseMaterials = function(rootElement){
 
	var elemsList =  rootElement.getElementsByTagName('MATERIALS');
	if (elemsList == null) {
		return "MATERIALS element is missing.";
	}


	if(elemsList.length != 1){
		return "MATERIALS element is missing or there is more than one.";
	}


	var matElems =  elemsList[0].getElementsByTagName('MATERIAL');

	console.debug(matElems[0].attributes.getNamedItem("id").value);
	
	console.log(matElems.length + " materials to be processed");
	
	this.materials = [];
	for(i = 0; i<matElems.length; i++){
		var id = matElems[i].attributes.getNamedItem("id").value;
		//var shin = matElems[i].children[0];
		console.debug(matElems[i]);
		var shin = matElems[i].getElementsByTagName('shininess');
		var spec = matElems[i].getElementsByTagName('specular');
		var dif = matElems[i].getElementsByTagName('diffuse');
		var amb = matElems[i].getElementsByTagName('ambient');
		var emi = matElems[i].getElementsByTagName('emission');

		if (this.materials[id] != undefined){
			return "Material ids must not be repeated";
		}
		this.materials[id]=[];

		this.materials[id].shininess = shin[0].attributes.getNamedItem("value").value;


		this.materials[id].specular=[];
		this.materials[id].specular.r = spec[0].attributes.getNamedItem("r").value;
		this.materials[id].specular.g = spec[0].attributes.getNamedItem("g").value;
		this.materials[id].specular.b = spec[0].attributes.getNamedItem("b").value;
		this.materials[id].specular.a = spec[0].attributes.getNamedItem("a").value;

		this.materials[id].diffuse=[];
		this.materials[id].diffuse.r = dif[0].attributes.getNamedItem("r").value;
		this.materials[id].diffuse.g = dif[0].attributes.getNamedItem("g").value;
		this.materials[id].diffuse.b = dif[0].attributes.getNamedItem("b").value;
		this.materials[id].diffuse.a = dif[0].attributes.getNamedItem("a").value;

		this.materials[id].ambient=[];
		this.materials[id].ambient.r = amb[0].attributes.getNamedItem("r").value;
		this.materials[id].ambient.g = amb[0].attributes.getNamedItem("g").value;
		this.materials[id].ambient.b = amb[0].attributes.getNamedItem("b").value;
		this.materials[id].ambient.a = amb[0].attributes.getNamedItem("a").value;

		this.materials[id].emission=[];
		this.materials[id].emission.r = emi[0].attributes.getNamedItem("r").value;
		this.materials[id].emission.g = emi[0].attributes.getNamedItem("g").value;
		this.materials[id].emission.b = emi[0].attributes.getNamedItem("b").value;
		this.materials[id].emission.a = emi[0].attributes.getNamedItem("a").value;

		if (isNaN(this.materials[id].shininess) || isNaN(this.materials[id].emission.r) || isNaN(this.materials[id].emission.g) || isNaN(this.materials[id].emission.b) || isNaN(this.materials[id].emission.a) || isNaN(this.materials[id].ambient.r)
		|| isNaN(this.materials[id].ambient.g) || isNaN(this.materials[id].ambient.b) || isNaN(this.materials[id].ambient.a) || isNaN(this.materials[id].diffuse.r) || isNaN(this.materials[id].diffuse.g) 
		|| isNaN(this.materials[id].diffuse.b) || isNaN(this.materials[id].diffuse.a) || isNaN(this.materials[id].specular.r) || isNaN(this.materials[id].specular.g) || isNaN(this.materials[id].specular.b) 
			|| isNaN(this.materials[id].specular.a)) {
			return "Material values must be numbers";
		}
		

		console.log("Read material with id " + id + ", value shininess " + this.materials[id].shininess
			+ ", value ambient r " + this.materials[id].ambient.r + ", g " + this.materials[id].ambient.g + ", b " + this.materials[id].ambient.b + ", a " + this.materials[id].ambient.a 
			+ ", value diffuse r " + this.materials[id].diffuse.r + ", g " + this.materials[id].diffuse.g + ", b " + this.materials[id].diffuse.b + ", a " + this.materials[id].diffuse.a 
			+ ", value specular r " + this.materials[id].specular.r + ", g " + this.materials[id].specular.g + ", b " + this.materials[id].specular.b + ", a " + this.materials[id].specular.a 
			+ " and value emission r " + this.materials[id].emission.r	+ ", g " + this.materials[id].emission.g + ", b " + this.materials[id].emission.b + ", a " + this.materials[id].emission.a);

	}
};

MySceneGraph.prototype.parseLeaves = function(rootElement){

	var leavesList =  rootElement.getElementsByTagName('LEAVES');
	if (leavesList == null) {
		return "LEAVES element is missing.";
	}

	if(leavesList.length != 1){
		return "LEAVES element is missing or there is more than one.";
	}


	var leavesElems =  rootElement.getElementsByTagName('LEAF');

	console.debug(leavesElems[0].attributes.getNamedItem("id").value);
	
	console.log(leavesElems.length + " leaves to be processed");

	this.leaves = [];
	for(i=0; i < leavesElems.length; i++){

		var id = leavesElems[i].attributes.getNamedItem("id").value;
		var type = leavesElems[i].attributes.getNamedItem("type").value;
		var args = leavesElems[i].attributes.getNamedItem("args").value;

		if (this.leaves[id] != undefined){
			return "Leaves ids must not be repeated";
		}
		this.leaves[id]=[];

		if (type == "rectangle"){
			var a = args.split(" ");
			if (a.length != 4){
				return "Rectangle leaves must have 4 args!";
			}
			if (isNaN(a[0]) || isNaN(a[1]) || isNaN(a[2]) || isNaN(a[3])){
				return "Rectangle leaves must have number args!";
			}
		}

		else if (type == "cylinder"){
			var a = args.split(" ");
			if (a.length != 5){
				return "Cylinder leaves must have 5 args!";
			}
			if (isNaN(a[0]) || isNaN(a[1]) || isNaN(a[2]) || isNaN(a[3]) || isNaN(a[4])){
				return "Cylinder leaves must have number args!";
			}
		}

		else if (type == "sphere"){
			var a = args.split(" ");
			if (a.length != 3){
				return "Sphere leaves must have 3 args!";
			}
			if (isNaN(a[0]) || isNaN(a[1]) || isNaN(a[2])){
				return "Sphere leaves must have number args!";
			}
		}

		else if(type == "triangle"){
			var a = args.split(" ");
			var b = args.split("  ");

			if (!(a.length == 9 || (b.length==3 && b[0].split(" ").length ==3 && b[1].split(" ").length ==3 && b[2].split(" ").length == 3))){
				return "Triangle leaves must have 9 args!";
			}
			if (isNaN(a[0]) || isNaN(a[1]) || isNaN(a[2]) || isNaN(a[3]) || isNaN(a[4]) || isNaN(a[5]) || isNaN(a[6]) || isNaN(a[7]) || isNaN(a[8])){
				return "Triangle leaves must have number args!";
			}
		}

		this.leaves[id]._type = [];
		this.leaves[id]._type = type;

		this.leaves[id].args = [];
		this.leaves[id].args = args;

		console.log("Read leaf with id " + id 
			+ ", type " + this.leaves[id]._type
			+ " and args " + this.leaves[id].args );

	}

};

MySceneGraph.prototype.parseNodes = function(rootElement){

	var nodesList =  rootElement.getElementsByTagName('NODES');
	if (nodesList == null) {
		return "NODES element is missing.";
	}

	if(nodesList.length != 1){
		return "NODES element is missing or there is more than one.";
	}

	//ROOT ID
	var root = nodesList[0].getElementsByTagName('ROOT');
	this.scene_id = root[0].attributes.getNamedItem("id").value;

	var nodesElems = nodesList[0].getElementsByTagName('NODE');

	console.debug(nodesElems[0].attributes.getNamedItem("id").value);
	
	console.log(nodesElems.length + " nodes to be processed");

	this.nodes = [];
	for(i=0; i < nodesElems.length; i++){

		//ID
		var id = nodesElems[i].attributes.getNamedItem("id").value;
		if (this.nodes[id] != undefined || this.leaves[id] != undefined){
			return "Node ids must not be repeated and must not be the same as a leaf id";
		}

		this.nodes[id]= [];

		//MATERIAL
		var material = getUniqueElement(nodesElems[i],'MATERIAL');
		if(material == -1){
			return "MATERIAL element is missing.";
		}
		if(material == -2){
			return "MATERIAL element is missing or there is more than one.";
		}

		this.nodes[id].material = material[0].attributes.getNamedItem('id').value;

		//TEXTURE
		var texture = getUniqueElement(nodesElems[i],'TEXTURE');
		if(texture == -1){
			return "TEXTURE element is missing.";
		}
		if(texture == -2){
			return "TEXTURE element is missing or there is more than one.";
		}

		this.nodes[id].texture = texture[0].attributes.getNamedItem('id').value;
		//DESCENDANTS		
		var descElem = getUniqueElement(nodesElems[i],'DESCENDANTS');
		if(descElem == -1){
			return "DESCENDANTS element is missing.";
		}
		if(descElem == -2){
			return "DESCENDANTS element is missing or there is more than one.";
		}


		this.nodes[id].descendants = [];

		var desc = descElem[0].getElementsByTagName('DESCENDANT');
		for(j = 0; j < desc.length; j++){
			
			var id_desc = desc[j].attributes.getNamedItem("id").value;
			
			if (id == id_desc){
				return "Node cannot be descendant to himself!";
			}

			this.nodes[id].descendants[j] = id;
		}

		var allList = nodesElems[i].getElementsByTagName('*');
		this.nodes[id].transf = [];
		var count = 0;

		for(j=0; j < allList.length; j++){

			this.nodes[id].transf[count] = [];

			if(allList[j].tagName == "TRANSLATION"){
				var tx = allList[j].attributes.getNamedItem("x").value;
				var ty = allList[j].attributes.getNamedItem("y").value;
				var tz = allList[j].attributes.getNamedItem("z").value;
				
				if(isNaN(tx) || isNaN(ty) || isNaN(tz)){
					return "Translations have to be numbers!";
				}

				this.nodes[id].transf[count]._type = 0;
				this.nodes[id].transf[count].tx = tx;
				this.nodes[id].transf[count].ty = ty;
				this.nodes[id].transf[count].tz = tz;


				count += 1;
				this.nodes[id].transf[count] = [];

			}
			

			else if(allList[j].tagName == "ROTATION"){
				var axis = allList[j].attributes.getNamedItem("axis").value;
				var angle = allList[j].attributes.getNamedItem("angle").value;
				
				if(axis != "x" && axis != "y" && axis != "z"){
					return "Axis must be x,y or z!";
				}

				if(angle < -360 || angle > 360){
					return "Angle must be between -360 and 360!";
				}
				this.nodes[id].transf[count]._type = 1;
				this.nodes[id].transf[count].ax = axis;
				this.nodes[id].transf[count].ang = angle;

				count += 1;
				this.nodes[id].transf[count] = [];
			}

			else if(allList[j].tagName == "SCALE"){
				var sx = allList[j].attributes.getNamedItem("sx").value;
				var sy = allList[j].attributes.getNamedItem("sy").value;
				var sz = allList[j].attributes.getNamedItem("sz").value;

				if(isNaN(sx) || isNaN(sy) || isNaN(sz)){
					return "Scaling has to be numbers!";
				}
				
				this.nodes[id].transf[count]._type = 2;
				this.nodes[id].transf[count].sx = sx;
				this.nodes[id].transf[count].sy = sy;
				this.nodes[id].transf[count].sz = sz;

				count += 1;
				this.nodes[id].transf[count] = [];

			}
		}


		console.log("Read node with id " + id 
			+ ", material " + this.nodes[id].material
			+ ", texture " + this.nodes[id].texture);

		for(j = 0; j < this.nodes[id].descendants.length; j++){
			console.log(", descendant " + (j+1) + ": " + this.nodes[id].descendants[j]); 
		}

		for(j = 0; j < this.nodes[id].transf.length; j++){
			if(this.nodes[id].transf[j]._type == 0){
				console.log(", translation " + (j+1) + ": x->" + this.nodes[id].transf[j].tx + " y->" + this.nodes[id].transf[j].ty + " z->" + this.nodes[id].transf[j].tz); 
			}
			else if (this.nodes[id].transf[j]._type == 1){
				console.log(", rotation " + (j+1) + ": axis->" + this.nodes[id].transf[j].ax + " angle->" + this.nodes[id].transf[j].ang); 
			}
			else if(this.nodes[id].transf[j]._type == 2){
				console.log(", scaling " + (j+1) + ": x->" + this.nodes[id].transf[j].sx + " y->" + this.nodes[id].transf[j].sy + " z->" + this.nodes[id].transf[j].sz); 
			}
			
		}
	}

};

function getUniqueElement(tag,tagName){

	var elem = tag.getElementsByTagName(tagName);
	if(elem == null){
		return -1;
	}

	if(elem.length != 1){
		return -2;
	}

	return elem;
};

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

function check (tagName){

}


