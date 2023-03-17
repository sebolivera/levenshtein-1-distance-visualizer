interface WordNode {
    x: number;
    y: number;
    linkedWords: Array<string>;
    isHovered: boolean;
}

interface CursorInfo {
    xPos: number;
    yPos: number;
    xOffset: number;
    yOffset: number;
}

export type {WordNode, CursorInfo}
