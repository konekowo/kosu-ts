import {Screen} from "../Screen";
import {Ticker} from "pixi.js";
import {unzip} from 'unzipit';
import {Main} from "../../main";
import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js'
import {GlitchingTriangles} from "./GlitchingTriangles";
import {ease} from "pixi-ease";
import {set} from "husky";
import {MainMenu} from "../MainMenu/MainMenu";
import {AudioPlayer} from "../../Audio/AudioPlayer";
import {LazerLogo} from "./LazerLogo";

export class IntroScreen extends Screen {

    private readonly introTrackUrl: string;

    private doTextSpacingAnim = false;
    private triangles = new PIXI.Container();
    private ruleSetContainer = new PIXI.Container();
    private flash = new PIXI.Graphics();

    private logoContainerContainer = new PIXI.Container();

    private logoContainer = new PIXI.Container();

    private lazerLogo = new LazerLogo();

    private flashed = false;

    private welcomeText: PIXI.Text = new PIXI.Text({
        text: "",
        style: {
            fontFamily: "TorusThin",
            fontSize: 42,
            fill: "white",
            letterSpacing: 5
        }
    });

    public constructor(introTrack: Blob) {
        super();
        this.introTrackUrl = URL.createObjectURL(introTrack);
    }
    public start() {
        this.welcomeText.anchor.set(0.5, 0.5);
        this.welcomeText.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        // timeout to not give the player a jump scare
        setTimeout(async () => {
            const {entries} = await unzip(this.introTrackUrl);
            for (const [name, entry] of Object.entries(entries)) {
                if (name == "audio.mp3"){
                    entry.blob().then((audioBlob) => {
                        AudioPlayer.play(audioBlob).then(() => {
                           this.afterAudioPlay();
                        });
                    });
                }
                if (name.endsWith(".osu")){
                    // TODO: parse
                }
            }
        }, 500);
    }

    public afterAudioPlay() {
        this.addChild(this.welcomeText);
        setTimeout(()=> {
            this.welcomeText.text = "wel";
            this.onResize();
        },200);
        setTimeout(()=> {
            this.welcomeText.text = "welcome";
            this.onResize();
        },400);
        setTimeout(()=> {
            this.welcomeText.text = "welcome to";
            this.onResize();
        },700);
        let glitchingInterval: NodeJS.Timeout;

        this.triangles.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.addChild(this.triangles);
        setTimeout(()=> {
            this.welcomeText.text = "welcome to kosu!";
            this.doTextSpacingAnim = true;
            glitchingInterval = setInterval(() => {
                let triangle = new GlitchingTriangles({
                    x1: -(this.welcomeText.width/2) - 100,
                    x2: (this.welcomeText.width/2) + 100,
                    y1: -(this.welcomeText.height/2) - 150,
                    y2: (this.welcomeText.height/2) + 100
                });
                this.triangles.addChild(triangle);
            }, 30);
            this.onResize();
        },900);

        let standard = PIXI.Sprite.from('icon_ruleset_std');
        let taiko = PIXI.Sprite.from('icon_ruleset_taiko');
        let ctb = PIXI.Sprite.from('icon_ruleset_ctb');
        let mania = PIXI.Sprite.from('icon_ruleset_mania');

        setTimeout(() => {
            this.doTextSpacingAnim = false;
            this.onResize();
            clearInterval(glitchingInterval);
            this.welcomeText.destroy();
            this.triangles.destroy();
            this.ruleSetContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);

            this.addChild(this.ruleSetContainer);
            standard.anchor.set(0.5,0.5);
            standard.scale.set(0.4);
            this.ruleSetContainer.addChild(standard);
            taiko.anchor.set(0.5,0.5);
            taiko.scale.set(0.4);
            this.ruleSetContainer.addChild(taiko);
            ctb.anchor.set(0.5,0.5);
            ctb.scale.set(0.4);
            this.ruleSetContainer.addChild(ctb);
            mania.anchor.set(0.5,0.5);
            mania.scale.set(0.4);
            this.ruleSetContainer.addChild(mania);

            let spacing = 100;
            standard.position.set(-((spacing * 2) + 175), 0);
            taiko.position.set(-((spacing) + 25), 0);
            ctb.position.set(((spacing) + 25), 0);
            mania.position.set(((spacing * 2) + 175), 0);

            ease.add(this.ruleSetContainer, {scale: 0.8}, {duration: 1000, ease: "linear"});
        }, 1450);

        setTimeout(() => {
            let spacing = 15;
            standard.position.set(-((spacing * 2) + 210), 0);
            taiko.position.set(-((spacing) + 60), 0);
            ctb.position.set(((spacing) + 60), 0);
            mania.position.set(((spacing * 2) + 210), 0);

            standard.scale.set(1);
            taiko.scale.set(1);
            ctb.scale.set(1);
            mania.scale.set(1);
        }, 1650);

        setTimeout(() => {
            let spacing = 60;
            standard.position.set(-((spacing * 2) + 230), 0);
            taiko.position.set(-((spacing) + 60), 0);
            ctb.position.set(((spacing) + 60), 0);
            mania.position.set(((spacing * 2) + 230), 0);

            standard.scale.set(2);
            taiko.scale.set(2);
            ctb.scale.set(2);
            mania.scale.set(2);

            ease.add(this.ruleSetContainer, {scale: 1.3}, {duration: 1000, ease: "linear"});
        }, 1850);

        setTimeout(() => {
            this.ruleSetContainer.visible = false;
            this.lazerLogo.start();
            this.logoContainer.addChild(this.lazerLogo);
            this.logoContainer.scale.set(1.2);

            this.logoContainerContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
            this.logoContainerContainer.pivot.set(0.5, 0.5);
            this.logoContainerContainer.addChild(this.logoContainer);
            this.addChild(this.logoContainerContainer);

            this.logoContainerContainer.scale.set(1.2);
            ease.add(this.logoContainerContainer, {scale: 1.2 - 0.8 * 0.25}, {duration: 920, ease: "easeInQuad"});

            setTimeout(() => {
                ease.add(this.logoContainer, {scale: 1.2 - 0.8}, {duration: 920 * 0.3, ease: "easeInQuint"})
            }, 920 * 0.7);
        }, 2080);

        setTimeout(() => {
            this.flash.rect(0, 0, 1, 1);
            this.flash.fill("white");
            this.flash.position.set(0, 0);
            this.flash.width = this.getScreenWidth();
            this.flash.height = this.getScreenHeight();
            this.addChild(this.flash);
            this.flashed = true;
            this.logoContainerContainer.visible = false;
            ease.add(this.flash, {alpha: 0}, {duration: 1000, ease: "easeOutQuad"})
            Main.switchScreen(new MainMenu());
        }, 3000);

    }
    public draw(deltaTime: Ticker) {
        if (this.doTextSpacingAnim){
            this.welcomeText.style.letterSpacing += 0.15 * deltaTime.deltaTime;
            this.onResize();
        }
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this);
            }, 1000);
        });
    }

    public onResize() {
        if (!this.welcomeText.destroyed){
            this.welcomeText.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        }
        if (!this.triangles.destroyed){
            this.triangles.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        }
        if (!this.ruleSetContainer.destroyed){
            this.ruleSetContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        }
        if (!this.flash.destroyed && this.flashed){
            this.flash.position.set(0, 0);
            this.flash.width = this.getScreenWidth();
            this.flash.height = this.getScreenHeight();
        }
        if (!this.logoContainerContainer.destroyed){
            this.logoContainerContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        }
    }
}
