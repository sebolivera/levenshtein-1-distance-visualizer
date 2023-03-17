import { useTheme } from "@mui/material/styles";
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
import { isInRect } from "../utils/math";
import useDimensions from "../utils/useDimensions";
import { WordNode, CursorInfo } from "./Graph/logic/types";
import { RectButton } from "./Graph/UI/types";
import { createSubNode, zoomNodes } from "./Graph/logic";
import { drawNodes, dragCanvas, highlightNodes, zoomCanvas } from "./Graph/UI";

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
    const [wordNodesInit, setWordNodesInit] =
        useState<Record<string, WordNode>>(wordNodes);
    const theme = useTheme();
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
    let windowDimensions = useDimensions();

    //handlers

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
        setWordNodes(wordNodesInit); // technically not 100% following the flow, but it won't matter as the canvas is going to get re-rendered twice anyway.
        setZoomFactor(1);
    };

    const handleZoom = (e: WheelEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                setZoomFactor(zoomCanvas(e.deltaY, zoomFactor));
            }
        }
    };

    //hooks

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
                .get("/lev_dist/" + props.word + "/" + props.repeats)
                .then((res: Record<string, any>) => {
                    if (canvasRef.current) {
                        let nodes: Record<string, WordNode> = {
                            [props.word]: {
                                x: canvasRef.current.width / 2,
                                y: canvasRef.current.height / 2,
                                linkedWords: Object.keys(res.data),
                                isHovered: false,
                            },
                        };
                        if (Object.keys(res.data).length > 0) {
                            for (let word of Object.keys(res.data)) {
                                //generates the immediate nodes found
                                nodes[word] = {
                                    x: 0,
                                    y: 0,
                                    linkedWords: res.data[word],
                                    isHovered: false,
                                };
                            }

                            for (let [word, node] of Object.entries(nodes)) {
                                //gets the "end" nodes, I.e. the words that were at the very end of the given number for the levenshtein distance
                                for (let subWord of node.linkedWords) {
                                    createSubNode(subWord, word, res.data);
                                }
                            }
                            console.log("Nodes done!", nodes);
                            // setWordNodes(nodes);
                            // setWordNodesInit(nodes);
                        }
                    }
                });
        }
    }, [props, windowDimensions]);

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
        setSizeSet(true);
    }, [windowDimensions]);

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0
        ) {
            drawNodes(
                wordNodes,
                canvasRef.current,
                centerCursorButtonInfo,
                theme,
                props.radius
            );
        }
    }, [wordNodes, props.radius, theme]);

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

    const highlightCenterCursorButton = (cursorPos: [number, number]) => {
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
            ? setWordNodes(
                  dragCanvas(
                      [
                          -cursorInfo.xOffset + cursorInfo.xPos,
                          -cursorInfo.yOffset + cursorInfo.yPos,
                      ],
                      wordNodes
                  )
              )
            : setWordNodes(
                  highlightNodes(
                      [cursorInfo.xPos, cursorInfo.yPos],
                      wordNodes,
                      props.radius
                  )
              );
        highlightCenterCursorButton([cursorInfo.xPos, cursorInfo.yPos]);
    }, [cursorInfo]);

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0
        ) {
            setWordNodes(
                zoomNodes(
                    zoomFactor,
                    [cursorInfo.xPos, cursorInfo.yPos],
                    canvasRef.current.width,
                    wordNodes
                )
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
                <Box
                    className="CenterButtonTooltipHandler"
                    sx={{
                        p: 0,
                        float: "right",
                        mt: `${-centerCursorButtonInfo.h - 33}px`, //have to figure out where that 38 comes from...
                        mr: "50px",
                        height: centerCursorButtonInfo.h,
                        width: centerCursorButtonInfo.w,
                        // border: "1px solid yellow", //will be used to display a tooltip whenever I manage to make this work...
                    }}
                ></Box>
            </Box>
        </Box>
    );
}
