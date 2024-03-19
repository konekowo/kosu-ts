import { Screen } from "../Screen";
import { LoadAnim } from "../../LoadAnim/LoadAnim";
import * as PIXI from "pixi.js";
import { set } from "husky";

export class LoadScreen extends Screen{

    private loadAnim: LoadAnim | undefined;

    public start() {
        this.loadAnim = new LoadAnim("white", "pink");
        this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.width, this.getScreenHeight() - this.loadAnim.height);
        this.addChild(this.loadAnim);
    }

    public draw(deltaTime: PIXI.Ticker) {
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            if (this.loadAnim != null){
                this.loadAnim.destroy();
            }
            setTimeout(() => {
                resolve(this);
            }, 200);
        });
    }

    public onResize() {
        if (this.loadAnim != null) {
            this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.getWidth(), this.getScreenHeight() - this.loadAnim.getHeight());
        }
    }
}