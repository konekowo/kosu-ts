import * as PIXI from "pixi.js";
export class Triangles extends PIXI.Graphics{

    private bgGradient: PIXI.FillGradient;
    private triangles: Triangle[] = [];
    private triangleGenInterval: NodeJS.Timeout;
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
    }

    public destroy(options?: PIXI.DestroyOptions) {
        super.destroy(options);
    }

    public draw(ticker: PIXI.Ticker) {
        if (!this.destroyed){
            this.clear();
            this.rect(0, 0, 1024, 1024);
            this.fill(this.bgGradient);
            this.triangles.forEach((triangle, index) => {
                triangle.y -= (2 * ticker.deltaTime) * triangle.velocity;
                this.moveTo(triangle.x, triangle.y);
                this.lineTo(triangle.x -250, triangle.y + 400);
                this.lineTo(triangle.x + 250, triangle.y + 400);
                this.lineTo(triangle.x, triangle.y);
                let alpha = 1;
                if (triangle.y + 50 < 300) {
                    alpha = (triangle.y + 50)/300;
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
