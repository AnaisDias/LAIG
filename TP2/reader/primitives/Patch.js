function Patch(scene, order, partsU, partsV) {
   	CGFobject.call(this,scene);
    this.partsU = partsU;
    this.partsV = partsV;
    this.order = order;
}

Patch.prototype = Object.create(CGFscene.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.init = function () {
	
	this.surface = this.makeSurface("0", this.order, // degree on U: 2 control vertexes U
					 this.order, // degree on V: 2 control vertexes on V
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

Patch.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this, getSurfacePoint, this.partsU, this.partsV);
	return obj;

};