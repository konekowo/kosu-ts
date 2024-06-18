import {GeneralData} from "./Sections/General/GeneralData";
import {EditorData} from "./Sections/Editor/EditorData";
import {Metadata} from "./Sections/Metadata/Metadata";
import {DifficultyData} from "./Sections/Difficulty/DifficultyData";
import {EventsData} from "./Sections/Events/EventsData";

/**
 * <a href="https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29">.osu (file format)</a>
 */
export class BeatmapData {
    /**
     * General information about the beatmap
     */
    public General: GeneralData = new GeneralData();
    /**
     * Saved settings for the beatmap editor
     */
    public Editor: EditorData = new EditorData();
    /**
     * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#general">Information</a> used to identify the beatmap
     */
    public Metadata: Metadata = new Metadata();
    /**
     * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#difficulty">Difficulty settings</a>
     */
    public Difficulty: DifficultyData = new DifficultyData();
    /**
     * Beatmap and storyboard graphic events
     */
    public Events: EventsData = new EventsData();
}
