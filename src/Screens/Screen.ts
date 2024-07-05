import * as PIXI from "pixi.js";
import {Settings} from "../Settings/Settings";
export abstract class Screen extends PIXI.Container{

    public constructor() {
        super();
    }


    // Called once before any frame is drawn
    public abstract start(): void;

    // Called every frame
    public abstract draw(deltaTime: PIXI.Ticker): void;

    // Called when screen will be closed, but has to return a promise to clean up after, for example, the screen's close animations are done.
    // Make sure you also pass in 'this' into the promise's resolve.
    public abstract onClose(): Promise<Screen>;


    public abstract onResize(): void;


    protected getScreenWidth(): number {
        return window.innerWidth;
    }
    protected getScreenHeight(): number {
        return window.innerHeight;
    }

    public static getScaleBasedOffScreenSize() {
        // this was made with 1080p screens in mind.
        let uiScale = Settings.getRangeSetting("UI scaling").getValue();
        return ((((window.innerWidth/1920) + (window.innerHeight/1080))/2)) * uiScale
    }
}
