var Model = function(obj) {
    if(obj.texture) this.texture = obj.texture;
    if(obj.vertices) {
        this.vertices = obj.vertices;
    }
    else {
        this.vertices = [];
    }
    if(obj.faces) {
        this.faces = obj.faces;
    }
    else {
        this.faces = [];
    }
    if(obj.textureMap) {
        this.textureMap = obj.textureMap;
    }
    else {
        this.textureMap = [];
    }
    if(obj.normals) {
        this.normals = obj.normals;
    }
    else {
        this.normals = [];
    }
    if(obj.init) {
        this.init = init();
        this.init();
    }
}

Model.prototype = {
    triangle : function(p1, p2, p3, n, tex1, tex2, tex3) {
        var len = this.vertices.length;
        this.vertices.pushAll(p1);
        this.vertices.pushAll(p2);
        this.vertices.pushAll(p3);
        this.faces.push(len, len + 1, len + 2);
        this.normals.pushAll(n);
        this.normals.pushAll(n);
        this.normals.pushAll(n);
        this.textureMap.pushAll(tex1);
        this.textureMap.pushAll(tex2);
        this.textureMap.pushAll(tex3);
    },
    quad : function(p1, p2, p3, p4, n, tex1, tex3) {
        var len = this.vertices.length;
        var tex2 = [tex1[0], tex3[1]];
        var tex4 = [tex1[1], tex3[0]];
        this.vertices.pushAll(p1);
        this.vertices.pushAll(p2);
        this.vertices.pushAll(p3);
        this.vertices.pushAll(p4);
        this.normals.pushAll(n);
        this.normals.pushAll(n);
        this.normals.pushAll(n);
        this.normals.pushAll(n);
        this.textureMap.pushAll(tex1);
        this.textureMap.pushAll(tex2);
        this.textureMap.pushAll(tex3);
        this.textureMap.pushAll(tex4);
        this.faces.push(len, len+1, len+2, len+1, len+2, len+3);


    }
};

Array.prototype.pushAll = function(arr) {
    for(var i in arr) {
        this.push(arr[i]);
    }
}
