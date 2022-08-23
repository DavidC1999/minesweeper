import Canvas from "./Canvas";

let keyTimers = {
    "w": null,
    "a": null,
    "s": null,
    "d": null,
};

let mouseDown = false;
let mouseDragged = false;

enum TouchType {
    None,
    Tap,
    Drag,
    Pinch,
    Hold,
};

let touchType = TouchType.None;
let prevPinchDist = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchPrevX = 0;
let touchPrevY = 0;
let longPressTimer: number;


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
            info.onCanvasClick(e.button == 2, e.clientX, e.clientY);
            return;
        }
    });

    document.addEventListener("touchstart", (e) => {
        e.preventDefault();

        if (e.touches.length == 2) {
            touchType = TouchType.Pinch;
            prevPinchDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY);
        } else {
            touchType = TouchType.Tap;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchPrevX = touchStartX;
            touchPrevY = touchStartY;

            longPressTimer = setTimeout(() => {
                if (touchType == TouchType.Tap) {
                    touchType = TouchType.Hold;
                    window.navigator.vibrate([50]);

                    let original = info.canvas.elem.style.outline;
                    info.canvas.elem.style.outline = "1px solid red";
                    setTimeout(() => {
                        info.canvas.elem.style.outline = original;
                    }, 100);
                }
            }, 300);
        }
    });

    document.addEventListener("touchmove", (e) => {
        e.preventDefault();

        clearTimeout(longPressTimer);

        if (touchType == TouchType.Pinch) {
            let pinchDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY);

            let delta = prevPinchDist - pinchDist;
            info.zoomCanvas(delta / -200);
            prevPinchDist = pinchDist;
        } else if (touchType != TouchType.Hold) {
            touchType = TouchType.Drag;
            let touch = e.touches[0];
            let deltaX = touch.clientX - touchPrevX;
            let deltaY = touch.clientY - touchPrevY;

            info.moveCanvas(deltaX, deltaY);

            touchPrevX = touch.clientX;
            touchPrevY = touch.clientY;
        }
    });

    document.addEventListener("touchend", (e) => {
        clearTimeout(longPressTimer);

        if ((touchType == TouchType.Tap || touchType == TouchType.Hold)) {
            info.onCanvasClick(touchType == TouchType.Hold, touchStartX, touchStartY);
        }

        touchType = TouchType.None;
    });

    document.addEventListener("wheel", (e) => {
        if (e.deltaY < 0) {
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
    public onCanvasClick: (alternate: boolean, x: number, y: number) => void;
    public moveCanvas: (x: number, y: number) => void;
    public zoomCanvas: (amt: number) => void;
}