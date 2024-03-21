import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {RandomBackground} from "../../Elements/RandomBackground/RandomBackground";
export class MainMenu extends Screen {
    private bg = new RandomBackground();
    public start() {
        this.bg.start();
        this.addChild(this.bg);
    }
    public draw(deltaTime: PIXI.Ticker) {
        this.bg.draw(deltaTime);
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            this.bg.onClose().then(() => {
                resolve(this);
            });
        })
    }

    public onResize() {
        this.bg.onResize();
    }
}
