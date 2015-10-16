function Triangle(scene, tx1, ty1, tz1, tx2, ty2, tz2, tx3, ty3, tz3) {
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

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {
	this.vertices = [
            tx1, ty1, tz1,
            tx2, ty2, tz2,
            tx3, ty3, tz3 ];

	this.indices = [
            0, 1, 2 ];

    this.normals = [
    		 0, 0, 1,
             0, 0, 1,
             0, 0, 1];


	this.texCoords = [
     		 0, 1,
		 	 1, 1,
			 0, 0,
			 1, 0 ];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};