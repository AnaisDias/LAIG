function Cube(scene) {
	CGFobject.call(this,scene);

	this.rekt = new Rectangle(scene, 0, 1, 0, 1, 1, 1);
	
	this.rekt.initBuffers();
};

Cube.prototype = Object.create(CGFobject.prototype);
Cube.prototype.constructor=Cube;


Cube.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.5);
    this.rekt.display(); 
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(0, 0, 0.5);    
    this.rekt.display(); 
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0)
    this.scene.translate(0, 0, 0.5);
    this.rekt.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.scene.translate(0, 0, 0.5);
    this.rekt.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0, 0, 0.5);
    this.rekt.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    this.scene.translate(0, 0, 0.5);
    this.rekt.display();
    this.scene.popMatrix();
}