export default class Settings {
    private static modal: HTMLDivElement = document.querySelector(".settings-modal");
    private static elem_cols: HTMLInputElement = document.querySelector("#setting-column");
    private static elem_rows: HTMLInputElement = document.querySelector("#setting-row");
    private static elem_mines: HTMLInputElement = document.querySelector("#setting-mines");

    public static set cols(val: number) {
        Settings.elem_cols.value = val.toString();
    }

    public static get cols(): number {
        return parseInt(Settings.elem_cols.value);
    }

    public static set rows(val: number) {
        Settings.elem_rows.value = val.toString();
    }

    public static get rows(): number {
        return parseInt(Settings.elem_rows.value);
    }

    public static set mines(val: number) {
        Settings.elem_mines.value = val.toString();
    }

    public static get mines(): number {
        return parseInt(Settings.elem_mines.value);
    }

    public static isOpen(): boolean {
        return Settings.modal.style.display == "block";
    }
    
    public static toggle() {
        Settings.modal.style.display = Settings.modal.style.display == "block" ? "none" : "block";
    }

    public static show() {
        Settings.modal.style.display = "block";
    }

    public static hide() {
        Settings.modal.style.display = "none";
    }
}