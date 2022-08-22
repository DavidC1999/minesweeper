import Canvas from "./Canvas";

let keyTimers = {
    "w": null,
    "a": null,
    "s": null,
    "d": null,
};

let mouseDown = false;
let mouseDragged = false;
export default function addEventListeners(info: EventInfo) {
    document.addEventListener("mousedown", () => {
        mouseDown = true;
        mouseDragged = false;
    });

    document.addEventListener("mousemove", (e) => {
        if (!mouseDown) return;

        mouseDragged = true;

        info.moveCanvas(e.movementX, e.movementY);
    })

    document.addEventListener("mouseup", (e) => {
        mouseDown = false;

        if (!mouseDragged) {
            info.onCanvasClick(e);
            return;
        }
    });

    document.addEventListener("wheel", (e) => {
        console.log(e.deltaY);
        
        if(e.deltaY < 0) {
            info.zoomCanvas(0.1);
        } else {
            info.zoomCanvas(-0.1);
        }
    });

    document.addEventListener("keypress", (e) => {
        const speed = 1;

        switch (e.key) {
            case "w":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.moveCanvas(0, -1), speed);
                break;
            case "a":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.moveCanvas(-1, 0), speed);
                break;
            case "s":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.moveCanvas(0, 1), speed);
                break;
            case "d":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.moveCanvas(1, 0), speed);
                break;
            case "+":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.zoomCanvas(0.005), speed);
                break;
            case "-":
                if (keyTimers[e.key] == null)
                    keyTimers[e.key] = setInterval(() => info.zoomCanvas(-0.005), speed);
                break;
        }
    });

    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "w":
            case "a":
            case "s":
            case "d":
            case "+":
            case "-":
                clearInterval(keyTimers[e.key]);
                keyTimers[e.key] = null;
                break;
        }
    });
}

export class EventInfo {
    public canvas: Canvas;
    public onCanvasClick: (e: MouseEvent) => void;
    public moveCanvas: (x: number, y: number) => void;
    public zoomCanvas: (amt: number) => void;
}