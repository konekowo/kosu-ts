import {BeatmapData} from "../Data/BeatmapData";
import {TimingPointsParser} from "./TimingPointsParser";
import {GeneralParser} from "./GeneralParser";

export class BeatmapParser {
    public static Parse(osuFileContent: string, storyBoardFileContent?: string): BeatmapData {
        const beatMapData = new BeatmapData();
        let osuFileContentLines = osuFileContent.split(/\r?\n|\r|\n/g);
        GeneralParser.ParseGeneral(beatMapData, BeatmapParser.GetSection("General", osuFileContentLines))
        TimingPointsParser.ParseTimingPoints(beatMapData, BeatmapParser.GetSection("TimingPoints", osuFileContentLines));
        return beatMapData
    }
    public static GetSection(sectionName: string, osuFileContentLines: string[]) {
        let section: string[] = [];
        osuFileContentLines.forEach((str, index) => {
            if (str == "["+sectionName+"]") {
                for (let i = index + 1; i < osuFileContentLines.length; i++) {
                    if (osuFileContentLines[i] == ""){
                        continue;
                    }
                    if (osuFileContentLines[i].startsWith("[")){
                        break;
                    }
                    section.push(osuFileContentLines[i]);
                }
            }
        });
        return section;
    }
}
