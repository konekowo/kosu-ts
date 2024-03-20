import {Setting, SettingData} from "./Setting";
import {UIScale} from "./impl/Graphics/UIScale";
import {RangeSetting} from "./SettingType/RangeSetting";

export class Settings {
    private static settingsList: SettingWithData[] = [];

    public constructor() {
        new UIScale();
    }
    public static register(setting: SettingWithData){
        this.settingsList.push(setting);
    }

    public static getRangeSetting(settingName: string): RangeSetting {
        let found = false;
        this.settingsList.forEach((setting) => {
            if (setting.data.name == settingName && setting.setting instanceof RangeSetting){
                found = true;
                return setting.setting;
            }
        });
        if (!found){
            throw new Error("Invalid Setting Name!");
        }
        // to satisfy typescript compiler
        return new UIScale();
    }

    public static getList() {
        return this.settingsList;
    }
}

export interface SettingWithData {
    readonly setting: Setting;
    readonly data: SettingData;
}