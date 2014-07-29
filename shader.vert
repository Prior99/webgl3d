attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormals;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform vec3 uAmbientColor;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.);

    vTextureCoord = aTextureCoord;

    vec3 lightDirection = normalize(uLightPosition - (uModelMatrix * vec4(aVertexPosition, 1.)).xyz);


    vec3 transformedNormal = uNormalMatrix * -aNormals;
    float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
    vLightWeighting =  uAmbientColor.rgb + uLightColor * (directionalLightWeighting + vec3(.2, .2, .2));
}
