/**
 * Terrain CGFnurbsObject object
 * @constructor
 * @param {CGFscene} scene - Scene to change 
 */
function Terrain(scene) {
   	CGFnurbsObject.call(this,scene);
    this.obj = null;
    this.init();

}

Terrain.prototype = Object.create(CGFnurbsObject.prototype);
Terrain.prototype.constructor = Terrain;

/**
 * Initializes objects that be used in the display function
 */
Terrain.prototype.init = function () {
	
	this.makeSurface(1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							[ 0.5, 0.0,-0.5, 1 ],
							[ 0.5, 0.0, 0.5, 1 ]	
							
						],
						// U = 1
						[ // V = 0..1
							 [-0.5, 0.0,-0.5, 1 ],
							 [-0.5, 0.0, 0.5, 1 ]			 
						]
					]);

};

/**
 * Creates the CGFnurbsObject to be called in the display function
 * @param {int} degree1 - Degree on U
 * @param {int} degree2 - Degree on V
 * @param {array} knots1 - Knots for U
 * @param {array} knots2 - Knots for V
 * @param {array} controlvertexes - Control vertexes of the surface
 */
Terrain.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, 100, 100);
	this.obj = obj;

};

/**
 * Draws the Terrain object in the scene
 */
Terrain.prototype.display = function(){
	this.obj.display();
};