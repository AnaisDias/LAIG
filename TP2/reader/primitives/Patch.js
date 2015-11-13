function Patch(scene, order, partsU, partsV, controlPoints) {
   	CGFnurbsObject.call(this,scene);
    this.partsU = partsU;
    this.partsV = partsV;
    this.order = order;
    this.controlPoints = controlPoints;
    this.obj = null;
    console.debug(this);
    this.init();

}

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.init = function () {

	if(this.order == 1){
		this.knotsU = [0,0,1,1];

	}
	else if(this.order == 2){
		this.knotsU = [0,0,0,1,1,1];
	}
	else if(this.order == 3){
		this.knotsU = [0,0,0,0,1,1,1,1];
	}
	this.knotsV = this.knotsU;

	this.surface = this.makeSurface(this.order, // degree on U: 2 control vertexes U
					 this.order, // degree on V: 2 control vertexes on V
					this.knotsU, // knots for U
					this.knotsV, // knots for V
					this.controlPoints);


};

Patch.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
	this.obj = obj;

};

Patch.prototype.display = function(){
	this.obj.display();
}