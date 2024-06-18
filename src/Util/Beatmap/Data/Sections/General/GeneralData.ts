import {Countdown} from "./Countdown";
import {SampleSet} from "./SampleSet";
import {Mode} from "./Mode";
import {OverlayPosition} from "./OverlayPosition";
/**
 * General information about the beatmap
 */
export class GeneralData {
    /**
     * Location of the audio file relative to the current folder.
     */
    public AudioFileName: string | undefined;
    /**
     * Milliseconds of silence before the audio starts playing
     */
    public AudioLeadIn: number = 0;
    /**
     * @deprecated The `AudioHash` property is deprecated according to the osu! wiki.
     */
    public AudioHash: string | undefined;
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
     * <a href="https://osu.ppy.sh/wiki/en/Beatmap/Stack_leniency">Multiplier</a> for the
     * threshold in time where hit objects placed close together stack (0–1)
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
     * @deprecated The `StoryFireInFront` property is deprecated according to the osu! wiki.
     */
    public StoryFireInFront: boolean = true;
    /**
     * Whether or not the storyboard can use the user's skin images
     */
    public UseSkinSprites: boolean = false;
    /**
     * @deprecated The `AlwaysShowPlayfield` property is deprecated according to the osu! wiki.
     */
    public AlwaysShowPlayfield: boolean = false;
    /**
     * Draw order of hit circle overlays compared to hit numbers (NoChange = use skin setting,
     * Below = draw overlays under numbers, Above = draw overlays on top of numbers)
     */
    public OverlayPosition: OverlayPosition = OverlayPosition.NoChange;
    /**
     * Preferred skin to use during gameplay
     */
    public SkinPreference: string | undefined;
    /**
     * Whether or not a warning about flashing colours should be shown at the beginning of the map
     */
    public EpilepsyWarning: boolean = false;
    /**
     * Time in beats that the countdown starts before the first hit object
     */
    public CountdownOffset: number = 0;
    /**
     * Whether or not the "N+1" style key layout is used for osu!mania
     */
    public SpecialStyle: boolean = false;
    /**
     * Whether or not the storyboard allows widescreen viewing
     */
    public WidescreenStoryboard: boolean = false;
    /**
     * Whether or not sound samples will change rate when playing with speed-changing mods
     */
    public SamplesMatchPlaybackRate: boolean = false;
}
