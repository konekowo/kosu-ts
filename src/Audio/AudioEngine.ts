import {PlayingAudios} from "./PlayingAudios";
import {Audio, MapAudio} from "./Audio";
import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";
import {arrayBuffer} from "node:stream/consumers";
import {Main} from "../main";

export class AudioEngine {
    public readonly audioContext: AudioContext;
    private readonly _playingAudios: PlayingAudios;
    private _musicQueue: MapAudio[] = [];
    private _audioIdTicker: number = 0;
    private _changeCallbacks: (() => void)[] = [];

    public constructor() {
        this.audioContext = new AudioContext();
        this._playingAudios = new PlayingAudios();
        Main.app.ticker.add(() => {this.update();});
    }

    public UpdateMusicQueue() {
        if (this._musicQueue[0]){
            if (!this._musicQueue[0].fadingOut && this._musicQueue[0].timeStarted == 0){
                this._play(this._musicQueue[0]);
                this._changeCallbacks.forEach((cb) => cb());
            }
            if (this._musicQueue[0].fadingOut && this._musicQueue[1]){
                if (this._musicQueue[1]){
                    this._play(this._musicQueue[1]);
                    this._changeCallbacks.forEach((cb) => cb());
                }
            }
        }
    }

    public addMusicChangeEventListener(cb: () => void) {
        this._changeCallbacks.push(cb);
    }

    public removeMusicChangeEventListener(cb: () => void) {
        this._changeCallbacks = this._changeCallbacks.filter(callback => callback != cb);
    }

    public GetCurrentPlayingMusic() {
        return this._musicQueue[0];
    }

    private _play(audio: Audio | MapAudio, pitch?: number) {
        audio.Create(this.audioContext);
        // check if audio is type of MapAudio
        if ("beatmap" in audio && audio.beatmap){
            this._playingAudios.audios.forEach((audio) => {
                if ("beatmap" in audio && audio.beatmap){
                    clearTimeout(audio.fadeOutTimeout);
                    audio.fadingOut = true;
                    let gainNodes = audio.GetNode(GainNode);
                    if (gainNodes == null) {
                        throw new Error("Gain Node doesn't exist on Audio Object!");
                    }
                    let gain = gainNodes[0];
                    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4)
                    setTimeout(() => {
                        audio.Stop();
                    }, 400);
                }
            });
            let gain = this.audioContext.createGain();
            gain.gain.value = 0;
            let analyzer = this.audioContext.createAnalyser();
            analyzer.fftSize = 512;
            analyzer.smoothingTimeConstant = 0;
            let splitter = this.audioContext.createChannelSplitter(2);
            let analyzerL = this.audioContext.createAnalyser();
            analyzerL.smoothingTimeConstant = 0;
            analyzerL.fftSize = 32;
            let analyzerR = this.audioContext.createAnalyser();
            analyzerR.smoothingTimeConstant = 0;
            analyzerR.fftSize = 32;
            audio.AddAudioNode(gain);
            audio.AddAudioNode(analyzer);
            audio.AddAudioNode(analyzerL);
            audio.AddAudioNode(analyzerR);
            audio.ConnectToContext(this.audioContext, (nodes, source) => {
                source.connect(gain);
                gain.connect(this.audioContext.destination);
                source.connect(analyzer);
                source.connect(splitter);
                splitter.connect(analyzerL, 0);
                splitter.connect(analyzerR, 1);
            });
            audio.Play();
            this._playingAudios.audios.push(audio);
            if (audio.playingCallback){
                audio.playingCallback();
            }
            gain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.4);
            audio.fadeOutTimeout = setTimeout(() => {
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);
            }, (audio.audio.duration - 0.4)*1000);
        }
        else {
            audio.ConnectToContext(this.audioContext);
            if (pitch){
                if (audio.source){
                    audio.source.playbackRate.value = pitch;
                }
            }
            audio.Play();
            this._playingAudios.audios.push(audio);
        }


        audio.RegisterEndCallBack(() => {
            audio.isPlaying = false;
            if ("beatmap" in audio && audio.beatmap){
                if (this._musicQueue[0] == audio){
                    this._musicQueue.splice(0, 1);
                }
            }
            this._playingAudios.audios.forEach((audioInArr, index) => {
                if (audioInArr === audio){
                    this._playingAudios.audios.splice(index, 1);
                    return;
                }
            });
            this.UpdateMusicQueue();
        });
    }

    public PlayEffect(audio: AudioBuffer, pitch?: number) {
        let audioObj = new Audio();
        audioObj.audio = audio;
        audioObj.id = this._audioIdTicker;
        this._play(audioObj, pitch);
        this._audioIdTicker++;
    }

    public AddToMusicQueue(mapAudio: AudioBuffer, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        let mapAudioObj = new MapAudio();
        mapAudioObj.audio = mapAudio;
        mapAudioObj.beatmap = beatMapData;
        mapAudioObj.id = this._audioIdTicker;
        if (musicPlayingCallback){
            mapAudioObj.playingCallback = musicPlayingCallback;
        }
        this._musicQueue.push(mapAudioObj);
        this._audioIdTicker++;
        this.UpdateMusicQueue();
        return mapAudioObj.id;
    }

    public PlayMusicImmediately(mapAudio: AudioBuffer, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        // clear queue
        this._musicQueue = [];
        this.AddToMusicQueue(mapAudio, beatMapData, musicPlayingCallback);
    }

    public update() {
        let currentPlaying = this.GetCurrentPlayingMusic();
        if (currentPlaying) {
            let analyzerL = currentPlaying.GetNode(AnalyserNode)![1];
            let analyzerR = currentPlaying.GetNode(AnalyserNode)![2];
            analyzerL.getFloatFrequencyData(currentPlaying.tempArrayL);
            analyzerR.getFloatFrequencyData(currentPlaying.tempArrayR);
            let addedL = 0;
            currentPlaying.tempArrayL.forEach((num) => {
                addedL += num;
            });
            let avgL = addedL/=currentPlaying.tempArrayL.length;
            let addedR = 0;
            currentPlaying.tempArrayR.forEach((num) => {
                addedR += num;
            });
            let avgR = addedR/=currentPlaying.tempArrayL.length;
            currentPlaying.LeftChannel = (avgL + 140)/140;
            currentPlaying.RightChannel = (avgR + 140)/140;
        }
    }

}
