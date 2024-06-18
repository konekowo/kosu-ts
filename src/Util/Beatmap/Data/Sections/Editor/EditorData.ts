/**
 * Saved settings for the beatmap editor
 */
export class EditorData {
    /**
     * Time in milliseconds of <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Compose#song-timeline">bookmarks</a>
     */
    public Bookmarks: number[] | undefined;
    /**
     * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Distance_snap">Distance snap</a> multiplier
     */
    public DistanceSpacing: number | undefined;
    /**
     * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Distance_snap">Beat snap divisor</a>
     */
    public BeatDivisor: number | undefined;
    /**
     * <a href="https://osu.ppy.sh/wiki/en/Beatmapping/Grid_snapping">Grid size</a>
     */
    public GridSize: number | undefined;
    /**
     * Scale factor for the <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Compose#hit-object-timeline">object timeline</a>
     */
    public TimelineZoom: number | undefined;
}
