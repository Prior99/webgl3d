var Entity = function(model, texture, shaders) {
    this.model = model;
    var self = this;
    if(texture) {
        Graphics.loadTexture(texture, function(tex) {
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
    if(shaders !== undefined) {
        var self = this;
        Graphics.loadShaders(shaders, function(vertex, fragment) {
            self.shader = Graphics.gl.createProgram();
            Graphics.gl.attachShader(self.shader, vertex);
            Graphics.gl.attachShader(self.shader, fragment);
            Graphics.gl.linkProgram(self.shader);
            if(!Graphics.gl.getProgramParameter(self.shader, Graphics.gl.LINK_STATUS)) {
                console.error("Unable to link shaders together.");
            }
            for(var key in shaders.mappings) {
                self.shader[key] = Graphics.gl.getUniformLocation(Graphics.shaderProgram, shaders.mappings[key]);
            }
            self.shader.prepare = shaders.prepare;
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
        this.children.push(entity);
        entity.parent = this;
        return this;
    },

    attachTo : function(entity) {
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
