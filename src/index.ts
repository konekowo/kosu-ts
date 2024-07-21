import "./style.css";
import { Application } from "pixi.js";
import { Main } from "./main";
import {Settings} from "./Settings/Settings";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application();

window.onload = async (): Promise<void> => {
    new Settings();
    // @ts-ignore
    let renderer: "webgl" | "webgpu" = Settings.getDropDownSetting("Renderer").getValue().value;
    app.init({
        backgroundColor: "black",
        width: gameWidth,
        height: gameHeight,
        antialias: true,
        preference: renderer,
        resolution: window.devicePixelRatio,
        autoDensity: true
    }).then(() => {
        new Main(app);
    });
};
