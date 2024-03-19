import * as PIXI from "pixi.js";
import { Ease, ease } from 'pixi-ease';
import { Graphics } from "pixi.js";
import { Main } from "../main";

export class LoadAnim extends PIXI.Container {
    private readonly bg: PIXI.Graphics;
    private readonly arc: PIXI.Graphics;
    private readonly animInterval: NodeJS.Timeout;
    public constructor(bgColor: string, arcColor: string) {
        super();
        this.alpha = 0;
        this.rotation = Math.PI*2.5
        this.bg = new Graphics();
        this.bg.roundRect(-50, -50, 100, 100, 25);
        this.bg.fill(bgColor);
        this.addChild(this.bg);
        this.arc = new Graphics();
        this.arc.arc(0, 0, 30, Math.PI + .26, 2.92 * Math.PI);
        this.arc.stroke({
            width: 10,
            color: arcColor,
            cap: "round"
        });
        this.arc.scale.set(-1, 1)
        this.addChild(this.arc);
        ease.add(this, {alpha: 1}, {duration: 200, ease: 'easeInOutQuad'});

        this.doAnims();

        this.animInterval = setInterval(() => {
            this.doAnims();
        }, 800);
    }

    public doAnims() {
        ease.add(this.bg, {rotation: this.bg.rotation + Math.PI/2}, {duration: 600, ease: 'easeInOutQuad'});
        ease.add(this.arc, {rotation: this.arc.rotation + Math.PI}, {duration: 800, ease: 'easeInOutCubic'});
    }

    public getWidth() {
        return 100 * this.scale.x;
    }

    public getHeight() {
        return 100 * this.scale.y;
    }

    public destroy(_options?: PIXI.DestroyOptions | boolean) {
        ease.add(this, {alpha: 0}, {duration: 200, ease: 'easeInOutQuad'});
        setTimeout(() => {
            clearInterval(this.animInterval);
            super.destroy(_options);
        }, 200);
    }

}