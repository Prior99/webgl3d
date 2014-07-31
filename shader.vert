precision lowp float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormals;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
    vPosition = uModelMatrix * vec4(aVertexPosition, 1.);
    gl_Position = uProjectionMatrix * uViewMatrix * vPosition;
    vTextureCoord = aTextureCoord;
    vTransformedNormal = uNormalMatrix * aNormals;
}
