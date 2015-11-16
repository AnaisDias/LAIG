function Vehicle(scene) {
   	CGFnurbsObject.call(this,scene);
   	this.top = null;
   	this.bottom = null;
   	this.sphere = null;
    this.surfaces = [];
    this.init();
    this.mat = new CGFappearance(this.scene);
    this.glassTex = new CGFtexture(this.scene, "scenes/textures/ufowindow.jpg");
    this.mat.setTexture(this.glassTex);

}

Vehicle.prototype = Object.create(CGFnurbsObject.prototype);
Vehicle.prototype.constructor = Vehicle;


Vehicle.prototype.init = function () {

	
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

	this.sphere = new Sphere(this.scene, 1, 10, 10, 1, 1);




};

Vehicle.prototype.display = function(){
	this.scene.pushMatrix();


		this.scene.pushMatrix();
		this.scene.rotate(180*Math.PI/180,1,0,0);
		this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.2,0);
		this.scene.scale(0.8,0.8,0.8);
		this.mat.apply();
		this.sphere.display();
		this.scene.popMatrix();

	this.scene.popMatrix();
};