import Canvas from "./Canvas";
import Minesweeper from "./Minesweeper";

export default class Renderer {
    private _canvas: Canvas;
    private _minesweeper: Minesweeper;

    private _cellWidth: number;
    private _cellHeight: number;

    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _zoom: number = 1;

    constructor(canvas: Canvas, minesweeper: Minesweeper) {
        this._canvas = canvas;
        this._minesweeper = minesweeper;

        this._cellWidth = canvas.width / minesweeper.board.cols;
        this._cellHeight = canvas.height / minesweeper.board.rows;
    }

    public addOffsetX(amt: number) {
        this._offsetX += amt;
    }

    public addOffsetY(amt: number) {
        this._offsetY += amt;
    }

    public zoom(amt: number) {
        this._zoom += amt;

        if (this._zoom <= 0.1) {
            this._zoom = 0.1;
            return;
        }

        if (this._zoom >= 10) {
            this._zoom = 10;
            return
        }

        var rect = this._canvas.elem.getBoundingClientRect();
        let canvasCenterY = rect.top + rect.height / 2;
        let canvasCenterX = rect.left + rect.width / 2;

        let [boardX, boardY] = this.pageCoordsToBoardCoords(canvasCenterX, canvasCenterY);

        let deltaX = (boardX * (1 + amt)) - boardX;
        let deltaY = (boardY * (1 + amt)) - boardY;

        this.addOffsetX(-deltaX);
        this.addOffsetY(-deltaY);
    }

    public pageCoordsToBoardCoords(x: number, y: number): [number, number] {
        var rect = this._canvas.elem.getBoundingClientRect();
        let canvasX = x - rect.left;
        let canvasY = y - rect.top;

        canvasX -= this._offsetX;
        canvasY -= this._offsetY;
        canvasX /= this._zoom;
        canvasY /= this._zoom;

        return [canvasX, canvasY];
    }

    public coordsToRowAndCol(x: number, y: number): [number, number] {
        let [canvasX, canvasY] = this.pageCoordsToBoardCoords(x, y);
        return [Math.floor(canvasY / this._cellHeight), Math.floor(canvasX / this._cellWidth)];
    }

    public draw() {
        this._canvas.clear();

        this._canvas.pushContext();
        this._canvas.translate(this._offsetX, this._offsetY);
        this._canvas.scale(this._zoom);

        // draw lines:
        for (let col = 1; col < this._minesweeper.board.cols; ++col) {
            this._canvas.drawLine(col * this._cellWidth, 0, col * this._cellWidth, this._canvas.height, "white", 2 / this._zoom);
        }

        for (let row = 1; row < this._minesweeper.board.rows; ++row) {
            this._canvas.drawLine(0, row * this._cellHeight, this._canvas.width, row * this._cellHeight, "white", 2 / this._zoom);
        }

        for (let row = 0; row < this._minesweeper.board.rows; ++row) {
            for (let col = 0; col < this._minesweeper.board.cols; ++col) {
                this.drawCell(row, col);
            }
        }

        this._canvas.popContext();
    }

    private drawCell(row: number, col: number) {
        let shouldDrawFlag = true;
        if (!this._minesweeper.board.isVisible(row, col)) {
            const offsetX = this._cellWidth * 0.1;
            const offsetY = this._cellHeight * 0.1;
            let x = (col * this._cellWidth) + offsetX;
            let y = (row * this._cellHeight) + offsetY;
            let w = this._cellWidth - offsetX * 2;
            let h = this._cellHeight - offsetY * 2;

            this._canvas.drawRect(x, y, w, h, 'gray');
        } else if (this._minesweeper.board.isMine(row, col)) {
            let x = (col * this._cellWidth) + (this._cellWidth / 2);
            let y = (row * this._cellHeight) + (this._cellHeight / 2);
            let r = Math.min(this._cellWidth, this._cellHeight) / 2;
            r *= 0.9;

            this._canvas.drawCircle(x, y, r, 'red');
        } else {
            let adjecentMines = this._minesweeper.board.countAdjacentMines(row, col);
            let theText = "" + adjecentMines;

            let textHeight = (this._cellHeight * 0.8);
            this._canvas.setFont(textHeight + "pt sans-serif", "white");

            const offsetX = (this._cellWidth - this._canvas.findTextWidth(theText)) / 2;
            const offsetY = this._cellHeight * 0.1;

            let textX = col * this._cellWidth + offsetX;
            let textY = (row + 1) * this._cellHeight - offsetY;


            if (adjecentMines > 0) {
                this._canvas.drawText(theText, textX, textY,);
            }

            shouldDrawFlag = false;
        }

        if (shouldDrawFlag && this._minesweeper.board.isFlag(row, col)) {
            this._canvas.drawImage("img-flag", col * this._cellWidth, row * this._cellHeight, this._cellWidth, this._cellHeight);
        }

    }
}