var done = 0;
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

	console.debug(this);
	
	return true;
};

Interface.prototype.update = function(){
	if(done == 0 && this.scene.lightsloaded){
		done = 1;
		var lights = this.gui.addFolder("Lights");
		lights.open();
		console.debug(this.scene.lightsloaded);

		for(var i in this.scene.lights){
			var nome = "lightsBool" + i;
			console.debug(this.scene.lights);
			lights.add(this.scene, nome).name("Light " + i);
			
		}

	}

};