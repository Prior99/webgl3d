var Entity = function(obj) {
    var self = this;

    this.position = {
        x : 0,
        y : 0,
        z : 0
    };
    this.rotation = {
        x : 0,
        y : 0,
        z : 0
    };

    if(obj) {
        for(var key in obj) {
            this[key] = obj[key];
        }
        if(obj.modelFile) {
            Graphics.loadModel(obj.modelFile, function(model) {
                self.model = model;
                if(!self.texture && self.model && self.model.texture) {
                    Graphics.loadTexture(self.model.texture, function(tex) {
                        self.boundTexture = tex;
                    });
                }
            });
        }
        if(obj.texture) {
            Graphics.loadTexture(obj.texture, function(tex) {
                self.boundTexture = tex;
            });
        }
        if(obj.parent !== undefined) {
            if(obj.parent !== null) {
                this.attachTo(obj.parent);
            }
        }
        else {
            this.attachTo(Graphics.root);
        }
        if(obj.receiver) {
            this.receiver = true;
            Game.receivers.push(this);
        }
        if(obj.shaders) {
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

    this.children = [];
    if(this.init) this.init();
}

Entity.prototype = {
    removeAt : function(x, y, z) {
        var l = [];
        var len = this.children.length;
        for(var key = 0; key < len; key++) {
            var g = this.children[key];
            if(g && g.position.y == y && g.position.z == z && g.position.x == x) {
                g.detach();
                return;
            }
        }
    },

    isSelected : function() {
        return Game.selectedReceiver == this;
    },

    interact : function() {
        if(this.interact) this.interact();
    },

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
        this.parent = entity;
        return this;
    },

    detach : function() {
        if(this.parent !== undefined && this.parent !== null) {
            this.parent.detachChild(this);
            //this.parent = null;
        }
        return this;
    },

    detachChild : function(entity) {
        var i;
        if((i = this.children.indexOf(entity)) != -1) {
            this.children.splice(i, 1);
        }
        return this;
    },

    preRender : function() {
        if(this.shader) {
            this.shader.prepare(this.shader);
        }
    }
}
