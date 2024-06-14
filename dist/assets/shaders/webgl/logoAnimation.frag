in vec4 vColor;
in vec2 vUV;

uniform sampler2D uTexture;
uniform float progress;

void main() {
    vec4 color = texture2D(uTexture, vUV, -0.9);
    gl_FragColor = color.r < progress ? vec4(vColor.rgb * color.a, vColor.a * color.a) : vec4(0.0);
}
