function TextInterface(scene, deltaX, deltaY, type) {
    CGFobject.call(this,scene);

    this.deltaX = deltaX;
    this.deltaY = deltaY;

    this.type = type;

    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.appearance.setShininess(120);

    // font texture: 16 x 16 characters
    // http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
    this.fontTexture = new CGFtexture(this.scene, "scenes/textures/oolite-font.png");
    this.appearance.setTexture(this.fontTexture);

    this.plane= new TextPlane(this.scene);

    this.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");

    this.textShader.setUniformsValues({'dims': [16, 16]});

    this.title = 'Neutron';
    if(this.type=="start"){
        this.button = 'Start game';
    }

    else if(this.type == "end"){
        this.text = 'Player ' + this.scene.winner + ' wins!';
        this.button = 'Replay game';
        this.button1 = 'Watch Replay';
    }

    else if(this.type == "diff"){
        this.button1 = 'Random Machine';
        this.button2 = 'Intelligent Machine';
    }

    else if(this.type == "mode"){
        this.button1 = 'Human vs Human';
        this.button2 = 'Human vs Machine';
        this.button3 = 'Machine vs Human';
        this.button4 = 'Machine vs Machine';

    }

    else if(this.type == "undo"){
        this.button = 'Undo';
    }

    else if(this.type == "reset"){
        this.button = 'Reset';
    }
    this.ptext = 'Player ';
    this.p1wins = 0;
    this.p2wins = 0;
    this.currentPlayer = "1";

    this.result1 = undefined;
    this.result2 = undefined;
};

TextInterface.prototype = Object.create(CGFobject.prototype);

TextInterface.prototype.constructor=TextInterface;

TextInterface.prototype.getLocation = function (letter) {
    var line;
    var column;

   if(letter == '-'){
        line = 2;
        column = 13;
    }else if(letter == ':'){
        line = 3;
        column = 10;
    }else if(letter >= '0' && letter <= '9'){
        line = 3;
        column = parseInt(letter);
    }else if(letter >= 'A' && letter <= 'O'){
        line = 4;
        column = 1 + letter.charCodeAt(0) - 'A'.charCodeAt(0);
    }else if(letter >= 'P' && letter <= 'Z'){
        line = 5;
        column = letter.charCodeAt(0) - 'P'.charCodeAt(0);
    }else if(letter >= 'a' && letter <= 'o'){
        line = 6;
        column = 1 + letter.charCodeAt(0) - 'a'.charCodeAt(0);
    }else if(letter >= 'p' && letter <= 'z'){
        line = 7;
        column = letter.charCodeAt(0) - 'p'.charCodeAt(0);
    }else{
        line = 2;
        column = 0;
    }

    return [column, line];
};

TextInterface.prototype.showString = function (text, id) {

    this.scene.pushMatrix();

    for(var i = 0 ; i < text.length ; i++){

      this.scene.activeShader.setUniformsValues({'charCoords': this.getLocation(text[i])});
      this.plane.display();

      this.scene.translate(0.8,0,0);
    }

    this.scene.popMatrix();
};

TextInterface.prototype.display = function () {
    this.scene.setActiveShaderSimple(this.textShader);

    this.appearance.apply();

    this.scene.pushMatrix();
        if(this.type=="start"){
            this.showString(this.title);
            this.scene.registerForPick(50,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button);
        }
        else if(this.type == "end"){
            this.scene.clearPickRegistration();
            this.showString('P1 Wins: ' + this.p1wins);
            this.scene.translate(0,-1,0);
            this.showString('P2 Wins: ' + this.p2wins);
            this.scene.translate(0,-1,0);
            this.showString(this.title);
            this.scene.translate(0,-1,0);
            this.showString('Player '+ this.scene.winner + ' wins');
            this.scene.registerForPick(51,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button);
            this.scene.registerForPick(59,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button1);
        }
        else if(this.type == "diff"){
            this.showString(this.title);
            this.scene.translate(0,-1,0);
            this.showString('Pick difficulty level');
            this.scene.registerForPick(52,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button1);
            this.scene.registerForPick(53,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button2);
        }
        else if(this.type == "mode"){
            this.showString(this.title);
            this.scene.translate(0,-1,0);
            this.showString('Pick game mode');
            this.scene.registerForPick(54,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button1);
            this.scene.registerForPick(55,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button2);
            this.scene.registerForPick(65,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button3);
            this.scene.registerForPick(56,this.plane);
            this.scene.translate(0,-1,0);
            this.showString(this.button4);

        }

        else if(this.type == "undo"){
            this.scene.registerForPick(57,this.plane);
            this.showString(this.button);
        }

        else if(this.type == "reset"){
            this.scene.registerForPick(58,this.plane);
            this.showString(this.button);
        }
        else if(this.type == "info"){
            this.scene.clearPickRegistration();
            this.showString(this.ptext + this.currentPlayer);
            this.scene.translate(0,-3,0);
            this.showString('P1:' + this.p1wins);
            this.scene.translate(0,-1,0);
            this.showString('P2:' + this.p2wins);
        }
            


    this.scene.popMatrix();

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
};