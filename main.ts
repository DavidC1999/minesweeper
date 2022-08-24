import Board from "./Board";
import Canvas from "./Canvas"
import addEventListeners, { EventInfo } from "./eventlisteners";
import LocalStorage from "./LocalStorage";
import Minesweeper, { GameState } from "./Minesweeper";
import Renderer from "./Renderer";
import Settings from "./Settings";

// calculate the canvas dimensions
let canvasWidth = Math.min(window.innerWidth - 20, 800);
let canvasHeight = canvasWidth;

if (canvasHeight > window.innerHeight) {
    canvasWidth = window.innerHeight;
    canvasHeight = canvasWidth;
}

// give the bar the same width as the canvas
let test = document.getElementsByClassName("bar")[0] as HTMLDivElement;
test.style.width = canvasWidth + "px";

// create and add the canvas to the DOM
let canvas = new Canvas(canvasWidth, canvasHeight);
document.body.appendChild(canvas.elem);

// start the game
let minesweeper: Minesweeper, renderer: Renderer;
let image = document.getElementById("img-flag") as HTMLImageElement;
console.log("Image load already complete: ", image.complete);

if (image.complete) { // if the image has already loaded
    resetGame();
} else {
    image.addEventListener("load", () => { // if the image has not loaded we wait for it to load
        resetGame();
    });
}

function click(alternate: boolean, x: number, y: number) {
    if (Settings.isOpen()) return;

    let [row, col] = renderer.coordsToRowAndCol(x, y);

    if (alternate) {
        minesweeper.alternateClick(row, col);
    } else {
        minesweeper.click(row, col);
    }

    LocalStorage.setBoard(minesweeper.board);

    renderer.draw();
    displayMinesLeft();

    if (minesweeper.state == GameState.Lost) {
        drawLost();
        LocalStorage.removeBoard();
    } else if (minesweeper.state == GameState.Won) {
        drawWon();
        LocalStorage.removeBoard();
    }
}

function moveCanvas(x: number, y: number) {
    if (Settings.isOpen()) return;

    renderer.addOffsetX(x);
    renderer.addOffsetY(y);
    renderer.draw();
}

function zoomCanvas(amt: number) {
    if (Settings.isOpen()) return;

    renderer.zoom(amt);
    renderer.draw();
}

let eventInfo = new EventInfo;
eventInfo.canvas = canvas;
eventInfo.onCanvasClick = click;
eventInfo.moveCanvas = moveCanvas;
eventInfo.zoomCanvas = zoomCanvas;
addEventListeners(eventInfo);

function drawLost() {
    let modal: HTMLDivElement = document.querySelector(".lose-modal");
    modal.style.display = "block";
}

function drawWon() {
    let modal: HTMLDivElement = document.querySelector(".win-modal");
    modal.style.display = "block";
}

function generateBoard(forceNewBoard = false) {
    let board = LocalStorage.getBoard();

    if (forceNewBoard || board == null) {
        let newBoard = new Board(Settings.rows, Settings.cols, Settings.mines);
        LocalStorage.setBoard(newBoard);
        return newBoard;
    }

    Settings.cols = board.cols;
    Settings.rows = board.rows;
    Settings.mines = board.mineAmt;

    return board;
}

function resetGame(forceNewBoard = false) {
    console.log("resetting game");

    let modal: HTMLDivElement = document.querySelector(".lose-modal");
    modal.style.display = "none";
    modal = document.querySelector(".win-modal");
    modal.style.display = "none";

    let board = generateBoard(forceNewBoard);
    console.log("generated board");

    minesweeper = new Minesweeper(board);
    renderer = new Renderer(canvas, minesweeper);
    console.log("drawing");
    renderer.draw();
    console.log("draw called worked");

    displayMinesLeft();
}

function displayMinesLeft() {
    let elem = document.querySelector("#mines-left-value") as HTMLSpanElement;
    elem.innerText = (Settings.mines - minesweeper.board.getFlagAmt()).toString();
}

declare global {
    interface Window {
        resetGame: any,
        toggleSettings: any,
        hideSettings: any
    }
}
window.resetGame = resetGame;
window.toggleSettings = Settings.toggle;
window.hideSettings = () => {
    Settings.hide();
    resetGame(true);
}