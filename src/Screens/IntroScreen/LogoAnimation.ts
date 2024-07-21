import * as PIXI from "pixi.js"
import {Loader} from "../../Loader";

export class LogoAnimation extends PIXI.Container {
    private shader: PIXI.Shader;
    private texture: PIXI.Texture;

    public constructor(texture: PIXI.Texture, color: PIXI.Color) {
        super();
        this.texture = texture
        const frag = Loader.GetString("webgl:shaders/logoAnimation.frag");
        const vert = Loader.GetString("webgl:shaders/logoAnimation.vert");
        this.shader = PIXI.Shader.from({
            gl: {
                vertex: vert,
                fragment: frag,
            },
            resources: {
                uTexture: this.texture.source,
                uProgress: {
                    progress: {value: 0.0, type: 'f32'},
                },
            },
        });
        const quadGeometry = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -this.texture.width / 2,
                    -this.texture.height / 2, // x, y
                    this.texture.width / 2,
                    -this.texture.height / 2, // x, y
                    this.texture.width / 2,
                    this.texture.width / 2, // x, y,
                    -this.texture.width / 2,
                    this.texture.width / 2, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColor: [
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha
                ]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });
        const quad = new PIXI.Mesh({
            geometry: quadGeometry,
            shader: this.shader,
        });
        this.addChild(quad);
    }

    public setProgress(progress: number) {
        this.shader.resources.uProgress.uniforms.progress = progress;
    }
}
