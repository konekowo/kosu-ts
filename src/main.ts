import { Application } from "pixi.js";
import { Screen } from "./Screens/Screen";
import { LoadScreen } from "./Screens/LoadScreen/LoadScreen";

export class Main {
    public static app: Application;
    private static currentScreen: Screen | null;
    private static allScreens: Screen[] = [];
    public constructor(app: Application) {
        Main.app = app;
        // @ts-ignore
        document.body.appendChild(Main.app.canvas);
        Main.app.stage.eventMode = "dynamic";
        this.doResize();
        window.addEventListener("resize", this.doResize);
        Main.switchScreen(new LoadScreen());

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