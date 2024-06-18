import {GeneralData} from "./Sections/General/GeneralData";
import {EditorData} from "./Sections/Editor/EditorData";
import {Metadata} from "./Sections/Metadata/Metadata";

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

}
