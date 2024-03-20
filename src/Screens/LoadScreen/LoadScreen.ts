import { Screen } from "../Screen";
import { LoadAnim } from "../../Elements/LoadAnim/LoadAnim";
import * as PIXI from "pixi.js";
import { set } from "husky";

export class LoadScreen extends Screen{

    private loadAnim: LoadAnim | undefined;

    public start() {
        this.loadAnim = new LoadAnim("white", "grey");
        this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.width - 20, this.getScreenHeight() - this.loadAnim.height - 20);
        this.loadAnim.scale.set(0.7, 0.7);
        this.addChild(this.loadAnim);
    }

    public draw(deltaTime: PIXI.Ticker) {
        this.loadAnim?.draw(deltaTime);
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            if (this.loadAnim != null){
                this.loadAnim.destroy();
            }
            setTimeout(() => {
                resolve(this);
            }, 400);
        });
    }

    public onResize() {
        if (this.loadAnim?.position != null) {
            this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.getWidth(), this.getScreenHeight() - this.loadAnim.getHeight());
        }
    }
}