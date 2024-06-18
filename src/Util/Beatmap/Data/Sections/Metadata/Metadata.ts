/**
 * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#general">Information</a> used to identify the beatmap
 */
export class Metadata {
    /**
     * Romanised song title
     */
    public Title!: string;
    /**
     * Song title
     */
    public TitleUnicode!: string;
    /**
     * Romanised song artist
     */
    public Artist!: string;
    /**
     * Song artist
     */
    public ArtistUnicode!: string;
    /**
     * Beatmap creator
     */
    public Creator!: string;
    /**
     * Difficulty name
     */
    public Version!: string;
    /**
     * Original media the song was produced for
     */
    public Source: string | undefined;
    /**
     * Search terms
     */
    public Tags!: string[];
    /**
     * Difficulty ID
     */
    public BeatmapID!: number;
    /**
     * Beatmap ID
     */
    public BeatmapSetID!: number;
}
