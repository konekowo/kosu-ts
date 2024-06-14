import * as PIXI from "pixi.js";
import {Loader} from "../../Loader";
import {ease} from "pixi-ease";

export class LazerLogo extends PIXI.Container {
    private readonly shaderHighlight: PIXI.Shader;
    private readonly shaderBackground: PIXI.Shader;
    private textureHighlight = PIXI.Texture.from("intro_triangles_osuLogo_anim_highlight");
    private textureBackground = PIXI.Texture.from("intro_triangles_osuLogo_anim_background");

    public constructor() {
        super();
        const frag = Loader.GetString("webgl:shaders/logoAnimation.frag");
        const vert = Loader.GetString("webgl:shaders/logoAnimation.vert");
        this.shaderHighlight = PIXI.Shader.from({
            gl: {
                vertex: vert,
                fragment: frag,
            },
            resources: {
                uTexture: this.textureHighlight.source,
                uProgress: {
                    progress: { value: 0.0, type: 'f32' },
                },
            },
        });
        this.shaderBackground = PIXI.Shader.from({
            gl: {
                vertex: vert,
                fragment: frag,
            },
            resources: {
                uTexture: this.textureBackground.source,
                uProgress: {
                    progress: { value: 0.0, type: 'f32' },
                },
            },
        });
    }

    public start() {
        const quadGeometryHighlight = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -this.textureHighlight.width/2,
                    -this.textureHighlight.height/2, // x, y
                    this.textureHighlight.width/2,
                    -this.textureHighlight.height/2, // x, y
                    this.textureHighlight.width/2,
                    this.textureHighlight.width/2, // x, y,
                    -this.textureHighlight.width/2,
                    this.textureHighlight.width/2, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColor: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });

        const quadHighlight = new PIXI.Mesh({
            geometry: quadGeometryHighlight,
            shader: this.shaderHighlight,
        });
        this.addChild(quadHighlight);
        const quadGeometryBackground = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -this.textureBackground.width/2,
                    -this.textureBackground.height/2, // x, y
                    this.textureBackground.width/2,
                    -this.textureBackground.height/2, // x, y
                    this.textureBackground.width/2,
                    this.textureBackground.width/2, // x, y,
                    -this.textureBackground.width/2,
                    this.textureBackground.width/2, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColor: [0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });

        const quadBackground = new PIXI.Mesh({
            geometry: quadGeometryBackground,
            shader: this.shaderBackground,
        });
        this.addChild(quadBackground);


        let dummy = new PIXI.Container();
        dummy.scale.set(0.0, 0.0);
        let anim = ease.add(dummy, {scale: 1}, {duration: 920, ease: "linear"});
        anim.on('each', () => {
            this.shaderHighlight.resources.uProgress.uniforms.progress = dummy.scale.x;
            this.shaderBackground.resources.uProgress.uniforms.progress = dummy.scale.x;
        });
    }
}
