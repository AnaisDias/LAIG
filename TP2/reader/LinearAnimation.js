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
 	this.tmatrix = mat4.create();
 	this.firstTime = true;
 	this.angCP = [];
 	this.points = [];
 	this.setVelocityAndTime();
 	this.calculateAngles();

};

 LinearAnimation.prototype.constructor = LinearAnimation;

//FAZER COM QUE O PRIMEIRO CONTROL POINT SEJA (0,0,0) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 /**
 * retorna uma matriz para a transformação a fazer
 */
 LinearAnimation.prototype.update = function(curTime){

 	var matrix = mat4.create();
 	var j = 0;
 	var tx = 0;
 	var ty = 0;
 	var tz = 0;
 	var remainder = 0;
 	//verifica se chegou ao fim da animação
 	if(curTime <= (this.initTime + this.time * 1000)){
 		
	 	//faz a rotação do objeto para o ângulo atual
	 	for(i = 0; i < (this.points.length - 1); i++){
	 		if(curTime > this.points[i] && curTime <= this.points[i+1]){
	 			mat4.rotate(matrix,matrix,this.angCP[i+1],[0,1,0]);
	 			console.log(this.angCP[i+1]);
	 			break;
	 		}
	 	}
	 	for(i = 0; i < (this.controlPoints.length - 1); i++){
	 		
	 		
	 			//se for igual ao próximo ponto
	 			if(this.points[i+1] == curTime){

	 				tx = this.controlPoints[i+1].x;
		 			ty = this.controlPoints[i+1].y;
		 			tz = this.controlPoints[i+1].z;
		 			mat4.translate(matrix,matrix,[tx,ty,tz]);

		 			this.tmatrix = matrix;
		 			console.log(i+1);
	 				return;

		 		}
		 		//se o ponto estiver dentro deste controlPoint
		 		else if(this.points[i] < curTime && this.points[i+1] > curTime){

		 			remainder = (curTime-this.points[i])/(this.points[i+1]-points[i]) ;

		 			tx = this.controlPoints[i+1].x * remainder;
	 				ty = this.controlPoints[i+1].y * remainder;
	 				tz = this.controlPoints[i+1].z * remainder;
	 				mat4.translate(matrix,matrix,[tx,ty,tz]);

	 				this.tmatrix = matrix;
	 				console.log(i+1);
	 				return;

				}

	 			

	 		//se nenhum dos ifs retornar significa que esta translação tem de ser feita sempre...
		 	tx = this.controlPoints[i+1].x;
	 		ty = this.controlPoints[i+1].y;
	 		tz = this.controlPoints[i+1].z;
	 		mat4.translate(matrix,matrix,[tx,ty,tz]);

	 	}
	 		
	 }



	console.log(i+1);
	this.tmatrix = matrix; 	
 	
 };

 LinearAnimation.prototype.display = function(){
 	if(this.firstTime){
 		this.firstTime = false;
 	}
 	else
 		if(this.matrix != null)
 			this.scene.multMatrix(this.matrix);
 	
 };

 LinearAnimation.prototype.calculateAngles = function(){

 	this.angCP[0] = 0;
 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		var difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		var difz = this.controlPoints[i+1].z - this.controlPoints[i].z;

 		this.angCP[i+1] = Math.acos(difx/(Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2))));

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

 		difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		difz = this.controlPoints[i+1].z - this.controlPoints[i].z;
 		dify = this.controlPoints[i+1].y - this.controlPoints[i].y;

 		difxz += Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		dist += Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 	}

 	this.velocity = dist / (this.time * 10);
 	this.points[0] = this.initTime;

 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		difz = this.controlPoints[i+1].z - this.controlPoints[i].z;
 		dify = this.controlPoints[i+1].y - this.controlPoints[i].y;

 		difxz += Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		curDist = Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 		var x = curDist/dist;
 		this.points[i+1] = this.initTime + this.time * 1000 * x;

 		console.log("Added point " + this.points[i+1]);
  	}

 };

 /*LinearAnimation.prototype.setPoints = function(){
	
	var dist = 0;
	var j = 0;
	var curDistance = 0;

	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		var difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		var difz = this.controlPoints[i+1].z - this.controlPoints[i].z;
 		var dify = this.controlPoints[i+1].y - this.controlPoints[i].y;

 		var difxz += Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2));
 		
 		dist = Math.sqrt(Math.pow(difxz,2)+Math.pow(dify,2));

 		//verifica se existe distancia de pontos de controlo anteriores
 		if (curDistance > 0){
 			if(curDistance <= dist){
	 			this.points[j] = i + curDistance/dist;
	 			j++;
	 		} 
	 	}

 		if ((dist-curDistance) == this.velocity){
 			this.points[j] = i+1;
 			j++;
 			curDistance = 0;
 		}
 		else if ((dist-curDistance) > this.velocity){
 			curDistance += this.velocity;
 			while(curDistance < dist){
 				this.points[j] = i + curDistance/dist;
 				j++;
 				curDistance += this.velocity;
 			}
 			if(curDistance == dist){
 				this.points[j] = i + 1;
 				j++;
 				curDistance = 0;
 			}
 			else curDistance = curDistance - dist;
 		}
 		else if ((dist-curDistance) < this.velocity){

	 		if(curDistance > dist){
	 			curDistance = curDistance - dist;
	 		}
 			else curDistance = this.velocity-(dist-curDistance);
 		}

 	}

 }*/