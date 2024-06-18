import {Event} from "./Event";
import {EventTypes} from "./EventTypes";
export class EventBackground extends Event {
    public eventType = EventTypes.BACKGROUND;
    public startTime = 0;
    /**
     * Location of the background image relative to the beatmap directory. Double quotes are
     * usually included surrounding the filename, but they are not required.
     */
    public filename!: string;
    /**
     * Offset in osu! pixels from the centre of the screen.
     * For example, an offset of 50,100 would have the background shown 50 osu! pixels to the
     * right and 100 osu! pixels down from the centre of the screen. If the offset is 0,0, writing it is optional.
     */
    public xOffset!: number;
    /**
     * Offset in osu! pixels from the centre of the screen.
     * For example, an offset of 50,100 would have the background shown 50 osu! pixels to the
     * right and 100 osu! pixels down from the centre of the screen. If the offset is 0,0, writing it is optional.
     */
    public yOffset!: number;
}
