var Graphics = {
    init : function(canvas) {
        this.canvas = canvas;
        this.initGL();
    },

    initGL : function() {
        try {
            this.gl = canvas.getContext("experimental-webgl");
            this.gl.viewportWidth = canvas.width;
            this.gl.viewportHeight = canvas.height;
        }
        catch(e) {
            console.log(e);
        }
        if(!this.gl) {
            console.error("Unable to initialise WebGL");
        }
    },

    function getShader(filename) {
        
    }
};
