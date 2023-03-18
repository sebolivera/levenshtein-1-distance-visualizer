import { Theme } from "@mui/material/styles";
import { isInCircle } from "../../../utils/geometry";
import { WordNode } from "../logic/types";
import { RectButton } from "./types";

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
        for (let node of Object.values(inputNodes)) {
            for (let subword of node.linkedWords) {
                if (Object.hasOwn(inputNodes, subword)) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(inputNodes[subword].x, inputNodes[subword].y);
                    ctx.strokeStyle = theme.palette.secondary.main;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        if (Object.keys(inputNodes).length > 0) {
            for (let [word, node] of Object.entries(inputNodes)) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle =node.isHovered
                    ? (ctx.fillStyle = theme.palette.secondary.light)
                    : node.color;

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
