in vec4 vColor;
in vec2 vUV;

uniform sampler2D uTexture;
uniform float progress;

void main() {
    vec4 color = texture2D(uTexture, vUV);
    float a = vColor.a * color.a;
    vec4 _vColor = vec4(smoothstep(0.88, 1.0, color.a))*vColor;
    vec4 outColor = (color.r < progress) ? vec4(_vColor.rgb * a, a) : vec4(0.0);
    gl_FragColor = outColor;
}
