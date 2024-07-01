import { Application } from "pixi.js";
import { Screen } from "./Screens/Screen";
import { LoadScreen } from "./Screens/LoadScreen/LoadScreen";
import * as PIXI from "pixi.js";
import {InteractScreen} from "./Screens/InteractScreen/InteractScreen";
import {Loader} from "./Loader";
import {MenuCursor} from "./Elements/MenuCursor/MenuCursor";
import {AudioEngine} from "./Audio/AudioEngine";


export class Main {
    public static app: Application;
    private static currentScreen: Screen | null;
    private static allScreens: Screen[] = [];
    private static clickArea: PIXI.Graphics = new PIXI.Graphics();
    public static mousePos = {x: 0, y: 0};
    public static pointerLockExitTime: number;
    private static doPointerLock: boolean = false;
    public static cursor: MenuCursor;
    public static AudioEngine: AudioEngine = new AudioEngine();

    public constructor(app: Application) {
        Main.app = app;
        // @ts-ignore
        document.body.appendChild(Main.app.canvas);
        this.doResize();
        window.addEventListener("resize", this.doResize);
        Main.app.stage.eventMode = "static";

        Main.app.stage.addEventListener("mousemove", (e) => {
            Main.mousePos.x = e.clientX;
            Main.mousePos.y = e.clientY;
            if (Main.cursor){
                Main.cursor.updateMouse();
            }
        });
        document.addEventListener("pointerlockchange", this.pointerLockChanged, false);
        Main.switchScreen(new LoadScreen());
        Loader.Load(Main.AudioEngine.audioContext).then(() => {
            Main.cursor = new MenuCursor(false);
            let dialogOk = Loader.GetAudio("sample_dialog_ok");
            let introTrack = Loader.Get("introTrianglesTrack");
            Main.switchScreen(new InteractScreen(introTrack, dialogOk));
        });
    }
    public doResize(): void {
        Main.app.renderer.resize(window.innerWidth, window.innerHeight);
        Main.app.stage.scale.x = 1;
        Main.app.stage.scale.y = 1;
        if (!Main.clickArea.destroyed){
            Main.clickArea.width = window.innerWidth;
            Main.clickArea.height = window.innerHeight;
            Main.clickArea.position.set(0, 0);
        }
        Main.allScreens.forEach((screen) => {
            screen.onResize();
        })
    }

    private pointerLockChanged(): void {
        if (!document.pointerLockElement && Main.doPointerLock) {
            PIXI.EventSystem.isPointerLocked = false;
            Main.pointerLockExitTime = Date.now();
            Main.clickArea = new PIXI.Graphics();
            Main.clickArea.rect(0, 0, 1, 1);
            Main.clickArea.fill("rgba(0,0,0,0.1)");
            Main.clickArea.width = window.innerWidth;
            Main.clickArea.height = window.innerHeight;
            Main.clickArea.position.set(0, 0);
            Main.app.stage.addChild(Main.clickArea);
            Main.clickArea.eventMode = "static";
            Main.clickArea.cursor = "pointer";
            Main.cursor.PopOut();
            Main.clickArea.zIndex = 9999999;
            Main.clickArea.onclick = () => {
                if (Date.now() - Main.pointerLockExitTime < 1500){
                    return;
                }
                Main.clickArea.removeFromParent();
                Main.clickArea.destroy();
                Main.pointerLock();
                Main.cursor.PopIn();
            }
        }
        else {
            PIXI.EventSystem.isPointerLocked = true;
        }
    }

    public static pointerLock() {
        try {
            this.doPointerLock = true;
            // @ts-ignore
            Main.app.canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        }
        catch (e) {
            console.warn("Failed to lock cursor, error:", e);
            this.doPointerLock = false;
        }

    }
    public static exitPointerLock() {
        this.doPointerLock = false;
        // @ts-ignore
        Main.app.canvas.exitPointerLock();
    }

    public static switchScreen(screen: Screen){
        if (this.currentScreen != null){
            this.currentScreen.zIndex = 1;
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
        Main.app.stage.addChild(screen);
        this.allScreens.push(screen);
        this.currentScreen = screen;
        screen.start();
        screen.onResize();
        Main.app.ticker.add(screen.draw, screen);
    }

}
