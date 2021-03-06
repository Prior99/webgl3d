var Graphics = {
    renderTickHandlers : [],
    textures : {},
    texturesLoading : {},
    models : {},
    modelsLoading : {},
    modelMatrixStack : [],
    modelMatrix : mat4.create(),
    viewMatrix : mat4.create(),
    projectionMatrix : mat4.create(),
    init : function(canvas, callback) {
        this.canvas = canvas;
        this.initGL();
        this.initShaders(callback);
        this.root = new Entity(null);
        window.addEventListener('resize', function() { //On resize we have to resize our canvas
            Graphics.resize();
        }, false);
        this.lightStrength = 12;
        this.lightColor = {
            r : 1.,
            g : .95,
            b : .5
        };
        this.ambientColor = {
            r : 0,
            g : 0,
            b : 0
        };
        this.lightPosition = Player.position;
        this.lightStrengthFlicker = this.lightStrength;
        this.resize();
    },

    loadTexture : function(url, callback) {
        var gl = this.gl;
        var self = this;
        if(this.textures[url]) callback(this.textures[url]);
        else {
            var tl;
            if(tl = this.texturesLoading[url]) {
                tl.push(callback);
            }
            else {
                console.log("Fetching texture " + url);
                tl = this.texturesLoading[url] = [];
                tl.push(callback);
                var img = new Image();
                img.onload = function() {
                    var tex = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    //gl.generateMipmap(gl.TEXTURE_2D);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    self.textures[url] = tex;
                    for(var key in tl) {
                        tl[key](tex);
                    }
                    self.texturesLoading[url] = undefined;
                }
                img.src = "textures/" + url;
            }
        }
    },

    addRenderTickHandler : function(handler) {
        this.renderTickHandlers.push(handler);
    },

    start : function() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(Graphics.gl.DEPTH_TEST); //So things behind other things are hidden
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.viewport(0, 0, this.width, this.height);
        this.redraw();
    },

    addEntity : function(entity) {
        if(!entity.position || !entity.rotation) {
            console.error("Invalid entity!");
        }
        this.root.attachChild(entity);
    },

    removeEntity : function(entity) {
        this.root.detachChild(entity);
    },

    loadModel : function(url, callback) {
        if(this.models[url]) {
            callback(this.models[url]);
        }
        else {
            var ml;
            if(ml = this.modelsLoading[url]) {
                ml.push(callback);
            }
            else {
                ml = this.modelsLoading[url] = [];
                ml.push(callback);
                console.log("Fetching model " + url);
                $.ajax({
                    url : "models/" + url,
                    dataType : "text",
                    cache : false,
                    success : function(data) {
                        var model = eval("(" + data + ")");
                        Graphics.models[url] = model = Graphics.bindModel(model);
                        for(var key in ml) {
                            ml[key](model);
                        }
                        Graphics.modelsLoading[url] = undefined;
                    }
                });
            }
        }
    },

    bindModel : function(model, callback) {
        var gl = Graphics.gl;
        var m = {
            vertices : gl.createBuffer(),
            textureMap : gl.createBuffer(),
            faces : gl.createBuffer(),
            normals : gl.createBuffer(),
            texture : model.texture,
            name : model.name,
            vertexCount : model.vertices.length / 3,
            indexCount : model.faces.length
        };
        if(model.init) model.init();
        if(!model.normals) console.error("Model \"" + model.name + "\" is missing normals.");
        if(!model.vertices) console.error("Model \"" + model.name + "\" is missing vertices.");
        if(!model.textureMap) console.error("Model \"" + model.name + "\" is missing textureMap.");
        if(!model.faces) console.error("Model \"" + model.name + "\" is missing faces.");
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
        gl.bindBuffer(gl.ARRAY_BUFFER, m.textureMap);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureMap), gl.STATIC_DRAW);
        /*
         * Load normals
         */
        gl.bindBuffer(gl.ARRAY_BUFFER, m.normals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        /*
         * Load indices to GPU
         */
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.faces);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.faces), gl.STATIC_DRAW);
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
        Player.heading = vec3.fromValues(0, 0, 1);
        vec3.transformMat4(Player.heading, Player.heading, tmp);
        vec3.normalize(Player.heading, Player.heading);
        //if(Math.random() > 0.6) this.lightStrengthFlicker = this.lightStrength * (Math.random()*.2 + .9);
        mat4.translate(this.viewMatrix, this.viewMatrix, [-Player.position.x, -Player.position.y, -Player.position.z]);
        this.gl.uniform1f(this.shaderProgram.lightStrengthUniform, this.lightStrengthFlicker);
        this.gl.uniform3f(this.shaderProgram.lightPositionUniform, this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.gl.uniform3f(this.shaderProgram.lightColorUniform, this.lightColor.r, this.lightColor.g, this.lightColor.b);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);
        this.gl.uniform3f(this.shaderProgram.lightDirectionUniform, Player.heading[0], Player.heading[1], Player.heading[2]);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
        this.drawEntity(this.root);
        Info.reportDraw();
        window.requestAnimationFrame(function() {
            Graphics.redraw();
        });
    },

    drawEntity : function(entity) {
        if(entity.invisible) return;
        if(entity.tick) entity.tick();
        this.push();
        mat4.translate(this.modelMatrix, this.modelMatrix, [entity.position.x, entity.position.y, entity.position.z]);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.x));
        mat4.rotateY(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.y));
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, degToRad(entity.rotation.z));
        if(entity.model) {
            var shaderToBind;
            if(entity.shader) {
                this.gl.useProgram(entity.shader);
                shaderToBind = entity.shader;
                entity.shader.prepare(entity.shader);
            }
            else {
                shaderToBind = this.shaderProgram;
                this.setMatrixUniforms();
            }

            /*
             * Map vertices to shader
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.vertices);
            this.gl.vertexAttribPointer(shaderToBind.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
            /*
             * Map texturecoordinates to shader
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.textureMap);
            this.gl.vertexAttribPointer(shaderToBind.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
            /*
             * Normals
             */
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, entity.model.normals);
            this.gl.vertexAttribPointer(shaderToBind.normalsAttribute, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, entity.boundTexture);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, entity.model.faces);
            if(entity.shader) {
                this.gl.useProgram(entity.shader);
            }
            else {
                this.setMatrixUniforms();
                if(entity.isSelected()) {
                    this.gl.uniform1i(this.shaderProgram.selectedUniform, 1);
                }
                else {
                    this.gl.uniform1i(this.shaderProgram.selectedUniform, 0);
                }
                if(entity.ignoreLighting) {
                    this.gl.uniform1i(this.shaderProgram.ignoreLighting, 1);
                }
                else {
                    this.gl.uniform1i(this.shaderProgram.ignoreLighting, 0);
                }
            }

            this.gl.drawElements(this.gl.TRIANGLES, entity.model.indexCount, this.gl.UNSIGNED_SHORT, 0);
            if(entity.shader) {
                this.gl.useProgram(Graphics.shaderProgram);
            }
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
            Graphics.shaderProgram.selectedUniform = gl.getUniformLocation(Graphics.shaderProgram, "uSelected");
            Graphics.shaderProgram.ignoreLighting = gl.getUniformLocation(Graphics.shaderProgram, "uIgnoreLighting");
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
