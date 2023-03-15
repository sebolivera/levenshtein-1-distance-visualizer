import { Box } from "@mui/material";
import {
    MouseEvent as ReactMouseEvent,
    WheelEvent,
    Dispatch,
    useEffect,
    useRef,
    useState,
    SetStateAction,
} from "react";
import axios from "../config/axios";
import { getAmplitude, isInCircle, isInRect, lerp } from "../utils/math";

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

interface RectButton {
    x: number;
    y: number;
    w: number;
    h: number;
    isHovered: boolean;
}

export default function Canvas(props: {
    word: string;
    radius: number;
    setWord: Dispatch<SetStateAction<string>>;
    repeats: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sizeSet, setSizeSet] = useState<boolean>(false);
    const [canvasDim, setCanvasDim] = useState<DOMRect>();
    const [isCanvasClicked, setIsCanvasClicked] = useState<boolean>(false);
    const [wordNodesInit, setWordNodesInit] = useState<
        Record<string, WordNode>
    >({
        test: { x: 350, y: 350, linkedWords: ["test1"], isHovered: false },
    });
    const [wordNodes, setWordNodes] = useState<Record<string, WordNode>>({
        test: { x: 350, y: 350, linkedWords: ["test1"], isHovered: false },
        test1: {
            x: 550,
            y: 550,
            linkedWords: ["test1", "test12"],
            isHovered: false,
        },
        test2: { x: 650, y: 250, linkedWords: ["test1"], isHovered: false },
    });

    const [centerCursorButtonInfo, setCenterCursorButtonInfo] =
        useState<RectButton>({
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            isHovered: false,
        });

    const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
        xPos: 0,
        yPos: 0,
        xOffset: 0,
        yOffset: 0,
    });

    const [zoomFactor, setZoomFactor] = useState<number>(1);

    useEffect(() => {
        canvasRef.current && displayNodes(wordNodes, canvasRef.current);
    }, [props.radius]);

    useEffect(() => {
        for (let [word, node] of Object.entries(wordNodes)) {
            if (node.isHovered) {
                props.setWord(word);
            }
        }
    }, [isCanvasClicked]);

    useEffect(() => {
        if (props.word && props.word.length > 0) {
            axios
                .get("/lev_dist/" + props.word)
                .then((res: Record<string, any>) => {
                    let nodes: Record<string, WordNode> = {};
                    if (res.data[props.word] && canvasRef.current) {
                        let angle = 0;
                        if (res.data[props.word].length === 1) {
                            nodes[props.word] = {
                                x:
                                    canvasRef.current.width / 2 -
                                    props.radius * 2,
                                y: canvasRef.current.height / 2,
                                linkedWords: res.data[props.word],
                                isHovered: false,
                            };
                            nodes[res.data[props.word][0]] = {
                                x:
                                    canvasRef.current.width / 2 +
                                    props.radius * 2,
                                y: canvasRef.current.height / 2,
                                linkedWords: res.data[props.word],
                                isHovered: false,
                            };
                        } else {
                            nodes[props.word] = {
                                x: canvasRef.current.width / 2,
                                y: canvasRef.current.height / 2,
                                linkedWords: res.data[props.word],
                                isHovered: false,
                            };
                            for (
                                let i = 0;
                                i < res.data[props.word].length;
                                i++
                            ) {
                                angle =
                                    (i / res.data[props.word].length) *
                                    Math.PI *
                                    2;
                                nodes[res.data[props.word][i]] = {
                                    x:
                                        canvasRef.current.width / 2 +
                                        (lerp(
                                            props.radius * 2,
                                            1,
                                            res.data[props.word].length / 25
                                        ) *
                                            res.data[props.word].length +
                                            angle) *
                                            Math.cos(angle),
                                    y:
                                        canvasRef.current.height / 2 +
                                        (lerp(
                                            props.radius * 2,
                                            1,
                                            res.data[props.word].length / 25
                                        ) *
                                            res.data[props.word].length +
                                            angle) *
                                            Math.sin(angle),
                                    linkedWords: [],
                                    isHovered: false,
                                };
                            }
                        }
                        setWordNodes(nodes);
                        setWordNodesInit(nodes);
                    } else {
                        setWordNodes({
                            "?": {
                                x: canvasRef.current
                                    ? canvasRef.current.width / 2
                                    : 0,
                                y: canvasRef.current
                                    ? canvasRef.current.height / 2
                                    : 0,
                                linkedWords: [],
                                isHovered: false,
                            },
                        });
                        setWordNodesInit({
                            "?": {
                                x: canvasRef.current
                                    ? canvasRef.current.width / 2
                                    : 0,
                                y: canvasRef.current
                                    ? canvasRef.current.height / 2
                                    : 0,
                                linkedWords: [],
                                isHovered: false,
                            },
                        });
                    }
                });
            axios
                .get("/lev_dist/" + props.word + "/" + props.repeats)
                .then((res: Record<string, any>) => {
                    console.log(res.data);
                });
        } else {
            setWordNodes({
                "?": {
                    x: canvasRef.current ? canvasRef.current.width / 2 : 0,
                    y: canvasRef.current ? canvasRef.current.height / 2 : 0,
                    linkedWords: [],
                    isHovered: false,
                },
            });
            setWordNodesInit({
                "?": {
                    x: canvasRef.current ? canvasRef.current.width / 2 : 0,
                    y: canvasRef.current ? canvasRef.current.height / 2 : 0,
                    linkedWords: [],
                    isHovered: false,
                },
            });
        }
    }, [props]);

    useEffect(() => {
        if (sizeSet && canvasRef.current) {
            setCanvasDim(canvasRef.current.getBoundingClientRect());
            setCenterCursorButtonInfo({
                x: canvasRef.current.width - 200,
                y: canvasRef.current.height - 100,
                w: 150,
                h: 75,
                isHovered: false,
            });
        }
    }, [sizeSet]);

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0
        ) {
            displayNodes(wordNodes, canvasRef.current);
        }
    }, [wordNodes]);

    useEffect(() => {
        if (canvasRef.current) {
            if (!sizeSet) {
                canvasRef.current.style.width = "100%";
                canvasRef.current.style.height = "100%";
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight - 20;
                setSizeSet(true);
            }
        }
    }, [canvasRef]);

    const drawGUI = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.fill();
            ctx.rect(canvas.width - 200, canvas.height - 100, 150, 75);
            ctx.fillStyle = "#33BB55";
            ctx.fill();
            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Center", canvas.width - 190, canvas.height - 50);
            centerCursorButtonInfo.isHovered && ctx.stroke();
        }
    };

    const displayNodes = (
        inputNodes: Record<string, WordNode>,
        canvas: HTMLCanvasElement
    ) => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (Object.keys(inputNodes).length > 0) {
                ctx.fillStyle = "#5555DD";
                for (let [word, node] of Object.entries(inputNodes)) {
                    for (let subword of node.linkedWords) {
                        if (Object.hasOwn(inputNodes, subword)) {
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(
                                inputNodes[subword].x,
                                inputNodes[subword].y
                            );
                            ctx.stroke();
                        }
                    }
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, props.radius, 0, 2 * Math.PI);
                    node.isHovered
                        ? (ctx.fillStyle = "#44CCDD")
                        : (ctx.fillStyle = "#55AA88");

                    ctx.fill();
                    ctx.beginPath();
                    ctx.font = `${props.radius * 0.75}px Arial`;
                    ctx.fillStyle = "#5555DD";
                    ctx.fillText(
                        word,
                        +(node.x - ctx.measureText(word).width / 2),
                        node.y + props.radius / 5
                    );
                    ctx.fill();
                }
            }
        }
        drawGUI(canvas);
    };

    const dragCanvas = (offset: [number, number]) => {
        let nodes: Record<string, WordNode> = {};
        for (let [word, node] of Object.entries(wordNodes)) {
            nodes[word] = { ...node };
            nodes[word].x = node.x + offset[0];
            nodes[word].y = node.y + offset[1];
        }
        setWordNodes(nodes);
    };

    const zoomCanvas = (
        factor: number,
        cursor: [number, number],
        width: number,
        height: number
    ) => {
        let nodes: Record<string, WordNode> = {};
        for (let [word, node] of Object.entries(wordNodes)) {
            nodes[word] = { ...node };
            // nodes[word].x = node.x * factor + (cursor[0]-node.x) * factor;
            // nodes[word].y = node.y * factor + (cursor[1]-node.y) * factor;
            // nodes[word].x = (width / 2 - cursor[0])/(cursor[0]-node.x) + node.x;
            // nodes[word].y = (height / 2 - cursor[1])/(cursor[1]-node.y) + node.y;
            let r: number = getAmplitude([node.x, node.y], cursor);
            let θ: number = Math.atan2(cursor[1] - node.y, cursor[0] - node.x);
            nodes[word].x = node.x + factor * (r / width) * Math.cos(θ);
            nodes[word].y = node.y + factor * (r / width) * Math.sin(θ);
        }
        setWordNodes(nodes);
    };

    const highlightNodes = (cursorPos: [number, number]) => {
        let nodes: Record<string, WordNode> = {};
        let hasBeenHovered: boolean = false;
        for (let [word, node] of Object.entries(wordNodes)) {
            nodes[word] = { ...node };
            nodes[word].isHovered =
                !hasBeenHovered &&
                isInCircle(cursorPos, [node.x, node.y, props.radius]);
            if (nodes[word].isHovered) {
                hasBeenHovered = true;
            }
        }
        setWordNodes(nodes);
    };

    const hightlightGUI = (cursorPos: [number, number]) => {
        setCenterCursorButtonInfo((prev) => ({
            ...prev,
            isHovered: isInRect(cursorPos, [
                centerCursorButtonInfo.x,
                centerCursorButtonInfo.y,
                centerCursorButtonInfo.w,
                centerCursorButtonInfo.h,
            ]),
        }));
    };

    useEffect(() => {
        isCanvasClicked
            ? dragCanvas([
                  -cursorInfo.xOffset + cursorInfo.xPos,
                  -cursorInfo.yOffset + cursorInfo.yPos,
              ])
            : highlightNodes([cursorInfo.xPos, cursorInfo.yPos]);
        hightlightGUI([cursorInfo.xPos, cursorInfo.yPos]);
    }, [cursorInfo]);

    const handleMouseMove = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ): void => {
        if (canvasDim) {
            const x = e.clientX - canvasDim.left;
            const y = e.clientY - canvasDim.top;
            setCursorInfo((prevState) => ({
                xPos: x,
                yPos: y,
                xOffset: prevState.xPos,
                yOffset: prevState.yPos,
            }));
        }
    };
    const handleMouseUnclick = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsCanvasClicked(false);
    };

    const handleMouseClick = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsCanvasClicked(true);
    };

    const handleCursorCenter = () => {
        setWordNodes(wordNodesInit);
        setZoomFactor(1);
    };

    const handleZoom = (e: WheelEvent<HTMLCanvasElement>) => {
        //e.preventDefault();
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                let factor: number = e.deltaY;
                if (
                    (zoomFactor >= 0 && factor > 0) ||
                    (zoomFactor <= 0 && factor < 0)
                ) {
                    setZoomFactor(zoomFactor + factor);
                } else {
                    setZoomFactor(factor);
                }
            }
        }
    };

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0
        ) {
            zoomCanvas(
                zoomFactor,
                [cursorInfo.xPos, cursorInfo.yPos],
                canvasRef.current.width,
                canvasRef.current.height
            );
        }
    }, [zoomFactor]);

    return (
        <Box
            className="canvasBox"
            display="flex"
            flexDirection="column"
            flexGrow={1}
        >
            <Box
                flex={1}
                sx={{ border: "1px solid lightgrey", borderRadius: "5px" }}
            >
                <canvas
                    style={{ borderRadius: "5px" }}
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={(e) => {
                        handleMouseClick(e);
                    }}
                    onMouseUp={(e) => {
                        handleMouseUnclick(e);
                        isCanvasClicked &&
                            centerCursorButtonInfo.isHovered &&
                            handleCursorCenter();
                    }}
                    onMouseLeave={(e) => {
                        handleMouseUnclick(e);
                    }}
                    onMouseOut={(e) => {
                        handleMouseUnclick(e);
                    }}
                    onWheel={handleZoom}
                />
            </Box>
        </Box>
    );
}
