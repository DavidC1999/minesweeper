export default class Board {
    private _cols: number;
    private _rows: number;
    private _mineAmt: number;

    private _board: Cell[][] = [];

    constructor(rows: number, cols: number, mineAmt: number, cells: Cell[][] = null) {
        this._cols = cols;
        this._rows = rows;
        this._mineAmt = mineAmt;

        if (cells == null)
            this.generateBoard(mineAmt);
        else
            this._board = cells;
    }

    public static fromSerialized(serialized: string): Board {
        let bytes = serialized.match(/.{1,2}/g).map(s => parseInt(s, 16));

        let i = 0;

        let version = bytes[i++];
        if (version != 0) throw new Error();

        let rows = bytes[i++];
        let cols = bytes[i++];
        let mineAmt = bytes[i++];

        let cells: Cell[][] = [];

        for (let j = 0; j < rows; ++j) {
            cells.push([]);
            for (let k = 0; k < cols; ++k) {
                cells[j].push(Cell.fromByte(bytes[i++]));
            }
        }

        return new Board(rows, cols, mineAmt, cells);
    }

    public serialize(): string {
        let output = [];
        output.push(0); // version
        output.push(this._rows);
        output.push(this._cols);
        output.push(this._mineAmt);

        for(let i = 0; i < this._rows; ++i) {
            for(let j = 0; j < this._cols; ++j) {
                output.push(this._board[i][j].toByte());
            }
        }

        return output.map(x => x.toString(16).padStart(2, '0')).join("");
    }

    private generateBoard(mineAmt: number) {
        let positions: [number, number][] = []; // tuple array

        for (let i = 0; i < this._rows; ++i) {
            this._board.push(new Array());
            for (let j = 0; j < this._cols; ++j) {
                positions.push([i, j]);
                this._board[i].push(new Cell());
            }
        }

        while (mineAmt-- > 0) {
            if (positions.length == 0) break;

            let rand = Math.floor(Math.random() * positions.length);

            let position = positions.splice(rand, 1)[0];
            this._board[position[0]][position[1]].isMine = true;
        }
    }

    public isMine(row: number, col: number): boolean {
        return this._board[row][col].isMine;
    }

    public setVisible(row: number, col: number) {
        this._board[row][col].isVisible = true;
        this._board[row][col].isFlag = false;
    }

    public setAllVisible() {
        for (let row = 0; row < this._rows; ++row) {
            for (let col = 0; col < this._cols; ++col) {
                this.setVisible(row, col);
            }
        }
    }

    public isVisible(row: number, col: number): boolean {
        return this._board[row][col].isVisible;
    }

    public getInvisibleLeft(): number {
        let output = 0;
        for (let row = 0; row < this._rows; ++row) {
            for (let col = 0; col < this._cols; ++col) {
                if (!this.isVisible(row, col)) ++output;
            }
        }
        return output;
    }

    public getFlagAmt(): number {
        let output = 0;
        for (let row = 0; row < this._rows; ++row) {
            for (let col = 0; col < this._cols; ++col) {
                if (this.isFlag(row, col)) ++output;
            }
        }
        return output;
    }

    public toggleFlag(row: number, col: number) {
        this._board[row][col].isFlag = !this._board[row][col].isFlag;
    }

    public isFlag(row, col): boolean {
        return this._board[row][col].isFlag;
    }

    public get cols() {
        return this._cols;
    }

    public get rows() {
        return this._rows;
    }

    public get mineAmt() {
        return this._mineAmt;
    }

    public countAdjacentMines(row: number, col: number) {
        let total = 0;

        // X--
        // -O-
        // ---
        // if (col - 1 >= 0 && row - 1 >= 0 && this.isMine(col - 1, row - 1)) total += 1;
        if (col - 1 >= 0 && row - 1 >= 0 && this.isMine(row - 1, col - 1)) total += 1;

        // -X-
        // -O-
        // ---
        // if (row - 1 >= 0 && this.isMine(col, row - 1)) total += 1;
        if (row - 1 >= 0 && this.isMine(row - 1, col)) total += 1;

        // --x
        // -O-
        // ---
        // if (col + 1 < this.cols && row - 1 >= 0 && this.isMine(col + 1, row - 1)) total += 1;
        if (col + 1 < this.cols && row - 1 >= 0 && this.isMine(row - 1, col + 1)) total += 1;

        // ---
        // XO-
        // ---
        // if (col - 1 >= 0 && this.isMine(col - 1, row)) total += 1;
        if (col - 1 >= 0 && this.isMine(row, col - 1)) total += 1;

        // ---
        // -OX
        // ---
        // if (col + 1 < this.cols && this.isMine(col + 1, row)) total += 1;
        if (col + 1 < this.cols && this.isMine(row, col + 1)) total += 1;

        // ---
        // -O-
        // X--
        // if (col - 1 >= 0 && row + 1 < this.rows && this.isMine(col - 1, row + 1)) total += 1;
        if (col - 1 >= 0 && row + 1 < this.rows && this.isMine(row + 1, col - 1)) total += 1;

        // ---
        // -O-
        // -X-
        // if (row + 1 < this.rows && this.isMine(col, row + 1)) total += 1;
        if (row + 1 < this.rows && this.isMine(row + 1, col)) total += 1;

        // ---
        // -O-
        // --X
        // if (col + 1 < this.cols && row + 1 < this.rows && this.isMine(col + 1, row + 1)) total += 1;
        if (col + 1 < this.cols && row + 1 < this.rows && this.isMine(row + 1, col + 1)) total += 1;

        return total;
    }
}

class Cell {
    public isMine: boolean = false;
    public isVisible: boolean = false;
    public isFlag: boolean = false;

    public toByte(): number {
        let output = this.isMine ? 1 : 0;

        output <<= 1;
        if (this.isVisible) output |= 1;
        output <<= 1;
        if (this.isFlag) output |= 1;

        return output;
    }

    public static fromByte(byte: number): Cell {
        let output = new Cell();

        output.isMine = ((byte >> 2) & 1) == 1;
        output.isVisible = ((byte >> 1) & 1) == 1;
        output.isFlag = ((byte >> 0) & 1) == 1;

        return output;
    }
}