import * as PIXI from "pixi.js";
import {Main} from "../../../main";
import {AudioEngine} from "../../../Audio/AudioEngine";
export class Triangles extends PIXI.Container{

    private bgGradient: PIXI.FillGradient;
    private triangles: Triangle[] = [];
    private triangleGenInterval: NodeJS.Timeout;
    private graphics: PIXI.Graphics = new PIXI.Graphics();
    public flash: PIXI.Sprite;

    public constructor() {
        super();

        let colorStops = [0xff66ab, 0xcc5289];
        this.bgGradient = new PIXI.FillGradient(0, 0, 0, 1024);
        colorStops.forEach((number, index) =>
        {
            const ratio = index / colorStops.length;
            this.bgGradient.addColorStop(ratio, number);
        });
        function random(min: number, max: number){
            return Math.random() * (max - min) + min;
        }

        function randVelocity() {
            let u1 = 1 - random(0, 1);
            let u2 = 1 - random(0, 1);
            let randStdNormal = (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
            return Math.max(0.5 + 0.16 * randStdNormal, 0.1);
        }

        for (let i = 0; i < 15; i++) {
            this.triangles.push({x: random(0, 1024), y: random(0, 1024), velocity: randVelocity()});
        }

        this.triangleGenInterval = setInterval(() => {
            if (document.hasFocus()){
                this.triangles.push({x: random(0, 1024), y: 1024 - 50, velocity: randVelocity()});
            }

        }, 800);

        this.graphics.rect(0, 0, 1024, 1024);
        this.graphics.fill(this.bgGradient);
        this.addChild(this.graphics);

        this.flash = PIXI.Sprite.from("mainMenu.logoMask");
        //this.flash.anchor.set(0.5, 0.5);
        this.flash.alpha = 0;
        this.flash.blendMode = "add";

        this.addChild(this.flash);
    }

    public destroy(options?: PIXI.DestroyOptions) {
        super.destroy(options);
    }

    public draw(ticker: PIXI.Ticker) {
        if (!this.destroyed){
            if (document.hasFocus()){
                this.graphics.clear();
                this.graphics.rect(0, 0, 1024, 1024);
                this.graphics.fill(this.bgGradient);
                this.triangles.forEach((triangle, index) => {
                    triangle.y -= (ticker.deltaTime * triangle.velocity) * 4;
                    this.graphics.moveTo(triangle.x, triangle.y);
                    this.graphics.lineTo(triangle.x - 250, triangle.y + 400);
                    this.graphics.lineTo(triangle.x + 250, triangle.y + 400);
                    this.graphics.lineTo(triangle.x, triangle.y);
                    let alpha = 1;
                    if (triangle.y + 50 < 300) {
                        alpha = (triangle.y + 50) / 300;
                    }
                    alpha = Math.min(Math.max(alpha, 0), 1);
                    this.graphics.stroke({
                        color: new PIXI.Color("rgba(182, 52, 111, " + alpha.toFixed(6) + ")"),
                        width: 4
                    });
                    if (triangle.y + 400 < 0) {
                        this.triangles.splice(index, 1);
                    }
                });
            }
        }
    }
}

export interface Triangle {
    x: number;
    y: number;
    velocity: number;
}
