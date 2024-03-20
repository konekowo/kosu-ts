import {Settings} from "./Settings";

export class Setting {
    public constructor(SettingData: SettingData) {
        Settings.register({setting: this, data: SettingData});
    }
}

export interface SettingData {
    name: string;
    category: SettingsCategory;
}

export enum SettingsCategory {
    General = "General",
    Skin = "Skin",
    Input = "Input",
    UserInterface = "User Interface",
    Gameplay = "Gameplay",
    Rulesets = "Rulesets",
    Audio = "Audio",
    Graphics = "Graphics",
    Online = "Online",
    Maintenance = "Maintenance",
    Debug = "Debug"
}