var Graphics = {
    init : function(canvas, callback) {
        this.canvas = canvas;
        this.initGL();
        this.modelViewMatrix = mat4.create();
        this.modelViewStack = [];
        this.projectionMatrix = mat4.create();
        this.initShaders(callback);
        this.entities = [];
        this.renderTickHandlers = [];
        this.textures = {};
    },

    loadTexture : function(url, callback) {
        var gl = this.gl;
        var self = this;
        if(this.textures[url]) return this.textures[url];
        else {
            var img = new Image();
            img.onload = function() {
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                self.textures[url] = tex;
                callback(tex);
            }
            img.src = url;
        }
    },

    addRenderTickHandler : function(handler) {
        this.renderTickHandlers.push(handler);
    },

    start : function() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(Graphics.gl.DEPTH_TEST); //So things behind other things are hidden
        this.gl.viewport(0, 0, this.width, this.height);
        this.redraw();
    },

    addEntity : function(entity) {
        this.entities.push(entity);
    },

    removeEntity : function(entity) {
        var i;
        if(i = this.entities.indexOf(entity) != -1) {
            this.entities.splice(i, 1);
        }
    },

    loadModels : function(models, callback) {
        var models2 = models.slice();
        var result = {};
        var gl = this.gl;
        function recurse() {
            if(models2.length == 0) {
                callback(result);
            }
            else {
                var url = models2.pop();
                $.ajax({
                    url : url,
                    dataType : "text",
                    success : loadModel
                });
            }
        }
        function loadModel(data) {
            var model = eval("(" + data + ")");
            var m = {
                vertices : gl.createBuffer(),
                textureCoordinates : gl.createBuffer(),
                indices : gl.createBuffer(),
                texture : null,
                name : model.name,
                vertexCount : model.vertices.length / 3,
                indexCount : model.indices.length
            };
            /*
             * Load vertices to GPU
             */
            gl.bindBuffer(gl.ARRAY_BUFFER, m.vertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
            /*
             * Load texturecoordinates to GPU
             */
            gl.bindBuffer(gl.ARRAY_BUFFER, m.textureCoordinates);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoordinates), gl.STATIC_DRAW);
            /*
             * Load indices to GPU
             */
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.indices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
            /*
             * Load texture
             */
            Graphics.loadTexture(model.texture, function(tex) {
                m.texture = tex;
                result[model.name] = m;
                recurse();
            });
        }
        recurse();
    },

    redraw : function() {
        for(var i in this.renderTickHandlers) {
            this.renderTickHandlers[i]();
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 100.0);
        mat4.identity(this.modelViewMatrix); //Einheitsmatrix

        for(var i in this.entities) {
            var e = this.entities[i];
            this.drawEntity(e);
            if(e.tick) e.tick();
        }

        window.requestAnimationFrame(function() {
            Graphics.redraw();
        });
    },

    drawEntity : function(entity) {

        this.push();
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [entity.position.x, entity.position.y, entity.position.z]);
        this.push();
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, degToRad(entity.rotation.x));
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, degToRad(entity.rotation.y));
        mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, degToRad(entity.rotation.z));

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.vertices);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.textureCoordinates);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, entity.model.texture);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, entity.model.indices);

        this.setMatrixUniforms();
        this.gl.drawElements(this.gl.TRIANGLES, entity.model.indexCount, this.gl.UNSIGNED_SHORT, 0);
        this.pop();
        this.pop();
    },

    initBuffers : function(callback) {
        callback();
    },

    initGL : function() {
        try {
            Graphics.gl = this.canvas.getContext("experimental-webgl");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
        catch(e) {
            console.log(e);
        }
        if(!this.gl) {
            console.error("Unable to initialize WebGL");
        }
    },

    pop : function() {
        if(this.modelViewStack.length == 0) {
            throw "Could not pop on empty stack!";
        }
        else {
            this.modelViewMatrix = this.modelViewStack.pop();
        }
    },

    push : function() {
        var tmp = mat4.clone(this.modelViewMatrix);
        this.modelViewStack.push(tmp);
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

            Graphics.shaderProgram.textureCoordAttribute = gl.getAttribLocation(Graphics.shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(Graphics.shaderProgram.textureCoordAttribute);

            Graphics.shaderProgram.projectionMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uProjectionMatrix");
            Graphics.shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uModelViewMatrix");
            Graphics.shaderProgram.samplerUniform = gl.getUniformLocation(Graphics.shaderProgram, "uSampler");
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


function degToRad(degree) {
    return (2*Math.PI)/360 * degree;
}
