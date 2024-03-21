import {Setting, SettingData} from "./Setting";
import {UIScale} from "./impl/Graphics/UIScale";
import {RangeSetting} from "./SettingType/RangeSetting";
import {Renderer} from "./impl/Graphics/Renderer";
import {DropDownOption, DropdownSetting} from "./SettingType/DropdownSetting";

export class Settings {
    private static settingsList: SettingWithData[] = [];

    public constructor() {
        new Renderer();
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

    public static getDropDownSetting(settingName: string): DropdownSetting {
        let found = false;
        this.settingsList.forEach((setting) => {
            if (setting.data.name == settingName && setting.setting instanceof DropdownSetting){
                found = true;
                return setting.setting;
            }
        });
        if (!found){
            throw new Error("Invalid Setting Name!");
        }
        // to satisfy typescript compiler
        return new Renderer();
    }

    public static getList() {
        return this.settingsList;
    }
}

export interface SettingWithData {
    readonly setting: Setting;
    readonly data: SettingData;
}
