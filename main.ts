import Canvas from "./Canvas"
import addEventListeners, { EventInfo } from "./eventlisteners";
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
resetGame();


function click(alternate: boolean, x: number, y: number) {
    let [row, col] = renderer.coordsToRowAndCol(x, y);

    if (alternate) {
        minesweeper.alternateClick(row, col);
    } else {
        minesweeper.click(row, col);
    }

    renderer.draw();
    displayMinesLeft();

    if (minesweeper.state == GameState.Lost) {
        drawLost();
    } else if (minesweeper.state == GameState.Won) {
        drawWon();
    }
}

function moveCanvas(x: number, y: number) {
    renderer.addOffsetX(x);
    renderer.addOffsetY(y);
    renderer.draw();
}

function zoomCanvas(amt: number) {
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

function resetGame() {
    let modal: HTMLDivElement = document.querySelector(".lose-modal");
    modal.style.display = "none";
    modal = document.querySelector(".win-modal");
    modal.style.display = "none";

    minesweeper = new Minesweeper(Settings.rows, Settings.cols, Settings.mines);
    renderer = new Renderer(canvas, minesweeper);
    renderer.draw();
    displayMinesLeft();
}

function displayMinesLeft() {
    let elem = document.querySelector("#mines-left-value") as HTMLSpanElement;
    elem.innerText = (Settings.mines - minesweeper.board.getFlagAmt()).toString();
}

declare global {
    interface Window {
        resetGame: any,
        showSettings: any,
        hideSettings: any
    }
}
window.resetGame = resetGame;
window.showSettings = Settings.show;
window.hideSettings = () => {
    Settings.hide();
    resetGame();
}