precision lowp float;

uniform sampler2D uSampler;

varying vec2 vTextureCoord;

void main(void) {
    vec4 fragmentColor;
    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(1., fragmentColor.gb, fragmentColor.a);

}
