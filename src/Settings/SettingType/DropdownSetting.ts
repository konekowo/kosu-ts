import {Setting} from "../Setting";

export abstract class DropdownSetting extends Setting {
    public abstract readonly list: DropDownOption[];
    public abstract readonly defaultValue: DropDownOption;
    protected value: DropDownOption | undefined;

    public getValue() {
        if (!this.value)
            throw new Error("Value is undefined!");
        return this.value;
    }
    public setValue(value: DropDownOption) {
        this.value = value;
    }
}

export interface DropDownOption {
    displayName: string;
    value: string;
}
