import { RectCoordinates, PolarCoordinates } from "../UI/types";
import { WordNode } from "./types";

const getNodeForce = () => {
    return;
};

const createSubNode = (
    word: string,
    baseWord: string,
    rawNodes: Record<string, any>
): WordNode => {
    let node: WordNode = {
        x: 0,
        y: 0,
        linkedWords: [...(Object.hasOwn(rawNodes, word) ? rawNodes[word] : [])],
        isHovered: false,
    };
    if (!node.linkedWords.includes(baseWord)) {
        node.linkedWords.push(baseWord);
    }
    return node;
};

const rectToPolar = (
    p1: RectCoordinates,
    p2: RectCoordinates
): PolarCoordinates => {
    let r: number = getAmplitude(p2, p1);
    let θ: number = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    return { θ, r };
};

const applyPolar = (
    point: RectCoordinates,
    vect: PolarCoordinates,
    factor?: number,
    inputRatio?: number
): RectCoordinates => {
    let ratio: number = inputRatio ?? 1;
    if (ratio === 0) {
        ratio = 1;
    }
    return {
        x: point.x + (factor ?? 1) * (vect.r / ratio ?? 1) * Math.cos(vect.θ),
        y: point.y + (factor ?? 1) * (vect.r / ratio) * Math.sin(vect.θ),
    };
};

const zoomNodes = (
    factor: number,
    cursor: [number, number],
    ratio: number, // just the width, as using height in combination will result in gradual skewing of the zoom
    wordNodes: Record<string, WordNode>
) => {
    let nodes: Record<string, WordNode> = {};
    for (let [word, node] of Object.entries(wordNodes)) {
        nodes[word] = { ...node };
        let newC: RectCoordinates = applyPolar(
            { x: nodes[word].x, y: nodes[word].y },
            rectToPolar(
                { x: node.x, y: node.y },
                { x: cursor[0], y: cursor[1] }
            ),
            factor,
            ratio
        );
        nodes[word].x = newC.x;
        nodes[word].y = newC.y;
        // I KNOW there is a better syntax for this, but I forgot what it was.
    }
    return nodes;
};

const getAmplitude = (p1: RectCoordinates, p2: RectCoordinates): number => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};
export { getNodeForce, createSubNode, zoomNodes, rectToPolar, applyPolar };
