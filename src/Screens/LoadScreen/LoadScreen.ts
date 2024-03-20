import { Screen } from "../Screen";
import { LoadAnim } from "../../Elements/LoadAnim/LoadAnim";
import * as PIXI from "pixi.js";
import { set } from "husky";
import {Settings} from "../../Settings/Settings";

export class LoadScreen extends Screen{

    private loadAnim: LoadAnim | undefined;

    public start() {
        this.loadAnim = new LoadAnim("white", "grey");
        let uiScale = Settings.getRangeSetting("UI scaling").getValue();
        this.loadAnim.scale.set(0.7 * uiScale, 0.7 * uiScale);
        this.loadAnim.position.set(this.getScreenWidth() - this.loadAnim.getWidth(), this.getScreenHeight() - this.loadAnim.getHeight());
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