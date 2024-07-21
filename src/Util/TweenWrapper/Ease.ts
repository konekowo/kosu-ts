import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";
import {Main} from "../../main";

export class Ease {
    private static previousEases: Ease[] = [];
    private easings: {tween: TWEEN.Tween<any>}[] = [];
    private obj: PIXI.Container;
    private delay: TWEEN.Tween<any> | null = null;

    public constructor(obj: PIXI.Container) {
        this.obj = obj;
        let checkIfEaseExists = Ease.previousEases.filter((ease) => {return ease.obj == this.obj;});
        if (checkIfEaseExists.length > 0){
            return checkIfEaseExists[0];
        }
        Ease.previousEases.push(this);
    }

    public createTween<T extends Record<string, any>>(value: T, newValue: T, isPrimitive: boolean, property: keyof PIXI.Container, duration: number, easing: (ammount: number) => number) {
        const tween = new TWEEN.Tween(value);
        tween.to(newValue, duration);
        tween.easing(easing);
        tween.onUpdate(() => {
            if (!isPrimitive) {
                // @ts-ignore
                this.obj[property] = value;
            }
            else {
                // @ts-ignore
                this.obj[property] = value.value;
            }
        });
        tween.onStart(() => {
            if (!isPrimitive) {
                // @ts-ignore
                for (let key in this.obj[property]) {
                    // @ts-ignore
                    value[key] = this.obj[property][key];
                }
            }
            else {
                // @ts-ignore
                value.value = this.obj[property];
            }
        });
        if (this.delay == null) {
            tween.start();
        }
        else {
            this.delay.chain(tween);
        }
        this.easings.push({tween: tween});
        const ondone = () => {
            this.easings = this.easings.filter((tweenInArray) => {return tweenInArray.tween != tween})
        }
        tween.onStop(() => {ondone()});
        tween.onComplete(() => {ondone()});
        return this;
    }

    public TransformTo(newPosition: PIXI.PointData, duration: number, easing: (ammount: number) => number) {
        this.createTween(this.obj.position, newPosition, false, "position", duration, easing);
        return this;
    }

    public ScaleTo(newScale: PIXI.PointData | number, duration: number, easing: (ammount: number) => number) {
        let _newScale: PIXI.PointData = {x: 0, y: 0};
        if (typeof newScale == "number"){
            _newScale.x = newScale;
            _newScale.y = newScale;
        }
        this.createTween(this.obj.scale, _newScale, false, "scale", duration, easing);
        return this;
    }

    public FadeTo(newAlpha: number, duration: number, easing: (ammount: number) => number) {
        this.createTween({value: this.obj.alpha}, {value: newAlpha}, true, "alpha", duration, easing);
        return this;
    }

    public FadeOut(duration: number, easing: (ammount: number) => number) {
        this.FadeTo(0, duration, easing);
        return this;
    }

    public FadeIn(duration: number, easing: (ammount: number) => number) {
        this.FadeTo(1, duration, easing);
        return this;
    }

    public ClearEasings() {
        this.easings.forEach((tween) => {
           tween.tween.stop();
        });
        this.easings = [];
        return this;
    }

    public Then() {
        let largestDuration = this.easings.sort((a, b) =>
        {return a.tween.getDuration() - b.tween.getDuration()});
        if (largestDuration.length > 0) {
            this.delay = largestDuration[0].tween;
        }
        return this;
    }
}

enum EaseTypes {
    Transform,
    Scale,
    Fade
}
