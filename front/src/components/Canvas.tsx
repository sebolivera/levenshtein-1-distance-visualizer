import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "../config/axios";
import { lerp } from "../utils/math";

interface WordNode {
    x: number;
    y: number;
    linkedWords: Array<string>;
}

export default function Canvas(props: { word: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sizeSet, setSizeSet] = useState<boolean>(false);
    const [canvasRect, setCanvasRect] = useState<DOMRect>();
    const [isCanvasClicked, setIsCanvasClicked] = useState<boolean>(false);
    const [wordNodes, setWordNodes] = useState<Record<string, WordNode>>({
        test: { x: 350, y: 350, linkedWords: ["test1"] },
        test1: { x: 550, y: 550, linkedWords: ["test1", "test12"] },
        test2: { x: 650, y: 250, linkedWords: ["test1"] },
    });

    const [clickCursorOffset, setClickCursorOffset] = useState<
        [number, number]
    >([0, 0]);
    const [cursorPos, setCursorPos] = useState<[number, number]>([0, 0]);
    const [hoverCursorPos, setHoverCursorPos] = useState<[number, number]>([
        0, 0,
    ]);

    useEffect(() => {
        refreshCanvas();
    }, [wordNodes]);

    useEffect(() => {
        console.log("word", props.word);
        axios
            .get("/lev_dist/" + props.word)
            .then((res: Record<string, any>) => {
                let nodes: Record<string, WordNode> = {};
                if (res.data[props.word] && canvasRef.current) {
                    nodes[props.word] = {
                        x: canvasRef.current.width / 2,
                        y: canvasRef.current.height / 2,
                        linkedWords: res.data[props.word],
                    };
                    let angle = 0;
                    for (let i = 0; i < res.data[props.word].length; i++) {
                        //TODO: spread linked words in a circle
                        angle = (i / res.data[props.word].length) * Math.PI * 2;
                        nodes[res.data[props.word][i]] = {
                            x:
                                canvasRef.current.width / 2 +
                                (lerp(20, 6, res.data[props.word].length / 50) *
                                    res.data[props.word].length +
                                    angle) *
                                    Math.cos(angle),
                            y:
                                canvasRef.current.height / 2 +
                                (lerp(20, 6, res.data[props.word].length / 50) *
                                    res.data[props.word].length +
                                    angle) *
                                    Math.sin(angle),
                            linkedWords: [],
                        };
                    }
                    setWordNodes(nodes);
                }
            });
    }, [props.word]);

    useEffect(() => {
        if (sizeSet && canvasRef.current) {
            setCanvasRect(canvasRef.current.getBoundingClientRect());
        }
    }, [sizeSet]);

    const isInCircle = (
        cursor: [number, number],
        circle: [number, number, number]
    ): boolean => {
        return (
            Math.abs(circle[0] - cursor[0]) + Math.abs(circle[1] - cursor[1]) <=
            circle[2]
        );
    };

    const refreshCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
                if (Object.keys(wordNodes).length > 0) {
                    ctx.fillStyle = "#5555DD";
                    for (let [word, node] of Object.entries(wordNodes)) {
                        ctx.beginPath();
                        ctx.arc(
                            node.x + clickCursorOffset[0] + cursorPos[0],
                            node.y + clickCursorOffset[1] + cursorPos[1],
                            25,
                            0,
                            2 * Math.PI
                        );
                        if (isInCircle(hoverCursorPos, [node.x, node.y, 25])) {
                            ctx.fillStyle = "#55AA88";
                        } else {
                            ctx.fillStyle = "#44CCDD";
                        }
                        ctx.fill();
                        ctx.beginPath();
                        ctx.font = "20px Arial";
                        ctx.fillStyle = "#5555DD";
                        ctx.fillText(
                            word,
                            +(node.x - ctx.measureText(word).width / 2) +
                                clickCursorOffset[0] +
                                cursorPos[0],
                            node.y + 7.5 + clickCursorOffset[1] + cursorPos[1]
                        );
                        ctx.fill();
                    }
                }
                ctx.beginPath();
                ctx.fill();
                ctx.rect(
                    canvasRef.current.width - 200,
                    canvasRef.current.height - 100,
                    150,
                    75
                );
                ctx.fillStyle = "#33BB55";
                ctx.fill();
            }
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            if (!sizeSet) {
                canvasRef.current.style.width = "100%";
                canvasRef.current.style.height = "100%";
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight - 10;
                setSizeSet(true);
                refreshCanvas();
            }
        }
    }, [canvasRef]);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ): void => {
        // e.preventDefault();
        if (canvasRect) {
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            if (isCanvasClicked) {
                setCursorPos([x, y]);
            } else {
                setHoverCursorPos([x, y]);
            }
        }
    };

    useEffect(() => {
        if (isCanvasClicked) {
            refreshCanvas();
        }
    }, [cursorPos]);

    // useEffect(() => {// TODO: fix this
    //     if (!isCanvasClicked) {
    //         refreshCanvas();
    //     }
    // }, [hoverCursorPos]);

    const handleMouseOut = (
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsCanvasClicked(false);
    };

    const handleMouseClick = (
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        if (canvasRect) {
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            setCursorPos([x, y]);
            if (!isCanvasClicked) {
                setClickCursorOffset([
                    -x + clickCursorOffset[0],
                    -y + clickCursorOffset[1],
                ]);
                setIsCanvasClicked(true);
            }
        }
    };

    useEffect(() => {
        if (!isCanvasClicked) {
            setClickCursorOffset([
                clickCursorOffset[0] + cursorPos[0],
                clickCursorOffset[1] + cursorPos[1],
            ]);
        }
    }, [isCanvasClicked]);

    return (
        <Box
            className="canvasBox"
            display="flex"
            flexDirection="column"
            flexGrow={1}
        >
            <Box flex={1} sx={{ border: "1px solid red" }}>
                <canvas
                    ref={canvasRef}
                    onMouseMove={(e) => handleMouseMove(e)}
                    onMouseDown={(e) => {
                        handleMouseClick(e);
                    }}
                    onMouseUp={(e) => {
                        handleMouseOut(e);
                    }}
                    onMouseLeave={(e) => {
                        handleMouseOut(e);
                    }}
                    onMouseOut={(e) => {
                        handleMouseOut(e);
                    }}
                />
            </Box>
        </Box>
    );
}
