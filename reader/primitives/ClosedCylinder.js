
function ClosedCylinder(scene, height, slices, stacks, topradius, botradius){
	CGFobject.call(this,scene);
	this.height = height;
	this.cyl = new Cylinder(scene, height, slices, stacks, topradius, botradius);
	this.cyl.initBuffers();

	this.top = new Circle(scene, slices, botradius, topradius, "top");
	this.top.initBuffers();

	this.bottom = new Circle(scene, slices, botradius, topradius, "bot");
	this.bottom.initBuffers();
};

ClosedCylinder.prototype = Object.create(CGFobject.prototype);
ClosedCylinder.prototype.constructor = ClosedCylinder;

ClosedCylinder.prototype.display = function(){
	this.scene.pushMatrix();
		this.top.display();
		this.scene.scale(1,this.height,1);
		this.cyl.display();
		this.bottom.display();
	this.scene.popMatrix();
};