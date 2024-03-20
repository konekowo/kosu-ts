import "./style.css";
import { Application } from "pixi.js";
import { Main } from "./main";
import {Settings} from "./Settings/Settings";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application();

window.onload = async (): Promise<void> => {
    new Settings();
    app.init({
        backgroundColor: "black",
        width: gameWidth,
        height: gameHeight,
        antialias: true
    }).then(() => {
        new Main(app);
    });
};
