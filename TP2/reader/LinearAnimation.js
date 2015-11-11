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
 	if(curTime <= (this.initTime + this.time * 1000){
 		
	 	//faz a rotação do objeto para o ângulo atual
	 	for(i = 0; i < (this.points.length - 1); i++){
	 		if(curTime > this.points[i] && curTime <= this.points[i+1]){
	 			mat4.rotate(matrix,matrix,this.angCP[i+1],[0,1,0]);
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
	 				return;

				}

	 				/*// se o ponto anterior pertencer a um ponto de translação anterior
	 				if(this.points[this.curPoint-1] < i){
	 					//verifica se o ponto pertence a um ponto de translação ainda mais antigo
	 					j = i-1;
	 					while(this.points[this.curPoint-1] < j){
	 						tx = this.controlPoints[j+1].x;
	 						ty = this.controlPoints[j+1].y;
	 						tz = this.controlPoints[j+1].z;
	 						mat4.translate(matrix,matrix,[tx,ty,tz]);
	 						j--;
	 					}
	 					//calcula quanta percentagem falta
	 					remainder = 1-(this.point[this.curPoint-1] % j);

	 					tx = this.controlPoints[j+1].x * remainder;
	 					ty = this.controlPoints[j+1].y * remainder;
	 					tz = this.controlPoints[j+1].z * remainder;
	 					mat4.translate(matrix,matrix,[tx,ty,tz]);


		 				tx = this.controlPoints[i+1].x;
		 				ty = this.controlPoints[i+1].y;
		 				tz = this.controlPoints[i+1].z;
		 				mat4.translate(matrix,matrix,[tx,ty,tz]);

		 				this.curPoint++;
		 				return matrix;

	 				}
	 				else{

		 				tx = this.controlPoints[i+1].x;
		 				ty = this.controlPoints[i+1].y;
		 				tz = this.controlPoints[i+1].z;
		 				mat4.translate(matrix,matrix,[tx,ty,tz]);

		 				this.curPoint++;
	 					return matrix;

	 				}

		 		}

		 		//se o ponto estiver dentro deste controlPoint
		 		else if(this.points[this.curPoint] > i && this.points[this.curPoint] < (i+1)){
		 			// se o ponto anterior pertencer a um ponto de translação anterior
	 				if(this.points[this.curPoint-1] < i){
	 					//verifica se o ponto pertence a um ponto de translação ainda mais antigo
	 					j = i-1;
	 					while(this.points[this.curPoint-1] < j){
	 						tx = this.controlPoints[j+1].x;
	 						ty = this.controlPoints[j+1].y;
	 						tz = this.controlPoints[j+1].z;
	 						mat4.translate(matrix,matrix,[tx,ty,tz]);
	 						j--;
	 					}
	 					//calcula quanta percentagem falta
	 					remainder = 1-(this.point[this.curPoint-1] % j);

	 					tx = this.controlPoints[j+1].x * remainder;
	 					ty = this.controlPoints[j+1].y * remainder;
	 					tz = this.controlPoints[j+1].z * remainder;
	 					mat4.translate(matrix,matrix,[tx,ty,tz]);

	 					//calcula a percentagem que falta para o ponto atual
		 				remainder = this.point[this.curPoint] % i;

		 				tx = this.controlPoints[i+1].x * remainder;
	 					ty = this.controlPoints[i+1].y * remainder;
	 					tz = this.controlPoints[i+1].z * remainder;
		 				mat4.translate(matrix,matrix,[tx,ty,tz]);

		 				this.curPoint++;
		 				return matrix;

	 				}
	 				else{

	 					//calcula a percentagem que falta para o ponto atual
	 					remainder = this.point[this.curPoint] % i;

		 				tx = this.controlPoints[i+1].x * remainder;
	 					ty = this.controlPoints[i+1].y * remainder;
	 					tz = this.controlPoints[i+1].z * remainder;
	 					mat4.translate(matrix,matrix,[tx,ty,tz]);

		 				this.curPoint++;
	 					return matrix;

	 				}

		 		}


	 		}
	 		else{
				//se for igual ao próximo ponto
	 			if(this.points[this.curPoint] == (i+1)){
	 				
					tx = this.controlPoints[i+1].x;
					ty = this.controlPoints[i+1].y;
					tz = this.controlPoints[i+1].z;
					mat4.translate(matrix,matrix,[tx,ty,tz]);

					this.curPoint++;
					return matrix;

	 				

		 		}
		 		//se o ponto estiver dentro deste controlPoint
		 		else if(this.points[this.curPoint] > i && this.points[this.curPoint] < (i+1)){

					//calcula a percentagem que falta para o ponto atual
					remainder = this.point[this.curPoint] % i;

					tx = this.controlPoints[i+1].x * remainder;
					ty = this.controlPoints[i+1].y * remainder;
					tz = this.controlPoints[i+1].z * remainder;
					mat4.translate(matrix,matrix,[tx,ty,tz]);

					this.curPoint++;
					return matrix;

	 				
		 		}
	 		}*/

	 		//se nenhum dos ifs retornar significa que esta translação tem de ser feita sempre...
		 	tx = this.controlPoints[i+1].x;
	 		ty = this.controlPoints[i+1].y;
	 		tz = this.controlPoints[i+1].z;
	 		mat4.translate(matrix,matrix,[tx,ty,tz]);
	 		
	 	}

	 	
	 	
	 	this.tmatrix = matrix;
	 	return;

	 }
 	
 };

 LinearAnimation.prototype.display = function(){

 	this.scene.multMatrix(this.matrix);
 	
 }

 LinearAnimation.prototype.calculateAngles = function(){

 	this.angCP[0] = 0;
 	for(i = 0; i < (this.controlPoints.length - 1); i++){

 		var difx = this.controlPoints[i+1].x - this.controlPoints[i].x;
 		var difz = this.controlPoints[i+1].z - this.controlPoints[i].z;

 		this.angCP[i+1] = acos(difx/(Math.sqrt(Math.pow(difx,2)+Math.pow(difz,2)));

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
  	}

 }

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