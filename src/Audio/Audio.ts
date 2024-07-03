import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";
import {node} from "webpack";
import {OsuCircle} from "../Elements/MainMenu/OsuCircle/OsuCircle";

export class Audio {
    public audio!: AudioBuffer;
    public timeStarted: number = 0;
    public source?: AudioBufferSourceNode
    public id!: number;
    public isPlaying: boolean = false;
    public isPaused: boolean = false;
    public pausedTime: number = 0;
    public nodes: AudioNode[] = [];
    private _connectedToContext = false;

    public Create(audioContext: AudioContext) {
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.audio;
    }

    public AddAudioNode(node: AudioNode) {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        this.nodes.push(node);
    }

    public GetNode<T>(type: new (...args: any[]) => T): T[] | null{
        let nodes = this.nodes.filter(node => node instanceof type) as T[];
        if (nodes.length > 0) {
            return nodes;
        }
        else {
            return null;
        }
    }

    public ConnectToContext(audioContext: AudioContext, howToConnectFunction?: (nodes: AudioNode[], source: AudioBufferSourceNode) => void) {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        if (this._connectedToContext){
            return;
        }
        this._connectedToContext = true;
        if (this.nodes.length > 0){
            if (howToConnectFunction){
                howToConnectFunction(this.nodes, this.source);
            }
            else {
                this.nodes.forEach((node, index) => {
                    this.source!.connect(node);
                    if (!(node instanceof AnalyserNode)) {
                        node.connect(audioContext.destination);
                    }
                });
            }
        }
        else {
            this.source.connect(audioContext.destination);
        }
    }

    public Play() {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext){
            throw new Error("Not connected to audio context yet!");
        }
        this.source.start(0, this.pausedTime);
        this.isPlaying = true;
        this.isPaused = false;
        this.timeStarted = Date.now() - this.pausedTime;
        this.pausedTime = 0;
    }

    public Pause() {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext){
            throw new Error("Not connected to audio context yet!");
        }
        this.pausedTime = Date.now() - this.timeStarted;
        this.source.stop(0);
        this.isPaused = true;
        this.isPlaying = false;
    }

    public Stop() {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext){
            throw new Error("Not connected to audio context yet!");
        }
        this.source.stop(0);
        this.isPlaying = false;
    }

    public RegisterEndCallBack(callback: () => void) {
        if (!this.source){
            throw new Error("Source not created yet!");
        }
        this.source.onended = () => {
            if (!this.isPaused) {
                callback();
            }
        }
    }

}
export class MapAudio extends Audio {
    public beatmap!: BeatmapData;
    public fadingOut: boolean = false;
    // @ts-ignore
    public fadeOutTimeout!: Timeout
    public playingCallback?: () => void;

}
