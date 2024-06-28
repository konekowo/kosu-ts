export class MathUtil {
    public static RadiansToDegrees(radians: number) {
        return radians * 180 / Math.PI;
    }
    public static DegreesToRadians(degrees: number) {
        return degrees * Math.PI/180;
    }
    public static clamp(min: number, max: number, value: number){
        return Math.min(Math.max(value, min), max);
    }
    public static clamp01(value: number) {
        return MathUtil.clamp(0, 1, value);
    }
}