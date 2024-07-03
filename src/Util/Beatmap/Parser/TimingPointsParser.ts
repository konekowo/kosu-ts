import {BeatmapData} from "../Data/BeatmapData";
import {UnInheritedTimingPoint} from "../Data/Sections/TimingPoints/UnInheritedTimingPoint";
import {InheritedTimingPoint} from "../Data/Sections/TimingPoints/InheritedTimingPoint";
import {Effect} from "../Data/Sections/TimingPoints/Effect";

export class TimingPointsParser {
    public static ParseTimingPoints(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let prop = str.split(",");
            let timingPoint;
            if (prop[6] == "1") {
                timingPoint = new UnInheritedTimingPoint();
                timingPoint.beatLength = Number.parseFloat(prop[1]);
                timingPoint.meter = Number.parseInt(prop[2]);
            }
            else {
                timingPoint = new InheritedTimingPoint();
                timingPoint.sliderVelocityMultiplier = Number.parseFloat(prop[1]);
            }
            timingPoint.time = Number.parseInt(prop[0]);
            timingPoint.sampleSet = Number.parseInt(prop[3]);
            timingPoint.sampleIndex = Number.parseInt(prop[4]);
            timingPoint.volume = Number.parseInt(prop[5]);
            if (prop[7] == "1" || prop[7] == "3"){
                timingPoint.effects = Number.parseInt(prop[7]);
            } else {
                timingPoint.effects = Effect.None;
            }

            beatmapData.TimingPoints.TimingPoints.push(timingPoint);
        });
    }
}
