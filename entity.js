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

    attach : function() {
        Graphics.addEntity(this);
        return this;
    },

    detach : function() {
        Graphics.removeEntity(this);
        return this;
    },
}
