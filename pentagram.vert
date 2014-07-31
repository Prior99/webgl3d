precision lowp float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormals;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.);
    vTextureCoord = aTextureCoord;
}
