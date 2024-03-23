import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {RandomBackground} from "../../Elements/RandomBackground/RandomBackground";
import {OsuCircle} from "../../Elements/MainMenu/OsuCircle/OsuCircle";

export class MainMenu extends Screen {
    private bg = new RandomBackground();
    private osuCircle: OsuCircle = new OsuCircle();
    public start() {
        this.bg.start();
        this.addChild(this.bg);
        this.addChild(this.osuCircle);
    }
    public draw(deltaTime: PIXI.Ticker) {
        this.bg.draw(deltaTime);
        this.osuCircle.draw(deltaTime);
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            this.bg.onClose().then(() => {
                resolve(this);
            });
        })
    }

    public onResize() {
        this.osuCircle.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.bg.onResize();
    }
}
