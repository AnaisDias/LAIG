var done = 0;
/**
 * Interface
 * @constructor
 */

function Interface() {
	CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * Initializes interface
 *
 * @param {CGFapplication} application
 */
Interface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();

	console.debug(this);
	
	return true;
};

/**
 * Updates interface according to the current scene
 */
Interface.prototype.update = function(){
	if(done == 0 && this.scene.lightsloaded){
		done = 1;
		var lights = this.gui.addFolder("Lights");
		lights.open();

		for(var i in this.scene.lights){
			var nome = "lightsBool" + i;
			lights.add(this.scene, nome).name("Light " + i);
			
		}

	}

};