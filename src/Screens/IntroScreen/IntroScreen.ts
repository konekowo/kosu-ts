import {Screen} from "../Screen";
import {Ticker} from "pixi.js";
import {unzip} from 'unzipit';
import {Main} from "../../main";

export class IntroScreen extends Screen {

    private readonly introTrackUrl: string;

    public constructor(introTrack: Blob) {
        super();
        this.introTrackUrl = URL.createObjectURL(introTrack);
    }
    public start() {
        // timeout to not give the player a jump scare
        setTimeout(async () => {
            const {entries} = await unzip(this.introTrackUrl);
            for (const [name, entry] of Object.entries(entries)) {
                if (name == "audio.mp3"){
                    entry.blob().then((audioBlob) => {
                        let audioUrl = URL.createObjectURL(audioBlob);
                        Main.currentPlayingAudio = new Audio(audioUrl);
                        Main.currentPlayingAudio.play();
                        this.afterAudioPlay();

                    });
                }
            }
        }, 500);
    }

    public afterAudioPlay() {

    }
    public draw(deltaTime: Ticker) {

    }

    public onClose(): Promise<Screen> {
        return Promise.resolve(this);
    }

    public onResize() {
    }
}