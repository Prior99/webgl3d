var Entity = function(model) {
    this.model = model;
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
    }
}
