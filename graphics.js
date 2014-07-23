var Graphics = {
    start : function(canvas) {
        this.canvas = canvas;
        this.initGL();
        this.modelViewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.initShaders(initBuffers);
        function initBuffers() {
            Graphics.initBuffers(startRenderLoop);
        }
        function startRenderLoop() {
            Graphics.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            Graphics.gl.enable(Graphics.gl.DEPTH_TEST); //So things behind other things are hidden
            Graphics.redraw();
        }
    },

    redraw : function() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 100.0);
        mat4.identity(this.modelViewMatrix); //Einheitsmatrix

        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0.0, 0.0, -7.0]);
        this.drawModel(this.cube);

        window.requestAnimationFrame(function() {
            Graphics.redraw();
        });
    },

    drawModel : function(model) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, model.dimension, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.color);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.setMatrixUniforms();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, model.vertexCount);
    },

    initBuffers : function(callback) {
        this.cube = new ModelCube();
        callback();
    },

    initGL : function() {
        try {
            Graphics.gl = canvas.getContext("experimental-webgl");
            this.width = canvas.width;
            this.height = canvas.height;
        }
        catch(e) {
            console.log(e);
        }
        if(!this.gl) {
            console.error("Unable to initialise WebGL");
        }
    },

    popMatrix : function() {

    },

    initShaders : function(callback) {
        var shaders = {
            fragment : "shader.frag",
            vertex : "shader.vert"
        };
        var gl = this.gl;
        this.loadShaders(shaders, function(vertex, fragment) {
            Graphics.shaderProgram = gl.createProgram();

            gl.attachShader(Graphics.shaderProgram, vertex);
            gl.attachShader(Graphics.shaderProgram, fragment);

            gl.linkProgram(Graphics.shaderProgram);

            if(!gl.getProgramParameter(Graphics.shaderProgram, gl.LINK_STATUS)) {
                console.error("Unable to link shaders together.");
            }

            gl.useProgram(Graphics.shaderProgram);

            Graphics.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(Graphics.shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(Graphics.shaderProgram.vertexPositionAttribute);

            Graphics.shaderProgram.vertexColorAttribute = gl.getAttribLocation(Graphics.shaderProgram, "aVertexColor");
            gl.enableVertexAttribArray(Graphics.shaderProgram.vertexColorAttribute);

            Graphics.shaderProgram.projectionMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uProjectionMatrix");
            Graphics.shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uModelViewMatrix");
            callback();
        });
    },

    setMatrixUniforms : function() {
        this.gl.uniformMatrix4fv(this.shaderProgram.projectionMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.modelViewMatrixUniform, false, this.modelViewMatrix);
    },

    loadShaders : function(shaders, callback) {
        var ok = 0;
        var vertex, fragment;
        Graphics.getShader(shaders.vertex, "vertex", function(result) {
            ok++;
            vertex = result;
            if(ok == 2) done();
        });
        Graphics.getShader(shaders.fragment, "fragment", function(result) {
            ok++;
            fragment = result;
            if(ok == 2) done();
        });
        function done() {
            callback(vertex, fragment);
        }
    },

    getShader : function (filename, type, callback) {
        $.ajax({
            url : filename,
            success : function(data) {
                var shader;
                if(type.toLowerCase() == "fragment") {
                    shader = Graphics.gl.createShader(Graphics.gl.FRAGMENT_SHADER);
                }
                else if(type.toLowerCase() == "vertex") {
                    shader = Graphics.gl.createShader(Graphics.gl.VERTEX_SHADER);
                }
                else {
                    console.error("Unknown type of shader: \"" + type + "\"");
                    callback(null);
                }
                Graphics.gl.shaderSource(shader, data);
                Graphics.gl.compileShader(shader);
                if (!Graphics.gl.getShaderParameter(shader, Graphics.gl.COMPILE_STATUS)) {
                    console.error("Unable to compile shader \"" + filename + "\":" + Graphics.gl.getShaderInfoLog(shader));
                    callback(null);
                }
                callback(shader);
            }
        });
    }
};
