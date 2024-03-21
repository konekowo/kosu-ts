import * as PIXI from "pixi.js";
import { Ease, ease } from 'pixi-ease';

export class LoadAnim extends PIXI.Container {
    private readonly bg: PIXI.Graphics;
    private readonly arc: PIXI.Graphics;
    private readonly arcContainer: PIXI.Container;
    private readonly animInterval: NodeJS.Timeout;
    private readonly container: PIXI.Container;
    private readonly bgContainer: PIXI.Container;
    private bgRotation: number = 0;
    public constructor(bgColor: string, arcColor: string) {
        super();
        this.pivot.set(0.5, 0.5);
        this.container = new PIXI.Container();
        this.container.alpha = 0;
        this.rotation = Math.PI*2.5;
        this.bgContainer = new PIXI.Container();
        this.bg = new PIXI.Graphics();
        this.bg.roundRect(-50, -50, 100, 100, 25);
        this.bg.fill(bgColor);
        this.arcContainer = new PIXI.Container();
        this.arc = new PIXI.Graphics();
        this.arc.arc(0, 0, 27, Math.PI + .26, 2.92 * Math.PI);
        this.arc.stroke({
            width: 8,
            color: arcColor,
            cap: "round"
        });
        this.arc.scale.set(-1, 1);
        this.container.scale.set(0.5, 0.5);
        this.bgContainer.addChild(this.bg);
        this.arcContainer.addChild(this.arc);
        this.bgContainer.addChild(this.arcContainer);
        this.container.addChild(this.bgContainer);
        this.addChild(this.container);
        ease.add(this.container, {alpha: 1, scale: 1}, {duration: 400, ease: 'easeInOutQuad'});
        this.doAnims();

        this.animInterval = setInterval(() => {
            this.doAnims();
        }, 800);
    }

    public doAnims() {
        this.bgRotation += 90;
        ease.add(this.bgContainer, {angle: this.bgRotation}, {duration: 600, ease: 'easeInOutQuad'});
    }

    public getWidth() {
        return 100 * this.scale.x;
    }

    public getHeight() {
        return 100 * this.scale.y;
    }

    public draw(deltaTime: PIXI.Ticker){
        this.arcContainer.angle += (3 * deltaTime.deltaTime);
    }

    public destroy(_options?: PIXI.DestroyOptions | boolean) {
        ease.add(this.container, {alpha: 0, scale: 0.5}, {duration: 400, ease: 'easeInOutQuad'});
        setTimeout(() => {
            clearInterval(this.animInterval);
            super.destroy(_options);
        }, 400);
    }

}
