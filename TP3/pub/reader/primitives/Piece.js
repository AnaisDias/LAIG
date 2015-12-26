/**
 * Vehicle Vehicle object
 * @constructor
 * @param {CGFscene} scene - Scene to change 
 */
function Piece(scene) {
   	CGFnurbsObject.call(this,scene);
   	this.top = null;
    this.surfaces = [];
    this.init();

}

Piece.prototype = Object.create(CGFnurbsObject.prototype);
Piece.prototype.constructor = Piece;

/**
 * Initializes objects that be used in the display function
 */
Piece.prototype.init = function () {

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


};

/**
 * Draws the Vehicle object in the scene
 */
Piece.prototype.display = function(){
	this.scene.pushMatrix();


		this.scene.pushMatrix();
		this.scene.rotate(180*Math.PI/180,1,0,0);
		this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.top.display();
		this.scene.popMatrix();


	this.scene.popMatrix();
};