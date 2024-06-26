import {PlayingAudios} from "./PlayingAudios";
import {Audio, MapAudio} from "./Audio";
import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";
import {arrayBuffer} from "node:stream/consumers";

export class AudioEngine {
    private readonly _audioContext: AudioContext;
    private readonly _playingAudios: PlayingAudios;
    private _musicQueue: MapAudio[] = [];
    private _audioIdTicker: number = 0;

    public constructor() {
        this._audioContext = new AudioContext();
        this._playingAudios = new PlayingAudios();
    }

    public Update() {
        if (this._musicQueue[0]){
            if (!this._musicQueue[0].fadingOut && this._musicQueue[0].timeStarted == 0){
                this._play(this._musicQueue[0]);
            }
            if (this._musicQueue[0].fadingOut){
                if (this._musicQueue[1]){
                    this._play(this._musicQueue[1]);
                }
            }
        }
    }

    public GetCurrentPlayingMusic() {
        return this._musicQueue[0];
    }

    private _play(audio: Audio | MapAudio, pitch?: number) {
        audio.audioBlob.arrayBuffer().then((arrayBuffer => {
            this._audioContext.decodeAudioData(arrayBuffer).then(audioBuff => {
                audio.audioBufferSource = this._audioContext.createBufferSource();
                audio.audioBufferSource.buffer = audioBuff;
                // check if audio is type of MapAudio
                if ("beatmap" in audio && audio.beatmap){
                    this._playingAudios.audios.forEach((audio) => {
                        if ("beatmap" in audio && audio.beatmap){
                            clearTimeout(audio.fadeOutTimeout);
                            audio.fadingOut = true;
                            audio.gainNode!.gain.linearRampToValueAtTime(0, this._audioContext.currentTime + 0.4);
                            setTimeout(() => {
                                audio.audioBufferSource!.stop(0);
                            }, 400);
                        }
                    });
                    let gainNode = this._audioContext.createGain();
                    gainNode.gain.value = 0;
                    gainNode.connect(this._audioContext.destination);
                    audio.audioBufferSource.connect(gainNode);
                    audio.audioBufferSource.start(0);
                    if (audio.playingCallback) {audio.playingCallback();}
                    audio.gainNode = gainNode;
                    audio.timeStarted = Date.now();
                    audio.isPlaying = true;
                    this._playingAudios.audios.push(audio);
                    gainNode.gain.linearRampToValueAtTime(1, this._audioContext.currentTime + 0.4);
                    const doFadeOut = () => {
                        audio.fadingOut = true;
                        gainNode.gain.linearRampToValueAtTime(0, this._audioContext.currentTime + 0.4);
                        this.Update();
                    }
                    audio.fadeOutTimeout = setTimeout(doFadeOut, (audioBuff.duration - 0.4)*1000);
                }
                else {
                    audio.audioBufferSource.connect(this._audioContext.destination);
                    if (pitch){
                        audio.audioBufferSource.playbackRate.value = pitch;
                    }
                    audio.audioBufferSource.start(0);
                    audio.isPlaying = true;
                    audio.timeStarted = Date.now();
                    this._playingAudios.audios.push(audio);
                }


                audio.audioBufferSource.onended = () => {
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
                }
            });
        }));
    }

    public PlayEffect(audioBlob: Blob, pitch?: number) {
        this._play({audioBlob: audioBlob, timeStarted: 0, id: this._audioIdTicker, isPlaying: false}, pitch);
        this._audioIdTicker++;
    }

    public AddToMusicQueue(mapAudio: Blob, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        let mapAudioObj: MapAudio = {
            audioBlob: mapAudio,
            fadingOut: false,
            timeStarted: 0,
            beatmap: beatMapData,
            id: this._audioIdTicker,
            isPlaying: false
        };
        if (musicPlayingCallback){
            mapAudioObj.playingCallback = musicPlayingCallback;
        }
        this._musicQueue.push(mapAudioObj);
        this._audioIdTicker++;
        this.Update();
        return mapAudioObj.id;
    }

    public PlayMusicImmediately(mapAudio: Blob, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        // clear queue
        this._musicQueue = [];
        this.AddToMusicQueue(mapAudio, beatMapData, musicPlayingCallback);
    }

}