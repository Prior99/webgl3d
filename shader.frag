precision mediump float;

uniform sampler2D uSampler;

uniform vec3 uAmbientColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightStrength;
uniform vec3 uLightDirection;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
    vec4 fragmentColor;
    vec3 lightWeighting, lightDirection, lightDistance;
    float directionalLightWeighting, distanceToMiddle, coneFactor;

    lightDistance = uLightPosition - vPosition.xyz;

    distanceToMiddle = max(length(cross(vPosition.xyz - uLightPosition, uLightDirection)), 0.1); //Man kann sich /length(uLightDirection) sparen, da normiert

    lightDirection = normalize(lightDistance);
    directionalLightWeighting = min(max(dot(normalize(vTransformedNormal), lightDirection), 0.0)*uLightStrength/length(lightDistance), 1.2);
    lightWeighting = uAmbientColor + uLightColor * directionalLightWeighting;

    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    coneFactor = max(8.*distanceToMiddle/length(lightDistance), .5);

    gl_FragColor = vec4((fragmentColor.rgb * lightWeighting.xyz)/coneFactor, fragmentColor.a);

}
