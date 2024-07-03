import {TimingPoint} from "./TimingPoint";

export class UnInheritedTimingPoint extends TimingPoint {
    /**
     * The duration of a beat, in milliseconds.
     */
    public beatLength!: number;
    /**
     * Amount of beats in a measure.
     */
    public meter!: number;
}
