import {Screen} from "../Screen";
import {Ticker} from "pixi.js";
import {unzip} from 'unzipit';
import {Main} from "../../main";
import * as PIXI from "pixi.js";
import {GlitchingTriangles} from "./GlitchingTriangles";
import {ease} from "pixi-ease";
import {MainMenu} from "../MainMenu/MainMenu";
import {LazerLogo} from "./LazerLogo";
import {BeatmapParser} from "../../Util/Beatmap/Parser/BeatmapParser";

export class IntroScreen extends Screen {

    private readonly introTrackUrl: string;

    private doTextSpacingAnim = false;
    private triangles = new PIXI.Container();
    private ruleSetContainer = new PIXI.Container();
    private ruleSetContainerContainer = new PIXI.Container();
    private flash = new PIXI.Graphics();

    private logoContainerContainer = new PIXI.Container();

    private logoContainer = new PIXI.Container();

    private lazerLogo = new LazerLogo();

    private flashed = false;

    private mainMenu: MainMenu | undefined;

    private standard = PIXI.Sprite.from('icon_ruleset_std');
    private taiko = PIXI.Sprite.from('icon_ruleset_taiko');
    private ctb = PIXI.Sprite.from('icon_ruleset_ctb');
    private mania = PIXI.Sprite.from('icon_ruleset_mania');

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
        this.lazerLogo.scale.set(Screen.getScaleBasedOffScreenSize());
        this.logoContainer.addChild(this.lazerLogo);
        this.logoContainer.scale.set(1.2);

        this.logoContainerContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        this.logoContainerContainer.pivot.set(0.5, 0.5);
        this.logoContainerContainer.addChild(this.logoContainer);

        this.flash.rect(0, 0, 1, 1);
        this.flash.fill("white");
        this.flash.position.set(0, 0);
        this.flash.width = this.getScreenWidth();
        this.flash.height = this.getScreenHeight();
        this.flash.blendMode = "add";
        this.welcomeText.anchor.set(0.5, 0.5);
        this.welcomeText.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);
        setTimeout(async () => {
            const {entries} = await unzip(this.introTrackUrl);
            for (const [name, entry] of Object.entries(entries)) {
                if (name.endsWith(".osu")){
                    entry.text().then((osuFile) => {
                        let beatmapData = BeatmapParser.Parse(osuFile);
                        console.log(beatmapData);
                        for (const [name, entry] of Object.entries(entries)) {
                            if (name == beatmapData.General.AudioFileName) {
                                entry.arrayBuffer().then(arrBuff => Main.AudioEngine.audioContext.decodeAudioData(arrBuff))
                                    .then((audioBuff) => {
                                        Main.AudioEngine.PlayMusicImmediately(audioBuff, beatmapData, () => {
                                            this.afterAudioPlay();
                                            this.mainMenu = new MainMenu();
                                        });
                                    });
                            }
                        }

                    });


                    break;
                }
            }
        }, 0);
    }

    public afterAudioPlay() {
        this.welcomeText.scale.set(Screen.getScaleBasedOffScreenSize());
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
        this.triangles.scale.set(Screen.getScaleBasedOffScreenSize());
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



        this.standard.anchor.set(0.5,0.5);
        this.standard.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        this.ruleSetContainer.addChild(this.standard);
        this.taiko.anchor.set(0.5,0.5);
        this.taiko.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        this.ruleSetContainer.addChild(this.taiko);
        this.ctb.anchor.set(0.5,0.5);
        this.ctb.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        this.ruleSetContainer.addChild(this.ctb);
        this.mania.anchor.set(0.5,0.5);
        this.mania.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        this.ruleSetContainer.addChild(this.mania);

        setTimeout(() => {
            this.doTextSpacingAnim = false;
            this.onResize();
            clearInterval(glitchingInterval);
            this.welcomeText.destroy();
            this.triangles.destroy();
            this.ruleSetContainer.position.set(this.getScreenWidth()/2, this.getScreenHeight()/2);

            this.addChild(this.ruleSetContainer);

            let spacing = 100;
            this.standard.position.set(-((spacing * 2) + 175)*Screen.getScaleBasedOffScreenSize(), 0);
            this.taiko.position.set(-((spacing) + 25)*Screen.getScaleBasedOffScreenSize(), 0);
            this.ctb.position.set(((spacing) + 25)*Screen.getScaleBasedOffScreenSize(), 0);
            this.mania.position.set(((spacing * 2) + 175)*Screen.getScaleBasedOffScreenSize(), 0);

            ease.add(this.ruleSetContainer, {scale: 0.8}, {duration: 1000, ease: "linear"});
        }, 1450);

        setTimeout(() => {
            let spacing = 15;
            this.standard.position.set(-((spacing * 2) + 210)*Screen.getScaleBasedOffScreenSize(), 0);
            this.taiko.position.set(-((spacing) + 60)*Screen.getScaleBasedOffScreenSize(), 0);
            this.ctb.position.set(((spacing) + 60)*Screen.getScaleBasedOffScreenSize(), 0);
            this.mania.position.set(((spacing * 2) + 210)*Screen.getScaleBasedOffScreenSize(), 0);

            this.standard.scale.set(Screen.getScaleBasedOffScreenSize());
            this.taiko.scale.set(Screen.getScaleBasedOffScreenSize());
            this.ctb.scale.set(Screen.getScaleBasedOffScreenSize());
            this.mania.scale.set(Screen.getScaleBasedOffScreenSize());
        }, 1650);

        setTimeout(() => {
            let spacing = 60;
            this.standard.position.set(-((spacing * 2) + 230)*Screen.getScaleBasedOffScreenSize(), 0);
            this.taiko.position.set(-((spacing) + 60)*Screen.getScaleBasedOffScreenSize(), 0);
            this.ctb.position.set(((spacing) + 60)*Screen.getScaleBasedOffScreenSize(), 0);
            this.mania.position.set(((spacing * 2) + 230)*Screen.getScaleBasedOffScreenSize(), 0);

            this.standard.scale.set(2 * Screen.getScaleBasedOffScreenSize());
            this.taiko.scale.set(2 * Screen.getScaleBasedOffScreenSize());
            this.ctb.scale.set(2 * Screen.getScaleBasedOffScreenSize());
            this.mania.scale.set(2 * Screen.getScaleBasedOffScreenSize());

            ease.add(this.ruleSetContainer, {scale: 1.3}, {duration: 1000, ease: "linear"});
        }, 1850);

        setTimeout(() => {
            this.ruleSetContainer.visible = false;
            this.lazerLogo.start();

            this.addChild(this.logoContainerContainer);

            this.logoContainerContainer.scale.set(1.2);
            ease.add(this.logoContainerContainer, {scale: 1.2 - 0.8 * 0.25}, {duration: 920, ease: "easeInQuad"});

            setTimeout(() => {
                ease.add(this.logoContainer, {scale: 1.2 - 0.8}, {duration: 920 * 0.3, ease: "easeInQuint"})
            }, 920 * 0.7);
        }, 2080);

        setTimeout(() => {
            this.addChild(this.flash);
            this.flash.eventMode = "none";
            this.flashed = true;
            this.logoContainerContainer.visible = false;
            ease.add(this.flash, {alpha: 0}, {duration: 1000, ease: "easeOutQuad"});
            if (this.mainMenu == null){
                this.mainMenu = new MainMenu();
            }
            Main.switchScreen(this.mainMenu);
            Main.cursor.PopIn();
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
            this.triangles.scale.set(Screen.getScaleBasedOffScreenSize());
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
        if (!this.lazerLogo.destroyed) {
            this.lazerLogo.scale.set(Screen.getScaleBasedOffScreenSize());
        }
        if (!this.welcomeText.destroyed){
            this.welcomeText.scale.set(Screen.getScaleBasedOffScreenSize());
        }
        if (!this.standard.destroyed) {
            this.standard.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.mania.destroyed) {
            this.mania.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.ctb.destroyed) {
            this.ctb.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.taiko.destroyed) {
            this.taiko.scale.set(0.4 * Screen.getScaleBasedOffScreenSize());
        }
    }
}
