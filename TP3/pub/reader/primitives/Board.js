/**
 * Triangle CGFobject object
 * @constructor
 * @param {CGFscene} scene - Scene to change 
 * @param {float} ltx - Left top x coordenate
 * @param {float} lty - Left top y coordenate
 * @param {float} rbx - Right bottom x coordenate
 * @param {float} rby - Right bottom y coordenate
 * @param {float} ampFactS - S amplification factor for texture
 * @param {float} ampFactT - T amplification factor for texture
 */
function Board(scene) {

	CGFobject.call(this,scene);

	this.scene = scene;

	this.squares = [];

	this.prepareSquares();
};


Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor=Board;

/**
* Initializes Board buffers
*/
Board.prototype.display = function () {
	for(i = 1; i <= 25; i++){
		this.scene.pushMatrix();
		this.scene.registerForPick(i,this.squares[i]);
		this.scene.translate(this.squares[i].tx, this.squares[i].ty, this.squares[i].tz);
		this.squares[i].display();
		this.scene.popMatrix();

	}
};

/**
 * Changes Board's texture amplification coordenates
 * @param {float} s - S coordenate
 * @param {float} t - T coordenate
 */
Board.prototype.prepareSquares = function(){
	
	for(i = 1; i < 26; i++){
		if(i <= 5){
			this.squares[i] = new Rectangle(this.scene, 0, 2.8, 2.8, 0, 2.8, 2.8);
			this.squares[i].tx = (i-1) * 3; 
			this.squares[i].ty = 0;
			this.squares[i].tz = 0;
		}
		else if(i <= 10){
			this.squares[i] = new Rectangle(this.scene, 0, 2.8, 2.8, 0, 2.8, 2.8)
			this.squares[i].tx = (i - 6) * 3;  //i - 1 - 5
			this.squares[i].ty = 3;
			this.squares[i].tz = 0;
		}
		else if(i <= 15){
			this.squares[i] = new Rectangle(this.scene, 0, 2.8, 2.8, 0, 2.8, 2.8)
			this.squares[i].tx = (i - 11) * 3; 
			this.squares[i].ty = 6;
			this.squares[i].tz = 0;
		}
		else if(i <= 20){
			this.squares[i] = new Rectangle(this.scene, 0, 2.8, 2.8, 0, 2.8, 2.8)
			this.squares[i].tx = (i - 16) * 3; 
			this.squares[i].ty = 9;
			this.squares[i].tz = 0;
		}
		else if(i <= 25){
			this.squares[i] = new Rectangle(this.scene, 0, 2.8, 2.8, 0, 2.8, 2.8)
			this.squares[i].tx = ( i - 21)* 3; 
			this.squares[i].ty = 12;
			this.squares[i].tz = 0;
		}
	}
};
