precision lowp float;

uniform sampler2D uSampler;

uniform vec3 uAmbientColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightStrength;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
    vec4 fragmentColor;
    vec3 lightWeighting, lightDirection, lightDistance;
    float directionalLightWeighting;

    lightDistance = uLightPosition - vPosition.xyz;
    lightDirection = normalize(lightDistance);
    directionalLightWeighting = min(max(dot(normalize(vTransformedNormal), lightDirection), 0.0)*uLightStrength/length(lightDistance), 1.2);
    lightWeighting = uAmbientColor + uLightColor * directionalLightWeighting;

    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}
