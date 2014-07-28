attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormals;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uLightDirection;
uniform vec3 uLightColor;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void) {
    vec4 modelViewPosition = uModelViewMatrix * vec4(aVertexPosition, 1.);
    gl_Position = uProjectionMatrix * modelViewPosition;

    vTextureCoord = aTextureCoord;

    vec3 lightDirection = normalize(uLightDirection - uNormalMatrix * aVertexPosition);


    vec3 transformedNormal = uNormalMatrix * aNormals;
    float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
    vLightWeighting = uLightColor * (directionalLightWeighting + vec3(.2, .2, .2));
}
