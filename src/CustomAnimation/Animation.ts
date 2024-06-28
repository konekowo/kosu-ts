export abstract class Animation {

    private startTime: number;
    private duration: number;
    private elapsedMS: number = 0;
    private reverse = false;
    private doReverse;
    public constructor(durationMS: number, doReverse:boolean, startTime?: number) {
        if (!startTime) {
            this.startTime = Date.now();
        }
        else {
            this.startTime = startTime;
        }
        this.doReverse = doReverse;
        this.duration = this.doReverse? durationMS/2 : durationMS;
    }

    public update() {
        this.elapsedMS = Date.now() - this.startTime;
        if (this.elapsedMS > this.duration) {
            this.reset();
            this.update();
        }
    }

    public getValue() {
        if (!this.reverse){
            return this.func(this.elapsedMS/this.duration);
        }
        else {
            return this.func(1 - (this.elapsedMS/this.duration));
        }

    }

    private reset() {
        this.startTime = Date.now();
        this.elapsedMS = 0;
        if (this.doReverse){
            this.reverse = !this.reverse;
        }
    }

    protected abstract func(x: number): number;
}