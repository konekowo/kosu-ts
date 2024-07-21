import * as PIXI from "pixi.js";
import {Loader} from "../../Loader";
import {Screen} from "../../Screens/Screen";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";
import {Main} from "../../main";

export class RandomBackground extends Screen {

    private bgContainer = new PIXI.Container;

    private readonly parallaxMultiplier = 60;

    public start() {
        this.bgContainer.pivot.set(0.5, 0.5);
        this.bgContainer.position.set((Main.mousePos.x - (this.getScreenWidth() / 2)) / this.parallaxMultiplier,
            (Main.mousePos.y - (this.getScreenHeight() / 2)) / this.parallaxMultiplier);
        this.addChild(this.bgContainer);
        this.newRandomBG();
        Main.AudioEngine.addMusicChangeEventListener(() => {
            this.newRandomBG();
        });
    }

    public setBG(sprite: PIXI.Sprite) {
        if (this.bgContainer.children?.length == 0) {
            this.bgContainer.addChild(sprite);
        } else {
            let previous = this.bgContainer.children[0];
            sprite.zIndex = -1;
            this.bgContainer.addChild(sprite);
            Ease.getEase(previous, true).FadeOut(800, TWEEN.Easing.Linear.None).Then(() => {
                sprite.zIndex = 0;
                previous.destroy();
            });
        }
        sprite.anchor.set(0.5, 0.5);
        this.onResize();

    }

    public newRandomBG() {
        function random(min: number, max: number) {
            return Math.round(Math.random() * (max - min) + min);
        }

        let useSeasonalBackgrounds = Loader.seasonalBackgroundsNum > 0;
        let randomNum = random(1, useSeasonalBackgrounds ? Loader.seasonalBackgroundsNum : Loader.defaultBackgroundsNum);
        this.setBG(PIXI.Sprite.from((useSeasonalBackgrounds ? "seasonal_bg" : "default_bg") + randomNum));
    }

    public draw(deltaTime: PIXI.Ticker) {
        this.bgContainer.position.set((Main.mousePos.x - (this.getScreenWidth() / 2)) / this.parallaxMultiplier,
            (Main.mousePos.y - (this.getScreenHeight() / 2)) / this.parallaxMultiplier);
    }

    public onClose(): Promise<Screen> {
        return Promise.resolve(this);
    }

    public onResize() {
        this.bgContainer.children.forEach((sprite) => {
            if (sprite instanceof PIXI.Sprite) {
                let texWidth = sprite.texture.width;
                let texHeight = sprite.texture.height;

                let scaleFactor: number;
                if (window.innerWidth > window.innerHeight) {
                    scaleFactor = window.innerWidth / texWidth;
                } else {
                    scaleFactor = window.innerHeight / texHeight;
                }

                if (texHeight * scaleFactor < window.innerHeight) {
                    scaleFactor = window.innerHeight / texHeight;
                } else if (texWidth * scaleFactor < window.innerWidth) {

                }

                sprite.scale.set(scaleFactor + 0.05);
                sprite.position.set((this.getScreenWidth() / 2) - (this.getScreenWidth() / (this.parallaxMultiplier * 2)),
                    this.getScreenHeight() / 2 - (this.getScreenHeight() / (this.parallaxMultiplier * 2)));
            }
        });


    }

}
