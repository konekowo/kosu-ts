import * as PIXI from "pixi.js";
import {Triangles} from "./Triangles";
import {Ease, ease, Easing} from "pixi-ease";
import {Main} from "../../../main";
import {Loader} from "../../../Loader";
import {Menu} from "./Menu/Menu";
import {MenuLogoVisualizer} from "../../AudioVisualizers/impl/MenuLogoVisualizer";
import {LogoVisualizer} from "../../AudioVisualizers/LogoVisualizer";

export class OsuCircle extends PIXI.Container {

    private readonly outline: PIXI.Sprite;
    private readonly visualizer: MenuLogoVisualizer = new MenuLogoVisualizer();
    private readonly triangles: Triangles = new Triangles();
    private readonly beatContainer: PIXI.Container = new PIXI.Container();
    private readonly hoverContainer: PIXI.Container = new PIXI.Container();
    private readonly moveContainer: PIXI.Container = new PIXI.Container();
    private readonly parallaxContainer: PIXI.Container = new PIXI.Container();
    private readonly menu: Menu = new Menu();
    private isBeingHovered = false;

    public constructor() {
        super();
        this.visualizer.start();


        this.outline = PIXI.Sprite.from("mainMenu.logoOutline");
        this.outline.anchor.set(0.5, 0.5);
        //approximation of size in actual osu!lazer
        let scale = 0.6;
        this.visualizer.position.set(-LogoVisualizer.size/3.35, -LogoVisualizer.size/3.35);
        this.visualizer.scale.set(scale);
        this.beatContainer.addChild(this.visualizer);

        let mask = PIXI.Sprite.from("mainMenu.logoMask");
        mask.anchor.set(0.5, 0.5);
        mask.scale = scale;


        let flash = PIXI.Sprite.from("mainMenu.logoMask");
        flash.anchor.set(0.5, 0.5);
        flash.scale = scale;
        flash.blendMode = "add";
        flash.alpha = 0;

        this.outline.scale.set(scale);
        this.triangles.scale.set(scale);
        this.triangles.position.set(-(this.outline.width/2), -(this.outline.height/2));
        this.triangles.mask = mask;
        this.parallaxContainer.addChild(this.menu);
        this.beatContainer.addChild(this.triangles);
        this.beatContainer.addChild(mask);
        this.beatContainer.addChild(flash);
        this.beatContainer.addChild(this.outline);
        this.hoverContainer.addChild(this.beatContainer);
        this.moveContainer.addChild(this.hoverContainer);
        this.parallaxContainer.addChild(this.moveContainer);
        this.addChild(this.parallaxContainer)
        this.hoverContainer.eventMode = "dynamic";
        this.hoverContainer.hitArea = new PIXI.Circle(0, 0, 500*scale);


        let selectSample = Loader.GetAudio("mainMenu.osuLogo.select");
        let backToLogoSample = Loader.GetAudio("mainMenu.osuLogo.backToLogo");
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
            if (mouseDownEase){
                mouseDownEase.remove();
            }
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
            if (!this.menu.isOpen()){
                this.isBeingHovered = false;
            }
            mouseUp();
            if (!this.menu.isOpen()){
                if (menuCloseAnim0){
                    menuCloseAnim0.remove();
                }
                if (menuCloseAnim1){
                    menuCloseAnim1.remove()
                }
            }
            flash.alpha = 0.4;
            ease.add(flash, {alpha: 0}, {duration:1500, ease: "easeOutExpo"});
            if (!this.menu.isOpen()){
                Main.AudioEngine.PlayEffect(selectSample);

                menuOpenAnim0 = ease.add(this.moveContainer, {position: {x: -250, y: 0}}, {duration: 200, ease: "easeInSine"}).once("complete", () => {
                    this.menu.Open();
                });
                menuOpenAnim1 = ease.add(this.moveContainer, {scale: 0.5}, {duration: 200, ease: "easeInSine"});
            }
        });

        window.addEventListener("keyup", (e) => {
           if (e.key == "Escape" || e.key == "`"){
               if (this.menu.isOpen()){
                   menuOpenAnim0.remove();
                   menuOpenAnim1.remove();
                   Main.AudioEngine.PlayEffect(backToLogoSample);
                   this.menu.Close();
                   menuCloseAnim0 = ease.add(this.moveContainer, {position: {x: 0, y: 0}}, {duration: 800, ease: "easeOutExpo"});
                   menuCloseAnim1 = ease.add(this.moveContainer, {scale: 1}, {duration: 800, ease: "easeOutExpo"});
               }
           }
        });


    }

    public onResize() {
        this.menu.onResize();
    }

    public draw(ticker: PIXI.Ticker) {
        this.visualizer.draw(ticker);
        this.triangles.draw(ticker);
        if (this.menu.isOpen()){
            this.parallaxContainer.position.set(Main.mousePos.x/120, Main.mousePos.y/120);
        }
        else {
            this.parallaxContainer.position.set(0,0);
        }
    }

}
