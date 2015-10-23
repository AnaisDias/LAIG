/**
 * Cylinder
 * @constructor
 */
 function LinearAnimation(scene, time, controlPoints) {

 	this.scene = scene;
 	this.time = time;
 	this.controlPoints = controlPoints; 
 	this.timenow = 0;
 	this.angCP = [];
 	this.setVelocity();
 	this.calculateAngles();

};

 LinearAnimation.prototype.constructor = LinearAnimation;


 LinearAnimation.prototype.animate = function(){

 	var matrix;

 	return matrix;
 };

 LinearAnimation.prototype.calculateAngles = function(){

 	this.angCP[0] = 0;
 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		var difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		var difz = this.controlPoints[i+1].z - this.controlPoints[i].z;

 		this.angCP[i+1] = acos(difx/(Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2)));

 	}

 };

 LinearAnimation.prototype.setVelocity = function(){

 	var dist = 0;

 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		var difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		var difz = this.controlPoints[i+1].z - this.controlPoints[i].z;
 		var dify = this.controlPoints[i+1].y - this.controlPoints[i].y;

 		difxz += Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		dist += Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 	}

 	this.velocity = dist / (this.time / 10);
 }