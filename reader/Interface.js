/**
 * Interface
 * @constructor
 */
function Interface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * init
 * @param {CGFapplication} application
 */
Interface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	// lights on/off
	// add a group of controls (and open/expand by defult)
	var lights = this.gui.addFolder("Lights");
	lights.open();

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	if(this.scene.graph.loadedOk) {
		for(var i in this.scene.lights){
			bool = 'lightsBool['+i+']';
			name = 'light' + i;
			lights.add(this.scene, 'lightsBool['+i+']').name(name);
		}
	}
	
	return true;
};