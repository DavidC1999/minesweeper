import Canvas from "./Canvas"
import Minesweeper, { GameState } from "./Minesweeper";

let canvasWidth = Math.min(window.innerWidth - 20, 800);
let canvasHeight = canvasWidth;

if (canvasHeight > window.innerHeight) {
    canvasWidth = window.innerHeight;
    canvasHeight = canvasWidth;
}

let canvas = new Canvas(canvasWidth, canvasHeight);

document.body.appendChild(canvas.elem);

let minesweeper = new Minesweeper(20, 20, canvas, 40);
minesweeper.draw();

canvas.elem.addEventListener("mouseup", (e) => {
    let [row, col] = mouseCoordsToRowAndCol(minesweeper, e.clientX, e.clientY);

    switch (e.button) {
        case 0: // left
            minesweeper.click(row, col);
            break;
        case 2: // right
            minesweeper.alternateClick(row, col);
            break;
    }

    minesweeper.draw();

    if (minesweeper.state == GameState.Lost) {
        drawLost();
    } else if(minesweeper.state == GameState.Won) {
        drawWon();
    }
});

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

    minesweeper = new Minesweeper(20, 20, canvas, 40);
    minesweeper.draw();
}

declare global {
    interface Window {resetGame:any}
}
window.resetGame = resetGame;

function mouseCoordsToRowAndCol(minesweeper: Minesweeper, x: number, y: number): [number, number] {
    var rect = canvas.elem.getBoundingClientRect();
    let canvasX = x - rect.left;
    let canvasY = y - rect.top;
    return [Math.floor(canvasY / minesweeper.cellHeight), Math.floor(canvasX / minesweeper.cellWidth)];
}