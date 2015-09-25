
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

	// FRUSTRUM
	var frustum = elemsList.getElementsByTagName('frustum');

	if(frustum.length != 1){
		return "frustum element is missing or there is more than one.";
	}

	var f = frustum[0];

	this.fnear = this.reader.getItem(f, 'near');
	this.ffar = this.reader.getItem(f,'far');

	// TRANSLATE
	var translate = elemsList.getElementsByTagName('translate');

	if(translate.length != 1){
		return "translate element is missing or there is more than one.";
	}

	var t = translate[0];

	this.tx = this.reader.getItem(t, 'x');
	this.ty = this.reader.getItem(t, 'y');
	this.ty = this.reader.getItem(t, 'z');

	// ROTATION
	var rotation = elemsList.getElementsByTagName('rotation');

	if(rotation.length != 3){
		return "the 3 rotation elements are missing.";
	}
	var r1 = rotation[0];
	var r2 = rotation[1];
	var r3 = rotation[2];
	
	// SCALE
	var scale = elemsList.getElementsByTagName('scale');

	if(scale.length != 1){
		return "scale element is missing or there is more than one";
	} 

	// REFERENCE
	var reference = elemsList.getElementsByTagName('reference');

	if(reference.length != 1){
		return "reference element is missing or there is more than one";
	} 


}

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


