import * as PIXI from "pixi.js";
import {Main} from "../../main";
import {ease, Easing} from "pixi-ease";
import {Loader} from "../../Loader";
import {MathUtil} from "../../Util/MathUtil";
import {Screen} from "../../Screens/Screen";

export class MenuCursor extends PIXI.Container {
    private mouseCursor = PIXI.Sprite.from("menu.cursor");
    private mouseCursorAdditive = PIXI.Sprite.from("menu.cursor.additive");
    private mouseContainer = new PIXI.Container();
    private animContainer = new PIXI.Container();
    private animRotationContainer = new PIXI.Container();
    private mouseDownScaleAnim: Easing | undefined;
    private mouseDownAdditiveAnim: Easing | undefined;
    private mouseUpScaleAnim: Easing | undefined;
    private mouseUpAdditiveAnim: Easing | undefined;
    private mouseRotationAnim: Easing | undefined;
    private dragRotationState: DragRotationState = DragRotationState.NotDragging;
    private lastDragRotationState: DragRotationState = DragRotationState.NotDragging;
    private mouseHideContainer = new PIXI.Container();

    private hideScaleAnim: Easing | undefined;
    private hideAlphaAnim: Easing | undefined;

    private posMouseDown: { x: number, y: number } = {x: 0, y: 0};

    private mouseIsDown = false;

    private cursorTapSample = Loader.GetAudio("menu.cursor.sample.tap");

    private mouseButtonClicked: number = -9999;

    public constructor(visible: boolean) {
        super();
        this.updateMouse();
        this.mouseContainer.scale.set(0.07 * Screen.getScaleBasedOffScreenSize());
        this.mouseCursorAdditive.alpha = 0;
        this.mouseCursorAdditive.blendMode = "add";
        this.mouseCursorAdditive.tint = "0xFF66AA"
        this.mouseContainer.addChild(this.mouseCursor);
        this.mouseContainer.addChild(this.mouseCursorAdditive);
        this.animContainer.addChild(this.mouseContainer);
        this.animRotationContainer.addChild(this.animContainer);
        this.mouseHideContainer.addChild(this.animRotationContainer);
        this.addChild(this.mouseHideContainer);
        if (!visible) {
            this.mouseHideContainer.scale.set(0.6);
            this.mouseHideContainer.alpha = 0;
            this.animRotationContainer.angle = 0;
        }
        this.zIndex = 999999;
        this.eventMode = "none";
        Main.app.stage.addChild(this);
        this.addEventListeners();
    }

    public addEventListeners() {
        Main.app.stage.addEventListener("mousedown", (e) => {
            this.mouseButtonClicked = e.button;
            if (this.visible) {
                this.posMouseDown = {x: Main.mousePos.x, y: Main.mousePos.y};
                this.mouseIsDown = true;
                this.dragRotationState = DragRotationState.DragStarted;
                if (this.mouseUpScaleAnim && this.mouseUpAdditiveAnim) {
                    this.mouseUpScaleAnim.remove();
                    this.mouseUpAdditiveAnim.remove();
                }
                this.mouseDownScaleAnim = ease.add(this.animContainer, {scale: 0.9}, {
                    ease: "easeOutQuint",
                    duration: 800
                });
                this.mouseDownAdditiveAnim = ease.add(this.mouseCursorAdditive, {alpha: 1}, {
                    ease: "easeOutQuint",
                    duration: 800
                });
                Main.AudioEngine.PlayEffect(this.cursorTapSample);
            }
        });
        Main.app.stage.addEventListener("mouseup", (e) => {
            if (this.visible && e.button == this.mouseButtonClicked) {
                this.mouseIsDown = false;
                if (this.mouseDownScaleAnim && this.mouseDownAdditiveAnim) {
                    this.mouseDownAdditiveAnim.remove();
                    this.mouseDownScaleAnim.remove();
                }
                this.mouseUpScaleAnim = ease.add(this.animContainer, {scale: 1}, {
                    ease: "easeOutElastic",
                    duration: 500
                });
                this.mouseUpAdditiveAnim = ease.add(this.mouseCursorAdditive, {alpha: 0}, {
                    ease: "easeOutQuint",
                    duration: 500
                });
                if (this.dragRotationState != DragRotationState.NotDragging) {
                    if (this.dragRotationState == DragRotationState.Rotating) {
                        this.mouseRotationAnim = ease.add(this.animRotationContainer, {angle: 0}, {
                            ease: "easeOutElastic",
                            duration: 800 * (0.5 + Math.abs(this.animRotationContainer.angle / 960))
                        });
                    }
                    this.dragRotationState = DragRotationState.NotDragging;
                }
                Main.AudioEngine.PlayEffect(this.cursorTapSample, 0.8);
            }
        });
    }

    public PopIn() {
        if (this.mouseRotationAnim) {
            this.mouseRotationAnim.remove();
        }
        if (this.hideAlphaAnim && this.hideScaleAnim) {
            this.hideAlphaAnim.remove();
            this.hideScaleAnim.remove();
        }
        this.visible = true;
        this.hideAlphaAnim = ease.add(this.mouseHideContainer, {alpha: 1}, {duration: 250, ease: "easeOutQuint"});
        this.hideScaleAnim = ease.add(this.mouseHideContainer, {scale: 1}, {duration: 400, ease: "easeOutQuint"});
        this.mouseRotationAnim = ease.add(this.animRotationContainer, {angle: 0}, {
            duration: 400,
            ease: "easeOutQuint"
        });
        this.dragRotationState = DragRotationState.NotDragging
    }

    public PopOut() {
        if (this.mouseRotationAnim) {
            this.mouseRotationAnim.remove();
        }
        if (this.hideAlphaAnim && this.hideScaleAnim) {
            this.hideAlphaAnim.remove();
            this.hideScaleAnim.remove();
        }
        this.hideAlphaAnim = ease.add(this.mouseHideContainer, {alpha: 0}, {duration: 250, ease: "easeOutQuint"});
        this.hideScaleAnim = ease.add(this.mouseHideContainer, {scale: 0.6}, {duration: 250, ease: "easeOutQuint"});
        this.mouseRotationAnim = ease.add(this.animRotationContainer, {angle: 0}, {
            duration: 400,
            ease: "easeOutQuint"
        });
        this.hideAlphaAnim.once("complete", () => {
            this.visible = false;
        });
        this.dragRotationState = DragRotationState.NotDragging;
    }

    public updateMouse() {
        this.mouseContainer.scale.set(0.07 * Screen.getScaleBasedOffScreenSize());
        this.position.set(Main.mousePos.x, Main.mousePos.y);
        if (this.dragRotationState != DragRotationState.NotDragging && this.visible) {
            let distance = Math.sqrt((((Math.abs(this.posMouseDown.x - Main.mousePos.x)) ^ 2) +
                ((Math.abs(this.posMouseDown.y - Main.mousePos.y)) ^ 2)));
            if (this.dragRotationState == DragRotationState.DragStarted && distance > 15) {
                this.dragRotationState = DragRotationState.Rotating;
                if (this.lastDragRotationState != this.dragRotationState) {
                    this.posMouseDown = {x: Main.mousePos.x, y: Main.mousePos.y};
                }
            }

            if (this.dragRotationState == DragRotationState.Rotating && distance > 0) {
                if (this.mouseRotationAnim) {
                    this.mouseRotationAnim.remove();
                }
                let offsetX = Main.mousePos.x - this.posMouseDown.x;
                let offsetY = Main.mousePos.y - this.posMouseDown.y;
                let degrees = MathUtil.RadiansToDegrees(Math.atan2(-offsetX, offsetY)) + 24.3;

                let diff = (degrees - this.animRotationContainer.angle) % 360;
                if (diff < -180) {
                    diff += 360;
                }
                if (diff > 180) {
                    diff -= 360;
                }
                degrees = this.animRotationContainer.angle + diff;

                this.mouseRotationAnim = ease.add(this.animRotationContainer, {angle: degrees}, {
                    duration: 120,
                    ease: "easeOutQuint"
                });
            }
        }
        this.lastDragRotationState = this.dragRotationState;

    }


}

enum DragRotationState {
    NotDragging,
    DragStarted,
    Rotating
}
