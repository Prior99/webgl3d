precision lowp float;

uniform sampler2D uSampler;

uniform vec3 uAmbientColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightStrength;
uniform vec3 uLightDirection;
uniform bool uSelected;
uniform bool uIgnoreLighting;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
    vec4 fragmentColor;
    vec3 lightWeighting, lightDirection, normalizedTransformedNormal, lightDistancePerColor;
    float directionalLightWeighting, distanceToMiddle, coneFactor, nDotL, lightInfluence, lightDistance;

    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.x, 1. - vTextureCoord.y));
    if(uSelected) {
        gl_FragColor = vec4(fragmentColor.rg - .3, 1. , fragmentColor.a);
    }
    else {
        if(uIgnoreLighting) {
            gl_FragColor = fragmentColor.rgba;
        }
        else {
            normalizedTransformedNormal = normalize(vTransformedNormal);

            lightDirection = uLightPosition - vPosition.xyz;
            lightDistance = length(lightDirection);
            lightDirection = normalize(lightDirection);

            nDotL = max(dot(lightDirection, normalizedTransformedNormal), 0.);


            if(nDotL > 0.) {
                distanceToMiddle = length(cross(vPosition.xyz - uLightPosition, uLightDirection)); //Man kann sich /length(uLightDirection) sparen, da normiert
                lightInfluence = (distanceToMiddle / pow(lightDistance, 1.5))*uLightStrength;
                lightInfluence = max(lightInfluence, .75);
                //lightInfluence += lightDistance*.6;
                //lightInfluence = min(.0, lightInfluence);
                lightDistancePerColor = vec3(lightDistance, lightDistance, lightDistance);
                lightDistancePerColor /= uLightStrength/6.;
                gl_FragColor = vec4(((fragmentColor.rgb * uLightColor) / (lightInfluence * lightDistancePerColor))*uLightStrength/10., fragmentColor.a);
            }
            else gl_FragColor = vec4(uAmbientColor + fragmentColor.rgb, fragmentColor.a);
        }
    }
}
