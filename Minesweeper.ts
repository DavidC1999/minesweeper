import Board from "./Board";
import Canvas from "./Canvas";

export default class Minesweeper {
    private _board: Board;

    private _mineAmt: number;

    private _state: GameState = GameState.Playing;

    constructor(board: Board) {
        this._board = board;
    }

    public get board() {
        return this._board;
    }

    public click(row: number, col: number) {
        if (this._state != GameState.Playing) return;
        if (this._board.isFlag(row, col)) return;

        this.recurseVisibility(row, col);

        if (this._board.isMine(row, col)) {
            // player lost
            this._board.setAllVisible();
            this._state = GameState.Lost;
        } else if (this._board.getInvisibleLeft() == this._board.mineAmt) {
            // player won
            this._state = GameState.Won;
        }
    }

    public alternateClick(row: number, col: number) {
        if (this._state != GameState.Playing) return;
        this._board.toggleFlag(row, col);
    }

    public get state() {
        return this._state;
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