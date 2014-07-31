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
        this.init = obj.init;
        this.init();
    }
}

var pushAll = function(array, arr) {
    for(var i in arr) {
        array.push(arr[i]);
    }
}

Model.prototype = {
    triangle : function(p1, p2, p3, n, tex1, tex2, tex3) {
        var len = this.vertices.length;
        pushAll(this.vertices, p1);
        pushAll(this.vertices, p2);
        pushAll(this.vertices, p3);
        this.faces.push(len, len + 1, len + 2);
        pushAll(this.normals, n);
        pushAll(this.normals, n);
        pushAll(this.normals, n);
        pushAll(this.textureMap, tex1);
        pushAll(this.textureMap, tex2);
        pushAll(this.textureMap, tex3);
    },
    quad : function(p1, p2, p3, p4, n, tex1, tex3) {
        var len = this.vertices.length;
        var tex2 = [tex1[0], tex3[1]];
        var tex4 = [tex1[1], tex3[0]];
        pushAll(this.vertices, p1);
        pushAll(this.vertices, p2);
        pushAll(this.vertices, p3);
        pushAll(this.vertices, p4);
        pushAll(this.normals, n);
        pushAll(this.normals, n);
        pushAll(this.normals, n);
        pushAll(this.normals, n);
        pushAll(this.textureMap, tex1);
        pushAll(this.textureMap, tex2);
        pushAll(this.textureMap, tex3);
        pushAll(this.textureMap, tex4);
        this.faces.push(len, len+1, len+2, len+1, len+2, len+3);


    }
};
