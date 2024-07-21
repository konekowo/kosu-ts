import * as PIXI from "pixi.js";
import {ease, Easing} from "pixi-ease";

export class Menu extends PIXI.Container {

    private menuBG = new PIXI.Graphics();
    private isOpened = false;
    private openAnim: Easing | undefined;

    public constructor() {
        super();
        this.menuBG.rect(0, -62.5, 1, 125);
        this.menuBG.fill({color: "rgb(50,50,50)"});
        this.menuBG.scale.set(1, 0);
        this.menuBG.alpha = 0;
        this.addChild(this.menuBG);

    }

    public Open() {
        this.isOpened = true;
        this.openAnim = ease.add(this.menuBG, {scaleY: 1, alpha: 1}, {duration: 400, ease: "easeOutQuint"});
    }

    public Close() {
        this.isOpened = false;
        if (this.openAnim) {
            this.openAnim.remove();
        }
        ease.add(this.menuBG, {scaleY: 0, alpha: 0}, {duration: 300, ease: "easeInSine"});
    }

    public isOpen() {
        return this.isOpened;
    }

    public onResize() {
        this.position.set(-window.innerWidth, 0);
        this.menuBG.width = window.innerWidth * 2;
    }
}
