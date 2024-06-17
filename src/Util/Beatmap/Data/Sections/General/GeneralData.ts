import {Countdown} from "./Countdown";
import {SampleSet} from "./SampleSet";
import {Mode} from "./Mode";

export class GeneralData {
    /**
     * Location of the audio file relative to the current folder.
     */
    public AudioFileName!: string;
    /**
     * Milliseconds of silence before the audio starts playing
     */
    public AudioLeadIn: number = 0;
    /**
     * @deprecated The AudioHash property is deprecated according to the osu! wiki.
     */
    public AudioHash!: string;
    /**
     * Time in milliseconds when the audio preview should start
     */
    public PreviewTime: number = -1;
    /**
     * Speed of the countdown before the first hit object (0 = no countdown, 1 = normal, 2 = half, 3 = double)
     */
    public Countdown: Countdown = Countdown.Normal;
    /**
     * Sample set that will be used if timing points do not override it (Normal, Soft, Drum)
     */
    public SampleSet: SampleSet = SampleSet.Normal;
    /**
     * Multiplier for the threshold in time where hit objects placed close together stack (0–1)
     */
    public StackLeniency: number = 0.7;
    /**
     * Game mode (0 = osu!, 1 = osu!taiko, 2 = osu!catch, 3 = osu!mania)
     */
    public Mode: Mode = Mode.OSU;
    /**
     * Whether or not breaks have a letterboxing effect
     */
    public LetterboxInBreaks: boolean = false;
    /**
     * @deprecated The StoryFireInFront property is deprecated according to the osu! wiki.
     */
    public StoryFireInFront: boolean = true;


}