export class MathUtil {
    public static RadiansToDegrees(radians: number) {
        return radians * 180 / Math.PI;
    }

    public static DegreesToRadians(degrees: number) {
        return degrees * Math.PI / 180;
    }

    public static clamp(min: number, max: number, value: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static clamp01(value: number) {
        return MathUtil.clamp(0, 1, value);
    }

    public static Damp(start: number, final: number, base: number, exponent: number) {
        return MathUtil.Lerp(start, final, 1 - Math.pow(base, exponent));
    }

    public static Lerp(start: number, final: number, ammount: number) {
        return start + (final - start) * ammount;
    }

}
