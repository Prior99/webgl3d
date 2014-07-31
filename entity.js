var Entity = function(obj) {
    if(obj && obj.modelFile) this.model = Graphics.models[obj.modelFile];
    if(obj && obj.model) this.model = obj.model;
    var self = this;
    if(obj && obj.texture) {
        Graphics.loadTexture(obj.texture, function(tex) {
            self.texture = tex;
        });
    }
    else if(this.model && this.model.texture) {
        Graphics.loadTexture(this.model.texture, function(tex) {
            self.texture = tex;
        });
    }
    this.rotation = {
        x : 0,
        y : 0,
        z : 0
    };
    this.position = {
        x : 0,
        y : 0,
        z : 0
    }
    this.children = [];
    this.parent = null;
    if(obj && obj.shaders) {
        var self = this;
        Graphics.loadShaders(obj.shaders, function(vertex, fragment) {
            self.shader = Graphics.gl.createProgram();
            Graphics.gl.attachShader(self.shader, vertex);
            Graphics.gl.attachShader(self.shader, fragment);
            Graphics.gl.linkProgram(self.shader);
            if(!Graphics.gl.getProgramParameter(self.shader, Graphics.gl.LINK_STATUS)) {
                console.error("Unable to link shaders together.");
            }
            Graphics.gl.useProgram(self.shader);

            self.shader.vertexPositionAttribute = Graphics.gl.getAttribLocation(self.shader, "aVertexPosition");
            Graphics.gl.enableVertexAttribArray(self.shader.vertexPositionAttribute);

            self.shader.textureCoordAttribute = Graphics.gl.getAttribLocation(self.shader, "aTextureCoord");
            Graphics.gl.enableVertexAttribArray(self.shader.textureCoordAttribute);

            self.shader.normalsAttribute = Graphics.gl.getAttribLocation(self.shader, "aNormals");
            Graphics.gl.enableVertexAttribArray(self.shader.normalsAttribute);

            for(var key in obj.shaders.mappings) {
                self.shader[key] = Graphics.gl.getUniformLocation(self.shader, obj.shaders.mappings[key]);
            }
            self.shader.prepare = obj.shaders.prepare;
            Graphics.gl.useProgram(Graphics.shaderProgram);
        });
    }
}

Entity.prototype = {
    rotate : function(x, y, z) {
        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;
        return this;
    },

    setRotation : function(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        return this;
    },

    move : function(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        return this;
    },

    setPosition : function(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        return this;
    },

    attachChild : function(entity) {
        if(!entity.position || !entity.rotation) {
            console.error("Invalid entity!");
        }
        this.children.push(entity);
        entity.parent = this;
        return this;
    },

    attachTo : function(entity) {
        if(!this.position || !this.rotation) {
            console.error("Invalid entity!");
        }
        entity.attachChild(this);
        return this;
    },

    detach : function() {
        this.parent.detachChild(this);
        return this;
    },

    detachChild : function(entity) {
        var i;
        if(i = this.children.indexOf(entity) != -1) {
            this.children.splice(i, 1);
        }
        entity.parent = null;
        return this;
    },

    preRender : function() {
        if(this.shader) {
            this.shader.prepare(this.shader);
        }
    }
}
