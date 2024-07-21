import * as PIXI from "pixi.js";
import {Triangles} from "./Triangles";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../../Util/TweenWrapper/Ease";
import {Main} from "../../../main";
import {Loader} from "../../../Loader";
import {Menu} from "./Menu/Menu";
import {MenuLogoVisualizer} from "../../AudioVisualizers/impl/MenuLogoVisualizer";
import {LogoVisualizer} from "../../AudioVisualizers/LogoVisualizer";
import {Effect} from "../../../Util/Beatmap/Data/Sections/TimingPoints/Effect";
import {UnInheritedTimingPoint} from "../../../Util/Beatmap/Data/Sections/TimingPoints/UnInheritedTimingPoint";
import {MathUtil} from "../../../Util/MathUtil";

export class OsuCircle extends PIXI.Container {

    private readonly outline: PIXI.Sprite;
    private readonly visualizer: MenuLogoVisualizer = new MenuLogoVisualizer();
    private readonly triangles: Triangles = new Triangles();
    private readonly flash;
    private readonly logoContainer = new PIXI.Container;
    private readonly logoBounceContainer = new PIXI.Container();
    private readonly logoBeatContainer = new PIXI.Container();
    private readonly logoAmplitudeContainer = new PIXI.Container();
    private readonly logoHoverContainer = new PIXI.Container();
    private readonly rippleContainer = new PIXI.Container();
    private readonly ripple;
    private readonly menu: Menu = new Menu();
    private readonly defaultVisualizerAlpha = 0.5;
    private readonly early_activation = 60;
    private timeElapsedSinceLastBeat = 0;

    private selectSample = Loader.GetAudio("mainMenu.osuLogo.select");
    private backToLogoSample = Loader.GetAudio("mainMenu.osuLogo.backToLogo");

    private isMouseDown = false;
    private mouseDownPosition = {x: 0, y: 0};


    public constructor() {
        super();
        this.visualizer.start();


        this.outline = PIXI.Sprite.from("mainMenu.logoOutline");
        this.outline.anchor.set(0.5, 0.5);
        //approximation of size in actual osu!lazer
        let scale = 0.6;
        this.visualizer.position.set(-LogoVisualizer.size / 3.35, -LogoVisualizer.size / 3.35);
        this.visualizer.scale.set(scale);
        this.visualizer.alpha = this.defaultVisualizerAlpha;

        let mask = PIXI.Sprite.from("mainMenu.logoMask");
        mask.anchor.set(0.5, 0.5);
        mask.scale = scale;


        this.flash = PIXI.Sprite.from("mainMenu.logoMask");
        this.flash.anchor.set(0.5, 0.5);
        this.flash.scale = scale;
        this.flash.blendMode = "add";
        this.flash.alpha = 0;

        this.outline.scale.set(scale);
        this.triangles.scale.set(scale);
        this.triangles.position.set(-(this.outline.width / 2), -(this.outline.height / 2));
        this.triangles.mask = mask;

        this.ripple = PIXI.Sprite.from("mainMenu.logoMask");
        this.ripple.anchor.set(0.5, 0.5);
        this.ripple.scale = scale;
        this.ripple.alpha = 0;
        this.ripple.blendMode = "add";

        this.rippleContainer.addChild(this.ripple);
        this.logoContainer.addChild(this.visualizer);
        this.logoContainer.addChild(this.triangles);
        this.logoContainer.addChild(mask);
        this.logoContainer.addChild(this.flash);
        this.logoContainer.addChild(this.outline);
        this.logoContainer.hitArea = new PIXI.Circle(0, 0, 480 * scale);
        this.logoContainer.eventMode = "static";

        this.logoBeatContainer.addChild(this.logoContainer);
        this.logoAmplitudeContainer.addChild(this.logoBeatContainer);
        this.logoBounceContainer.addChild(this.rippleContainer);
        this.logoBounceContainer.addChild(this.logoAmplitudeContainer);
        this.logoHoverContainer.addChild(this.logoBounceContainer);
        this.addChild(this.logoHoverContainer)

        // register event listeners
        Main.app.stage.addEventListener("mouseup", (e) => {
            this._onmouseup(e);
        });

    }


    public onmouseenter = (e: PIXI.FederatedMouseEvent) => {
        Ease.getEase(this.logoHoverContainer).ScaleTo(1.1, 500, TWEEN.Easing.Elastic.Out);
    }

    public onmouseleave = (e: PIXI.FederatedMouseEvent) => {
        Ease.getEase(this.logoHoverContainer).ScaleTo(1, 500, TWEEN.Easing.Elastic.Out);
    }

    public onmousedown = (e: PIXI.FederatedMouseEvent) => {
        this.isMouseDown = true;
        Ease.getEase(this.logoBounceContainer).ClearEasings().ScaleTo(0.9, 1000, TWEEN.Easing.Sinusoidal.Out);
        this.mouseDownPosition = {x: Main.mousePos.x, y: Main.mousePos.y};
    }

    public onclick = (e: PIXI.FederatedMouseEvent) => {
        this.flash.alpha = 0.4;
        Ease.getEase(this.flash).ClearEasings()
            .FadeOut(1500, TWEEN.Easing.Exponential.Out);
    }

    public _onmouseup = (e: PIXI.FederatedMouseEvent) => {
        this.isMouseDown = false;
        Ease.getEase(this.logoBounceContainer).ClearEasings().ScaleTo(1, 500, TWEEN.Easing.Elastic.Out)
            .TransformTo({x: 0, y: 0}, 800, TWEEN.Easing.Elastic.Out);
    }

    public onResize() {
        this.menu.onResize();
    }

    public draw(ticker: PIXI.Ticker) {
        this.visualizer.draw(ticker);
        this.triangles.draw(ticker);
        this.timeElapsedSinceLastBeat += ticker.deltaMS;
        let audio = Main.AudioEngine.GetCurrentPlayingMusic();
        let timingPoint = audio ? audio.beatmap.TimingPoints.GetCurrentUninheritedTimingPoint(Date.now() - audio.timeStarted) : new UnInheritedTimingPoint();
        if (!audio) {
            timingPoint.beatLength = 1000;
            timingPoint.effects = Effect.None;
        }
        if (audio) {
            let maxAmplitude = audio.GetMaximumAudioLevel();
            this.logoAmplitudeContainer.scale.set(MathUtil.Damp(this.logoAmplitudeContainer.scale.x,
                1 - Math.max(0, maxAmplitude - 0.4) * 0.04, 0.9, ticker.deltaMS))
            this.triangles.Velocity = MathUtil.Damp(this.triangles.Velocity,
                0.5 * (timingPoint.effects == Effect.KiaiTime ? 4 : 2), 0.995, ticker.deltaMS);
        } else {
            this.logoAmplitudeContainer.scale = 1;
            this.triangles.Velocity = MathUtil.Damp(this.triangles.Velocity, 0.5, 0.9, ticker.deltaMS);
        }
        if (this.timeElapsedSinceLastBeat >= timingPoint.beatLength) {
            this.onNewBeat();
            this.timeElapsedSinceLastBeat = 0;
        }

        if (this.isMouseDown) {
            let change = {x: Main.mousePos.x - this.mouseDownPosition.x, y: Main.mousePos.y - this.mouseDownPosition.y};
            let length = Math.sqrt(change.x * change.x + change.y * change.y);
            // Diminish the drag distance as we go further to simulate "rubber band" feeling.
            change.x *= length <= 0 ? 0 : Math.pow(length, 0.6) / length;
            change.y *= length <= 0 ? 0 : Math.pow(length, 0.6) / length;
            this.logoBounceContainer.x = change.x;
            this.logoBounceContainer.y = change.y;
        }


    }

    private onNewBeat() {
        let audio = Main.AudioEngine.GetCurrentPlayingMusic();
        let timingPointUninherited = audio ? audio.beatmap.TimingPoints.GetCurrentUninheritedTimingPoint(Date.now() - audio.timeStarted) : new UnInheritedTimingPoint();
        if (!audio) {
            timingPointUninherited.beatLength = 1000;
        }
        let beatLength = timingPointUninherited.beatLength;
        let timingPoint = audio ? audio.beatmap.TimingPoints.GetCurrentTimingPoints(Date.now() - audio.timeStarted)[0] : new UnInheritedTimingPoint();
        if (!audio) {
            timingPoint.effects = Effect.None
        }
        let maxAmplitude = audio ? audio.GetMaximumAudioLevel() : 0;
        let amplitudeAdjust = Math.min(1, 0.4 + maxAmplitude);
        Ease.getEase(this.logoBeatContainer).ScaleTo(1 - 0.02 * amplitudeAdjust, this.early_activation, TWEEN.Easing.Linear.None).Then()
            .ScaleTo(1, beatLength * 2, TWEEN.Easing.Quintic.Out);
        this.rippleContainer.scale = 1.02;
        Ease.getEase(this.rippleContainer).ClearEasings().ScaleTo(1.02 * (1 + 0.04 * amplitudeAdjust), beatLength * 2, TWEEN.Easing.Quintic.Out);
        this.ripple.alpha = 0.15 * amplitudeAdjust;
        Ease.getEase(this.ripple).ClearEasings().FadeOut(beatLength, TWEEN.Easing.Quintic.Out);


        if (timingPoint.effects == Effect.KiaiTime) {
            Ease.getEase(this.triangles.flash).ClearEasings()
                .FadeTo(0.2 * amplitudeAdjust, this.early_activation, TWEEN.Easing.Linear.None).Then()
                .FadeTo(0, beatLength, TWEEN.Easing.Linear.None);
            Ease.getEase(this.visualizer).ClearEasings()
                .FadeTo(this.defaultVisualizerAlpha * 1.8 * amplitudeAdjust, this.early_activation, TWEEN.Easing.Linear.None).Then()
                .FadeTo(this.defaultVisualizerAlpha, beatLength, TWEEN.Easing.Linear.None);
        }
        setTimeout(() => {
            this.triangles.Velocity += amplitudeAdjust * (timingPoint.effects == Effect.KiaiTime ? 6 : 3);
        }, 60)

    }

}
