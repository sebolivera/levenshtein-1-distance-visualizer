import { applyPolar, rectToPolar } from "../../../utils/geometry";
import { WordNode } from "./types";

const getNodeForce = () => {
    return;
};

const getMaxNodeWeight = (nodes: Record<string, WordNode>): number => {
    let eq: number = 0;
    for (let node of Object.values(nodes)) {
        eq = node.linkedWords.length > eq ? node.linkedWords.length : eq;
    }
    return eq;
};

const correctOverlaps = (
    nodes: Record<string, WordNode>,
    mainName: string,
    radius: number
): boolean => {
    let hasMoved: boolean = false; // If at least one node has moved, the graph has settled
    let r: number = 1;
    for (let [word, node] of Object.entries(nodes)) {
        for (let [word2, node2] of Object.entries(nodes)) {
            if (word2 !== word) {
                let safetyCounter: number = 0;
                if (word2 !== mainName) {
                    let θ: number = 0.0;
                    let [_, dist] = rectToPolar(
                        [node.x, node.y],
                        [node2.x, node2.y]
                    );
                    while (dist < radius / 2 && safetyCounter < radius * 2) {
                        hasMoved = true; // If at least one node has moved, the graph has settled
                        r += 0.01; //pushes the node further away
                        [node2.x, node2.y] = applyPolar(
                            [node2.x, node2.y],
                            [θ, r]
                        );
                        if (safetyCounter > 100) {
                            //Okay. There is NO WAY this triggers. Right? RIGHT????
                            throw new Error(
                                `Suspicious random values reassignments occurring in node placement.`
                            );
                        }
                        safetyCounter++;
                        θ += 1;
                        [_, dist] = rectToPolar(
                            [node.x, node.y],
                            [node2.x, node2.y]
                        );
                    }
                }
            }
        }
    }
    return hasMoved;
};

const roughlyDistributeNodes = (
    inputNodes: Record<string, WordNode>,
    mainName: string,
    radius: number
): Record<string, WordNode> => {
    let nodes: Record<string, WordNode> = { ...inputNodes };
    let θ: number = 0.0;
    let r: number = radius * 10;
    let movedNodes: Set<string> = new Set<string>();
    let totalWords: Set<string> = new Set<string>(
        Object.entries(nodes).reduce(
            (prev: Array<any>, curr: [string, WordNode]) =>
                [...prev, curr[0]].concat(curr[1].linkedWords),
            []
        )
    );
    movedNodes.add(mainName);
    for (let subword of nodes[mainName].linkedWords) {
        if (subword !== mainName) {
            if (!Object.hasOwn(nodes, subword)) {
                throw new Error(
                    `Provided subnode ${subword} (linked to main node ${mainName}) doesn't exist in the graph. Did you properly initialize all nodes before attempting to place them?`
                );
            }

            θ += (Math.PI * 2.0) / nodes[mainName].linkedWords.length;
            [nodes[subword].x, nodes[subword].y] = applyPolar(
                [nodes[mainName].x, nodes[mainName].y],
                [θ, r]
            );

            movedNodes.add(subword);
        }
    }
    let safetyCounter: number = 0;
    while (
        movedNodes.size < totalWords.size &&
        safetyCounter < Object.keys(nodes).length
    ) {
        for (let node of Object.values(nodes)) {
            θ = 0.0;
            let moveRadius: boolean = false;
            for (let subword of node.linkedWords) {
                if (!movedNodes.has(subword)) {
                    moveRadius = true;
                    θ += (Math.PI * 2.0) / nodes[mainName].linkedWords.length;
                    [nodes[subword].x, nodes[subword].y] = applyPolar(
                        [node.x, node.y],
                        [θ, r]
                    );
                    movedNodes.add(subword);
                }
            }
            if (moveRadius) {
                r -= radius;
            }
        }
        safetyCounter++;
    }
    if (safetyCounter > totalWords.size) {
        console.log(new Set([...totalWords].filter((x) => !movedNodes.has(x))));
        throw new Error(`Suspicious set size after placement of nodes.`);
    }
    let hasMoved: boolean = true;
    while (hasMoved) {
        hasMoved = correctOverlaps(nodes, mainName, radius);
    }
    return nodes;
};

const redistributeNodes = (
    inputNodes: Record<string, WordNode>,
    maxDistance: number,
    minDistance: number,
    mainName: string,
    radius: number,
    settlingCounter?: number
): Record<string, WordNode> => {
    //TODO: not finished. Not quite sure what I was even going for now...
    let sc: number = settlingCounter ?? 0;
    /**
     * Redistributes a graph of nodes that haven't have been placed properly yet.
     *
     * @remarks
     * This is supposed to linked nodes according to their weights, but I haven't the slightest clue whether that's the proper way to go about it.
     *
     * @param inputNodes - Pseudo-Graph object containing all the nodes
     * @param maxDistance - Maximum (arbitrary) distance between any two nodes of a graph
     * @param minDistance - Minimum distance between any two nodes of a graph. Shouldn't be smaller than the maximum radius of a node
     * @param mainName - Name of the node the graph was based upon. Shouldn't move
     */
    let nodes: Record<string, WordNode> = { ...inputNodes };
    let hasMoved: boolean = false; // If at least one node has moved, the graph has settled
    correctOverlaps(nodes, mainName, radius);
    for (let [word, node] of Object.entries(nodes)) {
        for (let subword of node.linkedWords) {
            let subnode: WordNode = nodes[subword];
            if (!Object.hasOwn(nodes, subword)) {
                throw new Error(
                    `Provided subnode ${subword} (linked to ${word} node) doesn't exist in the graph. Did you properly initialize all nodes before attempting to place them?`
                );
            }
        }
    }
    return nodes;
};

const createSubNode = (
    word: string,
    baseWord: string,
    rawNodes: Record<string, any>
): WordNode => {
    let node: WordNode = {
        x: 0,
        y: 0,
        linkedWords: [
            ...(Object.hasOwn(rawNodes, word) ? rawNodes[word] : [word]),
        ],
        isHovered: false,
    };
    if (!node.linkedWords.includes(baseWord)) {
        node.linkedWords.push(baseWord);
    }
    return node;
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
        let newC: [number, number] = applyPolar(
            [nodes[word].x, nodes[word].y],
            rectToPolar([node.x, node.y], cursor),
            factor,
            ratio
        );
        nodes[word].x = newC[0];
        nodes[word].y = newC[1];
        // I KNOW there is a better syntax for this, but I forgot what it was.
    }
    return nodes;
};

export {
    getNodeForce,
    createSubNode,
    zoomNodes,
    getMaxNodeWeight,
    roughlyDistributeNodes,
};
