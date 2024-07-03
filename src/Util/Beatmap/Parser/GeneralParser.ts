import {BeatmapData} from "../Data/BeatmapData";

export class GeneralParser {
    public static ParseGeneral(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[0] == "AudioFilename") {
                if (propValue[1].startsWith(" ")){
                    beatmapData.General.AudioFileName = propValue[1].substring(1, propValue[1].length);
                }
                else {
                    beatmapData.General.AudioFileName = propValue[1];
                }
            }
            if (propValue[0] == "AudioFilename") {
                if (propValue[1].startsWith(" ")){
                    beatmapData.General.AudioFileName = propValue[1].substring(1, propValue[1].length);
                }
                else {
                    beatmapData.General.AudioFileName = propValue[1];
                }
            }
        })
    }

}
