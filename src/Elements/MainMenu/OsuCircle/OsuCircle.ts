import * as PIXI from "pixi.js";
import {Triangles} from "./Triangles";
import {Ease, ease, Easing} from "pixi-ease";
import {Main} from "../../../main";

export class OsuCircle extends PIXI.Container {

    private readonly outline: PIXI.Sprite;
    private readonly triangles: Triangles = new Triangles();
    private readonly beatContainer: PIXI.Container = new PIXI.Container();
    private readonly hoverContainer: PIXI.Container = new PIXI.Container();
    private readonly moveContainer: PIXI.Container = new PIXI.Container();
    private isBeingHovered = false;

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
        this.moveContainer.addChild(this.hoverContainer);
        this.addChild(this.moveContainer);
        this.hoverContainer.eventMode = "dynamic";
        this.hoverContainer.hitArea = new PIXI.Circle(0, 0, 500*scale);

        const mouseEnter = () => {
            this.isBeingHovered = true;
            ease.add(this.hoverContainer, {scale: 1.1}, {duration: 500, ease: "easeOutElastic"});
        }

        if (this.hoverContainer.hitArea.contains(Main.mousePos.x, Main.mousePos.y)){
            mouseEnter();
        }

        this.hoverContainer.addEventListener("mouseenter", () => {
            mouseEnter();
        });
        this.hoverContainer.addEventListener("mouseleave", () => {
            this.isBeingHovered = false;
            ease.add(this.hoverContainer, {scale: 1}, {duration: 500, ease: "easeOutElastic"})
        });
        let mouseDownEase: Easing;
        this.hoverContainer.addEventListener("mousedown", () => {
            mouseDownEase = ease.add(this.hoverContainer, {scale: 0.9}, {duration: 1000, ease: "easeOutSine"});
        });

        const mouseUp = () => {
            mouseDownEase.remove();
            ease.add(this.hoverContainer, {scale: this.isBeingHovered? 1.1 : 1}, {duration: 500, ease: "easeOutElastic"});
        }
        this.hoverContainer.addEventListener("mouseup", () => {
            mouseUp();
        });


        let menuOpenAnim0: Easing;
        let menuOpenAnim1: Easing;
        let menuCloseAnim0: Easing;
        let menuCloseAnim1: Easing;

        this.hoverContainer.addEventListener("click", () => {
            this.isBeingHovered = false;
            mouseUp();
            if (menuCloseAnim0){
                menuCloseAnim0.remove();
            }
            if (menuCloseAnim1){
                menuCloseAnim1.remove()
            }
            menuOpenAnim0 = ease.add(this.moveContainer, {position: {x: -this.position.x/2, y: 0}}, {duration: 200, ease: "easeInSine"});
            menuOpenAnim1 = ease.add(this.moveContainer, {scale: 0.5}, {duration: 200, ease: "easeInSine"});
        });

        window.addEventListener("keyup", (e) => {
           if (e.key == "Escape"){
               menuOpenAnim0.remove();
               menuOpenAnim1.remove();
               menuCloseAnim0 = ease.add(this.moveContainer, {position: {x: 0, y: 0}}, {duration: 800, ease: "easeOutExpo"});
               menuCloseAnim1 = ease.add(this.moveContainer, {scale: 1}, {duration: 800, ease: "easeOutExpo"});
           }
        });


    }

    public draw(ticker: PIXI.Ticker) {
        this.triangles.draw(ticker);
    }

}
