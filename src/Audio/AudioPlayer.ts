export class AudioPlayer {
    public static playingAudios: Audio[] = [];
    private static audioChangeListeners: ((newAudio: Audio) => void)[] = [];
    private static musicQueue: MusicData[] = [];
    private static autoPlay: boolean = true;

    public static play(audio: Blob) {
        if (this.playingAudios.length > 0){
            let interval: NodeJS.Timeout;
            interval = setInterval(() => {
                let volume = this.playingAudios[0].audio.volume;
                volume -= 0.01;
                if (volume < 0){
                    volume = 0;
                    clearInterval(interval);
                    this.playingAudios[0].audio.pause();
                    this.playingAudios.splice(0, 1);
                    return;
                }
                if (volume > 1){
                    volume = 1;
                }
                this.playingAudios[0].audio.volume = volume;
            }, 10);


        }
        let audioURL = URL.createObjectURL(audio);
        this.playingAudios.push({ audio: new Audio(audioURL), startTime: 0 });
        return new Promise<void>((resolve) => {
            this.playingAudios[this.playingAudios.length - 1].audio.play().then(() => {
                resolve();
                this.audioChangeListeners.forEach((listener) => {
                    listener(this.playingAudios[this.playingAudios.length - 1]);
                });
                this.playingAudios[this.playingAudios.length - 1].startTime = Date.now();
            });
        });
    }

    public static addToQueue(audio: Blob) {
        let audioURL = URL.createObjectURL(audio);
        this.musicQueue.push({audio: new Audio(audioURL), startTime: 0, beatmapID: 0});
    }

    public static playFromQueue() {
        
    }

    public static setAutoPlay(value: boolean){
        this.autoPlay = value;
    }
    public static isAutoPlayOn(){
        return this.autoPlay;
    }

    public static onAudioChange(listener: (newAudio: Audio) => void){
        this.audioChangeListeners.push(listener);
    }

    public static removeOnAudioChange(listener: (newAudio: Audio) => void){
        this.audioChangeListeners = this.audioChangeListeners.filter((listeners) => listeners !== listener);
    }


    public static playSoundEffect(audio: Blob) {
        let audioURL = URL.createObjectURL(audio);
        let effect = new Audio(audioURL);
        effect.play();
        effect.onended = () => {
            URL.revokeObjectURL(audioURL);
        }
    }
}
interface Audio {
    audio: HTMLAudioElement;
    startTime: number;
}
interface MusicData extends Audio{
    beatmapID: number
}
