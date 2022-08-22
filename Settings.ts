export default class Settings {
    private static modal: HTMLDivElement = document.querySelector(".settings-modal");
    private static elem_cols: HTMLInputElement = document.querySelector("#setting-column");
    private static elem_rows: HTMLInputElement = document.querySelector("#setting-row");
    private static elem_mines: HTMLInputElement = document.querySelector("#setting-mines");

    public static get cols(): number {
        return parseInt(Settings.elem_cols.value);
    }

    public static get rows(): number {
        return parseInt(Settings.elem_rows.value);
    }

    public static get mines(): number {
        return parseInt(Settings.elem_mines.value);
    }

    public static show() {
        Settings.modal.style.display = "block";
    }

    public static hide() {
        Settings.modal.style.display = "none";
    }
}