/**
* Closed cylinder CGFobject object
* 
* @constructor
* @param scene 		Scene object will be drawn on
* @param slices		Number of slices of cylinder
* @param stacks		Number of stacks of cylinder
* @param topradius 	Radius of cylinder top
* @param botradius 	Radius of cylinder bottom
*/
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

/**
* Draws closed cylinder object in the scene
*/
ClosedCylinder.prototype.display = function(){
	this.scene.pushMatrix();
		this.top.display();
		this.scene.scale(1,1,this.height);
		this.cyl.display();
		this.bottom.display();
	this.scene.popMatrix();
};