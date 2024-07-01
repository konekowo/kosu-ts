import {TimingPointSampleSet} from "./TimingPointSampleSet";
import {Effect} from "./Effect";

export abstract class TimingPoint {
    /**
     * Start time of the timing section, in milliseconds from the beginning of the beatmap's audio.
     * The end of the timing section is the next timing point's time (or never, if this is the last timing point).
     */
    public time!: number;
    /**
     * Default sample set for hit objects (0 = beatmap default, 1 = normal, 2 = soft, 3 = drum).
     */
    public sampleSet!: TimingPointSampleSet;
    /**
     * Custom sample index for hit objects. 0 indicates osu!'s default hitsounds.
     */
    public sampleIndex!: number;
    /**
     * Volume percentage for hit objects.
     */
    public volume!: number;
    /**
     * Bit flags that give the timing point extra effects.
     * See <a href="https://osu.ppy.sh/wiki/en/Client/File_formats/osu_(file_format)#effects">the effects section</a>.
     */
    public effects!: Effect
}