
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

	var error = this.parseInitials(rootElement);

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

	this.r1axis = rotation1.attributes.getNamedItem("axis").value;
	this.r1angle = rotation1.attributes.getNamedItem("angle").value;

	if (isNaN(this.r1angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(this.r1axis)){
		return "rotation axis values must be chars.";
	}

	console.log("Read INITIALS/rotation item with value axis "+this.r1axis + " and value angle " + this.r1angle);

	var rotation2 = elemsList[0].children[3];

	if(rotation2 == null){
		return "The 3 rotation elements are missing.";
	}

	this.r2axis = rotation2.attributes.getNamedItem("axis").value;
	this.r2angle = rotation2.attributes.getNamedItem("angle").value;

	if (isNaN(this.r2angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(this.r2axis)){
		return "rotation axis values must be chars.";
	}

	console.log("Read INITIALS/rotation item with value axis "+this.r2axis + " and value angle " + this.r2angle);

	var rotation3 = elemsList[0].children[4];

	if(rotation3 == null){
		return "The 3 rotation elements are missing.";
	}

	this.r3axis = rotation3.attributes.getNamedItem("axis").value;
	this.r3angle = rotation3.attributes.getNamedItem("angle").value;


	if (isNaN(this.r3angle)){
		return "rotation angle values must be floats.";
	} 

	if (!isNaN(this.r3axis)){
		return "rotation axis values must be chars.";
	}

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

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


