var Player = {
    currentKeyboard : {
        w : false, //87
        a : false, //65
        s : false, //83
        d : false  //68
    },
    rotation : {
        x : 0,
        y : 0,
        z : 0
    },
    position :  {
        x : 0,
        y : 0,
        z : 0
    },
    speed : 0.08,
    turnSpeedFactor : 0.1,
    joggingFactor : 0.25,
    joggingScale : 0.05,
    joggingAngle : 0,
    init : function(x, y) {
        var self = this;
        this.laser = new Entity({
            modelFile : "laser.js",
            position : Player.position,
            ignoreLighting : true,
            invisible : true,
            tick : function() {
                this.rotation.y = -Player.rotation.y + 180;
            }
        });
		this.position.x = x;
		this.position.z = y;
        Graphics.root.move(0, -0.3, 0);
        Game.addTickHandler(function() {
			var oldPosition = {
				x : Player.position.x,
				y : Player.position.y,
				z : Player.position.z,
			};
            if(Player.currentKeyboard.w) {
                Player.position.z -= Math.cos(-degToRad(Player.rotation.y)) * Player.speed;
                Player.position.x -= Math.sin(-degToRad(Player.rotation.y)) * Player.speed;
            }
            if(Player.currentKeyboard.a) {
                Player.position.z -= Math.cos(-degToRad(Player.rotation.y - 90)) * Player.speed;
                Player.position.x -= Math.sin(-degToRad(Player.rotation.y - 90)) * Player.speed;
            }
            if(Player.currentKeyboard.s) {
                Player.position.z += Math.cos(-degToRad(Player.rotation.y)) * Player.speed;
                Player.position.x += Math.sin(-degToRad(Player.rotation.y)) * Player.speed;
            }
            if(Player.currentKeyboard.d){
                Player.position.z -= Math.cos(-degToRad(Player.rotation.y + 90)) * Player.speed;
                Player.position.x -= Math.sin(-degToRad(Player.rotation.y + 90)) * Player.speed;
            }
            if(Player.currentKeyboard.w || Player.currentKeyboard.a || Player.currentKeyboard.s || Player.currentKeyboard.d) {
                Player.position.y = Math.sin(Player.joggingAngle += Player.joggingFactor) * Player.joggingScale;
            }
			while(!Game.validatePosition(Player.position, oldPosition));
        });
        $(document).keydown(function(e) {
            if(e.which == 87) Player.currentKeyboard.w = true;
            if(e.which == 65) Player.currentKeyboard.a = true;
            if(e.which == 83) Player.currentKeyboard.s = true;
            if(e.which == 68) Player.currentKeyboard.d = true;
        });
        $(document).keyup(function(e) {
            if(e.which == 87) Player.currentKeyboard.w = false;
            if(e.which == 65) Player.currentKeyboard.a = false;
            if(e.which == 83) Player.currentKeyboard.s = false;
            if(e.which == 68) Player.currentKeyboard.d = false;
        });
        document.addEventListener("mouseup", function(e) {
            self.laser.invisible = true;
            self.firing = false;
        });
        document.addEventListener("mousedown", function(e) {
            self.laser.invisible = false;
            self.firing = true;
        });
        document.addEventListener("mousemove", function(e) {
			if(!isPointerLocked()) return;
            var x = e.movementX || e.webkitMovementX || e.mozMovementX || 0;
            var y = e.movementY || e.webkitMovementY || e.mozMovementY || 0;
            Player.rotation.x += y*Player.turnSpeedFactor;
            Player.rotation.y += x*Player.turnSpeedFactor;
        });
    }
}
