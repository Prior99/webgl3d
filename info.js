var Info = {
    init : function(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.redraw();
        this.lastTime = Date.now();
        this.fps = 0;
        setInterval(function() {
            window.requestAnimationFrame(function() {
                Info.redraw();
            });
        }, 100)
        this.arr = [];
        this.index = 0;
        this.len = 125;
        this.max = 120;
        this.ctx.fillStyle = "white";
        this.ctx.font = "12px Arial";
    },

    reportDraw : function() {
        var now = Date.now();
        var elapsed = now - this.lastTime;
        this.fps = 1000/elapsed;
        this.lastTime = now;
        this.arr[(this.index++) % this.len] = this.fps;
    },

    redraw : function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.textAlign = "right";
        this.ctx.fillText("FPS: " + parseInt(this.fps), this.canvas.width, 12);
        this.drawDiagram();
    },

    drawDiagram : function() {
        var width = this.len;
        var height = 80;
        var offsetLeft = 24;

        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(offsetLeft, 0);
        this.ctx.lineTo(offsetLeft, height);
        this.ctx.stroke();
        this.ctx.lineTo(offsetLeft + width, height);
        this.ctx.stroke();

        this.ctx.textAlign = "left";
        this.ctx.fillText("" +this.max, 0, 12);
        this.ctx.fillText("" +(this.max/2), 0, height/2);
        this.ctx.fillText("0", 0, height - 12);

        this.ctx.strokeStyle = "lime";
        this.ctx.beginPath();
        for(var i = 0; i < this.len; i++) {
            var fps = this.arr[(this.index + i + 1) % this.len];
            var x = i + offsetLeft;
            var y = height - ((fps/this.max) * height);
            if(i == 0)
                this.ctx.moveTo(x, y);
            else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }
};
