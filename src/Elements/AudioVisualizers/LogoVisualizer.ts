import {Main} from "../../main";
import {MapAudio} from "../../Audio/Audio";
import * as PIXI from "pixi.js";
import {data} from "browserslist";
import {MathUtil} from "../../Util/MathUtil";

export class LogoVisualizer extends PIXI.Container {

    public static readonly size = 900;

    // The number of bars to jump each update iteration.
    private readonly index_change = 5;

    // The maximum length of each bar in the visualiser. Will be reduced when kiai is not activated.
    private readonly bar_length = 2;

    // The number of bars in one rotation of the visualiser.
    private bars_per_visualiser = 200;

    // How many times we should stretch around the circumference (overlapping overselves).
    private readonly visualiser_rounds = 5;

    // How much should each bar go down each millisecond (based on a full bar).
    private readonly decay_per_millisecond = 0.0024;

    // Number of milliseconds between each amplitude update.
    private readonly time_between_updates = 50;

    // The minimum amplitude to show a bar.
    private readonly amplitude_dead_zone = 1 / this.bar_length;



    protected audio!: MapAudio;
    protected analyzer!: AnalyserNode;
    protected bufferLength!: number;
    protected audioData!: Uint8Array

    protected graphics: PIXI.Graphics = new PIXI.Graphics();

    public start() {
        Main.AudioEngine.addMusicChangeEventListener(() => this.initVisualizer());
        this.addChild(this.graphics);

    }

    public initVisualizer() {
        this.audio = Main.AudioEngine.GetCurrentPlayingMusic();
        const analyzerNodes = this.audio.GetNode(AnalyserNode);
        if (analyzerNodes == null) {
            throw new Error("Couldn't find any AnalyzerNode on Audio Object!");
        }
        this.analyzer = analyzerNodes[0];
        this.bufferLength = this.analyzer.frequencyBinCount;
        this.bars_per_visualiser = this.bufferLength;
        this.audioData = new Uint8Array(this.bufferLength);
    }

    public draw(ticker: PIXI.Ticker) {
        this.graphics.clear();
        this.analyzer.getByteFrequencyData(this.audioData);
        for (let j = 0; j < this.visualiser_rounds; j++){
            for (let i = 0; i < this.bars_per_visualiser; i++){
                if (this.audioData[i] < this.amplitude_dead_zone){
                    continue;
                }

                let rotation = MathUtil.DegreesToRadians(i / this.bars_per_visualiser * 360 + j * 360 / this.visualiser_rounds);
                let rotationCos = Math.cos(rotation);
                let rotationSin = Math.sin(rotation);
                // taking the cos and sin to the 0..1 range
                let barPosition = {x: (rotationCos / 2 + 0.5) * LogoVisualizer.size, y: (rotationSin / 2 + 0.5) * LogoVisualizer.size};

                let barSize = {
                    x: LogoVisualizer.size * Math.sqrt(2 * (1 - Math.cos(MathUtil.DegreesToRadians(360 / this.bars_per_visualiser)))) / 2,
                    y: this.bar_length * this.audioData[i]
                };
                // The distance between the position and the sides of the bar.
                let bottomOffset = {x: -rotationSin * barSize.x / 2, y: rotationCos * barSize.x / 2};
                // The distance between the bottom side of the bar and the top side.
                let amplitudeOffset = {x: rotationCos * barSize.y, y: rotationSin * barSize.y};

                this.graphics.moveTo(barPosition.x, barPosition.y);
                this.graphics.lineTo(barPosition.x + amplitudeOffset.x, barPosition.y + amplitudeOffset.y);
                this.graphics.stroke({color: "rgba(255, 255, 255, 0.2)", width: 10});
            }
        }


    }
}
