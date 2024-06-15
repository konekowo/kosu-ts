in vec4 vColor;
in vec2 vUV;

uniform sampler2D uTexture;
uniform float progress;

void main() {
    vec4 color = texture2D(uTexture, vUV, -0.9);
    float a = vColor.a * color.a;
    gl_FragColor = (color.r < progress && a > 0.97) ? vec4(vColor.rgb * a, a) : vec4(0.0);
}
