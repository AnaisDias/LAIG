function CircularAnimation(scene, time, center, radius, initAngle, rotAngle) {

 	this.scene = scene;
 	this.time = time;
 	this.center = center; 
 	this.radius = radius;
 	this.initAngle = initAngle;
 	this.rotAngle = rotAngle;
 	this.curAngle=initAngle;
 	this.setVelocity();

};

 CircularAnimation.prototype.constructor = LinearAnimation;

 CircularAnimation.prototype.display = function(){
 	//onde se faz as transformaçoes (mudar para matrizes)
 	this.scene.pushMatrix();
 	this.scene.translate(this.center[0], this.center[1], this.center[2]);
 	this.scene.rotate(degToRad(curAngle), 0,1,0);
 	this.scene.translate(this.radius[0], this.radius[1], this.radius[2]);
 	this.scene.popMatrix();
 }

 CircularAnimation.prototype.update = function(){

 	//onde se mudam os parametros
 	if(!(curAngle>=rotAngle)){
 		curAngle += this.velocity;
 	}
 	
 };


 CircularAnimation.prototype.setVelocity = function(){

 	this.velocity = rotAngle / (this.time * 10);
 }
