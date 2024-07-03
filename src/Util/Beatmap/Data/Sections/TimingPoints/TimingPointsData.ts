import {TimingPoint} from "./TimingPoint";
import {UnInheritedTimingPoint} from "./UnInheritedTimingPoint";
import {InheritedTimingPoint} from "./InheritedTimingPoint";

/**
 * Timing and control points
 */
export class TimingPointsData {
    public TimingPoints: TimingPoint[] = [];

    /**
     * Returns the current timing point in an array using the time provided.
     * If the current timing point is inherited, it will also return the parent
     * timing point along with it in the array as the second index.
     */
    public GetCurrentTimingPoints(time: number) {
        let toReturn: TimingPoint[] = [];
        let filter = this.TimingPoints.filter((timingPoint) => {if (timingPoint.time <= time) {return timingPoint}});
        if (filter.length == 0) {
            filter.push(this.TimingPoints[0]);
        }
        toReturn.push(filter[filter.length-1]);

        if (toReturn[0] instanceof InheritedTimingPoint) {
            let filter = this.TimingPoints.filter((timingPoint) => {return timingPoint instanceof UnInheritedTimingPoint})
                .filter((timingPoint) => {if (timingPoint.time <= time) {return timingPoint}});
            if (filter.length == 0) {
                throw new Error("Could not find a parent timing point for the un-inherited timing point!");
            }
            toReturn.push(filter[filter.length-1]);
        }
        if (toReturn.length == 0) {
            throw new Error("Could not find any timing points!");
        }
        return toReturn;
    }

    public GetCurrentUninheritedTimingPoint(time: number) {
        let timingPoint = this.GetCurrentTimingPoints(time);
        let unInheritedTimingPoint: UnInheritedTimingPoint;
        if (timingPoint[0] instanceof UnInheritedTimingPoint) {
            unInheritedTimingPoint = timingPoint[0];
        }
        else if(timingPoint[1] instanceof UnInheritedTimingPoint){
            unInheritedTimingPoint = timingPoint[1];
        }
        else {
            throw new Error("Could not find any UnInherited Timing Points!")
        }
        return unInheritedTimingPoint;
    }

}
