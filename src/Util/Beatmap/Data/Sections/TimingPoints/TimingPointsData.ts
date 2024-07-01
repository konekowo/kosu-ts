import {TimingPoint} from "./TimingPoint";
import {UnInheritedTimingPoint} from "./UnInheritedTimingPoint";
import {InheritedTimingPoint} from "./InheritedTimingPoint";

export class TimingPointsData {
    public TimingPoints: TimingPoint[] = [];

    /**
     * Returns the current timing point in an array using the time provided.
     * If the current timing point is inherited, it will also return the parent
     * timing point along with it in the array as the second index.
     */
    public GetCurrentTimingPoints(time: number) {
        let toReturn: TimingPoint[] = [];
        this.TimingPoints.forEach((timingPoint, index) => {
            if (timingPoint.time < time && index > 0) {
                toReturn.push(this.TimingPoints[index-1]);
            }
            else if (index == 0){
                toReturn.push(timingPoint);
            }
        });
        if (toReturn[0] instanceof UnInheritedTimingPoint) {
            this.TimingPoints.filter((timingPoint) => {return timingPoint instanceof InheritedTimingPoint})
                .forEach((timingPoint, index) => {
                if (timingPoint.time < time && index > 0) {
                    toReturn.push(this.TimingPoints[index-1]);
                }
                else if (index == 0){
                    toReturn.push(timingPoint);
                }
            });
            if (toReturn.length != 2) {
                throw new Error("Could not find a parent timing point for the un-inherited timing point!");
            }
        }
        if (toReturn.length == 0) {
            throw new Error("Could not find any timing points!");
        }
        return toReturn;
    }
}