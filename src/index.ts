import "./style.css";
import { Application } from "pixi.js";
import { Main } from "./main";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application<HTMLCanvasElement>({
    backgroundColor: "black",
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    new Main(app);
};
