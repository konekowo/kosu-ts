import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
export class MainMenu extends Screen {
    public start() {
    }
    public draw(deltaTime: PIXI.Ticker) {
    }

    public onClose(): Promise<Screen> {
        return Promise.resolve(this);
    }

    public onResize() {
    }
}
