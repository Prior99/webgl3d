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
    joggingScale : 0.02,
    joggingAngle : 0,
    init : function() {
        Graphics.root.move(0, -0.3, 0);
        Game.addTickHandler(function() {
            if(Player.currentKeyboard.w) {
                Player.position.z += Math.cos(-degToRad(Player.rotation.y)) * Player.speed;
                Player.position.x += Math.sin(-degToRad(Player.rotation.y)) * Player.speed;
            }
            if(Player.currentKeyboard.a) {
                Player.position.z += Math.cos(-degToRad(Player.rotation.y - 90)) * Player.speed;
                Player.position.x += Math.sin(-degToRad(Player.rotation.y - 90)) * Player.speed;
            }
            if(Player.currentKeyboard.s) {
                Player.position.z -= Math.cos(-degToRad(Player.rotation.y)) * Player.speed;
                Player.position.x -= Math.sin(-degToRad(Player.rotation.y)) * Player.speed;
            }
            if(Player.currentKeyboard.d){
                Player.position.z += Math.cos(-degToRad(Player.rotation.y + 90)) * Player.speed;
                Player.position.x += Math.sin(-degToRad(Player.rotation.y + 90)) * Player.speed;
            }
            if(Player.currentKeyboard.w || Player.currentKeyboard.a || Player.currentKeyboard.s || Player.currentKeyboard.d) {
                Player.position.y = Math.sin(Player.joggingAngle += Player.joggingFactor) * Player.joggingScale;
            }
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
        document.addEventListener("mousemove", function(e) {
			if(!isPointerLocked()) return;
            var x = e.movementX || e.webkitMovementX || e.mozMovementX || 0;
            var y = e.movementY || e.webkitMovementY || e.mozMovementY || 0;
            Player.rotation.x += y*Player.turnSpeedFactor;
            Player.rotation.y += x*Player.turnSpeedFactor;
        });
    }
}
