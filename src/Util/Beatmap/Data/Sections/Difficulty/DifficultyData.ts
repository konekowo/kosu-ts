/**
 * <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#difficulty">Difficulty settings</a>
 */
export class DifficultyData {
    /**
     * HP setting (0–10)
     */
    public HPDrainRate!: number;
    /**
     * CS setting (0–10)
     */
    public CircleSize!: number;
    /**
     * OD setting (0–10)
     */
    public OverallDifficulty!: number;
    /**
     * AR setting (0–10)
     */
    public ApproachRate!: number;
    /**
     * Base slider velocity in hundreds of <a href="https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/osu%21_pixel">osu! pixels</a> per beat
     */
    public SliderMultiplier!: number;
    /**
     * Amount of slider ticks per beat
     */
    public SliderTickRate!: number;
}
