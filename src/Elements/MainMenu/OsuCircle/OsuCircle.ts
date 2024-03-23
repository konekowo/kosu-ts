import * as PIXI from "pixi.js";
import {Triangles} from "./Triangles";
import {ease} from "pixi-ease";

export class OsuCircle extends PIXI.Container {

    private readonly outline: PIXI.Sprite;
    private readonly triangles: Triangles = new Triangles();
    private readonly beatContainer: PIXI.Container = new PIXI.Container();
    private readonly hoverContainer: PIXI.Container = new PIXI.Container();

    public constructor() {
        super();
        this.outline = PIXI.Sprite.from("mainMenu.logoOutline");
        this.outline.anchor.set(0.5, 0.5);
        //approximation of size in actual osu!lazer
        let scale = 0.6;

        let mask = PIXI.Sprite.from("mainMenu.logoMask");
        mask.anchor.set(0.5, 0.5);
        mask.scale = scale;

        this.outline.scale.set(scale);
        this.triangles.scale.set(scale);
        this.triangles.position.set(-(this.outline.width/2), -(this.outline.height/2));
        this.triangles.mask = mask;
        this.beatContainer.addChild(this.triangles);
        this.beatContainer.addChild(mask);
        this.beatContainer.addChild(this.outline);
        this.hoverContainer.addChild(this.beatContainer);
        this.addChild(this.hoverContainer);
        this.hoverContainer.eventMode = "dynamic";

        this.hoverContainer.addEventListener("mouseenter", () => {
           ease.add(this.hoverContainer, {scale: 1.1}, {duration: 500, ease: "easeOutElastic"})
        });
        this.hoverContainer.addEventListener("mouseleave", () => {
            ease.add(this.hoverContainer, {scale: 1}, {duration: 500, ease: "easeOutElastic"})
        });

    }

    public draw(ticker: PIXI.Ticker) {
        this.triangles.draw(ticker);
    }

}
