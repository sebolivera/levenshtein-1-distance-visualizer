import { Theme, useThemeProps } from "@mui/material";
import { isInCircle } from "../../../utils/math";
import { rectToPolar, applyPolar } from "../logic";
import { WordNode } from "../logic/types";
import { RectButton, RectCoordinates } from "./types";

const drawGUI = (
    canvas: HTMLCanvasElement,
    buttonInfo: RectButton,
    theme: Theme
) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.beginPath();
        ctx.fill();
        ctx.rect(canvas.width - 200, canvas.height - 100, 150, 75);
        ctx.fillStyle = !buttonInfo.isHovered
            ? theme.palette.primary.main
            : theme.palette.primary.light;
        ctx.fill();
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = theme.palette.primary.contrastText;
        ctx.fillText("Center", canvas.width - 190, canvas.height - 50);
    }
};

const dragCanvas = (
    offset: [number, number],
    wordNodes: Record<string, WordNode>
): Record<string, WordNode> => {
    let nodes: Record<string, WordNode> = {};
    for (let [word, node] of Object.entries(wordNodes)) {
        nodes[word] = { ...node };
        nodes[word].x = node.x + offset[0];
        nodes[word].y = node.y + offset[1];
    }
    return nodes;
};

const highlightNodes = (
    cursorPos: [number, number],
    wordNodes: Record<string, WordNode>,
    radius: number
) => {
    let nodes: Record<string, WordNode> = {};
    let hasBeenHovered: boolean = false;
    for (let [word, node] of Object.entries(wordNodes)) {
        nodes[word] = { ...node };
        nodes[word].isHovered =
            !hasBeenHovered && isInCircle(cursorPos, [node.x, node.y, radius]);
        if (nodes[word].isHovered) {
            hasBeenHovered = true;
        }
    }
    return nodes;
};

const zoomCanvas = (deltaY: number, zoomFactor: number): number => {
    if ((zoomFactor >= 0 && deltaY > 0) || (zoomFactor <= 0 && deltaY < 0)) {
        return zoomFactor + deltaY;
    } else {
        return deltaY;
    }
};

const drawNodes = (
    inputNodes: Record<string, WordNode>,
    canvas: HTMLCanvasElement,
    centerCursorButtonInfo: RectButton,
    theme: Theme,
    radius: number
) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Object.keys(inputNodes).length > 0) {
            for (let [word, node] of Object.entries(inputNodes)) {
                let nodeC: RectCoordinates = { x: node.x, y: node.y };
                for (let subword of node.linkedWords) {
                    if (Object.hasOwn(inputNodes, subword) && subword!==word) {
                        //WARNING: not entirely sure what the following code does, but it works. Yes, I made it all by myself. No, I still don't know why it works.
                        //TODO: check whether this works for large amounts of nodes
                        ctx.beginPath();
                        let currentNodeC: RectCoordinates = {
                            x: inputNodes[subword].x,
                            y: inputNodes[subword].y,
                        };
                        let { θ, r } = rectToPolar(nodeC, currentNodeC);
                        let newC: RectCoordinates = applyPolar(currentNodeC, {
                            θ,
                            r:radius-r,
                        });
                        let newDest: RectCoordinates = applyPolar(
                            nodeC,
                            { θ, r:r-radius }
                        );
                        ctx.moveTo(newC.x, newC.y);
                        ctx.lineTo(newDest.x, newDest.y);
                        ctx.strokeStyle = theme.palette.secondary.main;
                        ctx.lineWidth = 5;
                        ctx.stroke();
                    }
                }
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                node.isHovered
                    ? (ctx.fillStyle = theme.palette.info.dark)
                    : (ctx.fillStyle = theme.palette.info.light);

                ctx.fill();
                ctx.beginPath();
                ctx.font = `${radius * 0.75}px Arial`;
                ctx.fillStyle = theme.palette.info.contrastText;
                ctx.fillText(
                    word,
                    +(node.x - ctx.measureText(word).width / 2),
                    node.y + radius / 5
                );
                ctx.fill();
            }
        }
    }
    drawGUI(canvas, centerCursorButtonInfo, theme);
};

export { drawGUI, dragCanvas, highlightNodes, zoomCanvas, drawNodes };
