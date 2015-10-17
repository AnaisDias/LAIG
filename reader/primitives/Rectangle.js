/**
 * Rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

//Rectangle e uma subclasse de CGFobject
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
		0, this.ampFactT/this.lengthT,
		this.ampFactS/this.lengthB, this.ampFactT/this.lengthT,
		0, 0,
		this.ampFactS/this.lengthB, 0
		];

	this.initGLBuffers();
};
