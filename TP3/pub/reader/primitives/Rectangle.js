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
function Rectangle(scene, ltx, lty, rbx, rby, ampFactS, ampFactT) {

	CGFobject.call(this,scene);
	
	this.ltx = ltx;
	this.lty = lty;
	this.rbx = rbx;
	this.rby = rby;

	if(this.rbx < 0) {	this.lengthB = -rbx - ltx;}
	else{ this.lengthB = rbx - ltx;}
	if(this.lty < 0) {  this.lengthT = -lty - ltx;}
	else{ this.lengthT = lty - ltx;}

	this.ampFactS = ampFactS;
	this.ampFactT = ampFactT;

	this.initBuffers();
};


Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

/**
* Initializes rectangle buffers
*/
Rectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.ltx, this.rby, 0,
            this.rbx, this.rby, 0,
            this.ltx, this.lty, 0,
            this.rbx, this.lty, 0
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1,
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;

    this.normals = [
    		 0, 0, 1,
             0, 0, 1,
             0, 0, 1,
             0, 0, 1 
        ];

    this.texCoords = [    
    	0, this.lengthT/this.ampFactT,
    	this.lengthB/this.ampFactS,this.lengthT/this.ampFactT,
    	0, 0,
    	this.lengthB/this.ampFactS, 0
		];

	this.initGLBuffers();
};

/**
 * Changes rectangle's texture amplification coordenates
 * @param {float} s - S coordenate
 * @param {float} t - T coordenate
 */
Rectangle.prototype.changeTextureAmplif = function(s,t){
	this.texCoords = [    
		0, this.lengthT/t,
		this.lengthB/s,this.lengthT/t,
		0, 0,
		this.lengthB/s, 0
		];
};
