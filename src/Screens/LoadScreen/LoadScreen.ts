import { Screen } from "../Screen";
import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

export class LoadScreen extends Screen{

    private readonly graphics: PIXI.Graphics = new Graphics();

    public start() {
        this.graphics.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.graphics.beginFill("red");
        this.graphics.drawRect(-150/2, -150/2, 150, 150);
        this.addChild(this.graphics);

    }

    public draw(deltaTime: number) {
        //console.log(this);
        this.graphics.rotation += deltaTime * 0.05;
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            resolve(this);
        });
    }

    public onResize() {
        this.graphics.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
    }
}