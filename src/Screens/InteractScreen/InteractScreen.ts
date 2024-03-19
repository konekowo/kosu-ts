import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";
import {Main} from "../../main";
import {IntroScreen} from "../IntroScreen/IntroScreen";
import {ease} from 'pixi-ease';

export class InteractScreen extends Screen {

    private text: PIXI.Text = new PIXI.Text({
        text: "Click here to play!",
        style: {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: "white"
        }
    });

    private readonly introTrack: Blob;

    public constructor(introTrack: Blob) {
        super();
        this.introTrack = introTrack;
    }

    public start() {
        this.text.anchor.set(0.5, 0.5);
        this.text.scale.set(0.5, 0.5);
        this.text.alpha = 0;
        this.text.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.addChild(this.text);
        this.text.eventMode = "static";
        this.text.cursor = "pointer";
        this.text.onclick = () => {
            Main.switchScreen(new IntroScreen(this.introTrack));
        }
        ease.add(this.text, {alpha: 1, scale: 1}, {duration: 300, ease: "easeInOutQuad"});
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            ease.add(this.text, {alpha: 0, scale: 0.5}, {duration: 300, ease: "easeInOutQuad"});
            setTimeout(() => {
                resolve(this);
            },300);
        });
    }

    public draw(deltaTime: Ticker) {

    }

    public onResize() {
        this.text.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
    }
}