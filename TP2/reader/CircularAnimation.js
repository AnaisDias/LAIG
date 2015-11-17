/**
* Circular animation
* 
* @constructor
* @param scene {CGFscene} - Scene object will be drawn on
* @param time {int} - Order of surface, can be 1, 2 or 3
* @param center {Array} - Parts in U
* @param radius {int} - Parts in V
* @param initAngle {int} - Angle in which the animation starts
* @param rotAngle {int} - Total angle of rotation of animation
*/
function CircularAnimation(scene, time, center, radius, initAngle, rotAngle) {

 	this.scene = scene;
 	this.time = time;
 	this.center = center; 
 	this.radius = radius;
 	this.initAngle = initAngle;
 	this.rotAngle = rotAngle;
 	this.curAngle=initAngle;
 	this.initTime = Date.now();
 	this.curTime = Date.now();
 	this.firstTime = true;
 	this.ended = false;
 	this.current = false;
 	this.setVelocity();

};

 CircularAnimation.prototype.constructor = CircularAnimation;

/**
* Applies circular animation to scene/object
*/
 CircularAnimation.prototype.display = function(){
 	
 	this.scene.translate(this.center[0], this.center[1], this.center[2]);
 	this.scene.rotate(degToRad(this.curAngle), 0,1,0);
 	this.scene.translate(this.radius, 0, 0);
 }

/**
* Updates angle of circular animation as time progresses
*
* @param currTime {int} - Current time in milliseconds
*/
 CircularAnimation.prototype.update = function(currTime){

 	if(this.curAngle<(this.rotAngle+this.initAngle)){
 		if(this.firstTime){
 			this.firstTime = false;
 			this.initTime = currTime;
 			this.curTime = currTime;
 		}
 		else{
 			this.curTime=currTime;
 		}
 		this.curAngle = this.initAngle + this.velocity*(this.curTime-this.initTime);
 	}
 	else{
 		this.ended = true;
 		this.current = false;
 		this.curAngle = this.rotAngle+this.initAngle;
 	}
 	
 };

/**
* Calculates velocity of animation
*/
 CircularAnimation.prototype.setVelocity = function(){

 	this.velocity = this.rotAngle / (this.time * 1000);

 }
