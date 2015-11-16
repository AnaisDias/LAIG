function Vehicle(scene) {
   	CGFnurbsObject.call(this,scene);
   	this.top = null;
   	this.bottom = null;
   	this.sphere = null;
    this.surfaces = [];
    this.init();

}

Vehicle.prototype = Object.create(CGFnurbsObject.prototype);
Vehicle.prototype.constructor = Vehicle;


Vehicle.prototype.init = function () {

	//body
	this.top = new Patch(this.scene,3, // degree on U: 2 control vertexes U
					// degree on V: 2 control vertexes on V
					20, // knots for U
					20, // knots for V
					[	// U = 0
						[ // V = 0..3;
							 [ 0, 0, 1, 1 ],
							 [ 2, 0, 1, 0.33333 ],
							 [ 2, 0, -1, 0.33333 ],
							 [ 0, 0, -1, 1 ]
						],
						// U = 1
						[ // V = 0..3
							 [ 0, 0, 1, 0.33333 ],
							 [ 2, -1, 1, 0.11111 ],
							 [ 2, -1, -1, 0.11111 ],
							 [ 0, 0, -1, 0.33333 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 0, 0, 1, 0.33333 ],
							 [ -2, -1, 1, 0.11111 ],
							 [ -2, -1, -1, 0.11111 ],
							 [ 0, 0, -1, 0.33333 ]
						],
						[ // V = 0..3
							 [ 0, 0, 1, 1 ],
							 [ -2, 0, 1, 0.33333 ],
							 [ -2, 0, -1, 0.33333 ],
							 [ 0, 0, -1, 1 ]
						]
						]);

	console.debug(this.top);

	//wings

	this.bottom = new Patch(this.scene, 3, // degree on U: 2 control vertexes U
					 // degree on V: 2 control vertexes on V
					20, // knots for U
					20, // knots for V
					[	// U = 0
						[ // V = 0..3;
							 [ -0.650, 0.650, 0.0, 1 ],
							 [ -1.0, 0.333, 0.0, 1 ],
							 [ -1.0, -0.333, 0.0, 1 ],
							 [ -0.650, -0.7, 0.0, 1 ]
						],
						// U = 1
						[ // V = 0..3
							 [ -0.333, 1.0, 0, 1 ],
							 [ -0.25, 0.20, -0.20, 1 ],
							 [ -0.25, -0.15, -0.20, 1 ],
							 [ -0.333, -1.0, 0.0, 1 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 0.333, 1.0, 0.0, 1 ],
							 [ 0.15, 0.15, -0.30, 1 ],
							 [ 0.15, -0.15, 0.30, 1 ],
							 [ 0.333, -1.0, 0.0, 1 ]
						],
						[ // V = 0..3
							 [ 0.65, 0.650, 0.0, 1 ],
							 [ 1.0, 0.333, 0.0, 1 ],
							 [ 1.0, -0.333, 0.0, 1 ],
							 [ 0.65, -0.65, 0.0, 1 ]
						]
						]);

	//glass

	this.sphere = new Sphere(this.scene, 1, 10, 10, 1, 1);




};

Vehicle.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	console.debug(nurbsSurface);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, 10, 10);
	return obj;

};

Vehicle.prototype.display = function(){
	this.scene.pushMatrix();


		this.scene.pushMatrix();
		
		//this.scene.scale(-1,-1,-1);
		//this.scene.rotate(180,0,0,1);
		this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		//this.scene.rotate(-90, 1,0,0);
		//this.scene.scale(-1,-1,-1);
		this.bottom.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		//this.scene.scale(0.5,0.5,0.5);
		//this.sphere.display();
		this.scene.popMatrix();

	this.scene.popMatrix();
};