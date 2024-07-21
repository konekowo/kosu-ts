import * as PIXI from "pixi.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";

export class GlitchingTriangles extends PIXI.Container{
    public constructor(bounds: GlitchingTrianglesBounds) {
        super();
        let triangle = new PIXI.Graphics();
        let scale = random(0.2, 1.2);
        triangle.moveTo(0,0);
        triangle.lineTo(-50 * scale, 100 * scale);
        triangle.lineTo(50 * scale, 100 * scale);
        triangle.lineTo(0, 0);
        if (Math.random() < 0.5){
            triangle.fill("white");
        }
        else {
            triangle.stroke({color: "white", width: 1});
        }

        //triangle.anchor.set(0.5, 0.5)
        function random(min: number, max: number){
            return Math.random() * (max - min) + min;
        }

        let randX = random(bounds.x1, bounds.x2);
        let randY = random(bounds.y1, bounds.y2);

        triangle.position.set(randX, randY);

        Ease.getEase(triangle, true).FadeOut(200, TWEEN.Easing.Linear.None);
        setTimeout(() => {
            this.destroy();
        }, 200);

        this.addChild(triangle);
    }

}
export interface GlitchingTrianglesBounds {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
