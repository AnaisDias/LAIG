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

 CircularAnimation.prototype.display = function(){
 	//onde se faz as transformaçoes (mudar para matrizes)
 	
 	this.scene.translate(this.center[0], this.center[1], this.center[2]);
 	//console.log("translate done");
 	this.scene.rotate(degToRad(this.curAngle), 0,1,0);
 	this.scene.translate(this.radius, 0, 0);
 	//this.scene.translate(this.center[0], this.center[1], this.center[2]);
 }

 CircularAnimation.prototype.update = function(currTime){

 	//onde se mudam os parametros
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
 		console.log("curAngle is " + this.curAngle);
 	}
 	else{
 		this.ended = true;
 		this.current = false;
 		this.curAngle = this.rotAngle+this.initAngle;
 	}
 	
 };


 CircularAnimation.prototype.setVelocity = function(){

 	this.velocity = this.rotAngle / (this.time * 1000);

 }
