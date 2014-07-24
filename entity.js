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
    },

    setRotation : function(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    },

    move : function(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    },

    setPosition : function(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    },

    attach : function() {
        Graphics.addEntity(this);
    },

    detach : function() {
        Graphics.removeEntity(this);
    },
}
