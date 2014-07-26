var Game = {
    init : function(canvas, map, callback){
        var models = [
            "models/junction_quad.js",
            "models/wall.js",
            "models/corner.js",
            "models/floor.js",
            "models/junction_tri.js",
            "models/concreteblock.js",
        ];
        this.tickHandlers = [];
        setInterval(function() {
            Game.tick();
        }, 1000/60);
        Graphics.init($("canvas")[0], function() {
            console.log("Graphics initialized.");
            Game.loadModels(models, function() {
                  console.log("Models loaded.");
                Game.loadMap(map, function() {
                    Game.generateMap();
					Player.init(Game.startPosition.x, Game.startPosition.y);
                    Graphics.start();
                    console.log("Graphics started.");
                    callback();
                });
            });
        });
    },
	
	validatePosition : function(pos, old) {
		var posInt = {
			x : Math.round(pos.x),
			y : Math.round(pos.z)
		};
		var oldInt = {
			x : Math.round(old.x),
			y : Math.round(old.z)
		};
		if(this.map[posInt.y][posInt.x]) {
			if(this.map[posInt.y][oldInt.x]) pos.z = old.z;
			else if(this.map[oldInt.y][posInt.x]) pos.x = old.x;
			else if(this.map[oldInt.y][oldInt.x]) {
				pos.x = old.x;
				pos.z = old.z;
			}
			return false;
		}
		else {
			return true;
		}
	},

    loadModels : function(models, callback) {
        var self = this;
        Graphics.loadModels(models, function(models) {
            self.models = models;
            callback();
        });
    },

    loadMap : function(file, callback) {
        this.map = [];
        var self = this;
		console.log("Parsing map \"" + file + "\"...");
        $.ajax({
            url : file,
            dataType : "text",
			cache : false,
            success : function(data) {
                var map = eval("(" + data + ")");
				self.startPosition = map.startPosition;
                var imgFileName = map.mapFile;
				var img = new Image();
				console.log("Loading map \"" + imgFileName + "\"...");
				img.onload = function() {
					var canvas = $("<canvas />")[0];
					var ctx = canvas.getContext("2d");
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);
					self.dimension = {
						width : img.width,
						height: img.height
					};
					for(var y = 0; y < img.height; y++) {
						self.map.push([]);
						for(var x = 0; x < img.width; x++) {
							var p = ctx.getImageData(x, y, 1, 1).data;
							p = p[0] << 16 | p[1] << 8 | p[2];
							if(p == 0x000000) {
								self.map[y][x] = true;
							}
							if(p == 0xFFFFFF) {
								self.map[y][x] = false;
							}
						}
					}
					console.log("Map loaded.");
					callback();
				};
				img.src = imgFileName;
            }
        });
    },

    generateMap : function() {
        for(var y = 0; y < this.dimension.height; y++) {
            for(var x = 0; x < this.dimension.width; x++) {
                new Entity(this.models["floor"], "textures/tiles.jpg")
                    .setPosition(x, -1, y)
                    .attachTo(Graphics.root);
                new Entity(this.models["floor"], "textures/wood.jpg")
                    .setPosition(x, 1, y)
                    .attachTo(Graphics.root);
				if(this.map[y][x]) {
					var entity;
					var texture = "textures/bricks.jpg";
					var a = y > 0 && this.map[y - 1][x],
						b = y < this.dimension.height - 1 && this.map[y + 1][x],
						c = x > 0 && this.map[y][x - 1],
						d = x < this.dimension.width - 1 && this.map[y][x + 1];
					if(!a && !b && !c && !d) { //Derzeit undefiniert ??? Garkeine
						entity = new Entity(this.models["wall"], texture)
							.rotate(0, 90, 0);
					}
					if(!a && !b && !c && d) { //Derzeit undefiniert ??? Waagerechte Linie
						entity = new Entity(this.models["wall"], texture);
					}
					if(!a && !b && c && !d) { //Derzeit undefiniert ??? Waagerechte Linie
						entity = new Entity(this.models["wall"], texture);
					}
					if(!a && !b && c && d) { //Waagerechte Linie
						entity = new Entity(this.models["wall"], texture);
					}
					if(!a && b && !c && !d) { //Derzeit undefiniert ??? Senkrechte Linie
						entity = new Entity(this.models["wall"], texture)
							.rotate(0, 90, 0);
					}
					if(!a && b && !c && d) { //Ecke Unten-Rechts
						entity = new Entity(this.models["corner"], texture)
							.rotate(0, -90, 0);
					}
					if(!a && b && c && !d) { //Ecke Unten-Links
						entity = new Entity(this.models["corner"], texture)
							.rotate(0, 180, 0);
					}
					if(!a && b && c && d) { //Dreierkreuzung Nicht-Oben
						entity = new Entity(this.models["junction_tri"], texture)
							.rotate(0, -90, 0);
					}
					if(a && !b && !c && !d) { //Derzeit undefiniert ??? Senkrechte Linie
						entity = new Entity(this.models["wall"], texture)
							.rotate(0, 90, 0);
					}
					if(a && !b && !c && d) { //Ecke Oben-Rechts
						entity = new Entity(this.models["corner"], texture);
					}
					if(a && !b && c && !d) { //Ecke Oben-Links
						entity = new Entity(this.models["corner"], texture)
							.rotate(0, 90, 0);
					}
					if(a && !b && c && d) { //Dreierkreuzung Nicht-Unten
						entity = new Entity(this.models["junction_tri"], texture)
							.rotate(0, 90, 0);
					}
					if(a && b && !c && !d) { //Senkrechte Linie
						entity = new Entity(this.models["wall"], texture)
							.rotate(0, 90, 0);
					}
					if(a && b && !c && d) { //Dreierkreuzung Nicht-Links
						entity = new Entity(this.models["junction_tri"], texture);
					}
					if(a && b && c && !d) { //Dreierkreuzung Nicht-Rechts
						entity = new Entity(this.models["junction_tri"], texture)
							.rotate(0, 180, 0);
					}
					if(a && b && c && d) { //Viererkreuzung
						entity = new Entity(this.models["junction_quad"], texture);
					}
					entity
						.attachTo(Graphics.root)
						.setPosition(x, 0, y);
					/*new Entity(this.models["wall"], "textures/bricks.jpg")
						.setPosition(x, 0, y)
						.attachTo(Graphics.root);*/
				}
            }
        }
    },

    addTickHandler : function(handler) {
        this.tickHandlers.push(handler);
    },

    tick : function() {
        for(var i in this.tickHandlers) {
            this.tickHandlers[i]();
        }
    }
}
