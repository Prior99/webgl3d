var ModelCube = function() {
    var gl = Graphics.gl;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ]), gl.STATIC_DRAW);
    this.dimension = 3;
    this.vertexCount = 3;

    this.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        1.0,  0.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  0.0,  1.0,  1.0
    ]), gl.STATIC_DRAW);
};

ModelCube.prototype = {

};
