function Plane(scene, parts) {
   	CGFobject.call(this,scene);
    this.parts = parts;
}

Plane.prototype = Object.create(CGFscene.prototype);
Plane.prototype.constructor = Plane;


Plane.prototype.init = function () {
	
	this.surface = this.makeSurface("0", 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 1, 0, 1], // knots for U
					[0, 1, 0, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [0, 0.0, 0, 1 ],
							 [0, 0.0, 1, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 1, 0.0, 0.0, 1 ],
							 [ 1, 0.0, 1.0, 1 ]							 
						]
					]);

};

Plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this, getSurfacePoint, this.parts, this.parts);
	return obj;

};