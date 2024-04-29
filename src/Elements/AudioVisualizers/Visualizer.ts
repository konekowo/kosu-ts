export class Visualizer {
    private currentAudio: HTMLAudioElement = new HTMLAudioElement();
    private audioContext: AudioContext = new AudioContext();
    private analyser: AnalyserNode;
    private frequencyData: Uint8Array = new Uint8Array();

    public constructor(audio: HTMLAudioElement) {
        this.analyser = this.audioContext.createAnalyser();
        this.setAudio(audio);
    }

    public setAudio(audio: HTMLAudioElement){
        this.currentAudio = audio;
        this.analyser.fftSize = 256;
        const source = this.audioContext.createMediaElementSource(this.currentAudio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
}
