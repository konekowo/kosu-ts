import {TimingPoint} from "./TimingPoint";

export class InheritedTimingPoint extends TimingPoint {
    /**
     * a negative inverse slider velocity multiplier, as a percentage.
     * For example, `-50` would make all sliders in this timing section twice as fast as `SliderMultiplier`.
     */
    public sliderVelocityMultiplier!: number;

}