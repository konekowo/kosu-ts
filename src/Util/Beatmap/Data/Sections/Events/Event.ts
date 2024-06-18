import {EventTypes} from "./EventTypes";

export class Event {
    /**
     * Type of the event. Some events may be referred to by either a name or a number.
     */
    public eventType!: EventTypes;
    /**
     * Start time of the event, in milliseconds from the beginning of the beatmap's audio. For events that do not use a start time, the default is 0.
     */
    public startTime: number = 0;
    /**
     * Extra parameters specific to the event's type.
     */
    public eventParams!: (string | number)[];
}
