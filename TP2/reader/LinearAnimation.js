/**
 * Cylinder
 * @constructor
 */
 function LinearAnimation(scene, time, controlPoints) {

 	this.scene = scene;
 	this.time = time;
 	this.controlPoints = controlPoints; 
 	this.curPoint= 0;
 	this.initTime = Date.now();
 	this.tx = 0;
 	this.ty = 0;
 	this.tz = 0;
 	this.firstTime = true;
 	this.angCP = [];
 	this.angNow = 0;
 	this.points = [];
 	this.setVelocityAndTime();
 	this.calculateAngles();

};

 LinearAnimation.prototype.constructor = LinearAnimation;


 LinearAnimation.prototype.update = function(curTime){

 	var matrix = mat4.create();
 	var j = 0;
 	
 	var remainder = 0;

 	//console.log("curTime = " + (curTime - this.initTime) / 1000);
 	//verifica se chegou ao fim da animação
 	if(curTime <= (this.initTime + this.time * 1000)){
 		this.tx = 0;
 		this.ty = 0;
 		this.tz = 0;
 		
	 	//faz a rotação do objeto para o ângulo atual
	 	for(i = 0; i < (this.points.length - 1); i++){
	 		if(curTime > this.points[i] && curTime <= this.points[i+1]){
	 			this.angNow = this.angCP[i+1];
	 			//console.log("new angle: " + this.angCP[i+1]);
	 			break;
	 		}
	 	}
	 	for(i = 0; i < (this.controlPoints.length - 1); i++){
	 		
	 		
	 			//se for igual ao próximo ponto
	 			if(this.points[i+1] == curTime){

	 				this.tx += this.controlPoints[i+1][0];
		 			this.ty += this.controlPoints[i+1][1];
		 			this.tz += this.controlPoints[i+1][2];

	 				return;

		 		}
		 		//se o ponto estiver dentro deste controlPoint
		 		else if(this.points[i] < curTime && this.points[i+1] > curTime){

		 			remainder = (curTime-this.points[i])/(this.points[i+1]-this.points[i]) ;
		 			//console.log("remainder " + (i+1) +" is: "+ remainder);

		 			this.tx += this.controlPoints[i+1][0] * remainder;
	 				this.ty += this.controlPoints[i+1][1] * remainder;
	 				this.tz += this.controlPoints[i+1][2] * remainder;

	 				return;

				}

	 			

	 		//se nenhum dos ifs retornar significa que esta translação tem de ser feita sempre...
		 	this.tx += this.controlPoints[i+1][0];
	 		this.ty += this.controlPoints[i+1][1];
	 		this.tz += this.controlPoints[i+1][2];
	 		
	 	}
	 		
	 }


	//console.log(i+1);
	this.tmatrix = matrix; 	

 };

 LinearAnimation.prototype.display = function(){
 	
 	this.scene.translate(this.tx, this.ty, this.tz);
 	this.scene.rotate(this.angNow,0,1,0);
 	/*console.log("tx " + this.tx);
	console.log("ty " + this.ty);
	console.log("tz " + this.tz);*/

 };

 LinearAnimation.prototype.calculateAngles = function(){

 	this.angCP[0] = 0;
 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		difx = this.controlPoints[i+1][0];
 		difz = this.controlPoints[i+1][2];

 		this.angCP[i+1] = Math.asin(difx/Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2)));

 	}

 };

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

 		/*console.log("difx " + difx);
 		console.log("difz " + difz);
 		console.log("dify " + dify);*/

 		difxz = Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		curDist += Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 		/*console.log("curDist " + curDist);
 		console.log("difxz " + difxz);*/
 		var x = curDist/dist;
 		//console.log("x = " + x);
 		this.points[i+1] = this.initTime + this.time * 1000 * x;

 		//console.log("Added point " + this.points[i+1]);
  	}

 };

