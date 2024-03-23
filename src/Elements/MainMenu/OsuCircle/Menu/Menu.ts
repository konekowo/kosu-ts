import * as PIXI from "pixi.js";
import {ease} from "pixi-ease";
export class Menu extends PIXI.Container {

    private menuBG = new PIXI.Graphics();

    public constructor() {
        super();
        this.menuBG.rect(0, -62.5, 1, 125);
        this.menuBG.fill({color: "rgb(50,50,50)"});
        this.menuBG.scale.set(1, 0);
        this.menuBG.alpha = 0;
        this.addChild(this.menuBG);
    }

    public Open() {
        ease.add(this.menuBG, {scaleY: 1, alpha: 1}, {duration: 400, ease: "easeOutQuint"});
    }

    public Close() {
        ease.add(this.menuBG, {scaleY: 0, alpha: 0}, {duration: 300, ease: "easeInSine"});
    }

    public onResize() {
        this.position.set(-window.innerWidth/2, 0);
        this.menuBG.width = window.innerWidth;
    }
}
