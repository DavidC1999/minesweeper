export default class Canvas {
    private _elem: HTMLCanvasElement;

    private _ctx: CanvasRenderingContext2D;

    private _temp;

    constructor(width: number, height: number) {
        this._elem = document.createElement('canvas');
        this._elem.width = width;
        this._elem.height = height;
        this._elem.oncontextmenu = () => false;

        this._ctx = this._elem.getContext("2d");
    }

    get elem(): HTMLCanvasElement {
        return this._elem;
    }

    get height() {
        return this._elem.height;
    }

    get width() {
        return this._elem.width;
    }

    public clear() {
        this._ctx.clearRect(0, 0, this._elem.width, this._elem.height);
    }

    public drawRect(x1: number, y1: number, w: number, h: number, color: string) {
        this._ctx.beginPath();
        this._ctx.rect(x1, y1, w, h);
        this._ctx.fillStyle = color;
        this._ctx.fill();
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = 2;
        this._ctx.stroke();
    }

    public drawCircle(x: number, y: number, r: number, color: string) {
        this._ctx.beginPath();
        this._ctx.arc(x, y, r, 0, 2 * Math.PI);
        this._ctx.fillStyle = color;
        this._ctx.fill();
    }

    public setFont(font: string, color: string) {
        this._ctx.font = font;
        this._ctx.fillStyle = color;
    }

    public findTextWidth(text: string): number {
        return this._ctx.measureText(text).width;
    }

    public drawText(text: string, x: number, y: number) {
        this._ctx.fillText(text, x, y);
    }

    public drawImage(id: string, x: number, y: number, w: number, h: number) {
        let image = document.getElementById(id) as HTMLImageElement;
        this._ctx.drawImage(image, x, y, w, h);
    }
}