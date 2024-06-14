import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {Loader} from "../../Loader";
//import frag from "./logoAnimation.frag";
//import vert from "./logoAnimation.vert";

export class LogoAnimation extends Screen {
    private readonly shader: PIXI.Shader;
    private texture = PIXI.Texture.from("intro_triangles_osuLogo_anim_highlight");

    public constructor() {
        const frag = Loader.GetString("webgl:shaders/logoAnimation.frag");
        const vert = Loader.GetString("webgl:shaders/logoAnimation.vert");
        super();
        this.shader = PIXI.Shader.from({
            gl: {
                vertex: vert,
                fragment: frag,
            },
            resources: {
                uTexture: this.texture.source,
                uProgress: {
                    progress: { value: 0.0, type: 'f32' },
                },
            },
        });
    }

    public start() {
        const quadGeometry = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -400,
                    -400, // x, y
                    400,
                    -400, // x, y
                    400,
                    400, // x, y,
                    -400,
                    400, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColor: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });

        const quad = new PIXI.Mesh({
            geometry: quadGeometry,
            shader: this.shader,
        });
        quad.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.addChild(quad);
    }

    public draw(deltaTime: PIXI.Ticker): void {
        this.shader.resources.uProgress.uniforms.progress += 0.01 * deltaTime.deltaTime;
    }

    public onClose(): Promise<Screen> {
        return Promise.resolve(this);
    }

    public onResize(): void {
    }
}
