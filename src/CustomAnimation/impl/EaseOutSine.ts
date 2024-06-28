import {Animation} from "../Animation";

export class EaseOutSine extends Animation {
    protected func(x: number): number {
        return Math.sin((x * Math.PI) / 2);
    }
}