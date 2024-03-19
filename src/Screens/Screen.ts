import * as PIXI from "pixi.js";
export abstract class Screen extends PIXI.Container{
    // Called once before any frame is drawn
    public abstract start(): void;

    // Called every frame
    public abstract draw(deltaTime: number): void;

    // Called when screen will be closed, but has to return a promise to clean up after, for example, the screen's close animations are done.
    // Make sure you also pass in 'this' into the promise's resolve.
    public abstract onClose(): Promise<Screen>;


    public abstract onResize(): void;


    protected getScreenWidth() {
        return window.innerWidth;
    }
    protected getScreenHeight() {
        return window.innerHeight;
    }
}