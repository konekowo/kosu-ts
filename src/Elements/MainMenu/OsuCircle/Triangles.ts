import * as PIXI from "pixi.js";
import {Main} from "../../../main";
export class Triangles extends PIXI.Graphics{

    private bgGradient: PIXI.FillGradient;
    private triangles: Triangle[] = [];
    private triangleGenInterval: NodeJS.Timeout;
    private pulseAnimation: EaseOutCubic;

    public constructor() {
        super();

        let colorStops = [0xff66ab, 0xcc5289];
        this.bgGradient = new PIXI.FillGradient(0, 0, 0, 1024);
        colorStops.forEach((number, index) =>
        {
            const ratio = index / colorStops.length;
            this.bgGradient.addColorStop(ratio, number);
        });
        function random(min: number, max: number){
            return Math.random() * (max - min) + min;
        }

        function randVelocity() {
            let u1 = 1 - random(0, 1);
            let u2 = 1 - random(0, 1);
            let randStdNormal = (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
            return Math.max(0.5 + 0.16 * randStdNormal, 0.1);
        }

        for (let i = 0; i < 15; i++) {
            this.triangles.push({x: random(0, 1024), y: random(0, 1024), velocity: randVelocity()});
        }

        this.triangleGenInterval = setInterval(() => {
            if (document.hasFocus()){
                this.triangles.push({x: random(0, 1024), y: 1024 - 50, velocity: randVelocity()});
            }

        }, 800);

        function bpmToMs(bpm: number) {
            return 60000/bpm;
        }

        this.pulseAnimation = new EaseOutCubic(375, Main.audioStartTime);
    }

    public destroy(options?: PIXI.DestroyOptions) {
        super.destroy(options);
    }

    public draw(ticker: PIXI.Ticker) {
        this.pulseAnimation.update();
        if (!this.destroyed){
            this.clear();
            this.rect(0, 0, 1024, 1024);
            this.fill(this.bgGradient);
            this.triangles.forEach((triangle, index) => {
                triangle.y -= (ticker.deltaTime * triangle.velocity) * this.pulseAnimation.getValue() * 4;
                this.moveTo(triangle.x, triangle.y);
                this.lineTo(triangle.x -250, triangle.y + 400);
                this.lineTo(triangle.x + 250, triangle.y + 400);
                this.lineTo(triangle.x, triangle.y);
                let alpha = 1;
                if (triangle.y + 50 < 300) {
                    alpha = (triangle.y + 50)/300;
                }
                if (alpha < 0){
                    alpha = 0;
                }
                if (alpha > 1){
                    alpha = 1;
                }
                this.stroke({color: new PIXI.Color("rgba(182, 52, 111, "+alpha+")"), width: 4});
                if (triangle.y + 400 < 0){
                    this.triangles.splice(index, 1);
                }
            });
        }
    }
}

export interface Triangle {
    x: number;
    y: number;
    velocity: number;
}

export class EaseOutCubic {

    private startTime: number;
    private duration: number;
    private elapsedMS: number = 0;
    public constructor(durationMS: number, startTime?: number) {
        if (!startTime) {
            this.startTime = Date.now();
        }
        else {
            this.startTime = startTime;
        }

        this.duration = durationMS;
    }

    public update() {
        this.elapsedMS = Date.now() - this.startTime;
        if (this.elapsedMS > this.duration) {
            this.reset();
            this.update();
        }
    }

    public getValue() {
        return this.func(this.elapsedMS/this.duration);
    }

    private reset() {
        this.startTime = Date.now();
        this.elapsedMS = 0;
    }

    public func(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
}
