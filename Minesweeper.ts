import Board from "./Board";
import Canvas from "./Canvas";

export default class Minesweeper {
    private _board: Board;
    private _canvas: Canvas;

    private _mineAmt: number;

    private _state: GameState = GameState.Playing;

    public cellWidth: number;
    public cellHeight: number;

    constructor(rows: number, cols: number, canvas: Canvas, mineAmt: number) {
        this._canvas = canvas;

        this._board = new Board(rows, cols, mineAmt);
        this._mineAmt = mineAmt;

        this.cellWidth = canvas.width / cols;
        this.cellHeight = canvas.height / rows;
    }

    public click(row: number, col: number) {
        if(this._state != GameState.Playing) return;
        if (this._board.isFlag(row, col)) return;

        this.recurseVisibility(row, col);

        if (this._board.isMine(row, col)) {
            // player lost
            this._board.setAllVisible();
            this._state = GameState.Lost;
        } else if(this._board.getInvisibleLeft() == this._mineAmt) {
            // player won
            this._state = GameState.Won;
        }
    }

    public alternateClick(row: number, col: number) {
        if(this._state != GameState.Playing) return;
        this._board.toggleFlag(row, col);
    }

    public get state() {
        return this._state;
    }

    public draw() {
        this._canvas.clear();

        // draw lines:
        for (let col = 1; col < this._board.cols; ++col) {
            this._canvas.drawLine(col * this.cellWidth, 0, col * this.cellWidth, this._canvas.height, "white");
        }

        for (let row = 1; row < this._board.rows; ++row) {
            this._canvas.drawLine(0, row * this.cellHeight, this._canvas.width, row * this.cellHeight, "white");
        }

        for (let row = 0; row < this._board.rows; ++row) {
            for (let col = 0; col < this._board.cols; ++col) {
                this.drawCell(row, col);
            }
        }
    }

    private drawCell(row: number, col: number) {
        let shouldDrawFlag = true;
        if (!this._board.isVisible(row, col)) {
            const offset = 5;
            let x = (col * this.cellWidth) + offset;
            let y = (row * this.cellHeight) + offset;
            let w = this.cellWidth - offset * 2;
            let h = this.cellHeight - offset * 2;

            this._canvas.drawRect(x, y, w, h, 'gray');
        } else if (this._board.isMine(row, col)) {
            let x = (col * this.cellWidth) + (this.cellWidth / 2);
            let y = (row * this.cellHeight) + (this.cellHeight / 2);
            let r = Math.min(this.cellWidth, this.cellHeight) / 2;
            r *= 0.9;

            this._canvas.drawCircle(x, y, r, 'red');
        } else {
            let adjecentMines = this._board.countAdjacentMines(row, col);
            let theText = "" + adjecentMines;

            let textHeight = (this.cellHeight * 0.8);
            this._canvas.setFont(textHeight + "pt sans-serif", "white");

            const offsetX = (this.cellWidth - this._canvas.findTextWidth(theText)) / 2;
            const offsetY = this.cellHeight * 0.1;

            let textX = col * this.cellWidth + offsetX;
            let textY = (row + 1) * this.cellHeight - offsetY;


            if (adjecentMines > 0) {
                this._canvas.drawText(theText, textX, textY,);
            }

            shouldDrawFlag = false;
        }

        if (shouldDrawFlag && this._board.isFlag(row, col)) {
            this._canvas.drawImage("img-flag", col * this.cellWidth, row * this.cellHeight, this.cellWidth, this.cellHeight);
        }

    }

    private recurseVisibility(row: number, col: number) {
        if (row < 0 ||
            col < 0 ||
            row >= this._board.rows ||
            col >= this._board.cols ||
            this._board.isVisible(row, col)) return;

        this._board.setVisible(row, col);
        if (this._board.countAdjacentMines(row, col) == 0) {
            this.recurseVisibility(row - 1, col - 1);
            this.recurseVisibility(row - 1, col);
            this.recurseVisibility(row - 1, col + 1);
            this.recurseVisibility(row, col + 1);
            this.recurseVisibility(row + 1, col + 1);
            this.recurseVisibility(row + 1, col);
            this.recurseVisibility(row + 1, col - 1);
            this.recurseVisibility(row, col - 1);
        }
    }
}

export enum GameState {
    Playing,
    Won,
    Lost
}