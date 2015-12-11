/**
* Plane CGFnurbsObject object, which is a NURBS surface of order 1 on U and V
* 
* @constructor
* @param scene {CGFscene} - Scene object will be drawn on
* @param parts {int} - Parts on U and V
*/
function Plane(scene, parts) {
   	CGFnurbsObject.call(this,scene);
    this.parts = parts;
    this.obj = null;
    this.init();

}

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;

/**
* Initializes the NURBS surface
*/
Plane.prototype.init = function () {
	
	this.surface = this.makeSurface(1, // degree on U: 2 control vertexes U
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
 *
 * @param {int} degree1 - Degree on U
 * @param {int} degree2 - Degree on V
 * @param {array} knots1 - Knots for U
 * @param {array} knots2 - Knots for V
 * @param {array} controlvertexes - Control vertices of surface
 */
Plane.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.parts, this.parts);
	this.obj = obj;
	console.debug(this.obj);

};

/**
 * Draws place object in scene
 */
Plane.prototype.display = function(){
	this.obj.display();
}