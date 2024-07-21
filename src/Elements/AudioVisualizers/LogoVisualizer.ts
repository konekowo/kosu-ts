import {Main} from "../../main";
import {MapAudio} from "../../Audio/Audio";
import * as PIXI from "pixi.js";
import {MathUtil} from "../../Util/MathUtil";
import {Effect} from "../../Util/Beatmap/Data/Sections/TimingPoints/Effect";
import {UnInheritedTimingPoint} from "../../Util/Beatmap/Data/Sections/TimingPoints/UnInheritedTimingPoint";

export class LogoVisualizer extends PIXI.Container {

    public static readonly size = 900;

    // The number of bars to jump each update iteration.
    private readonly index_change = 5;

    // The maximum length of each bar in the visualiser. Will be reduced when kiai is not activated.
    private readonly bar_length = 600;

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



    protected audio!: MapAudio | null;
    protected analyzer!: AnalyserNode;
    protected bufferLength!: number;
    public amplitudes!: Float32Array;

    protected temporalAmplitudes: Float32Array = new Float32Array(256);
    public frequencyAmplitudes: Float32Array = new Float32Array(256);

    protected graphics: PIXI.Graphics = new PIXI.Graphics();

    private indexOffset = 0;
    private firstDraw = true;

    public start() {
        Main.AudioEngine.addMusicChangeEventListener(() => this.initVisualizer());
        this.graphics.blendMode = "add";
        this.addChild(this.graphics);
        this.graphics.eventMode = "none";
        this.eventMode = "none";
        setInterval(() => {this.updateAmplitudes()}, this.time_between_updates);

    }

    private updateAmplitudes() {
        this.updateFrequencyData();
        for (let i = 0; i < this.amplitudes.length; i++) {
            this.temporalAmplitudes[i] = this.amplitudes[i];
        }
        let timingPoint = this.audio ? this.audio.beatmap.TimingPoints.GetCurrentTimingPoints(Date.now() - this.audio.timeStarted)[0] :
            new UnInheritedTimingPoint();
        if (!this.audio) {timingPoint.time = 0; if (timingPoint instanceof UnInheritedTimingPoint) {timingPoint.beatLength = 1000;}}
        for (let i = 0; i < this.bars_per_visualiser; i++) {
            let targetAmplitude = (this.temporalAmplitudes[(i + this.indexOffset) % this.bars_per_visualiser]) *
                (timingPoint.effects == Effect.KiaiTime ? 1 : 0.5);
            if (targetAmplitude > this.frequencyAmplitudes[i]) {
                this.frequencyAmplitudes[i] = targetAmplitude;
            }
        }
        this.indexOffset = (this.indexOffset + this.index_change) % this.bars_per_visualiser;
    }

    private initVisualizer() {
        this.audio = Main.AudioEngine.GetCurrentPlayingMusic();
        if (this.audio) {
            const analyzerNodes = this.audio.GetNode(AnalyserNode);
            if (analyzerNodes == null) {
                throw new Error("Couldn't find any AnalyzerNode on Audio Object!");
            }
            this.analyzer = analyzerNodes[0];
            this.bufferLength = this.analyzer.frequencyBinCount;
            this.amplitudes = new Float32Array(this.bufferLength);
        }
        else {
            this.analyzer = new AnalyserNode(Main.AudioEngine.audioContext);
            this.analyzer.fftSize = 512;
            this.bufferLength = this.analyzer.frequencyBinCount;
            this.amplitudes = new Float32Array(this.bufferLength);
        }


    }

    private updateFrequencyData() {
        for (let i = 0; i < this.amplitudes.length; i++) {
            this.amplitudes[i] += 140;
            this.amplitudes[i] /= 340;
            if (i < 3) {
                this.amplitudes[i] *= (12 * this.amplitudes[i]);
            }
            else if (i < 6) {
                this.amplitudes[i] *= (9 * this.amplitudes[i]);
            }
            else if (i < 100) {
                this.amplitudes[i] *= (6 * this.amplitudes[i]);
            }
            this.amplitudes[i] /= 2;
        }
    }

    public draw(ticker: PIXI.Ticker) {
        if (this.firstDraw) {
            for (let i = 0; i < this.frequencyAmplitudes.length; i++) {
                this.frequencyAmplitudes[i] = 0;
            }
        }
        this.graphics.clear();
        this.analyzer.getFloatFrequencyData(this.amplitudes);
        let decayFactor = ticker.deltaMS * this.decay_per_millisecond;
        for (let i = 0; i < this.bars_per_visualiser; i++) {
            //3% of extra bar length to make it a little faster when bar is almost at it's minimum
            this.frequencyAmplitudes[i] -= decayFactor * (this.frequencyAmplitudes[i] + 0.03);
            if (this.frequencyAmplitudes[i] < 0) {
                this.frequencyAmplitudes[i] = 0;
            }
        }

        for (let j = 0; j < this.visualiser_rounds; j++){
            for (let i = 0; i < this.bars_per_visualiser; i++){
                if (this.frequencyAmplitudes[i] < this.amplitude_dead_zone){
                    continue;
                }

                let rotation = MathUtil.DegreesToRadians(i / this.bars_per_visualiser * 360 + j * 360 / this.visualiser_rounds);
                let rotationCos = Math.cos(rotation);
                let rotationSin = Math.sin(rotation);
                // taking the cos and sin to the 0..1 range
                let barPosition = {x: (rotationCos / 2 + 0.5) * LogoVisualizer.size, y: (rotationSin / 2 + 0.5) * LogoVisualizer.size};

                let barSize = {
                    x: LogoVisualizer.size * Math.sqrt(2 * (1 - Math.cos(MathUtil.DegreesToRadians(360 / this.bars_per_visualiser)))) / 2,
                    y: this.bar_length * this.frequencyAmplitudes[i]
                };
                // The distance between the bottom side of the bar and the top side.
                let amplitudeOffset = {x: rotationCos * barSize.y, y: rotationSin * barSize.y};

                this.graphics.moveTo(barPosition.x, barPosition.y);
                this.graphics.lineTo(barPosition.x + amplitudeOffset.x, barPosition.y + amplitudeOffset.y);
                this.graphics.stroke({color: "rgba(255, 255, 255, 0.2)", width: 14});
            }
        }
        this.firstDraw = false;
    }
}
