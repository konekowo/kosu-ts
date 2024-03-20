import {RangeSetting} from "../../SettingType/RangeSetting";
import {SettingsCategory} from "../../Setting";

export class UIScale extends RangeSetting {
    public readonly maxValue = 0.8;
    public readonly minValue = 1.6;
    public readonly increment = 0.1;
    public readonly defaultValue = 1;

    public constructor() {
        super({name: "UI scaling", category: SettingsCategory.Graphics});
        this.value = this.defaultValue;
    }

}