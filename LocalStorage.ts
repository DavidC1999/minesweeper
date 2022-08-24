import Board from "./Board";

export default class LocalStorage {
    public static getBoard(): Board {
        let serialized = window.localStorage.getItem("board");

        let output: Board;

        try {
            output = Board.fromSerialized(serialized);
        } catch {
            output = null;
        }

        return output;
    }

    public static setBoard(board: Board) {
        window.localStorage.setItem("board", board.serialize());
    }

    public static removeBoard() {
        window.localStorage.removeItem("board");
    }
}