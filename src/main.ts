import { Application } from "pixi.js";
import { Screen } from "./Screens/Screen";
import { LoadScreen } from "./Screens/LoadScreen/LoadScreen";
import * as PIXI from "pixi.js";
import {IntroScreen} from "./Screens/IntroScreen/IntroScreen";
import {InteractScreen} from "./Screens/InteractScreen/InteractScreen";
import {Setting} from "./Settings/Setting";
import {Settings} from "./Settings/Settings";


export class Main {
    public static app: Application;
    private static currentScreen: Screen | null;
    private static allScreens: Screen[] = [];
    public static currentPlayingAudio: HTMLAudioElement;
    public constructor(app: Application) {
        Main.app = app;
        // @ts-ignore
        document.body.appendChild(Main.app.canvas);
        this.doResize();
        window.addEventListener("resize", this.doResize);
        Main.switchScreen(new LoadScreen());

        navigator.mediaSession.setActionHandler('play', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('pause', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('stop', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('previoustrack', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('nexttrack', function() { /* Code excerpted. */ });

        fetch("assets/osu-assets/osu.Game.Resources/Tracks/triangles.osz").then(response => response.blob()).then((response) => {
            // Add font files to the bundle
            PIXI.Assets.addBundle('fonts', [
                { alias: 'TorusRegular', src: 'assets/fonts/TorusRegular.otf' },
                { alias: 'TorusLight', src: 'assets/fonts/TorusLight.otf' },
                { alias: 'TorusThin', src: 'assets/fonts/TorusThin.otf' }
            ]);
            PIXI.Assets.addBundle('textures', [
                { alias: 'icon_ruleset_std', src: 'assets/icons/ruleset-standard.png' },
                { alias: 'icon_ruleset_mania', src: 'assets/icons/ruleset-mania.png' },
                { alias: 'icon_ruleset_taiko', src: 'assets/icons/ruleset-taiko.png' },
                { alias: 'icon_ruleset_ctb', src: 'assets/icons/ruleset-ctb.png' }
            ]);


            // Load the font bundle
            PIXI.Assets.loadBundle('fonts').then(() => {
                PIXI.Assets.loadBundle('textures').then(() => {
                    fetch("assets/osu-assets/osu.Game.Resources/Samples/UI/dialog-ok-select.wav")
                        .then(clickSound => clickSound.blob())
                        .then((clickSound) => {
                            Main.switchScreen(new InteractScreen(response, clickSound));
                        });
                })
            });

        });



    }
    public doResize(): void {
        Main.app.renderer.resize(window.innerWidth, window.innerHeight);
        Main.app.stage.scale.x = 1;
        Main.app.stage.scale.y = 1;
        Main.allScreens.forEach((screen) => {
            screen.onResize();
        })
    }

    public static switchScreen(screen: Screen){
        Main.app.stage.addChild(screen);
        if (this.currentScreen != null){
            this.currentScreen.onClose().then((lastScreen) => {
                for (let i = 0; i < this.allScreens.length; i++) {
                    if (this.allScreens[i] == lastScreen){
                        this.allScreens.splice(i, 1);
                    }
                }
                Main.app.ticker.remove(lastScreen.draw);
                Main.app.stage.removeChild(lastScreen);
                lastScreen.destroy();
            });
        }
        screen.start();
        this.allScreens.push(screen);
        this.currentScreen = screen;
        Main.app.ticker.add(screen.draw, screen);
    }

}
