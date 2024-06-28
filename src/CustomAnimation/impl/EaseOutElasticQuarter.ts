import {Animation} from "../Animation";

export class EaseOutElasticQuarter extends Animation {
    private static readonly elastic_offset_quarter = Math.pow(2, -10) * Math.sin((.25 - (.3/4)) * (2 * Math.PI / .3));
    protected func(x: number): number {
        return Math.pow(2, -10 * x) * Math.sin((.25 * x - (.3/4)) * (2 * Math.PI / .3)) + 1 - EaseOutElasticQuarter.elastic_offset_quarter * x;
    }
}