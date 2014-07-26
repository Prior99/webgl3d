var Game = {
    init : function(canvas, map, callback){
        var models = [
            "models/junction_quad.js",
            "models/wall.js",
            "models/corner.js"
        ];
        this.tickHandlers = [];
        setInterval(function() {
            Game.tick();
        }, 1000/60);
        Graphics.init($("canvas")[0], function() {
            console.log("Graphics initialized.");
            Game.loadModels(models, function() {
                Game.loadMap(map, function() {
                    console.log("Game models loaded.");
                    Game.generateMap();
                    Graphics.start();
                    console.log("Graphics started.");
                    callback();
                })
            });
        });
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
        $.ajax({
            url : file,
            contentType : "text",
            success : function(data) {
                self.dimension = {
                    width: map.dimension.width,
                    height: map.dimension.height
                };
                var map = eval("(" + data + ")");
                for(var y = 0; y < map.dimension.height; y++) {
                    self.map.push([]);
                    for(var x = 0; x < map.dimension.width; x++) {
                        var char = map.map[y * width + x];
                        if(char == '#') self.map[y][x] = true;
                        else self.map[y][x] = true;
                    }
                }
            }
        });
    },

    generateMap : function() {
        for(var y = 0; y < this.dimension.height; y++) {
            for(var x = 0; x < this.dimension.width; x++) {
                new Entity(this.models["floor"], "tiles.jpg")
                    .setPosition(x, -1, y)
                    .attachTo(Graphics.root);
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
