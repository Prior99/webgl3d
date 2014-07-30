var Graphics = {
    init : function(canvas, callback) {
        this.canvas = canvas;
        this.initGL();
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.modelMatrixStack = [];
        this.projectionMatrix = mat4.create();
        this.initShaders(callback);
        this.entities = [];
        this.renderTickHandlers = [];
        this.textures = {};
        this.root = new Entity(null);
        window.addEventListener('resize', function() { //On resize we have to resize our canvas
            Graphics.resize();
        }, false);
        /*this.lightPosition = {
            x : 10,
            y : 1,
            z : 10
        };*/

        this.lightStrength = 10;
        this.lightPosition = Player.position;
        this.lightColor = {
            r : 1.,
            g : .7,
            b : .3
        };
        this.ambientColor = {
            r : 0,
            g : 0,
            b : 0
        };
        this.lightStrengthFlicker = this.lightStrength;
        this.resize();
    },

    loadTexture : function(url, callback) {
        var gl = this.gl;
        var self = this;
        if(this.textures[url]) callback(this.textures[url]);
        else {
            var img = new Image();
            img.onload = function() {
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                //gl.generateMipmap(gl.TEXTURE_2D);
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
        this.root.attachChild(entity);
    },

    removeEntity : function(entity) {
        this.root.detachChild(entity);
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
                    cache : false,
                    success : loadModel
                });
            }
        }
        function loadModel(data) {
            var model = eval("(" + data + ")");
            result[model.name] = Graphics.loadModel(model);
            recurse();
        }
        recurse();
    },

    loadModel : function(model, callback) {
        var gl = Graphics.gl;
        var m = {
            vertices : gl.createBuffer(),
            textureCoordinates : gl.createBuffer(),
            indices : gl.createBuffer(),
            normals : gl.createBuffer(),
            texture : null,
            name : model.name,
            vertexCount : model.vertices.length / 3,
            indexCount : model.indices.length
        };
        if(!model.normals) console.error("Model \"" + model.name + "\" is missing normals.");
        if(!model.vertices) console.error("Model \"" + model.name + "\" is missing vertices.");
        if(!model.name) console.error("Model \"" + model.name + "\" is missing name.");
        if(!model.textureCoordinates) console.error("Model \"" + model.name + "\" is missing textureCoordinates.");
        if(!model.indices) console.error("Model \"" + model.name + "\" is missing indices.");
        if(model.normals.length != model.vertices.length)
            console.error("Model \"" + model.name + "\" has invalid normals count. " + model.normals.length + " != " + model.vertices.length);
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
         * Load normals
         */
        gl.bindBuffer(gl.ARRAY_BUFFER, m.normals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        /*
         * Load indices to GPU
         */
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        return m;
    },

    redraw : function() {
        for(var i in this.renderTickHandlers) {
            this.renderTickHandlers[i]();
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 1000.0);
        mat4.identity(this.modelMatrix); //Einheitsmatrix
        mat4.identity(this.viewMatrix); //Einheitsmatrix
        mat4.rotateX(this.viewMatrix, this.viewMatrix, degToRad(Player.rotation.x));
        mat4.rotateY(this.viewMatrix, this.viewMatrix, degToRad(Player.rotation.y));
        mat4.rotateZ(this.viewMatrix, this.viewMatrix, degToRad(Player.rotation.z));
        var tmp = mat4.create();
        mat4.transpose(tmp, this.viewMatrix);
        var rotation = vec3.fromValues(0, 0, 1);
        vec3.transformMat4(rotation, rotation, tmp);
        vec3.normalize(rotation, rotation);
        //if(Math.random() > 0.6) this.lightStrengthFlicker = this.lightStrength  + Math.random();
        mat4.translate(this.viewMatrix, this.viewMatrix, [-Player.position.x, -Player.position.y, -Player.position.z]);
        this.gl.uniform1f(this.shaderProgram.lightStrengthUniform, this.lightStrengthFlicker);
        this.gl.uniform3f(this.shaderProgram.lightPositionUniform, this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.gl.uniform3f(this.shaderProgram.lightColorUniform, this.lightColor.r, this.lightColor.g, this.lightColor.b);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);
        this.gl.uniform3f(this.shaderProgram.lightDirectionUniform, rotation[0], rotation[1], rotation[2]);
        this.drawEntity(this.root);
        Info.reportDraw();
        window.requestAnimationFrame(function() {
            Graphics.redraw();
        });
    },

    drawEntity : function(entity) {
        if(entity.tick) entity.tick();
        this.push();
        mat4.translate(this.modelMatrix, this.modelMatrix, [entity.position.x, entity.position.y, entity.position.z]);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.x));
        mat4.rotateY(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.y));
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.z));
        if(entity.model) {
            /*
             * Map vertices to shader
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.vertices);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
            /*
             * Map texturecoordinates to shader
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.textureCoordinates);
            this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
            /*
             * Normals
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.normals);
            this.gl.vertexAttribPointer(this.shaderProgram.normalsAttribute, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, entity.texture);
            this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, entity.model.indices);

            this.setMatrixUniforms();
            this.gl.drawElements(this.gl.TRIANGLES, entity.model.indexCount, this.gl.UNSIGNED_SHORT, 0);
        }
        for(var i in entity.children) {
            Graphics.drawEntity(entity.children[i]);
        }
        this.pop();
    },

    resize : function() {
        this.canvas.width = this.width = window.innerWidth; //Set new dimensions on both canvas
        this.canvas.height = this.height = window.innerHeight;
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
        if(this.modelMatrixStack.length == 0) {
            throw "Could not pop on empty stack!";
        }
        else {
            this.modelMatrix = this.modelMatrixStack.pop();
        }
    },

    push : function() {
        var tmp = mat4.clone(this.modelMatrix);
        this.modelMatrixStack.push(tmp);
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

            Graphics.shaderProgram.normalsAttribute = gl.getAttribLocation(Graphics.shaderProgram, "aNormals");
            gl.enableVertexAttribArray(Graphics.shaderProgram.normalsAttribute);

            Graphics.shaderProgram.lightDirectionUniform = gl.getUniformLocation(Graphics.shaderProgram, "uLightDirection");
            Graphics.shaderProgram.ambientColorUniform = gl.getUniformLocation(Graphics.shaderProgram, "uAmbientColor");
            Graphics.shaderProgram.lightColorUniform = gl.getUniformLocation(Graphics.shaderProgram, "uLightColor");
            Graphics.shaderProgram.lightPositionUniform = gl.getUniformLocation(Graphics.shaderProgram, "uLightPosition");
            Graphics.shaderProgram.lightStrengthUniform = gl.getUniformLocation(Graphics.shaderProgram, "uLightStrength");
            Graphics.shaderProgram.normalMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uNormalMatrix");
            Graphics.shaderProgram.projectionMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uProjectionMatrix");
            Graphics.shaderProgram.modelMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uModelMatrix");
            Graphics.shaderProgram.viewMatrixUniform = gl.getUniformLocation(Graphics.shaderProgram, "uViewMatrix");
            Graphics.shaderProgram.samplerUniform = gl.getUniformLocation(Graphics.shaderProgram, "uSampler");
            callback();
        });
    },

    setMatrixUniforms : function() {
        this.gl.uniformMatrix4fv(this.shaderProgram.projectionMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.modelMatrixUniform, false, this.modelMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.viewMatrixUniform, false, this.viewMatrix);

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, this.modelMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, normalMatrix);

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
