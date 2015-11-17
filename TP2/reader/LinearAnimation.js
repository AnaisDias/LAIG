/**
 * Linear Animation
 * @constructor
 * @param {CGFscene} scene - Scene to change 
 * @param {int} time - Time it will take to do the whole animation
 * @param {array} controlPoints - Control points of the animation
 */
 function LinearAnimation(scene, time, controlPoints) {

 	this.scene = scene;
 	this.time = time;
 	this.controlPoints = controlPoints;
 	this.initTime = Date.now();
 	this.tx = 0;
 	this.ty = 0;
 	this.tz = 0;
 	this.firstTime = true;
 	this.angCP = [];
 	this.angNow = 0;
 	this.points = [];
 	this.ended = false;
 	this.current = false;
 	this.calculateAngles();

};

 LinearAnimation.prototype.constructor = LinearAnimation;

/**
 * Updates the current position of the transformation
 * @param {int} curTime - Current time in milliseconds 
 */
 LinearAnimation.prototype.update = function(curTime){

 	var remainder = 0;

 	if(this.firstTime){
 		this.firstTime = false;
 		this.initTime = curTime;
 		this.setVelocityAndTime();
 	}

 	if(curTime <= (this.initTime + this.time * 1000)){

 		this.tx = 0;
 		this.ty = 0;
 		this.tz = 0;
 		
	 	for(i = 0; i < (this.points.length - 1); i++){

	 		if(curTime > this.points[i] && curTime <= this.points[i+1]){
	 			this.angNow = this.angCP[i+1];
	 			break;
	 		}

	 	}
	 	for(i = 0; i < (this.controlPoints.length - 1); i++){
	 		
	 		
	 			if(this.points[i+1] == curTime){

	 				this.tx += this.controlPoints[i+1][0];
		 			this.ty += this.controlPoints[i+1][1];
		 			this.tz += this.controlPoints[i+1][2];

	 				return;

		 		}
		 		else if(this.points[i] < curTime && this.points[i+1] > curTime){

		 			remainder = (curTime-this.points[i])/(this.points[i+1]-this.points[i]) ;

		 			this.tx += this.controlPoints[i+1][0] * remainder;
	 				this.ty += this.controlPoints[i+1][1] * remainder;
	 				this.tz += this.controlPoints[i+1][2] * remainder;

	 				return;

				}

		 	this.tx += this.controlPoints[i+1][0];
	 		this.ty += this.controlPoints[i+1][1];
	 		this.tz += this.controlPoints[i+1][2];


	 		
	 	}
	 		
	 }

	 else{
	 	this.ended = true;
	 	this.current = false;
	 	this.tx = 0;
	 	this.ty = 0;
	 	this.tz = 0;

	 	for(i = 0; i < (this.controlPoints.length - 1); i++){
			this.tx += this.controlPoints[i+1][0];
	 		this.ty += this.controlPoints[i+1][1];
	 		this.tz += this.controlPoints[i+1][2];
	 		
	 	}
	 }
	 if(!this.ended){
		 this.tx = 0;
		 this.ty = 0;
		 this.tz = 0;
	}

 };

/**
 * Applies linear animation to scene/object
 */
 LinearAnimation.prototype.display = function(){
 	
 	this.scene.translate(this.tx, this.ty, this.tz);
 	if(this.angNow != 361){
 		this.scene.rotate(this.angNow,0,1,0);
 	}

 };

/**
 * Calculates angles to be used by the animation
 */
 LinearAnimation.prototype.calculateAngles = function(){

 	this.angCP[0] = 0;
 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		difx = this.controlPoints[i+1][0];
 		difz = this.controlPoints[i+1][2];
 		if(difx != 0 || difz != 0){
 			this.angCP[i+1] = Math.asin(difx/Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2)));
 		}
 		else this.angCP[i+1] = 361*Math.PI/180;

 	}

 };

/**
 * Calculates velocity and time at which the animation will pass in each control point
 */
 LinearAnimation.prototype.setVelocityAndTime = function(){

 	var dist = 0;
 	var curDist = 0;
 	var difx = 0;
 	var difz = 0;
 	var dify = 0;
 	var difxz = 0;

 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		difx = this.controlPoints[i+1][0];
 		difz = this.controlPoints[i+1][2];
 		dify = this.controlPoints[i+1][1];

 		difxz = Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		dist += Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 	}

 	this.velocity = dist / (this.time * 10);
 	this.points[0] = this.initTime;

 	for(i = 0; i < (this.controlPoints.length - 1); i++){
 		
 		difx = this.controlPoints[i+1][0];
 		difz = this.controlPoints[i+1][2];
 		dify = this.controlPoints[i+1][1];

 		difxz = Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		curDist += Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 		var x = curDist/dist;
 		
 		this.points[i+1] = this.initTime + this.time * 1000 * x;

  	}

 };

