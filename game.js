var Game = {
    init : function (){
        this.tickHandlers = [];
        setInterval(function() {
            Game.tick();
        }, 1000/60);
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
