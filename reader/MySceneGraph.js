
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
	if (elemsList == null || tempList.length == 0) {
		return "INITIALS element is missing.";
	}

	if(elemsList.length != 1){
		return "INITIALS element is missing or there is more than one.";
	}

	// FRUSTRUM
	var frustum = elemsList.getElementsByTagName('frustum');

	if(frustum.length != 1){
		return "frustum element is missing or there is more than one.";
	}

	var f = frustum[0];

	this.fnear = this.reader.getItem(f, 'near');
	this.ffar = this.reader.getItem(f,'far');

	console.log("Read INITIALS/frustum item with value near "+this.fnear + "and value far " + this.ffar);

	// TRANSLATE
	var translate = elemsList.getElementsByTagName('translate');

	if(translate.length != 1){
		return "translate element is missing or there is more than one.";
	}

	var t = translate[0];

	this.tx = this.reader.getItem(t, 'x');
	this.ty = this.reader.getItem(t, 'y');
	this.tz = this.reader.getItem(t, 'z');

	console.log("Read INITIALS/translate item with value x "+this.tx + ", value y " + this.ty + " and value z " + this.tz);

	// ROTATION
	var rotation = elemsList.getElementsByTagName('rotation');

	if(rotation.length != 3){
		return "The 3 rotation elements are missing.";
	}
	var r1 = rotation[0];
	this.r1axis = this.reader.getItem(r1, 'axis');
	this.r1angle = this.reader.getItem(r1, 'angle');

	console.log("Read INITIALS/rotation item with value axis "+this.r1axis + "and value angle " + this.r1angle);

	var r2 = rotation[1];
	this.r2axis = this.reader.getItem(r2, 'axis');
	this.r2angle = this.reader.getItem(r2, 'angle');

	console.log("Read INITIALS/rotation item with value axis "+this.r2axis + "and value angle " + this.r2angle);

	var r3 = rotation[2];
	this.r3axis = this.reader.getItem(r3, 'axis');
	this.r3angle = this.reader.getItem(r3, 'angle');

	console.log("Read INITIALS/rotation item with value axis "+this.r3axis + "and value angle " + this.r3angle);
	
	// SCALE
	var scale = elemsList.getElementsByTagName('scale');

	if(scale.length != 1){
		return "scale element is missing or there is more than one";
	} 

	var sc = scale[0];

	this.sx = this.reader.getItem(sc,'sx');
	this.sy = this.reader.getItem(sc,'sy');
	this.sz = this.reader.getItem(sc,'sz');

	console.log("Read INITIALS/scale item with value x "+this.sx + ", value y " + this.sy + " and value z " + this.sz);


	// REFERENCE
	var reference = elemsList.getElementsByTagName('reference');

	if(reference.length != 1){
		return "reference element is missing or there is more than one";
	} 

	var ref = reference[0];

	this.rlength = this.reader.getItem(ref,'length');

	console.log("Read INITIALS/reference item with value axis "+this.rlength);
}

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


