import {StoryboardCommand} from "./StoryboardCommand";
import {Event} from "../Event";
import {Layer} from "./Layer";
import {Origin} from "./Origin";

export abstract class EventStoryboard extends Event {
    public startTime = -1;
    /**
     * Each <a href="https://osu.ppy.sh/wiki/en/Storyboard/Scripting/Objects">object declaration</a>
     * is followed by one or more commands. These tell the object to do something, called an event,
     * such as move or change colour. You can think of each command as affecting a variable
     * (or set of variables) for that object; once a command is finished, the object keeps those values until
     * another command changes it. Objects who don't have a particular type of
     * command used will use the default value for that variable.
     */
    public Commands: StoryboardCommand[] = [];
    /**
     * (layer) is the <a href="https://osu.ppy.sh/wiki/en/Storyboard/Scripting/General_Rules">layer</a>
     * the object appears on.
     */
    public layer!: Layer;
    /**
     * (origin) is where on the image should osu! consider that image's origin (coordinate)
     * to be. This affects the (x) and (y) values, as well as several other command-specific
     * behaviours. For example, choosing (origin) = TopLeft will let the (x),(y) values determine,
     * where the top left corner of the image itself should be on the screen. The valid values are listed below.
     */
    public origin!: Origin;
    /**
     * (filepath) is, in laymans terms, the filename of the image you want. But it's not always quite that simple:
     *  - If you have a subfolder inside your Song Folder, you need to include that, as well.
     *      - Example: "backgrounds/sky.jpg" if you have a subfolder called "backgrounds" with an image called "sky.jpg" in it.
     *      Start listing directories only from the Song Folder, where the .osu or .osb file is (i.e., a relative filepath).
     *      It should not have something like "C:" anywhere in it.
     *  - Animations are referred to without their number. So if you have "sample0.png" and "sample1.png" as two frames
     *  to make a single animation, you want to refer to it as "sample.png".
     *  - The ""s are technically optional, but they're required if your filename or subfolder name has spaces.
     *      - Example: "SB/J_K.jpg" rather than SB/J_K.jpg. The prior will find in SB folder for J_K.jpg while the later will
     *      null the instance (it finds SB/J, an invalid variable).
     */
    public filepath!: string;
    /**
     * (x) and (y) are the x-/y-coordinates of where the object should be, by default respectively.
     * The interpretation of this depends on the value of (origin);
     * for instance, to place a 640x480 image as your background,
     * the values could be:
     *  - origin = TopLeft, x = 0, y = 0
     *  - origin = Centre, x = 320, y = 240
     *  - origin = BottomRight, x = 640, y = 480
     *  - and so on.
     */
    public x!: number;
    /**
     * (x) and (y) are the x-/y-coordinates of where the object should be, by default respectively.
     * The interpretation of this depends on the value of (origin);
     * for instance, to place a 640x480 image as your background,
     * the values could be:
     *  - origin = TopLeft, x = 0, y = 0
     *  - origin = Centre, x = 320, y = 240
     *  - origin = BottomRight, x = 640, y = 480
     *  - and so on.
     */
    public y!: number;

}
