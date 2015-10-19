function Triangle(scene, tx1, ty1, tz1, tx2, ty2, tz2, tx3, ty3, tz3, ampFactS, ampFactT) {
	CGFobject.call(this,scene);

    this.tx1 = tx1;
    this.ty1 = ty1;
    this.tz1 = tz1;

    this.tx2 = tx2;
    this.ty2 = ty2;
    this.tz2 = tz2;

    this.tx3 = tx3;
    this.ty3 = ty3;
    this.tz3 = tz3;

    this.ampFactS=ampFactS;
    this.ampFactT=ampFactT;

    this.lenAC = Math.sqrt((this.tx3 - this.tx1) * (this.tx3 - this.tx1) 
        + (this.ty3 - this.ty1) * (this.ty3 - this.ty1) + (this.tz3 - this.tz1) * (this.tz3 - this.tz1));
    this.lenAB = Math.sqrt((this.tx2 - this.tx1) * (this.tx2 - this.tx1) 
        + (this.ty2 - this.ty1) * (this.ty2 - this.ty1) + (this.tz2 - this.tz1) * (this.tz2 - this.tz1));
    this.lenBC = Math.sqrt((this.tx3 - this.tx2) * (this.tx3 - this.tx2) 
        + (this.ty3 - this.ty2) * (this.ty3 - this.ty2) + (this.tz3 - this.tz2) * (this.tz3 - this.tz2));
    this.cos = (this.lenAC * this.lenAC - this.lenBC * this.lenBC + this.lenAB * this.lenAB) / (2 * this.lenAC * this.lenBC);
    this.sin = Math.sqrt(1 - this.cos * this.cos);

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {
	this.vertices = [
            this.tx1, this.ty1, this.tz1,
            this.tx2, this.ty2, this.tz2,
            this.tx3, this.ty3, this.tz3 ];

	this.indices = [
            0, 1, 2 ];

    this.normals = [
    		 0, 0, 1,
             0, 0, 1,
             0, 0, 1];


	this.texCoords = [
                0, 0,
			 this.lenAB/this.ampFactS, 0,
             (this.lenAB - this.lenBC * this.cos)/this.ampFactS, (this.lenAC * this.sin)/this.ampFactT ];




	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Triangle.prototype.changeTextureAmplif = function(s, t){
    this.texCoords = [
             0, 0,
             this.lenAB/s, 0,
             (this.lenAB - this.lenBC * this.cos)/s, (this.lenAC * this.sin)/t ];
};