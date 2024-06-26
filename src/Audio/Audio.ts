import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";

export interface Audio {
    audioBlob: Blob;
    timeStarted: number;
    audioBufferSource?: AudioBufferSourceNode
    id: number;
    isPlaying: boolean
}
export interface MapAudio extends Audio {
    beatmap: BeatmapData;
    fadingOut: boolean;
    // @ts-ignore
    fadeOutTimeout?: Timeout
    playingCallback?: () => void;
    gainNode?: GainNode
}