function Terrain(scene) {
   	CGFnurbsObject.call(this,scene);
    this.obj = null;
    this.init();

}

Terrain.prototype = Object.create(CGFnurbsObject.prototype);
Terrain.prototype.constructor = Terrain;


Terrain.prototype.init = function () {
	
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

Terrain.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, 100, 100);
	this.obj = obj;

};

Terrain.prototype.display = function(){
	this.obj.display();
};