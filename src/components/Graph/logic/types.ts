interface WordNode {
    x: number;
    y: number;
    linkedWords: Array<string>;
    isHovered: boolean;
    weight?:number,//*should* correspond to how many nodes are linked to it. Not exactly sure how that helps.
}

interface CursorInfo {
    xPos: number;
    yPos: number;
    xOffset: number;
    yOffset: number;
}

export type {WordNode, CursorInfo}
