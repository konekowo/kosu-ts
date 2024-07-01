import {EventStoryboard} from "./EventStoryboard";
import {EventTypes} from "../EventTypes";
import {LoopType} from "./LoopType";

export class EventAnimation extends EventStoryboard {
    public eventType = EventTypes.ANIMATION;
    /**
     * (frameCount) indicates how many frames the animation has.
     * If we have "sample0.png" and "sample1.png", for instance, our `frameCount = 2`.
     */
    public frameCount!: number;
    /**
     * (frameDelay) indicates how many milliseconds should be in between each frame.
     * For instance, if we wanted our animation to advance at 2 frames per second, `frameDelay = 500`.
     */
    public frameDelay!: number;
    /**
     * (looptype) indicates if the animation should loop or not. Valid values are:
     *  - LoopForever (default if you leave this value off;
     *  the animation will return to the first frame after finishing the last frame)
     *  - LoopOnce (the animation will stop on the last frame and continue to display that last frame;
     *  useful for, like, an animation of someone turning around)
     */
    public loopType!: LoopType;
}
