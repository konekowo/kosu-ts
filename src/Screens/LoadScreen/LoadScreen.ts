import {Screen} from "../Screen";
import {LoadAnim} from "../../Elements/LoadAnim/LoadAnim";
import * as PIXI from "pixi.js";

export class LoadScreen extends Screen {

    private loadAnim = new LoadAnim("rgba(255,255,255,0.7)", "black");

    public start() {
        this.loadAnim.scale.set(0.8 * Screen.getScaleBasedOffScreenSize());
        this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.getWidth() - 15, this.getScreenHeight() - this.loadAnim.getHeight() - 15);
        this.addChild(this.loadAnim);
    }

    public draw(deltaTime: PIXI.Ticker) {
        this.loadAnim?.draw(deltaTime);
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            if (this.loadAnim != null) {
                this.loadAnim.destroy();
            }
            setTimeout(() => {
                resolve(this);
            }, 400);
        });
    }

    public onResize() {
        this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.getWidth() - 20, this.getScreenHeight() - this.loadAnim.getHeight() - 20);
        this.loadAnim.scale.set(0.8 * Screen.getScaleBasedOffScreenSize());
    }
}
