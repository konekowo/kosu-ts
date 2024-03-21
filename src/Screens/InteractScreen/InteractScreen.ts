import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";
import {Main} from "../../main";
import {IntroScreen} from "../IntroScreen/IntroScreen";
import {ease} from 'pixi-ease';

export class InteractScreen extends Screen {

    private readonly text: PIXI.Text;

    private readonly introTrack: Blob;

    private readonly clickArea: PIXI.Graphics = new PIXI.Graphics();

    public constructor(introTrack: Blob) {
        super();
        this.introTrack = introTrack;
        this.text = new PIXI.Text({
            text: "Click anywhere to play!",
            style: {
                fontFamily: 'TorusRegular',
                fontSize: 36,
                fill: "white"
            }
        });
    }

    public start() {
        this.text.anchor.set(0.5, 0.5);
        this.text.scale.set(0.5, 0.5);
        this.text.alpha = 0;
        this.text.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.addChild(this.text);

        this.clickArea.rect(0, 0, 1, 1);
        this.clickArea.fill("rgba(0,0,0,0)");
        this.clickArea.width = this.getScreenWidth();
        this.clickArea.height = this.getScreenHeight();
        this.clickArea.position.set(0, 0);
        this.addChild(this.clickArea);

        this.clickArea.eventMode = "static";
        this.clickArea.cursor = "pointer";
        this.clickArea.onclick = () => {
            Main.switchScreen(new IntroScreen(this.introTrack));
        }
        this.clickArea.ontap = () => {
            Main.switchScreen(new IntroScreen(this.introTrack));
        }
        ease.add(this.text, {alpha: 1, scale: 1}, {duration: 300, ease: "easeInOutQuad"});
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            ease.add(this.text, {alpha: 0, scale: 0.5}, {duration: 200, ease: "easeOutQuad"});
            setTimeout(() => {
                resolve(this);
            },200);
        });
    }

    public draw(deltaTime: Ticker) {

    }

    public onResize() {
        this.text.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.clickArea.width = this.getScreenWidth();
        this.clickArea.height = this.getScreenHeight();
        this.clickArea.position.set(0, 0);
    }
}
